import type {LoaderFunctionArgs} from "react-router";
import {requireStaff} from "./auth.server";
import {audit} from "./crm.server";
import {reportLeads,csvCell} from "./reports.server";
export async function loader({request}:LoaderFunctionArgs){const staff=await requireStaff(request),{leads,truncated}=await reportLeads(staff);if(truncated)throw new Response("Export exceeds 10,000 records. Use a scoped export process.",{status:413});await audit(staff,staff.$id,"export","Lead export requested",{count:leads.length});const fields=["$id","$createdAt","name","email","phone","service","source","country","stage","owner","priority","nextFollowUp"] as const;const csv=[fields.map(csvCell).join(","),...leads.map(l=>fields.map(k=>csvCell(l[k])).join(","))].join("\r\n");return new Response('\uFEFF'+csv,{headers:{"Content-Type":"text/csv; charset=utf-8","Content-Disposition":"attachment; filename=proconsulting-leads.csv","Cache-Control":"private, no-store"}});}
