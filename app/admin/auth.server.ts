import { createCookie, redirect } from "react-router";
import { appwrite, AppwriteError, configurationIssues, getDocument } from "~/lib/appwrite.server";
import { roles, type Staff } from "./domain";

function sessionCookie() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Response("Set SESSION_SECRET to at least 32 random characters.", { status: 503 });
  return createCookie(process.env.NODE_ENV === "production" ? "__Host-pc_staff" : "pc_staff", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", secrets: [secret] });
}
export function dashboardRequest(request: Request) {
  const expected = process.env.DASHBOARD_URL;
  const url = new URL(request.url);
  if (expected && url.origin !== new URL(expected).origin) {
    if (request.method !== "GET" && request.method !== "HEAD") throw new Response("Wrong dashboard origin", { status: 403 });
    throw redirect(new URL(url.pathname + url.search, expected).href);
  }
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get("Origin");
  if (!origin || origin !== new URL(request.url).origin) throw new Response("Request origin rejected", { status: 403 });
}
export async function requireStaff(request: Request): Promise<Staff> {
  dashboardRequest(request);
  if (configurationIssues().length) throw redirect("/admin/login");
  const session = await sessionCookie().parse(request.headers.get("Cookie"));
  if (typeof session !== "string" || !session) throw redirect("/admin/login");
  try {
    const account = await appwrite<{ $id: string }>("/account", { session });
    const staff = await getDocument<Staff>("staff", account.$id);
    if (!staff.active || !roles.includes(staff.role)) throw new Response("Your account does not have active staff access.", { status: 403 });
    return { $id: account.$id, name: staff.name, role: staff.role, active: staff.active, teamId: staff.teamId };
  } catch (error) {
    if (error instanceof AppwriteError && [401, 404].includes(error.status)) throw redirect("/admin/login");
    if (error instanceof Response) throw error;
    throw new Response("The staff service is temporarily unavailable. Please retry.", { status: 503 });
  }
}
export async function signIn(request: Request, email: string, password: string) {
  dashboardRequest(request); sameOrigin(request);
  const session = await appwrite<{ secret: string; expire: string }>("/account/sessions/email", { method: "POST", body: { email, password } });
  if (!session.secret) throw new Error("Appwrite did not return an SSR session secret");
  try {
    const account = await appwrite<{ $id: string }>("/account", { session: session.secret });
    const staff = await getDocument<Staff>("staff", account.$id);
    if (!staff.active || !roles.includes(staff.role)) throw new Error("Inactive staff");
  } catch {
    await appwrite("/account/sessions/current", { method: "DELETE", session: session.secret }).catch(() => undefined);
    throw new Error("Staff access is required");
  }
  return redirect("/admin", { headers: { "Set-Cookie": await sessionCookie().serialize(session.secret, { expires: new Date(session.expire) }) } });
}
export async function signOut(request: Request) {
  dashboardRequest(request); sameOrigin(request);
  const cookie = sessionCookie();
  const session = await cookie.parse(request.headers.get("Cookie"));
  if (session) await appwrite("/account/sessions/current", { method: "DELETE", session }).catch(() => undefined);
  return redirect("/admin/login", { headers: { "Set-Cookie": await cookie.serialize("", { maxAge: 0 }) } });
}
