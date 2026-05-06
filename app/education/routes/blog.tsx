"use client";

import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Navbar } from "~/education/components/ui/Navbar";
import { Footer } from "~/education/components/ui/footer";
import { getPostsPaginated, getRecentPosts, getCoverImageUrl, getCoverImageAlt, type Post } from "~/education/lib/ghost-api";
import { pageMeta, canonicalLink } from "~/education/lib/seo";
import { ArrowRight, Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import type { Route } from "./+types/blog";

const POSTS_PER_PAGE = 8;

const BRAND = { navy: "#0B1B3A", pink: "#FF4D6D" };

const TITLE = "Blog | ProConsulting";
const DESCRIPTION =
  "Expert guidance on study abroad, visas, and university applications. Latest updates from ProConsulting.";

const POPULAR_TAGS = [
  "Study Abroad",
  "UK",
  "Visa",
  "University",
  "Scholarships",
  "Australia",
  "Canada",
  "Applications",
];

export function meta(args?: Route.MetaArgs) {
  const pathname = args?.location?.pathname ?? "/education/blog";
  return [
    { title: TITLE },
    { name: "description", content: DESCRIPTION },
    ...pageMeta({ title: TITLE, description: DESCRIPTION, pathname }),
  ];
}

export function links(args?: any) {
  return canonicalLink(args?.location?.pathname ?? "/education/blog");
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);

  const [posts, setPosts] = useState<Post[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocs, setTotalDocs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      getPostsPaginated(page, POSTS_PER_PAGE),
      getRecentPosts(3),
    ])
      .then(([paginated, recent]) => {
        setPosts(paginated.docs);
        setTotalPages(paginated.totalPages);
        setTotalDocs(paginated.totalDocs);
        setRecentPosts(recent);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load posts"))
      .finally(() => setLoading(false));
  }, [page]);

  const filteredPosts = searchQuery.trim()
    ? posts.filter((p) => {
        const q = searchQuery.toLowerCase();
        return p.title.toLowerCase().includes(q) || (p.excerpt && p.excerpt.toLowerCase().includes(q));
      })
    : posts;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10 md:py-16">
          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
            {/* Main content – ~2/3 */}
            <div className="lg:flex-[2] min-w-0">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center gap-1.5" aria-hidden>
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: BRAND.pink }}
                    />
                    <span className="w-6 h-2 rounded-full bg-[#0B1B3A]" />
                  </span>
                  <span className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                    News & Blogs
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0B1B3A] leading-tight">
                  Our Latest News & Blogs
                </h1>
              </div>

              {loading && (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-10 h-10 animate-spin text-[#0B1B3A]" />
                </div>
              )}
              {error && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8">
                  <p className="text-red-600 font-medium mb-2">{error}</p>
                  <p className="text-slate-500 text-sm">
                    If the message says &quot;must be set&quot;, rebuild on the server after adding the keys to .env: <code className="bg-slate-200 px-1 rounded">npm run build &amp;&amp; pm2 restart education</code>. If it says &quot;Ghost API error: 401&quot;, check the Content API key in Ghost → Settings → Integrations.
                  </p>
                </div>
              )}
              {!loading && !error && posts.length === 0 && (
                <div className="text-center py-20 text-slate-600 rounded-2xl border border-slate-200 bg-slate-50/50 p-8">
                  <p>No posts yet. Add posts in Ghost Admin to see them here.</p>
                </div>
              )}
              {!loading && !error && (posts.length > 0 || totalDocs > 0) && (
                <div className="space-y-8">
                  {filteredPosts.length === 0 ? (
                    <p className="text-slate-600 py-8">No posts match your search.</p>
                  ) : (
                    filteredPosts.map((post) => {
                      const coverUrl = getCoverImageUrl(post);
                      const coverAlt = getCoverImageAlt(post);
                      const dateStr = formatDate(post.publishedAt);
                      return (
                        <article
                          key={post.id}
                          className="rounded-2xl overflow-hidden bg-slate-50/80 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <Link to={`/education/blog/${post.slug}`} className="block">
                            <div className="aspect-[16/10] md:aspect-[21/9] bg-slate-200 overflow-hidden">
                              <img
                                src={coverUrl}
                                alt={coverAlt}
                                className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500"
                              />
                            </div>
                            <div className="p-5 md:p-6">
                              <div className="flex flex-wrap gap-2 mb-3">
                                <span
                                  className="text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-lg text-white"
                                  style={{ backgroundColor: BRAND.pink }}
                                >
                                  Study Abroad
                                </span>
                                <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700">
                                  {dateStr}
                                </span>
                              </div>
                              <h2 className="text-xl md:text-2xl font-bold text-[#0B1B3A] mb-2 leading-tight line-clamp-2 group-hover:text-[#FF4D6D] transition-colors">
                                {post.title}
                              </h2>
                              {post.excerpt && (
                                <p className="text-slate-600 text-sm md:text-base leading-relaxed line-clamp-3 mb-4">
                                  {post.excerpt}
                                </p>
                              )}
                              <span className="inline-flex items-center gap-1.5 font-bold text-sm text-[#0B1B3A] hover:text-[#FF4D6D] transition-colors">
                                Read more
                                <ArrowRight className="w-4 h-4" style={{ color: BRAND.pink }} />
                              </span>
                            </div>
                          </Link>
                        </article>
                      );
                    })
                  )}

                  {/* Pagination */}
                  {!searchQuery.trim() && totalPages > 1 && (
                    <nav
                      className="flex flex-wrap items-center justify-center gap-2 pt-8 md:pt-12 border-t border-slate-200"
                      aria-label="Blog pagination"
                    >
                      {page > 1 ? (
                        <Link
                          to={page === 2 ? "/education/blog" : `/education/blog?page=${page - 1}`}
                          className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50"
                          aria-label="Previous page"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Previous
                        </Link>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-white text-sm font-medium cursor-not-allowed">
                          <ChevronLeft className="w-4 h-4" />
                          Previous
                        </span>
                      )}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                          <Link
                            key={p}
                            to={p === 1 ? "/education/blog" : `/education/blog?page=${p}`}
                            className={`min-w-[2.5rem] px-3 py-2 rounded-lg text-sm font-medium text-center transition-colors ${
                              p === page
                                ? "bg-[#0B1B3A] text-white"
                                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                            }`}
                            aria-label={`Page ${p}`}
                            aria-current={p === page ? "page" : undefined}
                          >
                            {p}
                          </Link>
                        ))}
                      </div>
                      {page < totalPages ? (
                        <Link
                          to={`/education/blog?page=${page + 1}`}
                          className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50"
                          aria-label="Next page"
                        >
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-white text-sm font-medium cursor-not-allowed">
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      )}
                    </nav>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar – ~1/3 */}
            <aside className="lg:w-[340px] lg:shrink-0 space-y-8">
              {/* Search */}
              <div>
                <h3 className="text-lg font-bold text-[#0B1B3A] mb-3">Search</h3>
                <div className="relative">
                  <input
                    type="search"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-4 pr-11 py-3 text-slate-900 placeholder-slate-400 focus:border-[#FF4D6D] focus:ring-2 focus:ring-[#FF4D6D]/20 outline-none transition"
                    aria-label="Search blog posts"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white pointer-events-none" />
                </div>
              </div>

              {/* Popular Tags */}
              <div>
                <h3 className="text-lg font-bold text-[#0B1B3A] mb-3">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSearchQuery(tag)}
                      className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 hover:text-[#0B1B3A] transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Post */}
              <div>
                <h3 className="text-lg font-bold text-[#0B1B3A] mb-3">Recent Post</h3>
                <ul className="space-y-4">
                  {recentPosts.map((post) => (
                    <li key={post.id}>
                      <Link
                        to={`/education/blog/${post.slug}`}
                        className="flex gap-3 group"
                      >
                        <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-slate-200">
                          <img
                            src={getCoverImageUrl(post)}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-[#0B1B3A] text-sm line-clamp-2 group-hover:text-[#FF4D6D] transition-colors">
                            {post.title}
                          </p>
                          <p className="text-slate-500 text-xs mt-0.5">
                            {formatDate(post.publishedAt)}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Banner */}
              <div
                className="rounded-2xl overflow-hidden relative text-white p-6 md:p-8 min-h-[200px] flex flex-col justify-end"
                style={{ backgroundColor: BRAND.navy }}
              >
                <div
                  className="absolute inset-0 opacity-20 bg-cover bg-center"
                  style={{
                    backgroundImage: "url(https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop)",
                  }}
                />
                <div className="relative z-10">
                  <p className="text-white text-sm font-semibold mb-1">Free Consultation</p>
                  <p className="text-xl font-bold mb-4 leading-tight">
                    Ready to start your study abroad journey?
                  </p>
                  <Link
                    to="/education/contact"
                    className="inline-flex items-center justify-center w-full py-3 rounded-xl font-bold text-sm text-white transition-opacity hover:opacity-95"
                    style={{ backgroundColor: BRAND.pink }}
                  >
                    Book a free consultation
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
