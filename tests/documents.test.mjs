import test,{before,after,beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
import {fileURLToPath} from 'node:url';
import {documentScanner} from './helpers/document-scanner.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const originalFetch=globalThis.fetch;
const originalEnv={...process.env};
const counselor={$id:'assigned',role:'counselor',active:true};
const other={$id:'other',role:'counselor',active:true};
const manager={$id:'manager',role:'manager',active:true};
const pdf=Buffer.from('%PDF-1.4\n% synthetic fixture\n%%EOF\n');
const sample=()=>new File([pdf],'synthetic.pdf',{type:'application/pdf'});
const reject=status=>error=>error instanceof Response&&error.status===status;
const json=(value,status=200)=>Response.json(value,{status});
const leadId='synthetic-lead';
let vite,workflow,domain,storage,scanner,stores,files,ranges,behavior,scanned;

before(async()=>{
 scanner=await documentScanner(bytes=>{scanned=bytes.length;return behavior.verdict;});
 Object.assign(process.env,{NODE_ENV:'test',APPWRITE_ENDPOINT:'http://127.0.0.1/v1',APPWRITE_PROJECT_ID:'synthetic',APPWRITE_API_KEY:'synthetic',APPWRITE_DATABASE_ID:'synthetic',CRM_CLAMD_SOCKET:scanner.path});
 vite=await createServer({configFile:false,root,resolve:{alias:{'~':root+'app'}},server:{middlewareMode:true,hmr:false,ws:false},logLevel:'error'});
 workflow=await vite.ssrLoadModule('/app/admin/documents.server.ts');
 domain=await vite.ssrLoadModule('/app/admin/document-domain.ts');
 storage=await vite.ssrLoadModule('/app/admin/storage.server.ts');
 globalThis.fetch=async(input,options={})=>{
  const url=new URL(input);
  const method=options.method??'GET';
  const doc=url.pathname.match(/\/collections\/(leads|documents|activities)\/documents(?:\/([^/]+))?$/);
  if(doc){
   const [,collection,id]=doc;
   const store=stores[collection];
   const body=options.body&&JSON.parse(options.body);
   if(method==='GET'){
    if(id){
     if(collection==='documents'&&behavior.uncertain)return json({},503);
     return store.has(id)?json(store.get(id)):json({},404);
    }
    const queries=url.searchParams.getAll('queries[]').map(JSON.parse);
    const filters=queries.filter(q=>q.method==='equal');
    const records=[...store.values()].filter(item=>filters.every(q=>q.values.includes(item[q.attribute])));
    const cursor=queries.find(q=>q.method==='cursorAfter')?.values[0];
    const start=cursor?records.findIndex(item=>item.$id===cursor)+1:0;
    return json({documents:records.slice(start,start+100),total:records.length});
   }
   if(method==='POST'){
    if(collection==='activities'&&behavior.failAudit)return json({},503);
    if(collection==='documents'&&behavior.failMetadata)return json({},behavior.failMetadata);
    assert.deepEqual(body.permissions,[]);
    const record={...body.data,$id:body.documentId};
    store.set(record.$id,record);
    if(collection==='documents'&&behavior.loseMetadataAck)throw new Error('Lost acknowledgement');
    if(behavior.transferOnDownload&&record.event==='Document download requested')stores.leads.get(leadId).owner=other.$id;
    return json(record,201);
   }
   if(method==='PATCH'){
    const record={...store.get(id),...body.data};
    store.set(id,record);
    if(collection==='documents'&&behavior.loseReviewAck)throw new Error('Lost acknowledgement');
    return json(record);
   }
  }
  const file=url.pathname.match(/\/storage\/buckets\/crm-documents\/files(?:\/([^/]+))?(?:\/(download))?$/);
  if(file){
   const [,id,download]=file;
   if(method==='POST'){
    const form=options.body;
    const key=form.get('fileId');
    assert.deepEqual(form.getAll('permissions[]'),[]);
    assert.match(form.get('file').name,/^[a-f0-9-]+\.pdf$/);
    const buffer=Buffer.from(await form.get('file').arrayBuffer());
    const range=options.headers['Content-Range'];
    if(range){
     const [,start,end,total]=range.match(/^bytes (\d+)-(\d+)\/(\d+)$/).map(Number);
     assert.equal(start,files.get(key)?.length??0);
     assert.equal(buffer.length,end-start+1);
     if(start)assert.equal(options.headers['X-Appwrite-ID'],key);
     ranges.push(range);
     files.set(key,Buffer.concat([files.get(key)??Buffer.alloc(0),buffer]));
     return json({$id:key,sizeOriginal:total,chunksTotal:Math.ceil(total/(5*1024*1024)),chunksUploaded:ranges.length},201);
    }
    files.set(key,buffer);
    if(behavior.loseStorageAck)throw new Error('Lost acknowledgement');
    return json({$id:key},201);
   }
   if(method==='DELETE'){
    if(behavior.failCleanup)return json({},503);
    return files.delete(id)?new Response(null,{status:204}):json({},404);
   }
   if(method==='GET'&&download){
    behavior.downloads++;
    return files.has(id)?new Response(files.get(id),{headers:{'Content-Type':'text/html'}}):json({},404);
   }
  }
  throw new Error(`Unexpected synthetic request ${method} ${url.pathname}`);
 };
});
beforeEach(()=>{
 stores={leads:new Map([[leadId,{$id:leadId,owner:counselor.$id}]]),documents:new Map(),activities:new Map()};
 files=new Map();
 ranges=[];
 behavior={verdict:'stream: OK\0',downloads:0};
 scanned=0;
 process.env.CRM_CLAMD_SOCKET=scanner.path;
});
after(async()=>{
 globalThis.fetch=originalFetch;
 await vite?.close();
 await scanner?.close();
 for(const key of Object.keys(process.env))if(!(key in originalEnv))delete process.env[key];
 Object.assign(process.env,originalEnv);
});
const upload=(file=sample(),category='Passport',expiry='')=>workflow.uploadClientDocument(counselor,leadId,file,category,expiry);
const saved=()=>[...stores.documents.values()][0];
const event=()=>[...stores.activities.values()][0];

test('requires current lead access, size, matching extension/signature and valid calendar date',async()=>{
 for(const file of [
  new File([],'empty.pdf',{type:'application/pdf'}),
  new File([pdf],'wrong.jpg',{type:'application/pdf'}),
  new File(['spoof'],'spoof.pdf',{type:'application/pdf'}),
  new File([new Uint8Array(domain.documentLimit+1)],'large.pdf',{type:'application/pdf'}),
 ])await assert.rejects(()=>upload(file),reject(400));
 await assert.rejects(()=>upload(sample(),'Unknown'),reject(400));
 await assert.rejects(()=>upload(sample(),'Passport','2027-02-29'),reject(400));
 await assert.rejects(()=>workflow.uploadClientDocument(other,leadId,sample(),'Passport',''),reject(403));
 assert.equal(scanned,0);
 assert.equal(stores.activities.size,0);
 assert.equal(files.size,0);
});

test('scanner rejects detected content, scanner errors and absent socket before any storage or audit write',async()=>{
 behavior.verdict='stream: Synthetic.Test FOUND\0';
 await assert.rejects(()=>upload(),reject(422));
 assert.equal(scanned,pdf.length);
 for(const verdict of ['stream: scan limit ERROR\0','stream: OK','stream: OK\0extra']){
  behavior.verdict=verdict;
  await assert.rejects(()=>upload(),reject(503));
 }
 delete process.env.CRM_CLAMD_SOCKET;
 await assert.rejects(()=>upload(),reject(503));
 process.env.CRM_CLAMD_SOCKET='/tmp/nonexistent-proconsulting-test.sock';
 await assert.rejects(()=>upload(),reject(503));
 assert.equal(stores.activities.size,0);
 assert.equal(files.size,0);
});

test('uploads at the maximum size in Appwrite chunks after a complete scan',async()=>{
 const bytes=Buffer.alloc(domain.documentLimit);
 pdf.copy(bytes);
 await upload(new File([bytes],'large.pdf',{type:'application/pdf'}));
 assert.equal(scanned,bytes.length);
 assert.equal(ranges.length,4);
 assert.deepEqual(files.get(saved().fileId),bytes);
 assert.equal(saved().fileId,saved().$id);
 assert.ok(saved().scannedAt);
 assert.equal(event().event,'Document uploaded');
});

test('download returns a private attachment only after audit and current lead access',async()=>{
 await upload();
 const { $id }=saved();
 await assert.rejects(()=>workflow.downloadClientDocument(other,$id),reject(403));
 await assert.rejects(()=>workflow.downloadClientDocument({$id:'editor',role:'editor'},$id),reject(403));
 behavior.failAudit=true;
 await assert.rejects(()=>workflow.downloadClientDocument(counselor,$id));
 behavior.failAudit=false;
 assert.equal(behavior.downloads,0);
 const response=await workflow.downloadClientDocument(counselor,$id);
 assert.equal(response.headers.get('Content-Type'),'application/octet-stream');
 assert.equal(response.headers.get('Content-Disposition'),'attachment; filename="synthetic.pdf"');
 assert.equal(response.headers.get('Cache-Control'),'private, no-store');
 assert.equal(response.headers.get('X-Content-Type-Options'),'nosniff');
 assert.deepEqual(Buffer.from(await response.arrayBuffer()),pdf);
 behavior.transferOnDownload=true;
 await assert.rejects(()=>workflow.downloadClientDocument(counselor,$id),reject(403));
 assert.equal(behavior.downloads,1);
 assert.equal((await workflow.downloadClientDocument(other,$id)).status,200);
 delete saved().scannedAt;
 await assert.rejects(()=>workflow.downloadClientDocument(manager,$id),reject(409));
});

test('review checks version, lead, audit, expiry and lost acknowledgment',async()=>{
 await upload();
 const id=saved().$id;
 const review=(staff=counselor,expected='0')=>workflow.reviewClientDocument(staff,leadId,id,'Accepted','2028-02-29','Synthetic review',expected);
 await assert.rejects(()=>review(other),reject(403));
 stores.leads.set('another',{$id:'another',owner:counselor.$id});
 await assert.rejects(()=>workflow.reviewClientDocument(counselor,'another',id,'Accepted','','','0'),reject(403));
 behavior.failAudit=true;
 await assert.rejects(()=>review());
 assert.equal(saved().status,'Pending review');
 behavior.failAudit=false;
 behavior.loseReviewAck=true;
 await review();
 assert.equal(saved().expiresAt,'2028-02-29T18:59:59.999Z');
 assert.equal(domain.expiryDay(saved().expiresAt),'2028-02-29');
 assert.equal(domain.documentState(saved(),Date.parse('2028-02-29T12:00:00Z')),'Accepted');
 assert.equal(domain.documentState(saved(),Date.parse('2028-02-29T19:00:00Z')),'Expired');
 await assert.rejects(()=>review(),reject(409));
 assert.equal([...stores.activities.values()].at(-1).event,'Document reviewed');
});

test('rolls back absent metadata, preserves committed metadata and records uncertain orphans',async()=>{
 behavior.failAudit=true;
 await assert.rejects(()=>upload());
 assert.equal(files.size,0);
 behavior.failAudit=false;
 behavior.failMetadata=400;
 await assert.rejects(()=>upload(),reject(503));
 assert.equal(files.size,0);
 assert.equal(event().event,'Document upload rolled back');
 behavior.failMetadata=503;
 await assert.rejects(()=>upload(),reject(503));
 assert.equal(files.size,1);
 assert.equal(JSON.parse([...stores.activities.values()].at(-1).details).state,'pending');
 files.clear();
 behavior.uncertain=true;
 await assert.rejects(()=>upload(),reject(503));
 assert.equal(files.size,1);
 assert.equal(JSON.parse([...stores.activities.values()].at(-1).details).state,'pending');
 behavior.uncertain=behavior.failMetadata=false;
 behavior.loseMetadataAck=true;
 await upload();
 assert.ok(files.has(saved().fileId));
 assert.equal([...stores.activities.values()].at(-1).event,'Document uploaded');
 behavior.loseStorageAck=true;
 await assert.rejects(()=>upload(),reject(503));
 assert.equal(stores.documents.size,1);
 assert.ok(files.has(JSON.parse([...stores.activities.values()].at(-1).details).fileId));
});

test('document listing paginates and body limits apply to measured bytes',async()=>{
 for(let index=0;index<105;index++){
  const id='synthetic-'+index;
  stores.documents.set(id,{$id:id,leadId,category:'Passport'});
 }
 stores.documents.set('different',{$id:'different',leadId:'another'});
 assert.equal((await workflow.documentsFor(counselor,leadId)).documents.length,105);
 const request=new Request('https://example.invalid',{method:'POST',headers:{'Content-Type':'multipart/form-data; boundary=x','Content-Length':'1'},body:new Uint8Array(1025)});
 await assert.rejects(()=>storage.boundedUploadForm(request,1024,'Document'),reject(413));
});
