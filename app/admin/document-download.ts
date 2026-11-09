import type { LoaderFunctionArgs } from "react-router";
import { requireStaff } from "./auth.server";
import { downloadClientDocument } from "./documents.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  return downloadClientDocument(await requireStaff(request), params.id!);
}
