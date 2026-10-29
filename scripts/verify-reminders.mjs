// Operator-only private schema/query check. Never runs the production worker.
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {api,loadEnvironment,q} from './appwrite-client.mjs';
loadEnvironment();if(!process.argv.includes('--apply'))throw new Error('Use --apply to create and clean up two isolated private verification records.');
const id=randomUUID(),now=new Date().toISOString(),base=`/databases/${process.env.APPWRITE_DATABASE_ID}/collections`;
const paths=[`${base}/notifications/documents/${id}`,`${base}/worker_health/documents/${id}`];
const endpoint=process.env.APPWRITE_ENDPOINT.replace(/\/$/,''),project=process.env.APPWRITE_PROJECT_ID;
let cleanupFailed=false;
async function list(collection,queries){const search=new URLSearchParams();for(const item of queries)search.append('queries[]',item);return api(`${base}/${collection}/documents?${search}`);}
try{
 const notice=await api(`${base}/notifications/documents`,'POST',{documentId:id,permissions:[],data:{recipient:id,entityId:id,sourceId:id,sourceVersion:1,dueAt:now,kind:'verification',title:'Synthetic schema verification',body:'Disposable private verification'}});
 assert.equal(notice.read,false);assert.deepEqual(notice.$permissions,[]);
 await api(paths[0],'PATCH',{data:{read:true}});assert.equal((await api(paths[0])).read,true);
 const page=await list('notifications',[q('equal','recipient',[id]),q('orderDesc','$createdAt'),q('orderDesc','$id'),q('limit',undefined,[25])]);assert.equal(page.documents.length,1);assert.equal(page.documents[0].$id,id);
 // Only check query compatibility; never enumerate or output real applicant rows.
 await list('tasks',[q('equal','status',['Open']),q('lessThanEqual','dueAt',[now]),q('limit',undefined,[1])]);
 const health=await api(`${base}/worker_health/documents`,'POST',{documentId:id,permissions:[],data:{worker:'synthetic-verification',status:'verification',startedAt:now,finishedAt:now,lastSuccessAt:'',summary:'{}',errorCount:0}});assert.deepEqual(health.$permissions,[]);
 for(const path of paths){const denied=await fetch(endpoint+path,{headers:{'X-Appwrite-Project':project},signal:AbortSignal.timeout(30000)});assert.ok([401,403,404].includes(denied.status));await denied.body?.cancel();}
 console.log('PASS: unread default, private notification/health CRUD, recipient ordering, due-task query and anonymous denial. Production worker/health unchanged.');
}finally{
 for(const path of paths)try{await api(path,'DELETE');}catch(error){if(error.status!==404){cleanupFailed=true;console.error(`Synthetic cleanup required for ${id} in ${path.includes('/notifications/')?'notifications':'worker_health'}`);}}
 if(cleanupFailed)process.exitCode=1;else console.log('Synthetic notification and health records removed.');
}
