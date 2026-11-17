import { Form, data, useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { requireStaff } from "./auth.server";
import { previewDuplicate } from "./crm.server";
import { Back, PageHeading, Submit } from "./ui";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const staff = await requireStaff(request);
  const retain = new URL(request.url).searchParams.get("retain") ?? "";
  return data(await previewDuplicate(staff, params.id ?? "", retain), {
    headers: { "Cache-Control": "private, no-store" },
  });
}

export default function DuplicateReview() {
  const { source, retained, checks } = useLoaderData<typeof loader>();
  const enquiryPath = `/admin/leads/${source.$id}`;
  const blocked = checks.some(check => check.blocked);
  return <>
    <Back to={enquiryPath}>Back to enquiry</Back>
    <PageHeading eyebrow="CONFIRMED CONTACT" title="Review duplicate enquiry"
      description="Review which enquiry to retain and resolve any linked work before archiving."/>
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
  </>;
}
