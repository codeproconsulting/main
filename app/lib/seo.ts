/**
 * SEO helpers for the main Proconsulting site (proconsulting.uk).
 * Set VITE_APP_URL in .env for production (e.g. https://proconsulting.uk).
 */
const BASE_URL = (import.meta.env.VITE_APP_URL ?? "https://proconsulting.uk").replace(/\/$/, "");

export const SITE_NAME = "Proconsulting";
export const DEFAULT_OG_IMAGE = "https://proconsulting.uk/Logo_main.png";

/** Absolute base URL for the site. */
export function getBaseUrl(): string {
  return BASE_URL;
}

/** Absolute URL for a path (e.g. canonical, og:url). */
export function getAbsoluteUrl(path: string): string {
  const base = getBaseUrl();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

/** Canonical href for the current path. */
export function getCanonicalHref(pathname: string): string {
  return getAbsoluteUrl(pathname);
}

/**
 * Full meta descriptors for a page: OG, Twitter/X Cards, canonical url.
 * Usage in route meta():
 *   return [
 *     { title: TITLE },
 *     { name: "description", content: DESCRIPTION },
 *     ...pageMeta({ title: TITLE, description: DESCRIPTION, pathname, image }),
 *   ];
 */
export function pageMeta({
  title,
  description,
  pathname,
  image,
}: {
  title: string;
  description: string;
  pathname: string;
  image?: string;
}): Array<{ property?: string; name?: string; content: string }> {
  const ogImage = image ?? DEFAULT_OG_IMAGE;
  const url = getAbsoluteUrl(pathname);
  return [
    // Open Graph
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:image", content: ogImage },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:locale", content: "en_GB" },
    // Twitter / X Cards
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@proconsulting_" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
  ];
}

/** Link descriptor for canonical tag. */
export function canonicalLink(pathname: string): Array<{ rel: string; href: string }> {
  return [{ rel: "canonical", href: getCanonicalHref(pathname) }];
}
