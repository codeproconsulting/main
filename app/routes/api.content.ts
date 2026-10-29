import { data } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { readPublicContent } from "~/lib/public-content.server";
export async function loader({request}:LoaderFunctionArgs){
 if(process.env.APP_SURFACE==="dashboard")throw new Response("Not found",{status:404});
 const url=new URL(request.url),section=url.searchParams.get("section")??"",slug=url.searchParams.get("slug")??"";
 if(!["","education","immigration","general"].includes(section)|| (slug&&!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)))throw new Response("Invalid content query",{status:400});
 const page=Math.max(1,Math.min(10000,Math.floor(Number(url.searchParams.get("page"))||1))),limit=Math.max(1,Math.min(100,Math.floor(Number(url.searchParams.get("limit"))||12)));
 try{const result=await readPublicContent(section,slug,page,limit);return data({...result,page,totalPages:Math.ceil(result.totalDocs/limit),hasNextPage:page*limit<result.totalDocs,hasPrevPage:page>1},{headers:{"Cache-Control":"no-store"}});}catch(error){if(error instanceof Response)throw error;throw new Response("Blog service unavailable",{status:503});}
}
