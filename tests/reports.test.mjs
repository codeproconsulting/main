import test, { after, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const originalFetch=globalThis.fetch;
const originalEnv={...process.env};
const staff={ $id:'synthetic-manager',role:'manager',active:true };
const refresh=async()=>staff;
const isStatus=expected=>error=>error instanceof Response&&error.status===expected;
let vite,reports,leads,requests,audits,failAudit,repeatPage;

function makeLead(index, fields={}){
 return {
  $id:String(index).padStart(5,'0'),$createdAt:'2030-01-01T00:00:00.000Z',
  name:'Synthetic',email:'lead@example.invalid',phone:'+123',stage:'New',
  country:'',owner:'',source:'Synthetic form',details:'Never exported',
  ...fields,
 };
}

before(async()=>{
 Object.assign(process.env,{APPWRITE_ENDPOINT:'http://127.0.0.1/v1',APPWRITE_PROJECT_ID:'synthetic',APPWRITE_DATABASE_ID:'synthetic',APPWRITE_API_KEY:'synthetic'});
 vite=await createServer({configFile:false,root,resolve:{alias:{'~':root+'app'}},server:{middlewareMode:true,hmr:false,ws:false},logLevel:'error'});
 reports=await vite.ssrLoadModule('/app/admin/reports.server.ts');
 globalThis.fetch=async(input,options)=>{
  const url=new URL(input);
  if(url.pathname.endsWith('/collections/leads/documents')){
   const queries=url.searchParams.getAll('queries[]').map(JSON.parse);
   const filters=Object.fromEntries(queries.map(item=>[item.method,item.values??item.attribute]));
   assert.equal(filters.orderAsc,'$id');
   assert.ok(filters.limit[0]<=100);
   requests.push(filters);
   const start=filters.cursorAfter&&!repeatPage?leads.findIndex(lead=>lead.$id===filters.cursorAfter[0])+1:0;
   const documents=leads.slice(start,start+filters.limit[0]).map(lead=>
    Object.fromEntries(filters.select.map(key=>[key,lead[key]])));
   // Deliberately inaccurate provider total, including for the cap cases.
   return Response.json({documents,total:0});
  }
  if(url.pathname.endsWith('/collections/activities/documents')&&options.method==='POST'){
   if(failAudit)return Response.json({}, {status:503});
   audits.push(JSON.parse(options.body).data);
   return Response.json({$id:'synthetic-audit'});
  }
  throw new Error('Unexpected synthetic request');
 };
});
beforeEach(()=>{leads=[];requests=[];audits=[];failAudit=false;repeatPage=false;});
after(async()=>{
 globalThis.fetch=originalFetch;
 await vite.close();
 for(const key of Object.keys(process.env))if(!(key in originalEnv))delete process.env[key];
 Object.assign(process.env,originalEnv);
});

test('inactive managers and roles outside management cannot read reports or export',async()=>{
 for(const denied of [{...staff,active:false},...['counselor','editor','publisher'].map(role=>({...staff,role}))]){
  await assert.rejects(()=>reports.operationalReport(denied),isStatus(403));
  await assert.rejects(()=>reports.exportLeads(denied,refresh),isStatus(403));
 }
 assert.equal(requests.length,0);
 assert.equal(audits.length,0);
 for(const role of ['owner','admin','manager']){
  assert.equal((await reports.operationalReport({...staff,role})).total,0);
 }
});

test('report scans across pages with only grouping fields and handles unusual labels',async()=>{
 leads=Array.from({length:103},(_,i)=>makeLead(i,{
  owner:i<60?'assigned':'',stage:i<10?'Converted':'New',
  source:i<50?'__proto__':i<90?'constructor':i%2?'':'Secondary',
  country:i<30?'Pakistan':'',
 }));
 const report=await reports.operationalReport(staff);
 assert.deepEqual([report.total,report.unassigned,report.converted,report.truncated],[103,43,10,false]);
 assert.deepEqual(report.sources.rows,[['__proto__',50],['constructor',40],['Secondary',7],['Unknown',6]]);
 assert.deepEqual(report.countries.rows,[['Unknown',73],['Pakistan',30]]);
 assert.equal(requests.length,2);
 assert.deepEqual(requests[0].select,['$id','stage','source','country','owner']);
 assert.deepEqual(requests[1].cursorAfter,['00099']);
 assert.equal(audits.length,0);
});

test('long breakdowns retain the sum in a remaining-groups row',async()=>{
 leads=Array.from({length:25},(_,i)=>makeLead(i,{source:'Source '+i}));
 const {sources}=await reports.operationalReport(staff);
 assert.equal(sources.rows.length,20);
 assert.equal(sources.remainder,5);
});

test('exactly 10,000 leads can be exported, while one more flags the report and prevents export',async()=>{
 leads=Array.from({length:reports.reportLimit},(_,i)=>makeLead(i));
 const exact=await reports.operationalReport(staff);
 assert.equal(exact.truncated,false);
 assert.equal(exact.total,10_000);
 assert.deepEqual(requests.at(-1).limit,[1]);
 const response=await reports.exportLeads(staff,refresh);
 assert.equal((await response.text()).split('\r\n').length,10_002);
 assert.equal(audits.length,1);
 leads.push(makeLead(10_000));
 const overflow=await reports.operationalReport(staff);
 assert.equal(overflow.total,10_000);
 assert.equal(overflow.truncated,true);
 await assert.rejects(()=>reports.exportLeads(staff,refresh),isStatus(413));
 assert.equal(audits.length,1);
});

test('inconsistent cursor data fails rather than returning partial totals or CSV',async()=>{
 leads=Array.from({length:101},(_,i)=>makeLead(i));
 repeatPage=true;
 await assert.rejects(()=>reports.operationalReport(staff),isStatus(503));
 await assert.rejects(()=>reports.exportLeads(staff,refresh),isStatus(503));
 assert.equal(audits.length,0);
});

test('CSV is an audited attachment with a field allowlist and formula-safe quoting',async()=>{
 leads=[makeLead(0,{name:'=1+1',source:'A "quote",\nnew line',country:'\u200b＋1'})];
 const response=await reports.exportLeads(staff,refresh);
 assert.equal(response.headers.get('cache-control'),'private, no-store');
 assert.equal(response.headers.get('content-disposition'),'attachment; filename="proconsulting-leads.csv"');
 assert.equal(response.headers.get('x-content-type-options'),'nosniff');
 const bytes=Buffer.from(await response.arrayBuffer());
 assert.deepEqual([...bytes.subarray(0,3)],[239,187,191]);
 const body=bytes.toString();
 assert.ok(body.includes('"'+"'"+'=1+1"'));
 assert.ok(body.includes('"A ""quote"",\nnew line"'));
 assert.ok(body.includes('"'+"'"+'\u200b＋1"'));
 assert.ok(body.includes('"'+"'"+'+123"'));
 assert.ok(!body.includes('Never exported'));
 assert.equal(requests[0].select.includes('details'),false);
 assert.equal(audits[0].actor,staff.$id);
 assert.deepEqual(JSON.parse(audits[0].details),{count:1});
 assert.equal(reports.csvCell('\tSynthetic'),'"'+"'"+'\tSynthetic"');
});

test('access is checked again and audit failure prevents releasing the file',async()=>{
 leads=[makeLead(0)];
 await assert.rejects(()=>reports.exportLeads(staff,async()=>({...staff,role:'counselor'})),isStatus(403));
 await assert.rejects(()=>reports.exportLeads(staff,async()=>({...staff,$id:'other'})),isStatus(403));
 assert.equal(audits.length,0);
 failAudit=true;
 await assert.rejects(()=>reports.exportLeads(staff,refresh),error=>error.status===503);
});
