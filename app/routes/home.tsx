import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { FaGraduationCap, FaPlane, FaArrowRightLong, FaCircleCheck, FaArrowRight } from 'react-icons/fa6';
import { Navbar } from "../components/ui/Navbar";
import { Footer } from "../components/ui/Footer";
import { WhyChooseUs } from "../components/ui/WhyChooseUs";
import { ReviewsSection } from "../components/ui/ReviewsSection";
import { PartnerUniversitiesSection } from "../components/ui/PartnerUniversitiesSection";
import { BlogPreview } from "../components/ui/BlogPreview";
import { EDUCATION_URL, IMMIGRATION_URL, BRAND } from "../lib/constants";
import { pageMeta, canonicalLink } from "../lib/seo";
import type { Route } from "./+types/home";

const TITLE = "Proconsulting | Study Abroad & Immigration Consulting Services";
const DESCRIPTION = "Expert education and immigration consultants in the UK. We help you navigate university admissions, student visas, and immigration processes with clarity and confidence.";
const PATHNAME = "/";

export function meta(_args?: Route.MetaArgs) {
  return [
    { title: TITLE },
    { name: "description", content: DESCRIPTION },
    ...pageMeta({ title: TITLE, description: DESCRIPTION, pathname: PATHNAME }),
  ];
}

export function links() {
  return canonicalLink(PATHNAME);
}

const STAT_SETS = [
  {
    label: "Study Abroad",
    icon: FaGraduationCap,
    color: "#2563EB",
    stats: [
      { value: "2000+", label: "Assessments done" },
      { value: "500+", label: "Student visas granted" },
      { value: "700+", label: "Cases completed" },
    ],
  },
  {
    label: "Immigration",
    icon: FaPlane,
    color: "#FF4D6D",
    stats: [
      { value: "700+", label: "Assessments done" },
      { value: "250+", label: "Visas granted" },
      { value: "250+", label: "Satisfied clients" },
    ],
  },
];

