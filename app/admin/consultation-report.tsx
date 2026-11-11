import { Form, Link, useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { requireStaff } from "./auth.server";
import { consultationPageSize, consultationReport } from "./consultations.server";
import { Back, Empty, PageHeading } from "./ui";

export async function loader({ request }: LoaderFunctionArgs) {
  return {
    ...await consultationReport(await requireStaff(request), new URL(request.url).searchParams),
    pageSize: consultationPageSize,
  };
}

export default function ConsultationReport() {
  const { history, total, page, destination, counselor, people, pageSize } = useLoaderData<typeof loader>();
  const pageUrl = (next: number) => `?${new URLSearchParams({ destination, counselor, page: String(next) })}`;
  return <>
    <Back to="/admin/reports">Operational reports</Back>
    <PageHeading eyebrow="COMPLETED CONSULTATIONS" title="Consultation tracking" description="Find who consulted with each customer and which destination they discussed." />
    <section className="crm-panel">
      <Form method="get" className="crm-filters" key={`${destination}:${counselor}`}>
        <div className="crm-search"><input name="destination" aria-label="Filter by destination" placeholder="Destination, e.g. Germany" maxLength={100} defaultValue={destination} /></div>
        <select name="counselor" aria-label="Filter by counselor" defaultValue={counselor}>
          <option value="">All counselors</option>
          {people.map(person => <option key={person.id} value={person.id}>{person.name}</option>)}
        </select>
        <button className="crm-button secondary">Apply filters</button>
      </Form>
      <div className="crm-table-wrap"><table className="crm-table">
        <thead><tr><th>Date</th><th>Customer enquiry</th><th>Counselor</th><th>Destination</th></tr></thead>
        <tbody>{history.map(row => <tr key={row.$id}>
          <td>{row.heldOn}</td>
          <td>{row.leadName ? <Link to={`/admin/leads/${row.leadId}/consultations`}>{row.leadName}</Link> : "Enquiry unavailable"}</td>
          <td>{row.counselorName}</td><td>{row.destination}</td>
        </tr>)}</tbody>
      </table></div>
      {!history.length && <Empty title="No matching consultations">Try another counselor or destination.</Empty>}
      <div className="crm-pagination"><span>{total} consultations · Page {page}</span><div>
        {page > 1 && <Link to={pageUrl(page - 1)}>Previous</Link>}{" "}
        {page < 10_000 && page * pageSize < total && <Link to={pageUrl(page + 1)}>Next</Link>}
      </div></div>
    </section>
  </>;
}
