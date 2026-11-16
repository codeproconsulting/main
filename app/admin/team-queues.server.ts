import { listDocuments, query } from "~/lib/appwrite.server";
import { allow } from "./crm.server";
import { isRestrictedManager, type Staff } from "./domain";
import { requireActiveTeam } from "./team-scope.server";

const pageSize = 25;
const parentBatch = 50;
// shortcut: scan at most 500 team enquiries, add an indexed linked-work team projection before raising this limit.
const parentLimit = 500;
const queueFields = {
  consultations: ["$id", "leadId", "counselor", "counselorName", "destination", "heldOn"],
  tasks: ["$id", "leadId", "title", "dueAt", "version"],
  cases: ["$id", "leadId", "kind", "institution", "course", "stage", "country", "intake", "deadline", "version"],
  appointments: ["$id", "leadId", "title", "status", "startsAt", "endsAt", "version"],
} as const;
type Collection = keyof typeof queueFields;

export async function teamQueue<T extends { $id: string; leadId: string }>(staff: Staff, collection: Collection, after: string, filters: string[] = []) {
  allow(staff.active && isRestrictedManager(staff));
  if (after && !/^[a-z0-9][a-z0-9._-]{0,35}$/i.test(after)) throw new Response("Invalid queue cursor.", { status: 400 });
  await requireActiveTeam(staff);
  const team = query("equal", "teamId", [staff.teamId]);
  const parentIds: string[] = [];
  let cursor: string | undefined;
  do {
    const { documents, total } = await listDocuments<{ $id: string }>("leads", [
      team, query("select", undefined, ["$id"]), query("orderAsc", "$id"), query("limit", undefined, [100]),
      ...(cursor ? [query("cursorAfter", undefined, [cursor])] : []),
    ]);
    if (total > parentLimit || parentIds.length + documents.length > parentLimit) {
      throw new Response("This team has too many enquiries for the linked work queue. Use Leads & enquiries.", { status: 503 });
    }
    parentIds.push(...documents.map(row => row.$id));
    const next = documents.length === 100 ? documents.at(-1)?.$id : undefined;
    if (next && next === cursor) throw new Response("Could not advance the linked work queue.", { status: 503 });
    cursor = next;
  } while (cursor);

  const candidates: T[] = [];
  for (let start = 0; start < parentIds.length; start += parentBatch * 4) {
    const batches = [0, 1, 2, 3]
      .map(index => parentIds.slice(start + parentBatch * index, start + parentBatch * (index + 1)))
      .filter(ids => ids.length);
    const results = await Promise.all(batches.map(ids => listDocuments<T>(collection, [
      ...filters, query("select", undefined, [...queueFields[collection]]), query("equal", "leadId", ids),
      ...(collection === "tasks" ? [query("equal", "status", ["Open"])] : []),
      ...(after ? [query("greaterThan", "$id", [after])] : []),
      query("orderAsc", "$id"), query("limit", undefined, [pageSize + 1]),
    ])));
    candidates.push(...results.flatMap(result => result.documents));
  }
  candidates.sort((a, b) => a.$id < b.$id ? -1 : a.$id > b.$id ? 1 : 0);
  const first = candidates.slice(0, pageSize + 1);
  if (!first.length) return { records: [], next: "" };
  // Team classification may have changed while linked records were loading.
  const { documents } = await listDocuments<{ $id: string }>("leads", [
    team, query("equal", "$id", [...new Set(first.map(row => row.leadId))]),
    query("select", undefined, ["$id"]), query("limit", undefined, [pageSize + 1]),
  ]);
  const allowed = new Set(documents.map(row => row.$id));
  const visible = first.filter(row => allowed.has(row.leadId));
  const records = visible.slice(0, pageSize);
  return { records, next: visible.length > pageSize ? records.at(-1)!.$id : "" };
}
