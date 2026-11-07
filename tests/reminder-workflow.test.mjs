import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url)),originalFetch=globalThis.fetch,originalEnv={...process.env};
const now='2030-01-01T12:00:00.000Z',staff=role=>({$id:role==='counselor'?'counselor-one':role+'-one',role,name:'Synthetic staff',active:true});
let vite,crm,notices,stores,failAudit,afterTaskRead;
const reply=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json'}});
const rejects=status=>error=>error instanceof Response&&error.status===status;
function reset(){
 stores={appointments:new Map(),cases:new Map(),leads:new Map([['lead-one',{$id:'lead-one',owner:'counselor-one',stage:'New',version:1}]]),tasks:new Map([['task-one',{$id:'task-one',leadId:'lead-one',owner:'counselor-one',title:'Synthetic task',status:'Open',dueAt:'2030-01-01T11:00:00.000Z',version:1}]]),staff:new Map([['counselor-one',staff('counselor')],['counselor-two',{$id:'counselor-two',name:'Synthetic two',role:'counselor',active:true}]]),notifications:new Map([['notice-one',{$id:'notice-one',recipient:'counselor-one',entityId:'lead-one',kind:'task',sourceId:'task-one',sourceVersion:1,dueAt:'2030-01-01T11:00:00.000Z',title:'Stored title',body:'Stored body',read:false}]]),activities:new Map(),worker_health:new Map()};failAudit=false;afterTaskRead=null;
}
before(async()=>{
 Object.assign(process.env,{NODE_ENV:'test',APPWRITE_ENDPOINT:'http://127.0.0.1/v1',APPWRITE_PROJECT_ID:'synthetic',APPWRITE_API_KEY:'synthetic',APPWRITE_DATABASE_ID:'synthetic'});
 vite=await createServer({configFile:false,root,resolve:{alias:{'~':`${root}app`}},server:{middlewareMode:true,hmr:false,ws:false},logLevel:'error'});crm=await vite.ssrLoadModule('/app/admin/crm.server.ts');notices=await vite.ssrLoadModule('/app/admin/notifications.server.ts');
 globalThis.fetch=async(input,options={})=>{
  const url=new URL(input),[,collection,id]=url.pathname.match(/\/collections\/(\w+)\/documents(?:\/([^/]+))?$/)||[],store=stores[collection];if(!store)throw new Error('Unexpected collection');const method=options.method||'GET',payload=options.body?JSON.parse(options.body):null;
  if(method==='GET'){
   if(id){const response=store.has(id)?reply(store.get(id)):reply({},404);if(collection==='tasks'&&afterTaskRead){const fn=afterTaskRead;afterTaskRead=null;fn();}return response;}
   let documents=[...store.values()];for(const q of url.searchParams.getAll('queries[]').map(JSON.parse)){if(q.method==='equal')documents=documents.filter(d=>q.values.includes(d[q.attribute]));if(q.method==='orderAsc')documents.sort((a,b)=>String(a[q.attribute]).localeCompare(String(b[q.attribute])));if(q.method==='cursorAfter'){const index=documents.findIndex(d=>d.$id===q.values[0]);documents=documents.slice(index+1);}}const limit=url.searchParams.getAll('queries[]').map(JSON.parse).find(q=>q.method==='limit')?.values[0]??100;return reply({documents:documents.slice(0,limit),total:documents.length});
  }
  if(method==='POST'){if(collection==='activities'&&failAudit)return reply({},503);assert.deepEqual(payload.permissions,[]);const record={...payload.data,$id:payload.documentId};store.set(record.$id,record);return reply(record);}
  if(method==='PATCH'){if(!store.has(id))return reply({},404);const record={...store.get(id),...payload.data};store.set(id,record);return reply(record);}
  throw new Error('Unexpected method');
 };
});
after(async()=>{globalThis.fetch=originalFetch;await vite.close();for(const key of Object.keys(process.env))if(!(key in originalEnv))delete process.env[key];Object.assign(process.env,originalEnv);});
test('inbox scopes recipient, revalidates task/lead, and derives text from current source',async()=>{
 reset();stores.notifications.set('foreign',{...stores.notifications.get('notice-one'),$id:'foreign',recipient:'counselor-two'});const result=await notices.noticesFor(staff('counselor'),'',now);assert.equal(result.notices.length,1);assert.equal(result.notices[0].title,'Follow-up due: Synthetic task');await notices.readNotice(staff('counselor'),'notice-one',now);assert.equal(stores.notifications.get('notice-one').read,true);assert.equal(stores.tasks.get('task-one').status,'Open');
});
test('canceled/completed/rescheduled/version-changed notices are hidden and cannot be marked read',async()=>{
 for(const change of [{status:'Cancelled'},{status:'Completed'},{dueAt:'2031-01-01T00:00:00.000Z'},{version:2}]){reset();Object.assign(stores.tasks.get('task-one'),change);assert.equal((await notices.noticesFor(staff('counselor'),'',now)).notices.length,0);await assert.rejects(()=>notices.readNotice(staff('counselor'),'notice-one',now),rejects(409));assert.equal(stores.notifications.get('notice-one').read,false);}
});
test('reassignment revokes the old recipient including managers; new owner cannot read old notices',async()=>{
 reset();stores.leads.get('lead-one').owner='counselor-two';assert.equal((await notices.noticesFor(staff('counselor'),'',now)).notices.length,0);await assert.rejects(()=>notices.readNotice(staff('counselor'),'notice-one',now),rejects(409));await assert.rejects(()=>notices.readNotice(stores.staff.get('counselor-two'),'notice-one',now),rejects(403));
 stores.notifications.get('notice-one').recipient='manager-one';assert.equal((await notices.noticesFor(staff('manager'),'',now)).notices.length,0);
});
test('deleted sources and legacy/unknown kinds are hidden; content-only roles cannot access inbox or mark read',async()=>{
 for(const collection of ['leads','tasks']){reset();stores[collection].clear();assert.equal((await notices.noticesFor(staff('counselor'),'',now)).notices.length,0);}
 reset();stores.notifications.get('notice-one').kind='lead';assert.equal((await notices.noticesFor(staff('counselor'),'',now)).notices.length,0);
 for(const role of ['editor','publisher']){await assert.rejects(()=>notices.noticesFor(staff(role),'',now),rejects(403));await assert.rejects(()=>notices.readNotice(staff(role),'notice-one',now),rejects(403));}
});
test('inbox provides a cursor even when the raw page contains only stale reminders',async()=>{
 reset();stores.notifications.clear();for(let i=0;i<26;i++)stores.notifications.set('n'+i,{$id:'n'+i,recipient:'counselor-one',kind:'legacy'});const result=await notices.noticesFor(staff('counselor'),'',now);assert.equal(result.notices.length,0);assert.equal(result.next,'n24');assert.equal((await notices.noticesFor(staff('counselor'),result.next,now)).next,'');await assert.rejects(()=>notices.noticesFor(staff('counselor'),'../bad',now),rejects(400));
});
test('task reschedule normalizes timezone, increments version and invalidates existing notices',async()=>{
 reset();const task=await crm.changeTask(staff('counselor'),'task-one','reschedule','1','Student requested later','2030-01-02T10:00:00+05:00');assert.equal(task.dueAt,'2030-01-02T05:00:00.000Z');assert.equal(task.version,2);assert.equal(task.status,'Open');assert.equal((await notices.noticesFor(staff('counselor'),'',now)).notices.length,0);assert.equal([...stores.activities.values()][0].event,'Follow-up rescheduled');
});
test('complete and cancel require reason/current version and close the task without deleting audit history',async()=>{
 for(const intent of ['complete','cancel']){reset();const task=await crm.changeTask(staff('counselor'),'task-one',intent,'1','Synthetic outcome');assert.equal(task.status,intent==='complete'?'Completed':'Cancelled');assert.equal(task.version,2);assert.equal(stores.activities.size,1);await assert.rejects(()=>crm.changeTask(staff('counselor'),'task-one',intent,'2','Retry'),rejects(409));}
});
test('task changes reject stale forms, invalid action/reason/timezone and foreign counselors',async()=>{
 for(const args of [['complete','0','Reason',''],['complete','','Reason',''],['reschedule','1','Reason','2030-01-02T10:00'],['reschedule','1','Reason',''],['complete','1','',''],['invent','1','Reason','']]){reset();await assert.rejects(()=>crm.changeTask(staff('counselor'),'task-one',...args));assert.equal(stores.tasks.get('task-one').version,1);}
 reset();await assert.rejects(()=>crm.changeTask(stores.staff.get('counselor-two'),'task-one','cancel','1','Reason'),rejects(403));await assert.rejects(()=>crm.changeTask(staff('editor'),'task-one','cancel','1','Reason'),rejects(403));
});
test('task mutations re-read assignment under the lead lock; failed audit prevents update',async()=>{
 reset();afterTaskRead=()=>stores.leads.get('lead-one').owner='counselor-two';await assert.rejects(()=>crm.changeTask(staff('counselor'),'task-one','complete','1','Reason'),rejects(403));assert.equal(stores.tasks.get('task-one').status,'Open');
 reset();failAudit=true;await assert.rejects(()=>crm.changeTask(staff('counselor'),'task-one','cancel','1','Reason'));assert.equal(stores.tasks.get('task-one').status,'Open');
});
test('simultaneous task actions serialize and reject the second stale change',async()=>{
 reset();const results=await Promise.allSettled([crm.changeTask(staff('counselor'),'task-one','cancel','1','First'),crm.changeTask(staff('counselor'),'task-one','reschedule','1','Second','2030-01-02T10:00:00Z')]);assert.equal(results[0].status,'fulfilled');assert.equal(results[1].status,'rejected');assert.equal(results[1].reason.status,409);assert.equal(stores.activities.size,1);
});
test('task creation uses the current active lead assignee and writes a recoverable audit',async()=>{
 reset();const form=new FormData();form.set('title','Synthetic task');form.set('dueAt','2030-01-02T10:00:00+05:00');const task=await crm.createTask(staff('manager'),'lead-one',form);assert.equal(task.owner,'counselor-one');assert.equal(task.dueAt,'2030-01-02T05:00:00.000Z');assert.equal([...stores.activities.values()][0].event,'Follow-up created');
 stores.staff.get('counselor-one').active=false;await assert.rejects(()=>crm.createTask(staff('manager'),'lead-one',form),rejects(403));
});
test('health distinguishes never-started, healthy, stale, failed and restricted roles',async()=>{
 reset();const manager=staff('manager');assert.equal((await notices.reminderHealth(manager,Date.parse(now))).status,'not started');stores.worker_health.set('reminders',{status:'healthy',finishedAt:now,startedAt:now,lastSuccessAt:now,errorCount:0});assert.equal((await notices.reminderHealth(manager,Date.parse(now))).status,'healthy');assert.equal((await notices.reminderHealth(manager,Date.parse(now)+180001)).status,'stale');stores.worker_health.get('reminders').status='failed';assert.equal((await notices.reminderHealth(manager,Date.parse(now))).status,'failed');await assert.rejects(()=>notices.reminderHealth(staff('counselor')),rejects(403));
});

