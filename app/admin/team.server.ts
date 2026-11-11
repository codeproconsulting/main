import { AppwriteError, appwrite, createDocument, getDocument, listDocuments, query, updateDocument } from "~/lib/appwrite.server";
import { allow, audit, definitiveWriteRejection, field, serialized, staffAccessLock, UnconfirmedMutation } from "./crm.server";
import { canUseCRM, roles, type Staff } from "./domain";

export const canManageStaff = (staff: Staff) => staff.active === true && ["owner", "admin"].includes(staff.role);
export const canEditStaff = (actor: Staff, target: Staff) =>
  canManageStaff(actor) && actor.$id !== target.$id && (actor.role === "owner" || target.role !== "owner");

const validId = (value: string) => /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,35}$/.test(value);
type Profile = Pick<Staff, "name" | "role" | "active" | "teamId" | "revocationPending">;
type AuthUser = { $id: string; status: boolean };
const pageSize = 30;

async function staffFor(id: string) {
  try {
    return await getDocument<Staff>("staff", id);
  } catch (error) {
    if (error instanceof AppwriteError && error.status === 404) return null;
    throw error;
  }
}

export async function teamFor(actor: Staff, search: URLSearchParams) {
  allow(canManageStaff(actor));
  const cursor = search.get("after") ?? "";
  const id = search.get("edit") ?? "";
  if ((cursor && !validId(cursor)) || (id && !validId(id))) throw new Response("Invalid staff reference.", { status: 400 });
  const page = await listDocuments<Staff>("staff", [
    query("orderAsc", "$id"), query("limit", undefined, [pageSize + 1]),
    ...(cursor ? [query("cursorAfter", undefined, [cursor])] : []),
  ]);
  const team = page.documents.slice(0, pageSize);
  const selected = id ? await staffFor(id) : null;
  if (id && !selected) throw new Response("Staff profile not found.", { status: 404 });
  if (selected) allow(canEditStaff(actor, selected));
  return {
    team,
    selected,
    editableIds: team.filter(target => canEditStaff(actor, target)).map(target => target.$id),
    next: page.documents.length > pageSize ? team.at(-1)!.$id : "",
    cursor,
    owner: actor.role === "owner",
  };
}

async function saveProfile(id: string, existing: boolean, profile: Partial<Profile>, protectAccess = true) {
  try {
    if (existing) await updateDocument("staff", id, profile);
    else await createDocument("staff", profile, id);
  } catch (error) {
    // Treat a lost acknowledgement as success only when every intended field matches.
    const current = await staffFor(id).catch(() => null);
    if (!current || Object.keys(profile).some(key => current[key as keyof Profile] !== profile[key as keyof Profile])) {
      if (protectAccess && !definitiveWriteRejection(error)) {
        throw new UnconfirmedMutation("The profile change could not be confirmed. Ask an administrator to reconcile it before retrying.");
      }
      throw new Response("The profile change could not be confirmed. Refresh Team & access before retrying.", { status: 503 });
    }
  }
}

async function finishAudit(id: string, event: string, details: object) {
  // An audit completion failure leaves the original intent available for reconciliation.
  await updateDocument("activities", id, { event, details: JSON.stringify(details) }).catch(() => undefined);
}

export async function updateStaffAccess(actor: Staff, form: FormData) {
  allow(canManageStaff(actor));
  const id = field(form, "id", 36);
  const name = field(form, "name", 200);
  const requestedRole = field(form, "role", 30);
  const role = roles.find(value => value === requestedRole);
  const access = field(form, "active", 5);
  const teamId = field(form, "teamId", 36);
  const expected = field(form, "expected", 40);
  if (!validId(id) || !name || !role || !["true", "false"].includes(access)) {
    throw new Response("Enter a valid Auth user ID, display name, role and access status.", { status: 400 });
  }
  const active = access === "true";
  allow(id !== actor.$id);

  return serialized(staffAccessLock, async () => {
    const currentActor = await staffFor(actor.$id);
    if (!currentActor || !canManageStaff(currentActor)) throw new Response("Access denied", { status: 403 });
    const existing = await staffFor(id);
    allow(currentActor.role === "owner" || (existing?.role !== "owner" && role !== "owner"));
    if ((existing?.$updatedAt ?? "") !== expected) {
      throw new Response("This staff profile changed. Open it again before saving.", { status: 409 });
    }
    if (!existing && !active) throw new Response("Link a new staff profile with active access.", { status: 400 });
    if (active && existing?.revocationPending) {
      throw new Response("Finish revoking this person's previous sessions before reactivating access.", { status: 409 });
    }
    if (existing?.role === "owner" && existing.active && (!active || role !== "owner")) {
      const owners = await listDocuments<Staff>("staff", [
        query("equal", "role", ["owner"]), query("equal", "active", [true]), query("limit", undefined, [2]),
      ]);
      if (owners.total < 2) throw new Response("Keep at least one active owner.", { status: 400 });
    }
    if (existing && (!active || !canUseCRM({ ...existing, role }))) {
      const leads = await listDocuments("leads", [query("equal", "owner", [id]), query("limit", undefined, [1]), query("select", undefined, ["$id"])]);
      if (leads.total > 0) throw new Response("Reassign this person's leads before removing their CRM access.", { status: 409 });
    }

    const userPath = `/users/${encodeURIComponent(id)}`;
    if (active) {
      try {
        const identity = await appwrite<AuthUser>(userPath);
        if (identity.$id !== id || !identity.status) throw new Response("Link an enabled Appwrite Auth user.", { status: 400 });
      } catch (error) {
        if (error instanceof AppwriteError && error.status === 404) {
          throw new Response("Appwrite Auth user not found. Check the user ID.", { status: 400 });
        }
        throw error;
      }
    }

    const revoking = Boolean(existing && !active && (existing.active || existing.revocationPending));
    const reactivating = Boolean(existing && active && !existing.active);
    const profile = { name, role, active, teamId, revocationPending: revoking ? existing?.revocationPending || new Date().toISOString() : "" };
    const profileChanged = !existing || Object.entries(profile).some(([key, value]) => (existing[key as keyof Profile] ?? "") !== value);
    if (!profileChanged && !revoking) return { pending: false };
    const details = { before: existing ? { role: existing.role, active: existing.active } : null, role, active };
    const intent = await audit(currentActor, id, "staff", "Staff access change requested", { ...details, state: "pending" });
    if (reactivating) {
      // Clear any old sessions, including for profiles deactivated before this workflow existed.
      try {
        await appwrite(`${userPath}/sessions`, { method: "DELETE" });
      } catch {
        throw new Response("Previous sessions could not be cleared. This profile remains deactivated.", { status: 503 });
      }
    }
    if (profileChanged) await saveProfile(id, Boolean(existing), profile);
    if (revoking) {
      try {
        await appwrite(`${userPath}/sessions`, { method: "DELETE" });
        await saveProfile(id, true, { revocationPending: "" }, false);
      } catch {
        await finishAudit(intent.$id, "Staff session revocation needs retry", { ...details, state: "pending" });
        return { pending: true };
      }
    }
    await finishAudit(intent.$id, "Staff access updated", { ...details, state: "completed", sessionsRevoked: revoking || reactivating });
    return { pending: false };
  });
}
