import { createCipheriv, createDecipheriv, randomBytes, randomUUID, scryptSync } from "node:crypto";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { appwrite, AppwriteError, configurationIssues } from "~/lib/appwrite.server";
import { openStaffSession, staffForSession } from "./auth.server";
import { boundedBody } from "~/lib/request-body.server";
import { expenseCategories, expenseMonth, recordExpense, voidExpense, saveOfficeBudget } from "./finance.server";
import { leadFor, leadsFor, queuePage, taskPage, updateLead } from "./crm.server";

import { isRestrictedManager, closureStages, priorities, stages, type Lead } from "./domain";

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
    if (status === 404 && error instanceof Response) return reply({ error: "Lead not found." }, 404);
    if ([401, 404].includes(status)) return reply({ error: "Please sign in again." }, 401);
    if (status === 403) return reply({ error: "Your account does not have access." }, 403);
    if (error instanceof Response && [400, 409].includes(status)) return reply({ error: await error.text() }, status);
    if (status === 429) return reply({ error: "Too many attempts. Try again shortly." }, 429);
    return reply({ error: "CRM service unavailable. Try again shortly." }, 503);
  }
}

function leadId(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id || !/^[A-Za-z0-9][A-Za-z0-9._-]{0,35}$/.test(id)) throw new Response("Invalid lead ID.", { status: 400 });
  return id;
}

function editableLead(lead: Lead) {
  const { $id: id, name, stage, priority, version } = lead;
  return { id, name, stage, priority, version, stages, priorities, closureStages };
}

function isJson(request: Request) {
  return request.headers.get("Content-Type")?.split(";")[0] === "application/json";
}

async function mobileStaff(request: Request) {
  const staff = await staffForSession(sessionFrom(request));
  if (isRestrictedManager(staff)) {
    throw new Response("Use the web lead workspace for team access.", { status: 403 });
  }
  return staff;
}

function mobileLeads({ documents, total }: Awaited<ReturnType<typeof leadsFor>>) {
  return {
    totalLeads: total,
    leads: documents.map(({ $id, name, service, country, stage, priority, nextFollowUp }) =>
      ({ id: $id, name, service, country, stage, priority, nextFollowUp })),
  };
}

export function loader({ request, params }: LoaderFunctionArgs) {
  return mobileRequest(request, async () => {
    if (params.resource === "finance") {
      const staff = await mobileStaff(request);
      const month = new URL(request.url).searchParams.get("month") || new Date().toISOString().slice(0, 7);
      return reply({ ...await expenseMonth(staff, month), categories: expenseCategories, submissionId: randomUUID() });
    }
    if (params.resource === "lead") {
      const staff = await mobileStaff(request);
      return reply(editableLead(await leadFor(staff, leadId(request))));
    }
    if (params.resource === "follow-ups") {
      const staff = await mobileStaff(request);
      const page = queuePage(new URL(request.url).searchParams.get("page"));
      const { records, hasMore } = await taskPage(staff, page);
      return reply({ page, hasMore, tasks: records.map(({ $id, title, dueAt }) => ({ id: $id, title, dueAt })) });
    }
    if (params.resource !== "workspace") return reply({ error: "Unknown resource." }, 404);
    const staff = await mobileStaff(request);
    const [leads, { records: tasks, hasMore }] = await Promise.all([leadsFor(staff), taskPage(staff, 1)]);
    return reply({
      updatedAt: new Date().toISOString(),
      ...mobileLeads(leads),
      leadsHaveMore: leads.total > 25,
      tasksHaveMore: hasMore,
      tasks: tasks.map(({ $id, title, dueAt }) => ({ id: $id, title, dueAt })),
    });
  });
}

