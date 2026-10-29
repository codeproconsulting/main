import {randomUUID,randomBytes} from 'node:crypto';
import {api,loadEnvironment,q} from './appwrite-client.mjs';
import {schema} from './appwrite-schema.mjs';
loadEnvironment();
const db=`/databases/${process.env.APPWRITE_DATABASE_ID}`;
for(const [id,definition]of Object.entries(schema)){
 const collection=await api(`${db}/collections/${id}`);
 if(collection.$permissions?.length)throw new Error(`${id}: broad collection permissions found`);
 const attrs=await api(`${db}/collections/${id}/attributes`),indexes=await api(`${db}/collections/${id}/indexes`);
 for(const key of Object.keys(definition.fields))if(!attrs.attributes.some(a=>a.key===key&&a.status==='available'))throw new Error(`${id}.${key}: missing/unavailable attribute`);
 for(const key of Object.keys(definition.indexes))if(!indexes.indexes.some(i=>i.key===key&&i.status==='available'))throw new Error(`${id}.${key}: missing/unavailable index`);
 console.log(`${id}: attributes/indexes ready; collection private`);
}
if(!process.argv.includes('--exercise'))process.exit(0);
const id=randomUUID(),password=randomBytes(48).toString('base64url');
const created=[];let userCreated=false,session;
async function create(collection,data){const doc=await api(`${db}/collections/${collection}/documents`,'POST',{documentId:id,data,permissions:[]});created.push([collection,doc.$id]);return doc;}
try{
 await api('/users','POST',{userId:id,email:`crm-verification-${id}@example.invalid`,password,name:'Synthetic verification account'});userCreated=true;
 await create('staff',{name:'Synthetic verification account',role:'counselor',active:true,teamId:''});
 session=await api('/account/sessions/email','POST',{email:`crm-verification-${id}@example.invalid`,password});
 if(!session.secret)throw new Error('SSR session secret was not returned; verify sessions.write scope');
 const accountResponse=await fetch(process.env.APPWRITE_ENDPOINT+'/account',{headers:{'X-Appwrite-Project':process.env.APPWRITE_PROJECT_ID,'X-Appwrite-Session':session.secret},signal:AbortSignal.timeout(15000)});
 if(!accountResponse.ok||(await accountResponse.json()).$id!==id)throw new Error('Session-based account check failed');
 await create('leads',{name:'Synthetic verification enquiry',email:'synthetic@example.invalid',phone:'+441234567890',service:'Education',source:'verification-script',country:'United Kingdom',stage:'New',owner:id,priority:'Normal',nextFollowUp:'',details:'{}',version:1});
 await create('tasks',{leadId:id,title:'Synthetic verification task',owner:id,dueAt:new Date().toISOString(),status:'Open',outcome:'',version:1});
 await create('activities',{actor:id,entityId:id,entityType:'lead',event:'Synthetic verification',details:'{}'});
 await create('posts',{title:'Synthetic verification article',slug:`verification-${id}`,section:'education',status:'draft',body:'<p>Synthetic verification only.</p>',excerpt:'',image:'',publishedAt:'',metaTitle:'',metaDescription:'',author:'Synthetic',legacyId:'',version:1});
 for(const [collection,queries]of [['leads',[q('equal','owner',[id]),q('search','name',['verification']),q('orderDesc','$createdAt')]],['tasks',[q('equal','owner',[id]),q('equal','status',['Open']),q('orderAsc','dueAt')]],['posts',[q('equal','section',['education']),q('equal','status',['draft']),q('orderDesc','publishedAt')]]]){
  const params=new URLSearchParams();for(const query of queries)params.append('queries[]',query);const result=await api(`${db}/collections/${collection}/documents?${params}`);if(!result.documents.some(d=>d.$id===id))throw new Error(`${collection}: representative query failed`);
 }
 const denied=await fetch(process.env.APPWRITE_ENDPOINT+`${db}/collections/leads/documents/${id}`,{headers:{'X-Appwrite-Project':process.env.APPWRITE_PROJECT_ID,'X-Appwrite-Session':session.secret},signal:AbortSignal.timeout(15000)});
 if(denied.ok)throw new Error('Private document unexpectedly accessible directly via user session');
 console.log('Synthetic verification passed: SSR session, private CRUD, indexed CRM queries, and denied direct client access.');
}finally{
 const failures=[];
 if(session?.secret)try{const response=await fetch(process.env.APPWRITE_ENDPOINT+'/account/sessions/current',{method:'DELETE',headers:{'X-Appwrite-Project':process.env.APPWRITE_PROJECT_ID,'X-Appwrite-Session':session.secret}});if(!response.ok)failures.push('session');}catch{failures.push('session');}
 for(const[collection,docId]of created.reverse())try{await api(`${db}/collections/${collection}/documents/${docId}`,'DELETE');}catch{failures.push(collection);}
 if(userCreated)try{await api(`/users/${id}`,'DELETE');}catch{failures.push('user');}
 if(failures.length)throw new Error(`Synthetic verification cleanup needs attention: ${failures.join(', ')}, run ${id}`);
 console.log('Synthetic verification resources removed.');
}
