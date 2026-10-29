import { createHash, randomUUID } from "node:crypto";
import { AppwriteError, appwrite, createDocument, getDocument, listDocuments, query, updateDocument } from "~/lib/appwrite.server";
import { canAccessLead, canManage, canUseCRM, stages, type Activity, type Lead, type Staff, type Task } from "./domain";

export function allow(condition: boolean) { if (!condition) throw new Response("Access denied", { status: 403 }); }
export function field(form: FormData, name: string, max = 1000) {
  const value = form.get(name);
  if (value !== null && typeof value !== "string") throw new Response("Invalid field", { status: 400 });
  const result = (value ?? "").trim();
  if (result.length > max) throw new Response(`${name} is too long`, { status: 400 });
  return result;
}
export function dateField(value: string) {
  if (!value) return "";
  if (!/(Z|[+-]\d\d:\d\d)$/.test(value) || Number.isNaN(Date.parse(value))) throw new Response("A date with timezone is required", { status: 400 });
  return new Date(value).toISOString();
}
export async function audit(staff: Staff, entityId: string, entityType: string, event: string, details: unknown) {
  return createDocument("activities", { actor: staff.$id, entityId, entityType, event, details: JSON.stringify(details) });
}
export async function listStaff() { return (await listDocuments<Staff>("staff", [query("equal", "active", [true]), query("limit", undefined, [100])])).documents; }
export async function leadsFor(staff: Staff, search = "", stage = "", page = 1) {
  allow(canUseCRM(staff));
  const queries = [query("orderDesc", "$createdAt"), query("limit", undefined, [25]), query("offset", undefined, [(page - 1) * 25])];
  if (!canManage(staff)) queries.push(query("equal", "owner", [staff.$id]));
  if (stage && stages.includes(stage as typeof stages[number])) queries.push(query("equal", "stage", [stage]));
  if (search) queries.push(query("search", "name", [search.slice(0, 100)]));
  return listDocuments<Lead>("leads", queries);
}
export async function leadFor(staff: Staff, id: string) {
  allow(canUseCRM(staff));
  let lead;
  try { lead = await getDocument<Lead>("leads", id); } catch (error) { if (error instanceof AppwriteError && error.status === 404) throw new Response("Lead not found", { status: 404 }); throw error; }
  allow(canAccessLead(staff, lead));
  return lead;
}
export async function tasksFor(staff: Staff) {
  allow(canUseCRM(staff));
  const filters = [query("equal", "status", ["Open"]), query("orderAsc", "dueAt"), query("limit", undefined, [100])];
  if (!canManage(staff)) filters.push(query("equal", "owner", [staff.$id]));
  const tasks = (await listDocuments<Task>("tasks", filters)).documents;
  // Assignment changes can leave task-owner metadata awaiting reconciliation. Never expose a task unless its lead is still in scope.
  if (canManage(staff)) return tasks;
  const checked = await Promise.all(tasks.map(async task => {
    try { const lead = await getDocument<Lead>("leads", task.leadId); return canAccessLead(staff, lead) ? task : null; }
    catch (error) { if (error instanceof AppwriteError && error.status === 404) return null; throw error; }
  }));
  return checked.filter((task): task is Task & { $createdAt: string; $updatedAt: string } => task !== null);
}
// Serialize mutations within the documented single dashboard process. Distributed CAS requires version-specific Appwrite transactions.
const mutations = new Map<string, Promise<unknown>>();
export async function serialized<T>(key: string, operation: () => Promise<T>): Promise<T> {
  const previous = mutations.get(key) ?? Promise.resolve();
  const pending = previous.catch(() => undefined).then(async () => {
    if (process.env.NODE_ENV === "test") return operation();
    const id = createHash("sha256").update(key).digest("hex").slice(0, 32);
    try { await createDocument("locks", { key, owner: randomUUID(), acquiredAt: new Date().toISOString() }, id); }
    catch (error) { if (error instanceof AppwriteError && error.status === 409) throw new Response("This record is being updated. Retry shortly; contact an administrator if it remains locked.", { status: 409 }); throw error; }
    try { return await operation(); }
    finally { await appwrite(`/databases/${encodeURIComponent(process.env.APPWRITE_DATABASE_ID!)}/collections/locks/documents/${id}`, { method: "DELETE" }); }
  });
  mutations.set(key, pending);
  try { return await pending; } finally { if (mutations.get(key) === pending) mutations.delete(key); }
}
export async function updateLead(staff: Staff, id: string, form: FormData) {
  return serialized(`lead:${id}`, async () => {
    const lead = await leadFor(staff, id);
    if (Number(field(form, "version")) !== lead.version) throw new Response("This lead changed. Refresh before saving.", { status: 409 });
    const stage = field(form, "stage");
    if (!stages.includes(stage as typeof stages[number])) throw new Response("Invalid stage", { status: 400 });
    const priority = field(form, "priority");
    if (!["Normal", "High", "Urgent"].includes(priority)) throw new Response("Invalid priority", { status: 400 });
    const owner = canManage(staff) ? field(form, "owner", 36) : lead.owner;
    if (owner) {
      const assignee = await getDocument<Staff>("staff", owner);
      allow(assignee.active && canUseCRM(assignee));
    }
    const reason = field(form, "reason", 2000);
    if ((["Lost", "Not eligible", "Archived"].includes(stage) && stage !== lead.stage) || owner !== lead.owner) {
      if (!reason) throw new Response("A reason is required for closure or reassignment.", { status: 400 });
    }
    const changes = { stage, owner, priority, nextFollowUp: dateField(field(form, "nextFollowUp")), version: lead.version + 1 };
    // Record intent before mutation; an unavailable audit store prevents unaudited writes.
    const event = await audit(staff, id, "lead", "Lead update requested", { before: { stage: lead.stage, owner: lead.owner, priority: lead.priority, nextFollowUp: lead.nextFollowUp }, after: changes, reason, state: "pending" });
    if (owner !== lead.owner) {
      let cursor: string | undefined;
      do {
        const page = await listDocuments<Task>("tasks", [query("equal", "leadId", [id]), query("equal", "status", ["Open"]), query("limit", undefined, [100]), ...(cursor ? [query("cursorAfter", undefined, [cursor])] : [])]);
        for (const task of page.documents) await updateDocument<Task>("tasks", task.$id, { owner, version: task.version + 1 });
        cursor = page.documents.length === 100 ? page.documents[99].$id : undefined;
      } while (cursor);
    }
    const updated = await updateDocument<Lead>("leads", id, changes);
    await updateDocument("activities", event.$id, { event: "Lead updated" });
    return updated;
  });
}
export async function addNote(staff: Staff, id: string, note: string) {
  await leadFor(staff, id);
  if (!note) throw new Response("Write a note first", { status: 400 });
  return audit(staff, id, "lead", "Note added", { note });
}
export async function createTask(staff: Staff, id: string, form: FormData) {
  return serialized(`lead:${id}`,async()=>{
    const lead = await leadFor(staff, id);
    const title = field(form, "title", 300),dueAt = dateField(field(form, "dueAt"));
    if (!title || !dueAt || !lead.owner) throw new Response("Assign this lead and enter a task title and due date.", { status: 400 });
    const assignee=await getDocument<Staff>("staff",lead.owner);allow(assignee.active&&canUseCRM(assignee));
    const taskId=randomUUID();
    const event=await audit(staff,id,"lead","Follow-up creation requested",{state:"pending",taskId,title,dueAt});
    const task=await createDocument("tasks",{leadId:id,title,dueAt,owner:lead.owner,status:"Open",outcome:"",version:1},taskId);
    await updateDocument("activities",event.$id,{event:"Follow-up created",details:JSON.stringify({state:"completed",taskId,title,dueAt})});
    return task;
  });
}
export async function changeTask(staff:Staff,id:string,intent:string,expectedVersion:string,outcome:string,dueAt=""){
  allow(canUseCRM(staff));
  const initial=await getDocument<Task>("tasks",id);
  return serialized(`lead:${initial.leadId}`,async()=>{
    const task=await getDocument<Task>("tasks",id);
    allow(task.leadId===initial.leadId);
    const lead=await leadFor(staff,task.leadId);
    allow(canManage(staff)||(task.owner===staff.$id&&lead.owner===staff.$id));
    if(!expectedVersion||Number(expectedVersion)!==task.version||task.status!=="Open")throw new Response("This follow-up changed. Refresh before saving.",{status:409});
    if(!["complete","cancel","reschedule"].includes(intent))throw new Response("Unknown follow-up action",{status:400});
    if(!outcome.trim()||outcome.length>2000)throw new Response("Record an outcome or change reason (up to 2000 characters).",{status:400});
    const nextDue=intent==="reschedule"?dateField(dueAt):task.dueAt;
    if(!nextDue)throw new Response("Enter a due date with timezone.",{status:400});
    const changes={status:intent==="complete"?"Completed":intent==="cancel"?"Cancelled":"Open",dueAt:nextDue,outcome:outcome.trim(),version:task.version+1};
    const event=await audit(staff,task.leadId,"lead","Follow-up change requested",{state:"pending",taskId:id,intent,before:{status:task.status,dueAt:task.dueAt,version:task.version},after:changes});
    const updated=await updateDocument<Task>("tasks",id,changes);
    await updateDocument("activities",event.$id,{event:intent==="complete"?"Follow-up completed":intent==="cancel"?"Follow-up cancelled":"Follow-up rescheduled",details:JSON.stringify({state:"completed",taskId:id,intent,after:changes})});
    return updated;
  });
}
export async function completeTask(staff:Staff,id:string,outcome:string,expectedVersion:string){return changeTask(staff,id,"complete",expectedVersion,outcome);}
export async function activityFor(id: string) {
  return (await listDocuments<Activity>("activities", [query("equal", "entityId", [id]), query("orderDesc", "$createdAt"), query("limit", undefined, [100])])).documents;
}
