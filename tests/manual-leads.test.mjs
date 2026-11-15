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
let vite,manual,crm,views,bulk,leads,activities,profiles,queries,options,dependencies;

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
 views=await vite.ssrLoadModule('/app/admin/lead-views.server.ts');
 bulk=await vite.ssrLoadModule('/app/admin/bulk-leads.server.ts');
 globalThis.fetch=async(input,request)=>{
  const url=new URL(input);
  const [,collection,id]=url.pathname.match(/\/collections\/(\w+)\/documents(?:\/([^/]+))?$/)??[];
  const store={leads,activities,staff:profiles,...dependencies}[collection];
  assert.ok(store);
  if(request.method==='GET'){
   if(id)return store.has(id)?Response.json(store.get(id)):Response.json({}, {status:404});
   queries=url.searchParams.getAll('queries[]').map(JSON.parse);
   const matches=[...store.values()].filter(row=>queries.every(q=>(q.method!=='equal'||q.values.includes(row[q.attribute]))&&(q.method!=='notEqual'||!q.values.includes(row[q.attribute]))));
   return Response.json({documents:matches,total:matches.length});
  }
  if(request.method==='DELETE')return new Response(null,{status:store.delete(id)?204:404});
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
  if (options.failPatch === collection) return Response.json({}, {status:503});
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
 dependencies=Object.fromEntries(["tasks","cases","appointments","documents","consultations","lead_views"].map(name=>[name,new Map()]));
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

test('related enquiries exclude self and other counselors without merging records',async()=>{
 const owned=await manual.createManualLead(counselor,form());
 const other=await manual.createManualLead(manager,form());
 const repeat=await manual.createManualLead(counselor,form({submissionId:'d21265d0-363f-4a4c-b777-0e67b36930db',country:'Italy'}));
 const matches=await crm.relatedEnquiries(counselor,owned.$id,'email',2);
 assert.deepEqual(matches.documents.map(row=>row.$id),[repeat.$id]);
 assert.equal(matches.total,1);
 assert.ok(queries.some(q=>q.method==='offset'&&q.values[0]===25));
 assert.ok(queries.some(q=>q.method==='limit'&&q.values[0]===25));
 assert.equal((await crm.relatedEnquiries(manager,owned.$id,'phone')).total,2);
 await assert.rejects(()=>crm.relatedEnquiries(counselor,other.$id,'email'),errorStatus(403));
 await assert.rejects(()=>crm.relatedEnquiries({...manager,active:false},owned.$id,'email'),errorStatus(403));
 await assert.rejects(()=>crm.relatedEnquiries(manager,owned.$id,'name'),errorStatus(400));
 leads.set(owned.$id,{...owned,phone:''});
 assert.equal((await crm.relatedEnquiries(manager,owned.$id,'phone')).total,0);
 assert.equal(leads.size,3);
 assert.equal(activities.size,3);
});


test('confirmed contact links are manager-only, versioned, reversible and preserve separate enquiries',async()=>{
 const first=await manual.createManualLead(manager,form());
 const second=await manual.createManualLead(counselor,form({country:'Italy'}));
 const change=(staff,id,operation,version,targetEnquiry='')=>crm.changeContactGroup(staff,id,form({contactOperation:operation,targetEnquiry,version:String(version)}));
 await assert.rejects(()=>change(counselor,second.$id,'create',1),errorStatus(403));
 await assert.rejects(()=>change(manager,second.$id,'join',1,first.$id),errorStatus(400));
 const anchor=await change(manager,first.$id,'create',1);
 await assert.rejects(()=>crm.changeContactGroup(manager,second.$id,form({
  contactOperation:'join',targetEnquiry:first.$id,version:'1',targetVersion:'1',
 })),errorStatus(409));
 options.failAudit=true;
 await assert.rejects(()=>change(manager,second.$id,'join',1,first.$id),error=>error.status===503);
 assert.equal(leads.get(second.$id).contactGroup,undefined);
 options.failAudit=false;
 const joined=await change(manager,second.$id,'join',1,first.$id);
 assert.deepEqual(joined,{...second,contactGroup:anchor.contactGroup,version:2});
 assert.deepEqual((await crm.contactEnquiries(manager,anchor,1)).documents.map(row=>row.$id),[second.$id]);
 assert.throws(()=>crm.contactEnquiries(counselor,joined,1),errorStatus(403));
 await assert.rejects(()=>change(manager,second.$id,'unlink',1),errorStatus(409));
 const unlinked=await change(manager,second.$id,'unlink',2);
 assert.equal(unlinked.contactGroup,'');
 assert.equal((await crm.contactEnquiries(manager,anchor,1)).total,0);
 assert.equal(leads.size,2);
});


test('duplicate decisions require confirmation and no dependent work, and restore the original stage',async()=>{
 const first=await manual.createManualLead(counselor,form());
 const second=await manual.createManualLead(manager,form());
 leads.set(first.$id,{...first,stage:'Contacted',contactGroup:'synthetic-group'});
 leads.set(second.$id,{...second,contactGroup:'synthetic-group',country:'Italy'});
 const mark=form({intent:'mark-duplicate',retainedEnquiry:second.$id,version:'1',targetVersion:'1',reason:'Same request'});
 await assert.rejects(()=>crm.resolveDuplicate(counselor,first.$id,mark),errorStatus(403));
 await assert.rejects(()=>crm.resolveDuplicate(manager,first.$id,mark),errorStatus(400));
 leads.set(second.$id,{...second,contactGroup:'synthetic-group'});
 for (const [name,store] of Object.entries(dependencies)) {
  if(name==='lead_views')continue;
  store.set('synthetic-dependent',{leadId:first.$id,status:'Open'});
  await assert.rejects(()=>crm.resolveDuplicate(manager,first.$id,mark),errorStatus(409),name);
  store.clear();
 }
 mark.set('targetVersion','2');
 await assert.rejects(()=>crm.resolveDuplicate(manager,first.$id,mark),errorStatus(409));
 mark.set('targetVersion','1');
 const archived=await crm.resolveDuplicate(manager,first.$id,mark);
 assert.equal(archived.stage,'Archived');
 assert.equal(archived.duplicateOf,second.$id);
 assert.equal(archived.owner,first.owner);
 await assert.rejects(()=>crm.createTask(counselor,first.$id,form()),errorStatus(409));
 await assert.rejects(()=>crm.resolveDuplicate(manager,second.$id,form({
  intent:'mark-duplicate',retainedEnquiry:first.$id,version:'1',targetVersion:'2',reason:'Same request',
 })),errorStatus(400));
 const restored=await crm.resolveDuplicate(manager,first.$id,form({
  intent:'restore-duplicate',version:'2',reason:'Keep both open',
 }));
 assert.equal(restored.stage,'Contacted');
 assert.equal(restored.duplicateOf,'');
 assert.equal(restored.version,3);
 assert.equal(leads.size,2);
});


test('saved lead views are private, idempotent and keep the current counselor scope',async()=>{
 await views.changeLeadView(manager,'save','New','Normal');
 await views.changeLeadView(manager,'save','New','Normal');
 await views.changeLeadView(counselor,'save','New','Normal');
 assert.equal((await views.leadViews(manager)).length,1);
 assert.equal((await views.leadViews(counselor)).length,1);
 await views.changeLeadView(counselor,'remove','New','Normal');
 await views.changeLeadView(counselor,'remove','New','Normal');
 assert.equal((await views.leadViews(counselor)).length,0);
 assert.equal((await views.leadViews(manager)).length,1);
 await assert.rejects(()=>views.changeLeadView(counselor,'save','lead@example.invalid',''),errorStatus(400));
 await assert.rejects(()=>views.changeLeadView({...manager,active:false},'remove','New','Normal'),errorStatus(403));
 await manual.createManualLead(manager,form());
 const assigned=await manual.createManualLead(counselor,form());
 assert.deepEqual((await crm.leadsFor(counselor,'','New',1,'Normal')).documents.map(row=>row.$id),[assigned.$id]);
 assert.equal((await crm.leadsFor(counselor,'','New',1,'Urgent')).total,0);
});


test('bulk changes enforce manager access, bounds and versions and report partial results',async()=>{
 const first=await manual.createManualLead(manager,form());
 const second=await manual.createManualLead(counselor,form());
 const fields=new FormData();
 fields.set('bulkPriority','Urgent');
 fields.append('selected',first.$id+':1');
 fields.append('selected',second.$id+':2');
 await assert.rejects(()=>bulk.bulkUpdateLeads(counselor,fields),errorStatus(403));
 fields.append('selected',first.$id+':1');
 await assert.rejects(()=>bulk.bulkUpdateLeads(manager,fields),errorStatus(400));
 fields.delete('selected');
 for(let i=0;i<11;i++)fields.append('selected','synthetic-'+i+':1');
 await assert.rejects(()=>bulk.bulkUpdateLeads(manager,fields),errorStatus(400));
 fields.delete('selected');
 fields.append('selected',first.$id+':1');
 fields.append('selected',second.$id+':2');
 assert.deepEqual((await bulk.bulkUpdateLeads(manager,fields)).map(row=>row.status),['saved','skipped']);
 assert.deepEqual(leads.get(first.$id),{...first,priority:'Urgent',version:2});
 assert.deepEqual(leads.get(second.$id),second);
 fields.delete('selected');
 fields.append('selected',first.$id+':2');
 fields.set('bulkStage','Archived');
 assert.equal((await bulk.bulkUpdateLeads(manager,fields))[0].status,'skipped');
 assert.equal(leads.get(first.$id).stage,'New');
});


test('bulk handoff transfers linked work, reports calendar conflicts, and clears the unassigned queue',async()=>{
 const first=await manual.createManualLead(manager,form());
 const second=await manual.createManualLead(manager,form({submissionId:'d21265d0-363f-4a4c-b777-0e67b36930dc'}));
 const slot={status:'Booked',startsAt:'2030-01-01T10:00:00Z',endsAt:'2030-01-01T11:00:00Z',owner:'',version:1};
 dependencies.appointments.set('first-slot',{$id:'first-slot',leadId:first.$id,...slot});
 dependencies.appointments.set('second-slot',{$id:'second-slot',leadId:second.$id,...slot});
 dependencies.tasks.set('open',{$id:'open',leadId:first.$id,status:'Open',owner:'',version:1});
 dependencies.tasks.set('complete',{$id:'complete',leadId:first.$id,status:'Completed',owner:'',version:1});
 dependencies.cases.set('case',{$id:'case',leadId:first.$id,owner:'',version:1});
 const fields=form({bulkOwner:counselor.$id,reason:'Capacity handoff'});
 fields.append('selected',first.$id+':1');
 fields.append('selected',second.$id+':1');
 assert.equal((await crm.leadsFor(manager,'','',1,'','-')).total,2);
 const results=await bulk.bulkUpdateLeads(manager,fields);
 assert.deepEqual(results.map(row=>row.status),['saved','skipped']);
 assert.match(results[1].message,/already has an appointment/);
 assert.equal(leads.get(first.$id).owner,counselor.$id);
 assert.equal(leads.get(second.$id).owner,'');
 assert.equal(dependencies.tasks.get('open').owner,counselor.$id);
 assert.equal(dependencies.tasks.get('complete').owner,'');
 assert.equal(dependencies.cases.get('case').owner,counselor.$id);
 assert.equal(dependencies.appointments.get('first-slot').owner,counselor.$id);
 assert.equal(dependencies.appointments.get('second-slot').owner,'');
 assert.deepEqual((await crm.leadsFor(manager,'','',1,'','-')).documents.map(row=>row.$id),[second.$id]);
 assert.deepEqual((await crm.leadsFor(counselor,'','',1,'','-')).documents.map(row=>row.$id),[first.$id]);
 const event=[...activities.values()].find(row=>row.event==='Lead updated');
 assert.equal(JSON.parse(event.details).reason,'Capacity handoff');
 fields.delete('selected');
 fields.append('selected',second.$id+':1');
 fields.set('reason','');
 await assert.rejects(()=>bulk.bulkUpdateLeads(manager,fields),errorStatus(400));
 fields.set('reason','Capacity handoff');
 fields.set('bulkOwner','synthetic-missing');
 assert.equal((await bulk.bulkUpdateLeads(manager,fields))[0].status,'skipped');
 fields.set('bulkOwner',manager.$id);
 options.failPatch='appointments';
 assert.equal((await bulk.bulkUpdateLeads(manager,fields))[0].status,'review');
 assert.equal(leads.get(second.$id).owner,'');
});
