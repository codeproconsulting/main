import { Form, Link, redirect, useLoaderData, useNavigation } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { canManageStaff } from "./team.server";
import { requireStaff, sameOrigin } from "./auth.server";
import { canManage, canUseCRM, isRestrictedManager, type Staff } from "./domain";
import { getDocument, updateDocument } from "~/lib/appwrite.server";
import { allow, definitiveWriteRejection, field, listStaff, serialized, staffAccessLock, UnconfirmedMutation } from "./crm.server";
import {reminderHealth} from "./notifications.server";
import {displayDate} from "./domain";
import { Badge,PageHeading } from "./ui";
type ReminderProfile = Staff & { reminderEmail?: string };
const canSetReminderEmail = (staff: ReminderProfile) =>
  staff.active && !staff.revocationPending && canUseCRM(staff) && !isRestrictedManager(staff);

export async function action({request}: ActionFunctionArgs) {
  sameOrigin(request);
  const staff = await requireStaff(request);
  allow(canSetReminderEmail(staff));
  const preference = field(await request.formData(), "reminderEmail", 12);
  if (preference !== "enabled" && preference !== "disabled") throw new Response("Choose an email reminder setting.", {status:400});
  await serialized(staffAccessLock, async () => {
    const current = await getDocument<ReminderProfile>("staff", staff.$id);
    allow(canSetReminderEmail(current));
    if (current.reminderEmail === preference) return;
    try {
      await updateDocument("staff", staff.$id, {reminderEmail:preference});
    } catch (error) {
      if (definitiveWriteRejection(error)) throw error;
      throw new UnconfirmedMutation("The email preference update could not be confirmed. Contact an administrator.");
    }
  });
  return redirect("/admin/settings", 303);
}

export async function loader({request}: LoaderFunctionArgs) {
  const staff = await requireStaff(request);
  const profile = canSetReminderEmail(staff) ? await getDocument<ReminderProfile>("staff", staff.$id) : null;
  return {
    staff,
    reminderEmail: profile && canSetReminderEmail(profile) ? profile.reminderEmail === "enabled" : null,
    emailAdmin: canManageStaff(staff),
    health: canManage(staff) ? await reminderHealth(staff) : null,
    team: canManage(staff) ? await listStaff() : [],
    dashboard: process.env.DASHBOARD_URL ?? "Local development",
    endpoint: canManage(staff) ? process.env.APPWRITE_ENDPOINT : undefined,
  };
}
export default function Settings(){const {staff,reminderEmail,emailAdmin,health,team,dashboard,endpoint}=useLoaderData<typeof loader>();const navigation=useNavigation();return <><PageHeading eyebrow="A WORKSPACE THAT WORKS FOR YOU" title="Workspace setup" description="Connection details and the current rollout status.">{emailAdmin && <Link className="crm-button secondary" to="/admin/settings/email-delivery">Email delivery</Link>}</PageHeading><div className="crm-two-col"><section className="crm-panel crm-padded"><h2>Environment</h2><dl className="crm-details"><div><dt>Dashboard</dt><dd>{dashboard}</dd></div>{endpoint&&<div><dt>Appwrite</dt><dd>{endpoint}</dd></div>}<div><dt>Display timezone</dt><dd>Asia/Karachi</dd></div><div><dt>Your role</dt><dd>{staff.role}</dd></div></dl><p className="crm-muted">Connections and secrets are managed in the server environment.</p></section><section className="crm-panel crm-padded"><h2>Rollout status</h2><p><Badge tone="positive">Foundation</Badge> Staff access, enquiries, assignment, notes, follow-up tasks, visual/HTML authoring, revision history, and scheduled-publication controls.</p><p className="crm-muted">The dedicated publishing worker is opt-in and has not been activated on the VPS. Due-task in-app reminders and editorial media have local feature checks. Applications, appointments, private documents and provider integrations retain separate rollout gates. Email reminders require staff opt-in and workspace activation. WhatsApp is unavailable.</p></section></div>{reminderEmail!==null&&<section className="crm-panel crm-padded"><h2>Email reminders</h2><p>Email reminders are {reminderEmail?"on":"off"} for your account. Delivery also requires workspace activation and a verified email address. In-app reminders are unaffected.</p><Form method="post"><button className="crm-button secondary" name="reminderEmail" value={reminderEmail?"disabled":"enabled"} disabled={navigation.state!=="idle"}>{reminderEmail?"Turn off email reminders":"Turn on email reminders"}</button></Form></section>}{health&&<section className="crm-panel crm-padded"><h2>Reminder worker</h2><p><Badge tone={health.status==="healthy"?"positive":"neutral"}>{health.status}</Badge></p><p>Last successful cycle: {health.lastSuccessAt?displayDate(health.lastSuccessAt):"Not recorded"}</p><p className="crm-muted">Last cycle errors: {health.errorCount}. Health becomes stale after three minutes without a recorded cycle. Check the VPS worker and locks if it is paused or failing.</p></section>}{team.length>0&&<section className="crm-panel crm-padded"><h2>Active staff</h2><p className="crm-muted">Staff accounts and roles are currently provisioned through the setup CLI. Managers have organization-wide visibility in this first release.</p><div className="crm-list">{team.map(s=><div className="crm-list-row" key={s.$id}><span className="crm-avatar">{s.name.slice(0,2).toUpperCase()}</span><strong>{s.name}</strong><Badge>{s.role}</Badge></div>)}</div></section>}</>;}
