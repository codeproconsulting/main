import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { FaGraduationCap, FaPlane, FaArrowRightLong } from 'react-icons/fa6';
import { Navbar } from "../components/ui/Navbar";
import { Footer } from "../components/ui/Footer";
import { SuccessSections } from "../components/ui/SuccessSections";
import { WhyChooseUs } from "../components/ui/WhyChooseUs";
import { ReviewsSection } from "../components/ui/ReviewsSection";
import { PartnerUniversitiesSection } from "../components/ui/PartnerUniversitiesSection";
import { BlogPreview } from "../components/ui/BlogPreview";
import { EDUCATION_URL, IMMIGRATION_URL, BRAND } from "../lib/constants";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        {/* Hero – clean light split layout */}
        <section aria-label="Hero" className="relative min-h-[90vh] flex items-center overflow-hidden bg-white">
          {/* Subtle background decoration */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute top-0 right-0 w-[55vw] h-full bg-slate-50 rounded-bl-[80px]" />
            <div className="absolute top-[10%] right-[8%] w-72 h-72 rounded-full border border-slate-200/80 opacity-60" />
            <div className="absolute top-[18%] right-[14%] w-48 h-48 rounded-full border border-slate-200/80 opacity-40" />
            <div
              className="absolute bottom-[15%] left-[5%] w-40 h-40 rounded-full"
              style={{ background: `radial-gradient(circle, ${BRAND.pink}14, transparent 70%)` }}
            />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left — copy */}
            <div>
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm mb-6"
              >
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full text-white text-[10px]"
                  style={{ backgroundColor: BRAND.pink }}
                >
                  ✦
                </span>
                Trusted by 700+ clients
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
                style={{ color: BRAND.navy }}
              >
                Your Trusted Partner{" "}
                <span
                  className="block bg-clip-text text-transparent"
                  style={{ backgroundImage: `linear-gradient(135deg, ${BRAND.pink}, #E11D48)` }}
                >
                  for Education
                </span>
                <span className="block" style={{ color: BRAND.navy }}>&amp; Immigration</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.7 }}
                className="text-lg md:text-xl text-slate-600 max-w-xl mb-10 leading-relaxed"
              >
                Whether you're planning to study abroad or navigate the immigration process — we guide you every step of the way with absolute clarity.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex flex-wrap gap-4 items-center"
              >
                <Link
                  to="/education"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-base font-bold text-white shadow-lg transition-all hover:opacity-95 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-500"
                  style={{ backgroundColor: BRAND.pink }}
                >
                  <FaGraduationCap className="w-4 h-4" />
                  Study Abroad
                </Link>
                <Link
                  to="/immigration"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-base font-bold text-white shadow-lg transition-all hover:opacity-95 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-700"
                  style={{ backgroundColor: BRAND.navy }}
                >
                  <FaPlane className="w-4 h-4" />
                  Immigration
                </Link>
                <Link
                  to="/?consult=open"
                  className="inline-flex items-center gap-2 text-sm font-semibold transition-colors group"
                  style={{ color: BRAND.pink }}
                >
                  <span
                    className="border-b group-hover:opacity-80 transition-opacity pb-0.5"
                    style={{ borderColor: BRAND.pink }}
                  >
                    Free consultation
                  </span>
                  <FaArrowRightLong className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              {/* Stats strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.75 }}
                className="mt-12 flex flex-wrap gap-8"
              >
                {[
                  { value: "700+", label: "Assessments done" },
                  { value: "250+", label: "Visas granted" },
                  { value: "5+", label: "Years of experience" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-3xl font-extrabold tracking-tight" style={{ color: BRAND.navy }}>{s.value}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — service cards (desktop only) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="hidden lg:flex flex-col gap-5"
            >
              <Link
                to="/education"
                className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-7 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-blue-200 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
                <div className="relative flex items-center gap-5">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-md group-hover:scale-105 transition-transform duration-300">
                    <FaGraduationCap className="h-8 w-8" />
                  </div>
                  <div>
                    <span className="block text-xl font-bold mb-1" style={{ color: BRAND.navy }}>Study Abroad</span>
                    <span className="block text-sm text-slate-500">Universities, visas &amp; guidance</span>
                  </div>
                  <FaArrowRightLong className="ml-auto h-5 w-5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </Link>

              <Link
                to="/immigration"
                className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-7 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-pink-200 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
                <div className="relative flex items-center gap-5">
                  <div
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-white shadow-md group-hover:scale-105 transition-transform duration-300"
                    style={{ background: `linear-gradient(135deg, ${BRAND.pink}, #E11D48)` }}
                  >
                    <FaPlane className="h-8 w-8" />
                  </div>
                  <div>
                    <span className="block text-xl font-bold mb-1" style={{ color: BRAND.navy }}>Immigration &amp; Visas</span>
                    <span className="block text-sm text-slate-500">Visit, work, family &amp; settlement</span>
                  </div>
                  <FaArrowRightLong className="ml-auto h-5 w-5 text-slate-400 group-hover:text-pink-500 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </Link>

              {/* Trust badge */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {(["#0B1B3A", "#FF4D6D", "#C9A84C", "#2563EB"] as const).map((c, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: c }}
                    >
                      {["A", "B", "C", "D"][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: BRAND.navy }}>Joined by 250+ happy clients</p>
                  <p className="text-xs text-slate-500">Across 15+ countries worldwide</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Overview */}
        <section aria-label="Our services" className="py-20 md:py-24 bg-zinc-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-12 text-center">
              What We Do
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Card 1 – Study Abroad */}
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-all duration-200 focus-within:ring-2 focus-within:ring-slate-300 focus-within:ring-offset-2">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white mb-6" style={{ backgroundColor: BRAND.pink }}>
                  <FaGraduationCap className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Education Consulting</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  We help students get admitted to top universities worldwide — UK, Europe, Canada, Australia, USA, and more. From shortlisting to visa processing, we handle it all.
                </p>
                <ul className="space-y-2 text-sm text-slate-700 mb-6">
                  {["University Admissions", "Student Visas", "IELTS / Test Prep", "Career Counselling", "Pre-Departure Guidance"].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="text-green-600">✓</span> {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/education"
                  className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white w-full sm:w-auto transition-all duration-200 hover:opacity-95 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400"
                  style={{ backgroundColor: BRAND.pink }}
                >
                  Explore Education Services
                </Link>
              </div>

              {/* Card 2 – Immigration */}
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-all duration-200 focus-within:ring-2 focus-within:ring-slate-300 focus-within:ring-offset-2">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white mb-6" style={{ backgroundColor: BRAND.navy }}>
                  <FaPlane className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Immigration &amp; Visas</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Navigating immigration can be overwhelming. Our experts simplify the process — visit visas, work permits, family reunification, or settlement.
                </p>
                <ul className="space-y-2 text-sm text-slate-700 mb-6">
                  {["Visit Visas", "Work Permits", "Family Visas", "Settlement Applications", "Appeal Support"].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="text-green-600">✓</span> {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/immigration"
                  className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white w-full sm:w-auto transition-all duration-200 hover:opacity-95 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400"
                  style={{ backgroundColor: BRAND.navy }}
                >
                  Explore Immigration Services
                </Link>
              </div>
            </div>
          </div>
        </section>

        <SuccessSections />
        <WhyChooseUs />
        <ReviewsSection />
        <PartnerUniversitiesSection />

        <BlogPreview />
      </main>

      <Footer />
    </>
  );
}
