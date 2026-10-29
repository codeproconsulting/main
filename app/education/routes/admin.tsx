import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { dashboardRequest } from "~/admin/auth.server";
export function loader({ request }: LoaderFunctionArgs) { dashboardRequest(request); return redirect("/admin"); }
export function action() { return new Response("Legacy administration is disabled", { status: 410 }); }
export default function LegacyAdmin() { return null; }
