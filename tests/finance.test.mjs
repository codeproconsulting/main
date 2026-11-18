import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
import {fileURLToPath} from 'node:url';
test('office expenses enforce owner access, exact pence and idempotent writes',async()=>{
 const root=fileURLToPath(new URL('../',import.meta.url));
 const vite=await createServer({configFile:false,root,resolve:{alias:{'~':root+'app'}},server:{middlewareMode:true,hmr:false,ws:false},logLevel:'error'});
 const oldFetch=globalThis.fetch, oldEnv={...process.env};
 const budgets=new Map();
 const rows=new Map(),owner={$id:'owner',role:'owner',active:true};
 let role='owner',lost=false,calls=0,failAudit=false;
 const audits=[];
 try{
 Object.assign(process.env,{NODE_ENV:'test',APPWRITE_ENDPOINT:'http://127.0.0.1/v1',APPWRITE_DATABASE_ID:'synthetic',APPWRITE_PROJECT_ID:'synthetic',APPWRITE_API_KEY:'synthetic'});
 globalThis.fetch=async(input,options)=>{
  calls++;
  const url=new URL(input);
  if(url.pathname.endsWith('/staff/documents/owner'))return Response.json({...owner,role});
  const store=url.pathname.includes("/expense_budgets/")?budgets:rows;
  const id=url.pathname.split('/').at(-1);
  if(options.method==='POST' && url.pathname.endsWith('/activities/documents')){
   if(failAudit)return Response.json({}, {status:503});
   const body=JSON.parse(options.body);
   audits.push(body.data);
   return Response.json({$id:'synthetic-audit',...body.data});
  }
  if(options.method==='POST'){
   const {documentId,data,permissions}=JSON.parse(options.body);
   assert.deepEqual(permissions,[]);
   if(store.has(documentId))return Response.json({}, {status:409});
   store.set(documentId,{$id:documentId,...data});
   if(lost){lost=false;throw Error('Synthetic lost acknowledgement');}
   return Response.json(store.get(documentId));
  }
  if(options.method==='PATCH'){
   const {data}=JSON.parse(options.body);
   if(!store.has(id))return Response.json({}, {status:404});
   store.set(id,{...store.get(id),...data});
   if(lost){lost=false;throw Error('Synthetic lost acknowledgement');}
   return Response.json(store.get(id));
  }
  if(url.search){
   const queries=url.searchParams.getAll('queries[]').map(JSON.parse);
   assert.ok(queries.find(q=>q.method==='select').values.every(v=>!['recordedBy'].includes(v)));
   const start=queries.find(q=>q.method==='greaterThanEqual').values[0];
   const end=queries.find(q=>q.method==='lessThan').values[0];
   return Response.json({documents:[...store.values()].filter(r=>r.spentOn>=start&&r.spentOn<end),total:store.size});
  }
  return store.has(id)?Response.json(store.get(id)):Response.json({}, {status:404});
 };
 const {recordExpense,expenseMonth,voidExpense,exportExpenses,saveOfficeBudget}=await vite.ssrLoadModule('/app/admin/finance.server.ts');
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
 for(const row of rows.values()){delete row.payee;delete row.paymentMethod;delete row.reference;}
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

 rows.get(id).description='=SYNTHETIC("quoted")';
 rows.get(id).voidReason='@fixture';
 await assert.rejects(exportExpenses(owner,'2030-12',async()=>({...owner,role:'admin'})),e=>e.status===403);
 failAudit=true;
 await assert.rejects(exportExpenses(owner,'2030-12',async()=>owner));
 failAudit=false;
 const download=await exportExpenses(owner,'2030-12',async()=>owner);
 assert.equal(download.headers.get('Cache-Control'),'private, no-store');
 assert.match(download.headers.get('Content-Disposition'),/2030-12.csv/);
 const csv=await download.text();
 assert.match(csv,/"12.30","Voided"/);
 assert.match(csv,/"'=SYNTHETIC\(""/);
 assert.match(csv,/"'@fixture"/);
 assert.doesNotMatch(csv,/recordedBy|voidedBy/);
 assert.equal(audits.length,1);
 assert.deepEqual(JSON.parse(audits[0].details),{month:'2030-12',count:1});

 await assert.rejects(saveOfficeBudget({...owner,role:'admin'},'2030-12','100','0'),e=>e.status===403);
 await saveOfficeBudget(owner,'2030-12','100.10','0');
 assert.equal(budgets.get('2030-12').amountMinor,'10010');
 const planned=await expenseMonth(owner,'2030-12');
 assert.equal(planned.budget.remainingMinor,10010);
 await saveOfficeBudget(owner,'2030-12','100.10','0');
 assert.equal(budgets.get('2030-12').version,1);
 await assert.rejects(saveOfficeBudget(owner,'2030-12','101','0'),e=>e.status===409);
 failAudit=true;
 await assert.rejects(saveOfficeBudget(owner,'2030-12','10','1'));
 assert.equal(budgets.get('2030-12').version,1);
 failAudit=false;
 await saveOfficeBudget(owner,'2030-12','10','1');
 rows.get(id).voidedAt='';
 assert.equal((await expenseMonth(owner,'2030-12')).budget.remainingMinor,-230);
 assert.equal((await expenseMonth(owner,'2031-01')).budget,null);

 const paymentForm=form({submissionId:'12345678-1234-1234-1234-123456789013',spentOn:'2032-01-01',
  payee:'Synthetic supplier',paymentMethod:'Bank transfer',reference:'=SYNTHETIC-REF'});
 await assert.rejects(recordExpense(owner,form({paymentMethod:'Unknown'})),e=>e.status===400);
 const paidId=await recordExpense(owner,paymentForm);
 assert.equal(rows.get(paidId).payee,'Synthetic supplier');
 assert.equal(rows.get(paidId).paymentMethod,'Bank transfer');
 assert.equal(await recordExpense(owner,paymentForm),paidId);
 paymentForm.set('reference','Different reference');
 await assert.rejects(recordExpense(owner,paymentForm),e=>e.status===409);
 const paymentReport=await expenseMonth(owner,'2032-01');
 assert.equal(paymentReport.expenses[0].reference,'=SYNTHETIC-REF');
 const paymentCSV=await (await exportExpenses(owner,'2032-01',async()=>owner)).text();
 assert.match(paymentCSV,/"Payee","Payment method","Reference"/);
 assert.match(paymentCSV,/"'=SYNTHETIC-REF"/);

 }finally{
 globalThis.fetch=oldFetch;
 for(const k of Object.keys(process.env))if(!(k in oldEnv))delete process.env[k];
 Object.assign(process.env,oldEnv);await vite.close();
 }
});
