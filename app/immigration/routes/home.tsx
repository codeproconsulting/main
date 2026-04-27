"use client";

import { Link } from "react-router";
import { Navbar } from "~/immigration/components/ui/Navbar";
import { Footer } from "~/immigration/components/ui/footer";
import { Hero } from "~/immigration/components/ui/heroImage";
import { VisitVisaDestinationsSection } from "~/immigration/components/ui/VisitVisaDestinationsSection";
import { FAQSection } from "~/immigration/components/ui/FAQSection";
import { ReviewsSection } from "~/immigration/components/ui/ReviewsSection";
import { immigrationServices } from "~/immigration/lib/services";
import { ArrowRight, Briefcase, FileCheck2, Gavel, Plane, Users } from "lucide-react";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ProConsulting Immigration" },
    { name: "description", content: "Expert immigration and visa services – proconsulting.uk/immigration" },
  ];
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />

        {/* Immigration Services */}
        <section className="relative py-18 md:py-24 overflow-hidden bg-white border-b border-slate-200/80">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(255,77,109,0.10), transparent 60%)",
            }}
            aria-hidden
          />
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-10 md:mb-12">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full text-white"
                    style={{ background: "linear-gradient(135deg, #FF4D6D, #E11D48)" }}
                  >
                    <Briefcase className="h-4 w-4" />
                  </span>
                  Immigration services
                </div>
                <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-bold text-[#0B1B3A] tracking-tight">
                  Everything you need for a strong visa application
                </h2>
                <p className="mt-4 text-slate-600 text-lg leading-relaxed">
                  Clear guidance, the right documents, and a well-structured application—tailored to your destination and purpose.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 lg:justify-end">
                <Link
                  to="/immigration/services"
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:opacity-95"
                  style={{ backgroundColor: "#FF4D6D" }}
                >
                  Browse all services
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/immigration/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-[#0B1B3A] border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                >
                  Free consultation
                  <ArrowRight className="w-4 h-4 text-[#FF4D6D]" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {immigrationServices.map((s, index) => {
                const icon =
                  s.id === "visit"
                    ? Plane
                    : s.id === "family"
                      ? Users
                      : s.id === "immigration"
                        ? FileCheck2
                        : Gavel;
                const Icon = icon;
                const desc =
                  s.id === "visit"
                    ? "Tourism, business, family visits—end-to-end support for your visit visa."
                    : s.id === "family"
                      ? "Reunite with loved ones with a well-prepared and compliant application."
                      : s.id === "immigration"
                        ? "Guidance for immigration routes, eligibility, and document strategy."
                        : "Appeals and reviews—strong representations based on refusal reasons.";

                return (
                  <Link
                    key={s.id}
                    to={s.link}
                    className="group relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-[#FF4D6D]/30"
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(145deg, rgba(255,77,109,0.10), transparent 45%, rgba(11,27,58,0.02))",
                      }}
                      aria-hidden
                    />

                    <div className="relative">
                      <div className="flex items-start justify-between gap-4">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-md"
                          style={{ background: "linear-gradient(135deg, #FF4D6D, #E11D48)" }}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-semibold text-white">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <h3 className="mt-5 text-xl font-bold text-[#0B1B3A] group-hover:text-[#FF4D6D] transition-colors">
                        {s.title}
                      </h3>
                      <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-3">
                        {desc}
                      </p>

                      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#FF4D6D]">
                        Learn more
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <VisitVisaDestinationsSection />

        <ReviewsSection />

        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
