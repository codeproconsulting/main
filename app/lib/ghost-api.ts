import {contentPage,cover,type PublicPost} from "./content-client";
export type Post=PublicPost;
export const getRecentPosts=async(limit:number)=>(await contentPage("",1,limit)).docs;
export const getCoverImageUrl=cover;
export const getCoverImageAlt=(post:Post)=>post.featureImageAlt||post.title;
