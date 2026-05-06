"use client";

import { useState } from "react";
import { Link, useLoaderData } from "react-router";
import { Navbar } from "~/education/components/ui/Navbar";
import { Footer } from "~/education/components/ui/footer";
import {
  getPostBySlug,
  getPosts,
  getCoverImageUrl,
  getCoverImageAlt,
  type Post,
} from "~/education/lib/ghost-api";
import { pageMeta, canonicalLink, getAbsoluteUrl, getBaseUrl, SITE_NAME } from "~/education/lib/seo";
import { GhostHtmlBody, getHeadingsFromHtml } from "~/education/components/ui/GhostHtmlBody";
import { GOOGLE_SHEET_SCRIPT_URL } from "~/education/lib/google-sheet";
import {
  ArrowLeft,
  ArrowRight,
  Facebook,
  Linkedin,
  Link2,
  RefreshCw,
} from "lucide-react";
import type { Route } from "./+types/blog.$slug";

const BRAND = { navy: "#0B1B3A", pink: "#FF4D6D" };

const SIDEBAR_CATEGORIES = [
  "Study Abroad",
  "UK",
  "Visa",
  "University",
  "Scholarships",
  "Australia",
  "Canada",
  "Applications",
];

export async function loader({ params }: Route.LoaderArgs) {
  const post = await getPostBySlug(params.slug).catch(() => null);
  let relatedPosts: Post[] = [];
  if (post) {
    try {
      const all = await getPosts(50);
      relatedPosts = all.filter((p) => p.slug !== post.slug).slice(0, 3);
    } catch {
      // no related posts if API fails
    }
  }
  return { post, relatedPosts };
}

export function meta(args?: Route.MetaArgs) {
  if (!args?.data?.post) {
    return [{ title: "Post not found | ProConsulting" }];
  }
  const post = args.data.post;
  const title = (post.metaTitle || post.title) + " | ProConsulting";
  const description = (post.metaDescription || post.excerpt) ?? "";
  const pathname = args?.location?.pathname ?? (args?.params ? `/education/blog/${args.params.slug}` : "");
  const ogImage = getCoverImageUrl(post);
  const metaTags: Route.MetaArgs["meta"] = [
    { title },
    { name: "description", content: description },
    ...pageMeta({ title, description, pathname }),
    { property: "og:type", content: "article" },
    { property: "og:image", content: ogImage },
  ];
  if (post.publishedAt) {
    metaTags.push({
      property: "article:published_time",
      content: new Date(post.publishedAt).toISOString(),
    });
  }
  return metaTags;
}

