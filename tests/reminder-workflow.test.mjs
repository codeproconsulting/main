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
 stores={leads:new Map([['lead-one',{$id:'lead-one',owner:'counselor-one',stage:'New',version:1}]]),tasks:new Map([['task-one',{$id:'task-one',leadId:'lead-one',owner:'counselor-one',title:'Synthetic task',status:'Open',dueAt:'2030-01-01T11:00:00.000Z',version:1}]]),staff:new Map([['counselor-one',staff('counselor')],['counselor-two',{$id:'counselor-two',name:'Synthetic two',role:'counselor',active:true}]]),notifications:new Map([['notice-one',{$id:'notice-one',recipient:'counselor-one',entityId:'lead-one',kind:'task',sourceId:'task-one',sourceVersion:1,dueAt:'2030-01-01T11:00:00.000Z',title:'Stored title',body:'Stored body',read:false}]]),activities:new Map(),worker_health:new Map()};failAudit=false;afterTaskRead=null;
}
before(async()=>{
 Object.assign(process.env,{NODE_ENV:'test',APPWRITE_ENDPOINT:'http://127.0.0.1/v1',APPWRITE_PROJECT_ID:'synthetic',APPWRITE_API_KEY:'synthetic',APPWRITE_DATABASE_ID:'synthetic'});
 vite=await createServer({configFile:false,root,resolve:{alias:{'~':`${root}app`}},server:{middlewareMode:true,hmr:false,ws:false},logLevel:'error'});crm=await vite.ssrLoadModule('/app/admin/crm.server.ts');notices=await vite.ssrLoadModule('/app/admin/notifications.server.ts');
 globalThis.fetch=async(input,options={})=>{
  const url=new URL(input),[,collection,id]=url.pathname.match(/\/collections\/(\w+)\/documents(?:\/([^/]+))?$/)||[],store=stores[collection];if(!store)throw new Error('Unexpected collection');const method=options.method||'GET',payload=options.body?JSON.parse(options.body):null;
  if(method==='GET'){
   if(id){const response=store.has(id)?reply(store.get(id)):reply({},404);if(collection==='tasks'&&afterTaskRead){const fn=afterTaskRead;afterTaskRead=null;fn();}return response;}
   let documents=[...store.values()];for(const q of url.searchParams.getAll('queries[]').map(JSON.parse)){if(q.method==='equal')documents=documents.filter(d=>q.values.includes(d[q.attribute]));if(q.method==='cursorAfter'){const index=documents.findIndex(d=>d.$id===q.values[0]);documents=documents.slice(index+1);}if(q.method==='limit')documents=documents.slice(0,q.values[0]);}return reply({documents,total:documents.length});
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