test('application save checks current lead scope inside the shared mutation queue',async()=>{
 reset();const operations=await vite.ssrLoadModule('/app/admin/operations.server.ts');let release;const gate=new Promise(resolve=>release=resolve);
 const transfer=crm.serialized('lead:lead-one',async()=>{await gate;stores.leads.get('lead-one').owner='counselor-two';});
 const form=new FormData();form.set('leadId','lead-one');form.set('kind','Education');form.set('stage','Shortlisted');
 const save=operations.saveCase(staff('counselor'),form);release();await transfer;await assert.rejects(()=>save,rejects(403));
});

function applicationForm(changes={}){const f=new FormData();for(const [key,value]of Object.entries({leadId:'lead-one',kind:'Education',stage:'Shortlisted',institution:'Synthetic institution',course:'Synthetic course',country:'UK',...changes}))f.set(key,String(value));return f;}
test('multiple applications retain independent versions and audit IDs',async()=>{
 reset();const operations=await vite.ssrLoadModule('/app/admin/operations.server.ts');const a=await operations.saveCase(staff('counselor'),applicationForm());const b=await operations.saveCase(staff('counselor'),applicationForm({kind:'Immigration',institution:'Synthetic category'}));assert.notEqual(a.$id,b.$id);assert.equal(stores.cases.size,2);assert.equal(stores.activities.size,2);for(const event of stores.activities.values())assert.equal(JSON.parse(event.details).state,'completed');
 const updated=await operations.saveCase(staff('counselor'),applicationForm({id:a.$id,version:1,stage:'Submitted'}));assert.equal(updated.version,2);assert.equal(stores.cases.get(b.$id).version,1);await assert.rejects(()=>operations.saveCase(staff('counselor'),applicationForm({id:a.$id,version:1})),rejects(409));
});
test('application audit failure prevents creation and updates',async()=>{
 reset();const operations=await vite.ssrLoadModule('/app/admin/operations.server.ts');failAudit=true;await assert.rejects(()=>operations.saveCase(staff('counselor'),applicationForm()));assert.equal(stores.cases.size,0);failAudit=false;const saved=await operations.saveCase(staff('counselor'),applicationForm());failAudit=true;await assert.rejects(()=>operations.saveCase(staff('counselor'),applicationForm({id:saved.$id,version:1,stage:'Submitted'})));assert.equal(stores.cases.get(saved.$id).version,1);
});
test('application validation and lead binding reject unauthorized or malformed saves',async()=>{
 reset();const operations=await vite.ssrLoadModule('/app/admin/operations.server.ts');for(const changes of [{kind:'Unknown'},{stage:'Unknown'},{deadline:'2030-01-01T12:00'}])await assert.rejects(()=>operations.saveCase(staff('counselor'),applicationForm(changes)),rejects(400));await assert.rejects(()=>operations.saveCase(staff('editor'),applicationForm()),rejects(403));await assert.rejects(()=>operations.saveCase(stores.staff.get('counselor-two'),applicationForm()),rejects(403));const saved=await operations.saveCase(staff('counselor'),applicationForm());stores.leads.set('other-lead',{$id:'other-lead',owner:'counselor-one'});await assert.rejects(()=>operations.saveCase(staff('counselor'),applicationForm({id:saved.$id,leadId:'other-lead',version:1})),rejects(403));
});
test('application lost write acknowledgment retains the committed version and pending audit for recovery',async()=>{
 reset();const operations=await vite.ssrLoadModule('/app/admin/operations.server.ts');const saved=await operations.saveCase(staff('counselor'),applicationForm());const transport=globalThis.fetch;
 globalThis.fetch=async(input,options)=>{const response=await transport(input,options);if(options?.method==='PATCH'&&String(input).includes('/collections/cases/'))throw new Error('Synthetic lost acknowledgment');return response;};
 try{await assert.rejects(()=>operations.saveCase(staff('counselor'),applicationForm({id:saved.$id,version:1,stage:'Submitted'})));}finally{globalThis.fetch=transport;}
 assert.equal(stores.cases.get(saved.$id).version,2);assert.ok([...stores.activities.values()].some(a=>JSON.parse(a.details).state==='pending'));await assert.rejects(()=>operations.saveCase(staff('counselor'),applicationForm({id:saved.$id,version:1})),rejects(409));
});

