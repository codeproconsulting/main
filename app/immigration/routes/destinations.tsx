"use client";

import { Link } from "react-router";
import { Navbar } from "~/immigration/components/ui/Navbar";
import { Footer } from "~/immigration/components/ui/footer";
import { destinations } from "~/immigration/lib/destinations";
import { MapPin } from "lucide-react";
import type { Route } from "./+types/destinations";

const BRAND = { pink: "#FF4D6D", navy: "#0B1B3A" };

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Visit Visa Destinations | ProConsulting Immigration" },
    {
      name: "description",
      content:
        "Explore visit visa requirements for the UK, Canada, Australia, USA, Europe, and more. Expert guidance for your trip.",
    },
  ];
}

export default function Destinations() {
  return (
    <>
      <Navbar />

      {/* Title area – same structure as education */}
      <section className="border-b border-slate-200/80 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-10 md:pt-16 md:pb-14">
          <nav
            className="flex items-center gap-2 text-sm text-slate-500 mb-6"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <span aria-hidden>/</span>
            <span className="text-slate-900 font-medium">Destinations</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div
                className="flex items-center gap-2 mb-3"
                style={{ color: BRAND.pink }}
              >
                <MapPin className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                  Visit visa
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
                Choose your destination
              </h1>
              <div
                className="mt-2 w-16 h-1 rounded-full"
                style={{ backgroundColor: BRAND.pink }}
              />
              <p className="mt-5 text-slate-600 text-lg max-w-2xl leading-relaxed">
                Whether you’re planning a vacation, visiting family, or
                travelling for business—we help you understand visit visa
                requirements and applications.
              </p>
            </div>
            <Link
              to="/immigration/contact"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white shrink-0 hover:opacity-95 transition-opacity"
              style={{ backgroundColor: BRAND.pink }}
            >
              Get guidance
              <MapPin className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Intro strip */}
      <section className="relative py-12 md:py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              Where do you want to go?
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Each destination has different visa types and requirements.
              Explore the options below and click through for details,
              eligibility, and how we can help.
            </p>
          </div>
        </div>
      </section>

      {/* Destinations grid — image + text cards, same as education */}
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
                  {"image" in d && d.image ? (
                    <img
                      src={d.image}
                      alt={d.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                      <img
                        src={(d as any).flagIcon}
                        alt=""
                        className="w-16 h-16 object-contain opacity-60"
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 backdrop-blur text-xs font-semibold text-slate-700 shadow-sm">
                    {d.tag}
                  </span>
                  <span className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-xl md:text-2xl font-bold text-white drop-shadow-lg">
                    <img
                      src={d.flagIcon}
                      alt=""
                      className="w-7 h-5 md:w-8 md:h-6 object-contain rounded shrink-0 shadow bg-white/90"
                    />
                    {d.name}
                  </span>
                </div>
                {/* Text block */}
                <div className="p-6 md:p-7">
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-5 line-clamp-3">
                    {d.description}
                  </p>
                  <span
                    className="inline-flex items-center gap-2 font-semibold text-sm group-hover:gap-3 transition-all"
                    style={{ color: BRAND.pink }}
                  >
                    <img
                      src={d.flagIcon}
                      alt=""
                      className="w-5 h-4 object-contain rounded shrink-0 bg-white/90"
                    />
                    Explore {d.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — same structure as education */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(255,77,109,0.15),transparent)]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <MapPin
            className="w-12 h-12 mb-6"
            style={{ color: BRAND.pink }}
          />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Not sure where to go?
          </h2>
          <p className="text-white text-lg max-w-lg mx-auto mb-10">
            Book a free consultation. We’ll help you compare destinations, visa
            types, and requirements so you can plan with confidence.
          </p>
          <Link
            to="/immigration/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full text-white font-bold text-lg px-10 py-4 shadow-lg transition-all hover:opacity-95"
            style={{
              backgroundColor: BRAND.pink,
              boxShadow: `0 10px 40px ${BRAND.pink}40`,
            }}
          >
            Get free consultation
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
