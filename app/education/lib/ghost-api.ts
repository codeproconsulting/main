/**
 * Ghost CMS Content API client for the frontend blog.
 * Set VITE_GHOST_API_URL (e.g. https://yourblog.ghost.io) and VITE_GHOST_CONTENT_API_KEY in .env.
 */

const BASE = (import.meta.env.VITE_GHOST_API_URL ?? "").replace(/\/$/, "");
const KEY = import.meta.env.VITE_GHOST_CONTENT_API_KEY ?? "";

/** Unified post type used across the app (normalized from Ghost response). */
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  /** HTML content from Ghost */
  html?: string | null;
  /** Alias for html for compatibility with body-based components */
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
  meta_title?: string | null;
  meta_description?: string | null;
  authors?: Array<{ name?: string }>;
}

interface GhostPostsResponse {
  posts?: GhostPostRaw[];
  meta?: {
    pagination?: {
      page?: number;
      limit?: number;
      pages?: number;
      total?: number;
      next?: number | null;
      prev?: number | null;
    };
  };
}

function buildUrl(path: string, params?: Record<string, string | number>): string {
  if (!BASE || !KEY) throw new Error("VITE_GHOST_API_URL and VITE_GHOST_CONTENT_API_KEY must be set");
  const url = new URL(`${BASE}/ghost/api/content${path}`);
  url.searchParams.set("key", KEY);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  }
  return url.toString();
}

function normalizePost(raw: GhostPostRaw): Post {
  const author = raw.authors?.[0]?.name ?? null;
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
    author: author ?? null,
    metaTitle: raw.meta_title ?? null,
    metaDescription: raw.meta_description ?? null,
  };
}

/** Fetch all published posts (up to limit), newest first. */
export async function getPosts(limit = 100): Promise<Post[]> {
  const url = buildUrl("/posts/", { limit, include: "authors", filter: "tag:education" });
  const res = await fetch(url, { headers: { "Accept-Version": "v5.0" } });
  if (!res.ok) throw new Error(`Ghost API error: ${res.status}`);
  const data = (await res.json()) as GhostPostsResponse;
  const list = data.posts ?? [];
  return list.map(normalizePost);
}

/** Fetch the latest N posts (e.g. for home page). */
export async function getRecentPosts(limit: number): Promise<Post[]> {
  const url = buildUrl("/posts/", { limit, include: "authors", filter: "tag:education" });
  const res = await fetch(url, { headers: { "Accept-Version": "v5.0" } });
  if (!res.ok) throw new Error(`Ghost API error: ${res.status}`);
  const data = (await res.json()) as GhostPostsResponse;
  const list = data.posts ?? [];
  return list.map(normalizePost);
}

export interface PaginatedPostsResult {
  docs: Post[];
  totalDocs: number;
  totalPages: number;
  page: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/** Fetch one page of posts (for blog listing pagination). */
export async function getPostsPaginated(page: number, limit: number): Promise<PaginatedPostsResult> {
  const pageParam = Math.max(1, page);
  const url = buildUrl("/posts/", { page: pageParam, limit, include: "authors", filter: "tag:education" });
  const res = await fetch(url, { headers: { "Accept-Version": "v5.0" } });
  if (!res.ok) throw new Error(`Ghost API error: ${res.status}`);
  const data = (await res.json()) as GhostPostsResponse;
  const list = data.posts ?? [];
  const pagination = data.meta?.pagination ?? {};
  const total = pagination.total ?? list.length;
  const pages = pagination.pages ?? 1;
  return {
    docs: list.map(normalizePost),
    totalDocs: total,
    totalPages: pages,
    page: pagination.page ?? 1,
    hasNextPage: (pagination.next ?? 0) > 0,
    hasPrevPage: (pagination.prev ?? 0) > 0,
  };
}

/** Fetch a single post by slug. */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const encoded = encodeURIComponent(slug);
  const url = buildUrl(`/posts/slug/${encoded}/`, { include: "authors" });
  const res = await fetch(url, { headers: { "Accept-Version": "v5.0" } });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Ghost API error: ${res.status}`);
  }
  const data = (await res.json()) as { posts?: GhostPostRaw[] };
  const raw = data.posts?.[0];
  return raw ? normalizePost(raw) : null;
}

/** Resolve cover image URL for a post. */
export function getCoverImageUrl(post: Post): string {
  if (post.featureImage) return post.featureImage;
  return `https://picsum.photos/seed/${encodeURIComponent(post.slug)}/800/450`;
}

/** Alt text for cover image. */
export function getCoverImageAlt(post: Post): string {
  return post.featureImageAlt ?? post.title;
}
