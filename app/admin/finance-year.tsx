import { Form, Link, data, useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { requireStaff } from "./auth.server";
import { expenseYear } from "./finance.server";
import { Back, PageHeading } from "./ui";

const money = (minor: number) => new Intl.NumberFormat("en-GB",{style:"currency",currency:"GBP"}).format(minor/100);
export async function loader({request}: LoaderFunctionArgs) {
  const year = new URL(request.url).searchParams.get("year") || String(new Date().getUTCFullYear());
  return data(await expenseYear(await requireStaff(request),year),{headers:{"Cache-Control":"private, no-store"}});
}
export default function FinanceYear() {
  const report = useLoaderData<typeof loader>();
  return <>
    <Back to="/admin/finance">Office expenses</Back>
    <PageHeading eyebrow="OFFICE FINANCE" title="Yearly spending" description="Compare recorded spending and monthly budgets in GBP.">
      <Link reloadDocument className="crm-button secondary" to={`/admin/finance-year.csv?year=${report.year}`}>Export yearly CSV</Link>
    </PageHeading>
    <Form method="get" className="crm-filters"><label>Year<input name="year" required pattern="[1-9][0-9]{3}" defaultValue={report.year}/></label><button className="crm-button secondary">View year</button></Form>
    <section className="crm-panel crm-padded">
      <h2>{report.year} totals</h2><p>Active spending: {money(report.totalMinor)}</p>
      <p>Budgets set for {report.monthsBudgeted} of 12 months: {money(report.budgetMinor)}</p>
      <p className="crm-muted">Voided expenses are excluded from spending. Figures are read from the current register.</p>
      <dl className="crm-details">{report.categoryTotals.filter(row=>row.amountMinor).map(row=><div key={row.category}><dt>{row.category}</dt><dd>{money(row.amountMinor)}</dd></div>)}</dl>
    </section>
    <section className="crm-panel crm-padded"><h2>Monthly comparison</h2><div className="crm-table-wrap"><table className="crm-table">
      <thead><tr><th>Month</th><th>Active spending</th><th>Budget</th><th>Balance</th><th>Entries</th></tr></thead>
      <tbody>{report.months.map(month=><tr key={month.month}>
        <td><Link to={`/admin/finance?month=${month.month}`}>{month.month}</Link></td>
        <td>{money(month.spentMinor)}</td><td>{month.budgetMinor === null ? "Not set" : money(month.budgetMinor)}</td>
        <td>{month.remainingMinor === null ? "Not set" : `${money(Math.abs(month.remainingMinor))} ${month.remainingMinor < 0 ? "over budget" : "remaining"}`}</td>
        <td>{month.activeCount} active · {month.voidedCount} voided</td>
      </tr>)}</tbody>
    </table></div></section>
  </>;
}
