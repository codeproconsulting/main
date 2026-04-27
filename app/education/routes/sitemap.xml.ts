import { getPosts } from "~/education/lib/ghost-api";
import { getAllServiceSlugs } from "~/education/lib/servicesData";
import { getAllDestinationSlugs } from "~/education/lib/destinations";
import { getAllCourseSlugs } from "~/education/lib/courses";
import { getBaseUrl, getAbsoluteUrl } from "~/education/lib/seo";

const STATIC_PATHS = [
  "",
  "/about",
  "/contact",
  // Education main routes
  "/education/destinations",
  "/education/courses",
  "/education/universities",
  "/services",
  "/blog",
  "/privacy-policy",
  "/terms",
  "/cookie-policy",
];

export async function loader() {
  const base = getBaseUrl();
  if (!base) {
    return new Response("<?xml version=\"1.0\" encoding=\"UTF-8\"?><urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"></urlset>", {
      status: 200,
      headers: { "Content-Type": "application/xml" },
    });
  }

  const now = new Date().toISOString().slice(0, 10);
  const urls: string[] = [];

  for (const path of STATIC_PATHS) {
    const loc = getAbsoluteUrl(path || "/");
    urls.push(`  <url><loc>${escapeXml(loc)}</loc><lastmod>${now}</lastmod></url>`);
  }

  try {
    const posts = await getPosts();
    for (const post of posts) {
      const loc = getAbsoluteUrl(`/blog/${post.slug}`);
      const lastmod = post.publishedAt
        ? new Date(post.publishedAt).toISOString().slice(0, 10)
        : now;
      urls.push(`  <url><loc>${escapeXml(loc)}</loc><lastmod>${lastmod}</lastmod></url>`);
    }
  } catch {
    // Ghost API may be unavailable; continue with static + services
  }

  const slugs = getAllServiceSlugs();
  for (const slug of slugs) {
    const loc = getAbsoluteUrl(`/services/${slug}`);
    urls.push(`  <url><loc>${escapeXml(loc)}</loc><lastmod>${now}</lastmod></url>`);
  }

  const destinationSlugs = getAllDestinationSlugs();
  for (const slug of destinationSlugs) {
    const loc = getAbsoluteUrl(`/education/destinations/${slug}`);
    urls.push(`  <url><loc>${escapeXml(loc)}</loc><lastmod>${now}</lastmod></url>`);
  }

  const courseSlugs = getAllCourseSlugs();
  for (const slug of courseSlugs) {
    const loc = getAbsoluteUrl(`/education/courses/${slug}`);
    urls.push(`  <url><loc>${escapeXml(loc)}</loc><lastmod>${now}</lastmod></url>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: { "Content-Type": "application/xml" },
  });
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
