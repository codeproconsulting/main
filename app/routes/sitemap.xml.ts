import type { LoaderFunctionArgs } from "@react-router/node";
import { getPosts as getEducationPosts } from "~/education/lib/ghost-api";
import { getAllServiceSlugs as getEducationServiceSlugs } from "~/education/lib/servicesData";
import { getAllDestinationSlugs as getEducationDestinationSlugs } from "~/education/lib/destinations";
import { getAllCourseSlugs } from "~/education/lib/courses";
import { getBaseUrl } from "~/education/lib/seo";

import { getPosts as getImmigrationPosts } from "~/immigration/lib/ghost-api";
import { getAllServiceSlugs as getImmigrationServiceSlugs } from "~/immigration/lib/servicesData";
import { getAllDestinationSlugs as getImmigrationDestinationSlugs } from "~/immigration/lib/destinations";

const STATIC_PATHS = [
  "",
  "/about",
  "/contact",
  // Education main routes
  "/education",
  "/education/about",
  "/education/contact",
  "/education/apply",
  "/education/destinations",
  "/education/courses",
  "/education/universities",
  "/education/services",
  "/education/blog",
  "/education/privacy-policy",
  "/education/terms",
  "/education/cookie-policy",
  // Immigration main routes
  "/immigration",
  "/immigration/contact",
  "/immigration/about",
  "/immigration/services",
  "/immigration/destinations",
  "/immigration/things-to-do",
  "/immigration/blog",
];

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const base = getBaseUrl() || url.origin;

  const now = new Date().toISOString().slice(0, 10);
  const urls: string[] = [];

  for (const path of STATIC_PATHS) {
    const loc = `${base}${path}`;
    urls.push(`  <url><loc>${escapeXml(loc)}</loc><lastmod>${now}</lastmod></url>`);
  }

  // Education dynamic paths
  try {
    const eduPosts = await getEducationPosts();
    for (const post of eduPosts) {
      const loc = `${base}/education/blog/${post.slug}`;
      const lastmod = post.publishedAt
        ? new Date(post.publishedAt).toISOString().slice(0, 10)
        : now;
      urls.push(`  <url><loc>${escapeXml(loc)}</loc><lastmod>${lastmod}</lastmod></url>`);
    }
  } catch {}

  const eduServices = getEducationServiceSlugs();
  for (const slug of eduServices) {
    const loc = `${base}/education/services/${slug}`;
    urls.push(`  <url><loc>${escapeXml(loc)}</loc><lastmod>${now}</lastmod></url>`);
  }

  const eduDestinations = getEducationDestinationSlugs();
  for (const slug of eduDestinations) {
    const loc = `${base}/education/destinations/${slug}`;
    urls.push(`  <url><loc>${escapeXml(loc)}</loc><lastmod>${now}</lastmod></url>`);
  }

  const eduCourses = getAllCourseSlugs();
  for (const slug of eduCourses) {
    const loc = `${base}/education/courses/${slug}`;
    urls.push(`  <url><loc>${escapeXml(loc)}</loc><lastmod>${now}</lastmod></url>`);
  }

  // Immigration dynamic paths
  try {
    const immPosts = await getImmigrationPosts();
    for (const post of immPosts) {
      const loc = `${base}/immigration/blog/${post.slug}`;
      const lastmod = post.publishedAt
        ? new Date(post.publishedAt).toISOString().slice(0, 10)
        : now;
      urls.push(`  <url><loc>${escapeXml(loc)}</loc><lastmod>${lastmod}</lastmod></url>`);
    }
  } catch {}

  const immServices = getImmigrationServiceSlugs();
  for (const slug of immServices) {
    const loc = `${base}/immigration/services/${slug}`;
    urls.push(`  <url><loc>${escapeXml(loc)}</loc><lastmod>${now}</lastmod></url>`);
  }

  const immDestinations = getImmigrationDestinationSlugs();
  for (const slug of immDestinations) {
    const loc = `${base}/immigration/destinations/${slug}`;
    urls.push(`  <url><loc>${escapeXml(loc)}</loc><lastmod>${now}</lastmod></url>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;

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
