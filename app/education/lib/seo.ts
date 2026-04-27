/**
 * SEO helpers: base URL, canonical, default share image.
 * Set VITE_APP_URL in .env for production (e.g. https://proconsultingeducation.com).
 */
const BASE_URL = (import.meta.env.VITE_APP_URL ?? "").replace(/\/$/, "");

export const SITE_NAME = "ProConsulting Education";
export const DEFAULT_OG_IMAGE = "/Logo.png"; // or a dedicated 1200x630 share image path

/** Absolute base URL for the site (empty in dev if VITE_APP_URL not set). */
export function getBaseUrl(): string {
  return BASE_URL;
}

/** Absolute URL for a path (e.g. canonical, og:url). */
export function getAbsoluteUrl(path: string): string {
  const base = getBaseUrl();
  if (!base) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

/** Canonical href for the current path. Use in route links(). */
export function getCanonicalHref(pathname: string): string {
  return getBaseUrl() ? getAbsoluteUrl(pathname) : pathname;
}

/** Meta descriptors for og:title, og:description, og:url, twitter:title, twitter:description. */
export function pageMeta({
  title,
  description,
  pathname,
}: {
  title: string;
  description: string;
  pathname: string;
}): Array<{ property?: string; name?: string; content: string }> {
  const list: Array<{ property?: string; name?: string; content: string }> = [
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
  if (getBaseUrl()) {
    list.push({ property: "og:url", content: getAbsoluteUrl(pathname) });
  }
  return list;
}

/** Link descriptor for canonical (empty if base URL not set). */
export function canonicalLink(pathname: string): Array<{ rel: string; href: string }> {
  if (!getBaseUrl()) return [];
  return [{ rel: "canonical", href: getCanonicalHref(pathname) }];
}
