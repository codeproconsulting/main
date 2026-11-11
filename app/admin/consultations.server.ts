import { createHash } from "node:crypto";
import { AppwriteError, createDocument, getDocument, listDocuments, query } from "~/lib/appwrite.server";
import { allow, field, leadFor, serialized, staffAccessLock } from "./crm.server";
import { canManage, canUseCRM, type Lead, type Staff } from "./domain";

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

export async function consultationStaff() {
  const staff: Staff[] = [];
  let cursor: string | undefined;
  do {
    const { documents } = await listDocuments<Staff>("staff", [
      query("select", undefined, ["$id", "name", "role", "active"]),
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
  const [history, people] = await Promise.all([
    listConsultations([query("equal", "leadId", [leadId])], page),
    canManage(staff) ? consultationStaff() : Promise.resolve([staff]),
  ]);
  return {
    lead: { id: lead.$id, name: lead.name, country: lead.country },
    history,
    people: people.filter(person => person.active && canUseCRM(person)).map(person => ({ id: person.$id, name: person.name })),
    manager: canManage(staff),
  };
}

export async function recordConsultation(staff: Staff, leadId: string, form: FormData) {
  allow(staff.active && canUseCRM(staff));
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
    allow(actor.active && canUseCRM(actor));
    await leadFor(actor, leadId);
    const counselor = canManage(actor) ? field(form, "counselor", 36) : actor.$id;
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
  allow(staff.active && canManage(staff));
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
  const [history, people] = await Promise.all([listConsultations(filters, page), consultationStaff()]);
  const names = new Map<string, string>();
  const ids = [...new Set(history.documents.map(row => row.leadId))];
  if (ids.length) {
    const leads = await listDocuments<Pick<Lead, "name">>("leads", [
      query("equal", "$id", ids), query("select", undefined, ["$id", "name"]), query("limit", undefined, [ids.length]),
    ]);
    for (const lead of leads.documents) names.set(lead.$id, lead.name);
  }
  return {
    history: history.documents.map(row => ({ ...row, leadName: names.get(row.leadId) })),
    total: history.total, page, destination, counselor,
    people: people.map(person => ({ id: person.$id, name: person.name })),
  };
}
