"use client";

import { Link } from "react-router";
import { Navbar } from "~/immigration/components/ui/Navbar";
import { Footer } from "~/immigration/components/ui/footer";
import { services } from "~/immigration/lib/servicesData";
import { ArrowRight, FileCheck2, Gavel, Plane, Users } from "lucide-react";
import type { Route } from "./+types/services";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Services – ProConsulting Immigration" },
    { name: "description", content: "Visit visas, family reunion, immigration routes, and visa appeals." },
  ];
}

const BRAND = { navy: "#0B1B3A", pink: "#FF4D6D", pinkDark: "#E11D48" };

const iconBySlug: Record<string, typeof Plane> = {
  "visit-visa": Plane,
  "family-reunion": Users,
  immigration: FileCheck2,
  "visa-appeal": Gavel,
};

export default function Services() {
  return (
    <>
      <Navbar />

      {/* Title area – light header (education-style) */}
      <section className="border-b border-slate-200/80 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-10 md:pt-16 md:pb-14">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#0B1B3A] transition-colors">Home</Link>
            <span aria-hidden>/</span>
            <span className="text-[#0B1B3A] font-medium">Services</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0B1B3A] tracking-tight">
                Our Services
              </h1>
              <div className="mt-2 w-16 h-1 rounded-full" style={{ backgroundColor: BRAND.pink }} />
              <p className="mt-5 text-slate-600 text-lg max-w-2xl">
                Visit visas, family reunion, immigration routes, and appeals — practical guidance from eligibility to submission.
              </p>
            </div>
            <Link
              to="/immigration/contact"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white shrink-0 transition-all hover:opacity-95"
              style={{ backgroundColor: BRAND.pink }}
            >
              Get in touch
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Service cards (richer + with text) */}
      <section className="relative py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {services.map((service, index) => {
              const Icon = iconBySlug[service.slug] ?? Plane;
              return (
                <Link
                  key={service.slug}
                  to={`/immigration/services/${service.slug}`}
                  className="group block relative rounded-3xl overflow-hidden transition-all duration-300 h-full min-h-[280px] flex flex-col p-6 md:p-8 border border-slate-200/80 bg-white hover:border-[#FF4D6D]/30 hover:shadow-xl hover:shadow-[#FF4D6D]/10"
                >
                  <span
                    className="absolute bottom-4 right-6 text-[6rem] md:text-[7rem] font-bold leading-none select-none text-white"
                    aria-hidden
                  >
                    {index + 1}
                  </span>
                  <div
                    className="absolute top-5 right-5 w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-transform duration-300 group-hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${BRAND.pink}, ${BRAND.pinkDark})`,
                      boxShadow: "0 4px 14px rgba(255,77,109,0.35)",
                    }}
                  >
                    <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                  </div>
                  <div className="relative z-10 flex flex-col flex-1 pt-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-2">
                      {service.tag}
                    </p>
                    <h2 className="text-xl md:text-2xl font-bold mb-3 pr-16 text-[#0B1B3A] group-hover:text-[#FF4D6D] transition-colors">
                      {service.title}
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed flex-1 mb-6 max-w-md">
                      {service.description}
                    </p>
                    <span
                      className="inline-flex items-center gap-2 w-fit rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 group-hover:gap-3 group-hover:shadow-md text-white"
                      style={{ backgroundColor: BRAND.navy }}
                    >
                      Learn more
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="relative py-12 md:py-16 bg-[#0B1B3A] text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-white mb-4">Not sure which service you need?</p>
          <Link
            to="/immigration/contact"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-[#0B1B3A] bg-white hover:bg-slate-100 transition-colors"
          >
            Get a free consultation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