test('lead reassignment transfers application ownership/version and revokes former counselor listing and edits',async()=>{
 reset();const operations=await vite.ssrLoadModule('/app/admin/operations.server.ts');const application=await operations.saveCase(staff('counselor'),applicationForm());
 const transfer=new FormData();for(const [key,value]of Object.entries({version:'1',stage:'New',priority:'Normal',owner:'counselor-two',reason:'Synthetic handoff'}))transfer.set(key,value);
 await crm.updateLead(staff('manager'),'lead-one',transfer);
 assert.equal(stores.cases.get(application.$id).owner,'counselor-two');assert.equal(stores.cases.get(application.$id).version,2);
 assert.equal((await operations.scopedRecords(staff('counselor'),'cases')).length,0);
 const next=stores.staff.get('counselor-two');assert.equal((await operations.scopedRecords(next,'cases')).length,1);
 await assert.rejects(()=>operations.saveCase(staff('counselor'),applicationForm({id:application.$id,version:2})),rejects(403));
 await assert.rejects(()=>operations.saveCase(next,applicationForm({id:application.$id,version:1})),rejects(409));
 assert.equal((await operations.saveCase(next,applicationForm({id:application.$id,version:2,stage:'Submitted'}))).version,3);
});

test('handoff transfers more than one page of applications including terminal stages',async()=>{
 reset();for(let i=0;i<102;i++)stores.cases.set('case-'+i,{$id:'case-'+i,leadId:'lead-one',owner:'counselor-one',version:1,stage:'Withdrawn'});
 const form=new FormData();for(const [key,value]of Object.entries({version:'1',stage:'New',priority:'Normal',owner:'counselor-two',reason:'Synthetic paginated handoff'}))form.set(key,value);
 await crm.updateLead(staff('manager'),'lead-one',form);assert.equal(stores.cases.size,102);for(const row of stores.cases.values()){assert.equal(row.owner,'counselor-two');assert.equal(row.version,2);}
});

