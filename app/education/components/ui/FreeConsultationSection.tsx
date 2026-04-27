"use client";

import { Link } from "react-router";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";

const BRAND = { navy: "#0B1B3A", pink: "#FF4D6D", pinkDark: "#E11D48" };

export function FreeConsultationSection() {
  return (
    <section className="py-16 md:py-24 bg-slate-50/50 border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto px-6">
        <div
          className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        >
          {/* subtle background */}
          <div
            className="absolute inset-0 opacity-60 pointer-events-none"
            style={{
              background:
                "radial-gradient(800px 300px at 20% 0%, rgba(255,77,109,0.16), transparent 60%), radial-gradient(700px 280px at 90% 80%, rgba(11,27,58,0.10), transparent 60%)",
            }}
            aria-hidden
          />

          <div className="relative p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-md"
                  style={{ background: `linear-gradient(135deg, ${BRAND.pink}, ${BRAND.pinkDark})` }}
                >
                  <MessageCircle className="h-5 w-5" />
                </span>
                <p className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: BRAND.pink }}>
                  Free consultation
                </p>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: BRAND.navy }}>
                Get free consultation for your study abroad journey
              </h2>
              <p className="mt-4 text-slate-600 text-lg leading-relaxed max-w-2xl">
                Tell us your goals and we’ll recommend the best destinations, courses, and next steps—based on your profile and budget.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                <Feature>University & course shortlisting</Feature>
                <Feature>Admission guidance & SOP review</Feature>
                <Feature>Visa process roadmap</Feature>
                <Feature>Interview & test prep advice</Feature>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div
                className="rounded-2xl p-7 md:p-8 text-white"
                style={{ background: `linear-gradient(135deg, ${BRAND.navy}, #162d4d)` }}
              >
                <p className="text-white/80 text-sm mb-2">Ready to start?</p>
                <p className="text-xl font-bold mb-5">Book your free session</p>
                <Link
                  to="/education/contact"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-bold text-white transition-all hover:opacity-95"
                  style={{ backgroundColor: BRAND.pink }}
                >
                  Get free consultation
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <p className="mt-4 text-white/70 text-xs leading-relaxed">
                  We’ll respond as soon as possible with the best plan for you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2 className="h-5 w-5 text-[#FF4D6D] mt-0.5 shrink-0" />
      <span className="text-sm font-medium leading-relaxed">{children}</span>
    </div>
  );
}

