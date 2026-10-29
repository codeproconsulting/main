import {Form,Link,data,useLoaderData,useActionData} from "react-router";
import type {ActionFunctionArgs,LoaderFunctionArgs} from "react-router";
import {requireStaff,sameOrigin} from "./auth.server";
import {allow,field} from "./crm.server";
import {canEditContent,canPublish} from "./domain";
import {listDocuments,query} from "~/lib/appwrite.server";
import {uploadMedia,setMediaVisibility,mediaForm,type Media} from "./media.server";
import {ActionError,Badge,Empty,PageHeading,Submit} from "./ui";
export async function loader({request}:LoaderFunctionArgs){const staff=await requireStaff(request);allow(canEditContent(staff));const result=await listDocuments<Media>("media",[query("orderDesc","$createdAt"),query("limit",undefined,[100])]);return {items:result.documents,publisher:canPublish(staff),origin:process.env.VITE_APP_URL||"https://proconsulting.uk"};}
export async function action({request}:ActionFunctionArgs){
 const staff=await requireStaff(request);sameOrigin(request);allow(canEditContent(staff));
 try{
  const form=await mediaForm(request),intent=field(form,"intent");
  if(intent==="visibility")await setMediaVisibility(staff,field(form,"id",36),field(form,"published"),field(form,"expected"));
  else if(intent==="upload"){
   const file=form.get("file");if(!(file instanceof File))throw new Response("Choose an image",{status:400});
   await uploadMedia(staff,file,String(form.get("alt")||""),String(form.get("caption")||""));
  }else throw new Response("Unknown media action",{status:400});
  return {error:""};
 }catch(error){if(error instanceof Response){if([400,409,413,503].includes(error.status))return data({error:await error.text()},{status:error.status});throw error;}return data({error:"Could not save this media item. Check the library and pending audits before retrying an upload.",},{status:503});}
}
export default function MediaLibrary(){const {items,publisher,origin}=useLoaderData<typeof loader>(),result=useActionData<typeof action>();return <><PageHeading eyebrow="BLOG STUDIO" title="Media library" description="Upload images privately. A publisher can make an image public for use in articles."/><ActionError error={result?.error}/><section className="crm-panel crm-padded"><Form method="post" encType="multipart/form-data" className="crm-form"><input type="hidden" name="intent" value="upload"/><label>Image (JPEG, PNG, WebP; maximum 5 MB)<input type="file" name="file" accept=".jpg,.jpeg,.png,.webp" required/></label><label>Alternative text<input name="alt" required maxLength={300}/></label><label>Caption<input name="caption" maxLength={1000}/></label><Submit>Upload image</Submit></Form></section><section className="crm-panel">{!items.length&&<Empty title="Build your image library">Use your own images with clear alternative text and captions.</Empty>}{items.map(m=><article className="crm-followup" key={m.$id}><div><h2>{m.name}</h2><Badge>{m.published?"Public":"Private editorial asset"}</Badge><p>{m.alt}</p>{m.published?<a href={`${origin}/media/${m.$id}`} target="_blank" rel="noreferrer">{origin}/media/{m.$id}</a>:<a href={`/admin/media/${m.$id}/download`}>Download private preview →</a>}</div>{publisher&&<Form method="post"><input type="hidden" name="intent" value="visibility"/><input type="hidden" name="id" value={m.$id}/><input type="hidden" name="expected" value={String(m.published)}/><input type="hidden" name="published" value={m.published?"false":"true"}/><Submit>{m.published?"Make private":"Publish image"}</Submit></Form>}</article>)}</section></>;}