test('immigration cases reject education-only stages and existing services cannot be changed',async()=>{
 reset();const operations=await vite.ssrLoadModule('/app/admin/operations.server.ts');for(const stage of ['Conditional offer','Unconditional offer','Deposit paid','Enrolled'])await assert.rejects(()=>operations.saveCase(staff('counselor'),applicationForm({kind:'Immigration',stage})),rejects(400));
 const saved=await operations.saveCase(staff('counselor'),applicationForm({kind:'Immigration',stage:'Visa preparation'}));await assert.rejects(()=>operations.saveCase(staff('counselor'),applicationForm({id:saved.$id,version:1,kind:'Education'})),rejects(400));assert.equal(stores.cases.get(saved.$id).kind,'Immigration');
});
test('interrupted handoff retains old lead scope and retry reconciles application owners',async()=>{
 reset();for(const id of ['case-a','case-b'])stores.cases.set(id,{$id:id,leadId:'lead-one',owner:'counselor-one',version:1});const form=new FormData();for(const [k,v]of Object.entries({version:'1',stage:'New',priority:'Normal',owner:'counselor-two',reason:'Synthetic recovery'}))form.set(k,v);
 const transport=globalThis.fetch;globalThis.fetch=async(input,options)=>{if(options?.method==='PATCH'&&String(input).endsWith('/collections/cases/documents/case-b'))return reply({},503);return transport(input,options);};try{await assert.rejects(()=>crm.updateLead(staff('manager'),'lead-one',form));}finally{globalThis.fetch=transport;}
 assert.equal(stores.leads.get('lead-one').owner,'counselor-one');assert.ok([...stores.activities.values()].some(a=>JSON.parse(a.details).state==='pending'));const operations=await vite.ssrLoadModule('/app/admin/operations.server.ts');assert.equal((await operations.scopedRecords(stores.staff.get('counselor-two'),'cases')).length,0);
 await crm.updateLead(staff('manager'),'lead-one',form);for(const row of stores.cases.values())assert.equal(row.owner,'counselor-two');assert.equal(stores.leads.get('lead-one').owner,'counselor-two');
});

