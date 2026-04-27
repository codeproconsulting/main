"use client";

import { useState, useEffect } from "react";
import { FaArrowRightLong, FaSpinner } from 'react-icons/fa6';
import { getRecentPosts, getCoverImageUrl, getCoverImageAlt, type Post } from "../../lib/ghost-api";
import { BRAND } from "../../lib/constants";

const RECENT_COUNT = 3;
const BLOG_BASE = "/education/blog";

export function BlogPreview() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getRecentPosts(RECENT_COUNT).then(setPosts).catch(() => setError(true)).finally(() => setLoading(false));
  }, []);

  const displayPosts = error || posts.length === 0 ? [] : posts;

  return (
    <section className="py-16 md:py-24 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B1B3A] tracking-tight">
            Latest from Our Blog
          </h2>
          <a
            href={BLOG_BASE}
            className="inline-flex items-center gap-2 text-sm font-semibold hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF4D6D]/50"
            style={{ color: BRAND.pink }}
          >
            View All Posts
            <FaArrowRightLong className="w-4 h-4" />
          </a>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <FaSpinner className="w-10 h-10 animate-spin text-white" />
          </div>
        ) : displayPosts.length === 0 ? (
          <p className="text-slate-600 text-center py-8">No posts available. Visit our blog for the latest updates.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {displayPosts.map((post) => (
              <a
                key={post.id}
                href={`${BLOG_BASE}/${post.slug}`}
                className="group rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0B1B3A]/40"
              >
                <div className="aspect-video bg-slate-100 overflow-hidden">
                  <img
                    src={getCoverImageUrl(post)}
                    alt={getCoverImageAlt(post)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs text-slate-500 mb-1">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-GB", { dateStyle: "medium" }) : ""}
                  </p>
                  <h3 className="text-lg font-bold text-[#0B1B3A] group-hover:text-[#FF4D6D] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 line-clamp-2">{post.excerpt ?? ""}</p>
                  <span className="inline-flex items-center gap-1 mt-3 text-sm font-semibold" style={{ color: BRAND.pink }}>
                    Read More
                    <FaArrowRightLong className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
