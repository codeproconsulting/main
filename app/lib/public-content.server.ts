import { listDocuments, query } from "./appwrite.server";
import { safeArticle } from "./article-html";
import type { Post } from "~/admin/domain";
export type PublicPost = {id:string;title:string;slug:string;section:string;excerpt:string;html:string;body:string;featureImage:string;featureImageAlt:string;publishedAt:string;updatedAt:string;author:string;metaTitle:string;metaDescription:string};
function fromRecord(post:Post & {$updatedAt?:string}):PublicPost {
 let metadata:Record<string,string>={};try{metadata=JSON.parse(post.metadata??"{}");}catch{}
 const html=safeArticle(post.body);
 return {id:post.$id,title:post.title,slug:post.slug,section:post.section,excerpt:post.excerpt,html,body:html,featureImage:post.image,featureImageAlt:metadata.feature_image_alt||post.title,publishedAt:post.publishedAt,updatedAt:metadata.updated_at||post.$updatedAt||post.publishedAt,author:post.author,metaTitle:post.metaTitle,metaDescription:post.metaDescription};
}
export async function readPublicContent(section:string,slug:string,page:number,limit:number){
 if(process.env.BLOG_PROVIDER==="appwrite") {
  const filters=[query("equal","status",["published"]),query("lessThanEqual","publishedAt",[new Date().toISOString()]),query("notEqual","publishedAt",[""]),query("orderDesc","publishedAt"),query("limit",undefined,[limit]),query("offset",undefined,[(page-1)*limit])];
  if(section)filters.push(query("equal","section",[section]));
  if(slug)filters.push(query("equal","slug",[slug]));
  const result=await listDocuments<Post>("posts",filters);return {docs:result.documents.map(fromRecord),totalDocs:result.total};
 }
 const origin=(process.env.VITE_GHOST_API_URL||process.env.VITE_GHOST_URL||"").replace(/\/$/,"").replace(/\/ghost$/,"");
 if(!origin||!process.env.VITE_GHOST_CONTENT_API_KEY)throw new Response("Blog service unavailable",{status:503});
 const url=new URL(origin+"/ghost/api/content/posts/");
 url.searchParams.set("key",process.env.VITE_GHOST_CONTENT_API_KEY);url.searchParams.set("include","authors,tags");url.searchParams.set("formats","html");url.searchParams.set("page",String(page));url.searchParams.set("limit",String(limit));url.searchParams.set("order","published_at DESC");
 const filters=[];if(section&&!slug)filters.push(`tag:${section}`);if(slug)filters.push(`slug:${slug}`);if(filters.length)url.searchParams.set("filter",filters.join("+"));
 const response=await fetch(url,{headers:{"Accept-Version":"v5.0"},signal:AbortSignal.timeout(15000)});
 if(!response.ok)throw new Response("Blog service unavailable",{status:503});
 const data=await response.json();
 const docs:PublicPost[]=(data.posts??[]).map((p:any)=>{const html=safeArticle(p.html??"");return {id:p.id,title:p.title,slug:p.slug,section:p.tags?.some((t:any)=>t.slug==="immigration")?"immigration":"education",excerpt:p.custom_excerpt||p.excerpt||"",html,body:html,featureImage:p.feature_image?new URL(p.feature_image,origin).href:"",featureImageAlt:p.feature_image_alt||p.title,publishedAt:p.published_at,updatedAt:p.updated_at,author:p.authors?.map((a:any)=>a.name).join(", ")||"ProConsulting",metaTitle:p.meta_title||"",metaDescription:p.meta_description||""};});
 const visible=slug&&section?docs.filter(p=>p.section===section):docs;
 return {docs:visible,totalDocs:slug?visible.length:(data.meta?.pagination?.total??visible.length)};
}
