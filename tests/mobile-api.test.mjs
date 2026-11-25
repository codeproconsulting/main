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
  let reassignDuringChecklist = false;
  let active = true;
  let role = "counselor";
  let managerScope = "";
  const events = [];
  const activities = new Map();
  const additionalStaff = [];
  const notifications=[];
  let loseNoteReply = false;
  let failCreationFinish = false;
  const consultations = [];
  let lostConsultationAck = false;
  let lostTaskAck = false;
  let lostCaseAck = false;
  let lostAppointmentAck = false;
  let agendaFailure = 0;
  let failCaseCreateAudit = false, loseCaseCreateAck = false;
  let failBookingAudit = false, loseBookingCreateAck = false;
  const leads = [
    { $id: "owned", owner: "staff", name: "Synthetic lead", email: "fixture@example.invalid", stage: "New", priority: "Normal", nextFollowUp: "2027-01-01T10:00:00.000Z", version: 1 },
    { $id: "foreign", owner: "other", name: "Other lead" },
  ];
  const appointments=[{$id:"appointment",leadId:"owned",owner:"staff",title:"Synthetic appointment",startsAt:"2020-01-01T10:00:00Z",endsAt:"2020-01-01T11:00:00Z",status:"Booked",location:"Synthetic office",notes:"private appointment notes",version:1}];
  const cases=[{$id:"case",leadId:"owned",owner:"staff",kind:"Education",institution:"Synthetic university",course:"Synthetic course",country:"Germany",intake:"2027",stage:"Shortlisted",deadline:"",notes:"private",version:1}];
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
      {$id:"other",role:"counselor",name:"Former counselor",active:false}, ...additionalStaff,
    ]});
    if (url.pathname.includes("/notifications/documents")) {
      const id=url.pathname.split("/documents/")[1];
      if(id){
        const row=notifications.find(item=>item.$id===id);
        if(!row)return Response.json({}, {status:404});
        if(options.method==="PATCH"){
          const {data}=JSON.parse(options.body);assert.deepEqual(data,{read:true});Object.assign(row,data);
        }
        return Response.json(row);
      }
      const filters=url.searchParams.getAll("queries[]").map(JSON.parse);
      assert.ok(filters.some(q=>q.method==="equal" && q.attribute==="recipient" && q.values[0]==="staff"));
      const rows=notifications.filter(row=>row.recipient==="staff");
      const after=filters.find(q=>q.method==="cursorAfter")?.values[0];
      const index=after?rows.findIndex(row=>row.$id===after)+1:0;
      return Response.json({documents:rows.slice(index,index+25),total:rows.length});
    }
    if (url.pathname.includes("/activities/documents")) {
      const id=url.pathname.split("/documents/")[1];
      if (options.method === "POST") {
        const {data,documentId}=JSON.parse(options.body);
        if(activities.has(documentId))return Response.json({}, {status:409});
        events.push(data);const row={...data,$id:documentId};activities.set(documentId,row);
        if (loseNoteReply && data.event === "Note added") throw Error("Synthetic lost note reply");
        return Response.json(row);
      }
      if(options.method === "PATCH") {
        const {data}=JSON.parse(options.body);
        if(failCaseCreateAudit && data.event==="Application created")return Response.json({}, {status:503});
        if(failBookingAudit && data.event==="Appointment booked")return Response.json({}, {status:503});
        if(failCreationFinish&&data.event==='Follow-up created')return Response.json({}, {status:503});
        Object.assign(activities.get(id),data);return Response.json(activities.get(id));
      }
      if (!id) {
        const filters = url.searchParams.getAll("queries[]").map(JSON.parse);
        const leadId = filters.find(f => f.method === "equal" && f.attribute === "entityId").values[0];
        assert.ok(filters.some(f => f.method === "orderDesc" && f.attribute === "$createdAt"));
        assert.ok(filters.some(f => f.method === "limit" && f.values[0] === 100));
        const rows = [...activities.values()].filter(row => row.entityId === leadId)
          .sort((a,b) => b.$createdAt.localeCompare(a.$createdAt));
        return Response.json({documents: rows.slice(0,100), total: rows.length});
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
    if (url.pathname.endsWith("/documents/documents")) {
      const queries=url.searchParams.getAll("queries[]").map(JSON.parse);
      assert.ok(queries.some(q=>q.method==="equal" && q.attribute==="leadId" && q.values[0]==="owned"));
      assert.deepEqual(queries.find(q=>q.method==="select").values,["$id","category","status","expiresAt","scannedAt"]);
      if (reassignDuringChecklist) leads[0].owner="other";
      return Response.json({documents:[
        {$id:"passport",category:"Passport",scannedAt:"2020-01-01",status:"Accepted",expiresAt:"2099-01-01"},
        {$id:"transcript",category:"Transcript",status:"Accepted"},
        {$id:"degree",category:"Degree certificate",scannedAt:"2020-01-01",status:"Accepted",expiresAt:"2021-01-01"},
        {$id:"english",category:"English test",scannedAt:"2020-01-01",status:"Pending review"},
      ],total:4});
    }
    const match = url.pathname.match(/\/(leads|tasks|cases|appointments)\/documents(?:\/([^/]+))?$/);
    assert.ok(match);
    const rows = match[1] === "leads" ? leads : match[1] === "cases" ? cases : match[1] === "appointments" ? appointments : tasks;
    if (options.method === "POST") {
      const {data,documentId,permissions}=JSON.parse(options.body);assert.deepEqual(permissions,[]);
      if(rows.some(row=>row.$id===documentId))return Response.json({}, {status:409});
      const row={...data,$id:documentId};rows.push(row);
      if(match[1]==="cases"&&loseCaseCreateAck)throw Error("Synthetic case reply lost");
      if(match[1]==="appointments"&&loseBookingCreateAck)throw Error("Synthetic booking reply lost");
      return Response.json(row);
    }
    if (match[2]) {
      const row = rows.find(row => row.$id === match[2]);
      if (!row) return Response.json({}, { status: 404 });
      if (options.method === "PATCH") {
        Object.assign(row, JSON.parse(options.body).data);
        if (match[1] === "appointments" && lostAppointmentAck) throw Error("synthetic lost appointment acknowledgement");
        if (match[1] === "cases" && lostCaseAck) throw Error("synthetic lost case acknowledgement");
        if (match[1] === "tasks" && lostTaskAck) throw Error("synthetic lost task acknowledgement");
      }
      return Response.json(row);
    }
    const filters = url.searchParams.getAll("queries[]").map(JSON.parse);
    if (role === "counselor") assert.ok(filters.some(filter => filter.attribute === "owner" && filter.values[0] === "staff"));
    if (agendaFailure && match[1]==="appointments" && filters.some(f=>f.method==="greaterThanEqual")) return Response.json({}, {status:agendaFailure});
    const documents = rows.filter(row => filters.every(filter => {
      if (filter.method === "equal") return filter.values.includes(row[filter.attribute]);
      if (filter.method === "greaterThanEqual") return row[filter.attribute]>=filter.values[0];
      if (filter.method === "search") return row[filter.attribute].includes(filter.values[0]);
      return true;
    }));
    if (filters.some(f=>f.method==="orderAsc" && f.attribute==="startsAt")) documents.sort((a,b)=>a.startsAt.localeCompare(b.startsAt));
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
    const taskDue=tasks[0].dueAt;
    tasks[0].dueAt="2020-01-01T10:00:00.000Z";
    const reminder={$id:"notice",recipient:"staff",entityId:"owned",kind:"task",sourceId:"task",sourceVersion:1,dueAt:tasks[0].dueAt,read:false,title:"Stored title",body:"Stored text"};
    notifications.push(...Array.from({length:25},(_,n)=>({...reminder,$id:"old-"+n,sourceVersion:0})),reminder,{...reminder,$id:"foreign-notice",recipient:"other"});
    const inbox=(after="")=>send("reminders?after="+encodeURIComponent(after),auth);
    const mark=id=>send("reminder-read?id="+id,{...auth,method:"POST"});
    assert.equal((await send("reminders")).status,401);
    assert.equal((await inbox("invalid/cursor")).status,400);
    assert.deepEqual(await(await inbox()).json(),{reminders:[],next:"old-24"});
    const currentPage=async()=>(await(await inbox("old-24")).json()).reminders;
    assert.deepEqual(await currentPage(),[{id:"notice",title:"Follow-up due: Follow up",eventAt:tasks[0].dueAt,read:false,target:"task",targetId:"task"}]);
    assert.equal((await mark("foreign-notice")).status,403);
    assert.equal((await mark("missing")).status,404);
    assert.equal((await mark("old-0")).status,409);
    assert.equal((await mark("notice")).status,204);
    assert.equal((await mark("notice")).status,204);
    assert.equal((await currentPage())[0].read,true);
    assert.equal(tasks[0].status,"Open");
    leads[0].owner="other";assert.deepEqual(await currentPage(),[]);assert.equal((await mark("notice")).status,409);
    leads[0].owner="staff";tasks[0].dueAt=taskDue;
    const now=Date.now();
    const start=new Date(now+1800000).toISOString(), deadline=new Date(now+14400000).toISOString();
    appointments.push({...appointments[0],$id:"soon",startsAt:start});
    cases.push({...cases[0],$id:"deadline",deadline});
    notifications.push({...reminder,$id:"booking-reminder",kind:"appointment",sourceId:"soon",dueAt:new Date(Date.parse(start)-3600000).toISOString()},
      {...reminder,$id:"case-reminder",kind:"case",sourceId:"deadline",dueAt:new Date(Date.parse(deadline)-86400000).toISOString()});
    assert.deepEqual((await currentPage()).map(({target,targetId})=>[target,targetId]),[["appointment","soon"],["case","deadline"]]);
    assert.deepEqual((await currentPage()).map(row=>row.eventAt),[start,deadline]);
    appointments.pop();cases.pop();
    const snapshot = await send("workspace", auth);
    assert.equal(snapshot.status, 200);
    const data = await snapshot.json();
    assert.deepEqual(data.leads.map(lead => lead.id), ["owned"]);
    assert.equal(data.leads[0].email, undefined);
    assert.deepEqual(data.tasks.map(task => task.id), ["task"]);
    assert.equal(data.agenda,undefined);
    const originalCount=appointments.length;
    for(let n=15;n>0;n--){
      const date="2098-02-"+String(n).padStart(2,"0");
      appointments.push({...appointments[0],$id:"upcoming-"+n,startsAt:date+"T09:00:00.000Z",endsAt:date+"T10:00:00.000Z"});
    }
    Object.assign(appointments.at(-1),{owner:"other"});
    Object.assign(appointments.at(-2),{leadId:"foreign"});
    Object.assign(appointments.at(-3),{status:"Cancelled"});
    const agenda=async()=>(await(await send("workspace?agenda=1",auth)).json()).agenda;
    const personal=await agenda();
    assert.equal(personal.limited,false);
    assert.deepEqual(personal.meetings.map(m=>m.id),Array.from({length:12},(_,i)=>"upcoming-"+(i+4)));
    assert.deepEqual(Object.keys(personal.meetings[0]).sort(),["endsAt","id","startsAt","title"]);
    appointments.at(-3).status="Booked";
    assert.equal((await agenda()).limited,true);
    role="owner";
    assert.ok(!(await agenda()).meetings.some(m=>["upcoming-1","upcoming-2"].includes(m.id)));
    role="counselor";
    agendaFailure=400;
    const legacy=await send("workspace?agenda=1",auth);
    assert.equal(legacy.status,200);assert.equal((await legacy.json()).agenda,undefined);
    agendaFailure=403;assert.equal((await send("workspace?agenda=1",auth)).status,403);
    agendaFailure=0;
    appointments.splice(originalCount);
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
    const { action: webAction, loader: webLead } = await vite.ssrLoadModule("/app/admin/lead.tsx");
    const { signIn: webSignIn } = await vite.ssrLoadModule("/app/admin/auth.server.ts");
    const browserHeaders = { Origin: "https://crm.example.invalid" };
    const browserLogin = await webSignIn(new Request("https://crm.example.invalid/admin/login", { headers: browserHeaders }), "fixture@example.invalid", "synthetic");
    const cookie = browserLogin.headers.get("Set-Cookie").split(";")[0];
    const timeline = () => send("lead-activity?id=owned", auth);
    const webTimeline = async () => (await webLead({params:{id:"owned"}, request:new Request("https://crm.example.invalid/admin/leads/owned", {headers:{Cookie:cookie}})})).activities;
    assert.equal((await send("lead-activity?id=owned")).status,401);
    assert.equal((await send("lead-activity?id=invalid/id",auth)).status,400);
    assert.equal((await send("lead-activity?id=missing",auth)).status,404);
    assert.deepEqual(await (await timeline()).json(),{activities:[]});
    const baseEvent = {actor:"staff", entityType:"lead", entityId:"owned", $createdAt:"2020-01-01T00:00:00Z", details:"{}"};
    for (const row of [
      {$id:"bad", event:"Older entry", details:"{"},
      {$id:"note", event:"Note added", actor:"colleague", $createdAt:"2020-01-02T00:00:00Z", details:JSON.stringify({note:"Example note",reason:"Example reason",title:"Example task",dueAt:"2020-01-03T00:00:00Z",internalField:"omit"})},
      {$id:"link", event:"Contact link change requested"},
      {$id:"duplicate", event:"Duplicate decision requested"},
      {$id:"collision", event:"Office expense", entityType:"expense"},
      {$id:"unrelated", event:"Other enquiry", entityId:"foreign"},
    ]) activities.set(row.$id,{...baseEvent,...row});
    const timelineReply = await timeline();
    assert.match(timelineReply.headers.get("Cache-Control"),/no-store/);
    const leadHistory = (await timelineReply.json()).activities;
    assert.deepEqual(leadHistory.map(row=>row.id),["note","bad"]);
    assert.deepEqual(leadHistory[0],{id:"note",at:"2020-01-02T00:00:00Z",event:"Note added",author:"Team member",note:"Example note",reason:"Example reason",title:"Example task",dueAt:"2020-01-03T00:00:00Z"});
    assert.equal(leadHistory[1].note,""); assert.equal(leadHistory[1].author,"You");
    const webHistory=await webTimeline();
    assert.deepEqual(webHistory.map(row=>row.id),["note","bad"]);
    assert.equal(webHistory[0].note,leadHistory[0].note); assert.equal(webHistory[0].details,undefined);
    leads[0].owner="other"; assert.equal((await timeline()).status,403); leads[0].owner="staff";
    revoked=true; assert.equal((await timeline()).status,401); revoked=false;
    role="manager";
    additionalStaff.push({$id:"colleague",role:"counselor",name:"Example colleague",active:true});
    const managerHistory = (await (await timeline()).json()).activities;
    assert.equal(managerHistory[0].author,"Example colleague");
    assert.deepEqual(managerHistory.map(row=>row.id),["note","bad","link","duplicate"]);
    additionalStaff.pop();
    managerScope="team"; leads[0].teamId="synthetic-team";
    assert.equal((await timeline()).status,403); assert.deepEqual(await webTimeline(),[]);
    role="counselor"; managerScope=""; delete leads[0].teamId; activities.clear();
    const { noteSubmissionId } = await (await send("lead?id=owned", auth)).json();
    const note = (text, id = "owned") => send("lead-note?id=" + id, {
      method: "POST", headers: { ...auth.headers, "Content-Type": "application/json" },
      body: JSON.stringify({ note: text, submissionId: noteSubmissionId }),
    });
    assert.equal((await note(" ")).status, 400);
    assert.equal((await note("x".repeat(5001))).status, 400);
    assert.equal((await note("Example note", "foreign")).status, 403);
    loseNoteReply = true;
    assert.equal((await note("Example note")).status, 200);
    loseNoteReply = false;
    assert.equal((await note("Example note")).status, 200);
    assert.equal(activities.size, 1);
    assert.equal((await note("Changed note")).status, 409);
    leads[0].owner = "other";
    assert.equal((await note("Example note")).status, 403);
    leads[0].owner = "staff";
    revoked = true;
    assert.equal((await note("Example note")).status, 401);
    revoked = false;
    activities.clear();
    events.length = 0;
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
    const {enquiryFields}=await vite.ssrLoadModule("/app/admin/enquiry-profile.ts");
    for(const raw of ["null","[]","invalid","42"]) assert.deepEqual(enquiryFields(raw),[]);
    leads[0].details=JSON.stringify({message:"Example enquiry",needScholarship:false,gradeScore:0,unknown:"hidden",notes:{nested:"hidden"}});
    assert.deepEqual(enquiryFields(leads[0].details).map(row=>row.value),["0","false","Example enquiry"]);
    assert.equal(enquiryFields(JSON.stringify({message:"x".repeat(5000)}))[0].value.length,4000);
    const contactProfile = (await (await send("lead?id=owned",auth)).json()).profile;
    assert.equal(contactProfile.email,"fixture@example.invalid");
    assert.deepEqual(contactProfile.enquiry.map(row=>row.value),["0","false","Example enquiry"]);
    assert.equal(contactProfile.details,undefined);
    assert.equal(contactProfile.owner,undefined);
    const contactSnapshot = await (await send("workspace",auth)).json();
    assert.equal(contactSnapshot.leads[0].profile,undefined);
    assert.equal(contactSnapshot.leads[0].email,undefined);
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
    assert.equal((await send("applications")).status,401);
    const appList=await(await send("applications",auth)).json();assert.equal(appList.applications.length,1);assert.equal(appList.applications[0].notes,undefined);
    const searchCases=(search,stage="",page=1,deadline="")=>send("applications",{method:"POST",
      headers:{...auth.headers,"Content-Type":"application/json"},body:JSON.stringify({search,stage,page,deadline})});
    assert.equal((await searchCases("","bad")).status,400);
    const fillers=Array.from({length:25},(_,index)=>({...cases[0],$id:"filler-"+index,institution:"Example filler",course:"Example course"}));
    cases.unshift(...fillers);
    const sparse=await (await searchCases(" SYNTHETIC ",cases.at(-1).stage)).json();
    assert.deepEqual(sparse.applications,[]);assert.equal(sparse.hasMore,true);
    const matching=await (await searchCases("synthetic",cases.at(-1).stage,2)).json();
    assert.deepEqual(matching.applications.map(row=>row.id),["case"]);
    leads[0].owner="other";
    assert.deepEqual((await (await searchCases("synthetic","",2)).json()).applications,[]);
    leads[0].owner="staff";
    assert.equal((await searchCases("","",1,"bad")).status,400);
    cases.at(-1).deadline="2020-01-01T10:00:00Z";
    assert.equal((await (await searchCases("","",1,"overdue")).json()).hasMore,true);
    assert.deepEqual((await (await searchCases("synthetic","Shortlisted",2,"overdue")).json()).applications.map(row=>row.id),["case"]);
    cases.at(-1).deadline="";
    const {matchesCaseDeadline}=await vite.ssrLoadModule("/app/admin/operations.server.ts");
    const deadlineClock=Date.parse("2030-01-01T18:59:00Z");
    const matchDeadline=(deadline,filter,stage="Submitted")=>matchesCaseDeadline({deadline,stage},filter,deadlineClock);
    assert.equal(matchDeadline("2030-01-01T18:58:59Z","overdue"),true);
    assert.equal(matchDeadline("2030-01-01T18:59:00Z","today"),true);
    assert.equal(matchDeadline("2030-01-01T19:00:00Z","today"),false);
    assert.equal(matchDeadline("2030-01-01T19:00:00Z","week"),true);
    assert.equal(matchDeadline("2030-01-07T19:00:00Z","week"),false);
    assert.equal(matchDeadline("2030-01-01T18:58:59Z","overdue","Withdrawn"),false);
    assert.equal(matchDeadline("invalid","week"),false);
    cases.splice(0,fillers.length);
    cases.unshift(...Array.from({length:25},(_,i)=>({...cases[0],$id:"different-"+i,leadId:"foreign"})));
    const leadCases=await (await send("applications?leadId=owned",auth)).json();
    assert.equal(leadCases.leadId,"owned");
    assert.deepEqual(leadCases.applications.map(row=>row.id),["case"]);
    assert.equal(leadCases.hasMore,false);
    assert.equal((await send("applications?leadId=foreign",auth)).status,403);
    assert.equal((await send("applications?leadId=bad%2Fid",auth)).status,400);
    assert.equal((await send("applications?leadId=missing",auth)).status,404);
    cases.splice(0,25);
    cases.unshift(...Array.from({length:25},(_,i)=>({...cases[0],$id:"same-"+i,institution:"Example filler",course:"Example course"})));
    const filteredLeadCases=await (await send("applications?leadId=owned",{
      method:"POST",headers:{...auth.headers,"Content-Type":"application/json"},
      body:JSON.stringify({page:2,search:"synthetic",stage:"Shortlisted"}),
    })).json();
    assert.deepEqual(filteredLeadCases.applications.map(row=>row.id),["case"]);
    leads[0].owner="other";
    assert.equal((await send("applications?leadId=owned&page=2",auth)).status,403);
    leads[0].owner="staff";
    cases.splice(0,25);
    const detail=await(await send("application?id=case",auth)).json();
    assert.equal((await (await send("lead?id="+detail.leadId,auth)).json()).id,"owned");
    leads[0].owner="other";
    assert.equal((await send("lead?id="+detail.leadId,auth)).status,403);
    leads[0].owner="staff";
    assert.equal(detail.documentChecklistAvailable,true);
    assert.equal((await send("application-documents?id=case")).status,401);
    const checklistReply=await send("application-documents?id=case",auth);
    assert.match(checklistReply.headers.get("Cache-Control"),/no-store/);
    const checklist=(await checklistReply.json()).checklist;
    assert.deepEqual(checklist.slice(0,5),[
      {category:"Passport",status:"Ready"},{category:"Transcript",status:"Needs attention"},
      {category:"Degree certificate",status:"Needs attention"},{category:"English test",status:"Awaiting review"},
      {category:"Financial evidence",status:"Not uploaded"},
    ]);
    leads[0].owner="other";
    assert.equal((await send("application-documents?id=case",auth)).status,403);
    leads[0].owner="staff";
    reassignDuringChecklist=true;
    assert.equal((await send("application-documents?id=case",auth)).status,403);
    reassignDuringChecklist=false;leads[0].owner="staff";
    const patchCase=body=>send("application?id=case",{method:"PATCH",headers:{...auth.headers,"Content-Type":"application/json"},body:JSON.stringify(body)});
    assert.equal((await patchCase({version:1,stage:"invalid",deadline:""})).status,400);
    assert.equal((await patchCase({version:1,stage:detail.stages[1],deadline:"2026-12-01T10:00:00+05:00",notes:"overwrite"})).status,200);
    assert.equal(cases[0].notes,"private");assert.equal(cases[0].deadline,"2026-12-01T05:00:00.000Z");
    assert.equal((await patchCase({version:1,stage:detail.stages[0],deadline:""})).status,409);
    lostCaseAck=true;assert.equal((await patchCase({version:2,stage:detail.stages[0],deadline:""})).status,503);lostCaseAck=false;
    assert.equal((await(await send("application?id=case",auth)).json()).version,3);
    assert.equal((await patchCase({version:2,stage:detail.stages[1],deadline:""})).status,409);
    leads[0].owner="other";assert.equal((await send("application?id=case",auth)).status,403);leads[0].owner="staff";
    const detailsUpdate={version:3,stage:detail.stages[0],deadline:"",institution:"Updated institution",course:"Updated course",country:"Italy",intake:"Spring"};
    assert.equal(detail.detailEditing,true);
    assert.equal((await patchCase({...detailsUpdate,country:undefined})).status,400);
    assert.equal((await patchCase({...detailsUpdate,course:" "})).status,400);
    leads[0].owner="other";
    assert.equal((await patchCase(detailsUpdate)).status,403);
    leads[0].owner="staff";
    const updatedDetails=await patchCase({...detailsUpdate,kind:"Immigration",notes:"not writable"});
    assert.equal(updatedDetails.status,200);
    assert.equal((await updatedDetails.json()).institution,"Updated institution");
    assert.equal(cases[0].kind,"Education");assert.equal(cases[0].notes,"private");
    assert.equal((await patchCase(detailsUpdate)).status,409);
    assert.equal((await (await send("application?id=case",auth)).json()).intake,"Spring");
    const leadTasks=await (await send("follow-up-history?leadId=owned&status=Open",auth)).json();
    assert.equal(leadTasks.leadId,"owned");
    assert.ok(leadTasks.tasks.every(task=>task.leadId==="owned" && task.status==="Open"));
    assert.equal((await send("follow-up-history?leadId=foreign&status=Open",auth)).status,403);
    assert.equal((await send("follow-up-history?leadId=invalid%2Fid",auth)).status,400);
    const originalTaskStatus=tasks[0].status;
    tasks[0].status="Completed";tasks[0].outcome="Example recorded outcome";
    assert.equal((await send("follow-up-history")).status,401);
    assert.equal((await send("follow-up-history?status=Invalid",auth)).status,400);
    const taskHistory=await (await send("follow-up-history?status=Completed",auth)).json();
    assert.ok(taskHistory.tasks.some(row=>row.id==="task"));assert.ok(taskHistory.tasks.every(row=>row.status==="Completed"));
    assert.equal(taskHistory.tasks[0].outcome,"Example recorded outcome");
    leads[0].owner="other";
    assert.deepEqual((await (await send("follow-up-history",auth)).json()).tasks,[]);
    leads[0].owner="staff";tasks[0].status=originalTaskStatus;
    assert.equal((await send("appointments")).status,401);
    const appointmentList=await(await send("appointments",auth)).json();assert.equal(appointmentList.appointments.length,1);assert.equal(appointmentList.appointments[0].notes,undefined);
    const scopedAppointments=(page=1)=>send("appointments?leadId=owned&page="+page,auth);
    const otherMeetings=Array.from({length:25},(_,i)=>({...appointments[0],$id:"foreign-meeting-"+i,leadId:"foreign"}));
    appointments.unshift(...otherMeetings);
    const scopedFirst=await (await scopedAppointments()).json();
    assert.equal(scopedFirst.leadId,"owned");assert.equal(scopedFirst.hasMore,false);
    assert.deepEqual(scopedFirst.appointments.map(row=>row.id),["appointment"]);
    appointments.splice(0,25);
    appointments.unshift(...Array.from({length:25},(_,i)=>({...appointments[0],$id:"same-meeting-"+i})));
    assert.equal((await (await scopedAppointments()).json()).hasMore,true);
    assert.deepEqual((await (await scopedAppointments(2)).json()).appointments.map(row=>row.id),["appointment"]);
    leads[0].owner="other";
    assert.equal((await scopedAppointments(2)).status,403);
    leads[0].owner="staff";
    appointments.splice(0,25);
    assert.equal((await send("appointment?id=missing",auth)).status,404);
    const outcome=(body)=>send("appointment?id=appointment",{method:"PATCH",headers:{...auth.headers,"Content-Type":"application/json"},body:JSON.stringify(body)});
    const originalBooking = {...appointments[0]};
    const move = {action:"reschedule",version:1,startsAt:"2035-02-01T10:00+05:00",endsAt:"2035-02-01T11:00+05:00",reason:"Synthetic schedule change"};
    for (const invalid of [
      {reason:"  "}, {startsAt:"2035-02-01T10:00"}, {startsAt:"2035-02-30T10:00Z"},
      {endsAt:move.startsAt}, {status:"Completed"}, {endsAt:null},
      {startsAt:originalBooking.startsAt,endsAt:originalBooking.endsAt}
    ]) assert.equal((await outcome({...move,...invalid})).status,400);
    leads[0].owner="other";
    assert.equal((await outcome(move)).status,403);
    leads[0].owner="staff";
    appointments.push({...originalBooking,$id:"busy-slot",startsAt:"2035-02-01T05:30Z",endsAt:"2035-02-01T06:30Z"});
    assert.equal((await outcome(move)).status,409);
    assert.deepEqual(appointments[0],originalBooking);
    appointments[1].startsAt="2035-02-01T06:00Z";
    const moved=await outcome({...move,notes:"ignored",title:"ignored",location:"ignored",leadId:"ignored",owner:"ignored"});
    assert.equal(moved.status,200);
    const newSlot={startsAt:"2035-02-01T05:00:00.000Z",endsAt:"2035-02-01T06:00:00.000Z",version:2};
    assert.deepEqual(appointments[0],{...originalBooking,...newSlot});
    assert.equal((await moved.json()).notes,undefined);
    const moveAudit=[...activities.values()].findLast(row=>row.event==="Appointment saved");
    assert.deepEqual(JSON.parse(moveAudit.details),{appointmentId:"appointment",fromVersion:1,toVersion:2,status:"Booked",startsAt:newSlot.startsAt,endsAt:newSlot.endsAt,reason:move.reason,state:"completed"});
    assert.equal((await outcome(move)).status,409);
    appointments[0].status="Cancelled";
    assert.equal((await outcome({...move,version:2,startsAt:originalBooking.startsAt,endsAt:originalBooking.endsAt})).status,400);
    appointments.splice(0,2,originalBooking);
    assert.equal((await outcome({version:1,status:"Cancelled",reason:""})).status,400);
    assert.equal((await outcome({version:1,status:"Invalid",reason:"test"})).status,400);
    appointments[0].startsAt="2035-01-01T10:00:00Z";appointments[0].endsAt="2035-01-01T11:00:00Z";
    assert.equal((await outcome({version:1,status:"Completed",reason:"test"})).status,400);
    appointments[0].startsAt="2020-01-01T10:00:00Z";appointments[0].endsAt="2020-01-01T11:00:00Z";
    assert.equal((await outcome({version:1,status:"Cancelled",reason:"Synthetic cancellation",notes:"overwrite",title:"overwrite"})).status,200);
    assert.equal(appointments[0].notes,"private appointment notes");assert.equal(appointments[0].title,"Synthetic appointment");assert.equal(appointments[0].location,"Synthetic office");
    assert.equal((await outcome({version:1,status:"Completed",reason:"test"})).status,409);
    assert.equal((await outcome({version:2,status:"Completed",reason:"test"})).status,400);
    appointments[0].status="Booked";appointments[0].version=3;
    lostAppointmentAck=true;assert.equal((await outcome({version:3,status:"No show",reason:"Synthetic no show"})).status,503);lostAppointmentAck=false;
    assert.equal((await(await send("appointment?id=appointment",auth)).json()).status,"No show");
    assert.equal((await outcome({version:3,status:"Cancelled",reason:"test"})).status,409);
    leads[0].owner="other";assert.equal((await send("appointment?id=appointment",auth)).status,403);leads[0].owner="staff";
    const bookingToken=(await(await send("lead?id=owned",auth)).json()).bookingSubmissionId;
    const booking={submissionId:bookingToken,title:"Synthetic meeting",location:"Example office",startsAt:"2036-01-01T10:00+05:00",endsAt:"2036-01-01T10:30+05:00"};
    const book=(input,id="owned",headers=auth.headers)=>send("appointments?id="+id,{method:"POST",headers:{...headers,"Content-Type":"application/json"},body:JSON.stringify(input)});
    assert.equal((await book(booking,"owned",{})).status,401);
    assert.equal((await book(booking,"foreign")).status,403);
    for(const invalid of [{title:" "},{submissionId:"bad"},{endsAt:booking.startsAt},{startsAt:"2036-01-01T10:00"}]) {
      assert.equal((await book({...booking,...invalid})).status,400);
    }
    appointments.push({...originalBooking,$id:"occupied",status:"Booked",startsAt:"2036-01-01T05:00Z",endsAt:"2036-01-01T05:15Z"});
    assert.equal((await book(booking)).status,409);
    appointments.pop();
    const count=appointments.length;
    failBookingAudit=true;loseBookingCreateAck=true;
    assert.equal((await book({...booking,owner:"other",status:"Completed",notes:"ignored"})).status,503);
    failBookingAudit=false;loseBookingCreateAck=false;
    assert.equal(appointments.length,count+1);
    const replay=await book(booking);
    assert.equal(replay.status,200);
    const booked=await replay.json();
    assert.equal(booked.startsAt,"2036-01-01T05:00:00.000Z");
    assert.equal(booked.status,"Booked");assert.equal(booked.notes,undefined);assert.equal(appointments.at(-1).owner,"staff");
    assert.equal(activities.get(booked.id).event,"Appointment booked");
    Object.assign(appointments.at(-1),{status:"Cancelled",version:2});
    assert.equal((await(await book(booking)).json()).status,"Cancelled");
    assert.equal((await book({...booking,location:"Another office"})).status,409);
    assert.equal(appointments.length,count+1);
    const newToken=(await(await send("lead?id=owned",auth)).json()).bookingSubmissionId;
    const secondToken=(await(await send("lead?id=owned",auth)).json()).bookingSubmissionId;
    const racing=await Promise.all([book({...booking,submissionId:newToken}),book({...booking,submissionId:secondToken})]);
    assert.deepEqual(racing.map(response=>response.status).sort(),[200,409]);
    assert.equal(appointments.length,count+2);
    const {applicationSubmissionId} = await (await send("lead?id=owned",auth)).json();
    const application = {submissionId:applicationSubmissionId,kind:"Education",institution:"Example institution",
      course:"Example course",country:"Italy",intake:"Autumn",deadline:"2036-01-03T09:00+05:00",notes:"Example note"};
    const createCase = (body,leadId="owned") => send("application-create?id="+leadId,{
      method:"POST",headers:{...auth.headers,"Content-Type":"application/json"},body:JSON.stringify(body),
    });
    assert.equal((await createCase({...application, course:""})).status,400);
    assert.equal((await createCase({...application, deadline:"2036-01-03T09:00"})).status,400);
    assert.equal((await createCase(application,"foreign")).status,403);
    const caseCount = cases.length;
    failCaseCreateAudit=true;loseCaseCreateAck=true;
    assert.equal((await createCase(application)).status,503);
    failCaseCreateAudit=false;loseCaseCreateAck=false;
    const caseReplies = await Promise.all([createCase(application),createCase(application)]);
    assert.deepEqual(caseReplies.map(response=>response.status),[200,200]);
    const createdCases = await Promise.all(caseReplies.map(response=>response.json()));
    assert.equal(createdCases[0].id,createdCases[1].id);
    assert.equal(createdCases[0].stage,"Shortlisted");
    assert.equal(createdCases[0].notes,undefined);
    assert.equal(cases.length,caseCount+1);
    assert.equal(activities.get(createdCases[0].id).event,"Application created");
    assert.equal((await createCase({...application, country:"Germany"})).status,409);
    const immigration = {...application, kind:"Immigration", course:"", institution:"Example visa category",
      submissionId:(await (await send("lead?id=owned",auth)).json()).applicationSubmissionId};
    assert.equal((await createCase(immigration)).status,200);
    leads[0].owner="other";
    assert.equal((await createCase(application)).status,403);
    leads[0].owner="staff";
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