export function action({ request, params }: ActionFunctionArgs) {
  return mobileRequest(request, async () => {
    if (params.resource === "finance") {
      if (request.method !== "POST" || !isJson(request)) return reply({ error: "Use a JSON POST." }, 405);
      const staff = await mobileStaff(request);
      const body = await (await boundedBody(request, 8192, "Expense")).text().then(JSON.parse).catch(() => null);
      if (!body || typeof body !== "object" || Array.isArray(body)) return reply({ error: "Invalid expense." }, 400);
      if (body.intent === "budget") {
        if (typeof body.month !== "string" || typeof body.amount !== "string" || typeof body.version !== "string") return reply({ error: "Invalid budget." }, 400);
        await saveOfficeBudget(staff, body.month, body.amount, body.version);
        return reply({ saved: true });
      }
      if (body.intent === "void") {
        if (typeof body.id !== "string" || typeof body.reason !== "string") return reply({ error: "Select an expense and reason." }, 400);
        await voidExpense(staff, body.id, body.reason);
        return reply({ id: body.id });
      }
      const form = new FormData();
      for (const key of ["submissionId", "description", "category", "spentOn", "amount"]) {
        if (typeof body[key] !== "string") return reply({ error: "Invalid expense fields." }, 400);
        form.set(key, body[key]);
      }
      return reply({ id: await recordExpense(staff, form) });
    }
    if (params.resource === "leads") {
      if (request.method !== "POST") return reply({ error: "Method not allowed." }, 405);
      const staff = await mobileStaff(request);
      if (!isJson(request)) return reply({ error: "Expected JSON." }, 415);
      const body = await request.json().catch(() => null);
      if (typeof body?.q !== "string") return reply({ error: "Invalid search." }, 400);
      const search = body.q.trim();
      if (search.length > 254 || (search && search.length < 3)) {
        return reply({ error: "Enter between 3 and 254 characters to search." }, 400);
      }
      const page = queuePage(typeof body.page === "number" ? String(body.page) : null);
      const result = await leadsFor(staff, search, "", page);
      return reply({ ...mobileLeads(result), page, hasMore: page < 10000 && page * 25 < result.total });
    }
    if (params.resource === "lead") {
      if (request.method !== "PATCH") return reply({ error: "Method not allowed." }, 405);
      const staff = await mobileStaff(request);
      const id = leadId(request);
      if (!isJson(request)) return reply({ error: "Expected JSON." }, 415);
      const { version, stage, priority, reason = "" } = await request.json().catch(() => null) ?? {};
      if (!Number.isSafeInteger(version) || version < 0 || typeof stage !== "string" ||
          typeof priority !== "string" || typeof reason !== "string") {
        return reply({ error: "Invalid lead update." }, 400);
      }
      const form = new FormData();
      for (const [key, value] of Object.entries({ version: String(version), stage, priority, reason })) form.set(key, value);
      return reply(editableLead(await updateLead(staff, id, form, "stage-priority")));
    }
    if (params.resource !== "session") return reply({ error: "Unknown resource." }, 404);
    if (request.method === "DELETE") {
      await appwrite("/account/sessions/current", { method: "DELETE", session: sessionFrom(request) });
      return new Response(null, { status: 204, headers });
    }
    if (request.method !== "POST") return reply({ error: "Method not allowed." }, 405);
    if (!isJson(request)) {
      return reply({ error: "Expected JSON." }, 415);
    }
    const body = await request.json().catch(() => null);
    const { email, password } = body ?? {};
    if (typeof email !== "string" || !email.trim() || email.length > 254 ||
        typeof password !== "string" || !password || password.length > 512) {
      return reply({ error: "Enter your staff email and password." }, 400);
    }
    const { secret, expire, staff } = await openStaffSession(email.trim(), password, false);
    const expiresAt = Math.min(Date.parse(expire), Date.now() + 8 * 60 * 60 * 1000);
    if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
      await appwrite("/account/sessions/current", { method: "DELETE", session: secret });
      return reply({ error: "Could not establish a staff session." }, 503);
    }
    return reply({ token: issueToken(secret, expiresAt), expiresAt, name: staff.name, role: staff.role });
  });
}