test('application completeness is enforced server-side for each service and requires an active assignee',async()=>{
 reset();const operations=await vite.ssrLoadModule('/app/admin/operations.server.ts');for(const changes of [{institution:''},{country:''},{course:''}])await assert.rejects(()=>operations.saveCase(staff('counselor'),applicationForm(changes)),rejects(400));
 const visa=await operations.saveCase(staff('counselor'),applicationForm({kind:'Immigration',course:''}));assert.equal(visa.course,'');stores.leads.get('lead-one').owner='';await assert.rejects(()=>operations.saveCase(staff('manager'),applicationForm()),rejects(400));stores.leads.get('lead-one').owner='counselor-one';stores.staff.get('counselor-one').active=false;await assert.rejects(()=>operations.saveCase(staff('manager'),applicationForm()),rejects(403));
});

function bookingForm(changes = {}) {
 const form = new FormData();
 for (const [key, value] of Object.entries({ leadId: 'lead-one', title: 'Synthetic consultation', startsAt: '2030-02-01T10:00:00+05:00', endsAt: '2030-02-01T11:00:00+05:00', status: 'Booked', ...changes })) form.set(key, String(value));
 return form;
}
function handoffForm() {
 const form = new FormData();
 for (const [key, value] of Object.entries({version:'1', stage:'New', priority:'Normal', owner:'counselor-two', reason:'Synthetic handoff'})) form.set(key, value);
 return form;
}

