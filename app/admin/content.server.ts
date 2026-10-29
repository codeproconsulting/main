import { createHash, randomUUID } from "node:crypto";
import { safeArticle, hasArticleContent } from "~/lib/article-html";
export { safeArticle } from "~/lib/article-html";
import { AppwriteError, createDocument, getDocument, listDocuments, query, updateDocument } from "~/lib/appwrite.server";
import { canEditContent, canPublish, type Post, type Staff } from "./domain";
import { allow, audit, field, dateField, serialized } from "./crm.server";
export const protectedPublication = (post: Post) => ["published", "scheduled"].includes(post.status);
export async function postsFor(staff: Staff) {
  allow(canEditContent(staff));
  return listDocuments<Post>("posts", [query("orderDesc", "$updatedAt"), query("limit", undefined, [100])]);
}
export async function postFor(staff: Staff, id: string) {
  allow(canEditContent(staff));
  const post = await getDocument<Post>("posts", id);
  return { ...post, body: safeArticle(post.body) };
}
async function snapshot(staff: Staff, post: Post) {
  const id = createHash("sha256").update(`revision:${post.$id}:${post.version}`).digest("hex").slice(0, 32);
  const data = { postId: post.$id, actor: staff.$id, payload: JSON.stringify(post), version: post.version };
  if (data.payload.length > 1000000) throw new Response("This article is too large to retain a safe revision.", { status: 400 });
  try { await createDocument("revisions", data, id); }
  catch (error) {
    if (!(error instanceof AppwriteError) || error.status !== 409) throw error;
    const existing = await getDocument<typeof data>("revisions", id);
    if (existing.postId !== post.$id || existing.version !== post.version || existing.payload !== data.payload) throw new Response("Revision history needs review before this article can change.", { status: 409 });
  }
}
export async function savePost(staff: Staff, id: string, form: FormData) {
  allow(canEditContent(staff));
  return serialized(`post:${id}`, async () => {
    const existing = id === "new" ? null : await postFor(staff, id);
    if (existing && existing.version !== Number(field(form, "version"))) throw new Response("This post has changed. Refresh before saving.", { status: 409 });
    const title = field(form, "title", 300), slug = field(form, "slug", 200), section = field(form, "section", 30), status = field(form, "status", 30);
    if (!title || !slug || !/^([a-z0-9]+-)*[a-z0-9]+$/.test(slug)) throw new Response("Enter a title and a lowercase URL slug with hyphens.", { status: 400 });
    if (!["education", "immigration", "general"].includes(section) || !["draft", "review", "scheduled", "published", "archived"].includes(status)) throw new Response("Invalid content settings", { status: 400 });
    allow(canPublish(staff) || !["published", "scheduled"].includes(status));
    allow(!existing || !protectedPublication(existing) || canPublish(staff));
    if (existing && (existing.slug !== slug || existing.section !== section)) throw new Response("URL changes require a redirect migration. Keep the existing section and slug for now.", { status: 400 });
    const duplicates = await listDocuments<Post>("posts", [query("equal", "slug", [slug]), query("equal", "section", [section]), query("limit", undefined, [2])]);
    if (duplicates.documents.some(p => p.$id !== existing?.$id)) throw new Response("That URL is already in use.", { status: 409 });
    const image = field(form, "image", 2000);
    if (image && !/^https:\/\//i.test(image)) throw new Response("Image URLs must use HTTPS.", { status: 400 });
    const body = safeArticle(field(form, "body", 500000));
    if (["published", "scheduled"].includes(status) && !hasArticleContent(body)) throw new Response("Add article content before publishing or scheduling.", { status: 400 });
    const requestedDate = status === "scheduled" ? dateField(field(form, "publishedAt", 40)) : "";
    if (status === "scheduled" && (!requestedDate || Date.parse(requestedDate) <= Date.now())) throw new Response("Choose a future publishing date with a timezone.", { status: 400 });
    let publishedAt = existing?.publishedAt || "";
    if (status === "scheduled") publishedAt = requestedDate;
    else if (status === "published" && (!publishedAt || existing?.status === "scheduled")) publishedAt = new Date().toISOString();
    const payload = { title, slug, section, status, body, excerpt: field(form, "excerpt", 2000), image, publishedAt, metaTitle: field(form, "metaTitle", 300), metaDescription: field(form, "metaDescription", 1000), author: field(form, "author", 200) || staff.name, legacyId: existing?.legacyId ?? "", version: (existing?.version ?? 0) + 1 };
    if (existing) await snapshot(staff, existing);
    const targetId = existing?.$id ?? randomUUID();
    const intent = await audit(staff, targetId, "post", "Post save requested", { title, status, fromVersion: existing?.version ?? 0, version: payload.version, state: "pending" });
    const post = existing ? await updateDocument<Post>("posts", id, payload) : await createDocument("posts", payload, targetId);
    await updateDocument("activities", intent.$id, { event: existing ? "Post updated" : "Post created", details: JSON.stringify({ title, status, version: payload.version, state: "completed" }) });
    return post;
  });
}
export async function restorePost(staff: Staff, id: string, revisionId: string, version: string) {
  const post = await postFor(staff, id);
  const revision = await getDocument<{ postId: string; payload: string }>("revisions", revisionId);
  allow(revision.postId === post.$id);
  const old: Post = JSON.parse(revision.payload);
  const restore = new FormData();
  for (const key of ["title", "body", "excerpt", "image", "metaTitle", "metaDescription", "author"] as const) restore.set(key, old[key] ?? "");
  for (const key of ["slug", "section", "status", "publishedAt"] as const) restore.set(key, post[key]);
  restore.set("version", version);
  return savePost(staff, id, restore);
}
