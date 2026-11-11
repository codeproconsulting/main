import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { requireStaff } from "./auth.server";
import { operationalReport } from "./reports.server";
import { PageHeading, Empty } from "./ui";

export async function loader({ request }: LoaderFunctionArgs) {
  return operationalReport(await requireStaff(request));
}

export default function Reports() {
  const report = useLoaderData<typeof loader>();
  const counts = [["Leads counted", report.total], ["Unassigned", report.unassigned], ["Converted", report.converted]] as const;
  const sections = [["By stage", report.stages], ["By source", report.sources], ["By destination", report.countries]] as const;

  return <>
    <PageHeading eyebrow="LEAD INVENTORY" title="Operational reports" description="Current lead counts by stage, source and destination.">
      {!report.truncated && <a className="crm-button" href="/admin/leads.csv">Export leads as CSV</a>}
    </PageHeading>
    {report.truncated && <p className="crm-alert" role="status">Counts cover the first 10,000 leads by record ID. CSV export is unavailable above this limit.</p>}
    <div className="crm-stats">
      {counts.map(([label, value]) => <div className="crm-stat" key={label}><p>{label}</p><strong>{value.toLocaleString("en-GB")}</strong></div>)}
    </div>
    <div className="crm-two-col">
      {sections.map(([label, section]) => <section className="crm-panel crm-padded" key={label}>
        <h2>{label}</h2>
        {!section.rows.length && <Empty title="No data yet">Saved enquiries will populate this report.</Empty>}
        {section.rows.map(([name, count]) => <div className="crm-list-row" key={name}><strong className="flex-1">{name}</strong><span>{count}</span></div>)}
        {section.remainder > 0 && <div className="crm-list-row"><strong className="flex-1">Remaining groups</strong><span>{section.remainder}</span></div>}
      </section>)}
    </div>
  </>;
}
