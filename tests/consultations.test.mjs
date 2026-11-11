import test, { after, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const originalFetch=globalThis.fetch;
const originalEnv={...process.env};
const manager={$id:'manager',role:'manager',active:true,name:'Synthetic manager'};
const counselor={$id:'counselor',role:'counselor',active:true,name:'Synthetic counselor'};
const foreign={$id:'foreign',role:'counselor',active:true,name:'Synthetic other counselor'};
const token='d21265d0-363f-4a4c-b777-0e67b36930da';
const status=code=>error=>error instanceof Response&&error.status===code;
let vite, service, records, loseAcknowledgment;

function form(values={}){
 const data=new FormData();
 for(const [key,value] of Object.entries({
  submissionId:token,counselor:counselor.$id,destination:'Germany',heldOn:'2026-01-01',...values,
 }))data.set(key,value);
 return data;
}

before(async()=>{
 Object.assign(process.env,{NODE_ENV:'test',APPWRITE_ENDPOINT:'http://127.0.0.1/v1',APPWRITE_PROJECT_ID:'synthetic',APPWRITE_DATABASE_ID:'synthetic',APPWRITE_API_KEY:'synthetic'});
 vite=await createServer({configFile:false,root,resolve:{alias:{'~':root+'app'}},server:{middlewareMode:true,hmr:false,ws:false},logLevel:'error'});
 service=await vite.ssrLoadModule('/app/admin/consultations.server.ts');
 globalThis.fetch=async(input,options)=>{
  const url=new URL(input);
  const [,collection,id]=url.pathname.match(/\/collections\/(\w+)\/documents(?:\/([^/]+))?$/)??[];
  const store=records[collection];
  assert.ok(store);
  if(options.method==='POST'){
   const {data,documentId,permissions}=JSON.parse(options.body);
   assert.deepEqual(permissions,[]);
   if(store.has(documentId))return Response.json({}, {status:409});
   const saved={...data,$id:documentId};
   store.set(documentId,saved);
   if(loseAcknowledgment)throw new Error('Synthetic lost acknowledgment');
   return Response.json(saved);
  }
  if(id)return store.has(id)?Response.json(store.get(id)):Response.json({}, {status:404});
  const queries=url.searchParams.getAll('queries[]').map(JSON.parse);
  const rows=[...store.values()].filter(row=>queries.every(q=>q.method!=='equal'||q.values.includes(row[q.attribute])));
  const offset=queries.find(q=>q.method==='offset')?.values[0]??0;
  const limit=queries.find(q=>q.method==='limit')?.values[0]??100;
  return Response.json({documents:rows.slice(offset,offset+limit),total:rows.length});
 };
});
beforeEach(()=>{
 records={
  staff:new Map([manager,counselor,foreign].map(person=>[person.$id,person])),
  leads:new Map([['lead-one',{$id:'lead-one',name:'Synthetic customer',owner:counselor.$id,country:'Germany'}]]),
  consultations:new Map(),
 };
 loseAcknowledgment=false;
});
after(async()=>{
 globalThis.fetch=originalFetch;
 await vite.close();
 for(const key of Object.keys(process.env))if(!(key in originalEnv))delete process.env[key];
 Object.assign(process.env,originalEnv);
});

test('records the actual counselor separately from the actor and retains credit after handoff',async()=>{
 const saved=await service.recordConsultation(manager,'lead-one',form({counselor:foreign.$id}));
 assert.equal(saved.counselor,foreign.$id);
 assert.equal(saved.recordedBy,manager.$id);
 records.leads.get('lead-one').owner=foreign.$id;
 await assert.rejects(()=>service.leadConsultations(counselor,'lead-one',1),status(403));
 const history=await service.leadConsultations(foreign,'lead-one',1);
 assert.equal(history.history.documents[0].counselorName,foreign.name);
});

test('counselors can only log their assigned leads and cannot credit someone else',async()=>{
 await assert.rejects(()=>service.recordConsultation(foreign,'lead-one',form()),status(403));
 await assert.rejects(()=>service.recordConsultation({...manager,role:'editor'},'lead-one',form()),status(403));
 const saved=await service.recordConsultation(counselor,'lead-one',form({counselor:foreign.$id}));
 assert.equal(saved.counselor,counselor.$id);
 records.staff.set(foreign.$id,{...foreign,active:false});
 await assert.rejects(()=>service.recordConsultation(manager,'lead-one',form({counselor:foreign.$id})),status(400));
});

test('validates dates and resolves repeated submissions and lost acknowledgments',async()=>{
 for(const heldOn of ['2026-02-30','9999-01-01','invalid']){
  await assert.rejects(()=>service.recordConsultation(manager,'lead-one',form({heldOn})),status(400));
 }
 loseAcknowledgment=true;
 const one=await service.recordConsultation(manager,'lead-one',form());
 const two=await service.recordConsultation(manager,'lead-one',form());
 assert.equal(one.$id,two.$id);
 assert.equal(records.consultations.size,1);
 await assert.rejects(()=>service.recordConsultation(manager,'lead-one',form({destination:'Italy'})),status(409));
});

test('management report combines normalized destination and counselor filters and pages matches',async()=>{
 const saved=await service.recordConsultation(manager,'lead-one',form());
 for(let i=0;i<25;i++)records.consultations.set('another-'+i,{...saved,$id:'another-'+i});
 records.consultations.set('italy',{...saved,$id:'italy',destination:'Italy',destinationKey:'italy'});
 records.consultations.set('other',{...saved,$id:'other',counselor:foreign.$id});
 const params=new URLSearchParams({destination:' GERMANY ',counselor:counselor.$id,page:'2'});
 await assert.rejects(()=>service.consultationReport(counselor,params),status(403));
 const report=await service.consultationReport(manager,params);
 assert.equal(report.total,26);
 assert.equal(report.history.length,1);
 assert.equal(report.history[0].leadName,'Synthetic customer');
 assert.equal(report.history[0].destination,'Germany');
});
