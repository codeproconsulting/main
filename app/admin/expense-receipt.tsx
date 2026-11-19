import { Form, Link, data, useActionData, useLoaderData } from "react-router";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { requireStaff, sameOrigin } from "./auth.server";
import { attachExpenseReceipt, expenseReceipt, receiptLimit } from "./expense-receipts.server";
import { boundedUploadForm } from "./storage.server";
import { ActionError, Back, PageHeading, Submit } from "./ui";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const staff = await requireStaff(request);
  return data(await expenseReceipt(staff,params.id!),{headers:{"Cache-Control":"private, no-store"}});
}
export async function action({ request, params }: ActionFunctionArgs) {
  sameOrigin(request);
  const staff = await requireStaff(request);
  const form = await boundedUploadForm(request, receiptLimit + 65536, "Receipt");
  const file = form.get("receipt");
  if (!(file instanceof File)) throw new Response("Choose a receipt.", {status:400});
  try {
    await attachExpenseReceipt(staff,params.id!,file);
    return {error:""};
  } catch(error) {
    if (error instanceof Response) return data({error:await error.text()},{status:error.status});
    return data({error:"Receipt service is unavailable."},{status:503});
  }
}
export default function Receipt() {
  const expense = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();
  return <>
    <Back to="/admin/finance">Finance</Back>
    <PageHeading eyebrow="OFFICE FINANCE" title="Expense receipt" description={expense.description}/>
    <ActionError error={result?.error}/>
    <section className="crm-panel crm-padded">
      {expense.receiptName ? <><p>{expense.receiptName}</p><Link reloadDocument className="crm-button" to={`/admin/finance/${expense.id}/receipt/download`}>Download receipt</Link></>
        : <Form method="post" encType="multipart/form-data" className="crm-form">
          <label>Receipt file<input name="receipt" type="file" required accept=".pdf,.jpg,.jpeg,.png"/></label>
          <p>PDF, JPEG or PNG up to 5 MB. Uploads require the configured security scanner.</p>
          <Submit>Attach receipt</Submit>
        </Form>}
    </section>
  </>;
}
