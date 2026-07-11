/**
 * Ghost CMS Content API client for the frontend blog.
 * Set VITE_GHOST_URL and VITE_GHOST_CONTENT_API_KEY in .env.
 * Create a Custom Integration in Ghost Admin to get the Content API key.
 */

const GHOST_URL = (import.meta.env.VITE_GHOST_API_URL ?? import.meta.env.VITE_GHOST_URL ?? "").replace(/\/$/, "").replace(/\/ghost$/, "");
const API_KEY = import.meta.env.VITE_GHOST_CONTENT_API_KEY ?? "";

export interface GhostAuthor {
  id: string;
  name: string;
  slug: string;
  profile_image?: string | null;
  [key: string]: unknown;
}

export interface GhostPost {
  id: string;
  uuid: string;
  title: string;
  slug: string;
  html?: string | null;
  excerpt?: string | null;
  feature_image?: string | null;
  feature_image_alt?: string | null;
  feature_image_caption?: string | null;
  published_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  primary_author?: GhostAuthor | null;
  authors?: GhostAuthor[] | null;
  [key: string]: unknown;
}

interface GhostBrowseResponse<T> {
  posts?: T[];
  meta?: { pagination?: { page: number; limit: number; pages: number; total: number } };
}

function getApiUrl(path: string, searchParams?: Record<string, string>): string {
  if (!GHOST_URL || !API_KEY) throw new Error("VITE_GHOST_URL and VITE_GHOST_CONTENT_API_KEY must be set");
  const url = new URL(`${GHOST_URL}/ghost/api/content${path}`);
  url.searchParams.set("key", API_KEY);
  if (searchParams) {
    Object.entries(searchParams).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  return url.toString();
}

/** Fetch all published posts, newest first. */
export async function getPosts(): Promise<GhostPost[]> {
  const url = getApiUrl("/posts/", {
    limit: "100",
    include: "authors",
    formats: "html",
    order: "published_at DESC",
    filter: "tag:immigration",
  });
  const res = await fetch(url, {
    headers: { "Accept-Version": "v6.0" },
  });
  if (!res.ok) throw new Error(`Ghost API error: ${res.status}`);
  const data = (await res.json()) as GhostBrowseResponse<GhostPost>;
  return data.posts ?? [];
}

/** Fetch a single post by slug. */
export async function getPostBySlug(slug: string): Promise<GhostPost | null> {
  const encoded = encodeURIComponent(slug);
  const url = getApiUrl(`/posts/slug/${encoded}/`, { formats: "html", include: "authors" });
  const res = await fetch(url, {
    headers: { "Accept-Version": "v6.0" },
  });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Ghost API error: ${res.status}`);
  }
  const data = (await res.json()) as GhostBrowseResponse<GhostPost>;
  const post = data.posts?.[0];
  return post ?? null;
}

export function getCoverImageUrl(post: GhostPost): string {
  const url = post.feature_image;
  if (url) return url.startsWith("http") ? url : `${GHOST_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  return `https://picsum.photos/seed/${encodeURIComponent(post.slug)}/800/450`;
}

export function getCoverImageAlt(post: GhostPost): string {
  return post.feature_image_alt ?? post.title;
}

export function getPrimaryAuthorName(post: GhostPost): string | null {
  const author = post.primary_author ?? post.authors?.[0];
  return author?.name ?? null;
}
