import { Form, Link, data, useActionData, useLoaderData } from "react-router";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { requireStaff, sameOrigin } from "./auth.server";
import { allow } from "./crm.server";
import { roles } from "./domain";
import { canManageStaff, teamFor, updateStaffAccess } from "./team.server";
import { ActionError, Badge, PageHeading, Submit } from "./ui";

export async function loader({ request }: LoaderFunctionArgs) {
  const staff = await requireStaff(request);
  return teamFor(staff, new URL(request.url).searchParams);
}

export async function action({ request }: ActionFunctionArgs) {
  const staff = await requireStaff(request);
  sameOrigin(request);
  allow(canManageStaff(staff));
  try {
    const result = await updateStaffAccess(staff, await request.formData());
    return { error: "", success: !result.pending, pending: result.pending };
  } catch (error) {
    if (error instanceof Response) {
      if (![400, 409, 503].includes(error.status)) throw error;
      return data({ error: await error.text(), success: false, pending: false }, { status: error.status });
    }
    return data({ error: "Could not confirm the access change. Refresh the team page and check the Appwrite connection before retrying.",
      success: false, pending: false }, { status: 503 });
  }
}

function teamUrl(after: string, edit = "") {
  const query = new URLSearchParams();
  if (after) query.set("after", after);
  if (edit) query.set("edit", edit);
  return "/admin/team" + (query.size ? "?" + query : "");
}

export default function Team() {
  const { team, selected, editableIds, next, cursor, owner } = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();
  return <>
    <PageHeading eyebrow="WORKSPACE ACCESS" title="Team & access"
      description="Link an existing Appwrite account, change a staff role or deactivate access." />
    <ActionError error={result?.error} />
    {result?.pending && <ActionError error="CRM access is deactivated. Appwrite session revocation is still pending. Save the deactivated profile again to retry." />}
    {result?.success && <p className="crm-success" role="status">Staff access saved.</p>}
    <section className="crm-panel crm-padded" id="staff-access-form">
      <h2>{selected ? `Edit access for ${selected.name}` : "Link a staff member"}</h2>
      {selected && <Link to={teamUrl(cursor)}>Link someone else</Link>}
      <Form method="post" className="crm-form" key={`${selected?.$id ?? "new"}:${selected?.$updatedAt ?? ""}`}>
        <input name="expected" type="hidden" value={selected?.$updatedAt ?? ""} />
        <div className="crm-two-col">
          <label>Existing Appwrite Auth user ID<input name="id" maxLength={36} defaultValue={selected?.$id} readOnly={Boolean(selected)} required /></label>
          <label>Display name<input name="name" maxLength={200} defaultValue={selected?.name} required /></label>
          <label>Role<select name="role" defaultValue={selected?.role ?? "counselor"}>
            {roles.filter(role => owner || role !== "owner").map(role => <option key={role}>{role}</option>)}
          </select></label>
          {selected ? <label>Access<select name="active" defaultValue={String(selected.active)}>
            <option value="true" disabled={Boolean(selected.revocationPending)}>Active</option>
            <option value="false">Deactivated</option>
          </select></label> : <input name="active" type="hidden" value="true" />}
        </div>
        <label>Team / branch reference (optional)<input name="teamId" maxLength={36} defaultValue={selected?.teamId} /></label>
        {selected && <p>Reassign any leads before deactivating or changing to a role without CRM access.</p>}
        <Submit>{selected?.revocationPending ? "Retry session revocation" : selected ? "Save staff access" : "Link staff account"}</Submit>
      </Form>
    </section>
    <section className="crm-panel">
      <div className="crm-table-wrap"><table className="crm-table">
        <thead><tr><th>Name</th><th>Auth user reference</th><th>Role</th><th>Access</th><th>Action</th></tr></thead>
        <tbody>{team.map(person => <tr key={person.$id}>
          <td>{person.name}</td><td>{person.$id}</td><td>{person.role}</td>
          <td><Badge>{person.revocationPending ? "Revocation pending" : person.active ? "Active" : "Deactivated"}</Badge></td>
          <td>{editableIds.includes(person.$id) && <Link to={`${teamUrl(cursor, person.$id)}#staff-access-form`}>Edit access</Link>}</td>
        </tr>)}</tbody>
      </table></div>
      {(cursor || next) && <nav className="crm-padded" aria-label="Team pages">
        {cursor && <Link to={teamUrl("")}>First page</Link>}{" "}
        {next && <Link to={teamUrl(next)}>Next page</Link>}
      </nav>}
    </section>
  </>;
}
