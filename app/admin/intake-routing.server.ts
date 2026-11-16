import { getDocument, listDocuments, query } from "~/lib/appwrite.server";
import { allow, UnconfirmedMutation } from "./crm.server";
import { canManage, type Lead, type Staff } from "./domain";
import { routeEnquiry } from "./lead-routing.server";

export async function routeIntakePage(actorId: string, cursor?: string, signal?: AbortSignal) {
  const result = { assigned: 0, deferred: 0, failed: 0, cursor };
  if (signal?.aborted) return result;
  const actor = await getDocument<Staff>("staff", actorId);
  allow(actor.active && canManage(actor));
  const limit = 5;
  const { documents } = await listDocuments<Pick<Lead, "$id" | "version">>("leads", [
    query("select", undefined, ["$id", "version"]),
    query("equal", "intakeRouting", ["pending"]),
    query("equal", "owner", [""]),
    query("equal", "stage", ["New"]),
    query("orderAsc", "$id"),
    query("limit", undefined, [limit]),
    ...(cursor ? [query("cursorAfter", undefined, [cursor])] : []),
  ]);
  for (const lead of documents) {
    if (signal?.aborted) return result;
    const form = new FormData();
    form.set("version", String(lead.version));
    form.set("reason", "Automatic website intake routing");
    try {
      await routeEnquiry(actor, lead.$id, form, true);
      result.assigned++;
    } catch (error) {
      if (error instanceof UnconfirmedMutation) {
        result.failed++;
        return result;
      }
      if (error instanceof Response && [400, 404, 409].includes(error.status)) result.deferred++;
      else result.failed++;
    }
  }
  result.cursor = documents.length === limit ? documents.at(-1)?.$id : undefined;
  return result;
}
