import type {ActionFunctionArgs} from "react-router";
import {data} from "react-router";
import {requireStaff,sameOrigin} from "./auth.server";
import {allow,field} from "./crm.server";
import {canEditContent} from "./domain";
import {safeArticle} from "~/lib/article-html";
export async function action({request}:ActionFunctionArgs){const staff=await requireStaff(request);sameOrigin(request);allow(canEditContent(staff));const form=await request.formData();return data({html:safeArticle(field(form,"body",1000000))},{headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex"}});}
export const loader=()=>new Response("Method not allowed",{status:405});
