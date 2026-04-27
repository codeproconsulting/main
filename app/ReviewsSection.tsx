"use client";

import { useEffect, useState } from "react";

type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
};

const STATIC_REVIEWS: Review[] = [
  {
    id: "1",
    name: "Google Reviewer",
    rating: 5,
    comment:
      "ProConsulting guided me from shortlisting universities to submitting my visa application. The team was professional and very responsive throughout.",
    date: "2024-06-12",
  },
  {
    id: "2",
    name: "International Student",
    rating: 5,
    comment:
      "Clear advice on both education and immigration options. They explained complex rules in a very simple way and helped me avoid common mistakes.",
    date: "2024-03-20",
  },
  {
    id: "3",
    name: "Family Client",
    rating: 5,
    comment:
      "We used ProConsulting for both study and later immigration planning. It was reassuring to have one team looking at the full journey.",
    date: "2023-11-05",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={`h-4 w-4 shrink-0 ${
            i <= rating ? "fill-amber-500 text-amber-500" : "fill-slate-200 text-white"
          }`}
        >
          <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.788 1.402 8.172L12 18.896l-7.336 3.874 1.402-8.172L.132 9.21l8.2-1.192z" />
        </svg>
      ))}
    </div>
  );
}

function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return date.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

export function ReviewsSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % STATIC_REVIEWS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const current = STATIC_REVIEWS[index];

  return (
    <section className="border-t border-slate-200 bg-slate-50/70">
      <div className="mx-auto max-w-5xl px-4 py-16 md:py-20">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-600 mb-2">
            Google reviews
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
            What our clients say
          </h2>
          <p className="text-sm text-slate-600 md:text-base">
            Feedback from students and families we’ve helped with study abroad and immigration
            planning.
          </p>
        </div>

        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">{current.name}</p>
              <p className="text-xs text-slate-500">{formatRelativeDate(current.date)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Stars rating={current.rating} />
              <span className="text-sm font-semibold text-slate-900">5.0</span>
              <span className="text-xs text-slate-500">Google rating (sample)</span>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-700">{current.comment}</p>
        </div>
      </div>
    </section>
  );
}

