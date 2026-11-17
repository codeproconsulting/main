import { Link, data, useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { requireStaff } from "./auth.server";
import { linkedContactProfile, queuePage } from "./crm.server";
import { displayDate } from "./domain";
import { Back, Empty, PageHeading } from "./ui";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const staff = await requireStaff(request);
  const page = queuePage(new URL(request.url).searchParams.get("page"));
  return data({ ...await linkedContactProfile(staff, params.id!, page), page }, {
    headers: { "Cache-Control": "private, no-store" },
  });
}

export default function ContactProfile() {
  const { anchor, total, enquiries, page } = useLoaderData<typeof loader>();
  return <>
    <Back to={`/admin/leads/${anchor.$id}`}>Back to enquiry</Back>
    <PageHeading eyebrow="CONFIRMED CONTACT" title={anchor.name} description={`${total} linked ${total === 1 ? "enquiry" : "enquiries"}`}/>
    <section className="crm-panel crm-padded">
      <h2>Contact details from this enquiry</h2>
      <dl className="crm-details">
        <div><dt>Email</dt><dd>{anchor.email ? <a href={`mailto:${anchor.email}`}>{anchor.email}</a> : "Not provided"}</dd></div>
        <div><dt>Phone</dt><dd>{anchor.phone || "Not provided"}</dd></div>
      </dl>
    </section>
    <section className="crm-panel crm-padded">
      <h2>Linked enquiries</h2>
      {enquiries.length ? <div className="crm-table-wrap"><table className="crm-table">
        <thead><tr><th>Enquiry</th><th>Service and destination</th><th>Stage</th><th>Counselor</th></tr></thead>
        <tbody>{enquiries.map(row => <tr key={row.$id}>
          <td><Link to={`/admin/leads/${row.$id}`}>{row.name}</Link><small>{displayDate(row.$createdAt)}</small></td>
          <td>{row.service}<small>{row.country || "To confirm"}</small></td>
          <td>{row.stage}</td><td>{row.counselor}</td>
        </tr>)}</tbody>
      </table></div> : <Empty title="No linked enquiries on this page">Go back to see earlier results.</Empty>}
      <div className="crm-pagination">
        {page > 1 && <Link to={`?page=${page - 1}`}>Previous page</Link>}
        {page < 10000 && page * 25 < total && <Link to={`?page=${page + 1}`}>Next page</Link>}
      </div>
    </section>
  </>;
}
