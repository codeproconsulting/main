import { randomUUID } from "node:crypto";
import { useState } from "react";
import { Form, Link, data, redirect, useActionData, useLoaderData } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Search, ArrowUpRight } from "lucide-react";
import { leadServices } from "~/lib/lead-contact";
import { requireStaff, sameOrigin } from "./auth.server";
import { bulkLeadLimit, canManage, canUseCRM, displayDate, priorities, stages } from "./domain";
import { field, leadsFor, listStaff } from "./crm.server";
import { bulkUpdateLeads } from "./bulk-leads.server";
import { saveRoutingSettings } from "./lead-routing.server";
import { changeLeadView, leadViews } from "./lead-views.server";
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
  const priority = url.searchParams.get("priority") ?? "";
  const ownerFilter = canManage(staff) ? url.searchParams.get("assigned")?.slice(0, 36) ?? "" : "";
  const page = pageNumber(url.searchParams.get("page"));
  const [leads, team, views] = await Promise.all([
    leadsFor(staff, search, stage, page, priority, ownerFilter), canManage(staff) ? listStaff() : Promise.resolve([staff]), leadViews(staff),
  ]);
  const create = url.searchParams.get("new") === "1";
  return { leads, team, views, search, stage, priority, ownerFilter, page, create, submissionId: create ? randomUUID() : "", manager: canManage(staff) };
}

