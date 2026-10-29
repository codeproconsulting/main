import { Form, Link, useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { Search, ArrowUpRight } from "lucide-react";
import { requireStaff } from "./auth.server";
import { canManage, displayDate, stages } from "./domain";
import { leadsFor, listStaff } from "./crm.server";
import { Badge, Empty, PageHeading } from "./ui";
export async function loader({ request }: LoaderFunctionArgs) {
 const staff = await requireStaff(request); const url = new URL(request.url); const search = url.searchParams.get("q") ?? ""; const stage = url.searchParams.get("stage") ?? ""; const page = Math.max(1, Math.min(10000, Number(url.searchParams.get("page")) || 1));
 const [leads,team] = await Promise.all([leadsFor(staff,search,stage,page), canManage(staff) ? listStaff() : Promise.resolve([staff])]);
 return { ...leads, team, search, stage, page };
}
export default function Leads() {
 const { documents: leads, total, team, search, stage, page } = useLoaderData<typeof loader>();
 const pageUrl = (p:number)=>`?${new URLSearchParams({q:search,stage,page:String(p)})}`;
 return <><PageHeading eyebrow="CONNECTIONS THAT GO SOMEWHERE" title="Leads & enquiries" description="One shared place for every enquiry. One clear owner for every next step."/><section className="crm-panel"><Form method="get" className="crm-filters"><div className="crm-search"><Search size={18}/><input aria-label="Search lead names" name="q" defaultValue={search} placeholder="Search names (3+ characters)…" minLength={3}/></div><select aria-label="Filter by stage" name="stage" defaultValue={stage}><option value="">All stages</option>{stages.map(s=><option key={s}>{s}</option>)}</select><button className="crm-button secondary">Apply filters</button></Form><div className="crm-table-wrap"><table className="crm-table"><thead><tr><th>Contact</th><th>Service & destination</th><th>Stage</th><th>Assigned to</th><th>Next follow-up</th><th/></tr></thead><tbody>{leads.map(l=><tr key={l.$id}><td><Link to={`/admin/leads/${l.$id}`}><strong>{l.name}</strong><small>{l.email}</small></Link></td><td>{l.service}<small>{l.country || "Destination to confirm"}</small></td><td><Badge tone={l.stage==="New"?"pink":"neutral"}>{l.stage}</Badge></td><td>{team.find(s=>s.$id===l.owner)?.name || (l.owner ? "Assigned counselor" : "Unassigned")}</td><td>{displayDate(l.nextFollowUp)}</td><td><Link aria-label={`Open ${l.name}`} to={`/admin/leads/${l.$id}`}><ArrowUpRight size={18}/></Link></td></tr>)}</tbody></table></div>{!leads.length && <Empty title="No enquiries in this view">Try another filter, or return when a new enquiry arrives.</Empty>}<div className="crm-pagination"><span>{total} enquiries · Page {page}</span><div>{page>1 && <Link to={pageUrl(page-1)}>← Previous</Link>}{page*25<total && <Link to={pageUrl(page+1)}>Next →</Link>}</div></div></section></>;
}
