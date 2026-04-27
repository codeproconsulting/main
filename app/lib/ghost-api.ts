/**
 * Ghost CMS Content API (same as education site). Set VITE_GHOST_API_URL and VITE_GHOST_CONTENT_API_KEY in .env.
 */

const BASE = (import.meta.env.VITE_GHOST_API_URL ?? "").replace(/\/$/, "");
const KEY = import.meta.env.VITE_GHOST_CONTENT_API_KEY ?? "";

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  html?: string | null;
  body?: string | null;
  featureImage?: string | null;
  featureImageAlt?: string | null;
  publishedAt?: string | null;
  author?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
}

interface GhostPostRaw {
  id?: string;
  uuid?: string;
  title?: string;
  slug?: string;
  html?: string;
  excerpt?: string;
  feature_image?: string | null;
  feature_image_alt?: string | null;
  published_at?: string;
  authors?: Array<{ name?: string }>;
  meta_title?: string | null;
  meta_description?: string | null;
}

interface GhostPostsResponse {
  posts?: GhostPostRaw[];
  meta?: { pagination?: { page?: number; limit?: number; pages?: number; total?: number; next?: number | null; prev?: number | null } };
}

function buildUrl(path: string, params?: Record<string, string | number>): string {
  const url = new URL(`${BASE}/ghost/api/content${path}`);
  url.searchParams.set("key", KEY);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  return url.toString();
}

function normalizePost(raw: GhostPostRaw): Post {
  return {
    id: raw.id ?? raw.uuid ?? "",
    title: raw.title ?? "",
    slug: raw.slug ?? "",
    excerpt: raw.excerpt ?? null,
    html: raw.html ?? null,
    body: raw.html ?? null,
    featureImage: raw.feature_image ?? null,
    featureImageAlt: raw.feature_image_alt ?? null,
    publishedAt: raw.published_at ?? null,
    author: raw.authors?.[0]?.name ?? null,
    metaTitle: raw.meta_title ?? null,
    metaDescription: raw.meta_description ?? null,
  };
}

export async function getRecentPosts(limit: number): Promise<Post[]> {
  if (!BASE || !KEY) return [];
  try {
    const url = buildUrl("/posts/", { limit, include: "authors" });
    const res = await fetch(url, { headers: { "Accept-Version": "v5.0" } });
    if (!res.ok) return [];
    const data = (await res.json()) as GhostPostsResponse;
    const list = data.posts ?? [];
    return list.map(normalizePost);
  } catch {
    return [];
  }
}

export function getCoverImageUrl(post: Post): string {
  if (post.featureImage) return post.featureImage;
  return `https://picsum.photos/seed/${encodeURIComponent(post.slug)}/800/450`;
}

export function getCoverImageAlt(post: Post): string {
  return post.featureImageAlt ?? post.title;
}