export async function action({ request }: ActionFunctionArgs) {
  const staff = await requireStaff(request);
  sameOrigin(request);
  try {
    const form = await request.formData();
    const intent = field(form, "intent", 20);
    if (intent === "routing-settings") {
      await saveRoutingSettings(staff, form);
      return redirect("/admin/leads");
    }
    if (intent === "create") {
      const lead = await createManualLead(staff, form);
      return redirect(`/admin/leads/${lead.$id}`);
    }
    if (intent === "save-view" || intent === "remove-view") {
      const stage = field(form, "stage", 50);
      const priority = field(form, "priority", 20);
      await changeLeadView(staff, intent === "save-view" ? "save" : "remove", stage, priority);
      return redirect(`/admin/leads?${new URLSearchParams({ stage, priority })}`);
    }
    if (intent === "search" || intent === "bulk-update") {
      const search = field(form, "q", 254);
      const stage = field(form, "stage", 50);
      const priority = field(form, "priority", 20);
      const ownerFilter = canManage(staff) ? field(form, "assigned", 36) : "";
      const page = pageNumber(field(form, "page", 6));
      if (search && search.length < 3) throw new Response("Enter at least three characters to search.", { status: 400 });
      if (intent === "bulk-update") {
        const results = await bulkUpdateLeads(staff, form);
        const leads = await leadsFor(staff, search, stage, page, priority, ownerFilter).catch(() => null);
        return { kind: "bulk" as const, batchId: randomUUID(), results, leads, search, stage, priority, ownerFilter, page };
      }
      const leads = await leadsFor(staff, search, stage, page, priority, ownerFilter);
      return { kind: "search" as const, leads, search, stage, priority, ownerFilter, page };
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
  const { leads, search, stage, priority, ownerFilter, page } = result?.kind === "search" ? result : result?.kind === "bulk" && result.leads ? { ...result, leads: result.leads } : initial;

  const assignees = initial.team.filter(member => member.active && canUseCRM(member));
  const saved = initial.views?.some(view => view.stage === stage && view.priority === priority);
  return <>
    <PageHeading eyebrow="LEAD MANAGEMENT" title="Leads & enquiries" description="Find enquiries and manage their next steps.">
      {!initial.create && <Link className="crm-button" to="?new=1">Add enquiry</Link>}
    </PageHeading>
    <ActionError error={result?.kind === "error" ? result.error : undefined} />
    {result?.kind === "bulk" && <section className="crm-panel crm-padded" aria-live="polite">
      <h2>Bulk update results</h2>
      <p>{result.results.filter(row => row.status === "saved").length} of {result.results.length} saved.</p>
      {!result.leads && <p>Could not refresh the filtered list. Reload before making more changes.</p>}
      <ul>{result.results.map(row => <li key={row.id}>
        <Link to={`/admin/leads/${row.id}`}>{row.id}</Link> · {row.message}
      </li>)}</ul>
    </section>}
    {initial.manager && <details className="crm-panel crm-padded">
      <summary>Counselor routing settings</summary>
      <p>Set who can receive unassigned enquiries through round robin and how many active enquiries they can carry.</p>
      {assignees.filter(member => member.role === "counselor").map(member => <Form key={member.$id} method="post" className="crm-form">
        <input type="hidden" name="intent" value="routing-settings"/>
        <input type="hidden" name="counselor" value={member.$id}/>
        <fieldset className="crm-two-col">
          <legend>{member.name}</legend>
          <label>Availability<select name="availability" defaultValue={member.routingAvailability || "paused"}>
            <option value="paused">Paused</option><option value="available">Available</option>
          </select></label>
          <label>Active enquiry limit<input name="capacity" type="number" min={1} max={100} required defaultValue={member.routingCapacity || "10"}/></label>
        </fieldset>
        <div><Submit>Save routing settings</Submit></div>
      </Form>)}
    </details>}
    {initial.create && <NewLeadForm submissionId={initial.submissionId} manager={initial.manager} />}
    {initial.views && <section className="crm-panel crm-padded">
      <h2>My saved views</h2>
      {initial.views.length === 0 ? <p>Apply a stage or priority filter to save your first view.</p> :
        <ul className="flex flex-wrap gap-2">{initial.views.map(view => <li key={view.$id}>
          <Link className="crm-button secondary" to={`?${new URLSearchParams({ stage: view.stage, priority: view.priority })}`}>
            {[view.stage, view.priority].filter(Boolean).join(" · ")}
          </Link>
        </li>)}</ul>}
      {(stage || priority) && <Form method="post" className="crm-form">
        <input type="hidden" name="intent" value={saved ? "remove-view" : "save-view"}/>
        <input type="hidden" name="stage" value={stage}/>
        <input type="hidden" name="priority" value={priority}/>
        {(search || ownerFilter) && <p>Saved views include stage and priority only.</p>}
        <div><Submit>{saved ? "Remove current view" : "Save current filters"}</Submit></div>
      </Form>}
    </section>}
    <section className="crm-panel">
      <Form method="post" className="crm-filters" key={`${search}:${stage}:${priority}:${ownerFilter}`}>
        <input type="hidden" name="intent" value="search" />
        <div className="crm-search"><Search size={18} aria-hidden="true" />
          <input aria-label="Search by name, email or phone" name="q" defaultValue={search} placeholder="Name, full email or phone" minLength={3} maxLength={254} />
        </div>
        <select aria-label="Filter by stage" name="stage" defaultValue={stage}>
          <option value="">All stages</option>{stages.map(value => <option key={value}>{value}</option>)}
        </select>
        <select aria-label="Filter by priority" name="priority" defaultValue={priority}>
          <option value="">All priorities</option>{priorities.map(value => <option key={value}>{value}</option>)}
        </select>
        {initial.manager && <select aria-label="Filter by counselor" name="assigned" defaultValue={ownerFilter}>
          <option value="">All counselors</option><option value="-">Unassigned</option>
          {assignees.map(member => <option key={member.$id} value={member.$id}>{member.name}</option>)}
        </select>}
        <button className="crm-button secondary">Apply filters</button>
      </Form>
      {initial.manager && leads.documents.length > 0 && <Form id="bulk-leads" method="post" className="crm-form crm-padded" key={result?.kind === "bulk" ? result.batchId : "bulk"}>
        <input type="hidden" name="intent" value="bulk-update"/>
        <input type="hidden" name="q" value={search}/>
        <input type="hidden" name="stage" value={stage}/>
        <input type="hidden" name="priority" value={priority}/>
        <input type="hidden" name="assigned" value={ownerFilter}/>
        <input type="hidden" name="page" value={page}/>
        <p>Select up to {bulkLeadLimit} enquiries on this page.</p>
        <div className="crm-two-col">
          <label>Set stage<select name="bulkStage"><option value="">Keep current stage</option>{stages.map(value => <option key={value}>{value}</option>)}</select></label>
          <label>Set priority<select name="bulkPriority"><option value="">Keep current priority</option>{priorities.map(value => <option key={value}>{value}</option>)}</select></label>
        </div>
        <label>Assign to<select name="bulkOwner"><option value="">Keep current assignment</option>
          <option value="@round-robin">Round robin (unassigned only)</option>
          {assignees.map(member => <option key={member.$id} value={member.$id}>{member.name}</option>)}
        </select></label>
        <label>Reason (required for assignment or closure)<input name="reason" maxLength={2000}/></label>
        <div><Submit>Update selected enquiries</Submit></div>
      </Form>}
      <div className="crm-table-wrap"><table className="crm-table">
        <thead><tr>{initial.manager && <th scope="col">Select</th>}<th>Contact</th><th>Service & destination</th><th>Stage</th><th>Priority</th><th>Assigned to</th><th>Next follow-up</th><th /></tr></thead>
        <tbody>{leads.documents.map(lead => <tr key={lead.$id}>
          {initial.manager && <td><input key={`${search}:${stage}:${priority}:${ownerFilter}:${page}:${result?.kind === "bulk" ? result.batchId : ""}:${lead.version}`} type="checkbox" form="bulk-leads" name="selected" value={`${lead.$id}:${lead.version}`} aria-label={`Select ${lead.name}`}/></td>}
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
          <input type="hidden" name="priority" value={priority} />
          <input type="hidden" name="assigned" value={ownerFilter}/>
          {page > 1 && <button name="page" value={page - 1}>← Previous</button>}
          {page < 10_000 && page * 25 < leads.total && <button name="page" value={page + 1}>Next →</button>}
        </Form>
      </div>
    </section>
  </>;
}
