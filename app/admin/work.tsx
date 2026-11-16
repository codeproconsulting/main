import {useState,useEffect} from "react";
import {Form,Link,data,redirect,useLoaderData,useActionData} from "react-router";
import type {LoaderFunctionArgs,ActionFunctionArgs} from "react-router";
import {requireStaff,sameOrigin} from "./auth.server";
import {allow,leadFor,queuePage} from "./crm.server";
import {AppwriteError,getDocument} from "~/lib/appwrite.server";
import {saveCase,saveAppointment,updateTeamCase,scopedRecords,type CaseRecord,type Appointment} from "./operations.server";
import {teamQueue} from "./team-queues.server";
import {canUseCRM,isRestrictedManager,caseStagesFor,displayDate} from "./domain";
import {ActionError,Badge,Back,Empty,PageHeading,QueuePagination,TeamQueuePagination,Submit} from "./ui";
export async function loader({request,params}:LoaderFunctionArgs){const staff=await requireStaff(request, true),url=new URL(request.url),calendar=url.pathname.startsWith("/admin/appointments"),collection=calendar?"appointments":"cases";
 allow(canUseCRM(staff));
 const teamReadOnly=isRestrictedManager(staff);
 if(teamReadOnly && url.searchParams.has("new")) throw new Response("Team work queues are read-only.",{status:403});
 let record:(CaseRecord&Appointment)|null=null;
 try{record=params.id?await getDocument<CaseRecord&Appointment>(collection,params.id):null;}catch(error){if(error instanceof AppwriteError&&error.status===404)throw new Response("Record not found",{status:404});throw error;}if(record)await leadFor(staff,record.leadId);
 if(teamReadOnly && record) {
  const { $id, leadId, title, status, startsAt, endsAt, kind, institution, course, stage, country, intake, deadline, version }=record;
  return {calendar,record:{$id,leadId,title,status,startsAt,endsAt,kind,institution,course,stage,country,intake,deadline,version,location:"",notes:"",owner:""},records:[],leadId,page:1,hasMore:false,creating:false,teamReadOnly,after:"",next:""};
 }
 if(teamReadOnly) {
  const after=url.searchParams.get("after")??"";
  const {records,next}=await teamQueue<CaseRecord&Appointment>(staff,collection,after);
  return {calendar,record:null,records,leadId:"",page:1,hasMore:Boolean(next),creating:false,teamReadOnly,after,next};
 }
 const leadId=record?.leadId||url.searchParams.get("leadId")||"";if(leadId)await leadFor(staff,leadId);
 const page=queuePage(url.searchParams.get("page"));const {records,hasMore}=record?{records:[],hasMore:false}:await scopedRecords<CaseRecord&Appointment>(staff,collection,page);return {calendar,record,records,leadId,page,hasMore,teamReadOnly,after:"",next:"",creating:url.searchParams.has("new")};}
export async function action({request,params}:ActionFunctionArgs){const staff=await requireStaff(request, true);sameOrigin(request);const calendar=new URL(request.url).pathname.startsWith("/admin/appointments");try{if(isRestrictedManager(staff) && (calendar || !params.id)) throw new Response("Access denied",{status:403});
 const form=await request.formData();
 if(isRestrictedManager(staff)) return redirect(`/admin/applications/${await updateTeamCase(staff,params.id!,form)}`);
 const record=calendar?await saveAppointment(staff,form):await saveCase(staff,form);return redirect(`/admin/${calendar?"appointments":"applications"}/${record.$id}`);}catch(error){if(error instanceof Response){if([400,409,503].includes(error.status))return data({error:await error.text()},{status:error.status});throw error;}return data({error:"Could not save. Refresh to check the latest state before retrying."},{status:503});}}
