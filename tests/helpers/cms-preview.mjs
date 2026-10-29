// Isolated local preview: in-memory synthetic data only; never connects to a real Appwrite endpoint.
import http from 'node:http';
import {spawn} from 'node:child_process';
const stores=Object.fromEntries(['posts','revisions','activities','locks','staff'].map(k=>[k,new Map()]));
stores.staff.set('synthetic-publisher',{$id:'synthetic-publisher',name:'Synthetic Publisher',role:'publisher',active:true,teamId:''});
const send=(response,status,value)=>{response.writeHead(status,{'Content-Type':'application/json'});response.end(JSON.stringify(value));};
const server=http.createServer(async(request,response)=>{
 try{
  const url=new URL(request.url,'http://127.0.0.1:4175');let raw='';for await(const chunk of request){raw+=chunk;if(raw.length>1500000)return send(response,413,{});}const body=raw?JSON.parse(raw):{};
  if(url.pathname==='/v1/account/sessions/email'&&request.method==='POST'){if(body.email!=='publisher@example.invalid'||body.password!=='synthetic-preview-password')return send(response,401,{});return send(response,201,{secret:'synthetic-preview-session',expire:'2030-01-01T00:00:00.000Z'});}
  if(url.pathname==='/v1/account'){if(request.headers['x-appwrite-session']!=='synthetic-preview-session')return send(response,401,{});return send(response,200,{$id:'synthetic-publisher'});}
  if(url.pathname==='/v1/account/sessions/current'&&request.method==='DELETE'){response.writeHead(204);return response.end();}
  const match=url.pathname.match(/^\/v1\/databases\/preview\/collections\/(posts|revisions|activities|locks|staff)\/documents(?:\/([^/]+))?$/);if(!match)return send(response,404,{});
  const [,collection,id]=match,store=stores[collection];
  if(request.method==='GET'){if(id)return store.has(id)?send(response,200,store.get(id)):send(response,404,{});let documents=[...store.values()];for(const q of url.searchParams.getAll('queries[]').map(JSON.parse)){if(q.method==='equal')documents=documents.filter(d=>q.values.includes(d[q.attribute]));if(q.method==='orderDesc')documents.sort((a,b)=>String(b[q.attribute]??'').localeCompare(String(a[q.attribute]??'')));}const total=documents.length;const queries=url.searchParams.getAll('queries[]').map(JSON.parse),offset=queries.find(q=>q.method==='offset')?.values[0]||0,limit=queries.find(q=>q.method==='limit')?.values[0]||100;return send(response,200,{documents:documents.slice(offset,offset+limit),total});}
  if(request.method==='POST'){if(store.has(body.documentId))return send(response,409,{});const doc={...body.data,$id:body.documentId,$createdAt:new Date().toISOString(),$updatedAt:new Date().toISOString()};store.set(doc.$id,doc);return send(response,201,doc);}
  if(request.method==='PATCH'){if(!store.has(id))return send(response,404,{});const doc={...store.get(id),...body.data,$updatedAt:new Date().toISOString()};store.set(id,doc);return send(response,200,doc);}
  if(request.method==='DELETE'){store.delete(id);response.writeHead(204);return response.end();}send(response,405,{});
 }catch{send(response,500,{type:'synthetic_fixture_error'});}
});
server.listen(4175,'127.0.0.1',()=>{
 const child=spawn(process.execPath,['scripts/start.mjs'],{stdio:'inherit',env:{...process.env,NODE_ENV:'development',HOST:'127.0.0.1',PORT:'4173',APP_SURFACE:'dashboard',DASHBOARD_URL:'http://127.0.0.1:4173',APPWRITE_ENDPOINT:'http://127.0.0.1:4175/v1',APPWRITE_PROJECT_ID:'synthetic',APPWRITE_DATABASE_ID:'preview',APPWRITE_API_KEY:'synthetic-local-preview-key',SESSION_SECRET:'synthetic-preview-signing-secret-at-least-32-characters'}});
 console.log('Isolated CMS preview at http://127.0.0.1:4173/admin/login; synthetic in-memory API only.');
 function stop(){child.kill('SIGTERM');server.close();}process.on('SIGTERM',stop);process.on('SIGINT',stop);child.on('exit',()=>server.close());
});