export function links(args?: any) {
  if (!args?.data?.post) return [];
  const pathname = args?.location?.pathname ?? (args?.params ? `/education/blog/${args.params.slug}` : "");
  return pathname ? canonicalLink(pathname) : [];
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function estimateReadTime(html: string | null | undefined): number {
  const headings = getHeadingsFromHtml(html);
  const base = headings.length * 2 + 3;
  return Math.max(1, Math.min(15, base));
}

export default function BlogPost() {
  const { post, relatedPosts } = useLoaderData<typeof loader>();
  const error = !post ? "Post not found" : null;
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);

  if (error || !post) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen border-b border-slate-200/80 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-6 pt-12 pb-10 md:pt-16 md:pb-14">
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-[#0B1B3A] transition-colors">Home</Link>
              <span aria-hidden>/</span>
              <Link to="/education/blog" className="hover:text-[#0B1B3A] transition-colors">Blog</Link>
              <span aria-hidden>/</span>
              <span className="text-slate-500">Post not found</span>
            </nav>
            <p className="text-red-600 mb-4">{error ?? "Post not found"}</p>
            <Link
              to="/education/blog"
              className="inline-flex items-center gap-2 text-slate-500 hover:text-[#FF4D6D] font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to blog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const publishedDate = formatDate(post.publishedAt);
  const coverUrl = getCoverImageUrl(post);
  const coverAlt = getCoverImageAlt(post);
  const readTime = estimateReadTime(post.html);
  const tocHeadings = getHeadingsFromHtml(post.html);
  const alsoReadPost = relatedPosts[0];

  async function submitSidebarLead(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLeadError(null);
    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      source: "blog-sidebar",
      blogSlug: post.slug,
      blogTitle: post.title,
      name: (data.get("name") as string) ?? "",
      email: (data.get("email") as string) ?? "",
      phone: (data.get("phone") as string) ?? "",
      interestedCountry: (data.get("interestedCountry") as string) ?? "",
      message: (data.get("message") as string) ?? "",
      date: new Date().toISOString(),
    };

    if (!GOOGLE_SHEET_SCRIPT_URL) {
      setLeadError("Form is not configured yet. Please try again later.");
      return;
    }

    setLeadSubmitting(true);
    try {
      await fetch(GOOGLE_SHEET_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify(payload),
      });
      setLeadSubmitted(true);
      form.reset();
    } catch (err: any) {
      setLeadError(err?.message || "Could not send your request. Please try again.");
    } finally {
      setLeadSubmitting(false);
    }
  }

  const base = getBaseUrl();
  const articleUrl = base ? getAbsoluteUrl(`/education/blog/${post.slug}`) : undefined;
  const blogPostingJsonLd =
    base && articleUrl
      ? {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: (post.metaDescription || post.excerpt) ?? undefined,
          image: getCoverImageUrl(post),
          url: articleUrl,
          datePublished: post.publishedAt ?? undefined,
          author: post.author ? { "@type": "Person", name: post.author } : undefined,
          publisher: { "@type": "Organization", name: SITE_NAME, logo: getAbsoluteUrl("/logo.png") },
        }
      : null;

  return (
    <>
      <Navbar />
      {blogPostingJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
        />
      )}
      <main className="min-h-screen bg-white">
        <article>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8 md:pt-8 md:pb-12">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 xl:gap-12">
              {/* Share bar – left (desktop only) */}
              <div className="hidden lg:flex flex-col items-center gap-4 order-2 lg:order-1 w-12 shrink-0 pt-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white -rotate-90 origin-center whitespace-nowrap w-0">
                  Share
                </span>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl || "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-opacity hover:opacity-90 shrink-0"
                  style={{ backgroundColor: BRAND.pink }}
                  aria-label="Share on Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(articleUrl || "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-opacity hover:opacity-90 shrink-0"
                  style={{ backgroundColor: BRAND.pink }}
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(articleUrl || window.location.href);
                  }}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-opacity hover:opacity-90 shrink-0"
                  style={{ backgroundColor: BRAND.pink }}
                  aria-label="Copy link"
                >
                  <Link2 className="w-4 h-4" />
                </button>
              </div>

              {/* Main content – image and article aligned to same column */}
              <div className="flex-1 min-w-0 max-w-3xl order-1 lg:order-2">
                {/* Hero image – aligned with content width, consistent aspect */}
                <div className="rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-[2/1] max-h-[380px] sm:max-h-[420px] bg-slate-200 mb-8">
                  <img
                    src={coverUrl}
                    alt={coverAlt}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Category – centered */}
                <div className="flex justify-center mb-4">
                  <span
                    className="inline-block text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-lg text-white"
                    style={{ backgroundColor: BRAND.pink }}
                  >
                    Study Abroad
                  </span>
                </div>

                {/* Title – centered, consistent line height */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-bold text-[#0B1B3A] leading-tight text-center max-w-3xl mx-auto mb-6">
                  {post.title}
                </h1>

                {/* Author & meta – single row, centered, clear separators */}
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-slate-600 text-sm mb-8">
                  <span className="flex items-center gap-2 shrink-0">
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ backgroundColor: BRAND.navy }}
                    >
                      {post.author ? post.author.charAt(0) : "?"}
                    </span>
                    {post.author && (
                      <span className="font-medium text-slate-700">Written by {post.author}</span>
                    )}
                  </span>
                  {publishedDate && (
                    <>
                      <span className="text-white hidden sm:inline" aria-hidden>|</span>
                      <span>{publishedDate}</span>
                    </>
                  )}
                  <span className="text-white hidden sm:inline" aria-hidden>|</span>
                  <span>{readTime} min read</span>
                </div>

                {/* Excerpt – left-aligned with body, spacing */}
                {post.excerpt && (
                  <p className="text-lg text-slate-600 leading-relaxed mb-10 border-l-4 border-slate-200 pl-5">
                    {post.excerpt}
                  </p>
                )}

                {/* Article body – prose aligned */}
                <div
                  className="prose prose-slate prose-lg max-w-none prose-headings:text-[#0B1B3A] prose-headings:font-bold prose-headings:mt-10 prose-headings:mb-4 prose-p:mb-4 prose-a:text-[#FF4D6D] prose-a:no-underline hover:prose-a:underline prose-li:marker:text-[#FF4D6D] [&_img]:rounded-lg [&_img]:shadow-md"
                >
                  <GhostHtmlBody html={post.html} />
                </div>

                {/* Also Read – full width of main column */}
                {alsoReadPost && (
                  <div
                    className="mt-12 p-6 rounded-2xl text-white"
                    style={{ backgroundColor: BRAND.navy }}
                  >
                    <p className="text-sm font-semibold mb-2" style={{ color: BRAND.pink }}>
                      Also Read
                    </p>
                    <Link
                      to={`/education/blog/${alsoReadPost.slug}`}
                      className="block text-white font-medium hover:underline"
                    >
                      {alsoReadPost.title}
                    </Link>
                  </div>
                )}

                {/* Author bio – aligned, clear grid */}
                <div
                  className="mt-12 p-6 rounded-2xl text-white flex flex-col sm:flex-row gap-4 sm:gap-6 items-start"
                  style={{ backgroundColor: BRAND.navy }}
                >
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold shrink-0"
                    style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                  >
                    {post.author ? post.author.charAt(0) : "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm mb-1" style={{ color: BRAND.pink }}>
                      {post.author || "ProConsulting Team"}
                    </p>
                    <p className="text-white text-sm leading-relaxed">
                      Expert guidance on study abroad, university applications, and visas. We help students navigate their journey to studying in the UK, Australia, Canada, and beyond.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sidebar – aligned section titles and spacing */}
              <aside className="lg:w-[280px] xl:w-[300px] shrink-0 order-3 space-y-8 lg:pt-2">
                {/* Free consultation form */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-slate-200 bg-slate-50/60">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#FF4D6D]">
                      Free Consultation
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-[#0B1B3A] leading-snug">
                      Get a personalised study plan in 10 minutes
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      Tell us your profile and target country — we’ll reply with the best options and next steps.
                    </p>
                  </div>

                  <div className="p-5">
                    {leadSubmitted ? (
                      <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-sm text-emerald-700">
                        Thanks! We’ll contact you shortly.
                      </div>
                    ) : (
                      <form onSubmit={submitSidebarLead} className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="sidebarName">
                            Name
                          </label>
                          <input
                            id="sidebarName"
                            name="name"
                            required
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition"
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="sidebarEmail">
                            Email
                          </label>
                          <input
                            id="sidebarEmail"
                            name="email"
                            type="email"
                            required
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition"
                            placeholder="you@example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="sidebarPhone">
                            Phone
                          </label>
                          <input
                            id="sidebarPhone"
                            name="phone"
                            type="tel"
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition"
                            placeholder="+92 3xx xxxxxxx"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="sidebarCountry">
                            Interested country
                          </label>
                          <input
                            id="sidebarCountry"
                            name="interestedCountry"
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition"
                            placeholder="e.g. UK, Australia"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="sidebarMessage">
                            Message (optional)
                          </label>
                          <textarea
                            id="sidebarMessage"
                            name="message"
                            rows={3}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition resize-none"
                            placeholder="Your qualification, budget, intake, etc."
                          />
                        </div>

                        {leadError && (
                          <p className="text-sm text-red-600 font-medium" role="alert">
                            {leadError}
                          </p>
                        )}

                        <button
                          type="submit"
                          disabled={leadSubmitting}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white transition-opacity hover:opacity-95 disabled:opacity-60"
                          style={{ backgroundColor: BRAND.pink }}
                        >
                          {leadSubmitting ? "Sending..." : "Get free consultation"}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <p className="text-xs text-slate-500 text-center">
                          No spam. We only use your info to contact you.
                        </p>
                      </form>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#0B1B3A] mb-3 pb-1 border-b border-slate-200">
                    Filter by Categories
                  </h3>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {SIDEBAR_CATEGORIES.map((cat) => (
                      <Link
                        key={cat}
                        to="/education/blog"
                        className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 hover:text-[#0B1B3A] transition-colors"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>

                {tocHeadings.length > 0 && (
                  <div>
                    <h3 className="text-base font-bold text-[#0B1B3A] mb-3 pb-1 border-b border-slate-200">
                      Table of Content
                    </h3>
                    <ul className="space-y-2 pt-2">
                      {tocHeadings.map((h) => (
                        <li key={h.id}>
                          <a
                            href={`#${h.id}`}
                            className="text-sm text-slate-600 hover:text-[#FF4D6D] transition-colors line-clamp-2 block py-0.5"
                          >
                            {h.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </aside>
            </div>
          </div>

          {/* Related News & Blogs */}
          {relatedPosts.length > 0 && (
            <section className="border-t border-slate-200 bg-slate-50/50 py-14 md:py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 mb-6">
                  <RefreshCw className="w-5 h-5" style={{ color: BRAND.pink }} />
                  <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: BRAND.pink }}>
                    Related News & Blogs
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#0B1B3A] mb-8">
                  Related News & Blogs
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {relatedPosts.map((related) => (
                    <Link
                      key={related.id}
                      to={`/education/blog/${related.slug}`}
                      className="group block rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-[#FF4D6D]/30 transition-all"
                    >
                      <div className="aspect-video bg-slate-200 overflow-hidden">
                        <img
                          src={getCoverImageUrl(related)}
                          alt={getCoverImageAlt(related)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-[#0B1B3A] line-clamp-2 group-hover:text-[#FF4D6D] transition-colors">
                          {related.title}
                        </h3>
                        {related.excerpt && (
                          <p className="text-slate-600 text-sm line-clamp-2 mt-1">{related.excerpt}</p>
                        )}
                        <span className="inline-flex items-center gap-1 mt-3 text-sm font-semibold" style={{ color: BRAND.pink }}>
                          Read more
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
