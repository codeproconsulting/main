// Shared by server loaders and the Node reminder runner; no credentials or I/O.
export const closedLeadStages = ["Archived", "Lost", "Not eligible"];
type ReminderTask = {$id:string;leadId:string;owner:string;status:string;dueAt:string;version:number};
type ReminderLead = {$id:string;owner:string;stage:string};
export function dueTask(task:ReminderTask,lead:ReminderLead,now:string){
 const due=Date.parse(task.dueAt),time=Date.parse(now);
 return task.leadId===lead.$id&&task.owner===lead.owner&&Boolean(lead.owner)&&!closedLeadStages.includes(lead.stage)&&task.status==="Open"&&Number.isInteger(task.version)&&task.version>0&&Number.isFinite(due)&&Number.isFinite(time)&&due<=time;
}
export function currentTaskNotice(notice:{kind:string;recipient:string;entityId:string;sourceId:string;sourceVersion:number;dueAt:string},task:ReminderTask,lead:ReminderLead,recipient:string,now:string){
 return notice.kind==="task"&&notice.recipient===recipient&&lead.owner===recipient&&notice.entityId===lead.$id&&notice.sourceId===task.$id&&notice.sourceVersion===task.version&&notice.dueAt===task.dueAt&&dueTask(task,lead,now);
}
