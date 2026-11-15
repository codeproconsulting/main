import { getDocument, listDocuments, query, updateDocument } from "~/lib/appwrite.server";
import { allow, audit, definitiveWriteRejection, field, serialized, staffAccessLock, UnconfirmedMutation, updateLead } from "./crm.server";
import { canManage, closureStages, stages, type Staff } from "./domain";

const activeStages = stages.filter(stage => stage !== "Converted" && !closureStages.some(closed => closed === stage));

export async function saveRoutingSettings(staff: Staff, form: FormData) {
  allow(staff.active && canManage(staff));
  const counselorId = field(form, "counselor", 36);
  const capacity = field(form, "capacity", 3);
  const availability = field(form, "availability", 12);
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,35}$/.test(counselorId) ||
      !/^(?:[1-9][0-9]?|100)$/.test(capacity) || !["available", "paused"].includes(availability)) {
    throw new Response("Choose a counselor, availability and capacity from 1 to 100.", { status: 400 });
  }
  return serialized(staffAccessLock, async () => {
    const actor = await getDocument<Staff>("staff", staff.$id);
    allow(actor.active && canManage(actor));
    const counselor = await getDocument<Staff>("staff", counselorId);
    if (!counselor.active || counselor.role !== "counselor") {
      throw new Response("Choose an active counselor.", { status: 400 });
    }
    const changes = { routingAvailability: availability, routingCapacity: capacity };
    await audit(actor, counselorId, "staff", "Routing settings change requested", changes);
    try {
      await updateDocument("staff", counselorId, changes);
    } catch (error) {
      if (definitiveWriteRejection(error)) throw error;
      throw new UnconfirmedMutation("The routing settings may have saved. Ask an administrator to reconcile them before retrying.");
    }
  });
}

export function routeEnquiry(staff: Staff, id: string, form: FormData) {
  allow(staff.active && canManage(staff));
  return updateLead(staff, id, form, "bulk", async lead => {
    if (lead.owner || !activeStages.some(stage => stage === lead.stage)) {
      throw new Response("Round robin requires an unassigned enquiry in an active stage.", { status: 409 });
    }
    const [roster, history] = await Promise.all([
      listDocuments<Staff>("staff", [
        query("equal", "active", [true]), query("equal", "role", ["counselor"]), query("limit", undefined, [100]),
      ]),
      listDocuments<{ routedAt?: string; routedCounselor?: string }>("leads", [
        query("select", undefined, ["routedAt", "routedCounselor"]),
        query("orderDesc", "routedAt"), query("limit", undefined, [1]),
      ]),
    ]);
    if (roster.total > 100) throw new Response("Round robin supports up to 100 active counselors.", { status: 503 });
    const last = history.documents[0];
    const candidates = roster.documents
      .filter(row => row.routingAvailability === "available" && /^(?:[1-9][0-9]?|100)$/.test(row.routingCapacity ?? ""))
      .sort((a, b) => a.$id < b.$id ? -1 : a.$id > b.$id ? 1 : 0);
    const start = candidates.findIndex(row => row.$id > (last?.routedCounselor ?? ""));
    const split = Math.max(0, start);
    const ordered = [...candidates.slice(split), ...candidates.slice(0, split)];
    for (let offset = 0; offset < ordered.length; offset += 8) {
      const chunk = ordered.slice(offset, offset + 8);
      const workloads = await Promise.all(chunk.map(counselor => listDocuments("leads", [
        query("equal", "owner", [counselor.$id]), query("equal", "stage", [...activeStages]), query("limit", undefined, [1]),
      ])));
      const next = chunk.find((counselor, index) => workloads[index].total < Number(counselor.routingCapacity));
      if (next) {
        const nextTime = Math.max(Date.now(), (Date.parse(last?.routedAt ?? "") || 0) + 1);
        return { routedCounselor: next.$id, routedAt: new Date(nextTime).toISOString() };
      }
    }
    throw new Response("No available counselors have capacity for this enquiry.", { status: 409 });
  });
}
