export const stages = ["New", "Attempting contact", "Contacted", "Counselling booked", "Counselled", "Qualified", "Converted", "Nurture", "Unresponsive", "Not eligible", "Lost", "Archived"] as const;
export const roles = ["owner", "admin", "manager", "counselor", "editor", "publisher"] as const;
export type Role = typeof roles[number];
export type Staff = { $id: string; name: string; role: Role; active: boolean; teamId?: string };
export type Lead = { $id: string; $createdAt: string; name: string; email: string; phone: string; service: string; source: string; country: string; stage: string; owner: string; priority: string; nextFollowUp: string; details: string; version: number };
export type Task = { $id: string; leadId: string; title: string; owner: string; dueAt: string; status: string; outcome: string; version: number };
export type Activity = { $id: string; $createdAt: string; actor: string; entityId: string; entityType: string; event: string; details: string };
export type Post = { $id: string; $createdAt: string; title: string; slug: string; section: string; status: string; body: string; excerpt: string; image: string; publishedAt: string; metaTitle: string; metaDescription: string; author: string; legacyId: string; metadata?: string; version: number };
export const canManage = (staff: Staff) => ["owner", "admin", "manager"].includes(staff.role);
export const canUseCRM = (staff: Staff) => canManage(staff) || staff.role === "counselor";
export const canEditContent = (staff: Staff) => ["owner", "admin", "editor", "publisher"].includes(staff.role);
export const canPublish = (staff: Staff) => ["owner", "admin", "publisher"].includes(staff.role);
// First release managers have organization-wide scope. Team-scoped managers require a later policy expansion.
export const canAccessLead = (staff: Staff, lead: Pick<Lead, "owner">) => canUseCRM(staff) && (canManage(staff) || lead.owner === staff.$id);
export function displayDate(value?: string) {
  if (!value) return "Not scheduled";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Invalid date" : new Intl.DateTimeFormat("en-PK", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Karachi" }).format(date);
}

export const caseStages=["Shortlisted","Documents pending","Submitted","Conditional offer","Unconditional offer","Deposit paid","Visa preparation","Visa submitted","Approved","Refused","Enrolled","Withdrawn"];