test('appointment conflicts serialize across different leads for one counselor and allow adjacent slots', async () => {
 reset();
 const operations = await vite.ssrLoadModule('/app/admin/operations.server.ts');
 stores.leads.set('second', {$id:'second',owner:'counselor-one'});
 const results = await Promise.allSettled([
  operations.saveAppointment(staff('counselor'), bookingForm()),
  operations.saveAppointment(staff('counselor'), bookingForm({leadId:'second',startsAt:'2030-02-01T05:30:00Z',endsAt:'2030-02-01T06:30:00Z'})),
 ]);
 assert.equal(results[0].value.startsAt,'2030-02-01T05:00:00.000Z');
 assert.equal(results[1].reason.status,409);
 const adjacent = await operations.saveAppointment(staff('counselor'), bookingForm({leadId:'second',startsAt:'2030-02-01T06:00:00Z',endsAt:'2030-02-01T07:00:00Z'}));
 assert.equal(adjacent.status,'Booked');
 stores.leads.set('third',{$id:'third',owner:'counselor-two'});
 const other = await operations.saveAppointment(staff('manager'),bookingForm({leadId:'third'}));
 assert.equal(other.owner,'counselor-two');
});

test('calendar conflict checks include records after the first page and exclude terminal bookings', async () => {
 reset();
 const operations = await vite.ssrLoadModule('/app/admin/operations.server.ts');
 for (let i=0;i<100;i++) stores.appointments.set('old-'+i,{$id:'old-'+i,owner:'counselor-one',status:'Cancelled'});
 stores.appointments.set('zz-late',{$id:'zz-late',owner:'counselor-one',status:'Booked',startsAt:'2030-02-01T05:30:00Z',endsAt:'2030-02-01T06:30:00Z'});
 await assert.rejects(()=>operations.saveAppointment(staff('counselor'),bookingForm()),rejects(409));
 stores.appointments.get('zz-late').status='Completed';
 assert.equal((await operations.saveAppointment(staff('counselor'),bookingForm())).status,'Booked');
});

