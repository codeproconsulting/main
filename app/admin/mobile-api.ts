import { bookAppointment } from "./appointment-booking.server";
import { appointmentFor, saveAppointment, type Appointment, caseFor, updateCaseProgress, scopedRecords, type CaseRecord } from "./operations.server";
import { createCipheriv, createDecipheriv, randomBytes, randomUUID, scryptSync } from "node:crypto";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { appwrite, AppwriteError, configurationIssues, query } from "~/lib/appwrite.server";
import { openStaffSession, staffForSession } from "./auth.server";
import { boundedBody } from "~/lib/request-body.server";
import { expenseYear, expensePaymentMethods, expenseCategories, expenseMonth, recordExpense, voidExpense, saveOfficeBudget } from "./finance.server";
import { createTask, changeTask, followUpFor, leadFor, leadsFor, queuePage, scopedQueue, taskPage, updateLead } from "./crm.server";

import { consultationReport, consultationPage, consultationPageSize, leadConsultations, recordConsultation } from "./consultations.server";

import { caseStagesFor, isRestrictedManager, closureStages, priorities, stages, type Staff, type Lead, type Task } from "./domain";

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
    if (status === 404 && error instanceof Response) return reply({ error: "Record not found." }, 404);
    if ([401, 404].includes(status)) return reply({ error: "Please sign in again." }, 401);
    if (status === 403) return reply({ error: "Your account does not have access." }, 403);
    if (error instanceof Response && [400, 409, 413].includes(status)) return reply({ error: await error.text() }, status);
    if (status === 429) return reply({ error: "Too many attempts. Try again shortly." }, 429);
    return reply({ error: "CRM service unavailable. Try again shortly." }, 503);
  }
}

function recordId(request: Request, label = "lead") {
  const id = new URL(request.url).searchParams.get("id");
  if (!id || !/^[A-Za-z0-9][A-Za-z0-9._-]{0,35}$/.test(id)) throw new Response(`Invalid ${label} ID.`, { status: 400 });
  return id;
}

function editableLead(lead: Lead) {
  const { $id: id, name, stage, priority, version } = lead;
  return { id, name, stage, priority, version, stages, priorities, closureStages, taskSubmissionId: randomUUID(), bookingSubmissionId: randomUUID(), canSchedule: Boolean(lead.owner) && !lead.duplicateOf };
}

