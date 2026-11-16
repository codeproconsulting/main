import { data, useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { requireStaff } from "./auth.server";
import { displayDate } from "./domain";
import { emailDeliveryOverview } from "./email-delivery.server";
import { Back, Badge, Empty, PageHeading } from "./ui";

export async function loader({ request }: LoaderFunctionArgs) {
  return data(await emailDeliveryOverview(await requireStaff(request)), {
    headers: { "Cache-Control": "private, no-store" },
  });
}

const labels: Record<string, string> = {
  queued: "Queued", accepted: "Accepted by Resend", failed: "Failed", review: "Needs review",
  suppressed: "Suppressed before send", "email.delivered": "Delivered", "email.bounced": "Bounced",
  "email.complained": "Complaint",
};

export default function EmailDelivery() {
  const { queueCounts, eventCounts, outbox, events } = useLoaderData<typeof loader>();
  return <>
    <Back to="/admin/settings">Workspace setup</Back>
    <PageHeading eyebrow="EMAIL OPERATIONS" title="Email delivery"
      description="Check reminder delivery and see which messages need investigation."/>
    <section className="crm-panel crm-padded">
      <h2>Outbox totals</h2>
      <dl className="crm-details">{queueCounts.map(({ state, total }) =>
        <div key={state}><dt>{labels[state]}</dt><dd>{total.toLocaleString("en-GB")}</dd></div>)}</dl>
    </section>
    <section className="crm-panel crm-padded">
      <h2>Provider events</h2>
      <dl className="crm-details">{eventCounts.map(({ state, total }) =>
        <div key={state}><dt>{labels[state]}</dt><dd>{total.toLocaleString("en-GB")}</dd></div>)}</dl>
      <p>Resend acceptance means the message was queued for delivery. Bounces and complaints each block future reminders to the affected address.</p>
    </section>
    <section className="crm-panel crm-padded">
      <h2>Recent outbox entries</h2>
      {!outbox.length ? <Empty title="No email queued">Messages appear here when the reminder worker queues them.</Empty> :
        <div className="crm-table-wrap"><table className="crm-table">
          <thead><tr><th>Outbox reference</th><th>Status</th><th>Attempts</th><th>Next attempt</th><th>Resend reference</th></tr></thead>
          <tbody>{outbox.map(row => <tr key={row.$id}><td>{row.$id}</td>
            <td><Badge>{labels[row.status] ?? "Unknown"}</Badge></td><td>{row.attempts}</td>
            <td>{row.status === "queued" ? displayDate(row.nextAt) : "—"}</td><td>{row.providerId || "—"}</td>
          </tr>)}</tbody>
        </table></div>}
    </section>
    <section className="crm-panel crm-padded">
      <h2>Recent delivery and suppression events</h2>
      {!events.length ? <Empty title="No provider events">Signed delivery events appear here when Resend reports them.</Empty> :
        <div className="crm-table-wrap"><table className="crm-table">
          <thead><tr><th>Event</th><th>Occurred</th><th>Resend reference</th></tr></thead>
          <tbody>{events.map(row => <tr key={row.$id}>
            <td><Badge>{labels[row.kind] ?? "Unknown"}</Badge></td><td>{displayDate(row.occurredAt)}</td><td>{row.providerId}</td>
          </tr>)}</tbody>
        </table></div>}
    </section>
  </>;
}
