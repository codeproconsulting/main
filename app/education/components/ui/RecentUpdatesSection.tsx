"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight, Loader2 } from "lucide-react";
import { getRecentPosts, getCoverImageUrl, getCoverImageAlt, type Post } from "~/education/lib/ghost-api";

const RECENT_COUNT = 3;
const NAVY = "#0B1B3A";
const PINK = "#FF4D6D";

export function RecentUpdatesSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await getRecentPosts(RECENT_COUNT);
        setPosts(posts);
      } catch (err) {
        console.error("Error fetching blog posts:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const displayPosts = error || posts.length === 0 ? DUMMY_POSTS.slice(0, RECENT_COUNT) : posts;
  const isGhost = !error && posts.length > 0;

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header: left branding + title, right button */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1.5" aria-hidden>
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PINK }} />
                <span className="w-6 h-2 rounded-full bg-[#0B1B3A]" />
              </span>
              <span className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                News & Blog
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0B1B3A] leading-tight">
              Our Latest
              <br />
              News & Blog
            </h2>
          </div>
          <div className="shrink-0">
            <Link
              to="/education/blog"
              className="inline-flex items-center gap-2 bg-[#0B1B3A] text-white px-6 py-3.5 rounded-xl font-bold text-base hover:bg-[#0B1B3A]/90 transition-colors shadow-lg"
            >
              View All Blogs
              <ArrowRight className="w-5 h-5" style={{ color: PINK }} />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-white" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {displayPosts.map((post) => {
              const title = isGhost ? (post as Post).title : (post as DummyPost).title;
              const description = isGhost
                ? ((post as Post).excerpt ?? "").slice(0, 120) + "..."
                : (post as DummyPost).excerpt;
              const imageUrl = isGhost
                ? getCoverImageUrl(post as Post)
                : (post as DummyPost).imageUrl;
              const category = (post as DummyPost).category ?? "Study Abroad";
              const href = isGhost ? `/blog/${(post as Post).slug}` : (post as DummyPost).link;
              const isExternal = !isGhost;
              const titleDisplay = title.length > 50 ? title.slice(0, 50) + "..." : title;

              return (
                <div
                  key={post.id}
                  className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col bg-white border border-slate-200"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-t-2xl">
                    <img
                      src={imageUrl}
                      alt={isGhost ? getCoverImageAlt(post as Post) : title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-5 md:p-6 flex flex-col flex-grow">
                    <span
                      className="inline-block w-fit text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-lg mb-3 text-white"
                      style={{ backgroundColor: PINK }}
                    >
                      {category}
                    </span>
                    <h3 className="text-lg md:text-xl font-bold text-[#0B1B3A] mb-2 leading-tight line-clamp-2">
                      {titleDisplay}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed flex-grow line-clamp-3 mb-4">
                      {description}
                    </p>
                    {isExternal ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-bold text-sm text-[#0B1B3A] hover:text-[#FF4D6D] transition-colors w-fit"
                      >
                        Read more
                        <ArrowRight className="w-4 h-4" style={{ color: PINK }} />
                      </a>
                    ) : (
                      <Link
                        to={href}
                        className="inline-flex items-center gap-1.5 font-bold text-sm text-[#0B1B3A] hover:text-[#FF4D6D] transition-colors w-fit"
                      >
                        Read more
                        <ArrowRight className="w-4 h-4" style={{ color: PINK }} />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

interface DummyPost {
  id: number;
  title: string;
  excerpt: string;
  link: string;
  imageUrl: string;
  category: string;
}

const DUMMY_POSTS: DummyPost[] = [
  {
    id: 101,
    title: "Ulster University",
    excerpt: "Applications open for May 2026 Intake! Globally recognized degrees and industry-focused programs.",
    link: "#",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000&auto=format&fit=crop",
    category: "Study in the UK",
  },
  {
    id: 102,
    title: "University of Law",
    excerpt: "Scholarships available for high achievers. Join one of the UK's longest-established specialist providers of legal education.",
    link: "#",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000&auto=format&fit=crop",
    category: "Study in the UK",
  },
  {
    id: 103,
    title: "Visa Updates 2026",
    excerpt: "New immigration policies announced for international students regarding post-study work visas.",
    link: "#",
    imageUrl: "https://images.unsplash.com/photo-1569098644584-210bcd375b59?q=80&w=1000&auto=format&fit=crop",
    category: "Immigration News",
  },
  {
    id: 104,
    title: "Canada Study Permit",
    excerpt: "Step-by-step guide to applying for your Canadian study permit and Provincial Attestation Letters.",
    link: "#",
    imageUrl: "https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=1000&auto=format&fit=crop",
    category: "Study in Canada",
  },
];
