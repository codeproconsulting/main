import { Form, data, useActionData, useLoaderData } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { requireStaff, sameOrigin } from "./auth.server";
import { field, leadFor } from "./crm.server";
import { documentCategories, documentLimit, documentState, documentStatuses, expiryDay } from "./document-domain";
import { documentsFor, reviewClientDocument, uploadClientDocument } from "./documents.server";
import { boundedUploadForm } from "./storage.server";
import { ActionError, Back, Badge, Empty, PageHeading, Submit } from "./ui";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const staff = await requireStaff(request);
  const { lead, documents } = await documentsFor(staff, params.id!);
  return data({
    lead: { $id: lead.$id, name: lead.name },
    documents: documents.map(({ $id, name, category, status, expiresAt, scannedAt, reviewVersion, reviewNotes }) =>
      ({ $id, name, category, status, expiresAt, scannedAt, reviewVersion, reviewNotes })),
  }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const staff = await requireStaff(request);
  sameOrigin(request);
  const lead = await leadFor(staff, params.id!);
  try {
    const form = await boundedUploadForm(request, documentLimit + 256 * 1024, "Document");
    const intent = field(form, "intent", 20);
    if (intent === "review") {
      await reviewClientDocument(staff, lead.$id, field(form, "id", 36), field(form, "status", 30),
        field(form, "expiresAt", 10), field(form, "reviewNotes", 2000), field(form, "reviewVersion", 20));
    } else if (intent === "upload") {
      const file = form.get("file");
      if (!(file instanceof File)) throw new Response("Select a file.", { status: 400 });
      await uploadClientDocument(staff, lead.$id, file, field(form, "category", 100), field(form, "expiresAt", 10));
    } else {
      throw new Response("Unknown document action.", { status: 400 });
    }
    return { error: "", success: true };
  } catch (error) {
    if (error instanceof Response) {
      if ([400, 409, 413, 422, 503].includes(error.status)) {
        return data({ error: await error.text(), success: false }, { status: error.status });
      }
      throw error;
    }
    return data({ error: "Could not confirm this document change. Refresh and check the record before retrying.", success: false }, { status: 503 });
  }
}

export default function Documents() {
  const { lead, documents } = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();
  return <>
    <Back to={`/admin/leads/${lead.$id}`}>Back to {lead.name}</Back>
    <PageHeading eyebrow="PRIVATE CLIENT DOCUMENTS" title="Documents & review"
      description="Files are scanned before saving. Every download requires access to this lead." />
    <ActionError error={result?.error} />
    {result?.success && <p className="crm-success" role="status">Document record saved.</p>}
    <section className="crm-panel crm-padded">
      <Form method="post" encType="multipart/form-data" className="crm-form">
        <input name="intent" value="upload" type="hidden" />
        <label>Document category<select name="category">{documentCategories.map(category => <option key={category}>{category}</option>)}</select></label>
        <label>File (PDF, JPEG, PNG, WebP; maximum 20 MB)<input name="file" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" required /></label>
        <label>Expiry date (optional, Pakistan time)<input name="expiresAt" type="date" /></label>
        <Submit>Upload private document</Submit>
      </Form>
    </section>
    <section className="crm-panel crm-padded" aria-labelledby="document-checklist">
      <h2 id="document-checklist">Document checklist</h2>
      <p>Use the categories relevant to this client. A category is ready when it has an accepted document that has been scanned and has not expired.</p>
      <ul>
        {documentCategories.map(category => {
          const items = documents.filter(doc => doc.category === category);
          const states = items.map(doc => documentState(doc));
          const summary = states.includes("Accepted") ? "Ready" : !items.length ? "Not uploaded"
            : states.includes("Pending review") ? "Awaiting review" : "Needs attention";
          return <li key={category}>{category} · <Badge>{summary}</Badge></li>;
        })}
      </ul>
    </section>
    <section className="crm-panel">
      {!documents.length && <Empty title="No documents uploaded">Choose a relevant category and upload the first file.</Empty>}
      {documents.map(doc => <article className="crm-followup" key={doc.$id}>
        <div>
          <h2>{doc.name}</h2>
          <p>{doc.category} · <Badge>{documentState(doc)}</Badge></p>
          {doc.expiresAt && <p>Expires {expiryDay(doc.expiresAt)} (Pakistan time)</p>}
          {doc.scannedAt
            ? <a href={`/admin/documents/${doc.$id}/download`}>Download private file →</a>
            : <p>Upload a scanned replacement to make this document available.</p>}
        </div>
        {doc.scannedAt && <Form method="post" className="crm-form" key={`${doc.$id}:${doc.reviewVersion ?? 0}`}>
          <input name="intent" value="review" type="hidden" />
          <input name="id" value={doc.$id} type="hidden" />
          <input name="reviewVersion" value={doc.reviewVersion ?? 0} type="hidden" />
          <label>Review outcome<select name="status" defaultValue={doc.status}>
            {documentStatuses.map(status => <option key={status}>{status}</option>)}
          </select></label>
          <label>Expiry date (optional, Pakistan time)<input name="expiresAt" type="date" defaultValue={expiryDay(doc.expiresAt)} /></label>
          <label>Review notes<textarea name="reviewNotes" defaultValue={doc.reviewNotes ?? ""} maxLength={2000} rows={2} /></label>
          <Submit>Save review</Submit>
        </Form>}
      </article>)}
    </section>
  </>;
}
