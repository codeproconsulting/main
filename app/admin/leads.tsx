import { randomUUID } from "node:crypto";
import { useState } from "react";
import { Form, Link, data, redirect, useActionData, useLoaderData } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Search, ArrowUpRight } from "lucide-react";
import { leadServices } from "~/lib/lead-contact";
import { requireStaff, sameOrigin } from "./auth.server";
import { canManage, displayDate, stages } from "./domain";
import { field, leadsFor, listStaff } from "./crm.server";
import { createManualLead } from "./manual-leads.server";
import { ActionError, Badge, Empty, PageHeading, Submit } from "./ui";

function pageNumber(value: string | null) {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? Math.max(1, Math.min(10_000, parsed)) : 1;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const staff = await requireStaff(request);
  const url = new URL(request.url);
  const search = url.searchParams.get("q")?.slice(0, 254) ?? "";
  const stage = url.searchParams.get("stage") ?? "";
  const page = pageNumber(url.searchParams.get("page"));
  const [leads, team] = await Promise.all([
    leadsFor(staff, search, stage, page), canManage(staff) ? listStaff() : Promise.resolve([staff]),
  ]);
  const create = url.searchParams.get("new") === "1";
  return { leads, team, search, stage, page, create, submissionId: create ? randomUUID() : "", manager: canManage(staff) };
}

export async function action({ request }: ActionFunctionArgs) {
  const staff = await requireStaff(request);
  sameOrigin(request);
  try {
    const form = await request.formData();
    const intent = field(form, "intent", 20);
    if (intent === "create") {
      const lead = await createManualLead(staff, form);
      return redirect(`/admin/leads/${lead.$id}`);
    }
    if (intent === "search") {
      const search = field(form, "q", 254);
      const stage = field(form, "stage", 50);
      const page = pageNumber(field(form, "page", 6));
      if (search && search.length < 3) throw new Response("Enter at least three characters to search.", { status: 400 });
      const leads = await leadsFor(staff, search, stage, page);
      return { kind: "search" as const, leads, search, stage, page };
    }
    throw new Response("Unknown lead action.", { status: 400 });
  } catch (error) {
    if (error instanceof Response) {
      if (![400, 409, 503].includes(error.status)) throw error;
      return data({ kind: "error" as const, error: await error.text() }, { status: error.status });
    }
    return data({ kind: "error" as const, error: "Could not complete the request. Please try again." }, { status: 503 });
  }
}

function NewLeadForm({ submissionId, manager }: { submissionId: string; manager: boolean }) {
  const [stableId] = useState(submissionId);
  return <section className="crm-panel crm-padded">
    <h2>Add an enquiry</h2>
    <p>{manager ? "The lead starts unassigned. Assign it from the lead page." : "The lead will be assigned to you."}</p>
    <Form method="post" className="crm-form">
      <input type="hidden" name="intent" value="create" />
      <input type="hidden" name="submissionId" value={stableId} />
      <div className="crm-two-col">
        <label>Full name<input name="name" autoComplete="off" maxLength={200} required /></label>
        <label>Email<input name="email" type="email" autoComplete="off" maxLength={254} required /></label>
        <label>Phone<input name="phone" type="tel" autoComplete="off" maxLength={80} required /></label>
        <label>Service<select name="service">{leadServices.map(service => <option key={service}>{service}</option>)}</select></label>
        <label>Destination (optional)<input name="country" maxLength={150} /></label>
      </div>
      <label>Enquiry notes (optional)<textarea name="notes" maxLength={4000} rows={3} /></label>
      <div><Submit>Add lead</Submit>{" "}<Link to="/admin/leads">Cancel</Link></div>
    </Form>
  </section>;
}

export default function Leads() {
  const initial = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();
  const { leads, search, stage, page } = result?.kind === "search" ? result : initial;

  return <>
    <PageHeading eyebrow="LEAD MANAGEMENT" title="Leads & enquiries" description="Find enquiries and manage their next steps.">
      {!initial.create && <Link className="crm-button" to="?new=1">Add enquiry</Link>}
    </PageHeading>
    <ActionError error={result?.kind === "error" ? result.error : undefined} />
    {initial.create && <NewLeadForm submissionId={initial.submissionId} manager={initial.manager} />}
    <section className="crm-panel">
      <Form method="post" className="crm-filters" key={`${search}:${stage}`}>
        <input type="hidden" name="intent" value="search" />
        <div className="crm-search"><Search size={18} aria-hidden="true" />
          <input aria-label="Search by name, email or phone" name="q" defaultValue={search} placeholder="Name, full email or phone" minLength={3} maxLength={254} />
        </div>
        <select aria-label="Filter by stage" name="stage" defaultValue={stage}>
          <option value="">All stages</option>{stages.map(value => <option key={value}>{value}</option>)}
        </select>
        <button className="crm-button secondary">Apply filters</button>
      </Form>
      <div className="crm-table-wrap"><table className="crm-table">
        <thead><tr><th>Contact</th><th>Service & destination</th><th>Stage</th><th>Priority</th><th>Assigned to</th><th>Next follow-up</th><th /></tr></thead>
        <tbody>{leads.documents.map(lead => <tr key={lead.$id}>
          <td><Link to={`/admin/leads/${lead.$id}`}><strong>{lead.name}</strong><small>{lead.email}</small></Link></td>
          <td>{lead.service}<small>{lead.country || "Destination to confirm"}</small></td>
          <td><Badge tone={lead.stage === "New" ? "pink" : "neutral"}>{lead.stage}</Badge></td>
          <td><Badge tone={lead.priority === "Urgent" ? "pink" : "neutral"}>{lead.priority || "Normal"}</Badge></td>
          <td>{initial.team.find(member => member.$id === lead.owner)?.name || (lead.owner ? "Assigned counselor" : "Unassigned")}</td>
          <td>{displayDate(lead.nextFollowUp)}</td>
          <td><Link aria-label={`Open ${lead.name}`} to={`/admin/leads/${lead.$id}`}><ArrowUpRight size={18} /></Link></td>
        </tr>)}</tbody>
      </table></div>
      {!leads.documents.length && <Empty title="No enquiries in this view">Try a different search or stage.</Empty>}
      <div className="crm-pagination">
        <span>{leads.total} enquiries · Page {page}</span>
        <Form method="post">
          <input type="hidden" name="intent" value="search" />
          <input type="hidden" name="q" value={search} />
          <input type="hidden" name="stage" value={stage} />
          {page > 1 && <button name="page" value={page - 1}>← Previous</button>}
          {page < 10_000 && page * 25 < leads.total && <button name="page" value={page + 1}>Next →</button>}
        </Form>
      </div>
    </section>
  </>;
}
