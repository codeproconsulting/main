import {AppwriteError,getDocument,listDocuments,query,updateDocument} from "~/lib/appwrite.server";
import {allow,leadFor,serialized} from "./crm.server";
import {canManage,canUseCRM,type Staff,type Task} from "./domain";
import {currentTaskNotice} from "./reminder-policy";
export type Notice={$id:string;$createdAt:string;recipient:string;entityId:string;kind:string;title:string;body:string;read:boolean;sourceId:string;sourceVersion:number;dueAt:string};
async function currentNotice(staff:Staff,notice:Notice,now:string){
 if(notice.recipient!==staff.$id||notice.kind!=="task"||!notice.sourceId)return null;
 try{
  const lead=await leadFor(staff,notice.entityId),task=await getDocument<Task>("tasks",notice.sourceId);
  if(!currentTaskNotice(notice,task,lead,staff.$id,now))return null;
  return {...notice,title:`Follow-up due: ${task.title}`,body:`Due ${task.dueAt}. Open the lead to record an outcome.`};
 }catch(error){if((error instanceof Response&&[403,404].includes(error.status))||(error instanceof AppwriteError&&error.status===404))return null;throw error;}
}
export async function noticesFor(staff:Staff,cursor="",now=new Date().toISOString()){
 allow(canUseCRM(staff));if(cursor&&!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,35}$/.test(cursor))throw new Response("Invalid reminder page",{status:400});
 const result=await listDocuments<Notice>("notifications",[query("equal","recipient",[staff.$id]),query("orderDesc","$createdAt"),query("orderDesc","$id"),query("limit",undefined,[25]),...(cursor?[query("cursorAfter",undefined,[cursor])]:[])]);
 const notices=[];for(const notice of result.documents){const current=await currentNotice(staff,notice,now);if(current)notices.push(current);}
 return {notices,next:result.documents.length===25?result.documents.at(-1)!.$id:""};
}
export async function readNotice(staff:Staff,id:string,now=new Date().toISOString()){
 allow(canUseCRM(staff));let notice;
 try{notice=await getDocument<Notice>("notifications",id);}catch(error){if(error instanceof AppwriteError&&error.status===404)throw new Response("Reminder not found",{status:404});throw error;}
 allow(notice.recipient===staff.$id);
 return serialized(`lead:${notice.entityId}`,async()=>{
  const current=await currentNotice(staff,notice,now);if(!current)throw new Response("This reminder is no longer current. Refresh the inbox.",{status:409});
  await updateDocument("notifications",id,{read:true});
 });
}
export type WorkerHealth={status:string;startedAt:string;finishedAt:string;lastSuccessAt:string;summary:string;errorCount:number};
export async function reminderHealth(staff:Staff,now=Date.now()){
 allow(canManage(staff));
 try{const health=await getDocument<WorkerHealth>("worker_health","reminders");const latest=Date.parse(health.finishedAt||health.startedAt);return {status:!Number.isFinite(latest)||now-latest>180000?"stale":health.status,lastSuccessAt:health.lastSuccessAt||"",errorCount:health.errorCount};}
 catch(error){if(error instanceof AppwriteError&&error.status===404)return {status:"not started",lastSuccessAt:"",errorCount:0};return {status:"unavailable",lastSuccessAt:"",errorCount:0};}
}
