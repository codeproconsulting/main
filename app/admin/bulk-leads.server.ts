import { allow, field, updateLead } from "./crm.server";
import { canManage, bulkLeadLimit, priorities, stages, type Staff } from "./domain";

export async function bulkUpdateLeads(staff: Staff, form: FormData) {
  allow(staff.active && canManage(staff));
  const stage = field(form, "bulkStage", 50);
  const priority = field(form, "bulkPriority", 20);
  const assignee = field(form, "bulkOwner", 36);
  const reason = field(form, "reason", 2000);
  if ((!stage && !priority && !assignee) || (stage && !stages.some(value => value === stage)) ||
      (priority && !priorities.some(value => value === priority))) {
    throw new Response("Choose a counselor, stage, or priority change.", { status: 400 });
  }
  if (assignee && (!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,35}$/.test(assignee) || !reason)) {
    throw new Response("Choose a valid counselor and enter a handoff reason.", { status: 400 });
  }
  const selection = form.getAll("selected");
  if (!selection.length || selection.length > bulkLeadLimit) {
    throw new Response(`Select between 1 and ${bulkLeadLimit} enquiries.`, { status: 400 });
  }
  const entries = new Map<string, string>();
  for (const value of selection) {
    const match = typeof value === "string" && /^([a-zA-Z0-9][a-zA-Z0-9._-]{0,35}):([1-9][0-9]{0,14})$/.exec(value);
    if (!match || entries.has(match[1])) throw new Response("Invalid selection. Reload the list.", { status: 400 });
    entries.set(match[1], match[2]);
  }

  const results = [];
  for (const [id, version] of entries) {
    const change = new FormData();
    for (const [key, value] of Object.entries({ stage, priority, reason, version })) change.set(key, value);
    if (assignee) change.set("owner", assignee);
    try {
      await updateLead(staff, id, change, "bulk");
      results.push({ id, status: "saved" as const, message: "Saved" });
    } catch (error) {
      const skipped = error instanceof Response && [400, 403, 404, 409].includes(error.status);
      results.push({
        id, status: skipped ? "skipped" as const : "review" as const,
        message: skipped ? await error.text() : "Check the enquiry before retrying. The update could not be confirmed.",
      });
    }
  }
  return results;
}
