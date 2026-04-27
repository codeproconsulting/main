"use client";

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Navbar } from "~/immigration/components/ui/Navbar";
import { Footer } from "~/immigration/components/ui/footer";
import { getPostBySlug, getCoverImageUrl, getCoverImageAlt, getPrimaryAuthorName, type GhostPost } from "~/immigration/lib/ghost-api";
import { GhostHtmlContent } from "~/immigration/components/ui/GhostHtmlContent";
import { ArrowLeft, Calendar, Loader2, User } from "lucide-react";

export function meta() {
  return [{ title: "Post | ProConsulting Immigration" }];
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<GhostPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    getPostBySlug(slug)
      .then(setPost)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load post"))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    const title = post.meta_title || post.title;
    document.title = `${title} | ProConsulting Immigration`;
    const desc = post.meta_description || post.excerpt;
    let metaEl = document.querySelector('meta[name="description"]');
    if (desc) {
      if (!metaEl) {
        metaEl = document.createElement("meta");
        metaEl.setAttribute("name", "description");
        document.head.appendChild(metaEl);
      }
      metaEl.setAttribute("content", desc);
    }
    return () => {
      document.title = "ProConsulting Immigration";
    };
  }, [post]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#0B1B3A]" />
        </div>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen border-b border-slate-200/80 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-6 pt-12 pb-10 md:pt-16 md:pb-14">
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-[#0B1B3A] transition-colors">Home</Link>
              <span aria-hidden>/</span>
              <Link to="/immigration/blog" className="hover:text-[#0B1B3A] transition-colors">Blog</Link>
              <span aria-hidden>/</span>
              <span className="text-slate-500">Post not found</span>
            </nav>
            <p className="text-red-600 mb-4">{error ?? "Post not found"}</p>
            <Link to="/immigration/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#FF4D6D] font-medium transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to blog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";
  const coverUrl = getCoverImageUrl(post);
  const coverAlt = getCoverImageAlt(post);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <article>
          <section className="border-b border-slate-200/80 bg-slate-50/50">
            <div className="max-w-4xl mx-auto px-6 pt-12 pb-10 md:pt-16 md:pb-14">
              <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
                <Link to="/" className="hover:text-[#0B1B3A] transition-colors">Home</Link>
                <span aria-hidden>/</span>
                <Link to="/immigration/blog" className="hover:text-[#0B1B3A] transition-colors">Blog</Link>
                <span aria-hidden>/</span>
                <span className="text-[#0B1B3A] font-medium line-clamp-1">{post.title}</span>
              </nav>
              <Link
                to="/immigration/blog"
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#FF4D6D] mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to blog
              </Link>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#0B1B3A]">
                {post.title}
              </h1>
              <div className="mt-2 w-16 h-1 rounded-full bg-[#FF4D6D]" />
              <div className="flex flex-wrap items-center gap-4 mt-4 text-slate-600 text-sm">
                {publishedDate && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" /> {publishedDate}
                  </span>
                )}
                {getPrimaryAuthorName(post) && (
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4" /> {getPrimaryAuthorName(post)}
                  </span>
                )}
              </div>
            </div>
          </section>

          <div className="max-w-4xl mx-auto px-6 py-10 md:py-12">
            <img
              src={coverUrl}
              alt={coverAlt}
              className="w-full rounded-2xl shadow-lg object-cover max-h-[450px] mb-10"
            />
          </div>

          <div className="max-w-3xl mx-auto px-6 pb-16 md:pb-20">
            {post.excerpt && (
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">{post.excerpt}</p>
            )}
            <div className="prose prose-slate prose-lg max-w-none prose-headings:text-[#0B1B3A] prose-a:text-[#FF4D6D] prose-a:no-underline hover:prose-a:underline">
              <GhostHtmlContent html={post.html} />
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
