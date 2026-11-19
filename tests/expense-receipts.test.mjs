import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
import {fileURLToPath} from 'node:url';
import {documentScanner} from './helpers/document-scanner.mjs';

test('expense receipts require scanned files and current owner access, preserve private metadata and audit downloads',async()=>{
 const root=fileURLToPath(new URL('../',import.meta.url));
 const vite=await createServer({configFile:false,root,resolve:{alias:{'~':root+'app'}},server:{middlewareMode:true,hmr:false,ws:false},logLevel:'error'});
 const originalFetch=globalThis.fetch,originalEnv={...process.env};
 const id='a'.repeat(32),owner={$id:'owner',active:true,role:'owner'};
 const expense={$id:id,description:'Synthetic office expense'};
 let role='owner',verdict='stream: OK\0',failUpload=false;
 const files=new Map(),events=[];
 const scanner=await documentScanner(()=>verdict);
 try{
 Object.assign(process.env,{NODE_ENV:'test',APPWRITE_ENDPOINT:'http://127.0.0.1/v1',APPWRITE_PROJECT_ID:'synthetic',APPWRITE_DATABASE_ID:'synthetic',APPWRITE_API_KEY:'synthetic',CRM_CLAMD_SOCKET:scanner.path});
 globalThis.fetch=async(input,options={})=>{
  const url=new URL(input);
  if(url.pathname.endsWith('/staff/documents/owner'))return Response.json({...owner,role});
  if(url.pathname.includes('/storage/')){
   if(options.method==='POST'){
    if(failUpload)throw Error('Synthetic upload interruption');
    const fileId=options.body.get('fileId'),file=options.body.get('file');
    files.set(fileId,new Uint8Array(await file.arrayBuffer()));
    return Response.json({$id:fileId});
   }
   const fileId=url.pathname.split('/').at(-2);
   assert.ok(files.has(fileId));
   return new Response(files.get(fileId));
  }
  if(url.pathname.endsWith('/expenses/documents/'+id)){
   if(options.method==='PATCH')Object.assign(expense,JSON.parse(options.body).data);
   return Response.json(expense);
  }
  if(url.pathname.includes('/activities/documents')){
   if(options.method==='POST'){events.push(JSON.parse(options.body).data);return Response.json({$id:'event'});}
   return Response.json({});
  }
  assert.fail('Unexpected request');
 };
 const service=await vite.ssrLoadModule('/app/admin/expense-receipts.server.ts');
 const pdf=()=>new File(['%PDF-synthetic receipt'],'receipt.pdf',{type:'application/pdf'});
 for(const role of ['admin','manager','counselor']){
  await assert.rejects(service.attachExpenseReceipt({...owner,role},id,pdf()),e=>e.status===403);
  await assert.rejects(service.downloadExpenseReceipt({...owner,role},id),e=>e.status===403);
 }
 await assert.rejects(service.attachExpenseReceipt(owner,id,new File(['bad'],'bad.pdf',{type:'application/pdf'})),e=>e.status===400);
 verdict='stream: synthetic FOUND\0';
 await assert.rejects(service.attachExpenseReceipt(owner,id,pdf()),e=>e.status===422);
 assert.equal(files.size,0);
 verdict='stream: OK\0';role='admin';
 await assert.rejects(service.attachExpenseReceipt(owner,id,pdf()),e=>e.status===403);
 role='owner';failUpload=true;
 await assert.rejects(service.attachExpenseReceipt(owner,id,pdf()),e=>e.status===503);
 assert.equal(expense.receiptFileId,undefined);
 failUpload=false;
 await service.attachExpenseReceipt(owner,id,pdf());
 assert.equal(files.size,1);
 assert.match(expense.receiptChecksum,/^[a-f0-9]{64}$/);
 const view=await service.expenseReceipt(owner,id);
 assert.deepEqual(view,{id,description:expense.description,receiptName:'receipt.pdf'});
 assert.ok(!JSON.stringify(view).includes('receiptFileId'));
 await assert.rejects(service.attachExpenseReceipt(owner,id,pdf()),e=>e.status===409);
 const download=await service.downloadExpenseReceipt(owner,id);
 assert.equal(download.headers.get('Cache-Control'),'private, no-store');
 assert.match(download.headers.get('Content-Disposition'),/attachment/);
 assert.equal(await download.text(),'%PDF-synthetic receipt');
 assert.ok(events.some(event=>event.event==='Receipt download requested'));
 expense.receiptScannedAt='';
 await assert.rejects(service.downloadExpenseReceipt(owner,id),e=>e.status===404);
 }finally{
 globalThis.fetch=originalFetch;
 for(const key of Object.keys(process.env))if(!(key in originalEnv))delete process.env[key];
 Object.assign(process.env,originalEnv);await scanner.close();await vite.close();
 }
});
