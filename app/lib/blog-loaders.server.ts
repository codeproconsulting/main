import { readPublicContent } from "./public-content.server";
export async function loadArticle(section: string, slug: string | undefined) {
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Response("Article not found", { status: 404 });
  try {
    const result = await readPublicContent(section, slug, 1, 1);
    if (!result.docs.length) throw new Response("Article not found", { status: 404 });
    return result.docs[0];
  } catch (error) {
    if (error instanceof Response && error.status === 404) throw error;
    throw new Response("The blog is temporarily unavailable. Please try again shortly.", { status: 503, headers: { "Retry-After": "60", "Cache-Control": "no-store" } });
  }
}
export async function loadListing(section: string, page = 1, limit = 12) {
  try {
    const result = await readPublicContent(section, "", page, limit);
    return { ...result, page, totalPages: Math.ceil(result.totalDocs / limit), hasNextPage: page * limit < result.totalDocs, hasPrevPage: page > 1 };
  } catch {
    throw new Response("The blog is temporarily unavailable. Please try again shortly.", { status: 503, headers: { "Retry-After": "60", "Cache-Control": "no-store" } });
  }
}
export async function loadAllPosts(section: string) {
  const posts = [];
  let page = 1;
  while (true) {
    const result = await loadListing(section, page, 100);
    posts.push(...result.docs);
    if (!result.hasNextPage) return posts;
    if (!result.docs.length || page >= 10000) throw new Response("Sitemap temporarily unavailable", { status: 503 });
    page++;
  }
}
