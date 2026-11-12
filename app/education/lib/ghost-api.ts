// Compatibility exports retained while delivery moves behind the unified content service.
import {contentPage,cover,type PublicPost} from "~/lib/content-client";
export type Post=PublicPost;
export const getRecentPosts=async(limit:number)=>(await contentPage("education",1,limit)).docs;
export const getPostBySlug=async(slug:string)=>(await contentPage("education",1,1,slug)).docs[0]??null;
export const getCoverImageUrl=cover;
export const getCoverImageAlt=(post:Post)=>post.featureImageAlt||post.title;
