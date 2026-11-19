import type { LoaderFunctionArgs } from "react-router";
import { requireStaff } from "./auth.server";
import { downloadExpenseReceipt } from "./expense-receipts.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  return downloadExpenseReceipt(await requireStaff(request), params.id!);
}
