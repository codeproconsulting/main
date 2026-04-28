import { getBaseUrl } from "~/education/lib/seo";
import type { LoaderFunctionArgs } from "@react-router/node";

export function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const base = getBaseUrl() || url.origin;
  const sitemapLine = base ? `Sitemap: ${base}/sitemap.xml` : "";
  const body = [
    "User-agent: *",
    "Allow: /",
    sitemapLine,
  ]
    .filter(Boolean)
    .join("\n");

  return new Response(body + "\n", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}
