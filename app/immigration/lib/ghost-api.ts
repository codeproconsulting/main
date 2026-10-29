import {allContent,contentPage,type PublicPost} from "~/lib/content-client";
export interface GhostAuthor {id:string;name:string;slug:string;profile_image?:string|null;}
export interface GhostPost {id:string;uuid:string;title:string;slug:string;html:string;excerpt:string;feature_image:string;feature_image_alt:string;published_at:string;updated_at:string;meta_title:string;meta_description:string;authors:GhostAuthor[];}
function normalize(p:PublicPost):GhostPost{return {id:p.id,uuid:p.id,title:p.title,slug:p.slug,html:p.html,excerpt:p.excerpt,feature_image:p.featureImage,feature_image_alt:p.featureImageAlt,published_at:p.publishedAt,updated_at:p.updatedAt,meta_title:p.metaTitle,meta_description:p.metaDescription,authors:[{id:p.author,name:p.author,slug:p.author.toLowerCase().replace(/\W+/g,"-")}]};}
export const getPosts=async()=>(await allContent("immigration")).map(normalize);
export const getPostBySlug=async(slug:string)=>{const post=(await contentPage("immigration",1,1,slug)).docs[0];return post?normalize(post):null;};
export const getCoverImageUrl=(p:GhostPost)=>p.feature_image||`https://picsum.photos/seed/${encodeURIComponent(p.slug)}/800/450`;
export const getCoverImageAlt=(p:GhostPost)=>p.feature_image_alt||p.title;
export const getPrimaryAuthorName=(p:GhostPost)=>p.authors?.[0]?.name??null;
