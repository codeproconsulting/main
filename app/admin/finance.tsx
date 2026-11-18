import { randomUUID } from "node:crypto";
import { Form, Link, data, useActionData, useLoaderData } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { requireStaff, sameOrigin } from "./auth.server";
import { expenseCategories, expenseMonth, recordExpense, voidExpense, saveOfficeBudget } from "./finance.server";
import { field } from "./crm.server";
import { ActionError, PageHeading, Submit } from "./ui";

const formatExpense = (amount: number) => new Intl.NumberFormat("en-GB", {style:"currency", currency:"GBP"}).format(amount / 100);

export async function loader({ request }: LoaderFunctionArgs) {
  const month = new URL(request.url).searchParams.get("month") || new Date().toISOString().slice(0, 7);
  return data({ ...await expenseMonth(await requireStaff(request), month), submissionId: randomUUID(), categories: expenseCategories }, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
export async function action({ request }: ActionFunctionArgs) {
  sameOrigin(request);
  const staff = await requireStaff(request);
  const form = await request.formData();
  const submissionId = String(form.get("submissionId") ?? "");
  try {
    const intent = field(form, "intent", 12);
    if (intent === "budget") await saveOfficeBudget(staff, field(form, "month", 7), field(form, "amount", 20), field(form, "version", 10));
    else if (intent === "void") await voidExpense(staff, field(form, "expenseId", 36), field(form, "reason", 500));
    else if (!intent) await recordExpense(staff, form);
    else throw new Response("Unknown finance action.", { status: 400 });
    return { error: "", success: true, submissionId: "" };
  } catch (error) {
    if (error instanceof Response && [400, 409].includes(error.status)) {
      return data({ error: await error.text(), success: false, submissionId }, { status: error.status });
    }
    if (error instanceof Response) throw error;
    return data({ error: "The save could not be confirmed. Retry the same form to avoid a duplicate.", success: false, submissionId }, { status: 503 });
  }
}
export default function Finance() {
  const { month, budget, expenses, totals, totalMinor, submissionId, categories } = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();
  const formId = result && !result.success && result.submissionId ? result.submissionId : submissionId;
  return <>
    <PageHeading eyebrow="OFFICE FINANCE" title="Office expenses" description="Record office spending and review monthly totals in GBP.">
      <Link reloadDocument className="crm-button secondary" to={`/admin/finance.csv?month=${month}`}>Export month CSV</Link>
    </PageHeading>
    <ActionError error={result?.error}/>
    {result?.success && <p className="crm-success" role="status">Finance saved.</p>}
    <Form method="get" className="crm-filters"><label>Month<input type="month" name="month" defaultValue={month} required/></label><button className="crm-button secondary">View month</button></Form>
    <div className="crm-two-col">
      <section className="crm-panel crm-padded"><h2>Record an expense</h2>
        <Form method="post" className="crm-form" key={formId}>
          <input type="hidden" name="submissionId" value={formId}/>
          <label>What was it for?<input name="description" required maxLength={500}/></label>
          <label>Category<select name="category">{categories.map(category => <option key={category}>{category}</option>)}</select></label>
          <label>Date<input name="spentOn" type="date" required/></label>
          <label>Amount in GBP<input name="amount" inputMode="decimal" required placeholder="0.00" maxLength={20}/></label>
          <div><Submit>Record expense</Submit></div>
        </Form>
      </section>
      <section className="crm-panel crm-padded"><h2>{month} spending</h2><p className="crm-stat">{formatExpense(totalMinor)}</p>
        <dl className="crm-details">{totals.filter(row => row.amountMinor).map(row => <div key={row.category}><dt>{row.category}</dt><dd>{formatExpense(row.amountMinor)}</dd></div>)}</dl>
      </section>
    </div>
    <section className="crm-panel crm-padded">
      <h2>Monthly office budget</h2>
      {budget ? <p>{formatExpense(Number(budget.amountMinor))} budget · {formatExpense(Math.abs(budget.remainingMinor))} {budget.remainingMinor < 0 ? "over budget" : "remaining"}</p> : <p>No budget set for {month}.</p>}
      <Form method="post" className="crm-form" key={`${month}:${budget?.version ?? 0}`}>
        <input type="hidden" name="intent" value="budget"/>
        <input type="hidden" name="month" value={month}/>
        <input type="hidden" name="version" value={budget?.version ?? 0}/>
        <label>Budget in GBP<input name="amount" inputMode="decimal" maxLength={20} required defaultValue={budget ? (Number(budget.amountMinor) / 100).toFixed(2) : ""}/></label>
        <div><Submit>Save monthly budget</Submit></div>
      </Form>
    </section>
    <section className="crm-panel crm-padded"><h2>Expenses for {month}</h2>
      {expenses.length ? <div className="crm-table-wrap"><table className="crm-table">
        <thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Amount</th><th>Status</th></tr></thead>
        <tbody>{expenses.map(expense => <tr key={expense.id}><td>{expense.spentOn}</td><td>{expense.description}</td><td>{expense.category}</td><td>{formatExpense(Number(expense.amountMinor))}</td><td>{expense.voidedAt ? <>
            <strong>Voided</strong><p>{expense.voidReason}</p>
          </> : <details><summary>Void expense</summary><Form method="post" className="crm-form">
            <input type="hidden" name="intent" value="void"/>
            <input type="hidden" name="expenseId" value={expense.id}/>
            <label>Reason<textarea name="reason" maxLength={500} required/></label>
            <Submit>Confirm void</Submit>
          </Form></details>}</td></tr>)}</tbody>
      </table></div> : <p>No expenses recorded for this month.</p>}
    </section>
  </>;
}
