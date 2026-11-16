import { AppwriteError, getDocument } from "~/lib/appwrite.server";
import { type Staff } from "./domain";

export async function requireActiveTeam(staff: Staff) {
  const id = staff.teamId;
  if (staff.managerScope !== "team" || !id || !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,35}$/.test(id)) {
    throw new Response("Your manager account needs an active team.", { status: 403 });
  }
  const team = await getDocument<{ status: string }>("crm_teams", id).catch(error => {
    if (error instanceof AppwriteError && error.status === 404) return null;
    throw error;
  });
  if (team?.status !== "active") throw new Response("Your manager account needs an active team.", { status: 403 });
}
