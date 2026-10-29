// Compatibility exports retained while delivery moves behind the unified content service.
import {allContent,contentPage,cover,type PublicPost,type ContentPage} from "~/lib/content-client";
export type Post=PublicPost;
export type PaginatedPostsResult=ContentPage;
export const getPosts=(limit=10000)=>allContent("education",limit);
export const getRecentPosts=async(limit:number)=>(await contentPage("education",1,limit)).docs;
export const getPostsPaginated=(page:number,limit:number)=>contentPage("education",page,limit);
export const getPostBySlug=async(slug:string)=>(await contentPage("education",1,1,slug)).docs[0]??null;
export const getCoverImageUrl=cover;
export const getCoverImageAlt=(post:Post)=>post.featureImageAlt||post.title;
