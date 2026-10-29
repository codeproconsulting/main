import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url)),originalFetch=globalThis.fetch,originalEnv={...process.env};
let vite,media,storage,records,files,activities,failMetadata,loseMetadataAck,failCleanup,failAudit;
const user=role=>({$id:`synthetic-${role}`,name:'Synthetic test',role,active:true});
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aGN8AAAAASUVORK5CYII=','base64');
const image=()=>new File([png],'synthetic.png',{type:'image/png'});
const reply=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json'}});
const reject=status=>error=>error instanceof Response&&error.status===status;
function reset(){records=new Map();files=new Map();activities=new Map();failMetadata=loseMetadataAck=failCleanup=failAudit=false;}
before(async()=>{
 Object.assign(process.env,{NODE_ENV:'test',APPWRITE_ENDPOINT:'http://127.0.0.1/v1/',APPWRITE_PROJECT_ID:'synthetic',APPWRITE_API_KEY:'synthetic',APPWRITE_DATABASE_ID:'synthetic'});
 vite=await createServer({configFile:false,root,resolve:{alias:{'~':`${root}app`}},server:{middlewareMode:true,hmr:false,ws:false},logLevel:'error'});
 media=await vite.ssrLoadModule('/app/admin/media.server.ts');storage=await vite.ssrLoadModule('/app/admin/storage.server.ts');
 globalThis.fetch=async(input,options={})=>{
  const url=new URL(input),method=options.method||'GET';
  const doc=url.pathname.match(/\/collections\/(media|activities)\/documents(?:\/([^/]+))?$/);
  if(doc){const[,collection,id]=doc,store=collection==='media'?records:activities,payload=options.body?JSON.parse(options.body):null;
   if(method==='GET')return store.has(id)?reply(store.get(id)):reply({},404);
   if(method==='POST'){if(collection==='media'&&failMetadata)return reply({},503);if(collection==='activities'&&failAudit)return reply({},503);assert.deepEqual(payload.permissions,[]);const record={...payload.data,$id:payload.documentId};store.set(record.$id,record);if(collection==='media'&&loseMetadataAck)throw new Error('Lost acknowledgement');return reply(record);}
   if(method==='PATCH'){const record={...store.get(id),...payload.data};store.set(id,record);return reply(record);}
  }
  const file=url.pathname.match(/\/storage\/buckets\/crm-media\/files(?:\/([^/]+))?(?:\/(view|download))?$/);
  if(file){const[,id,view]=file;if(method==='POST'){const form=options.body,blob=form.get('file'),key=form.get('fileId');assert.equal(form.getAll('permissions[]').length,0);files.set(key,await blob.arrayBuffer());return reply({$id:key});}if(method==='DELETE'){if(failCleanup)return reply({},503);files.delete(id);return new Response(null,{status:204});}if(method==='GET'){if(!files.has(id))return reply({},404);return view?new Response(files.get(id)):reply({$id:id});}}
  throw new Error(`Unexpected synthetic request: ${method} ${url.pathname}`);
 };
});
after(async()=>{globalThis.fetch=originalFetch;await vite.close();for(const key of Object.keys(process.env))if(!(key in originalEnv))delete process.env[key];Object.assign(process.env,originalEnv);});
test('editor uploads private image; publisher exposes it and unpublishing revokes future reads',async()=>{
 reset();const saved=await media.uploadMedia(user('editor'),image(),' A tiny image ',' Caption ');assert.equal(saved.published,false);assert.equal(saved.alt,'A tiny image');assert.equal(saved.checksum.length,64);assert.equal(files.size,1);
 await assert.rejects(()=>media.publicMedia(saved.$id),reject(404));await assert.rejects(()=>media.setMediaVisibility(user('editor'),saved.$id,'true','false'),reject(403));
 await media.setMediaVisibility(user('publisher'),saved.$id,'true','false');let response=await media.publicMedia(saved.$id);assert.equal(response.headers.get('Content-Type'),'image/png');assert.equal(response.headers.get('Cache-Control'),'no-store');assert.equal(response.headers.get('X-Content-Type-Options'),'nosniff');assert.deepEqual(Buffer.from(await response.arrayBuffer()),png);
 await assert.rejects(()=>media.setMediaVisibility(user('publisher'),saved.$id,'false','false'),reject(409));
 await media.setMediaVisibility(user('publisher'),saved.$id,'false','true');await assert.rejects(()=>media.publicMedia(saved.$id),reject(404));assert.equal(activities.size,3);
});
test('media rejects empty/overlong alt, disallowed types, oversize and false signatures',async()=>{
 for(const [file,alt] of [[image(),' '],[image(),'a'.repeat(301)],[new File(['<svg/>'],'x.svg',{type:'image/svg+xml'}),'alt'],[new File(['not png'],'x.png',{type:'image/png'}),'alt'],[new File([new Uint8Array(5*1024*1024+1)],'x.png',{type:'image/png'}),'alt']]){reset();await assert.rejects(()=>media.uploadMedia(user('editor'),file,alt,''),reject(400));assert.equal(files.size,0);}
 reset();await assert.rejects(()=>media.uploadMedia(user('counselor'),image(),'alt',''),reject(403));assert.equal(activities.size,0);
});
test('metadata failure cleans file; lost metadata acknowledgement preserves linked file',async()=>{
 reset();failMetadata=true;await assert.rejects(()=>media.uploadMedia(user('editor'),image(),'alt',''));assert.equal(records.size,0);assert.equal(files.size,0);assert.equal(JSON.parse([...activities.values()][0].details).state,'pending');
 reset();loseMetadataAck=true;const saved=await media.uploadMedia(user('editor'),image(),'alt','');assert.equal(records.size,1);assert.equal(files.has(saved.fileId),true);assert.equal([...activities.values()][0].event,'Image uploaded');
});
test('failed cleanup is explicit and identified by pending audit; failed intent prevents upload',async()=>{
 reset();failMetadata=failCleanup=true;await assert.rejects(()=>media.uploadMedia(user('editor'),image(),'alt',''),error=>error instanceof Response&&error.status===503);
 assert.equal(files.size,1);assert.equal(files.has(JSON.parse([...activities.values()][0].details).fileId),true);
 reset();failAudit=true;await assert.rejects(()=>media.uploadMedia(user('editor'),image(),'alt',''));assert.equal(files.size,0);
});
test('missing/private/unsafe media cannot be served; missing file prevents publication',async()=>{
 reset();await assert.rejects(()=>media.publicMedia('missing'),reject(404));await assert.rejects(()=>media.publicMedia('../invalid'),reject(404));const saved=await media.uploadMedia(user('editor'),image(),'alt','');files.clear();await assert.rejects(()=>media.setMediaVisibility(user('publisher'),saved.$id,'true','false'),reject(503));assert.equal(records.get(saved.$id).published,false);
 records.set('unsafe',{$id:'unsafe',published:true,mime:'text/html'});await assert.rejects(()=>media.publicMedia('unsafe'),reject(404));
});
test('media request buffering enforces actual bytes even without Content-Length',async()=>{
 const form=new FormData();form.set('intent','upload');form.set('file',image());const parsed=await media.mediaForm(new Request('https://example.invalid',{method:'POST',body:form}));assert.equal(parsed.get('file').size,png.length);
 await assert.rejects(()=>media.mediaForm(new Request('https://example.invalid',{method:'POST',headers:{'Content-Type':'multipart/form-data; boundary=x'},body:new Uint8Array(6*1024*1024+1)})),reject(413));
 await assert.rejects(()=>media.mediaForm(new Request('https://example.invalid',{method:'POST',headers:{'Content-Type':'multipart/form-data; boundary=x','Content-Length':String(7*1024*1024)},body:'x'})),reject(413));
});
test('shared storage retains supported document signatures and rejects unsupported content',()=>{
 assert.equal(storage.fileSignature(Buffer.from('%PDF-1.7'),'application/pdf'),true);assert.equal(storage.fileSignature(png,'image/png'),true);assert.equal(storage.fileSignature(Buffer.from([255,216,255,224]),'image/jpeg'),true);assert.equal(storage.fileSignature(Buffer.from('RIFF1234WEBP'),'image/webp'),true);assert.equal(storage.fileSignature(png,'application/pdf'),false);
});
test('visibility rejects invalid state, concurrent stale update, and unavailable audit before mutation',async()=>{
 reset();const saved=await media.uploadMedia(user('editor'),image(),'alt','');
 await assert.rejects(()=>media.setMediaVisibility(user('publisher'),saved.$id,'invalid','false'),reject(400));
 failAudit=true;await assert.rejects(()=>media.setMediaVisibility(user('publisher'),saved.$id,'true','false'));assert.equal(records.get(saved.$id).published,false);failAudit=false;
 const result=await Promise.allSettled([media.setMediaVisibility(user('publisher'),saved.$id,'true','false'),media.setMediaVisibility(user('publisher'),saved.$id,'true','false')]);assert.equal(result[0].status,'fulfilled');assert.equal(result[1].status,'rejected');assert.equal(result[1].reason.status,409);
});
test('malformed multipart and missing/unsupported content types are rejected as client errors',async()=>{
 for(const headers of [{},{'Content-Type':'text/plain'},{'Content-Type':'multipart/form-data'}])await assert.rejects(()=>media.mediaForm(new Request('https://example.invalid',{method:'POST',headers,body:'broken'})),reject(400));
});
