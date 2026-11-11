import type { LoaderFunctionArgs } from "react-router";
import { requireStaff } from "./auth.server";
import { exportLeads } from "./reports.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const staff = await requireStaff(request);
  return exportLeads(staff, () => requireStaff(request));
}
