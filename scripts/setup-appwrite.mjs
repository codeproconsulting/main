import {api,loadEnvironment} from './appwrite-client.mjs';
import {schema} from './appwrite-schema.mjs';
loadEnvironment();
const apply=process.argv.includes('--apply');
const only=process.argv.find(a=>a.startsWith('--only='))?.slice(7);
if(only&&!Object.hasOwn(schema,only))throw new Error('Unknown collection in --only');
const db=process.env.APPWRITE_DATABASE_ID;
if(!db)throw new Error('Set APPWRITE_DATABASE_ID');
const base=`/databases/${db}`;
console.log(`${apply?'APPLY':'DRY RUN'}: additive CRM setup for database ${db}`);
async function ensure(path,createPath,body) {try{return await api(path);}catch(e){if(e.status!==404)throw e;if(!apply){console.log(`Would create: ${path}`);return null;}await api(createPath,'POST',body);console.log(`Created: ${path}`);return null;}}
await ensure(base,'/databases',{databaseId:db,name:'ProConsulting Workspace',enabled:true});
for(const [id,definition] of Object.entries(schema)) {
 if(only&&id!==only)continue;
 const path=`${base}/collections/${id}`;
 const existing=await ensure(path,`${base}/collections`,{collectionId:id,name:id,permissions:[],documentSecurity:true,enabled:true});
 if(existing?.$permissions?.length)throw new Error(`${id} has broad permissions; review before continuing`);
 if(!apply&&!existing) {console.log(`${id}: ${Object.keys(definition.fields).length} attributes, ${Object.keys(definition.indexes).length} indexes`);continue;}
 const attributes=await api(`${path}/attributes`);
 for(const [key,type] of Object.entries(definition.fields)) {
  const found=attributes.attributes.find(a=>a.key===key);
  if(found){
   if(found.status==='failed')throw new Error(`${id}.${key} failed: ${found.error}`);
   // New media defaults private; new notifications default unread.
   if(((id==='media'&&key==='published')||(id==='notifications'&&key==='read'))&&found.default!==false){
    if(apply){await api(`${path}/attributes/boolean/${key}`,'PATCH',{required:false,default:false});console.log(`${id}.${key}: default set to false (existing records unchanged)`);}
    else console.log(`Would set ${id}.${key} default to false (existing records unchanged)`);
   }
   continue;
  }
  if(!apply){console.log(`Would add: ${id}.${key}`);continue;}
  const kind=typeof type==='number'?'string':type;
  await api(`${path}/attributes/${kind}`,'POST',{key,required:false,...(kind==='string'?{size:type,default:''}:kind==='integer'?{default:1}:{default:!(((id==='media'&&key==='published')||(id==='notifications'&&key==='read')))})});
 }
 if(!apply)continue;
 for(let attempt=0;attempt<60;attempt++) {
  const current=await api(`${path}/attributes`);
  if(current.attributes.some(a=>a.status==='failed'))throw new Error(`${id}: attribute creation failed`);
  if(current.attributes.length===Object.keys(definition.fields).length&&current.attributes.every(a=>a.status==='available'))break;
  if(attempt===59)throw new Error(`${id}: attributes not ready; safely rerun setup`);
  await new Promise(r=>setTimeout(r,1000));
 }
 const indexes=await api(`${path}/indexes`);
 for(const [key,spec] of Object.entries(definition.indexes)) {
  const found=indexes.indexes.find(i=>i.key===key);if(found){if(found.status==='failed')throw new Error(`${id}.${key}: index failed`);continue;}
  await api(`${path}/indexes`,'POST',{key,type:Array.isArray(spec)?'key':spec.type,attributes:Array.isArray(spec)?spec:spec.attributes});
 }
 console.log(`${id}: schema configured; no public collection permissions`);
}
console.log('Setup complete. Run again to verify; provision an Appwrite Auth user and matching staff profile before login.');
