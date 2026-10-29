export type PublicPost = {id:string;title:string;slug:string;section:string;excerpt:string;html:string;body:string;featureImage:string;featureImageAlt:string;publishedAt:string;updatedAt:string;author:string;metaTitle:string;metaDescription:string};
export type ContentPage={docs:PublicPost[];totalDocs:number;totalPages:number;page:number;hasNextPage:boolean;hasPrevPage:boolean};
export async function contentPage(section="",page=1,limit=100,slug=""):Promise<ContentPage>{
 const params=new URLSearchParams({section,page:String(page),limit:String(limit),...(slug?{slug}:{})});
 // Server-side reads use this process's loopback listener. Credentials never enter this adapter.
 const base=import.meta.env.SSR?(process.env.PUBLIC_CONTENT_ORIGIN||`http://127.0.0.1:${process.env.PORT||3000}`):"";
 const response=await fetch(`${base}/api/content?${params}`,{signal:AbortSignal.timeout(20000)});
 if(!response.ok)throw new Error("Blog content is temporarily unavailable");return response.json();
}
export async function allContent(section="",limit=10000){const result:PublicPost[]=[];let page=1;while(result.length<limit){const next=await contentPage(section,page,Math.min(100,limit-result.length));result.push(...next.docs);if(!next.hasNextPage)break;page++;}return result;}
export const cover=(p:PublicPost)=>p.featureImage||`https://picsum.photos/seed/${encodeURIComponent(p.slug)}/800/450`;