export default function HomePage() {
  const [statIdx, setStatIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setStatIdx((i) => (i + 1) % STAT_SETS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const current = STAT_SETS[statIdx];
  const Icon = current.icon;

  const schemaOrgJSONLD = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "name": "Proconsulting",
        "url": "https://proconsulting.uk",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://proconsulting.uk/education/blog?search={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://proconsulting.uk/#organization",
        "name": "Proconsulting",
        "alternateName": "Pro Consulting",
        "url": "https://proconsulting.uk",
        "logo": "https://proconsulting.uk/logo.png",
        "image": "https://proconsulting.uk/Logo_main.png",
        "description": "Expert study abroad and immigration consulting services. We help students with university admissions, student visas, and immigration processes across the UK, Europe, Canada, Australia, and USA.",
        "priceRange": "Free consultation",
        "telephone": ["+44 7432 406993", "+92 51 6135834"],
        "email": "contact@proconsulting.uk",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Vista Building, 2nd Floor, Office No 203-204, I-8 Markaz",
          "addressLocality": "Islamabad",
          "addressCountry": "PK"
        },
        "sameAs": [
          "https://www.facebook.com/proconsultinguk",
          "https://www.instagram.com/pro_consulting1/",
          "https://www.linkedin.com/company/proconsultinguk",
          "https://x.com/proconsulting_"
        ],
        "areaServed": ["GB", "PK", "Worldwide"],
        "serviceType": ["Study Abroad Consulting", "Immigration Consulting", "Visa Assistance", "University Admissions"]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgJSONLD) }}
      />
      <Navbar />

      <main>
        {/* ─── Hero ─── */}
        <section aria-label="Hero" className="relative min-h-[90vh] flex items-center overflow-hidden bg-white">
          {/* Background decoration */}
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
                >✦</span>
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
                Your Trusted Consulting Partner{" "}
                <span
                  className="block bg-clip-text text-transparent"
                  style={{ backgroundImage: `linear-gradient(135deg, ${BRAND.pink}, #E11D48)` }}
                >
                  for Study Abroad
                </span>
                <span className="block" style={{ color: BRAND.navy }}>&amp; Immigration Services</span>
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
                className="flex flex-wrap gap-3 items-center"
              >
                <Link
                  to="/education"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:opacity-95 hover:shadow-lg"
                  style={{ backgroundColor: BRAND.pink }}
                >
                  <FaGraduationCap className="w-4 h-4" />
                  Study Abroad
                </Link>
                <Link
                  to="/immigration"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:opacity-95 hover:shadow-lg"
                  style={{ backgroundColor: BRAND.navy }}
                >
                  <FaPlane className="w-4 h-4" />
                  Immigration
                </Link>
                <Link
                  to="/?consult=open"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold border-2 transition-all"
                  style={{ borderColor: BRAND.pink, color: BRAND.pink }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = BRAND.pink;
                    (e.currentTarget as HTMLElement).style.color = '#fff';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = BRAND.pink;
                  }}
                >
                  Free Consultation
                  <FaArrowRightLong className="w-3.5 h-3.5" />
                </Link>
              </motion.div>

              {/* ── Rotating Stats Strip ── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.75 }}
                className="mt-12"
              >
                {/* Label + dots */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`label-${statIdx}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                    className="flex items-center gap-2 mb-4"
                  >
                    <span
                      className="flex h-6 w-6 items-center justify-center rounded-full text-white shrink-0"
                      style={{ backgroundColor: current.color }}
                    >
                      <Icon className="w-3 h-3" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                      {current.label} &middot; Our Numbers
                    </span>
                    {/* Progress dots */}
                    <div className="ml-auto flex gap-1.5">
                      {STAT_SETS.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setStatIdx(i)}
                          className="w-2 h-2 rounded-full transition-all duration-300 cursor-pointer"
                          style={{
                            backgroundColor: i === statIdx ? current.color : '#CBD5E1',
                            transform: i === statIdx ? 'scale(1.4)' : 'scale(1)',
                          }}
                          aria-label={`Show ${STAT_SETS[i].label} stats`}
                        />
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Numbers */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`stats-${statIdx}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-wrap gap-8"
                  >
                    {current.stats.map((s) => (
                      <div key={s.label}>
                        <p className="text-3xl font-extrabold tracking-tight" style={{ color: current.color }}>
                          {s.value}
                        </p>
                        <p className="text-sm text-slate-500 mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
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

        {/* ─── Services Overview (What We Do) ─── */}
        <section aria-label="Our services" className="relative py-24 md:py-28 bg-[#0B1B3A] overflow-hidden">
          {/* Decorative glowing gradient spheres */}
          <div className="absolute top-1/4 left-[10%] w-96 h-96 bg-[#FF4D6D]/15 rounded-full filter blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-[10%] w-96 h-96 bg-blue-600/10 rounded-full filter blur-[100px] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-6 z-10">
            {/* Redesigned Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
              <span className="inline-block text-xs font-bold tracking-widest text-[#FF4D6D] uppercase px-3 py-1.5 rounded-full border border-[#FF4D6D]/30 bg-[#FF4D6D]/10 mb-4 animate-pulse">
                OUR CORE SERVICES
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
                What We Do
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed">
                Empowering your global ambitions through structured counseling, expert legal advice, and end-to-end relocation support.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
              {/* Study Abroad Card */}
              <motion.div 
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8 md:p-10 shadow-2xl flex flex-col justify-between hover:border-[#FF4D6D]/40 transition-all duration-300 group"
              >
                <div>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-8 transition-transform duration-300 group-hover:scale-110 shadow-lg shadow-[#FF4D6D]/20" style={{ backgroundColor: BRAND.pink }}>
                    <FaGraduationCap className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Education Consulting</h3>
                  <p className="text-slate-300 leading-relaxed mb-8 text-base">
                    We help students get admitted to top universities worldwide — UK, Europe, Canada, Australia, USA, and more. From shortlisting to visa processing, we handle it all.
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-200 mb-10">
                    {[
                      "University Admissions", 
                      "Student Visas", 
                      "IELTS / Test Prep", 
                      "Career Counselling", 
                      "Pre-Departure Guidance",
                      "Scholarship Assistance"
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm">
                        <FaCircleCheck className="w-5 h-5 text-[#FF4D6D] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  to="/education"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white w-full sm:w-auto transition-all bg-[#FF4D6D] hover:bg-[#E11D48] hover:shadow-lg hover:shadow-[#FF4D6D]/20 group/btn"
                >
                  Explore Education Services
                  <FaArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                </Link>
              </motion.div>

              {/* Immigration Card */}
              <motion.div 
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8 md:p-10 shadow-2xl flex flex-col justify-between hover:border-blue-500/40 transition-all duration-300 group"
              >
                <div>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-8 transition-transform duration-300 group-hover:scale-110 shadow-lg shadow-blue-500/20" style={{ backgroundColor: "#2563EB" }}>
                    <FaPlane className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Immigration &amp; Visas</h3>
                  <p className="text-slate-300 leading-relaxed mb-8 text-base">
                    Navigating immigration can be overwhelming. Our experts simplify the process — visit visas, work permits, family reunification, or settlement.
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-200 mb-10">
                    {[
                      "Visit Visas", 
                      "Work Permits", 
                      "Family Visas", 
                      "Settlement Applications", 
                      "Appeal Support",
                      "Legal Consultation"
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm">
                        <FaCircleCheck className="w-5 h-5 text-blue-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  to="/immigration"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white w-full sm:w-auto transition-all bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 group/btn"
                >
                  Explore Immigration Services
                  <FaArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        <WhyChooseUs />
        <ReviewsSection />
        <PartnerUniversitiesSection />
        <BlogPreview />
      </main>

      <Footer />
    </>
  );
}
