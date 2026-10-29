import { BlogRouteError } from "~/components/ui/BlogRouteError";
"use client";

import { Link, useLoaderData } from "react-router";
import { Navbar } from "~/immigration/components/ui/Navbar";
import { Footer } from "~/immigration/components/ui/footer";
import { normalize, getCoverImageUrl, getCoverImageAlt, getPrimaryAuthorName, type GhostPost } from "~/immigration/lib/ghost-api";
import { GhostHtmlContent } from "~/immigration/components/ui/GhostHtmlContent";
import type { LoaderFunctionArgs } from "react-router";
import { loadArticle } from "~/lib/blog-loaders.server";
import { ArrowLeft, Loader2 } from "lucide-react";

export async function loader({ params }: LoaderFunctionArgs) {
  return { post: normalize(await loadArticle("immigration", params.slug)) };
}

export function meta({ data }: { data?: { post: GhostPost } }) {
  if (!data?.post) return [{ title: "Article unavailable | ProConsulting Immigration" }];
  const post = data.post;
  return [
    { title: `${post.meta_title || post.title} | ProConsulting Immigration` },
    { name: "description", content: post.meta_description || post.excerpt },
    { property: "og:type", content: "article" },
    { property: "og:title", content: post.meta_title || post.title },
    { property: "og:image", content: getCoverImageUrl(post) },
    { tagName: "link", rel: "canonical", href: `https://proconsulting.uk/immigration/blog/${post.slug}` },
  ];
}

export default function BlogPost() {
  const { post } = useLoaderData<typeof loader>();

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
              {/* Metadata block removed */}
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

export function ErrorBoundary() { return <BlogRouteError section="immigration"/>; }
