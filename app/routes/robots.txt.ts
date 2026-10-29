import { getBaseUrl } from "~/education/lib/seo";
import type { LoaderFunctionArgs } from "react-router";

export function loader({ request }: LoaderFunctionArgs) {
  if (process.env.APP_SURFACE === "dashboard") return new Response("User-agent: *\nDisallow: /\n", { headers: { "Content-Type": "text/plain", "X-Robots-Tag": "noindex, nofollow" } });
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
