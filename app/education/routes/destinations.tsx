"use client";

import { Link } from "react-router";
import { Navbar } from "~/education/components/ui/Navbar";
import { Footer } from "~/education/components/ui/footer";
import { destinations } from "~/education/lib/destinations";
import { Globe, GraduationCap, ArrowRight } from "lucide-react";
import type { Route } from "./+types/destinations";
import { pageMeta, canonicalLink } from "~/education/lib/seo";

const TITLE = "Study Destinations | ProConsulting";
const DESCRIPTION =
  "Explore study abroad destinations: UK, USA, Canada, Australia, New Zealand, France, Spain, Ireland, Germany, Dubai, and more. Expert guidance for your academic journey.";

export function meta(args: Route.MetaArgs) {
  const pathname = args?.location?.pathname ?? "/education/destinations";
  return [
    { title: TITLE },
    { name: "description", content: DESCRIPTION },
    ...pageMeta({ title: TITLE, description: DESCRIPTION, pathname }),
  ];
}

export function links(args: Route.LinksArgs) {
  return canonicalLink(args?.location?.pathname ?? "/education/destinations");
}

export default function Destinations() {
  return (
    <>
      <Navbar />

      {/* Title area – light header */}
      <section className="border-b border-slate-200/80 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-10 md:pt-16 md:pb-14">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <span aria-hidden>/</span>
            <span className="text-slate-900 font-medium">Study Destinations</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[#FF4D6D] mb-3">
                <Globe className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">Study Abroad</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
                Choose your destination
              </h1>
              <div className="mt-2 w-16 h-1 rounded-full bg-[#FF4D6D]" />
              <p className="mt-5 text-slate-600 text-lg max-w-2xl leading-relaxed">
                World-class universities, vibrant cultures, and life-changing experiences. We guide you from application to arrival.
              </p>
            </div>
            <Link
              to="/education/contact"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white shrink-0 bg-[#FF4D6D] hover:opacity-95 transition-opacity"
            >
              Get guidance
              <GraduationCap className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Intro strip */}
      <section className="relative py-12 md:py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              Where do you want to study?
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Each destination offers something unique—rankings, affordability, post-study work, or lifestyle. Explore the options below and find the best fit for your goals.
            </p>
          </div>
        </div>
      </section>

      {/* Destinations grid — image + text cards */}
      <section className="py-16 md:py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
            {destinations.map((d) => (
              <Link
                key={d.id}
                to={d.link}
                className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 hover:border-pink-100 transition-all duration-300"
              >
                {/* Image block */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                  {d.image ? (
                    <img
                      src={d.image}
                      alt={d.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                      <span className="text-white text-sm font-medium">Image coming soon</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 backdrop-blur text-xs font-semibold text-slate-700 shadow-sm">
                    {d.tag}
                  </span>
                  <span className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-xl md:text-2xl font-bold text-white drop-shadow-lg">
                    <img src={d.flagIcon} alt="" className="w-7 h-5 md:w-8 md:h-6 object-cover rounded shrink-0 shadow" />
                    {d.name}
                  </span>
                </div>
                {/* Text block */}
                <div className="p-6 md:p-7">
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-5 line-clamp-3">
                    {d.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-pink-600 font-semibold text-sm group-hover:gap-3 transition-all">
                    <img src={d.flagIcon} alt="" className="w-5 h-4 object-cover rounded shrink-0" />
                    Explore {d.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — compact split layout (matches other redesigned CTAs) */}
      <section className="relative py-10 md:py-12 overflow-hidden bg-slate-50 border-t border-slate-200/80">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(255,77,109,0.18),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur p-5 md:p-7 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl border border-slate-200/80 flex items-center justify-center bg-[#FF4D6D]/5 shrink-0">
                  <GraduationCap className="w-6 h-6 text-[#FF4D6D]" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-[#0B1B3A]">
                    Not sure where to study?
                  </h2>
                  <p className="mt-1 text-slate-600 text-sm md:text-base max-w-2xl">
                    We’ll help you compare destinations, courses, and costs so you can decide with confidence.
                  </p>
                </div>
              </div>

              <Link
                to="/education/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF4D6D] hover:opacity-95 text-white font-bold px-7 py-3 text-sm md:text-base transition-all shadow-md shadow-pink-500/20 whitespace-nowrap"
              >
                Get free consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
