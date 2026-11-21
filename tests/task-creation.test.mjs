import test, { before, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url)),originalFetch=globalThis.fetch,originalEnv={...process.env};
const manager={$id:'manager',role:'manager',name:'Synthetic manager',active:true};
const counselor={$id:'counselor',role:'counselor',name:'Synthetic counselor',active:true};
const token='d21265d0-363f-4a4c-b777-0e67b36930da';
let vite,crm,stores,loseIntentAck,loseTaskAck,failFinish,failCreate;
const rejects=status=>error=>error instanceof Response&&error.status===status;
function form(values={}){const result=new FormData();for(const [key,value] of Object.entries({submissionId:token,title:'Synthetic follow-up',dueAt:'2026-12-01T10:00:00+05:00',...values}))result.set(key,value);return result;}
before(async()=>{
 Object.assign(process.env,{NODE_ENV:'test',APPWRITE_ENDPOINT:'http://127.0.0.1/v1',APPWRITE_DATABASE_ID:'synthetic',APPWRITE_PROJECT_ID:'synthetic',APPWRITE_API_KEY:'synthetic'});
 vite=await createServer({configFile:false,root,resolve:{alias:{'~':root+'app'}},server:{middlewareMode:true,hmr:false,ws:false},logLevel:'error'});
 crm=await vite.ssrLoadModule('/app/admin/crm.server.ts');
 globalThis.fetch=async(input,options={})=>{
  const [,collection,id]=new URL(input).pathname.match(/\/collections\/(\w+)\/documents(?:\/([^/]+))?$/)??[];
  const store=stores[collection];assert.ok(store,'unexpected collection');
  if(options.method==='POST'){
   const {documentId,data,permissions}=JSON.parse(options.body);assert.deepEqual(permissions,[]);
   if(store.has(documentId))return Response.json({}, {status:409});
   if(collection==='tasks'&&failCreate)throw Error('synthetic unavailable write');
   const row={...data,$id:documentId};store.set(documentId,row);
   if((collection==='tasks'&&loseTaskAck)||(collection==='activities'&&loseIntentAck))throw Error('synthetic lost acknowledgement');
   return Response.json(row);
  }
  if(options.method==='PATCH'){
   if(collection==='activities'&&failFinish)throw Error('synthetic audit completion failure');
   assert.ok(store.has(id));Object.assign(store.get(id),JSON.parse(options.body).data);return Response.json(store.get(id));
  }
  return store.has(id)?Response.json(store.get(id)):Response.json({}, {status:404});
 };
});
beforeEach(()=>{
 stores={staff:new Map([manager,counselor].map(row=>[row.$id,{...row}])),leads:new Map([['lead',{$id:'lead',owner:'counselor',stage:'New'}]]),tasks:new Map(),activities:new Map()};
 loseIntentAck=loseTaskAck=failFinish=failCreate=false;
});
after(async()=>{globalThis.fetch=originalFetch;await vite.close();for(const key of Object.keys(process.env))if(!(key in originalEnv))delete process.env[key];Object.assign(process.env,originalEnv);});

test('creation repeats one task/audit and rejects changed payloads',async()=>{
 const [first,second]=await Promise.all([crm.createTask(manager,'lead',form()),crm.createTask(manager,'lead',form())]);
 assert.equal(first.$id,second.$id);assert.equal(stores.tasks.size,1);assert.equal(stores.activities.size,1);
 assert.equal(first.owner,'counselor');assert.equal(first.dueAt,'2026-12-01T05:00:00.000Z');
 for(const change of [{title:'Different'},{dueAt:'2026-12-02T10:00:00Z'}])await assert.rejects(()=>crm.createTask(manager,'lead',form(change)),rejects(409));
 assert.equal([...stores.activities.values()][0].event,'Follow-up created');
});
test('lost intent/task acknowledgements are reconciled without duplicating records',async()=>{
 loseIntentAck=loseTaskAck=true;
 const first=await crm.createTask(manager,'lead',form());
 assert.equal(first.version,1);assert.equal(stores.tasks.size,1);assert.equal(stores.activities.size,1);
 const again=await crm.createTask(manager,'lead',form());assert.equal(first.$id,again.$id);
});
test('audit completion failure retries the same task and preserves later lifecycle changes',async()=>{
 failFinish=true;await assert.rejects(()=>crm.createTask(manager,'lead',form()));
 const task=[...stores.tasks.values()][0];assert.equal(stores.tasks.size,1);
 assert.equal([...stores.activities.values()][0].event,'Follow-up creation requested');
 Object.assign(task,{status:'Completed',dueAt:'2026-12-04T00:00:00Z',outcome:'Synthetic completion',version:3});
 failFinish=false;
 const recovered=await crm.createTask(manager,'lead',form());
 assert.equal(recovered.status,'Completed');assert.equal(recovered.version,3);assert.equal(recovered.dueAt,'2026-12-04T00:00:00Z');
 assert.equal(stores.tasks.size,1);assert.equal(stores.activities.size,1);
 const original=JSON.parse([...stores.activities.values()][0].details);assert.equal(original.dueAt,'2026-12-01T05:00:00.000Z');
});
test('unconfirmed writes retain recovery evidence and changed assignments cannot complete an old request',async()=>{
 failCreate=true;await assert.rejects(()=>crm.createTask(manager,'lead',form()),error=>error instanceof crm.UnconfirmedMutation);
 assert.equal(stores.tasks.size,0);assert.equal(stores.activities.size,1);
 stores.staff.set('next',{$id:'next',role:'counselor',active:true});stores.leads.get('lead').owner='next';
 failCreate=false;await assert.rejects(()=>crm.createTask(manager,'lead',form()),rejects(409));assert.equal(stores.tasks.size,0);
});
test('creation validates current actor, lead, assignee and submission before writes',async()=>{
 for(const invalid of [{submissionId:''},{submissionId:'invalid'},{title:''},{dueAt:'2026-12-01T10:00:00'},{title:'x'.repeat(301)}])await assert.rejects(()=>crm.createTask(manager,'lead',form(invalid)),rejects(400));
 assert.equal(stores.activities.size,0);
 stores.staff.get('manager').active=false;await assert.rejects(()=>crm.createTask(manager,'lead',form()),rejects(403));
 stores.staff.get('manager').active=true;stores.staff.get('counselor').revocationPending='pending';await assert.rejects(()=>crm.createTask(manager,'lead',form()),rejects(403));
 delete stores.staff.get('counselor').revocationPending;
 stores.leads.get('lead').owner='manager';await assert.rejects(()=>crm.createTask(counselor,'lead',form()),rejects(403));
 stores.leads.get('lead').owner='';await assert.rejects(()=>crm.createTask(manager,'lead',form()),rejects(400));
 assert.equal(stores.tasks.size,0);assert.equal(stores.activities.size,0);
});
