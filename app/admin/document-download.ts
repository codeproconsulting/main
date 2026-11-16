import type { LoaderFunctionArgs } from "react-router";
import { requireStaff } from "./auth.server";
import { downloadClientDocument } from "./documents.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const refresh = () => requireStaff(request, true);
  return downloadClientDocument(await refresh(), params.id!, refresh);
}
