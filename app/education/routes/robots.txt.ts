import { getBaseUrl } from "~/education/lib/seo";

export function loader() {
  const base = getBaseUrl();
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
