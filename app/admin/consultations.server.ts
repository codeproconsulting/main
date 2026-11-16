import { requireActiveTeam } from "./team-scope.server";
import { teamQueue } from "./team-queues.server";
import { createHash } from "node:crypto";
import { AppwriteError, createDocument, getDocument, listDocuments, query } from "~/lib/appwrite.server";
import { allow, field, leadFor, writableEnquiry, serialized, staffAccessLock } from "./crm.server";
import { canManage, canUseCRM, isRestrictedManager, type Lead, type Staff } from "./domain";

type Consultation = {
  $id: string;
  leadId: string;
  counselor: string;
  counselorName: string;
  destination: string;
  destinationKey: string;
  heldOn: string;
  recordedBy: string;
};
const collection = "consultations";
export const consultationPageSize = 25;

function destinationKey(value: string) {
  return value.normalize("NFKC").trim().replace(/\s+/gu, " ").toLowerCase();
}

export async function consultationStaff(teamId?: string) {
  const staff: Staff[] = [];
  let cursor: string | undefined;
  do {
    const { documents } = await listDocuments<Staff>("staff", [
      query("select", undefined, ["$id", "name", "role", "active"]),
      ...(teamId ? [query("equal", "teamId", [teamId])] : []),
      query("orderAsc", "$id"), query("limit", undefined, [100]),
      ...(cursor ? [query("cursorAfter", undefined, [cursor])] : []),
    ]);
    staff.push(...documents);
    const next = documents.length === 100 ? documents.at(-1)?.$id : undefined;
    if (next && next === cursor) throw new Response("Could not load staff.", { status: 503 });
    cursor = next;
  } while (cursor);
  return staff.sort((a, b) => a.name.localeCompare(b.name));
}

async function listConsultations(filters: string[], page: number) {
  return listDocuments<Consultation>(collection, [
    ...filters, query("orderDesc", "heldOn"), query("orderDesc", "$id"),
    query("limit", undefined, [consultationPageSize]),
    query("offset", undefined, [(page - 1) * consultationPageSize]),
  ]);
}

export function consultationPage(params: URLSearchParams) {
  const page = Number(params.get("page"));
  return Number.isSafeInteger(page) && page > 0 ? Math.min(page, 10_000) : 1;
}

export async function leadConsultations(staff: Staff, leadId: string, page: number) {
  allow(staff.active && canUseCRM(staff));
  const lead = await leadFor(staff, leadId);
  const teamScoped = isRestrictedManager(staff);
  const [history, people] = await Promise.all([
    listConsultations([query("equal", "leadId", [leadId])], page),
    teamScoped ? consultationStaff(staff.teamId) : canManage(staff) ? consultationStaff() : Promise.resolve([staff]),
  ]);
  if (teamScoped) await leadFor(staff, leadId);
  return {
    teamScoped,
    lead: { id: lead.$id, name: lead.name, country: lead.country },
    history: teamScoped ? { total: history.total, documents: history.documents.map(({ $id, destination, counselorName, heldOn }) => ({ $id, destination, counselorName, heldOn })) } : history,
    people: people.filter(person => person.active && (teamScoped ? person.role === "counselor" : canUseCRM(person))).map(person => ({ id: person.$id, name: person.name })),
    manager: canManage(staff),
  };
}

