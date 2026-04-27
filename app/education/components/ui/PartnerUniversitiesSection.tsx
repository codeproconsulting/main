"use client";

import { Link } from "react-router";
import { GraduationCap, ArrowRight } from "lucide-react";
import { universitiesForHome } from "~/education/lib/universities";

const BRAND = { navy: "#0B1B3A", pink: "#FF4D6D", pinkDark: "#E11D48" };

export function PartnerUniversitiesSection() {
  const strip = [...universitiesForHome, ...universitiesForHome];

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 md:mb-14">
          <div className="flex items-start gap-4">
            <div
              className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-white"
              style={{
                background: `linear-gradient(135deg, ${BRAND.pink}, ${BRAND.pinkDark})`,
                boxShadow: "0 8px 24px -4px rgba(255, 77, 109, 0.35)",
              }}
            >
              <GraduationCap className="w-7 h-7" strokeWidth={2} />
            </div>
            <div>
              <h2
                className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight max-w-2xl"
                style={{ color: BRAND.navy }}
              >
                Trusted Representative of{" "}
                <span style={{ color: BRAND.pink }}>250+ Universities</span> Around the World!
              </h2>
            </div>
          </div>
          <Link
            to="/education/universities"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shrink-0 transition-all hover:opacity-95"
            style={{ backgroundColor: BRAND.pink }}
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Auto-scrolling logo strip – infinite loop */}
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
      </div>
    </section>
  );
}