export default function Work(){const {calendar,record,records,leadId,page,hasMore,creating,teamReadOnly,after,next}=useLoaderData<typeof loader>(),result=useActionData<typeof action>();const [kind,setKind]=useState(record?.kind??"Education");
 useEffect(()=>setKind(record?.kind??"Education"),[record?.$id,record?.version]);
 const base=`/admin/${calendar?"appointments":"applications"}`,editing=record||creating;
 if(teamReadOnly && record) return <>
  <Back to={base}>Back to {calendar ? "appointments" : "applications"}</Back>
  <PageHeading eyebrow="TEAM WORK" title={calendar ? record.title : record.institution || record.kind} description="Team record"/>
  <section className="crm-panel crm-padded">
    <p><Badge>{calendar ? record.status : record.stage}</Badge></p>
    {calendar ? <><p>Starts {displayDate(record.startsAt)}</p><p>Ends {displayDate(record.endsAt)}</p></> :
      <><p>{[record.kind,record.course,record.country,record.intake].filter(Boolean).join(" · ")}</p><p>Deadline {displayDate(record.deadline)}</p></>}
    <Link to={`/admin/leads/${record.leadId}`}>Open lead</Link>
    {!calendar && <Form key={record.version} method="post" className="crm-form">
      <input type="hidden" name="version" value={record.version}/>
      <label>Stage<select name="stage" defaultValue={record.stage}>
        {caseStagesFor(record.kind).map(stage => <option key={stage}>{stage}</option>)}
      </select></label>
      <label>Deadline (ISO with timezone)<input name="deadline" defaultValue={record.deadline} maxLength={40}/></label>
      <ActionError error={result?.error}/>
      <div><Submit>Update application</Submit></div>
    </Form>}
  </section>
 </>;
 return <>{editing&&<Back to={base}>Back to {calendar?"appointments":"applications"}</Back>}<PageHeading eyebrow={calendar?"MAKE TIME FOR THE NEXT STEP":"FROM ENQUIRY TO OUTCOME"} title={editing?(record?"Manage ":"New ")+(calendar?"appointment":"application"):(calendar?"Appointments":"Applications & cases")} description={calendar?"Book counseling sessions, manage time, and record outcomes.":"Track each education application or immigration case independently."}>{!editing&&!teamReadOnly&&<Link className="crm-button" to={`${base}?new=1`}>Create {calendar?"appointment":"application"}</Link>}</PageHeading><ActionError error={result?.error}/>{editing?<Form method="post" key={`${record?.$id??"new"}:${record?.version??0}`} className="crm-panel crm-padded crm-form"><input name="id" type="hidden" value={record?.$id??""}/><input name="version" type="hidden" value={record?.version??0}/><label>Lead reference<input name="leadId" required defaultValue={leadId} readOnly={Boolean(record)}/></label>{calendar?<><label>Title<input name="title" required maxLength={300} defaultValue={record?.title} placeholder="Course shortlist consultation"/></label><div className="crm-two-col"><label>Start (ISO with timezone)<input name="startsAt" required defaultValue={record?.startsAt} placeholder="2026-11-02T10:00:00+05:00"/></label><label>End (ISO with timezone)<input name="endsAt" required defaultValue={record?.endsAt} placeholder="2026-11-02T10:30:00+05:00"/></label></div><label>Status<select name="status" defaultValue={record?.status??"Booked"}>{["Booked","Completed","Cancelled","No show"].map(s=><option key={s}>{s}</option>)}</select></label><label>Location or meeting URL<input name="location" maxLength={1000} defaultValue={record?.location}/></label>{record&&<label>Reason for reschedule, cancellation or no-show<input name="reason" maxLength={2000}/></label>}<p className="crm-muted">Enter times with a timezone, for example 2030-02-01T10:00:00+05:00. The list shows Asia/Karachi time.</p></>:<><div className="crm-two-col"><label>Service<select name={record?undefined:"kind"} disabled={Boolean(record)} value={kind} onChange={event=>setKind(event.target.value)}><option>Education</option><option>Immigration</option></select>{record&&<input type="hidden" name="kind" value={record.kind}/>}</label><label>Stage<select name="stage" key={kind} defaultValue={caseStagesFor(kind).includes(record?.stage??"")?record?.stage:"Shortlisted"}>{caseStagesFor(kind).map(s=><option key={s}>{s}</option>)}</select></label></div><label>{kind==="Education"?"University / institution":"Visa category"}<input name="institution" required maxLength={300} defaultValue={record?.institution}/></label><label>{kind==="Education"?"Course":"Case description (optional)"}<input name="course" required={kind==="Education"} maxLength={300} defaultValue={record?.course}/></label><div className="crm-two-col"><label>Destination<input name="country" required maxLength={150} defaultValue={record?.country}/></label><label>Intake<input name="intake" maxLength={100} defaultValue={record?.intake}/></label></div><label>Deadline (date and timezone)<input name="deadline" defaultValue={record?.deadline} placeholder="2026-12-01T17:00:00+05:00"/></label></>}<label>Internal notes<textarea name="notes" maxLength={10000} rows={4} defaultValue={record?.notes}/></label><Submit/></Form>:<section className="crm-panel"><div className="crm-table-wrap"><table className="crm-table"><thead><tr><th>{calendar?"Appointment":"Institution / case"}</th><th>Status</th><th>{calendar?"Starts":"Deadline"}</th><th>Lead</th></tr></thead><tbody>{records.map(r=><tr key={r.$id}><td><Link to={`${base}/${r.$id}`}><strong>{calendar?r.title:r.institution||r.kind}</strong><small>{calendar?r.location:r.course}</small></Link></td><td><Badge>{calendar?r.status:r.stage}</Badge></td><td>{displayDate(calendar?r.startsAt:r.deadline)}{calendar&&<small>Ends {displayDate(r.endsAt)}</small>}</td><td><Link to={`/admin/leads/${r.leadId}`}>Open lead →</Link></td></tr>)}</tbody></table></div>{!records.length&&<Empty title={calendar?"No appointments on this page":"No applications on this page"}>{teamReadOnly ? "Your team has no records on this page." : "Start from a lead’s workspace to link the next step to the right contact."}</Empty>}<p className="crm-muted crm-padded">Showing up to 25 records per page.</p></section>}{!editing && (teamReadOnly ? <TeamQueuePagination after={after} next={next}/> : <QueuePagination page={page} hasMore={hasMore}/>)}</>;}
