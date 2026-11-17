import { randomUUID } from "node:crypto";
import { requireActiveTeam } from "./team-scope.server";
import { AppwriteError, appwrite, createDocument, getDocument, listDocuments, query, updateDocument } from "~/lib/appwrite.server";
import { allow, audit, definitiveWriteRejection, field, serialized, staffAccessLock, UnconfirmedMutation } from "./crm.server";
import { canUseCRM, roles, type Staff } from "./domain";

export const canManageStaff = (staff: Staff) => staff.active === true && ["owner", "admin"].includes(staff.role);
export const canEditStaff = (actor: Staff, target: Staff) =>
  canManageStaff(actor) && actor.$id !== target.$id && (actor.role === "owner" || target.role !== "owner");

const validId = (value: string) => /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,35}$/.test(value);
type Profile = Pick<Staff, "name" | "role" | "active" | "teamId" | "managerScope" | "revocationPending">;
type AuthUser = { $id: string; status: boolean };
const pageSize = 30;
// shortcut: one directory page, add pagination before supporting more than 100 teams.
const directoryLimit = 100;
type DirectoryTeam = { $id: string; $updatedAt: string; name: string; branch: string; status: string };

async function directory() {
  try {
    return await listDocuments<DirectoryTeam>("crm_teams", [query("orderAsc", "$id"), query("limit", undefined, [directoryLimit])]);
  } catch (error) {
    if (error instanceof AppwriteError && error.status === 404) return null;
    throw error;
  }
}

export async function saveDirectoryTeam(actor: Staff, form: FormData) {
  allow(canManageStaff(actor));
  const id = field(form, "teamReference", 36);
  const expected = field(form, "expected", 40);
  const name = field(form, "teamName", 200);
  const branch = field(form, "branch", 150);
  const status = field(form, "status", 12);
  if ((id && !validId(id)) || !name || !branch || !["active", "inactive"].includes(status)) {
    throw new Response("Enter a team name, branch and valid status.", { status: 400 });
  }
  return serialized(staffAccessLock, async () => {
    const currentActor = await staffFor(actor.$id);
    if (!currentActor || !canManageStaff(currentActor)) throw new Response("Access denied", { status: 403 });
    const current = id ? await getDocument<DirectoryTeam>("crm_teams", id) : null;
    if (current && current.$updatedAt !== expected) {
      throw new Response("This team changed. Refresh before saving.", { status: 409 });
    }
    if (!current && ((await directory())?.total ?? 0) >= directoryLimit) {
      throw new Response("The team directory has reached its 100-team limit.", { status: 409 });
    }
    if (current && status === "inactive" && current.status !== "inactive") {
      const filters = [query("equal", "teamId", [id]), query("limit", undefined, [1])];
      const [leads, staff] = await Promise.all([
        listDocuments("leads", filters),
        listDocuments("staff", [...filters, query("equal", "active", [true])]),
      ]);
      if (leads.total || staff.total) throw new Response("Move active staff and enquiries before deactivating this team.", { status: 409 });
    }
    const target = id || randomUUID();
    const changes = { name, branch, status };
    const intent = await audit(currentActor, target, "team", "Team directory change requested", { ...changes, state: "pending" });
    try {
      if (current) await updateDocument("crm_teams", target, changes);
      else await createDocument("crm_teams", changes, target);
    } catch (error) {
      if (definitiveWriteRejection(error)) throw error;
      throw new UnconfirmedMutation("The team change may have saved. Ask an administrator to reconcile it before retrying.");
    }
    await finishAudit(intent.$id, "Team directory updated", { ...changes, state: "completed" });
  });
}

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
  const [directoryResult, page] = await Promise.all([directory(), listDocuments<Staff>("staff", [
    query("orderAsc", "$id"), query("limit", undefined, [pageSize + 1]),
    ...(cursor ? [query("cursorAfter", undefined, [cursor])] : []),
  ])]);
  const visibleProfile = ({ $id, $updatedAt, name, role, active, teamId, managerScope, revocationPending }: Staff & { $updatedAt: string }) =>
    ({ $id, $updatedAt, name, role, active, teamId, managerScope, revocationPending });
  const team = page.documents.slice(0, pageSize).map(visibleProfile);
  const selected = id ? await staffFor(id) : null;
  if (id && !selected) throw new Response("Staff profile not found.", { status: 404 });
  if (selected) allow(canEditStaff(actor, selected));
  return {
    team,
    directory: directoryResult?.documents ?? null,
    selected: selected ? visibleProfile(selected) : null,
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
  const requestedScope = field(form, "managerScope", 12);
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
    const previousScope = existing?.role === "manager" ? existing.managerScope || "global" : "";
    const managerScope = role === "manager" ? requestedScope || previousScope : "";
    if (role === "manager" && !["team", "global"].includes(managerScope)) {
      throw new Response("Choose an explicit manager scope.", { status: 400 });
    }
    if (managerScope === "global" && previousScope !== "global" && field(form, "confirmGlobal", 3) !== "yes") {
      throw new Response("Confirm organization-wide manager access before saving.", { status: 400 });
    }
    if (active && managerScope === "team") {
      await requireActiveTeam({ ...currentActor, role: "manager", teamId, managerScope }).catch(error => {
        if (error instanceof Response && error.status === 403) throw new Response("Choose an active directory team for this manager.", { status: 400 });
        throw error;
      });
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
    const profile = { name, role, active, teamId,
      ...(requestedScope || existing?.managerScope ? { managerScope } : {}), revocationPending: revoking ? existing?.revocationPending || new Date().toISOString() : "" };
    const profileChanged = !existing || Object.entries(profile).some(([key, value]) => (existing[key as keyof Profile] ?? "") !== value);
    if (!profileChanged && !revoking) return { pending: false };
    const details = { before: existing ? { role: existing.role, active: existing.active, teamId: existing.teamId, managerScope: previousScope } : null, role, active, teamId, managerScope };
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
