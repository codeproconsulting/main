import { safeArticle } from "~/lib/article-html";
export { safeArticle } from "~/lib/article-html";
import { createDocument, getDocument, listDocuments, query, updateDocument } from "~/lib/appwrite.server";
import { canEditContent, canPublish, type Post, type Staff } from "./domain";
import { allow, audit, field, dateField, serialized } from "./crm.server";
export async function postsFor(staff:Staff) {allow(canEditContent(staff));return listDocuments<Post>("posts",[query("orderDesc","$updatedAt"),query("limit",undefined,[100])]);}
export async function postFor(staff:Staff,id:string){allow(canEditContent(staff));const post=await getDocument<Post>("posts",id);return {...post,body:safeArticle(post.body)};}
export async function savePost(staff:Staff,id:string,form:FormData){
 allow(canEditContent(staff));
 return serialized(`post:${id}`,async()=>{
 const existing=id==="new"?null:await postFor(staff,id);
 if(existing&&existing.version!==Number(field(form,"version")))throw new Response("This post has changed. Refresh before saving.",{status:409});
 const title=field(form,"title",300),slug=field(form,"slug",200),section=field(form,"section",30),status=field(form,"status",30);
 if(!title||!slug||!/^([a-z0-9]+-)*[a-z0-9]+$/.test(slug))throw new Response("Enter a title and a lowercase URL slug with hyphens.",{status:400});
 if(!["education","immigration","general"].includes(section)||!["draft","review","scheduled","published","archived"].includes(status))throw new Response("Invalid content settings",{status:400});
 allow(canPublish(staff)||!["published","scheduled"].includes(status));
 // Editing a live article requires publishing permission; editors must use a draft copy.
 allow(!existing||existing.status!=="published"||canPublish(staff));
 if(existing&&(existing.slug!==slug||existing.section!==section))throw new Response("URL changes require a redirect migration. Keep the existing section and slug for now.",{status:400});
 const duplicates=await listDocuments<Post>("posts",[query("equal","slug",[slug]),query("equal","section",[section]),query("limit",undefined,[2])]);
 if(duplicates.documents.some(p=>p.$id!==existing?.$id))throw new Response("That URL is already in use.",{status:409});
 const image=field(form,"image",2000);if(image&&!/^https:\/\//i.test(image))throw new Response("Image URLs must use HTTPS.",{status:400});
 const body=safeArticle(field(form,"body",500000));
 if(status==="published"&&!body.trim())throw new Response("Add article content before publishing.",{status:400});
 const requestedDate=dateField(field(form,"publishedAt",40));
 if(status==="scheduled"&&(!requestedDate||Date.parse(requestedDate)<=Date.now()))throw new Response("Choose a future publishing date with a timezone.",{status:400});
 if(existing)await createDocument("revisions",{postId:id,actor:staff.$id,payload:JSON.stringify(existing),version:existing.version});
 const payload={title,slug,section,status,body,excerpt:field(form,"excerpt",2000),image,publishedAt:status==="scheduled"?requestedDate:(existing?.publishedAt||(status==="published"?new Date().toISOString():"")),metaTitle:field(form,"metaTitle",300),metaDescription:field(form,"metaDescription",1000),author:field(form,"author",200)||staff.name,legacyId:existing?.legacyId??"",version:(existing?.version??0)+1};
 const post=existing?await updateDocument<Post>("posts",id,payload):await createDocument("posts",payload);
 await audit(staff,post.$id,"post",existing?"Post updated":"Post created",{title,status,version:payload.version});
 return post;
 });
}
