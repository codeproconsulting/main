// Isolated local preview: in-memory synthetic data only; never connects to a real Appwrite endpoint.
import http from 'node:http';
import {spawn} from 'node:child_process';
import {remindDueTasks} from '../../scripts/remind-tasks.mjs';
const reminders=process.argv.includes('--reminders'),role=reminders?'manager':'publisher',userId=`synthetic-${role}`;
const stores=Object.fromEntries(['posts','revisions','activities','locks','staff','media','leads','tasks','notifications','worker_health'].map(k=>[k,new Map()]));
stores.staff.set(userId,{$id:userId,name:reminders?'Synthetic Manager':'Synthetic Publisher',role,active:true,teamId:''});
if(reminders){
 stores.leads.set('synthetic-lead',{$id:'synthetic-lead',$createdAt:new Date().toISOString(),name:'Synthetic enquiry',email:'lead@example.invalid',phone:'000',service:'Education',source:'Isolated preview',country:'',stage:'New',owner:userId,priority:'Normal',nextFollowUp:'',details:'{}',version:1});
 for(const [id,title]of [['reschedule','Review course shortlist'],['cancel','Confirm duplicate appointment'],['complete','Call to confirm documents']])stores.tasks.set(id,{$id:id,leadId:'synthetic-lead',owner:userId,title,dueAt:'2020-01-01T10:00:00.000Z',status:'Open',outcome:'',version:1});
}
const files=new Map();
const send=(response,status,value)=>{response.writeHead(status,{'Content-Type':'application/json'});response.end(JSON.stringify(value));};
const server=http.createServer(async(request,response)=>{
 try{
  const url=new URL(request.url,'http://127.0.0.1:4175');const chunks=[];let size=0;for await(const chunk of request){chunks.push(chunk);size+=chunk.length;if(size>6*1024*1024)return send(response,413,{});}const raw=Buffer.concat(chunks);
  const storage=url.pathname.match(/^\/v1\/storage\/buckets\/crm-media\/files(?:\/([^/]+))?(?:\/(view|download))?$/);
  if(storage){const[,id,view]=storage;if(request.method==='POST'){const form=await new Response(raw,{headers:{'Content-Type':request.headers['content-type']}}).formData();const file=form.get('file'),key=form.get('fileId');files.set(key,{bytes:Buffer.from(await file.arrayBuffer()),mime:file.type});return send(response,201,{$id:key,$permissions:[]});}if(request.method==='DELETE'){files.delete(id);response.writeHead(204);return response.end();}const file=files.get(id);if(!file)return send(response,404,{});if(view){response.writeHead(200,{'Content-Type':file.mime});return response.end(file.bytes);}return send(response,200,{$id:id});}
  const body=raw.length?JSON.parse(raw.toString()):{};
  if(url.pathname==='/v1/account/sessions/email'&&request.method==='POST'){if(body.email!==`${role}@example.invalid`||body.password!=='synthetic-preview-password')return send(response,401,{});return send(response,201,{secret:'synthetic-preview-session',expire:'2030-01-01T00:00:00.000Z'});}
  if(url.pathname==='/v1/account'){if(request.headers['x-appwrite-session']!=='synthetic-preview-session')return send(response,401,{});return send(response,200,{$id:userId});}
  if(url.pathname==='/v1/account/sessions/current'&&request.method==='DELETE'){response.writeHead(204);return response.end();}
  const match=url.pathname.match(/^\/v1\/databases\/preview\/collections\/(posts|revisions|activities|locks|staff|media|leads|tasks|notifications|worker_health)\/documents(?:\/([^/]+))?$/);if(!match)return send(response,404,{});
  const [,collection,id]=match,store=stores[collection];
  if(request.method==='GET'){if(id)return store.has(id)?send(response,200,store.get(id)):send(response,404,{});let documents=[...store.values()];for(const q of url.searchParams.getAll('queries[]').map(JSON.parse)){if(q.method==='equal')documents=documents.filter(d=>q.values.includes(d[q.attribute]));if(q.method==='lessThanEqual')documents=documents.filter(d=>d[q.attribute]<=q.values[0]);if(q.method==='orderAsc')documents.sort((a,b)=>String(a[q.attribute]??'').localeCompare(String(b[q.attribute]??'')));if(q.method==='orderDesc')documents.sort((a,b)=>String(b[q.attribute]??'').localeCompare(String(a[q.attribute]??'')));}const total=documents.length;const queries=url.searchParams.getAll('queries[]').map(JSON.parse),offset=queries.find(q=>q.method==='offset')?.values[0]||0,limit=queries.find(q=>q.method==='limit')?.values[0]||100;const cursor=queries.find(q=>q.method==='cursorAfter')?.values[0];if(cursor)documents=documents.slice(documents.findIndex(d=>d.$id===cursor)+1);return send(response,200,{documents:documents.slice(offset,offset+limit),total});}
  if(request.method==='POST'){if(store.has(body.documentId))return send(response,409,{});const doc={...body.data,$id:body.documentId,$createdAt:new Date().toISOString(),$updatedAt:new Date().toISOString()};store.set(doc.$id,doc);return send(response,201,doc);}
  if(request.method==='PATCH'){if(!store.has(id))return send(response,404,{});const doc={...store.get(id),...body.data,$updatedAt:new Date().toISOString()};store.set(id,doc);return send(response,200,doc);}
  if(request.method==='DELETE'){store.delete(id);response.writeHead(204);return response.end();}send(response,405,{});
 }catch{send(response,500,{type:'synthetic_fixture_error'});}
});
server.listen(4175,'127.0.0.1',async()=>{
 if(reminders){
  const api=async(path,method='GET',body)=>{const response=await fetch('http://127.0.0.1:4175/v1'+path,{method,headers:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});if(!response.ok)throw Object.assign(new Error('Synthetic fixture error'),{status:response.status});return response.status===204?undefined:response.json();};
  const allDocuments=async(collection,queries)=>{const search=new URLSearchParams();for(const q of queries)search.append('queries[]',q);return (await api(`/databases/preview/collections/${collection}/documents?${search}`)).documents;};
  await remindDueTasks({api,allDocuments,databaseId:'preview'});
 }

 const child=spawn(process.execPath,['scripts/start.mjs'],{stdio:'inherit',env:{...process.env,NODE_ENV:'development',HOST:'127.0.0.1',PORT:'4173',APP_SURFACE:'dashboard',DASHBOARD_URL:'http://127.0.0.1:4173',APPWRITE_ENDPOINT:'http://127.0.0.1:4175/v1',APPWRITE_PROJECT_ID:'synthetic',APPWRITE_DATABASE_ID:'preview',APPWRITE_API_KEY:'synthetic-local-preview-key',SESSION_SECRET:'synthetic-preview-signing-secret-at-least-32-characters'}});
 console.log('Isolated CMS preview at http://127.0.0.1:4173/admin/login; synthetic in-memory API only.');
 function stop(){child.kill('SIGTERM');server.close();}process.on('SIGTERM',stop);process.on('SIGINT',stop);child.on('exit',()=>server.close());
});