test('appointment edits enforce timezone dates, versions, outcome timing and reasons', async () => {
 reset();
 const operations = await vite.ssrLoadModule('/app/admin/operations.server.ts');
 for (const changes of [{startsAt:'2030-02-30T05:00:00Z'}, {startsAt:'2030-02-01T05:00'}, {endsAt:'2030-02-01T05:00:00Z'}, {status:'Cancelled'}]) {
  await assert.rejects(()=>operations.saveAppointment(staff('counselor'),bookingForm(changes)),rejects(400));
 }
 const created = await operations.saveAppointment(staff('counselor'),bookingForm());
 const id=created.$id;
 await assert.rejects(()=>operations.saveAppointment(staff('counselor'),bookingForm({id,version:1,status:'No show',reason:'Synthetic reason'})),rejects(400));
 const moved={id,version:1,startsAt:'2030-02-01T07:00:00Z',endsAt:'2030-02-01T08:00:00Z'};
 await assert.rejects(()=>operations.saveAppointment(staff('counselor'),bookingForm(moved)),rejects(400));
 assert.equal((await operations.saveAppointment(staff('counselor'),bookingForm({...moved,reason:'Synthetic reschedule'}))).version,2);
 await assert.rejects(()=>operations.saveAppointment(staff('counselor'),bookingForm(moved)),rejects(409));
 await assert.rejects(()=>operations.saveAppointment(staff('counselor'),bookingForm({...moved,version:2,status:'Cancelled'})),rejects(400));
 const cancelled=await operations.saveAppointment(staff('counselor'),bookingForm({...moved,version:2,status:'Cancelled',reason:'Synthetic cancellation'}));
 assert.equal(cancelled.status,'Cancelled');
 await assert.rejects(()=>operations.saveAppointment(staff('counselor'),bookingForm({...moved,version:3})),rejects(400));
 assert.equal((await operations.saveAppointment(staff('counselor'),bookingForm({...moved,id:'',version:''}))).status,'Booked');
 const past={startsAt:'2020-01-01T05:00:00Z',endsAt:'2020-01-01T06:00:00Z'};
 const pastRecord=await operations.saveAppointment(staff('counselor'),bookingForm(past));
 const noShow=await operations.saveAppointment(staff('counselor'),bookingForm({...past,id:pastRecord.$id,version:1,status:'No show',reason:'Synthetic outcome'}));
 assert.equal(noShow.status,'No show');
});

test('appointment permissions recheck current ownership after waiting for the lead lock', async () => {
 reset();
 const operations = await vite.ssrLoadModule('/app/admin/operations.server.ts');
 await assert.rejects(()=>operations.saveAppointment(staff('editor'),bookingForm()),rejects(403));
 stores.staff.get('counselor-one').active=false;
 await assert.rejects(()=>operations.saveAppointment(staff('manager'),bookingForm()),rejects(403));
 stores.staff.get('counselor-one').active=true;
 const created=await operations.saveAppointment(staff('counselor'),bookingForm());
 stores.leads.set('other',{$id:'other',owner:'counselor-one'});
 await assert.rejects(()=>operations.saveAppointment(staff('counselor'),bookingForm({leadId:'other',id:created.$id,version:1})),rejects(403));
 let release;
 const gate=new Promise(resolve=>release=resolve);
 const transfer=crm.serialized('lead:lead-one',async()=>{await gate;stores.leads.get('lead-one').owner='counselor-two';});
 const pending=operations.saveAppointment(staff('counselor'),bookingForm());
 release();await transfer;
 await assert.rejects(()=>pending,rejects(403));
 assert.equal(stores.appointments.size,1);
});

test('appointment writes require audit intent and preserve recovery evidence after lost acknowledgment', async () => {
 reset();
 const operations = await vite.ssrLoadModule('/app/admin/operations.server.ts');
 failAudit=true;
 await assert.rejects(()=>operations.saveAppointment(staff('counselor'),bookingForm()));
 assert.equal(stores.appointments.size,0);
 failAudit=false;
 const transport=globalThis.fetch;
 globalThis.fetch=async(input,options)=>{
  const result=await transport(input,options);
  if(options?.method==='POST'&&String(input).includes('/collections/appointments/documents'))throw new Error('Synthetic lost acknowledgment');
  return result;
 };
 try{await assert.rejects(()=>operations.saveAppointment(staff('counselor'),bookingForm()));}finally{globalThis.fetch=transport;}
 const event=JSON.parse([...stores.activities.values()][0].details);
 assert.equal(event.state,'pending');assert.ok(stores.appointments.has(event.appointmentId));
 await assert.rejects(()=>operations.saveAppointment(staff('counselor'),bookingForm()),rejects(409));
});

