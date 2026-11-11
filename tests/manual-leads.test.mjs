import test, { before, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';
import { phoneKey } from '../app/lib/lead-contact.ts';

const root=fileURLToPath(new URL('../',import.meta.url));
const originalFetch=globalThis.fetch;
const originalEnv={...process.env};
const manager={$id:'synthetic-manager',role:'manager',active:true};
const counselor={$id:'synthetic-counselor',role:'counselor',active:true};
const errorStatus=status=>error=>error instanceof Response&&error.status===status;
const token='d21265d0-363f-4a4c-b777-0e67b36930da';
let vite,manual,crm,leads,activities,profiles,queries,options;

function form(changes={}){
 const fields=new FormData();
 for(const [key,value] of Object.entries({
  submissionId:token,name:'Synthetic lead',email:'Lead@Example.Invalid',
  phone:'+44 (20) 1234-5678',service:'Education',...changes,
 }))fields.set(key,value);
 return fields;
}

before(async()=>{
 Object.assign(process.env,{NODE_ENV:'test',APPWRITE_ENDPOINT:'http://127.0.0.1/v1',APPWRITE_PROJECT_ID:'synthetic',APPWRITE_DATABASE_ID:'synthetic',APPWRITE_API_KEY:'synthetic'});
 vite=await createServer({configFile:false,root,resolve:{alias:{'~':root+'app'}},server:{middlewareMode:true,hmr:false,ws:false},logLevel:'error'});
 manual=await vite.ssrLoadModule('/app/admin/manual-leads.server.ts');
 crm=await vite.ssrLoadModule('/app/admin/crm.server.ts');
 globalThis.fetch=async(input,request)=>{
  const url=new URL(input);
  const [,collection,id]=url.pathname.match(/\/collections\/(\w+)\/documents(?:\/([^/]+))?$/)??[];
  const store={leads,activities,staff:profiles}[collection];
  assert.ok(store);
  if(request.method==='GET'){
   if(id)return store.has(id)?Response.json(store.get(id)):Response.json({}, {status:404});
   queries=url.searchParams.getAll('queries[]').map(JSON.parse);
   const matches=[...store.values()].filter(row=>queries.every(q=>q.method!=='equal'||q.values.includes(row[q.attribute])));
   return Response.json({documents:matches,total:matches.length});
  }
  const {data,documentId,permissions}=JSON.parse(request.body);
  if(request.method==='POST'){
   if(collection==='activities'&&options.failAudit)return Response.json({}, {status:503});
   assert.deepEqual(permissions,[]);
   if(store.has(documentId))return Response.json({}, {status:409});
   const row={...data,$id:documentId};
   store.set(documentId,row);
   if(collection==='leads'&&options.loseAck)throw new Error('Synthetic lost acknowledgement');
   return Response.json(row);
  }
  const row={...store.get(id),...data};
  store.set(id,row);
  return Response.json(row);
 };
});
beforeEach(()=>{
 leads=new Map();
 activities=new Map();
 profiles=new Map([[manager.$id,manager],[counselor.$id,counselor]]);
 queries=[];
 options={};
});
after(async()=>{
 globalThis.fetch=originalFetch;
 await vite.close();
 for(const key of Object.keys(process.env))if(!(key in originalEnv))delete process.env[key];
 Object.assign(process.env,originalEnv);
});

test('manual lead assigns only the current counselor, while manager intake is unassigned',async()=>{
 const managed=await manual.createManualLead(manager,form({owner:counselor.$id,stage:'Converted'}));
 const assigned=await manual.createManualLead(counselor,form({owner:manager.$id}));
 assert.equal(managed.owner,'');
 assert.equal(assigned.owner,counselor.$id);
 assert.equal(managed.stage,'New');
 assert.equal(assigned.emailKey,'lead@example.invalid');
 assert.equal(assigned.phoneKey,'442012345678');
 assert.equal(assigned.source,'Manual entry');
 assert.equal(activities.get(assigned.$id).event,'Manual lead created');
 assert.equal(activities.get(assigned.$id).actor,counselor.$id);
});

test('validation and current role checks prevent unauthorized or invalid writes',async()=>{
 await assert.rejects(()=>manual.createManualLead({...manager,role:'editor'},form()),errorStatus(403));
 for(const changes of [{phone:'invalid'},{email:'invalid'},{service:'Invalid'},{submissionId:'invalid'}]){
  await assert.rejects(()=>manual.createManualLead(manager,form(changes)),errorStatus(400));
 }
 profiles.set(manager.$id,{...manager,active:false});
 await assert.rejects(()=>manual.createManualLead(manager,form()),errorStatus(403));
 assert.equal(leads.size,0);
 assert.equal(activities.size,0);
});

test('audit failure blocks writes, and duplicate retries or lost acknowledgements do not duplicate leads',async()=>{
 options.failAudit=true;
 await assert.rejects(()=>manual.createManualLead(manager,form()),error=>error.status===503);
 assert.equal(leads.size,0);
 options.failAudit=false;
 options.loseAck=true;
 const result=await Promise.all([manual.createManualLead(manager,form()),manual.createManualLead(manager,form())]);
 assert.equal(result[0].$id,result[1].$id);
 assert.equal(leads.size,1);
 assert.equal(activities.size,1);
 await assert.rejects(()=>manual.createManualLead(manager,form({name:'Different synthetic name'})),errorStatus(409));
});

test('normalized contact searches preserve assignment and stage filters without broadening scope',async()=>{
 await manual.createManualLead(manager,form());
 const assigned=await manual.createManualLead(counselor,form());
 const byPhone=await crm.leadsFor(counselor,'0044 20 1234 5678','New',2);
 assert.deepEqual(byPhone.documents.map(row=>row.$id),[assigned.$id]);
 for(const [field,value] of [['phoneKey','442012345678'],['owner',counselor.$id],['stage','New']]){
  assert.ok(queries.some(q=>q.attribute===field&&q.values[0]===value));
 }
 assert.ok(queries.some(q=>q.method==='offset'&&q.values[0]===25));
 assert.equal((await crm.leadsFor(manager,'LEAD@EXAMPLE.INVALID')).total,2);
 assert.ok(queries.some(q=>q.attribute==='emailKey'&&q.values[0]==='lead@example.invalid'));
 await crm.leadsFor(manager,'Synthetic');
 assert.ok(queries.some(q=>q.method==='search'&&q.attribute==='name'));
 assert.equal(phoneKey('020 1234 5678'),'02012345678');
 assert.equal(phoneKey('555-0100 ext. 2'),'');
});

test('legacy backfill pages, previews safely, updates only keys, and can be rerun',async()=>{
 const {backfillLeadContact}=await import('../scripts/backfill-lead-contact.mjs');
 const records=Array.from({length:101},(_,i)=>({
  $id:'lead-'+i,email:'Legacy@Example.Invalid',phone:i===100?'bad':'+44 (20) 1234-5678',
 }));
 let writes=0;
 const request=async(path,method,body)=>{
  if(method==='PATCH'){
   writes++;
   assert.deepEqual(Object.keys(body.data).sort(),['emailKey','phoneKey']);
   Object.assign(records.find(row=>path.endsWith('/'+row.$id)),body.data);
   return;
  }
  const queries=new URL(path,'http://synthetic.invalid').searchParams.getAll('queries[]').map(JSON.parse);
  const cursor=queries.find(q=>q.method==='cursorAfter')?.values[0];
  const start=cursor?records.findIndex(row=>row.$id===cursor)+1:0;
  return {documents:records.slice(start,start+100)};
 };
 const options={database:'synthetic',request};
 assert.deepEqual(await backfillLeadContact(options),{scanned:101,changes:101,unsearchablePhones:1});
 assert.equal(writes,0);
 assert.equal((await backfillLeadContact({...options,apply:true})).changes,101);
 assert.equal(writes,101);
 assert.equal(records[0].phoneKey,'442012345678');
 assert.equal(records[100].phoneKey,'');
 assert.equal((await backfillLeadContact({...options,apply:true})).changes,0);
 assert.equal(writes,101);
});
