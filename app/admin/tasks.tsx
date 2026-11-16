import {Form,Link,data,useLoaderData,useActionData} from "react-router";
import type {ActionFunctionArgs,LoaderFunctionArgs} from "react-router";
import {requireStaff,sameOrigin} from "./auth.server";
import {changeTask,field,queuePage,taskPage} from "./crm.server";
import {teamQueue} from "./team-queues.server";
import {displayDate,isRestrictedManager,type Task} from "./domain";
import {ActionError,Badge,Empty,PageHeading,QueuePagination,TeamQueuePagination,Submit} from "./ui";
export async function loader({request}:LoaderFunctionArgs) {
 const staff=await requireStaff(request, true);
 const search=new URL(request.url).searchParams;
 const page=queuePage(search.get("page"));
 if(isRestrictedManager(staff)){
  const after=search.get("after")??"";
  const {records:tasks,next}=await teamQueue<Task>(staff,"tasks",after);
  return {tasks,page,hasMore:Boolean(next),teamScoped:true,after,next};
 }
 const {records:tasks,hasMore}=await taskPage(staff,page);
 return {tasks,page,hasMore,teamScoped:false,after:"",next:""};
}
export async function action({request}:ActionFunctionArgs){
 const staff=await requireStaff(request, true);sameOrigin(request);const form=await request.formData();
 try{await changeTask(staff,field(form,"id",36),field(form,"intent"),field(form,"version"),field(form,"outcome",2000),field(form,"dueAt",40));return {error:"",success:true};}
 catch(error){if(error instanceof Response)return data({error:await error.text(),success:false},{status:error.status});return data({error:"Could not update this follow-up. Refresh to check its latest state before retrying.",success:false},{status:503});}
}
export default function Tasks(){const {tasks,page,hasMore,teamScoped,after,next}=useLoaderData<typeof loader>(),result=useActionData<typeof action>();return <><PageHeading eyebrow="A CLEAR NEXT STEP" title="Follow-ups" description={teamScoped ? "Open follow-ups for your team’s enquiries. Times shown in Asia/Karachi." : "Your open tasks, ordered by due date. Times shown in Asia/Karachi."}/><ActionError error={result?.error}/>{result?.success&&<p role="status" className="crm-success">Follow-up updated.</p>}<section className="crm-panel">{!tasks.length&&<Empty title="No follow-ups on this page">{hasMore ? "More follow-ups are available on the next page." : teamScoped ? "Your team has no open follow-ups on this page." : "Create a follow-up from a lead’s workspace to keep things moving."}</Empty>}{tasks.map(task=><article className="crm-followup" key={`${task.$id}:${task.version}`}><div><Badge tone={Date.parse(task.dueAt)<Date.now()?"danger":"neutral"}>{Date.parse(task.dueAt)<Date.now()?"Overdue":"Upcoming"}</Badge><h2>{task.title}</h2><p className="crm-muted">{displayDate(task.dueAt)}</p><Link to={`/admin/leads/${task.leadId}`}>Open lead →</Link></div><Form method="post" className="crm-form"><input type="hidden" name="id" value={task.$id}/><input type="hidden" name="version" value={task.version}/><label>Action<select name="intent" defaultValue="complete"><option value="complete">Complete follow-up</option><option value="reschedule">Reschedule follow-up</option><option value="cancel">Cancel follow-up</option></select></label><label>Outcome or change reason<input name="outcome" required maxLength={2000} placeholder="What happened?"/></label><label>New due date (for rescheduling; ISO with timezone)<input name="dueAt" placeholder="2026-11-02T10:00:00+05:00" maxLength={40}/></label><Submit>Update follow-up</Submit></Form></article>)}</section>{teamScoped ? <TeamQueuePagination after={after} next={next}/> : <QueuePagination page={page} hasMore={hasMore}/>}</>;}
