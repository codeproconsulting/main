import type { LoaderFunctionArgs } from "react-router";
import { requireStaff } from "./auth.server";
import { exportExpenseYear } from "./finance.server";
export async function loader({request}: LoaderFunctionArgs) {
  const year = new URL(request.url).searchParams.get("year") || String(new Date().getUTCFullYear());
  return exportExpenseYear(await requireStaff(request),year,()=>requireStaff(request));
}
