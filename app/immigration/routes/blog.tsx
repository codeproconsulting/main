"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Navbar } from "~/immigration/components/ui/Navbar";
import { Footer } from "~/immigration/components/ui/footer";
import { getPosts, getCoverImageUrl, getCoverImageAlt, type GhostPost } from "~/immigration/lib/ghost-api";
import { ArrowRight, Calendar, Loader2 } from "lucide-react";

export function meta() {
  return [
    { title: "Blog | ProConsulting Immigration" },
    {
      name: "description",
      content: "Updates on visit visas, immigration, and visa appeals. Latest from ProConsulting Immigration.",
    },
  ];
}

export default function Blog() {
  const [posts, setPosts] = useState<GhostPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load posts"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <section className="border-b border-slate-200/80 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-6 pt-12 pb-10 md:pt-16 md:pb-14">
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-[#0B1B3A] transition-colors">Home</Link>
              <span aria-hidden>/</span>
              <span className="text-[#0B1B3A] font-medium">Blog</span>
            </nav>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0B1B3A] tracking-tight">
                  Blog
                </h1>
                <div className="mt-2 w-16 h-1 rounded-full bg-[#FF4D6D]" />
                <p className="mt-5 text-slate-600 text-lg max-w-2xl">
                  Updates on visit visas, immigration, and visa guidance.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            {loading && (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-[#0B1B3A]" />
              </div>
            )}
            {error && (
              <div className="text-center py-20 rounded-2xl border border-slate-200 bg-slate-50/50 p-8">
                <p className="text-red-600 mb-4">{error}</p>
                <p className="text-slate-500 text-sm">
                  Ensure VITE_GHOST_URL and VITE_GHOST_CONTENT_API_KEY are set in .env (see README for Ghost setup).
                </p>
              </div>
            )}
            {!loading && !error && posts.length === 0 && (
              <div className="text-center py-20 text-slate-600 rounded-2xl border border-slate-200 bg-slate-50/50 p-8">
                <p>No posts yet. Add posts in your Ghost admin to see them here.</p>
                <p className="mt-2 text-sm">Create a Custom Integration in Ghost Admin and set the Content API key in .env.</p>
              </div>
            )}
            {!loading && !error && posts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => {
                  const coverUrl = getCoverImageUrl(post);
                  const coverAlt = getCoverImageAlt(post);
                  return (
                    <Link
                      key={post.id}
                      to={`/immigration/blog/${post.slug}`}
                      className="group block rounded-2xl overflow-hidden border border-slate-200/80 bg-white shadow-sm hover:border-[#FF4D6D]/30 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="aspect-video bg-slate-100 overflow-hidden">
                        <img
                          src={coverUrl}
                          alt={coverAlt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-5 md:p-6">
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                          <Calendar className="w-4 h-4" />
                          {post.published_at
                            ? new Date(post.published_at).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : ""}
                        </div>
                        <h2 className="text-xl font-bold text-[#0B1B3A] group-hover:text-[#FF4D6D] transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="mt-2 text-slate-600 text-sm line-clamp-2 leading-relaxed">{post.excerpt}</p>
                        )}
                        <span className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-[#FF4D6D]">
                          Read more
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
