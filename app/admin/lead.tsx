import { Form, Link, data, useActionData, useLoaderData } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { requireStaff, sameOrigin } from "./auth.server";
import { resolveDuplicate, changeContactGroup, contactEnquiries, relatedEnquiries, queuePage, activityFor, addNote, createTask, field, leadFor, listStaff, UnconfirmedMutation, updateLead } from "./crm.server";
import { canManage, isRestrictedManager, displayDate, priorities, stages } from "./domain";
import { ActionError, Back, Badge, PageHeading, Submit } from "./ui";
export async function loader({ request, params }: LoaderFunctionArgs) {
 const staff=await requireStaff(request, true); const lead=await leadFor(staff,params.id!);
 const [activities,team]=await Promise.all([isRestrictedManager(staff) ? Promise.resolve([]) : activityFor(lead.$id),canManage(staff)?listStaff():Promise.resolve([staff])]);
 const url = new URL(request.url);
 const match = url.searchParams.get("match") === "phone" ? "phone" : "email";
 const relatedPage = queuePage(url.searchParams.get("relatedPage"));
 const related = await relatedEnquiries(staff, lead.$id, match, relatedPage);
 const contactPage = queuePage(url.searchParams.get("contactPage"));
 const contact = canManage(staff) ? await contactEnquiries(staff, lead, contactPage) : null;
 const {contactGroup, duplicateOf, duplicatePriorStage, ...fullEnquiry} = lead;
 const { $id, $createdAt, name, email, phone, country, details, stage, priority, service, source, version, owner, nextFollowUp } = fullEnquiry;
 const enquiry = isRestrictedManager(staff)
   ? { $id, $createdAt, name, email, phone, country, details, stage, priority, service, source, version, owner: owner ? "assigned" : "", nextFollowUp: "" }
   : fullEnquiry;
 return {staff,lead:enquiry,activities:canManage(staff) ? activities : activities.filter(event => !["Contact link change requested","Duplicate decision requested"].includes(event.event)),team,related,match,relatedPage,contactPage,contact,isDuplicate:Boolean(duplicateOf),retainedEnquiry:canManage(staff)?duplicateOf:undefined,linked:canManage(staff) && Boolean(contactGroup)};
}
export async function action({ request,params }: ActionFunctionArgs) {
 const staff=await requireStaff(request, true); sameOrigin(request); const form=await request.formData();
 try {
  const intent=field(form,"intent");
  if(isRestrictedManager(staff) && intent!=="update") throw new Response("Access denied", {status:403});
  if(intent==="update") await updateLead(staff,params.id!,form,isRestrictedManager(staff) ? "stage-priority" : "full");
  else if(intent==="link-match") {
   const matchId = field(form,"matchEnquiry",36);
   if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,35}$/.test(matchId) || !field(form,"targetVersion")) {
    throw new Response("Choose an enquiry from the match list.",{status:400});
   }
   form.set("contactOperation","join");
   form.set("targetEnquiry",params.id!);
   await changeContactGroup(staff,matchId,form);
  }
  else if(intent==="mark-duplicate" || intent==="restore-duplicate") await resolveDuplicate(staff,params.id!,form);
  else if(intent==="contact") await changeContactGroup(staff,params.id!,form);
  else if(intent==="note") await addNote(staff,params.id!,field(form,"note",5000));
  else if(intent==="task") await createTask(staff,params.id!,form);
  else throw new Response("Unknown action",{status:400});
  return {error:"",success:true};
 } catch(error) { if(error instanceof Response && ([400,409].includes(error.status) || error instanceof UnconfirmedMutation)) return data({error:await error.text(),success:false,conflict:error.status===409},{status:error.status}); if(error instanceof Response) throw error; return data({error:"Could not save. Refresh to check the latest state before retrying.",success:false},{status:503}); }
}
export default function LeadDetail() {
 const {staff,lead,activities,team,related,match,relatedPage,contact,contactPage,linked,isDuplicate,retainedEnquiry}=useLoaderData<typeof loader>(); const result=useActionData<typeof action>(); let details:Record<string,unknown>={};try{details=JSON.parse(lead.details);}catch{}
 return <><Back to="/admin/leads">All enquiries</Back><PageHeading eyebrow={`${lead.service.toUpperCase()} · ${lead.$id}`} title={lead.name} description={`Received ${displayDate(lead.$createdAt)} · ${lead.source}`}><div className="flex flex-wrap gap-2"><Badge tone="pink">{lead.stage}</Badge>{!isRestrictedManager(staff) && <><Link className="crm-button secondary" to={`/admin/applications?new=1&leadId=${lead.$id}`}>New application</Link><Link className="crm-button secondary" to={`/admin/appointments?new=1&leadId=${lead.$id}`}>Book appointment</Link><Link className="crm-button secondary" to={`/admin/leads/${lead.$id}/documents`}>Documents</Link></>}<Link className="crm-button secondary" to={`/admin/leads/${lead.$id}/consultations`}>Consultations</Link></div></PageHeading><ActionError error={result?.error}/>
{isDuplicate && <section className="crm-panel crm-padded">
  <h2>Archived as a duplicate</h2>
  {retainedEnquiry && <>
    <Link to={`/admin/leads/${retainedEnquiry}`}>Open retained enquiry</Link>
    <Form method="post" className="crm-form">
      <input type="hidden" name="intent" value="restore-duplicate"/>
      <input type="hidden" name="version" value={lead.version}/>
      <label>Reason for restoring<textarea name="reason" required maxLength={2000}/></label>
      <div><Submit>Restore enquiry</Submit></div>
    </Form>
  </>}
</section>}{result && "conflict" in result && result.conflict && <p><Link reloadDocument className="crm-button secondary" to={`/admin/leads/${lead.$id}`}>Reload latest lead</Link></p>}{result?.success && <p className="crm-success" role="status">Saved to the workspace.</p>}<div className="crm-detail-grid"><div><section className="crm-panel crm-padded"><h2>Contact & profile</h2><dl className="crm-details"><div><dt>Email</dt><dd><a href={`mailto:${lead.email}`}>{lead.email}</a></dd></div><div><dt>Phone</dt><dd>{lead.phone}</dd></div><div><dt>Destination</dt><dd>{lead.country || "To confirm"}</dd></div>{Object.entries(details).filter(([,v])=>v && typeof v!=="object").map(([k,v])=><div key={k}><dt>{k.replace(/([A-Z])/g," $1")}</dt><dd>{String(v)}</dd></div>)}</dl></section><section className="crm-panel crm-padded"><h2>Other enquiries with matching contact details</h2>
<p className="crm-muted">Matches are suggestions, not confirmed duplicates. Shared or family contact details may belong to different people. Each enquiry keeps its own status and assignment. Only enquiries you can access appear here.</p>
<Form method="get" className="crm-filters"><label>Match by<select name="match" defaultValue={match}><option value="email">Same email</option><option value="phone">Same phone</option></select></label><button className="crm-button secondary">Find matches</button></Form>
<p>{related.total} other accessible enquiries · Page {relatedPage}</p>
{related.documents.length ? <div className="crm-table-wrap"><table className="crm-table"><thead><tr><th>Enquiry</th><th>Service / destination</th><th>Stage</th><th>Counselor</th>{linked && !isDuplicate && <th>Contact link</th>}</tr></thead><tbody>{related.documents.map(row => <tr key={row.$id}><td><Link to={`/admin/leads/${row.$id}`}>{row.name}</Link><small>{displayDate(row.$createdAt)}</small></td><td>{row.service}<small>{row.country || "To confirm"}</small></td><td>{row.stage}</td><td>{team.find(member => member.$id === row.owner)?.name || (row.owner ? "Assigned counselor" : "Unassigned")}</td>
{linked && !isDuplicate && <td><Form method="post">
  <input type="hidden" name="intent" value="link-match"/>
  <input type="hidden" name="matchEnquiry" value={row.$id}/>
  <input type="hidden" name="version" value={row.version}/>
  <input type="hidden" name="targetVersion" value={lead.version}/>
  <Submit>Confirm same contact</Submit>
</Form></td>}</tr>)}</tbody></table></div> : <p>No matching enquiries in this view.</p>}
<div className="crm-pagination">{relatedPage > 1 && <Link to={`?match=${match}&relatedPage=${relatedPage - 1}`}>Previous matches</Link>}{relatedPage < 10000 && relatedPage * 25 < related.total && <Link to={`?match=${match}&relatedPage=${relatedPage + 1}`}>Next matches</Link>}</div>
<p className="crm-muted">Older enquiries appear after their normalized contact fields have been backfilled. A match does not merge or change any record.</p>
</section>{contact && <section className="crm-panel crm-padded">
  <h2>Confirmed contact</h2>
  <p>Link enquiries only after confirming they belong to the same person.</p>
  {linked && <><p>{contact.total} other linked enquiries</p>
    <ul>{contact.documents.map(row => <li key={row.$id}><Link to={`/admin/leads/${row.$id}`}>{row.name} · {row.country || row.service} · {row.stage}</Link>
      {!isDuplicate && row.service.trim().toLowerCase() === lead.service.trim().toLowerCase() &&
        row.country.trim().toLowerCase() === lead.country.trim().toLowerCase() &&
        <details>
          <summary>Mark this enquiry as a duplicate of {row.name}</summary>
          <Form method="post" className="crm-form">
            <input type="hidden" name="intent" value="mark-duplicate"/>
            <input type="hidden" name="version" value={lead.version}/>
            <input type="hidden" name="retainedEnquiry" value={row.$id}/>
            <input type="hidden" name="targetVersion" value={row.version}/>
            <label>Reason for archiving<textarea name="reason" required maxLength={2000}/></label>
            <div><Submit>Archive this duplicate</Submit></div>
          </Form>
        </details>}
    </li>)}</ul>
    <div className="crm-pagination">
      {contactPage > 1 && <Link to={`?match=${match}&relatedPage=${relatedPage}&contactPage=${contactPage - 1}`}>Previous linked enquiries</Link>}
      {contactPage < 10000 && contactPage * 25 < contact.total && <Link to={`?match=${match}&relatedPage=${relatedPage}&contactPage=${contactPage + 1}`}>Next linked enquiries</Link>}
    </div>
  </>}
  {!isDuplicate && <Form method="post" className="crm-form">
    <input type="hidden" name="intent" value="contact"/>
    <input type="hidden" name="version" value={lead.version}/>
    <input type="hidden" name="contactOperation" value={linked ? "unlink" : "create"}/>
    <div><Submit>{linked ? "Unlink this enquiry" : "Start a contact group"}</Submit></div>
  </Form>}
  {!linked && !isDuplicate && <Form method="post" className="crm-form">
    <input type="hidden" name="intent" value="contact"/>
    <input type="hidden" name="version" value={lead.version}/>
    <input type="hidden" name="contactOperation" value="join"/>
    <label>Reference of an enquiry already in the contact group<input name="targetEnquiry" required maxLength={36}/></label>
    <div><Submit>Confirm and link enquiry</Submit></div>
  </Form>}
</section>}{!isRestrictedManager(staff) && <section className="crm-panel crm-padded"><h2>Conversation timeline</h2><Form method="post" className="crm-form"><input type="hidden" name="intent" value="note"/><label>Add an internal note<textarea name="note" required maxLength={5000} rows={3} placeholder="What did you discuss? What happens next?"/></label><Submit>Add note</Submit></Form><div className="crm-timeline">{activities.map(a=>{let detail:Record<string,unknown>={};try{detail=JSON.parse(a.details);}catch{}return <article key={a.$id}><span className="crm-timeline-dot"/><strong>{a.event}</strong><small>{displayDate(a.$createdAt)} · {team.find(s=>s.$id===a.actor)?.name || "Team member"}</small>{Boolean(detail.note)&&<p>{String(detail.note)}</p>}{Boolean(detail.reason)&&<p>{String(detail.reason)}</p>}{Boolean(detail.title)&&<p>{String(detail.title)} · {displayDate(String(detail.dueAt))}</p>}</article>;})}</div></section>}</div><aside>{!isDuplicate && <><section className="crm-panel crm-padded"><h2>Lead management</h2><Form key={lead.version} method="post" className="crm-form"><input type="hidden" name="intent" value="update"/><input type="hidden" name="version" value={lead.version}/><label>Stage<select name="stage" defaultValue={lead.stage}>{stages.map(s=><option key={s}>{s}</option>)}</select></label>{canManage(staff)&&<label>Assigned counselor<select name="owner" defaultValue={lead.owner}><option value="">Unassigned</option>{team.filter(s=>["owner","admin","manager","counselor"].includes(s.role)).map(s=><option value={s.$id} key={s.$id}>{s.name}</option>)}</select></label>}<label>Priority<select name="priority" defaultValue={lead.priority}>{priorities.map(s=><option key={s}>{s}</option>)}</select></label>{!isRestrictedManager(staff) && <label>Next follow-up (ISO, with timezone)<input name="nextFollowUp" defaultValue={lead.nextFollowUp} placeholder="2026-11-02T10:00:00+05:00"/></label>}<label>Change / handoff reason<textarea name="reason" rows={2} maxLength={2000} placeholder="Required for reassignment or closure"/></label><Submit/></Form></section>{!isRestrictedManager(staff) && <section className="crm-panel crm-padded"><h2>Schedule a follow-up</h2><Form method="post" className="crm-form"><input name="intent" type="hidden" value="task"/><label>What needs to happen?<input name="title" maxLength={300} required placeholder="Call to discuss course shortlist"/></label><label>Due date (ISO, with timezone)<input name="dueAt" required placeholder="2026-11-02T10:00:00+05:00"/></label><p className="crm-muted">The task is assigned to the lead owner. Times display in Asia/Karachi.</p><Submit>Create follow-up</Submit></Form></section>}</>}</aside></div></>;
}
