import {listDocuments,query} from "~/lib/appwrite.server";
import {allow} from "./crm.server";
import {canManage,type Lead,type Staff} from "./domain";
export async function reportLeads(staff:Staff){allow(canManage(staff));const leads:(Lead&{$createdAt:string})[]=[];let cursor:string|undefined;
 do{const page=await listDocuments<Lead>("leads",[query("orderAsc","$id"),query("limit",undefined,[100]),...(cursor?[query("cursorAfter",undefined,[cursor])]:[])]);leads.push(...page.documents);cursor=page.documents.length===100?page.documents[99].$id:undefined;}while(cursor&&leads.length<10000);return {leads,truncated:Boolean(cursor)};}
export function csvCell(value:unknown){let text=String(value??"");if(/^[\s]*[=+@-]/.test(text))text="'"+text;return '"'+text.replaceAll('"','""')+'"';}
