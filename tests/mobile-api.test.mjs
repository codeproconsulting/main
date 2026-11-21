import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";
import { fileURLToPath } from "node:url";

test("mobile sign-in, shared lead edits, scoped snapshot and revocation", async () => {
  const root = fileURLToPath(new URL("../", import.meta.url));
  const vite = await createServer({
    configFile: false, root, resolve: { alias: { "~": root + "app" } },
    server: { middlewareMode: true, hmr: false, ws: false }, logLevel: "error",
  });
  const originalFetch = globalThis.fetch;
  Object.assign(process.env, {
    NODE_ENV: "test", APPWRITE_ENDPOINT: "http://127.0.0.1/v1", APPWRITE_PROJECT_ID: "fixture",
    APPWRITE_DATABASE_ID: "fixture", APPWRITE_API_KEY: "fixture",
    SESSION_SECRET: "synthetic-session-key-for-mobile-test", DASHBOARD_URL: "https://crm.example.invalid",
  });
  let revoked = false;
  let active = true;
  let role = "counselor";
  let managerScope = "";
  const events = [];
  const activities = new Map();
  let failCreationFinish = false;
  const consultations = [];
  let lostConsultationAck = false;
  let lostTaskAck = false;
  const leads = [
    { $id: "owned", owner: "staff", name: "Synthetic lead", email: "fixture@example.invalid", stage: "New", priority: "Normal", nextFollowUp: "2027-01-01T10:00:00.000Z", version: 1 },
    { $id: "foreign", owner: "other", name: "Other lead" },
  ];
  const tasks = [
    { $id: "task", owner: "staff", leadId: "owned", title: "Follow up", status: "Open", dueAt: "2026-12-01T10:00:00Z", outcome: "", version: 1 },
    { $id: "transferred", owner: "staff", leadId: "foreign", title: "Private task", status: "Open", dueAt: "2026-12-01T10:00:00Z", outcome: "", version: 1 },
  ];
  globalThis.fetch = async (input, options) => {
    const url = new URL(input);
    if (url.pathname.endsWith("/sessions/email")) {
      return Response.json({ secret: "synthetic-appwrite-session", expire: new Date(Date.now() + 3600000).toISOString() });
    }
    if (url.pathname.endsWith("/sessions/current")) {
      assert.equal(options.headers["X-Appwrite-Session"], "synthetic-appwrite-session");
      revoked = true;
      return new Response(null, { status: 204 });
    }
    if (url.pathname.endsWith("/account")) {
      assert.equal(options.headers["X-Appwrite-Session"], "synthetic-appwrite-session");
      return Response.json({ $id: "staff" }, { status: revoked ? 401 : 200 });
    }
    if (url.pathname.endsWith("/crm_teams/documents/synthetic-team")) return Response.json({$id:"synthetic-team",name:"Synthetic team",status:"active"});
    if (url.pathname.endsWith("/staff/documents/staff")) {
      return Response.json({ $id: "staff", role, managerScope, teamId: "synthetic-team", name: "Synthetic counselor", active });
    }
    if (url.pathname.endsWith("/staff/documents")) return Response.json({documents:[
      {$id:"staff",role,name:"Synthetic counselor",active},
      {$id:"other",role:"counselor",name:"Former counselor",active:false},
    ]});
    if (url.pathname.includes("/activities/documents")) {
      const id=url.pathname.split("/documents/")[1];
      if (options.method === "POST") {
        const {data,documentId}=JSON.parse(options.body);
        if(activities.has(documentId))return Response.json({}, {status:409});
        events.push(data);const row={...data,$id:documentId};activities.set(documentId,row);return Response.json(row);
      }
      if(options.method === "PATCH") {
        const {data}=JSON.parse(options.body);
        if(failCreationFinish&&data.event==='Follow-up created')return Response.json({}, {status:503});
        Object.assign(activities.get(id),data);return Response.json(activities.get(id));
      }
      return activities.has(id)?Response.json(activities.get(id)):Response.json({}, {status:404});
    }
    if (url.pathname.includes("/consultations/documents")) {
      const id = url.pathname.split("/documents/")[1];
      if (options.method === "POST") {
        const { data, documentId, permissions } = JSON.parse(options.body);
        assert.deepEqual(permissions, []);
        if (consultations.some(row => row.$id === documentId)) return Response.json({}, { status: 409 });
        const row = { ...data, $id: documentId };
        consultations.unshift(row);
        if (lostConsultationAck) throw Error("synthetic lost acknowledgment");
        return Response.json(row);
      }
      if (id) return consultations.find(row => row.$id === id) ? Response.json(consultations.find(row => row.$id === id)) : Response.json({}, {status:404});
      const filters = url.searchParams.getAll("queries[]").map(JSON.parse);
      const rows = consultations.filter(row => filters.every(q => {
        if (q.method === "equal") return q.values.includes(row[q.attribute]);
        if (q.method === "greaterThanEqual") return row[q.attribute] >= q.values[0];
        if (q.method === "lessThanEqual") return row[q.attribute] <= q.values[0];
        return true;
      }));
      const offset = filters.find(q => q.method === "offset")?.values[0] ?? 0;
      const limit = filters.find(q => q.method === "limit")?.values[0] ?? 100;
      return Response.json({ documents: rows.slice(offset, offset + limit), total: rows.length });
    }
    const match = url.pathname.match(/\/(leads|tasks)\/documents(?:\/([^/]+))?$/);
    assert.ok(match);
    const rows = match[1] === "leads" ? leads : tasks;
    if (options.method === "POST") {
      const {data,documentId,permissions}=JSON.parse(options.body);assert.deepEqual(permissions,[]);
      if(rows.some(row=>row.$id===documentId))return Response.json({}, {status:409});
      const row={...data,$id:documentId};rows.push(row);return Response.json(row);
    }
    if (match[2]) {
      const row = rows.find(row => row.$id === match[2]);
      if (!row) return Response.json({}, { status: 404 });
      if (options.method === "PATCH") {
        Object.assign(row, JSON.parse(options.body).data);
        if (match[1] === "tasks" && lostTaskAck) throw Error("synthetic lost task acknowledgement");
      }
      return Response.json(row);
    }
    const filters = url.searchParams.getAll("queries[]").map(JSON.parse);
    if (role === "counselor") assert.ok(filters.some(filter => filter.attribute === "owner" && filter.values[0] === "staff"));
    const documents = rows.filter(row => filters.every(filter => {
      if (filter.method === "equal") return filter.values.includes(row[filter.attribute]);
      if (filter.method === "search") return row[filter.attribute].includes(filter.values[0]);
      return true;
    }));
    const offset = filters.find(filter => filter.method === "offset")?.values[0] ?? 0;
    const limit = filters.find(filter => filter.method === "limit")?.values[0] ?? 100;
    return Response.json({ documents: documents.slice(offset, offset + limit), total: documents.length });
  };
  try {
    const { loader, action } = await vite.ssrLoadModule("/app/admin/mobile-api.ts");
    function send(resource, init, host = "https://crm.example.invalid") {
      const request = new Request(`${host}/admin/mobile/v1/${resource}`, init);
      return (init?.method ? action : loader)({ request, params: { resource: resource.split("?")[0] } });
    }
    const credentials = {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "fixture@example.invalid", password: "synthetic" }),
    };
    assert.equal((await send("session", credentials, "https://other.example.invalid")).status, 403);
    assert.equal((await send("session", { ...credentials, headers: { ...credentials.headers, Origin: "https://crm.example.invalid" } })).status, 403);
    assert.equal((await send("workspace")).status, 401);
    const login = await send("session", credentials);
    assert.equal(login.status, 200);
    assert.match(login.headers.get("Cache-Control"), /no-store/);
    const { token } = await login.json();
    assert.ok(!Buffer.from(token, "base64url").includes(Buffer.from("synthetic-appwrite-session")));
    const auth = { headers: { Authorization: `Bearer ${token}` } };
    const snapshot = await send("workspace", auth);
    assert.equal(snapshot.status, 200);
    const data = await snapshot.json();
    assert.deepEqual(data.leads.map(lead => lead.id), ["owned"]);
    assert.equal(data.leads[0].email, undefined);
    assert.deepEqual(data.tasks.map(task => task.id), ["task"]);
    const searchLeads = (q, page = 1, headers = auth.headers) => send("leads", {
      method: "POST", headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ q, page }),
    });
    assert.equal((await searchLeads("Synthetic", 1, {})).status, 401);
    assert.equal((await searchLeads("ab")).status, 400);
    for (let index = 0; index < 26; index++) {
      leads.push({ $id: `search-${index}`, owner: "staff", name: "Synthetic search", emailKey: "synthetic@example.invalid", phoneKey: "441234567890" });
    }
    leads.push({ $id: "foreign-match", owner: "someone-else", name: "Synthetic search" });
    const firstPage = await (await searchLeads("Synthetic search")).json();
    assert.equal(firstPage.totalLeads, 26);
    assert.equal(firstPage.leads.length, 25);
    assert.equal(firstPage.hasMore, true);
    const secondPage = await (await searchLeads("Synthetic search", 2)).json();
    assert.deepEqual(secondPage.leads.map(lead => lead.id), ["search-25"]);
    assert.equal(secondPage.hasMore, false);
    for (const search of ["SYNTHETIC@example.invalid", "+44 1234 567890"]) {
      const result = await (await searchLeads(search)).json();
      assert.equal(result.totalLeads, 26);
      assert.equal(result.leads[0].emailKey, undefined);
      assert.equal(result.leads[0].phoneKey, undefined);
    }
    const tampered = (token[0] === "a" ? "b" : "a") + token.slice(1);
    assert.equal((await send("workspace", { headers: { Authorization: `Bearer ${tampered}` } })).status, 401);
    const { action: webAction } = await vite.ssrLoadModule("/app/admin/lead.tsx");
    const { signIn: webSignIn } = await vite.ssrLoadModule("/app/admin/auth.server.ts");
    const browserHeaders = { Origin: "https://crm.example.invalid" };
    const browserLogin = await webSignIn(new Request("https://crm.example.invalid/admin/login", { headers: browserHeaders }), "fixture@example.invalid", "synthetic");
    const cookie = browserLogin.headers.get("Set-Cookie").split(";")[0];
    const edit = (id, changes) => send(`lead?id=${id}`, {
      method: "PATCH", headers: { ...auth.headers, "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    });
    assert.equal((await send("lead?id=foreign", auth)).status, 403);
    assert.equal((await send("lead?id=missing", auth)).status, 404);
    assert.equal((await edit("foreign", { version: 1, stage: "Contacted", priority: "High" })).status, 403);
    assert.equal((await edit("owned", { version: 1, stage: "Lost", priority: "High" })).status, 400);
    assert.equal(events.length, 0);
    const saved = await edit("owned", { version: 1, stage: "Contacted", priority: "High", owner: "other", nextFollowUp: "" });
    assert.equal(saved.status, 200);
    assert.equal((await saved.json()).version, 2);
    assert.equal(leads[0].owner, "staff");
    assert.equal(leads[0].nextFollowUp, "2027-01-01T10:00:00.000Z");
    assert.equal(events.length, 1);
    const webForm = new FormData();
    for (const [key, value] of Object.entries({ intent: "update", version: "1", stage: "Qualified", priority: "Normal" })) webForm.set(key, value);
    const updateInBrowser = () => webAction({
      request: new Request("https://crm.example.invalid/admin/leads/owned", {
        method: "POST", headers: { ...browserHeaders, Cookie: cookie }, body: webForm,
      }),
      params: { id: "owned" },
    });
    const conflict = await updateInBrowser();
    assert.equal(conflict.init.status, 409);
    assert.equal(conflict.data.conflict, true);
    webForm.set("version", "2");
    assert.equal((await updateInBrowser()).success, true);
    const current = await send("lead?id=owned", auth);
    assert.equal((await current.json()).stage, "Qualified");
    assert.equal((await edit("owned", { version: 2, stage: "Contacted", priority: "Urgent" })).status, 409);
    assert.equal(events.length, 2);
    assert.equal((await send("follow-up?id=task")).status,401);
    assert.equal((await send("follow-up?id=bad/id",auth)).status,400);
    assert.equal((await send("follow-up?id=missing",auth)).status,404);
    assert.equal((await send("follow-up?id=transferred",auth)).status,403);
    const taskDetail = await send("follow-up?id=task",auth);
    assert.equal(taskDetail.status,200);
    assert.match(taskDetail.headers.get("Cache-Control"),/private, no-store/);
    assert.deepEqual(Object.keys(await taskDetail.json()).sort(),["dueAt","id","leadId","outcome","status","title","version"]);
    const changeTask = (changes,id="task",headers={})=>send(`follow-up?id=${id}`,{method:"PATCH",headers:{...auth.headers,"Content-Type":"application/json",...headers},body:JSON.stringify(changes)});
    const taskChanges = {version:1,intent:"complete",outcome:"Synthetic call completed"};
    assert.equal((await changeTask(taskChanges,"transferred")).status,403);
    assert.equal((await changeTask(taskChanges,"task",{"Content-Type":"text/plain"})).status,415);
    assert.equal((await send("follow-up?id=task",{...auth,method:"POST"})).status,405);
    for (const invalid of [{...taskChanges,version:"1"},{...taskChanges,intent:"delete"},{...taskChanges,outcome:""},{...taskChanges,outcome:"x".repeat(2001)},{...taskChanges,intent:"reschedule",dueAt:"2026-12-02T10:00:00"}]) {
      assert.equal((await changeTask(invalid)).status,400);
    }
    assert.equal((await changeTask({...taskChanges,outcome:"x".repeat(17000)})).status,413);
    assert.equal(tasks[0].version,1);
    const movedTask = await changeTask({...taskChanges,intent:"reschedule",dueAt:"2026-12-02T10:00:00+05:00",owner:"other"});
    assert.equal(movedTask.status,200);
    assert.equal((await movedTask.json()).dueAt,"2026-12-02T05:00:00.000Z");
    assert.equal(tasks[0].owner,"staff");
    assert.equal((await changeTask(taskChanges)).status,409);
    const {action: webTaskAction} = await vite.ssrLoadModule("/app/admin/tasks.tsx");
    const taskForm = new FormData();
    for (const [key,value] of Object.entries({id:"task",version:"2",intent:"complete",outcome:"Synthetic completion from web"})) taskForm.set(key,value);
    assert.equal((await webTaskAction({request:new Request("https://crm.example.invalid/admin/tasks",{method:"POST",headers:{...browserHeaders,Cookie:cookie},body:taskForm})})).success,true);
    const completedTask = await (await send("follow-up?id=task",auth)).json();
    assert.equal(completedTask.status,"Completed");
    assert.equal(completedTask.version,3);
    assert.equal((await changeTask({...taskChanges,version:2})).status,409);
    tasks.push({$id:"cancel-task",owner:"staff",leadId:"owned",title:"Synthetic cancel",dueAt:"2026-12-01T10:00:00Z",status:"Open",outcome:"",version:1});
    assert.equal((await changeTask({...taskChanges,intent:"cancel"},"cancel-task")).status,200);
    assert.equal((await (await send("follow-up?id=cancel-task",auth)).json()).status,"Cancelled");
    tasks.push({$id:"uncertain-task",owner:"staff",leadId:"owned",title:"Synthetic interrupted task",dueAt:"2026-12-01T10:00:00Z",status:"Open",outcome:"",version:1});
    lostTaskAck = true;
    assert.equal((await changeTask(taskChanges,"uncertain-task")).status,503);
    lostTaskAck = false;
    assert.equal((await changeTask(taskChanges,"uncertain-task")).status,409);
    const uncertain = await (await send("follow-up?id=uncertain-task",auth)).json();
    assert.equal(uncertain.status,"Completed");
    assert.equal(uncertain.version,2);
    assert.equal(uncertain.outcome,taskChanges.outcome);
    leads[0].owner="other";
    assert.equal((await send("follow-up?id=task",auth)).status,403);
    assert.equal((await changeTask({...taskChanges,version:3})).status,403);
    leads[0].owner="staff";
    const newTaskContext = await (await send("lead?id=owned",auth)).json();
    assert.equal(newTaskContext.canSchedule,true);
    const createInput = {submissionId:newTaskContext.taskSubmissionId,title:"Synthetic newly scheduled task",dueAt:"2026-12-01T10:00:00+05:00"};
    const createFollowUp = (body,id="owned",headers=auth.headers)=>send(`follow-ups?id=${id}`,{method:"POST",headers:{...headers,"Content-Type":"application/json"},body:JSON.stringify(body)});
    assert.equal((await createFollowUp(createInput,"owned",{})).status,401);
    assert.equal((await createFollowUp(createInput,"foreign")).status,403);
    assert.equal((await createFollowUp({...createInput,submissionId:""})).status,400);
    assert.equal((await createFollowUp({...createInput,title:42})).status,400);
    assert.equal((await createFollowUp({...createInput,title:"x".repeat(5000)})).status,413);
    const createForm = new FormData();for(const [key,value] of Object.entries({intent:"task",...createInput}))createForm.set(key,value);
    failCreationFinish=true;
    const failedWebCreation = await webAction({request:new Request("https://crm.example.invalid/admin/leads/owned",{method:"POST",headers:{...browserHeaders,Cookie:cookie},body:createForm}),params:{id:"owned"}});
    assert.equal(failedWebCreation.init.status,503);
    assert.equal(failedWebCreation.data.taskSubmissionId,createInput.submissionId);
    assert.equal(failedWebCreation.data.taskTitle,createInput.title);
    assert.equal(failedWebCreation.data.taskDueAt,createInput.dueAt);
    failCreationFinish=false;
    const taskCount=tasks.length;
    const recoveredCreation = await createFollowUp({...createInput,owner:"other"});
    assert.equal(recoveredCreation.status,200);
    const createdTask=await recoveredCreation.json();assert.equal(createdTask.status,"Open");assert.equal(tasks.find(row=>row.$id===createdTask.id).owner,"staff");
    assert.equal((await createFollowUp(createInput)).status,200);assert.equal(tasks.length,taskCount);
    assert.equal((await createFollowUp({...createInput,title:"Different follow-up"})).status,409);
    assert.equal((await send("consultations?id=owned")).status, 401);
    assert.equal((await send("consultations?id=foreign", auth)).status, 403);
    assert.equal((await send("consultations?id=bad/id", auth)).status, 400);
    const consultationPage = await send("consultations?id=owned", auth);
    assert.equal(consultationPage.status, 200);
    assert.match(consultationPage.headers.get("Cache-Control"), /private, no-store/);
    const consultationForm = await consultationPage.json();
    assert.equal(consultationForm.total, 0);
    assert.deepEqual(consultationForm.people, [{id:"staff",name:"Synthetic counselor"}]);
    const input = {submissionId:consultationForm.submissionId,destination:"Germany",heldOn:"2026-01-01",counselor:"other"};
    const record = (body, id = "owned", headers = {}) => send(`consultations?id=${id}`, {method:"POST",headers:{...auth.headers,"Content-Type":"application/json",...headers},body:JSON.stringify(body)});
    assert.equal((await record(input,"foreign")).status, 403);
    assert.equal((await record({...input,destination:42})).status, 400);
    assert.equal((await record({...input,heldOn:"2099-01-01"})).status, 400);
    assert.equal((await record({...input,destination:"x".repeat(5000)})).status, 413);
    assert.equal((await record(input,"owned",{"Content-Type":"text/plain"})).status, 415);
    assert.equal((await send("consultations?id=owned",{...auth,method:"PATCH"})).status, 405);
    lostConsultationAck = true;
    const logged = await record(input);
    assert.equal(logged.status, 200);
    assert.equal(consultations.length, 1);
    assert.equal(consultations[0].counselor, "staff"); // counselors cannot forge credit
    assert.equal((await record(input)).status, 200);
    assert.equal(consultations.length, 1);
    assert.equal((await record({...input,destination:"Italy"})).status, 409);
    const history = await (await send("consultations?id=owned",auth)).json();
    assert.deepEqual(Object.keys(history.history[0]).sort(), ["counselorName","destination","heldOn","id"]);
    assert.equal(history.history[0].destination,"Germany");
    for (let i=0;i<25;i++) consultations.push({...consultations[0],$id:`consult-${i}`});
    assert.equal((await (await send("consultations?id=owned",auth)).json()).hasMore, true);
    const nextHistory = await (await send("consultations?id=owned&page=2",auth)).json();
    assert.equal(nextHistory.history.length,1);
    assert.equal(nextHistory.hasMore,false);
    leads[0].owner = "other";
    assert.equal((await send("consultations?id=owned",auth)).status,403);
    assert.equal((await record(input)).status,403);
    leads[0].owner = "staff";
    assert.equal((await send("consultation-report")).status,401);
    assert.equal((await send("consultation-report",auth)).status,403);
    role = "owner";
    consultations.push({...consultations[0],$id:"italy",leadId:"foreign",counselor:"other",counselorName:"Former counselor",destination:"Italy",destinationKey:"italy",heldOn:"2026-02-01"});
    const filtered = await send("consultation-report?destination=%20ITALY%20&counselor=other&from=2026-02-01&through=2026-02-01",auth);
    assert.equal(filtered.status,200);
    assert.match(filtered.headers.get("Cache-Control"),/private, no-store/);
    const report = await filtered.json();
    assert.equal(report.total,1);
    assert.equal(report.history[0].leadName,"Other lead");
    assert.equal(report.history[0].destination,"Italy");
    assert.deepEqual(Object.keys(report.history[0]).sort(),["counselorName","destination","heldOn","id","leadId","leadName"]);
    assert.equal(report.people.length,2);
    for (const excludes of ["destination=Italy&counselor=staff", "destination=Italy&from=2026-02-02", "destination=Germany&through=2025-12-31"]) {
      assert.equal((await (await send("consultation-report?"+excludes,auth)).json()).total,0);
    }
    const reportPage = await (await send("consultation-report?destination=Germany&page=2",auth)).json();
    assert.equal(reportPage.total,26);
    assert.equal(reportPage.history.length,1);
    assert.equal(reportPage.hasMore,false);
    assert.equal((await (await send("consultation-report?destination=Unknown",auth)).json()).total,0);
    for (const invalid of ["from=2026-02-30", "from=2026-02-02&through=2026-02-01", "counselor=bad%2Fid"]) {
      assert.equal((await send("consultation-report?"+invalid,auth)).status,400);
    }
    for (role of ["admin","manager"]) assert.equal((await send("consultation-report",auth)).status,200);
    managerScope = "team";
    assert.equal((await send("consultation-report",auth)).status,403);
    managerScope = "";
    role = "editor";
    assert.equal((await send("consultation-report",auth)).status,403);
    role = "counselor";
    assert.equal((await send("consultation-report",auth)).status,403);
    active = false;
    assert.equal((await send("follow-up?id=task",auth)).status,403);
    assert.equal((await send("consultations?id=owned",auth)).status,403);
    assert.equal((await send("workspace", auth)).status, 403);
    assert.equal((await send("session", { ...auth, method: "DELETE" })).status, 204);
    assert.equal((await send("workspace", auth)).status, 401);
  } finally {
    globalThis.fetch = originalFetch;
    await vite.close();
  }
});
