import { data } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { captureLead } from "~/lib/intake.server";
export function loader(){return new Response("Method not allowed",{status:405,headers:{Allow:"POST"}});}
export async function action({request}:ActionFunctionArgs){
 try {
  if(Number(request.headers.get('Content-Length')??0)>32000)throw new Response('Submission too large',{status:413});
  const raw=await request.text();if(raw.length>32000)throw new Response('Submission too large',{status:413});
  let input;try{input=JSON.parse(raw);}catch{throw new Response('Invalid submission',{status:400});}
  if(!input||typeof input!=='object'||Array.isArray(input))throw new Response('Invalid submission',{status:400});
  const lead=await captureLead(request,input);return data({success:true,reference:lead.$id},{headers:{'Cache-Control':'no-store'}});
 }catch(e){if(e instanceof Response)return data({success:false,error:await e.text()},{status:e.status,headers:e.headers});return data({success:false,error:'We could not save your enquiry. Please retry shortly; your details have not been confirmed.'},{status:503});}
}
