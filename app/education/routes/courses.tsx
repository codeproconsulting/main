"use client";

import { Link } from "react-router";
import { Navbar } from "~/education/components/ui/Navbar";
import { Footer } from "~/education/components/ui/footer";
import { courses } from "~/education/lib/courses";
import { BookOpen, ArrowRight } from "lucide-react";
import type { Route } from "./+types/courses";
import { pageMeta, canonicalLink } from "~/education/lib/seo";

const BRAND = {
  navy: "#0B1B3A",
  pink: "#FF4D6D",
  pinkLight: "#FB7185",
  pinkDark: "#E11D48",
};

const TITLE = "Popular Courses | ProConsulting";
const DESCRIPTION =
  "Explore popular courses: Computer Science, Engineering, Health, Law, Project Management, Hospitality, Finance, and more. Find the right program for your study abroad journey.";

export function meta(args: Route.MetaArgs) {
  const pathname = args?.location?.pathname ?? "/education/courses";
  return [
    { title: TITLE },
    { name: "description", content: DESCRIPTION },
    ...pageMeta({ title: TITLE, description: DESCRIPTION, pathname }),
  ];
}

export function links(args: Route.LinksArgs) {
  return canonicalLink(args?.location?.pathname ?? "/education/courses");
}

export default function Courses() {
  return (
    <>
      <Navbar />

      {/* Title area – light header */}
      <section className="border-b border-slate-200/80 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-10 md:pt-16 md:pb-14">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#0B1B3A] transition-colors">Home</Link>
            <span aria-hidden>/</span>
            <span className="text-[#0B1B3A] font-medium">Courses</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3" style={{ color: BRAND.pink }}>
                <BookOpen className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">Study Areas</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0B1B3A] tracking-tight">
                All courses
              </h1>
              <div className="mt-2 w-16 h-1 rounded-full" style={{ backgroundColor: BRAND.pink }} />
              <p className="mt-5 text-slate-600 text-lg max-w-2xl leading-relaxed">
                Browse every field we support. We’ll match you with the right program and guide you through applications.
              </p>
            </div>
            <Link
              to="/education/contact"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white shrink-0 hover:opacity-95 transition-opacity"
              style={{ backgroundColor: BRAND.pink }}
            >
              Get in touch
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Courses grid — navy bg, brand accent */}
      <section
        className="relative py-20 md:py-28 overflow-hidden"
        style={{ backgroundColor: BRAND.navy }}
      >
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"
          aria-hidden
        />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {courses.map((course) => {
              const Icon = course.icon;
              return (
                <Link
                  key={course.slug}
                  to={`/education/courses/${course.slug}`}
                  className="group relative flex flex-col p-6 rounded-2xl bg-white/[0.04] border border-white/10 overflow-hidden transition-all duration-500 hover:bg-white/[0.08] hover:border-[#FF4D6D]/30 hover:shadow-2xl hover:shadow-[#FF4D6D]/5 hover:-translate-y-2"
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"
                    style={{
                      background: `linear-gradient(to right, ${BRAND.pink}, ${BRAND.pinkDark})`,
                    }}
                  />
                  <div className="relative w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-5 group-hover:bg-[#FF4D6D]/20 transition-all duration-300 group-hover:scale-110">
                    <Icon className="w-8 h-8 text-gray-400 group-hover:text-white transition-colors" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#FF4D6D] transition-colors duration-300">
                    {course.name}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-grow mb-5">
                    {course.description}
                  </p>
                  <span
                    className="inline-flex items-center gap-2 text-sm font-semibold opacity-80 group-hover:opacity-100 group-hover:gap-3 transition-all duration-300"
                    style={{ color: BRAND.pink }}
                  >
                    View details
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA — compact, split layout */}
      <section className="py-10 md:py-12 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur p-5 md:p-7 shadow-sm relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(255,77,109,0.18),transparent_60%)]" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl border border-slate-200/80 flex items-center justify-center bg-[#FF4D6D]/5 shrink-0">
                  <BookOpen className="w-6 h-6" style={{ color: BRAND.pink }} />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-[#0B1B3A]">
                    Ready to apply?
                  </h2>
                  <p className="mt-1 text-slate-600 text-sm md:text-base max-w-2xl">
                    Tell us your course and destination — we’ll guide applications and visas.
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