function editableFollowUp(task: Task) {
  const { $id: id, title, leadId, dueAt, status, outcome, version } = task;
  return { id, title, leadId, dueAt, status, outcome, version };
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

function mobileAppointment(record: Appointment){
 const {$id:id,leadId,title,startsAt,endsAt,status,location,version}=record;
 return {id,leadId,title,startsAt,endsAt,status,location,version};
}

async function personalAgenda(staff:Staff,updatedAt:string) {
  const filters = [query("greaterThanEqual","startsAt",[updatedAt]),query("orderAsc","startsAt"),
    query("select",undefined,["$id","leadId","title","startsAt","endsAt","status"])];
  let page;
  try { page = await scopedQueue<Appointment>(staff,"appointments",filters,1,25,true); }
  catch (error) {
    // An older installation can still serve the leads and tasks snapshot.
    if (error instanceof AppwriteError && [400,404].includes(error.status)) return undefined;
    throw error;
  }
  const {records,hasMore} = page;
  const booked = records.filter(record=>record.status==="Booked");
  return { meetings:booked.slice(0,12).map(({$id:id,title,startsAt,endsAt})=>({id,title,startsAt,endsAt})), limited:hasMore || booked.length>12 };
}

function mobileCase(record: CaseRecord) {
 const {$id:id,leadId,kind,institution,course,country,intake,stage,deadline,version}=record;
 return {id,leadId,kind,institution,course,country,intake,stage,deadline,version,stages:caseStagesFor(kind)};
}

export function loader({ request, params }: LoaderFunctionArgs) {
  return mobileRequest(request, async () => {
    if(params.resource === "appointments"){
      const page=queuePage(new URL(request.url).searchParams.get("page"));
      const {records,hasMore}=await scopedRecords<Appointment>(await mobileStaff(request),"appointments",page);
      return reply({page,hasMore,appointments:records.map(mobileAppointment)});
    }
    if(params.resource === "appointment")return reply(mobileAppointment(await appointmentFor(await mobileStaff(request),recordId(request,"appointment"))));
    if (params.resource === "applications") {
      const page=queuePage(new URL(request.url).searchParams.get("page"));
      const {records,hasMore}=await scopedRecords<CaseRecord>(await mobileStaff(request),"cases",page);
      return reply({page,hasMore,applications:records.map(mobileCase)});
    }
    if (params.resource === "application") return reply(mobileCase(await caseFor(await mobileStaff(request),recordId(request,"application"))));
    if (params.resource === "follow-up") {
      return reply(editableFollowUp(await followUpFor(await mobileStaff(request), recordId(request, "follow-up"))));
    }
    if (params.resource === "consultation-report") {
      const result = await consultationReport(await mobileStaff(request), new URL(request.url).searchParams);
      return reply({
        history: result.history.map(({ $id, leadId, leadName, destination, counselorName, heldOn }) =>
          ({ id: $id, leadId, leadName, destination, counselorName, heldOn })),
        people: result.people, total: result.total, page: result.page,
        hasMore: result.page < 10_000 && result.page * consultationPageSize < result.total,
        filters: { destination: result.destination, counselor: result.counselor, from: result.from, through: result.through },
      });
    }
    if (params.resource === "consultations") {
      const staff = await mobileStaff(request);
      const page = consultationPage(new URL(request.url).searchParams);
      const result = await leadConsultations(staff, recordId(request), page);
      return reply({
        lead: result.lead, people: result.people, manager: result.manager,
        history: result.history.documents.map(({ $id, destination, counselorName, heldOn }) => ({ id: $id, destination, counselorName, heldOn })),
        page, hasMore: page < 10_000 && page * consultationPageSize < result.history.total,
        total: result.history.total, submissionId: randomUUID(),
        today: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString().slice(0, 10),
      });
    }
    if (params.resource === "finance-year") {
      const year = new URL(request.url).searchParams.get("year") || String(new Date().getUTCFullYear());
      return reply(await expenseYear(await mobileStaff(request),year));
    }
    if (params.resource === "finance") {
      const staff = await mobileStaff(request);
      const month = new URL(request.url).searchParams.get("month") || new Date().toISOString().slice(0, 7);
      return reply({ ...await expenseMonth(staff, month), categories: expenseCategories, paymentMethods: expensePaymentMethods, submissionId: randomUUID() });
    }
    if (params.resource === "lead") {
      const staff = await mobileStaff(request);
      return reply(editableLead(await leadFor(staff, recordId(request))));
    }
    if (params.resource === "follow-ups") {
      const staff = await mobileStaff(request);
      const page = queuePage(new URL(request.url).searchParams.get("page"));
      const { records, hasMore } = await taskPage(staff, page);
      return reply({ page, hasMore, tasks: records.map(({ $id, title, dueAt }) => ({ id: $id, title, dueAt })) });
    }
    if (params.resource !== "workspace") return reply({ error: "Unknown resource." }, 404);
    const staff = await mobileStaff(request);
    const updatedAt = new Date().toISOString();
    const includeAgenda = new URL(request.url).searchParams.get("agenda")==="1";
    const [leads, { records: tasks, hasMore }, agenda] = await Promise.all([
      leadsFor(staff), taskPage(staff,1), includeAgenda ? personalAgenda(staff,updatedAt) : undefined,
    ]);
    return reply({
      updatedAt, agenda,
      ...mobileLeads(leads),
      leadsHaveMore: leads.total > 25,
      tasksHaveMore: hasMore,
      tasks: tasks.map(({ $id, title, dueAt }) => ({ id: $id, title, dueAt })),
    });
  });
}

export function action({ request, params }: ActionFunctionArgs) {
  return mobileRequest(request, async () => {
    if (params.resource === "appointments") {
      if (request.method !== "POST") return reply({error:"Method not allowed."},405);
      const staff = await mobileStaff(request), leadId = recordId(request);
      if (!isJson(request)) return reply({error:"Expected JSON."},415);
      const raw = await (await boundedBody(request,16384,"Booking")).text();
      let body;
      try {body = JSON.parse(raw);} catch {return reply({error:"Invalid booking details."},400);}
      const form = new FormData();
      for (const key of ["submissionId","title","startsAt","endsAt","location"]) {
        if (typeof body?.[key] !== "string") return reply({error:"Invalid booking details."},400);
        form.set(key,body[key]);
      }
      return reply(mobileAppointment(await bookAppointment(staff,leadId,form)));
    }
    if(params.resource === "appointment"){
      if(request.method!=="PATCH")return reply({error:"Method not allowed."},405);
      const staff=await mobileStaff(request),id=recordId(request,"appointment");
      if(!isJson(request))return reply({error:"Expected JSON."},415);
      const text=await(await boundedBody(request,16384,"Appointment")).text();
      const body=(()=>{try{return JSON.parse(text);}catch{return null;}})();
      if (!body || !Number.isSafeInteger(body.version) || body.version < 0 || typeof body.reason !== "string") {
        return reply({error:"Invalid appointment update."},400);
      }
      const reschedule = body.action === "reschedule";
      const form = new FormData();
      if (reschedule) {
        if (typeof body.startsAt !== "string" || typeof body.endsAt !== "string" || body.status !== undefined) {
          return reply({error:"Provide a start and end time for the reschedule."},400);
        }
        form.set("startsAt",body.startsAt);
        form.set("endsAt",body.endsAt);
        form.set("status","Booked");
      } else {
        if (body.action !== undefined || typeof body.status !== "string") return reply({error:"Invalid appointment outcome."},400);
        form.set("status",body.status);
      }
      const current = await appointmentFor(staff,id);
      form.set("id",id);
      form.set("leadId",current.leadId);
      form.set("version",String(body.version));
      form.set("reason",body.reason);
      return reply(mobileAppointment(await saveAppointment(staff,form,undefined,reschedule ? "reschedule" : "outcome")));
    }
    if (params.resource === "application") {
      if(request.method!=="PATCH")return reply({error:"Method not allowed."},405);
      const staff=await mobileStaff(request),id=recordId(request,"application");
      if(!isJson(request))return reply({error:"Expected JSON."},415);
      const text=await(await boundedBody(request,4096,"Application")).text();
      const body=(()=>{try{return JSON.parse(text);}catch{return null;}})();
      if(!body||!Number.isSafeInteger(body.version)||body.version<0||typeof body.stage!=="string"||typeof body.deadline!=="string")return reply({error:"Invalid application update."},400);
      const form=new FormData();form.set("version",String(body.version));form.set("stage",body.stage);form.set("deadline",body.deadline);
      return reply(mobileCase(await updateCaseProgress(staff,id,form)));
    }
    if (params.resource === "follow-ups") {
      if (request.method !== "POST") return reply({ error: "Method not allowed." }, 405);
      const staff = await mobileStaff(request);
      const id = recordId(request);
      if (!isJson(request)) return reply({ error: "Expected JSON." }, 415);
      const text = await (await boundedBody(request, 4096, "Follow-up")).text();
      const body = (() => { try { return JSON.parse(text); } catch { return null; } })();
      if (!body || typeof body !== "object" || Array.isArray(body)) return reply({ error: "Invalid follow-up." }, 400);
      const form = new FormData();
      for (const key of ["submissionId", "title", "dueAt"]) {
        if (typeof body[key] !== "string") return reply({ error: "Invalid follow-up fields." }, 400);
        form.set(key, body[key]);
      }
      return reply(editableFollowUp(await createTask(staff, id, form)));
    }
    if (params.resource === "follow-up") {
      if (request.method !== "PATCH") return reply({ error: "Method not allowed." }, 405);
      const staff = await mobileStaff(request);
      const id = recordId(request, "follow-up");
      if (!isJson(request)) return reply({ error: "Expected JSON." }, 415);
      const text = await (await boundedBody(request, 16384, "Follow-up")).text();
      const body = (() => { try { return JSON.parse(text); } catch { return null; } })();
      if (!body || typeof body !== "object" || Array.isArray(body) ||
          !Number.isSafeInteger(body.version) || body.version < 0 ||
          !["complete", "cancel", "reschedule"].includes(body.intent) || typeof body.outcome !== "string" ||
          (body.dueAt !== undefined && (typeof body.dueAt !== "string" || body.dueAt.length > 40))) {
        return reply({ error: "Invalid follow-up update." }, 400);
      }
      return reply(editableFollowUp(await changeTask(staff, id, body.intent, String(body.version), body.outcome, body.dueAt ?? "")));
    }
    if (params.resource === "consultations") {
      if (request.method !== "POST") return reply({ error: "Method not allowed." }, 405);
      const staff = await mobileStaff(request);
      const id = recordId(request);
      if (!isJson(request)) return reply({ error: "Expected JSON." }, 415);
      const text = await (await boundedBody(request, 4096, "Consultation")).text();
      const body = (() => { try { return JSON.parse(text); } catch { return null; } })();
      if (!body || typeof body !== "object" || Array.isArray(body)) return reply({ error: "Invalid consultation." }, 400);
      const form = new FormData();
      for (const key of ["submissionId", "destination", "heldOn"]) {
        if (typeof body[key] !== "string") return reply({ error: "Invalid consultation fields." }, 400);
        form.set(key, body[key]);
      }
      if (body.counselor !== undefined && typeof body.counselor !== "string") return reply({ error: "Invalid counselor." }, 400);
      form.set("counselor", body.counselor ?? "");
      const saved = await recordConsultation(staff, id, form);
      return reply({ id: saved.$id });
    }
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
      for (const key of ["payee", "paymentMethod", "reference"]) {
        if (body[key] !== undefined && typeof body[key] !== "string") return reply({ error: "Invalid payment details." }, 400);
        form.set(key, body[key] ?? "");
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
      const id = recordId(request);
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