test('handoff preflight rejects collisions before writes and transfers appointments after the conflict clears', async () => {
 reset();
 const operations = await vite.ssrLoadModule('/app/admin/operations.server.ts');
 const created=await operations.saveAppointment(staff('counselor'),bookingForm());
 stores.leads.set('second',{$id:'second',owner:'counselor-two'});
 const conflict=await operations.saveAppointment(staff('manager'),bookingForm({leadId:'second'}));
 const before=stores.activities.size;
 await assert.rejects(()=>crm.updateLead(staff('manager'),'lead-one',handoffForm()),rejects(409));
 assert.equal(stores.activities.size,before);
 assert.equal(stores.leads.get('lead-one').owner,'counselor-one');
 assert.equal(stores.appointments.get(created.$id).version,1);
 await operations.saveAppointment(staff('manager'),bookingForm({leadId:'second',id:conflict.$id,version:1,status:'Cancelled',reason:'Synthetic cancellation'}));
 await crm.updateLead(staff('manager'),'lead-one',handoffForm());
 const assignee=stores.staff.get('counselor-two');
 assert.equal((await operations.scopedRecords(staff('counselor'),'appointments')).length,0);
 assert.ok((await operations.scopedRecords(assignee,'appointments')).some(a=>a.$id===created.$id));
 assert.equal(stores.appointments.get(created.$id).version,2);
 await assert.rejects(()=>operations.saveAppointment(assignee,bookingForm({id:created.$id,version:1})),rejects(409));
});

test('interrupted calendar handoff reserves moved slots and retries without bumping already moved versions', async () => {
 reset();
 const operations = await vite.ssrLoadModule('/app/admin/operations.server.ts');
 await operations.saveAppointment(staff('counselor'),bookingForm());
 await operations.saveAppointment(staff('counselor'),bookingForm({startsAt:'2030-02-02T05:00:00Z',endsAt:'2030-02-02T06:00:00Z'}));
 const [a,b]=[...stores.appointments.values()].sort((x,y)=>x.$id.localeCompare(y.$id));
 const transport=globalThis.fetch;
 globalThis.fetch=async(input,options)=>options?.method==='PATCH'&&String(input).endsWith('/appointments/documents/'+b.$id)?reply({},503):transport(input,options);
 try{await assert.rejects(()=>crm.updateLead(staff('manager'),'lead-one',handoffForm()));}finally{globalThis.fetch=transport;}
 assert.equal(stores.leads.get('lead-one').owner,'counselor-one');
 assert.equal(stores.appointments.get(a.$id).owner,'counselor-two');
 assert.equal((await operations.scopedRecords(stores.staff.get('counselor-two'),'appointments')).length,0);
 await assert.rejects(()=>operations.saveAppointment(staff('manager'),bookingForm({id:a.$id,version:2})),rejects(409));
 stores.leads.set('target',{$id:'target',owner:'counselor-two'});
 await assert.rejects(()=>operations.saveAppointment(staff('manager'),bookingForm({leadId:'target',startsAt:a.startsAt,endsAt:a.endsAt})),rejects(409));
 await crm.updateLead(staff('manager'),'lead-one',handoffForm());
 assert.equal(stores.appointments.get(a.$id).version,2);
 assert.equal(stores.appointments.get(b.$id).owner,'counselor-two');
});

test('booked appointments prevent unassignment until an outcome is recorded', async () => {
 reset();
 const operations = await vite.ssrLoadModule('/app/admin/operations.server.ts');
 const past = {startsAt:'2020-01-01T05:00:00Z',endsAt:'2020-01-01T06:00:00Z'};
 const appointment = await operations.saveAppointment(staff('counselor'),bookingForm(past));
 const unassign = handoffForm();unassign.set('owner','');
 await assert.rejects(()=>crm.updateLead(staff('manager'),'lead-one',unassign),rejects(400));
 assert.equal(stores.leads.get('lead-one').owner,'counselor-one');
 await operations.saveAppointment(staff('counselor'),bookingForm({...past,id:appointment.$id,version:1,status:'Completed'}));
 await crm.updateLead(staff('manager'),'lead-one',unassign);
 assert.equal(stores.appointments.get(appointment.$id).owner,'');
 assert.equal(stores.appointments.get(appointment.$id).status,'Completed');
});
