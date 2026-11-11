import { randomUUID } from "node:crypto";
import { Form, Link, data, redirect, useActionData, useLoaderData } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { requireStaff, sameOrigin } from "./auth.server";
import { consultationPage, consultationPageSize, leadConsultations, recordConsultation } from "./consultations.server";
import { ActionError, Back, Empty, PageHeading, Submit } from "./ui";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const staff = await requireStaff(request);
  const page = consultationPage(new URL(request.url).searchParams);
  return {
    ...await leadConsultations(staff, params.id!, page),
    page, pageSize: consultationPageSize, submissionId: randomUUID(), counselor: staff.$id,
    today: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString().slice(0, 10),
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const staff = await requireStaff(request);
  sameOrigin(request);
  try {
    await recordConsultation(staff, params.id!, await request.formData());
    return redirect(`/admin/leads/${encodeURIComponent(params.id!)}/consultations`);
  } catch (error) {
    if (error instanceof Response) {
      if (![400, 409].includes(error.status)) throw error;
      return data({ error: await error.text() }, { status: error.status });
    }
    return data({ error: "Could not confirm the consultation. Retry this form before logging another session." }, { status: 503 });
  }
}

export default function Consultations() {
  const { lead, history, people, manager, counselor, page, pageSize, submissionId, today } = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();
  return <>
    <Back to={`/admin/leads/${lead.id}`}>Back to {lead.name}</Back>
    <PageHeading eyebrow="ENQUIRY HISTORY" title="Consultations" description={`Completed consultations for ${lead.name}.`} />
    <ActionError error={result?.error} />
    <section className="crm-panel crm-padded">
      <h2>Log a completed consultation</h2>
      <Form method="post" className="crm-form">
        <input name="submissionId" type="hidden" value={submissionId} />
        <div className="crm-two-col">
          <label>Destination<input name="destination" maxLength={100} defaultValue={lead.country} placeholder="e.g. Germany or Italy" required /></label>
          <label>Consultation date<input name="heldOn" type="date" defaultValue={today} max={today} required /></label>
          {manager && <label>Counselor who held it<select name="counselor" defaultValue="" required>
            <option value="" disabled>Select a counselor</option>
            {people.map(person => <option key={person.id} value={person.id}>{person.name}</option>)}
          </select></label>}
          {!manager && <p>Recorded under {people.find(person => person.id === counselor)?.name ?? "your name"}.</p>}
        </div>
        <Submit>Log consultation</Submit>
      </Form>
    </section>
    <section className="crm-panel crm-padded">
      <h2>Consultation history</h2>
      {!history.documents.length && <Empty title="No consultations on this page">Completed sessions appear here when logged.</Empty>}
      {history.documents.map(row => <div className="crm-list-row" key={row.$id}>
        <strong className="flex-1">{row.destination}</strong><span>{row.counselorName} · {row.heldOn}</span>
      </div>)}
      <div className="crm-pagination"><span>{history.total} consultations · Page {page}</span><div>
        {page > 1 && <Link to={`?page=${page - 1}`}>Previous</Link>}{" "}
        {page < 10_000 && page * pageSize < history.total && <Link to={`?page=${page + 1}`}>Next</Link>}
      </div></div>
    </section>
  </>;
}
