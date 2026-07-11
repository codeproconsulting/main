/**
 * SEO helpers for the immigration sub-app (proconsulting.uk/immigration/*).
 */
const BASE_URL = (import.meta.env.VITE_APP_URL ?? "https://proconsulting.uk").replace(/\/$/, "");

export const SITE_NAME = "Proconsulting Immigration";
export const DEFAULT_OG_IMAGE = "https://proconsulting.uk/Logo_main.png";

export function getBaseUrl(): string {
  return BASE_URL;
}

export function getAbsoluteUrl(path: string): string {
  const base = getBaseUrl();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export function getCanonicalHref(pathname: string): string {
  return getAbsoluteUrl(pathname);
}

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
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:image", content: ogImage },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:locale", content: "en_GB" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@proconsulting_" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
  ];
}

export function canonicalLink(pathname: string): Array<{ rel: string; href: string }> {
  return [{ rel: "canonical", href: getCanonicalHref(pathname) }];
}
