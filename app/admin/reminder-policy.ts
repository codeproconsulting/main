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

export const appointmentReminderLeadTime = 60 * 60 * 1000;
type ReminderAppointment = {$id:string;leadId:string;owner:string;status:string;startsAt:string;version:number};
export function appointmentReminderDueAt(appointment:ReminderAppointment,lead:ReminderLead,now:string){
 const starts=Date.parse(appointment.startsAt),time=Date.parse(now);
 const due=starts-appointmentReminderLeadTime;
 if(appointment.leadId!==lead.$id||!lead.owner||appointment.owner!==lead.owner||
    closedLeadStages.includes(lead.stage)||appointment.status!=="Booked"||
    !Number.isInteger(appointment.version)||appointment.version<1||!Number.isFinite(time)||
    !Number.isFinite(due)||time<due||time>=starts)return null;
 return new Date(due).toISOString();
}
