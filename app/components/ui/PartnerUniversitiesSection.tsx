"use client";

import { universitiesForHome } from "../../lib/universities";
import { EDUCATION_URL } from "../../lib/constants";
import { BRAND } from "../../lib/constants";

export function PartnerUniversitiesSection() {
  const strip = [...universitiesForHome, ...universitiesForHome];

  return (
    <section
      aria-label="Study Abroad Services – Partner Universities"
      className="relative py-16 md:py-24 overflow-hidden bg-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-14">
          <div className="inline-flex items-center gap-3 mb-5">
            <span
              className="h-px w-8 rounded-full"
              style={{ backgroundColor: BRAND.pink }}
              aria-hidden
            />
            <span
              className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500"
            >
              Study Abroad Services
            </span>
            <span
              className="h-px w-8 rounded-full"
              style={{ backgroundColor: BRAND.pink }}
              aria-hidden
            />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15] mb-4">
            Trusted by Students Placed at{" "}
            <span className="font-extrabold" style={{ color: BRAND.pink }}>250+ Universities</span>{" "}
            Worldwide
          </h2>
          <p className="text-lg text-slate-600 font-medium">
            Partner institutions across the UK, Europe, Australia, Canada & beyond
          </p>
        </div>
        <div className="relative -mx-6 overflow-hidden">
          <div className="flex w-max animate-university-scroll">
            {strip.map((uni, i) => (
              <div
                key={`${uni.number}-${i}`}
                className="flex-shrink-0 w-[180px] md:w-[200px] h-[100px] md:h-[110px] flex items-center justify-center px-4 rounded-xl border border-slate-200/80 bg-white mx-2 overflow-hidden"
                title={uni.name}
              >
                <img
                  src={uni.image}
                  alt={uni.name}
                  className={`max-w-full w-auto h-auto object-contain ${uni.smallLogo ? "max-h-[88px] md:max-h-[96px] scale-110" : "max-h-[70px] md:max-h-[80px]"}`}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 text-center">
          <a
            href={`${EDUCATION_URL}/universities`}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0B1B3A]/40"
            style={{ backgroundColor: BRAND.pink }}
          >
            View all universities
          </a>
        </div>
      </div>
    </section>
  );
}
