import {createHash,randomUUID} from 'node:crypto';
import {appointmentReminderDueAt,appointmentReminderLeadTime,caseReminderDueAt,caseReminderLeadTime,dueTask} from '../app/admin/reminder-policy.ts';
const hash=key=>createHash('sha256').update(key).digest('hex').slice(0,32);
const q=(method,attribute,values)=>JSON.stringify({method,attribute,values});
export const reminderId=task=>hash(`task:${task.$id}:${task.version}:${task.owner}:${task.dueAt}`);

// In-app delivery is the durable notification write itself, not an external send.
export async function remindDueTasks({api,allDocuments,databaseId,now=new Date().toISOString(),clock=()=>new Date().toISOString(),onError=()=>{},signal,includeAppointments=false,includeCases=false}){
 if(!Number.isFinite(Date.parse(now)))throw new Error('Invalid reminder cycle time');
 const base=`/databases/${encodeURIComponent(databaseId)}/collections`;
 const path=(collection,id)=>`${base}/${collection}/documents${id?'/'+encodeURIComponent(id):''}`;
 const result={checked:0,created:0,duplicate:0,skipped:0,failed:0,contended:false,stopped:false};
 if(signal?.aborted)return {...result,stopped:true};
 async function lock(key,work){
  const id=hash(key),owner=`reminder-${randomUUID()}`;let acquired=false;
  try{
   try{await api(path('locks'),'POST',{documentId:id,data:{key,owner,acquiredAt:now},permissions:[]});acquired=true;}
   catch(error){if(error.status===409)return false;throw error;}
   await work();return true;
  }finally{
   if(acquired){const saved=await api(path('locks',id));if(saved.owner!==owner)throw new Error('Lock ownership changed');await api(path('locks',id),'DELETE');}
  }
 }
 async function health(data){
  try{await api(path('worker_health','reminders'),'PATCH',{data});}
  catch(error){if(error.status!==404)throw error;try{await api(path('worker_health'),'POST',{documentId:'reminders',data:{worker:'reminders',...data},permissions:[]});}catch(conflict){if(conflict.status!==409)throw conflict;await api(path('worker_health','reminders'),'PATCH',{data});}}
 }
 async function optional(collection,id){try{return await api(path(collection,id));}catch(error){if(error.status===404)return null;throw error;}}
 const acquired=await lock('worker:reminders',async()=>{
  await health({status:'running',startedAt:now,finishedAt:'',summary:'',errorCount:0});
  try{
   const tasks=await allDocuments('tasks',[q('equal','status',['Open']),q('lessThanEqual','dueAt',[now])]);
   const appointments=includeAppointments ? await allDocuments('appointments',[
    q('equal','status',['Booked']),q('greaterThan','startsAt',[now]),
    q('lessThanEqual','startsAt',[new Date(Date.parse(now)+appointmentReminderLeadTime).toISOString()]),
   ]).catch(() => { result.failed++; return []; }) : [];
   const cases=includeCases ? await allDocuments('cases',[
    q('greaterThan','deadline',[now]),
    q('lessThanEqual','deadline',[new Date(Date.parse(now)+caseReminderLeadTime).toISOString()]),
   ]).catch(() => { result.failed++; return []; }) : [];
   result.checked=tasks.length+appointments.length+cases.length;
   for(const [collection,candidate] of [...tasks.map(row=>['tasks',row]),...appointments.map(row=>['appointments',row]),...cases.map(row=>['cases',row])]){
    if(signal?.aborted){result.stopped=true;break;}
    try{
     const done=await lock(`lead:${candidate.leadId}`,async()=>{
      const [source,lead]=await Promise.all([optional(collection,candidate.$id),optional('leads',candidate.leadId)]);
      const kind=collection==='appointments'?'appointment':collection==='cases'?'case':'task';
      if(!source||!lead){result.skipped++;return;}
      const dueAt=kind==='appointment' ? appointmentReminderDueAt(source,lead,now)
       : kind==='case' ? caseReminderDueAt(source,lead,now) : dueTask(source,lead,now) && source.dueAt;
      if(!dueAt){result.skipped++;return;}
      const staff=await optional('staff',lead.owner);
      if(!staff?.active||!['owner','admin','manager','counselor'].includes(staff.role)){result.skipped++;return;}
      const documentId=kind==='task'?reminderId(source):hash(`${kind}:${source.$id}:${source.version}:${source.owner}:${dueAt}`);
      const title=(kind==='appointment'?`Upcoming appointment: ${source.title}`:kind==='case'?'Upcoming application deadline':`Follow-up due: ${source.title}`).slice(0,300);
      const body=kind==='appointment'?`Starts ${source.startsAt}.`:kind==='case'?`Deadline ${source.deadline}.`:`Due ${dueAt}. Open the lead to record an outcome.`;
      const data={recipient:lead.owner,entityId:lead.$id,kind,sourceId:source.$id,sourceVersion:source.version,dueAt,title,body,read:false};
      try{await api(path('notifications'),'POST',{documentId,data,permissions:[]});result.created++;}
      catch(error){
       if(error.status!==409)throw error;
       const saved=await api(path('notifications',documentId));
       if(saved.recipient!==data.recipient||saved.sourceId!==data.sourceId||saved.sourceVersion!==data.sourceVersion||saved.dueAt!==data.dueAt||saved.entityId!==data.entityId||saved.kind!==kind)throw new Error('Notification identity conflict');
       result.duplicate++;
      }
     });
     if(!done){result.skipped++;result.failed++;onError({id:candidate.$id,status:'lead_lock_busy'});}
    }catch(error){result.failed++;onError({id:candidate.$id,status:error.status??'operation_failed'});}
   }
   const finishedAt=clock();
   await health({status:result.stopped?'stopped':result.failed?'degraded':'healthy',finishedAt,summary:JSON.stringify(result),errorCount:result.failed,...(!result.failed&&!result.stopped?{lastSuccessAt:finishedAt}:{})});
  }catch(error){
   await health({status:'failed',finishedAt:clock(),summary:JSON.stringify(result),errorCount:Math.max(1,result.failed)});
   throw error;
  }
 });
 if(!acquired)result.contended=true;
 return result;
}
