import { Form, data, useActionData, useLoaderData } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { LockKeyhole, ArrowRight, ShieldCheck } from "lucide-react";
import { configurationIssues } from "~/lib/appwrite.server";
import { dashboardRequest, sameOrigin, signIn } from "./auth.server";
import { rateLimit } from "~/lib/rate-limit.server";
import { field } from "./crm.server";
import { ActionError, Submit, WorkspaceBrand } from "./ui";
export function meta() { return [{ title: "Staff sign in | ProConsulting" }, { name: "robots", content: "noindex, nofollow" }]; }
export function loader({ request }: LoaderFunctionArgs) { dashboardRequest(request); return { ready: configurationIssues().length === 0 }; }
export async function action({ request }: ActionFunctionArgs) {
  dashboardRequest(request); sameOrigin(request);
  if (configurationIssues().length) return data({ error: "Staff login is awaiting server configuration." }, { status: 503 });
  rateLimit(request, "login", 10, 15 * 60 * 1000);
  const form = await request.formData();
  const email = field(form, "email", 254); const rawPassword = form.get("password"); const password = typeof rawPassword === "string" && rawPassword.length <= 1024 ? rawPassword : "";
  if (!email || !password) return data({ error: "Enter your email and password." }, { status: 400 });
  try { return await signIn(request, email, password); } catch (error) {
    if (error instanceof Response) throw error;
    return data({ error: "We could not sign you in. Check your credentials and active staff access, or try again shortly." }, { status: 401 });
  }
}
export default function Login() {
  const { ready } = useLoaderData<typeof loader>(); const result = useActionData<typeof action>();
  return <main className="crm-login"><section className="crm-login-story"><a href="https://proconsulting.uk" className="crm-brand"><WorkspaceBrand/></a><div><p className="crm-eyebrow">A LITTLE MORE CLARITY. A LOT MORE PROGRESS.</p><h1>Every enquiry.<br/>A new possibility.</h1><p>One place to guide your students, manage your follow-ups, and share what you know.</p><div className="crm-login-features"><span>01 &nbsp; Build meaningful connections</span><span>02 &nbsp; Keep the next step in sight</span><span>03 &nbsp; Turn knowledge into opportunity</span></div></div><small>ProConsulting · Education & Immigration</small></section><section className="crm-login-form"><div className="crm-login-card"><span className="crm-icon-tile"><LockKeyhole size={22}/></span><p className="crm-eyebrow">YOUR WORKDAY STARTS HERE</p><h2>Welcome back.</h2><p className="crm-muted">Sign in to your ProConsulting workspace.</p>{!ready && <p className="crm-setup">The workspace is being connected to Appwrite. Staff sign-in will be available when server setup is complete.</p>}<Form method="post"><label>Email address<input name="email" type="email" required autoComplete="username" placeholder="you@proconsulting.uk"/></label><label>Password<input name="password" type="password" required autoComplete="current-password" placeholder="Enter your password"/></label><ActionError error={result?.error}/>{ready ? <Submit>Sign in to workspace <ArrowRight size={16}/></Submit> : <button className="crm-button" disabled>Setup in progress</button>}</Form><p className="crm-login-help"><ShieldCheck size={15}/> Access is limited to invited team members.<br/>Contact your administrator if you need help signing in.</p></div></section></main>;
}
