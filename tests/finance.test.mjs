import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
import {fileURLToPath} from 'node:url';
test('office expenses enforce owner access, exact pence and idempotent writes',async()=>{
 const root=fileURLToPath(new URL('../',import.meta.url));
 const vite=await createServer({configFile:false,root,resolve:{alias:{'~':root+'app'}},server:{middlewareMode:true,hmr:false,ws:false},logLevel:'error'});
 const oldFetch=globalThis.fetch, oldEnv={...process.env};
 const rows=new Map(),owner={$id:'owner',role:'owner',active:true};
 let role='owner',lost=false,calls=0;
 try{
 Object.assign(process.env,{NODE_ENV:'test',APPWRITE_ENDPOINT:'http://127.0.0.1/v1',APPWRITE_DATABASE_ID:'synthetic',APPWRITE_PROJECT_ID:'synthetic',APPWRITE_API_KEY:'synthetic'});
 globalThis.fetch=async(input,options)=>{
  calls++;
  const url=new URL(input);
  if(url.pathname.endsWith('/staff/documents/owner'))return Response.json({...owner,role});
  const id=url.pathname.split('/').at(-1);
  if(options.method==='POST'){
   const {documentId,data,permissions}=JSON.parse(options.body);
   assert.deepEqual(permissions,[]);
   if(rows.has(documentId))return Response.json({}, {status:409});
   rows.set(documentId,{$id:documentId,...data});
   if(lost){lost=false;throw Error('Synthetic lost acknowledgement');}
   return Response.json(rows.get(documentId));
  }
  if(options.method==='PATCH'){
   const {data}=JSON.parse(options.body);
   if(!rows.has(id))return Response.json({}, {status:404});
   rows.set(id,{...rows.get(id),...data});
   if(lost){lost=false;throw Error('Synthetic lost acknowledgement');}
   return Response.json(rows.get(id));
  }
  if(url.search){
   const queries=url.searchParams.getAll('queries[]').map(JSON.parse);
   assert.ok(queries.find(q=>q.method==='select').values.every(v=>!['recordedBy'].includes(v)));
   const start=queries.find(q=>q.method==='greaterThanEqual').values[0];
   const end=queries.find(q=>q.method==='lessThan').values[0];
   return Response.json({documents:[...rows.values()].filter(r=>r.spentOn>=start&&r.spentOn<end),total:rows.size});
  }
  return rows.has(id)?Response.json(rows.get(id)):Response.json({}, {status:404});
 };
 const {recordExpense,expenseMonth,voidExpense}=await vite.ssrLoadModule('/app/admin/finance.server.ts');
 const form=(extra={})=>{
  const f=new FormData();
  for(const [k,v]of Object.entries({submissionId:'12345678-1234-1234-1234-123456789012',description:'Synthetic rent',category:'Rent',spentOn:'2030-12-31',amount:'12.30',...extra}))f.set(k,v);
  return f;
 };
 for(const role of ['admin','manager','counselor','editor']){
  await assert.rejects(recordExpense({...owner,role},form()),e=>e.status===403);
  await assert.rejects(expenseMonth({...owner,role},'2030-12'),e=>e.status===403);
 }
 assert.equal(calls,0);
 for(const extra of [{amount:'1.001'},{amount:'-1'},{amount:'0'},{amount:'1e2'},{spentOn:'2030-02-30'},{spentOn:'2030-13-01'},{description:''},{category:'Unknown'}]){
  await assert.rejects(recordExpense(owner,form(extra)),e=>e.status===400);
 }
 role='admin';
 await assert.rejects(recordExpense(owner,form()),e=>e.status===403);
 role='owner';lost=true;
 await assert.rejects(recordExpense(owner,form()));
 const id=await recordExpense(owner,form());
 assert.equal(rows.size,1);
 assert.equal(rows.get(id).amountMinor,'1230');
 await assert.rejects(recordExpense(owner,form({amount:'12.31'})),e=>e.status===409);
 const report=await expenseMonth(owner,'2030-12');
 assert.equal(report.totalMinor,1230);
 assert.equal(report.expenses.length,1);
 assert.equal(report.totals.find(r=>r.category==='Rent').amountMinor,1230);
 assert.ok(!Object.hasOwn(report.expenses[0],'recordedBy'));
 assert.equal((await expenseMonth(owner,'2031-01')).totalMinor,0);
 for(const role of ['admin','manager','counselor'])await assert.rejects(voidExpense({...owner,role},id,'Correction'),e=>e.status===403);
 await assert.rejects(voidExpense(owner,id,''),e=>e.status===400);
 lost=true;
 await assert.rejects(voidExpense(owner,id,'Incorrect entry'),e=>e.status===503);
 assert.equal(rows.get(id).voidReason,'Incorrect entry');
 await voidExpense(owner,id,'Incorrect entry');
 await assert.rejects(voidExpense(owner,id,'Different reason'),e=>e.status===409);
 const corrected=await expenseMonth(owner,'2030-12');
 assert.equal(corrected.totalMinor,0);
 assert.equal(corrected.expenses.length,1);
 assert.equal(corrected.expenses[0].voidReason,'Incorrect entry');
 assert.equal(rows.get(id).amountMinor,'1230');
 assert.ok(!Object.hasOwn(corrected.expenses[0],'voidedBy'));

 }finally{
 globalThis.fetch=oldFetch;
 for(const k of Object.keys(process.env))if(!(k in oldEnv))delete process.env[k];
 Object.assign(process.env,oldEnv);await vite.close();
 }
});
