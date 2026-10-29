// Operator-only synthetic round trip. No client files, publication or Auth changes.
import assert from 'node:assert/strict';
import {randomUUID,createHash} from 'node:crypto';
import {api,loadEnvironment} from './appwrite-client.mjs';
loadEnvironment();
if(!process.argv.includes('--apply'))throw new Error('Use --apply to create and remove one isolated private image and metadata record.');
const endpoint=process.env.APPWRITE_ENDPOINT?.replace(/\/$/,''),project=process.env.APPWRITE_PROJECT_ID,key=process.env.APPWRITE_API_KEY;
if(!endpoint||!project||!key)throw new Error('Appwrite environment is incomplete');
const id=randomUUID(),bucket=process.env.APPWRITE_MEDIA_BUCKET||'crm-media';
const filePath=`/storage/buckets/${bucket}/files/${id}`,docPath=`/databases/${process.env.APPWRITE_DATABASE_ID}/collections/media/documents/${id}`;
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aGN8AAAAASUVORK5CYII=','base64');
const checksum=createHash('sha256').update(png).digest('hex');
let cleanupFailed=false;
try{
 const form=new FormData();form.set('fileId',id);form.set('file',new File([png],'synthetic-media-check.png',{type:'image/png'}));
 const uploaded=await fetch(`${endpoint}/storage/buckets/${bucket}/files`,{method:'POST',headers:{'X-Appwrite-Project':project,'X-Appwrite-Key':key},body:form,signal:AbortSignal.timeout(45000)});
 assert.equal(uploaded.status,201,'Synthetic image upload must succeed');const info=await uploaded.json();assert.deepEqual(info.$permissions,[]);assert.equal(info.sizeOriginal,png.length);
 const doc=await api(docPath.slice(0,docPath.lastIndexOf('/')),'POST',{documentId:id,permissions:[],data:{fileId:id,name:'Synthetic media verification',alt:'One pixel test image',caption:'Disposable operator verification',mime:'image/png',checksum}});assert.deepEqual(doc.$permissions,[]);assert.equal(doc.published,false);
 const downloaded=await fetch(`${endpoint}${filePath}/download`,{headers:{'X-Appwrite-Project':project,'X-Appwrite-Key':key},signal:AbortSignal.timeout(45000)});assert.equal(downloaded.status,200);assert.equal(createHash('sha256').update(Buffer.from(await downloaded.arrayBuffer())).digest('hex'),checksum);
 for(const path of [filePath+'/view',docPath]){const denied=await fetch(endpoint+path,{headers:{'X-Appwrite-Project':project},signal:AbortSignal.timeout(30000)});assert.ok([401,403,404].includes(denied.status),'Anonymous direct access must be denied');await denied.body?.cancel();}
 console.log('PASS: private upload, metadata, byte-identical download and anonymous denial. Antivirus enabled is configuration evidence only.');
}finally{
 // IDs are chosen before requests so cleanup also covers lost acknowledgements.
 for(const path of [docPath,filePath])try{await api(path,'DELETE');}catch(error){if(error.status!==404){cleanupFailed=true;console.error(`Cleanup required for synthetic ID ${id}: ${path.includes('/collections/')?'metadata':'file'}`);}}
 if(cleanupFailed)process.exitCode=1;else console.log('Synthetic metadata and file cleanup complete.');
}
