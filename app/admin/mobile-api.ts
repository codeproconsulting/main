import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { appwrite, AppwriteError, configurationIssues } from "~/lib/appwrite.server";
import { openStaffSession, staffForSession } from "./auth.server";
import { leadsFor, tasksFor } from "./crm.server";

const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" };
const reply = (body: unknown, status = 200) => Response.json(body, { headers, status });

let signingSecret = "";
let key: Buffer;
function tokenKey() {
  const secret = process.env.SESSION_SECRET!;
  if (secret !== signingSecret) {
    key = scryptSync(secret, "proconsulting-mobile-v1", 32);
    signingSecret = secret;
  }
  return key;
}

function issueToken(session: string, expiresAt: number) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", tokenKey(), iv);
  const content = Buffer.concat([cipher.update(JSON.stringify({ session, expiresAt })), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), content]).toString("base64url");
}

function sessionFrom(request: Request) {
  const token = request.headers.get("Authorization")?.match(/^Bearer ([A-Za-z0-9_-]{40,2048})$/)?.[1];
  if (token) {
    try {
      const bytes = Buffer.from(token, "base64url");
      const cipher = createDecipheriv("aes-256-gcm", tokenKey(), bytes.subarray(0, 12));
      cipher.setAuthTag(bytes.subarray(12, 28));
      const { session, expiresAt } = JSON.parse(Buffer.concat([cipher.update(bytes.subarray(28)), cipher.final()]).toString());
      if (typeof session === "string" && Date.now() < expiresAt) return session;
    } catch {
      // A malformed or tampered token has the same response as an expired one.
    }
  }
  throw new Response(null, { status: 401 });
}

async function mobileRequest(request: Request, operation: () => Promise<Response>) {
  const url = new URL(request.url);
  const expected = process.env.DASHBOARD_URL;
  if ((expected && url.origin !== new URL(expected).origin) ||
      (process.env.NODE_ENV === "production" && (!expected || url.protocol !== "https:")) ||
      request.headers.has("Origin") || request.headers.has("Sec-Fetch-Site")) {
    return reply({ error: "Use the mobile app on the CRM host." }, 403);
  }
  if (configurationIssues().length) return reply({ error: "CRM service unavailable." }, 503);
  try {
    return await operation();
  } catch (error) {
    const status = error instanceof Response || error instanceof AppwriteError ? error.status : 503;
    if ([401, 404].includes(status)) return reply({ error: "Please sign in again." }, 401);
    if (status === 403) return reply({ error: "Your account does not have access." }, 403);
    if (status === 429) return reply({ error: "Too many attempts. Try again shortly." }, 429);
    return reply({ error: "CRM service unavailable. Try again shortly." }, 503);
  }
}

export function loader({ request, params }: LoaderFunctionArgs) {
  return mobileRequest(request, async () => {
    if (params.resource !== "workspace") return reply({ error: "Unknown resource." }, 404);
    const staff = await staffForSession(sessionFrom(request));
    const [leads, tasks] = await Promise.all([leadsFor(staff), tasksFor(staff)]);
    return reply({
      updatedAt: new Date().toISOString(),
      totalLeads: leads.total,
      leads: leads.documents.map(({ $id, name, service, country, stage, nextFollowUp }) =>
        ({ id: $id, name, service, country, stage, nextFollowUp })),
      tasks: tasks.map(({ $id, title, dueAt }) => ({ id: $id, title, dueAt })),
    });
  });
}

export function action({ request, params }: ActionFunctionArgs) {
  return mobileRequest(request, async () => {
    if (params.resource !== "session") return reply({ error: "Unknown resource." }, 404);
    if (request.method === "DELETE") {
      await appwrite("/account/sessions/current", { method: "DELETE", session: sessionFrom(request) });
      return new Response(null, { status: 204, headers });
    }
    if (request.method !== "POST") return reply({ error: "Method not allowed." }, 405);
    if (request.headers.get("Content-Type")?.split(";")[0] !== "application/json") {
      return reply({ error: "Expected JSON." }, 415);
    }
    const body = await request.json().catch(() => null);
    const { email, password } = body ?? {};
    if (typeof email !== "string" || !email.trim() || email.length > 254 ||
        typeof password !== "string" || !password || password.length > 512) {
      return reply({ error: "Enter your staff email and password." }, 400);
    }
    const { secret, expire, staff } = await openStaffSession(email.trim(), password);
    const expiresAt = Math.min(Date.parse(expire), Date.now() + 8 * 60 * 60 * 1000);
    if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
      await appwrite("/account/sessions/current", { method: "DELETE", session: secret });
      return reply({ error: "Could not establish a staff session." }, 503);
    }
    return reply({ token: issueToken(secret, expiresAt), expiresAt, name: staff.name });
  });
}
