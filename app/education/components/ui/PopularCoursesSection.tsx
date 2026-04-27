"use client";

import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { popularCourses } from "~/education/lib/courses";

const BRAND = {
  navy: "#0B1B3A",
  pink: "#FF4D6D",
  pinkLight: "#FB7185",
  pinkDark: "#E11D48",
};

export function PopularCoursesSection() {
  const [featured, ...rest] = popularCourses;
  const FeaturedIcon = featured.icon;

  return (
    <section className="relative py-28 overflow-hidden" style={{ backgroundColor: BRAND.navy }}>
      {/* Subtle gradient orbs — brand pink only */}
      <div
        className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full blur-[120px] animate-float-soft pointer-events-none opacity-30"
        style={{ backgroundColor: BRAND.pink }}
      />
      <div
        className="absolute bottom-1/4 left-0 w-[400px] h-[400px] rounded-full blur-[100px] animate-float-soft-delay pointer-events-none opacity-20"
        style={{ backgroundColor: BRAND.pink }}
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"
        aria-hidden
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] mb-4" style={{ color: BRAND.pink }}>
              Study areas
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight max-w-2xl">
              Popular{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: `linear-gradient(to right, ${BRAND.pinkLight}, ${BRAND.pink})`,
                }}
              >
                courses
              </span>
            </h2>
            <p className="text-gray-400 text-lg mt-6 max-w-xl">
              From AI to Law and Health—we support your application across top universities worldwide.
            </p>
          </div>
          <Link
            to="/education/courses"
            className="group inline-flex items-center gap-2 rounded-full border-2 border-[#FF4D6D] bg-[#FF4D6D]/10 px-7 py-4 font-semibold text-white transition-all duration-300 hover:bg-[#FF4D6D] hover:text-white hover:shadow-lg shrink-0"
          >
            View all courses
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {/* Featured large card */}
          <Link
            to="/education/courses"
            className="group relative lg:col-span-2 lg:row-span-2 flex flex-col justify-between p-8 md:p-10 rounded-3xl bg-white/[0.04] border border-white/10 overflow-hidden transition-all duration-500 hover:bg-white/[0.08] hover:border-[#FF4D6D]/40 hover:shadow-2xl hover:shadow-[#FF4D6D]/10"
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `linear-gradient(135deg, rgba(255,77,109,0.08), transparent 50%, transparent)`,
              }}
            />
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-30 transition-opacity duration-700"
              style={{ backgroundColor: BRAND.pink }}
            />
            <div className="relative">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:scale-105 transition-transform duration-300"
                style={{ backgroundColor: BRAND.pink }}
              >
                <FeaturedIcon className="w-10 h-10 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:opacity-90 transition-opacity">
                {featured.name}
              </h3>
              <p className="text-gray-400 text-base md:text-lg max-w-md">
                {featured.description}
              </p>
            </div>
            <div className="relative mt-8 flex items-center gap-2 font-semibold" style={{ color: BRAND.pink }}>
              <span>Explore</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
            </div>
          </Link>

          {/* Rest of cards */}
          {rest.map((course) => {
            const Icon = course.icon;
            return (
              <Link
                key={course.id}
                to="/education/courses"
                className="group relative flex flex-col p-6 rounded-2xl bg-white/[0.04] border border-white/10 overflow-hidden transition-all duration-500 hover:bg-white/[0.08] hover:border-white/20 hover:shadow-xl hover:-translate-y-1"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(to right, ${BRAND.pink}, ${BRAND.pinkDark})`,
                  }}
                />
                <div className="relative w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-[#FF4D6D]/20 transition-colors duration-300">
                  <Icon className="w-7 h-7 text-gray-400 group-hover:text-white transition-colors" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-[#FF4D6D] transition-colors">
                  {course.name}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 flex-grow">{course.description}</p>
                <ArrowRight
                  className="w-5 h-5 mt-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                  style={{ color: BRAND.pink }}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
