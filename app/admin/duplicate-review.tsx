import { Form, Link, data, useActionData, useLoaderData } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { requireStaff, sameOrigin } from "./auth.server";
import { field, moveDuplicateTask, previewDuplicate, UnconfirmedMutation } from "./crm.server";
import { displayDate } from "./domain";
import { ActionError, Back, PageHeading, Submit } from "./ui";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const staff = await requireStaff(request);
  const search = new URL(request.url).searchParams;
  return data(await previewDuplicate(staff, params.id ?? "", search.get("retain") ?? "", search.get("merge") === "1"), {
    headers: { "Cache-Control": "private, no-store" },
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  sameOrigin(request);
  const staff = await requireStaff(request);
  try {
    const form = await request.formData();
    const [taskId, taskVersion, unexpected] = field(form, "task", 54).split(":");
    if (unexpected !== undefined) throw new Response("Choose one follow-up.", { status: 400 });
    form.set("taskId", taskId);
    form.set("taskVersion", taskVersion ?? "");
    await moveDuplicateTask(staff, params.id ?? "", form);
    return { success: true, error: "" };
  } catch (error) {
    if (error instanceof Response) {
      if (error instanceof UnconfirmedMutation || [400, 409].includes(error.status)) {
        return data({ success: false, error: await error.text() }, { status: error.status });
      }
      throw error;
    }
    return data({ success: false, error: "Could not confirm the move. Refresh the enquiry before retrying." }, { status: 503 });
  }
}

export default function DuplicateReview() {
  const { source, retained, checks, mergePlan, moveBlocker, movableTasks } = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();
  const enquiryPath = `/admin/leads/${source.$id}`;
  const blocked = checks.some(check => check.blocked);
  return <>
    <Back to={enquiryPath}>Back to enquiry</Back>
    <PageHeading eyebrow="CONFIRMED CONTACT" title="Review duplicate enquiry"
      description="Review which enquiry to retain and resolve any linked work before archiving."/>
    <ActionError error={result?.error}/>
    {result?.success && <p className="crm-success" role="status">Follow-up moved to the retained enquiry.</p>}
    <section className="crm-panel crm-padded">
      <h2>Enquiries</h2>
      <dl className="crm-details">
        <div><dt>Would be archived</dt><dd>{source.name} · {source.stage} · {source.$id}</dd></div>
        <div><dt>Would be retained</dt><dd>{retained.name} · {retained.stage} · {retained.$id}</dd></div>
        <div><dt>Service and destination</dt><dd>{source.service} · {source.country || "To confirm"}</dd></div>
      </dl>
    </section>
    <section className="crm-panel crm-padded">
      <h2>Linked work on the enquiry to archive</h2>
      <dl className="crm-details">{checks.map(({ label, blocked }) =>
        <div key={label}><dt>{label}</dt><dd>{blocked ? "Needs review" : "None"}</dd></div>
      )}</dl>
      {blocked ? <p>Resolve the flagged items before archiving this enquiry.</p> : <>
        <p>Archiving keeps both enquiry records and their history.</p>
        <Form method="post" action={enquiryPath} className="crm-form">
          <input type="hidden" name="intent" value="mark-duplicate"/>
          <input type="hidden" name="version" value={source.version}/>
          <input type="hidden" name="retainedEnquiry" value={retained.$id}/>
          <input type="hidden" name="targetVersion" value={retained.version}/>
          <label>Reason for archiving<textarea name="reason" required maxLength={2000}/></label>
          <div><Submit>Archive this duplicate</Submit></div>
        </Form>
      </>}
    </section>
    <section className="crm-panel crm-padded">
      <h2>Merge planning</h2>
      {mergePlan ? <>
        <p>Compare linked work before moving open follow-ups or archiving.</p>
        {(mergePlan.differentCounselors || mergePlan.differentTeams) && <p>
          Confirm the retained assignment and access before moving work. {mergePlan.differentCounselors && "Counselor assignments differ. "}
          {mergePlan.differentTeams && "Team assignments differ."}
        </p>}
        <div className="crm-table-wrap"><table className="crm-table">
          <thead><tr><th scope="col">Linked work</th><th scope="col">Would archive</th><th scope="col">Would retain</th><th scope="col">Review</th></tr></thead>
          <tbody>
            <tr><th scope="row">Next follow-up date</th><td>{mergePlan.sourceFollowUp ? "Set" : "None"}</td>
              <td>{mergePlan.retainedFollowUp ? "Set" : "None"}</td><td>Choose the next follow-up after reviewing open tasks.</td></tr>
            {mergePlan.rows.map(row => <tr key={row.label}>
              <th scope="row">{row.label}</th><td>{row.sourceCount}</td><td>{row.retainedCount}</td><td>{row.guidance}</td>
            </tr>)}
          </tbody>
        </table></div>
      </> : <Link className="crm-button secondary" to={`?retain=${encodeURIComponent(retained.$id)}&merge=1`}>Compare linked work</Link>}
    </section>
    {mergePlan && <section className="crm-panel crm-padded">
      <h2>Move an open follow-up</h2>
      {moveBlocker ? <p>{moveBlocker}</p> : movableTasks.length ? <Form method="post" className="crm-form">
        <input type="hidden" name="retainedEnquiry" value={retained.$id}/>
        <input type="hidden" name="version" value={source.version}/>
        <input type="hidden" name="targetVersion" value={retained.version}/>
        <label>Follow-up<select name="task" required defaultValue="">
          <option value="" disabled>Choose a follow-up</option>
          {movableTasks.map(task => <option key={task.$id} value={`${task.$id}:${task.version}`}>
            {task.title} · {displayDate(task.dueAt)}
          </option>)}
        </select></label>
        <label>Reason for moving<textarea name="reason" required maxLength={2000}/></label>
        <div><Submit>Move to retained enquiry</Submit></div>
      </Form> : <p>No open follow-ups match the current assignment.</p>}
    </section>}
  </>;
}
