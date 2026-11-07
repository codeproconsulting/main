import { listDocuments, query } from "~/lib/appwrite.server";

export type Appointment = {
  $id: string;
  leadId: string;
  owner: string;
  title: string;
  startsAt: string;
  endsAt: string;
  status: string;
  location: string;
  notes: string;
  version: number;
};

export const appointmentCalendarLock = "calendar:appointments";

export async function* appointmentPages(attribute: "owner" | "leadId", value: string) {
  let cursor: string | undefined;
  do {
    const filters = [query("equal", attribute, [value]), query("orderAsc", "$id"), query("limit", undefined, [100])];
    if (cursor) filters.push(query("cursorAfter", undefined, [cursor]));
    const { documents } = await listDocuments<Appointment>("appointments", filters);
    yield documents;
    cursor = documents.length === 100 ? documents[99].$id : undefined;
  } while (cursor);
}

export function appointmentTime(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:[0-5]\d)$/.test(value)) {
    throw new Response("Enter a date and time with a timezone.", { status: 400 });
  }
  const date = new Date(value.slice(0, 10));
  const time = new Date(value);
  if (!Number.isFinite(date.getTime()) || !Number.isFinite(time.getTime()) || date.toISOString().slice(0, 10) !== value.slice(0, 10)) {
    throw new Response("Enter a valid calendar date and time.", { status: 400 });
  }
  return time.toISOString();
}

type Slot = Pick<Appointment, "startsAt" | "endsAt">;
function bounds(slot: Slot) {
  const start = Date.parse(slot.startsAt);
  const end = Date.parse(slot.endsAt);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    throw new Response("A booked appointment has invalid times. Reconcile its schedule before proceeding.", { status: 409 });
  }
  return { start, end };
}

// Call only while holding the shared calendar lock. An ending slot does not occupy the next slot's start.
export async function assertCalendarAvailable(owner: string, slots: Slot[], excludedIds: ReadonlySet<string>) {
  if (!slots.length) return;
  const requested = slots.map(bounds).sort((a, b) => a.start - b.start);
  if (requested.some((slot, index) => index > 0 && requested[index - 1].end > slot.start)) {
    throw new Response("Linked appointments overlap. Resolve their times before reassignment.", { status: 409 });
  }
  for await (const page of appointmentPages("owner", owner)) {
    for (const appointment of page) {
      if (appointment.status !== "Booked" || excludedIds.has(appointment.$id)) continue;
      const existing = bounds(appointment);
      if (requested.some(slot => slot.start < existing.end && existing.start < slot.end)) {
        throw new Response("This counselor already has an appointment during that time.", { status: 409 });
      }
    }
  }
}

export async function appointmentsForHandoff(leadId: string, owner: string) {
  const linked: Appointment[] = [];
  for await (const page of appointmentPages("leadId", leadId)) linked.push(...page);
  const booked = linked.filter(appointment => appointment.status === "Booked");
  if (booked.length && !owner) {
    throw new Response("Cancel or finish the lead’s booked appointments before removing its counselor.", { status: 400 });
  }
  await assertCalendarAvailable(owner, booked, new Set(linked.map(appointment => appointment.$id)));
  return linked;
}