export async function recordConsultation(staff: Staff, leadId: string, form: FormData) {
  allow(staff.active && canUseCRM(staff));
  const teamScoped = isRestrictedManager(staff);
  if (teamScoped) await leadFor(staff, leadId);
  const token = field(form, "submissionId", 36);
  const destination = field(form, "destination", 100).normalize("NFKC").replace(/\s+/gu, " ").trim();
  const key = destinationKey(destination);
  const heldOn = field(form, "heldOn", 10);
  const parsed = new Date(heldOn + "T00:00:00Z");
  const today = new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString().slice(0, 10);
  if (!key || destination.length > 150 || key.length > 100 || !/^\d{4}-\d{2}-\d{2}$/.test(heldOn) ||
      !Number.isFinite(+parsed) || parsed.toISOString().slice(0, 10) !== heldOn || heldOn > today ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token)) {
    throw new Response("Enter a destination and a valid consultation date on or before today.", { status: 400 });
  }
  return serialized(`lead:${leadId}`, () => serialized(staffAccessLock, async () => {
    const actor = await getDocument<Staff>("staff", staff.$id);
    allow(actor.active && canUseCRM(actor) && isRestrictedManager(actor) === teamScoped);
    if (teamScoped) {
      allow(actor.teamId === staff.teamId);
      await requireActiveTeam(actor);
    }
    await writableEnquiry(actor, leadId);
    const counselor = (teamScoped || canManage(actor)) ? field(form, "counselor", 36) : actor.$id;
    if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,35}$/.test(counselor)) {
      throw new Response("Choose the counselor who held the consultation.", { status: 400 });
    }
    const id = createHash("sha256").update(`consultation:${actor.$id}:${leadId}:${token.toLowerCase()}`).digest("hex").slice(0, 36);
    const sameRecord = (row: Consultation) => row.leadId === leadId && row.counselor === counselor &&
      row.destinationKey === key && row.heldOn === heldOn && row.recordedBy === actor.$id;
    let person: Staff;
    try {
      person = counselor === actor.$id ? actor : await getDocument<Staff>("staff", counselor);
    } catch (error) {
      if (error instanceof AppwriteError && error.status === 404) throw new Response("Choose an active counselor.", { status: 400 });
      throw error;
    }
    if (teamScoped && (person.role !== "counselor" || person.teamId !== actor.teamId)) {
      throw new Response("Choose an active counselor from your team.", { status: 400 });
    }
    if (!person.active || !canUseCRM(person)) throw new Response("Choose an active counselor.", { status: 400 });
    try {
      return await createDocument(collection, {
        leadId, counselor, counselorName: person.name, destination, destinationKey: key, heldOn, recordedBy: actor.$id,
      }, id);
    } catch (error) {
      const saved = await getDocument<Consultation>(collection, id).catch(() => null);
      if (saved && sameRecord(saved)) return saved;
      if (saved) throw new Response("This form already recorded a consultation. Open a fresh form to record another.", { status: 409 });
      throw error;
    }
  }));
}

export async function consultationReport(staff: Staff, params: URLSearchParams) {
  const teamScoped = isRestrictedManager(staff);
  allow(staff.active && (canManage(staff) || teamScoped));
  const destination = (params.get("destination") ?? "").trim().slice(0, 100);
  const key = destinationKey(destination);
  const counselor = params.get("counselor") ?? "";
  if (key.length > 100 || (counselor && !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,35}$/.test(counselor))) {
    throw new Response("Invalid consultation filter.", { status: 400 });
  }
  const filters: string[] = [];
  if (key) filters.push(query("equal", "destinationKey", [key]));
  if (counselor) filters.push(query("equal", "counselor", [counselor]));
  const page = consultationPage(params);
  const from = params.get("from") ?? "";
  const through = params.get("through") ?? "";
  for (const value of [from, through]) {
    if (!value) continue;
    const date = new Date(value + "T00:00:00Z");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(+date) || date.toISOString().slice(0, 10) !== value) {
      throw new Response("Invalid consultation date.", { status: 400 });
    }
  }
  if (from && through && from > through) throw new Response("Invalid consultation date range.", { status: 400 });
  if (from) filters.push(query("greaterThanEqual", "heldOn", [from]));
  if (through) filters.push(query("lessThanEqual", "heldOn", [through]));
  const after = teamScoped ? params.get("after") ?? "" : "";
  const scoped = teamScoped ? await teamQueue<Consultation>(staff, collection, after, filters) : null;
  const history = scoped ? { documents: scoped.records, total: scoped.records.length } : await listConsultations(filters, page);
  const people = await consultationStaff(teamScoped ? staff.teamId : undefined);
  const names = new Map<string, string>();
  const ids = [...new Set(history.documents.map(row => row.leadId))];
  if (ids.length) {
    const leads = await listDocuments<Pick<Lead, "name">>("leads", [
      ...(teamScoped ? [query("equal", "teamId", [staff.teamId])] : []),
      query("equal", "$id", ids), query("select", undefined, ["$id", "name"]), query("limit", undefined, [ids.length]),
    ]);
    for (const lead of leads.documents) names.set(lead.$id, lead.name);
  }
  const visible = teamScoped ? history.documents.filter(row => names.has(row.leadId)) : history.documents;
  return {
    history: visible.map(row => ({ ...row, leadName: names.get(row.leadId) })),
    total: history.total, page, destination, counselor, from, through, teamScoped, after,
    next: scoped?.next === visible.at(-1)?.$id ? scoped?.next ?? "" : "",
    people: people.map(person => ({ id: person.$id, name: person.name })),
  };
}
