import {randomUUID} from "node:crypto";
import {AppwriteError,createDocument,getDocument,updateDocument} from "~/lib/appwrite.server";
import {allow,audit,serialized} from "./crm.server";
import {canEditContent,canPublish,type Staff} from "./domain";
import {boundedUploadForm,mediaBucket,uploadFile,removeFile,storageRequest} from "./storage.server";

export type Media={$id:string;fileId:string;name:string;alt:string;caption:string;mime:string;published:boolean;checksum:string};
export const imageTypes=["image/jpeg","image/png","image/webp"];
export async function mediaFor(id:string){
 if(!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,35}$/.test(id))throw new Response("Image not found",{status:404});
 try{return await getDocument<Media>("media",id);}catch(error){if(error instanceof AppwriteError&&error.status===404)throw new Response("Image not found",{status:404});throw error;}
}
export async function uploadMedia(staff:Staff,file:File,alt:string,caption:string){
 allow(canEditContent(staff));alt=alt.trim();caption=caption.trim();
 if(!alt||alt.length>300||caption.length>1000)throw new Response("Enter alternative text (up to 300 characters) and a caption of at most 1000 characters.",{status:400});
 if(!imageTypes.includes(file.type))throw new Response("Choose a JPEG, PNG, or WebP image.",{status:400});
 const id=randomUUID();
 // Durable intent identifies an orphan even if upload/metadata acknowledgement is lost.
 const event=await audit(staff,id,"media","Image upload requested",{state:"pending",fileId:id});
 const stored=await uploadFile(mediaBucket(),file,5*1024*1024,id);
 let media;
 try{media=await createDocument("media",{fileId:stored.fileId,name:file.name.slice(-200),alt,caption,mime:file.type,published:false,checksum:stored.checksum},id);}
 catch(error){
  // An HTTP timeout may follow a committed metadata write. Never delete its referenced file.
  let existing;
  try{existing=await mediaFor(id);}catch(check){if(!(check instanceof Response&&check.status===404))throw new Response("Upload outcome is uncertain. Contact an administrator to reconcile the pending media audit before uploading again.",{status:503});}
  if(existing&&existing.fileId===stored.fileId&&existing.checksum===stored.checksum)media=existing;
  else if(existing)throw new Response("Upload needs administrator reconciliation.",{status:503});
  else{
   try{await removeFile(mediaBucket(),stored.fileId);}catch{throw new Response("Metadata failed and file cleanup needs an administrator. The pending media audit records the file ID.",{status:503});}
   throw error;
  }
 }
 await updateDocument("activities",event.$id,{event:"Image uploaded",details:JSON.stringify({state:"completed",fileId:stored.fileId})});
 return media;
}
export async function setMediaVisibility(staff:Staff,id:string,published:string,expected:string){
 allow(canPublish(staff));
 if(!["true","false"].includes(published)||!["true","false"].includes(expected))throw new Response("Invalid image visibility",{status:400});
 return serialized(`media:${id}`,async()=>{
  const media=await mediaFor(id);
  if(String(media.published)!==expected)throw new Response("This image changed. Refresh before saving.",{status:409});
  if(!imageTypes.includes(media.mime)||!media.alt.trim())throw new Response("This image needs valid metadata before publication.",{status:400});
  const next=published==="true";
  if(next===media.published)return media;
  // Check the private file still exists before making a new public link usable.
  if(next){const stored=await storageRequest(`/storage/buckets/${mediaBucket()}/files/${encodeURIComponent(media.fileId)}`);await stored.body?.cancel();}
  const event=await audit(staff,id,"media","Image visibility requested",{state:"pending",before:media.published,after:next});
  const updated=await updateDocument<Media>("media",id,{published:next});
  await updateDocument("activities",event.$id,{event:next?"Image published":"Image made private",details:JSON.stringify({state:"completed",before:media.published,after:next})});
  return updated;
 });
}
export async function publicMedia(id:string){
 const media=await mediaFor(id);
 if(!media.published||!imageTypes.includes(media.mime))throw new Response("Image not found",{status:404});
 const stored=await storageRequest(`/storage/buckets/${mediaBucket()}/files/${encodeURIComponent(media.fileId)}/view`);
 return new Response(stored.body,{headers:{"Content-Type":media.mime,"X-Content-Type-Options":"nosniff","Cache-Control":"no-store","Content-Security-Policy":"default-src 'none'; sandbox"}});
}

export function mediaForm(request:Request){
 return boundedUploadForm(request,6*1024*1024,"Image");
}
