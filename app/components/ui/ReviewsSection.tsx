"use client";

import { useState, useEffect } from "react";
import {
  FaStar,
  FaSpinner,
  FaArrowUpRightFromSquare,
  FaCertificate
} from 'react-icons/fa6';
import {
  getFeaturableReviews,
  getGoogleMapsReviewsUrl,
  type FeaturableWidgetResponse,
  type FeaturableReview,
} from "../../lib/featurable-reviews";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <FaStar
          key={i}
          className={`h-4 w-4 shrink-0 ${
            i <= rating ? "fill-amber-500 text-amber-500" : "fill-slate-200 text-white"
          }`}
        />
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

function ReviewCard({
  review,
  profileUrl,
}: {
  review: FeaturableReview;
  profileUrl: string | undefined;
}) {
  const [imgError, setImgError] = useState(false);
  const showPhoto = review.reviewer.profilePhotoUrl && !imgError;
  const maxChars = 200;
  const comment =
    review.comment.length > maxChars ? review.comment.slice(0, maxChars).trim() + "…" : review.comment;
  const viewReviewsUrl = getGoogleMapsReviewsUrl(profileUrl);
  const nameBlock = viewReviewsUrl ? (
    <a
      href={viewReviewsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 font-semibold text-[#0B1B3A] hover:text-[#FF4D6D] transition-colors rounded"
    >
      {review.reviewer.displayName}
      <FaCertificate className="h-4 w-4 shrink-0 text-emerald-600" aria-label="Verified" />
      <FaArrowUpRightFromSquare className="h-3.5 w-3.5 shrink-0 text-white" />
    </a>
  ) : (
    <span className="inline-flex items-center gap-1.5 font-semibold text-[#0B1B3A]">
      {review.reviewer.displayName}
      <FaCertificate className="h-4 w-4 shrink-0 text-emerald-600" aria-label="Verified" />
    </span>
  );

  return (
    <div className="rounded-xl bg-white p-4 shadow-[0_1px_6px_rgba(32,33,36,0.28)] hover:shadow-[0_1px_12px_rgba(32,33,36,0.28)] transition-shadow h-full flex flex-col">
      <div className="flex items-start gap-3">
        {showPhoto ? (
          <img
            src={review.reviewer.profilePhotoUrl}
            alt=""
            className="h-9 w-9 rounded-full object-cover shrink-0"
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs font-medium shrink-0">
            {(review.reviewer.displayName || "?").slice(0, 1)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {nameBlock}
            <span className="text-slate-500 text-xs">{formatRelativeDate(review.createTime)}</span>
          </div>
          <div className="mt-1">
            <Stars rating={review.starRating} />
          </div>
        </div>
      </div>
      <p className="mt-3 text-[#202124] text-sm leading-relaxed flex-1">{comment}</p>
    </div>
  );
}

export function ReviewsSection() {
  const [data, setData] = useState<FeaturableWidgetResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    getFeaturableReviews().then(setData).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!carouselApi) return;
    const interval = setInterval(() => carouselApi.scrollNext(), 5000);
    return () => clearInterval(interval);
  }, [carouselApi]);

  if (loading) {
    return (
      <section className="py-16 md:py-20 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center py-20">
            <FaSpinner className="w-10 h-10 animate-spin text-[#FF4D6D]" />
          </div>
        </div>
      </section>
    );
  }

  if (!data || !data.reviews?.length) return null;

  const reviews = data.reviews;
  const profileUrl = data.profileUrl;

  return (
    <section className="py-16 md:py-20 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B1B3A] tracking-tight mb-2">
            What our clients say
          </h2>
          <p className="text-slate-600 text-lg mb-6">
            Real feedback from students and families we’ve helped with admissions and visas.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <Stars rating={Math.round(data.averageRating)} />
              <span className="font-bold text-[#0B1B3A]">{data.averageRating.toFixed(1)}</span>
            </div>
            <span className="text-slate-500">{data.totalReviewCount} Google reviews</span>
            {profileUrl && (
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#FF4D6D] hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF4D6D]/50"
              >
                Write a review
                <FaArrowUpRightFromSquare className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
        <div className="relative">
          <Carousel setApi={setCarouselApi} opts={{ loop: true, align: "start", slidesToScroll: 1 }} className="w-full">
            <CarouselContent className="-ml-4">
              {reviews.map((review) => (
                <CarouselItem key={review.reviewId} className="pl-4 basis-full sm:basis-2/3 md:basis-1/2 lg:basis-1/3">
                  <ReviewCard review={review} profileUrl={profileUrl} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 md:-left-12" />
            <CarouselNext className="right-0 md:-right-12" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
