import {createHash,randomUUID} from 'node:crypto';
import {api,loadEnvironment,allDocuments,q} from './appwrite-client.mjs';
loadEnvironment();
const base=`/databases/${process.env.APPWRITE_DATABASE_ID}/collections`;
const idFor=key=>createHash('sha256').update(key).digest('hex').slice(0,32);
async function lock(key,work){const id=idFor(key);try{await api(`${base}/locks/documents`,'POST',{documentId:id,data:{key,owner:'worker-'+randomUUID(),acquiredAt:new Date().toISOString()},permissions:[]});}catch(e){if(e.status===409)return false;throw e;}try{await work();}finally{await api(`${base}/locks/documents/${id}`,'DELETE');}return true;}
async function notify(recipient,entityId,title,body,key,kind='lead'){
 if(!recipient)return;
 try{const staff=await api(`${base}/staff/documents/${recipient}`);if(!staff.active)return;}catch(e){if(e.status===404)return;throw e;}
 try{await api(`${base}/notifications/documents`,'POST',{documentId:idFor(key),data:{recipient,entityId,title,body,kind,read:false},permissions:[]});}catch(e){if(e.status!==409)throw e;}
}
export async function tick(){
 const now=new Date().toISOString();let reminders=0,published=0;
 const tasks=await allDocuments('tasks',[q('equal','status',['Open']),q('lessThanEqual','dueAt',[now])]);
 for(const task of tasks){await lock(`lead:${task.leadId}`,async()=>{
  let lead;try{lead=await api(`${base}/leads/documents/${task.leadId}`);}catch(e){if(e.status===404)return;throw e;}
  const current=await api(`${base}/tasks/documents/${task.$id}`);
  if(current.status!=='Open'||current.dueAt>now||!lead.owner||['Archived','Lost','Not eligible'].includes(lead.stage))return;
  await notify(lead.owner,lead.$id,`Follow-up due: ${current.title}`,`Due ${current.dueAt}. Open the lead to record an outcome.`,`task:${current.$id}:${current.version}:${lead.owner}`);reminders++;
 });}
 const posts=await allDocuments('posts',[q('equal','status',['scheduled']),q('lessThanEqual','publishedAt',[now])]);
 for(const post of posts){await lock(`post:${post.$id}`,async()=>{
  const current=await api(`${base}/posts/documents/${post.$id}`);
  if(current.status!=='scheduled'||!current.publishedAt||current.publishedAt>now)return;
  await api(`${base}/posts/documents/${post.$id}`,'PATCH',{data:{status:'published',version:current.version+1}});published++;
 });}
 const appointments=await allDocuments('appointments',[q('equal','status',['Booked']),q('lessThanEqual','startsAt',[new Date(Date.now()+3600000).toISOString()]),q('greaterThan','startsAt',[now])]);
 for(const item of appointments){const lead=await api(`${base}/leads/documents/${item.leadId}`).catch(e=>{if(e.status===404)return null;throw e;});if(lead?.owner)await notify(lead.owner,item.leadId,`Appointment in the next hour: ${item.title}`,item.startsAt,`appointment:${item.$id}:${item.startsAt}:${lead.owner}`);}
 const cases=await allDocuments('cases',[q('lessThanEqual','deadline',[new Date(Date.now()+3*86400000).toISOString()]),q('greaterThan','deadline',[now])]);
 for(const item of cases){if(['Enrolled','Approved','Refused','Withdrawn'].includes(item.stage))continue;const lead=await api(`${base}/leads/documents/${item.leadId}`).catch(e=>{if(e.status===404)return null;throw e;});if(lead?.owner)await notify(lead.owner,item.leadId,'Application deadline approaching',`${item.institution||item.kind}: ${item.deadline}`,`case:${item.$id}:${item.deadline}:${lead.owner}`);}
 console.log(JSON.stringify({at:now,tasksChecked:tasks.length,remindersChecked:reminders,published}));
}
if(process.argv.includes('--once'))await tick();else{
 let stopping=false;process.on('SIGTERM',()=>{stopping=true;});process.on('SIGINT',()=>{stopping=true;});
 while(!stopping){try{await tick();}catch(error){console.error('Background cycle failed:',error.message);}if(!stopping)await new Promise(r=>setTimeout(r,60000));}
}
