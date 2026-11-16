import { listDocuments, query } from "~/lib/appwrite.server";
import { allow } from "./crm.server";
import { canManageStaff } from "./team.server";
import type { Staff } from "./domain";

const queueStates = ["queued", "accepted", "failed", "review", "suppressed"];
const eventKinds = ["email.delivered", "email.bounced", "email.complained"];
type QueueRow = { $id: string; status: string; attempts: number; nextAt: string; providerId: string };
type EventRow = { $id: string; kind: string; occurredAt: string; providerId: string };

export async function emailDeliveryOverview(staff: Staff) {
  allow(canManageStaff(staff));
  const count = async (collection: string, field: string, value: string) => (await listDocuments(collection, [
    query("equal", field, [value]), query("select", undefined, ["$id"]), query("limit", undefined, [1]),
  ])).total;
  const [queueCounts, eventCounts, outbox, events] = await Promise.all([
    Promise.all(queueStates.map(async state => ({ state, total: await count("email_outbox", "status", state) }))),
    Promise.all(eventKinds.map(async state => ({ state, total: await count("email_events", "kind", state) }))),
    listDocuments<QueueRow>("email_outbox", [
      query("select", undefined, ["$id", "status", "attempts", "nextAt", "providerId"]),
      query("orderDesc", "$createdAt"), query("limit", undefined, [25]),
    ]),
    listDocuments<EventRow>("email_events", [
      query("select", undefined, ["$id", "kind", "occurredAt", "providerId"]),
      query("orderDesc", "$createdAt"), query("limit", undefined, [25]),
    ]),
  ]);
  return {
    queueCounts, eventCounts,
    outbox: outbox.documents.map(({ $id, status, attempts, nextAt, providerId }) => ({ $id, status, attempts, nextAt, providerId })),
    events: events.documents.map(({ $id, kind, occurredAt, providerId }) => ({ $id, kind, occurredAt, providerId })),
  };
}
