import test, { after, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root=fileURLToPath(new URL('../',import.meta.url));
const originalFetch=globalThis.fetch;
const originalEnv={...process.env};
const owner='owner-one', otherOwner='owner-two', counselor='counselor-one', replacement='counselor-two', admin='admin-one';
const reply=(body,status=200)=>Response.json(body,{status});
const status=code=>error=>error instanceof Response&&error.status===code;
const staff=(id,role)=>({$id:id,$updatedAt:'2030-01-01T00:00:00.000Z',name:'Synthetic '+id,role,active:true,teamId:''});
const request=(options={})=>new Request('http://localhost/admin/team',options);
let vite,team,auth,crm,stores,identities,sessions,behavior;

before(async()=>{
 Object.assign(process.env,{
  NODE_ENV:'test',APPWRITE_ENDPOINT:'http://127.0.0.1/v1',APPWRITE_PROJECT_ID:'synthetic',
  APPWRITE_API_KEY:'synthetic',APPWRITE_DATABASE_ID:'synthetic',SESSION_SECRET:'test-only-signing-material-for-fixture',
 });
 delete process.env.DASHBOARD_URL;
 vite=await createServer({configFile:false,root,resolve:{alias:{'~':root+'app'}},server:{middlewareMode:true,hmr:false,ws:false},logLevel:'error'});
 [team,auth,crm]=await Promise.all(['team','auth','crm'].map(name=>vite.ssrLoadModule('/app/admin/'+name+'.server.ts')));
 globalThis.fetch=async(input,options={})=>{
  const url=new URL(input);
  const method=options.method??'GET';
  const path=url.pathname;
  const payload=options.body&&JSON.parse(options.body);
  if(path==='/v1/account/sessions/email'&&method==='POST'){
   const id=payload.email.split('@')[0];
   if(!identities.get(id)?.status)return reply({},401);
   const secret=crypto.randomUUID();
   sessions.set(secret,id);
   return reply({secret,expire:'2035-01-01T00:00:00.000Z'},201);
  }
  if(path==='/v1/account'&&method==='GET'){
   const id=sessions.get(options.headers['X-Appwrite-Session']);
   return id?reply({$id:id}):reply({},401);
  }
  if(path==='/v1/account/sessions/current'&&method==='DELETE'){
   sessions.delete(options.headers['X-Appwrite-Session']);
   return new Response(null,{status:204});
  }
  const user=path.match(/^\/v1\/users\/([^/]+)(\/sessions)?$/);
  if(user){
   const [,id,sessionPath]=user;
   if(!identities.has(id))return reply({},404);
   if(!sessionPath&&method==='GET')return reply(identities.get(id));
   if(sessionPath&&method==='DELETE'){
    behavior.revocations.push(id);
    if(behavior.failRevocation)return reply({},503);
    for(const [key,value] of sessions)if(value===id)sessions.delete(key);
    return new Response(null,{status:204});
   }
  }
  const match=path.match(/\/collections\/(\w+)\/documents(?:\/([^/]+))?$/);
  if(!match||!stores[match[1]])throw new Error('Unexpected synthetic route');
  const [,collection,id]=match;
  const records=stores[collection];
  if(method==='GET'){
   if(id)return records.has(id)?reply(records.get(id)):reply({},404);
   let rows=[...records.values()];
   let limit=100;
   for(const query of url.searchParams.getAll('queries[]').map(JSON.parse)){
    if(query.method==='equal')rows=rows.filter(row=>query.values.includes(row[query.attribute]));
    if(query.method==='orderAsc')rows.sort((a,b)=>String(a[query.attribute]).localeCompare(String(b[query.attribute])));
    if(query.method==='cursorAfter')rows=rows.slice(rows.findIndex(row=>row.$id===query.values[0])+1);
    if(query.method==='limit')limit=query.values[0];
   }
   return reply({documents:rows.slice(0,limit),total:rows.length});
  }
  if(collection==='activities'&&behavior.failAudit&&method==='POST')return reply({},503);
  if(collection==='activities'&&behavior.failAuditCompletion&&method==='PATCH')return reply({},503);
  if(collection==='staff'&&behavior.failProfile)return reply({},behavior.failProfile);
  if(collection==='leads'&&behavior.failLeadWrite)return reply({},503);
  if(collection==='locks'&&method==='DELETE'){records.delete(id);return new Response(null,{status:204});}
  if(collection==='locks'&&records.has(payload.documentId))return reply({},409);
  if(collection==='staff'&&behavior.rejectPendingRewrite&&payload.data.revocationPending)throw new Error('Retry must not rewrite the unchanged inactive profile');
  if(collection==='staff'&&behavior.failClear&&payload.data.revocationPending==='')return reply({},503);
  if(method==='POST')assert.deepEqual(payload.permissions,[]);
  const key=id??payload.documentId;
  const updated={...records.get(key),...payload.data,$id:key,$updatedAt:new Date(Date.UTC(2030,0,1,0,0,++behavior.revision)).toISOString()};
  records.set(key,updated);
  if(collection==='staff'&&behavior.loseProfileAck)throw new Error('Lost acknowledgement');
  return reply(updated,method==='POST'?201:200);
 };
});

beforeEach(()=>{
 stores=Object.fromEntries(['staff','leads','activities','tasks','cases','appointments','locks'].map(collection=>[collection,new Map()]));
 for(const [id,role] of [[owner,'owner'],[admin,'admin'],[counselor,'counselor'],[replacement,'counselor']])stores.staff.set(id,staff(id,role));
 identities=new Map([...stores.staff.keys(),otherOwner,'new-staff'].map(id=>[id,{$id:id,status:true}]));
 sessions=new Map();
 behavior={revocations:[],revision:0};
});

after(async()=>{
 globalThis.fetch=originalFetch;
 await vite?.close();
 for(const key of Object.keys(process.env))if(!(key in originalEnv))delete process.env[key];
 Object.assign(process.env,originalEnv);
});

function access(id, overrides={}){
 const row=stores.staff.get(id);
 const form=new FormData();
 for(const [key,value] of Object.entries({
  id,name:row?.name??'Synthetic addition',role:row?.role??'counselor',active:String(row?.active??true),
  teamId:row?.teamId??'',expected:row?.$updatedAt??'',...overrides,
 }))form.set(key,value);
 return form;
}
const edit=(id,fields,actor=owner)=>team.updateStaffAccess(stores.staff.get(actor),access(id,fields));
function leadForHandoff(assigned=counselor){
 stores.leads.set('lead-one',{$id:'lead-one',owner:assigned,stage:'New',priority:'Normal',version:1});
}
function handoff(target,actor=owner){
 const form=new FormData();
 for(const [key,value] of Object.entries({owner:target,stage:'New',priority:'Normal',version:'1',reason:'Synthetic handoff'}))form.set(key,value);
 return crm.updateLead(stores.staff.get(actor),'lead-one',form);
}
async function cookie(id){
 const response=await auth.signIn(request({method:'POST',headers:{Origin:'http://localhost'}}),id+'@example.invalid','synthetic');
 return response.headers.get('Set-Cookie').split(';')[0];
}

test('only active owner/admin may manage staff, and admins cannot edit or grant owner access',async()=>{
 await assert.rejects(()=>edit(counselor,{active:'false'},counselor),status(403));
 await assert.rejects(()=>edit(admin,{active:'false'},admin),status(403));
 await assert.rejects(()=>edit(owner,{role:'admin'},admin),status(403));
 await assert.rejects(()=>edit(counselor,{role:'owner'},admin),status(403));
 await assert.rejects(()=>team.teamFor(stores.staff.get(admin),new URLSearchParams('edit='+owner)),status(403));
 const current=stores.staff.get(admin);
 const downgraded={...current,role:'counselor'};
 stores.staff.set(admin,downgraded);
 await assert.rejects(()=>team.updateStaffAccess(current,access(counselor,{active:'false'})),status(403));
 assert.equal(stores.activities.size,0);
});

test('concurrent cross-deactivations preserve the last active owner',async()=>{
 stores.staff.set(otherOwner,staff(otherOwner,'owner'));
 const results=await Promise.allSettled([
  edit(otherOwner,{active:'false'},owner),
  edit(owner,{active:'false'},otherOwner),
 ]);
 assert.equal(results.filter(result=>result.status==='fulfilled').length,1);
 assert.equal(results.find(result=>result.status==='rejected').reason.status,403);
 assert.equal([...stores.staff.values()].filter(row=>row.role==='owner'&&row.active).length,1);
 assert.deepEqual(behavior.revocations,[otherOwner]);
});

test('requires an enabled existing identity and rejects stale or duplicate profile forms',async()=>{
 await assert.rejects(()=>edit('missing',{}),status(400));
 identities.get('new-staff').status=false;
 await assert.rejects(()=>edit('new-staff',{}),status(400));
 identities.get('new-staff').status=true;
 const form=access('new-staff',{teamId:'Synthetic branch'});
 await team.updateStaffAccess(stores.staff.get(admin),form);
 assert.equal(stores.staff.get('new-staff').teamId,'Synthetic branch');
 await assert.rejects(()=>team.updateStaffAccess(stores.staff.get(admin),form),status(409));
 const stale=access('new-staff',{role:'publisher'});
 await edit('new-staff',{role:'editor'});
 await assert.rejects(()=>team.updateStaffAccess(stores.staff.get(owner),stale),status(409));
});

test('requires a lead handoff before deactivation or removal of CRM permissions',async()=>{
 leadForHandoff();
 stores.tasks.set('task-one',{$id:'task-one',leadId:'lead-one',owner:counselor,status:'Open',version:1});
 await assert.rejects(()=>edit(counselor,{active:'false'}),status(409));
 await assert.rejects(()=>edit(counselor,{role:'editor'}),status(409));
 await handoff(replacement);
 assert.equal(stores.tasks.get('task-one').owner,replacement);
 await assert.rejects(()=>crm.leadFor(stores.staff.get(counselor),'lead-one'),status(403));
 await edit(counselor,{active:'false'});
 assert.equal(stores.staff.get(counselor).active,false);
});

test('serializes assignment with deactivation in either order',async()=>{
 leadForHandoff('');
 let release,entered;
 const gate=new Promise(resolve=>release=resolve);
 const holding=new Promise(resolve=>entered=resolve);
 const lock=crm.serialized(crm.staffAccessLock,async()=>{entered();await gate;});
 await holding;
 const remove=edit(counselor,{active:'false'});
 const assign=handoff(counselor);
 release();
 await lock;
 await remove;
 await assert.rejects(()=>assign,status(403));
 assert.equal(stores.leads.get('lead-one').owner,'');

 // Pause the assignment under the staff lock just before its write.
 await edit(counselor,{active:'true'});
 const base=globalThis.fetch;
 let finish,reach;
 const wait=new Promise(resolve=>finish=resolve);
 const reached=new Promise(resolve=>reach=resolve);
 globalThis.fetch=async(input,options)=>{
  if(options.method==='PATCH'&&String(input).endsWith('/collections/leads/documents/lead-one')){reach();await wait;}
  return base(input,options);
 };
 try{
  const assigning=handoff(counselor);
  await reached;
  const removing=edit(counselor,{active:'false'});
  finish();
  await assigning;
  await assert.rejects(()=>removing,status(409));
 }finally{globalThis.fetch=base;}
 assert.equal(stores.staff.get(counselor).active,true);
});

test('revocation failure immediately blocks CRM, persists retry and prevents premature reactivation',async()=>{
 const signedIn=await cookie(counselor);
 assert.equal((await auth.requireStaff(request({headers:{Cookie:signedIn}}))).$id,counselor);
 behavior.failRevocation=true;
 assert.deepEqual(await edit(counselor,{active:'false'}),{pending:true});
 assert.ok(stores.staff.get(counselor).revocationPending);
 await assert.rejects(()=>auth.requireStaff(request({headers:{Cookie:signedIn}})),status(403));
 await assert.rejects(()=>cookie(counselor));
 await assert.rejects(()=>edit(counselor,{active:'true'}),status(409));
 behavior.failRevocation=false;
 behavior.rejectPendingRewrite=true;
 assert.deepEqual(await edit(counselor,{active:'false'}),{pending:false});
 assert.equal(stores.staff.get(counselor).revocationPending,'');
 await assert.rejects(()=>auth.requireStaff(request({headers:{Cookie:signedIn}})),status(302));
 await edit(counselor,{active:'true'});
 assert.equal((await auth.requireStaff(request({headers:{Cookie:await cookie(counselor)}}))).$id,counselor);
});

test('failed profile or audit writes preserve access and avoid premature session revocation',async()=>{
 behavior.failAudit=true;
 await assert.rejects(()=>edit(counselor,{active:'false'}));
 behavior.failAudit=false;
 behavior.failProfile=400;
 await assert.rejects(()=>edit(counselor,{active:'false'}),status(503));
 assert.equal(stores.staff.get(counselor).active,true);
 assert.deepEqual(behavior.revocations,[]);
 behavior.failProfile=false;
 behavior.loseProfileAck=true;
 behavior.failAuditCompletion=true;
 await edit(counselor,{active:'false'});
 assert.equal(stores.staff.get(counselor).active,false);
 assert.equal(stores.staff.get(counselor).revocationPending,'');
 assert.deepEqual(behavior.revocations,[counselor]);
});

test('a failed marker clear remains safe and revocation can be repeated',async()=>{
 behavior.failClear=true;
 assert.deepEqual(await edit(counselor,{active:'false'}),{pending:true});
 assert.equal(stores.staff.get(counselor).active,false);
 behavior.failClear=false;
 assert.deepEqual(await edit(counselor,{active:'false'}),{pending:false});
 assert.deepEqual(behavior.revocations,[counselor,counselor]);
});


test('unconfirmed profile or assignment writes retain the persistent staff lock',async()=>{
 process.env.NODE_ENV='development';
 try{
  behavior.failProfile=503;
  await assert.rejects(()=>edit(counselor,{active:'false'}),status(503));
  assert.equal([...stores.locks.values()][0].key,crm.staffAccessLock);
  await assert.rejects(()=>edit(replacement,{active:'false'}),status(409));
  assert.deepEqual(behavior.revocations,[]);
  // Isolated fixture simulates operator clearance after reconciliation.
  stores.locks.clear();
  behavior.failProfile=false;
  leadForHandoff('');
  behavior.failLeadWrite=true;
  await assert.rejects(()=>handoff(counselor),status(503));
  assert.ok([...stores.locks.values()].some(lock=>lock.key===crm.staffAccessLock));
  await assert.rejects(()=>edit(counselor,{active:'false'}),status(409));
 }finally{process.env.NODE_ENV='test';}
});
