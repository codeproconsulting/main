import {Form,data,useActionData,useLoaderData} from "react-router";
import type {LoaderFunctionArgs,ActionFunctionArgs} from "react-router";
import {requireStaff,sameOrigin} from "./auth.server";
import {allow,audit,field,serialized} from "./crm.server";
import {appwrite,createDocument,getDocument,listDocuments,query,updateDocument} from "~/lib/appwrite.server";
import {roles,type Staff,type Lead} from "./domain";
import {ActionError,Badge,PageHeading,Submit} from "./ui";
export async function loader({request}:LoaderFunctionArgs){const staff=await requireStaff(request);allow(["owner","admin"].includes(staff.role));return {staff,team:(await listDocuments<Staff>("staff",[query("limit",undefined,[100])])).documents};}
export async function action({request}:ActionFunctionArgs){const actor=await requireStaff(request);sameOrigin(request);allow(["owner","admin"].includes(actor.role));const form=await request.formData();try{
 const id=field(form,"id",36),role=field(form,"role",30),name=field(form,"name",200),active=field(form,"active")==="true";if(!id||!name||!roles.includes(role as Staff["role"]))throw new Response("Enter a valid Auth user ID, name, and role.",{status:400});
 return await serialized(`staff:${id}`,async()=>{let existing:Staff|null=null;try{existing=await getDocument<Staff>("staff",id);}catch(e){if((e as {status?:number}).status!==404)throw e;}
  allow(id!==actor.$id);allow(actor.role==="owner"||((!existing||existing.role!=="owner")&&role!=="owner"));
  if(existing?.role==="owner"&&(role!=="owner"||!active)){const owners=await listDocuments<Staff>("staff",[query("equal","role",["owner"]),query("equal","active",[true])]);if(owners.total<2)throw new Response("Keep at least one active owner.",{status:400});}
  if(!active){const leads=await listDocuments<Lead>("leads",[query("equal","owner",[id]),query("limit",undefined,[1])]);if(leads.total)throw new Response("Reassign this person's leads before deactivating access.",{status:400});}
  await appwrite(`/users/${encodeURIComponent(id)}`);const values={name,role,active,teamId:field(form,"teamId",36)};
  if(existing)await updateDocument("staff",id,values);else await createDocument("staff",values,id);
  if(!active)await appwrite(`/users/${encodeURIComponent(id)}/sessions`,{method:"DELETE"});
  await audit(actor,id,"staff","Staff access updated",{role,active});return {error:"",success:true};
 });
 }catch(e){if(e instanceof Response){if([400,409].includes(e.status))return data({error:await e.text(),success:false},{status:e.status});throw e;}return data({error:"Could not update staff access. Check the Auth user ID and server scopes.",success:false},{status:503});}}
export default function Team(){const {staff,team}=useLoaderData<typeof loader>(),result=useActionData<typeof action>();return <><PageHeading eyebrow="THE PEOPLE BEHIND EVERY NEXT STEP" title="Team & access" description="Link Appwrite Auth identities to staff roles. Passwords stay in Appwrite."/><ActionError error={result?.error}/>{result?.success&&<p className="crm-success">Staff access saved.</p>}<section className="crm-panel crm-padded"><h2>Add or update a staff member</h2><Form method="post" className="crm-form"><div className="crm-two-col"><label>Existing Appwrite Auth user ID<input name="id" maxLength={36} required/></label><label>Display name<input name="name" maxLength={200} required/></label><label>Role<select name="role">{roles.filter(r=>staff.role==="owner"||r!=="owner").map(r=><option key={r}>{r}</option>)}</select></label><label>Access<select name="active"><option value="true">Active</option><option value="false">Deactivated</option></select></label></div><label>Team / branch ID<input name="teamId" maxLength={36}/></label><Submit>Save staff access</Submit></Form></section><section className="crm-panel"><div className="crm-table-wrap"><table className="crm-table"><thead><tr><th>Name</th><th>Auth user reference</th><th>Role</th><th>Access</th></tr></thead><tbody>{team.map(s=><tr key={s.$id}><td>{s.name}</td><td>{s.$id}</td><td>{s.role}</td><td><Badge>{s.active?"Active":"Deactivated"}</Badge></td></tr>)}</tbody></table></div></section></>;}
