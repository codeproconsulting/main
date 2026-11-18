import type { LoaderFunctionArgs } from "react-router";
import { requireStaff } from "./auth.server";
import { exportExpenses } from "./finance.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const staff = await requireStaff(request);
  const month = new URL(request.url).searchParams.get("month") || new Date().toISOString().slice(0, 7);
  return exportExpenses(staff, month, () => requireStaff(request));
}
