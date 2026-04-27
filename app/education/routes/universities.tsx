"use client";

import { Link } from "react-router";
import { Navbar } from "~/education/components/ui/Navbar";
import { Footer } from "~/education/components/ui/footer";
import { universities } from "~/education/lib/universities";
import { ArrowRight } from "lucide-react";
import type { Route } from "./+types/universities";
import { pageMeta, canonicalLink } from "~/education/lib/seo";

const BRAND = { navy: "#0B1B3A", pink: "#FF4D6D" };

const TITLE = "Partner Universities | ProConsulting";
const DESCRIPTION =
  "We are trusted representatives of 250+ universities around the world. Explore a selection of our partner institutions.";

export function meta(args: Route.MetaArgs) {
  const pathname = args?.location?.pathname ?? "/education/universities";
  return [
    { title: TITLE },
    { name: "description", content: DESCRIPTION },
    ...pageMeta({ title: TITLE, description: DESCRIPTION, pathname }),
  ];
}

export function links(args: Route.LinksArgs) {
  return canonicalLink(args?.location?.pathname ?? "/education/universities");
}

export default function Universities() {
  return (
    <>
      <Navbar />

      <section className="relative py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
            <div>
              <h1
                className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
                style={{ color: BRAND.navy }}
              >
                Trusted Representative of{" "}
                <span style={{ color: BRAND.pink }}>250+ Universities</span> Around the World!
              </h1>
              <p className="mt-4 text-slate-600 max-w-2xl">
                We work with leading institutions worldwide. A selection of our partner universities is shown below.
              </p>
            </div>
            <Link
              to="/education/contact"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shrink-0"
              style={{ backgroundColor: BRAND.pink }}
            >
              Get in touch
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {universities.map((uni) => {
              const Wrapper = uni.website ? "a" : "div";
              const wrapperProps = uni.website
                ? { href: uni.website, target: "_blank", rel: "noopener noreferrer" }
                : {};
              return (
                <Wrapper
                  key={uni.number}
                  className={`flex flex-col items-center justify-center p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-[#FF4D6D]/30 hover:shadow-lg transition-all duration-300 min-h-[160px] ${uni.website ? "cursor-pointer" : ""}`}
                  title={uni.website ? `${uni.name} (opens in new tab)` : uni.name}
                  {...wrapperProps}
                >
                  <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center mb-3">
                    <img
                      src={uni.image}
                      alt={uni.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <p className="text-center text-sm font-semibold text-[#0B1B3A] leading-snug line-clamp-2">
                    {uni.name}
                  </p>
                </Wrapper>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
