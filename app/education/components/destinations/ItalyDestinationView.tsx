"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Building2,
  MapPin,
  Phone,
  ShieldCheck,
  BookOpen,
  FileText,
  Layers,
  GraduationCap,
  Scale,
  Landmark,
} from "lucide-react";
import { Navbar } from "~/education/components/ui/Navbar";
import { Footer } from "~/education/components/ui/footer";
import {
  ITALY_FAQS,
  ITALY_OFFICIAL_SOURCES,
  ITALY_SEO,
} from "~/education/lib/italyDestinationData";

export function ItalyDestinationView() {
  const [activeAnchor, setActiveAnchor] = useState<string>("overview");
  const [showMobileCta, setShowMobileCta] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 220;
      const sections = [
        "overview",
        "decisions",
        "scholarships",
        "documents",
        "budget",
        "process",
        "faqs",
      ];
      for (const s of sections) {
        const el = document.getElementById(s);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveAnchor(s);
            break;
          }
        }
      }

      // Hide mobile CTA near bottom
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      if (window.scrollY + winHeight >= docHeight - 350) {
        setShowMobileCta(false);
      } else {
        setShowMobileCta(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#FF4D6D]/15 selection:text-[#0B1B3A]">
      <Navbar />

      {/* STICKY EDITORIAL LOCAL ANCHOR NAV (DESKTOP) */}
      <nav
        aria-label="Italy section navigation"
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 hidden lg:block"
      >
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-14 text-sm font-medium">
          <div className="flex items-center gap-7">
            <span className="text-[#0B1B3A] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF4D6D]" />
              Italy Guidance
            </span>
            <div className="flex items-center gap-5 text-slate-600">
              <a
                href="#overview"
                className={`hover:text-[#FF4D6D] transition-colors ${
                  activeAnchor === "overview"
                    ? "text-[#FF4D6D] font-semibold border-b-2 border-[#FF4D6D] py-4"
                    : "py-4"
                }`}
              >
                Why Italy
              </a>
              <a
                href="#decisions"
                className={`hover:text-[#FF4D6D] transition-colors ${
                  activeAnchor === "decisions"
                    ? "text-[#FF4D6D] font-semibold border-b-2 border-[#FF4D6D] py-4"
                    : "py-4"
                }`}
              >
                4 Applications
              </a>
              <a
                href="#scholarships"
                className={`hover:text-[#FF4D6D] transition-colors ${
                  activeAnchor === "scholarships"
                    ? "text-[#FF4D6D] font-semibold border-b-2 border-[#FF4D6D] py-4"
                    : "py-4"
                }`}
              >
                Scholarships
              </a>
              <a
                href="#documents"
                className={`hover:text-[#FF4D6D] transition-colors ${
                  activeAnchor === "documents"
                    ? "text-[#FF4D6D] font-semibold border-b-2 border-[#FF4D6D] py-4"
                    : "py-4"
                }`}
              >
                Documents
              </a>
              <a
                href="#budget"
                className={`hover:text-[#FF4D6D] transition-colors ${
                  activeAnchor === "budget"
                    ? "text-[#FF4D6D] font-semibold border-b-2 border-[#FF4D6D] py-4"
                    : "py-4"
                }`}
              >
                Budgeting
              </a>
              <a
                href="#process"
                className={`hover:text-[#FF4D6D] transition-colors ${
                  activeAnchor === "process"
                    ? "text-[#FF4D6D] font-semibold border-b-2 border-[#FF4D6D] py-4"
                    : "py-4"
                }`}
              >
                Action Plan
              </a>
              <a
                href="#faqs"
                className={`hover:text-[#FF4D6D] transition-colors ${
                  activeAnchor === "faqs"
                    ? "text-[#FF4D6D] font-semibold border-b-2 border-[#FF4D6D] py-4"
                    : "py-4"
                }`}
              >
                FAQs
              </a>
            </div>
          </div>
          <Link
            to={ITALY_SEO.ctaHref}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#FF4D6D] hover:bg-[#E11D48] px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <span>{ITALY_SEO.ctaText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* 01 · HERO SECTION */}
      <header className="relative bg-white pt-8 pb-16 md:pt-14 md:pb-24 border-b border-slate-200/80">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 text-xs text-slate-500 mb-8"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              to="/education/destinations"
              className="hover:text-slate-900 transition-colors"
            >
              Destinations
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-900 font-medium">Italy</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left 7 cols: Copy & CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D]" />
                Study in Italy · Guidance for Pakistani students and parents
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B1B3A] tracking-tight leading-[1.12]">
                Study in Italy from Pakistan—with a plan beyond the scholarship
              </h1>

              <div className="space-y-4 text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                <p>
                  Study in Italy from Pakistan with a clear view of your course
                  options, family budget and application responsibilities.
                  ProConsulting helps you connect university requirements,
                  regional scholarship rules, Universitaly pre-enrolment and
                  visa preparation—without treating any one approval as a
                  promise of the next.
                </p>
                <p className="text-slate-600 text-sm sm:text-base">
                  Start with your academic profile and the funds your family can
                  actually access. Then decide whether Italy makes sense for you.
                </p>
              </div>

              {/* 4 Value Bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 pb-1">
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-[#FF4D6D] shrink-0 mt-0.5" />
                  <span>Programme fit before application volume</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-[#FF4D6D] shrink-0 mt-0.5" />
                  <span>Scholarship eligibility checked against the relevant call</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-[#FF4D6D] shrink-0 mt-0.5" />
                  <span>Document requirements separated by receiving authority</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-[#FF4D6D] shrink-0 mt-0.5" />
                  <span>Costs considered before a funding decision</span>
                </div>
              </div>

              {/* CTA & Subtext & Verbatim Honesty Sentence */}
              <div className="pt-2 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <Link
                    to={ITALY_SEO.ctaHref}
                    className="inline-flex items-center justify-center gap-2.5 bg-[#FF4D6D] hover:bg-[#E11D48] text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl shadow-lg shadow-pink-500/20 transition-all hover:scale-[1.01]"
                  >
                    <span>{ITALY_SEO.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <span className="text-xs text-slate-500 font-medium leading-tight">
                    For students &amp; parents. Initial profile review.
                  </span>
                </div>

                <p className="text-xs text-slate-500">
                  An initial assessment is free. Any paid assistance should be
                  agreed separately before work begins.
                </p>

                {/* Mandatory Protected Honesty Sentence (1st occurrence) */}
                <div className="p-3 rounded-lg bg-slate-50 border-l-2 border-[#FF4D6D] text-xs font-semibold text-[#0B1B3A]">
                  No consultant can guarantee a scholarship, admission or visa, and we do not.
                </div>
              </div>
            </div>

            {/* Right 5 cols: Licensed real campus photography & route visual */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-md bg-slate-100">
                <img
                  src="/destinations/Italy.webp"
                  alt="Historic Italian university campus architecture and courtyard in Italy"
                  className="w-full h-64 sm:h-72 object-cover"
                  loading="eager"
                  width={600}
                  height={400}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3A]/80 via-transparent to-transparent flex items-end p-5">
                  <p className="text-xs text-white/95 font-medium">
                    Italian Higher Education: Academic rigor, historic faculties, and regional student support.
                  </p>
                </div>
              </div>

              {/* Four-step summary card */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3 text-xs">
                <div className="font-bold text-[#0B1B3A] text-sm uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#FF4D6D]" />
                  <span>The Four Independent Decisions</span>
                </div>
                <div className="space-y-2 text-slate-700">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/70">
                    <span className="font-semibold">1. University Admission</span>
                    <span className="text-[11px] text-slate-500">Academic Board</span>
                  </div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/70">
                    <span className="font-semibold">2. Regional Scholarship</span>
                    <span className="text-[11px] text-slate-500">Regional Body (DSU / ER.GO)</span>
                  </div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/70">
                    <span className="font-semibold">3. Universitaly Pre-enrolment</span>
                    <span className="text-[11px] text-slate-500">Institution Validation</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">4. Study Visa Application</span>
                    <span className="text-[11px] text-slate-500">Diplomatic / Consular Mission</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 02 · WHY ITALY DESERVES A CLOSER LOOK */}
      <section
        id="overview"
        className="py-16 md:py-24 bg-slate-50/60 border-b border-slate-200/80 scroll-mt-16"
      >
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-3">
              <span
                aria-hidden="true"
                className="block text-4xl sm:text-5xl font-black text-slate-200"
              >
                02
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B1B3A] tracking-tight mt-1">
                Why Italy deserves a closer look
              </h2>
              <div className="w-10 h-0.5 bg-[#FF4D6D] mt-3" />
            </div>

            <div className="lg:col-span-9 space-y-5 text-slate-700 text-base sm:text-lg leading-relaxed max-w-[740px]">
              <p>
                Italy may suit students looking for an English-taught degree, a
                specialist academic pathway or a university environment shaped by
                design, science, business and the arts. But the country is not one
                uniform study package.
              </p>
              <p>
                Your experience depends on the university, programme, city and
                accommodation you choose. So does your budget. A course with an
                appealing tuition policy can still be unsuitable if its entry
                requirements, living costs or funding timetable do not fit your
                circumstances.
              </p>

              {/* Typographic pullout question */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-[#0B1B3A] text-lg sm:text-xl font-semibold leading-snug">
                Our starting question is not “Which scholarship sounds largest?”
                It is{" "}
                <span className="text-[#FF4D6D]">
                  “Which study plan is academically suitable and financially workable for this family?”
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03 · FOUR APPLICATIONS. FOUR DIFFERENT DECISIONS. */}
      <section
        id="decisions"
        className="py-16 md:py-24 bg-white border-b border-slate-200/80 scroll-mt-16"
      >
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="max-w-[760px] mb-12">
            <span
              aria-hidden="true"
              className="block text-4xl sm:text-5xl font-black text-slate-200 mb-1"
            >
              03
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Four applications. Four different decisions.
            </h2>
            <p className="text-slate-600 mt-3 text-base sm:text-lg">
              Each track is controlled by a separate authority with independent criteria.
              One step does not guarantee the next.
            </p>
          </div>

          {/* 4 Lanes (SVG / HTML Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Lane 1: University admission */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between space-y-4">
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0B1B3A] flex items-center justify-center font-bold mb-4">
                  <GraduationCap className="w-5 h-5 text-[#FF4D6D]" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Track 1 · Academic Board
                </span>
                <h3 className="text-lg font-bold text-[#0B1B3A] mt-1 mb-2.5">
                  University admission
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  The university assesses whether your qualifications, subject background
                  and language evidence meet its programme requirements. An offer may carry
                  conditions that must still be completed.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                Authority: Target University / Faculty
              </div>
            </div>

            {/* Lane 2: Regional scholarship */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between space-y-4">
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0B1B3A] flex items-center justify-center font-bold mb-4">
                  <Scale className="w-5 h-5 text-[#FF4D6D]" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Track 2 · Regional Authority
                </span>
                <h3 className="text-lg font-bold text-[#0B1B3A] mt-1 mb-2.5">
                  Regional scholarship application
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  The responsible regional body assesses a separate benefits application
                  under its published call. Academic admission does not automatically award
                  a scholarship, accommodation or meals.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                Authority: Regional Body (DSU / ER.GO / ALiSEO)
              </div>
            </div>

            {/* Lane 3: Universitaly pre-enrolment */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between space-y-4">
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0B1B3A] flex items-center justify-center font-bold mb-4">
                  <FileText className="w-5 h-5 text-[#FF4D6D]" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Track 3 · Institutional Gateway
                </span>
                <h3 className="text-lg font-bold text-[#0B1B3A] mt-1 mb-2.5">
                  Universitaly pre-enrolment
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  For the relevant visa-requiring study route, you complete official
                  pre-enrolment through Universitaly and follow the institution’s instructions.
                  University validation supports the next stage; it is not a visa or an appointment guarantee.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                Authority: Universitaly &amp; University Validation
              </div>
            </div>

            {/* Lane 4: Study visa application */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between space-y-4">
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0B1B3A] flex items-center justify-center font-bold mb-4">
                  <Landmark className="w-5 h-5 text-[#FF4D6D]" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Track 4 · Consular Jurisdiction
                </span>
                <h3 className="text-lg font-bold text-[#0B1B3A] mt-1 mb-2.5">
                  Study visa application
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  The competent Italian diplomatic or consular authority makes the visa
                  decision. Admission, scholarship eligibility and validated pre-enrolment
                  do not replace its checks.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                Authority: Italian Embassy Islamabad / Consulate Karachi
              </div>
            </div>
          </div>

          {/* Coordination Callout */}
          <div className="mt-8 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-700 max-w-[800px]">
            <p className="font-semibold text-[#0B1B3A]">
              These tracks can overlap. Their deadlines and document requirements still need to be managed separately.
            </p>
          </div>
        </div>
      </section>

      {/* 04 · REGIONAL SCHOLARSHIPS: AN OPPORTUNITY, NOT AN ENTITLEMENT */}
      <section
        id="scholarships"
        className="py-16 md:py-24 bg-slate-50/60 border-b border-slate-200/80 scroll-mt-16"
      >
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-8 space-y-5 text-slate-700 text-base sm:text-lg leading-relaxed">
              <div>
                <span
                  aria-hidden="true"
                  className="block text-4xl sm:text-5xl font-black text-slate-200"
                >
                  04
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight mt-1">
                  Regional scholarships: an opportunity, not an entitlement
                </h2>
                <div className="w-10 h-0.5 bg-[#FF4D6D] mt-3 mb-6" />
              </div>

              <p>
                You may hear Italian regional student support described simply as
                “DSU”. That shorthand can hide important differences. DSU Toscana
                and ER.GO are examples of regional bodies, not interchangeable
                versions of one guaranteed national scholarship.
              </p>
              <p>
                Depending on the relevant call, support may include a cash award,
                meals, accommodation or fee-related benefits. Economic
                circumstances matter, but so can enrolment status, academic
                progress, application completeness and other published conditions.
                Accommodation can depend on availability.
              </p>
              <p>
                For a Pakistani household with income or assets abroad, the
                evidence requirements deserve attention early. A low income alone
                does not establish eligibility. The authority must be able to
                assess the documents and apply its rules.
              </p>
              <p className="text-sm sm:text-base text-slate-600">
                We help you identify the relevant body and questions to resolve. We
                do not describe every applicant as eligible, every eligible
                applicant as funded, or every benefit as cash available before
                departure.
              </p>
            </div>

            {/* Right 4 cols: Margin notes & source links */}
            <div className="lg:col-span-4 space-y-4 pt-4 lg:pt-12">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <span className="text-xs font-bold text-[#0B1B3A] uppercase tracking-wider block">
                  Regional Authorities Examples
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every Italian region publishes independent annual calls with distinct submission portals, quotas, and deadlines.
                </p>
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <a
                    href="https://www.dsu.toscana.it/borsa-di-studio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-[#FF4D6D] hover:underline font-semibold"
                  >
                    <span>DSU Toscana Scholarship</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://www.er-go.it/international-students"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-[#FF4D6D] hover:underline font-semibold"
                  >
                    <span>ER.GO International Support</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <strong>Important Distinction:</strong> “Eligible non-winner” (idoneo non beneficiario) status means you met economic criteria, but funding or accommodation ran out before your ranking was reached.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 05 · PREPARE TWO DOCUMENT FILES—NOT ONE GENERIC CHECKLIST */}
      <section
        id="documents"
        className="py-16 md:py-24 bg-white border-b border-slate-200/80 scroll-mt-16"
      >
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="max-w-[760px] mb-12">
            <span
              aria-hidden="true"
              className="block text-4xl sm:text-5xl font-black text-slate-200 mb-1"
            >
              05
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Prepare two document files—not one generic checklist
            </h2>
            <p className="text-slate-600 mt-3 text-base sm:text-lg">
              University admissions evaluate academic merit; regional scholarship bodies evaluate household finances.
              Keep their checklists strictly separated.
            </p>
          </div>

          {/* Two open document columns with vertical hairline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative">
            {/* File 1: Academic file */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b-2 border-slate-900">
                <GraduationCap className="w-5 h-5 text-[#FF4D6D]" />
                <h3 className="text-xl font-bold text-[#0B1B3A]">
                  Your academic file
                </h3>
              </div>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Your academic file may include qualifications, transcripts,
                identity documents, programme-specific materials and language
                evidence. The university decides what it needs to assess your
                application.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 pt-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D] shrink-0 mt-2" />
                  <span>Secondary certificates (HSSC / A-Levels / IB)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D] shrink-0 mt-2" />
                  <span>Bachelor transcript and degree with HEC attestation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D] shrink-0 mt-2" />
                  <span>Course syllabus or module descriptions where requested</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D] shrink-0 mt-2" />
                  <span>Language proficiency certificate or programme waiver</span>
                </li>
              </ul>
            </div>

            {/* File 2: Household financial file */}
            <div className="space-y-4 md:border-l md:border-slate-200 md:pl-10">
              <div className="flex items-center gap-2.5 pb-3 border-b-2 border-slate-900">
                <Scale className="w-5 h-5 text-[#FF4D6D]" />
                <h3 className="text-xl font-bold text-[#0B1B3A]">
                  Your household financial file
                </h3>
              </div>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Your household financial file may require evidence of family
                composition, income and assets for the periods specified by the
                scholarship body. Records about property, savings or the absence of
                particular income may need official supporting documents.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 pt-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D] shrink-0 mt-2" />
                  <span>Family registration certificate (FRC) verifying composition</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D] shrink-0 mt-2" />
                  <span>Annual income certificates for all earning family members</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D] shrink-0 mt-2" />
                  <span>Real estate, property square meters, or rented accommodation proof</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D] shrink-0 mt-2" />
                  <span>Movable assets and bank balances for the required reference calendar year</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Caveats full-width below */}
          <div className="mt-10 p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs sm:text-sm text-slate-700">
            <p>
              Translations and legalisation or permitted apostille procedures must
              follow the requirements of the receiving authority. Do not assume the
              same format, reference year or certification will satisfy the
              university, scholarship body and visa authority.
            </p>
            <p>
              CIMEA statements and a Declaration of Value are not universal
              requirements for every Italian university application. Check whether the
              institution or relevant authority requires either for your case before
              paying for it.
            </p>
            <p className="font-semibold text-[#0B1B3A]">
              The practical goal is a file that answers the right questions—not a
              folder full of expensive documents nobody requested.
            </p>
          </div>
        </div>
      </section>

      {/* 06 · BUDGET BEFORE THE SCHOLARSHIP RESULT */}
      <section
        id="budget"
        className="py-16 md:py-24 bg-slate-50/60 border-b border-slate-200/80 scroll-mt-16"
      >
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="max-w-[760px] mb-12">
            <span
              aria-hidden="true"
              className="block text-4xl sm:text-5xl font-black text-slate-200 mb-1"
            >
              06
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Budget before the scholarship result
            </h2>
            <p className="text-slate-600 mt-3 text-base sm:text-lg">
              A sensible Italy plan has two views: your costs without an award,
              and your revised costs if a specific benefit is confirmed. Keep
              uncertain funding out of money you need immediately.
            </p>
          </div>

          {/* Two Planning Scenarios Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] block">
                Scenario A · Planning Baseline
              </span>
              <h3 className="text-xl font-bold text-[#0B1B3A]">
                Costs Without an Award
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The essential baseline your family must be ready to fund independently:
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700 pt-2">
                <li>• University regional tuition fee or regional tax</li>
                <li>• Application and document evaluation charges (if applicable)</li>
                <li>• Document translations, attestations and legalisations</li>
                <li>• Visa fees, medical insurance, flights and arrival funds</li>
                <li>• 2–3 months of initial accommodation deposits and living costs</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">
                Scenario B · Conditional Adjustments
              </span>
              <h3 className="text-xl font-bold text-[#0B1B3A]">
                Costs If Benefit Is Confirmed
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                How finances adjust only after published rankings and award activation:
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700 pt-2">
                <li>• Tuition reduction or full regional fee waiver</li>
                <li>• University canteen meal card or allowance</li>
                <li>• Subsidised student hall or housing rent stipend</li>
                <li>• Cash scholarship paid in staggered termly instalments</li>
                <li>• Note: Cash instalments require credit milestones later in the year</li>
              </ul>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 text-xs sm:text-sm text-slate-700">
            <p>
              Allow for university charges, applications where applicable, document
              preparation, language tests where required, visa-related expenses,
              travel, accommodation deposits and initial living costs. Check whether
              any payment is refundable before committing.
            </p>
            <p>
              Scholarship application dates, rankings, benefit activation and cash
              instalments are different events. Some payments depend on later academic
              progress or other conditions. A result may arrive after expenses have
              already fallen due.
            </p>
            <p className="font-semibold text-[#0B1B3A]">
              Parents should be able to see which funds are accessible, when payments
              are due and what happens if funding is delayed or not awarded. Do not
              rely on speculative part-time earnings to close an essential funding gap.
            </p>
          </div>
        </div>
      </section>

      {/* 07 · ENGLISH-TAUGHT DOES NOT MEAN EVIDENCE-FREE */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-3">
              <span
                aria-hidden="true"
                className="block text-4xl sm:text-5xl font-black text-slate-200"
              >
                07
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B1B3A] tracking-tight mt-1">
                English-taught does not mean evidence-free
              </h2>
              <div className="w-10 h-0.5 bg-[#FF4D6D] mt-3" />
            </div>

            <div className="lg:col-span-9 space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed max-w-[740px]">
              <p>
                An English-taught programme can still require specific proof of
                English proficiency. Accepted tests, scores, exemptions and interview
                requirements vary by institution and course.
              </p>
              <p>
                A medium-of-instruction letter should only be used where the
                receiving institution accepts it for the relevant purpose. It is not a
                universal substitute for a test, and an admission exemption should not
                be assumed to settle every visa requirement.
              </p>
              <p>
                We assess language requirements alongside academic fit, rather than
                advertising Italy as a blanket “no IELTS” destination.
                Italian-language learning may also help with everyday life, even when
                your degree is taught in English.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 08 · WHAT YOUR ITALY PLAN SHOULD CONTAIN */}
      <section className="py-16 md:py-24 bg-slate-50/60 border-b border-slate-200/80">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="max-w-[760px] mb-12">
            <span
              aria-hidden="true"
              className="block text-4xl sm:text-5xl font-black text-slate-200 mb-1"
            >
              08
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              What your Italy plan should contain
            </h2>
            <p className="text-slate-600 mt-3 text-base sm:text-lg">
              Useful guidance should leave you with decisions you can understand and
              documents you can act on. Depending on the paid scope you approve,
              assistance can cover:
            </p>
          </div>

          {/* Numbered Typographic List across 2 cols */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-start gap-4 shadow-sm">
              <span className="w-8 h-8 rounded-lg bg-slate-100 text-[#0B1B3A] flex items-center justify-center font-bold text-sm shrink-0">
                1
              </span>
              <p className="text-sm sm:text-base text-slate-700 leading-snug pt-0.5">
                A programme shortlist with academic and language requirements to verify.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-start gap-4 shadow-sm">
              <span className="w-8 h-8 rounded-lg bg-slate-100 text-[#0B1B3A] flex items-center justify-center font-bold text-sm shrink-0">
                2
              </span>
              <p className="text-sm sm:text-base text-slate-700 leading-snug pt-0.5">
                A university application checklist, including conditions attached to an offer.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-start gap-4 shadow-sm">
              <span className="w-8 h-8 rounded-lg bg-slate-100 text-[#0B1B3A] flex items-center justify-center font-bold text-sm shrink-0">
                3
              </span>
              <p className="text-sm sm:text-base text-slate-700 leading-snug pt-0.5">
                A regional scholarship checklist tied to the appropriate published call.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-start gap-4 shadow-sm">
              <span className="w-8 h-8 rounded-lg bg-slate-100 text-[#0B1B3A] flex items-center justify-center font-bold text-sm shrink-0">
                4
              </span>
              <p className="text-sm sm:text-base text-slate-700 leading-snug pt-0.5">
                A deadline tracker separating admissions, benefits, pre-enrolment and visa actions.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-start gap-4 shadow-sm">
              <span className="w-8 h-8 rounded-lg bg-slate-100 text-[#0B1B3A] flex items-center justify-center font-bold text-sm shrink-0">
                5
              </span>
              <p className="text-sm sm:text-base text-slate-700 leading-snug pt-0.5">
                A budget worksheet distinguishing confirmed costs from uncertain support.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-start gap-4 shadow-sm">
              <span className="w-8 h-8 rounded-lg bg-slate-100 text-[#0B1B3A] flex items-center justify-center font-bold text-sm shrink-0">
                6
              </span>
              <p className="text-sm sm:text-base text-slate-700 leading-snug pt-0.5">
                A visa preparation checklist based on the competent authority’s current instructions.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-600">
            The free assessment starts the conversation; it is not a promise that
            every application service is included. Ask for the exact deliverables,
            responsibilities and exclusions in writing before choosing paid support.
          </div>
        </div>
      </section>

      {/* 09 · FROM HOPEFUL ASSUMPTION TO A DECISION-READY PLAN */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="max-w-[760px] mb-12">
            <span
              aria-hidden="true"
              className="block text-4xl sm:text-5xl font-black text-slate-200 mb-1"
            >
              09
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              From hopeful assumption to a decision-ready plan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Typical Blind Spots
              </span>
              <h3 className="text-lg font-bold text-slate-800">
                Without a checked plan:
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                A course chosen for a scholarship headline; one deadline assumed to
                cover everything; financial documents collected without checking the
                required year; arrival expenses left to an expected award.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border-2 border-[#FF4D6D]/40 shadow-sm space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] block">
                Structured Approach
              </span>
              <h3 className="text-lg font-bold text-[#0B1B3A]">
                With a checked plan:
              </h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                A programme matched to your background; separate application
                tracks; documents mapped to their receiving authority; a family budget
                that shows what must be paid before funding is confirmed.
              </p>
            </div>
          </div>

          {/* Explicit Planning Comparison Disclaimer */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 leading-relaxed max-w-[840px]">
            This is a planning comparison, not a student success story or a
            predicted outcome. Better preparation supports informed decisions. It
            cannot make another organisation approve an application.
          </div>
        </div>
      </section>

      {/* 10 · START WITH THE FACTS YOUR FAMILY ALREADY HAS */}
      <section
        id="process"
        className="py-16 md:py-24 bg-slate-50/60 border-b border-slate-200/80 scroll-mt-16"
      >
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="max-w-[760px] mb-12">
            <span
              aria-hidden="true"
              className="block text-4xl sm:text-5xl font-black text-slate-200 mb-1"
            >
              10
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Start with the facts your family already has
            </h2>
          </div>

          {/* Vertical 3-Stage Process Rail */}
          <div className="space-y-6 max-w-[800px] mb-10">
            <div className="flex gap-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="w-10 h-10 rounded-xl bg-[#0B1B3A] text-white flex items-center justify-center font-bold text-sm shrink-0">
                1
              </span>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-[#0B1B3A]">
                  First: Share Profile &amp; Goals
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  First, share your latest qualification, subject interests, intended
                  study level, language position and approximate budget. Mention any
                  previous refusals or application difficulties honestly.
                </p>
              </div>
            </div>

            <div className="flex gap-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="w-10 h-10 rounded-xl bg-[#0B1B3A] text-white flex items-center justify-center font-bold text-sm shrink-0">
                2
              </span>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-[#0B1B3A]">
                  Next: Feasibility &amp; Gaps Review
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Next, discuss whether your academic profile and accessible funds
                  support a credible Italy route. If documents, language preparation or
                  the budget need attention first, that should be part of the
                  conversation—not hidden until after you commit.
                </p>
              </div>
            </div>

            <div className="flex gap-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="w-10 h-10 rounded-xl bg-[#0B1B3A] text-white flex items-center justify-center font-bold text-sm shrink-0">
                3
              </span>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-[#0B1B3A]">
                  Then: Define Scope &amp; Retain Control
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Then, if you choose paid assistance, agree the scope before
                  applications begin. Keep access to your own accounts, review
                  submissions and retain copies of documents and payment records.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 max-w-[800px]">
            <p className="text-xs sm:text-sm text-slate-600">
              You can apply directly using official portals. A consultant is optional;
              we do not sell privileged access to regional awards or visa decisions.
            </p>

            <Link
              to={ITALY_SEO.ctaHref}
              className="inline-flex items-center gap-2 bg-[#FF4D6D] hover:bg-[#E11D48] text-white font-bold text-sm px-7 py-3.5 rounded-xl shadow-md transition-all"
            >
              <span>{ITALY_SEO.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 11 · DEADLINES NEED NAMES, NOT GUESSES */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-3">
              <span
                aria-hidden="true"
                className="block text-4xl sm:text-5xl font-black text-slate-200"
              >
                11
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B1B3A] tracking-tight mt-1">
                Deadlines need names, not guesses
              </h2>
              <div className="w-10 h-0.5 bg-[#FF4D6D] mt-3" />
            </div>

            <div className="lg:col-span-9 space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed max-w-[740px]">
              <p>
                There is no single “Italy deadline” that safely covers every
                course and benefit. A university application, scholarship
                submission, missing-document correction, Universitaly step and visa
                requirement can each have a different cut-off.
              </p>
              <p>
                The practical deadline for your programme may be earlier than a
                national outer limit. Scholarship calls can also close while other
                parts of the study process remain open.
              </p>
              <p>
                Check the current academic year and applicant category before acting
                on any date. If an important window has closed, reassess the next
                suitable opportunity rather than paying on the assumption that an
                exception will be made.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 12 · CLEAR FEES. CLEAR RESPONSIBILITIES. */}
      <section className="py-16 md:py-24 bg-slate-50/60 border-b border-slate-200/80">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-3">
              <span
                aria-hidden="true"
                className="block text-4xl sm:text-5xl font-black text-slate-200"
              >
                12
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B1B3A] tracking-tight mt-1">
                Clear fees. Clear responsibilities.
              </h2>
              <div className="w-10 h-0.5 bg-[#FF4D6D] mt-3" />
            </div>

            <div className="lg:col-span-9 space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed max-w-[740px]">
              <p>
                The initial Italy assessment is free. Consultancy charges, if you
                choose further help, are separate from university, scholarship-body,
                translation, verification, visa and other third-party costs.
              </p>
              <p>
                Before paying, ask what is included, which payments go to third
                parties, what remains your responsibility and what cancellation or
                refund terms apply. Do not assume that a free consultation means free
                application management.
              </p>
              <p className="font-semibold text-[#0B1B3A]">
                Scholarships are awarded by the relevant authority, not purchased
                from a consultant. No payment to ProConsulting can secure an award,
                university place, visa appointment or visa decision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 13 · QUESTIONS STUDENTS AND PARENTS ASK (10 FAQS) */}
      <section
        id="faqs"
        className="py-16 md:py-24 bg-white border-b border-slate-200/80 scroll-mt-16"
      >
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="max-w-[760px] mb-12">
            <span
              aria-hidden="true"
              className="block text-4xl sm:text-5xl font-black text-slate-200 mb-1"
            >
              13
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Questions students and parents ask
            </h2>
            <p className="text-slate-600 mt-3 text-base sm:text-lg">
              Direct guidance on English degrees, DSU scholarships, Universitaly, family financial documents, and visas.
            </p>
          </div>

          <div className="max-w-[840px] divide-y divide-slate-200">
            {ITALY_FAQS.map((faq, index) => (
              <details
                key={faq.id}
                className="group py-5 text-left focus-within:outline-none"
                defaultOpen={index === 0}
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-bold text-base sm:text-lg text-[#0B1B3A] group-hover:text-[#FF4D6D] transition-colors focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:rounded-lg p-1">
                  <span>
                    {faq.id}. {faq.q}
                  </span>
                  <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
                </summary>
                <div className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed pl-1 pr-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 14 · GET A CLEARER ANSWER BEFORE YOU COMMIT */}
      <section className="py-16 md:py-24 bg-slate-50/70 border-b border-slate-200/80">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="max-w-[800px] space-y-6">
            <div>
              <span
                aria-hidden="true"
                className="block text-4xl sm:text-5xl font-black text-slate-200"
              >
                14
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight mt-1">
                Get a clearer answer before you commit
              </h2>
            </div>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
              Bring your study goals, qualifications and honest budget. Let’s
              identify the questions that matter for your Italy plan—and the
              costs or requirements you should resolve before applying.
            </p>

            <div className="pt-2">
              <Link
                to={ITALY_SEO.ctaHref}
                className="inline-flex items-center gap-2.5 bg-[#FF4D6D] hover:bg-[#E11D48] text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg shadow-pink-500/25 transition-all hover:scale-[1.01]"
              >
                <span>{ITALY_SEO.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <p className="text-xs sm:text-sm text-slate-500">
              Share basic details only at this stage. Do not send passport scans,
              bank statements or family financial documents through an initial
              enquiry.
            </p>

            {/* Mandatory Protected Honesty Sentence (2nd occurrence) */}
            <div className="p-4 rounded-xl bg-white border-l-2 border-[#FF4D6D] text-xs sm:text-sm font-semibold text-[#0B1B3A] shadow-sm">
              No consultant can guarantee a scholarship, admission or visa, and we do not.
            </div>
          </div>
        </div>
      </section>

      {/* 15 · CONTACT PROCONSULTING & OFFICIAL GUIDANCE SOURCES */}
      <section className="py-16 md:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="max-w-[760px] mb-10">
            <span
              aria-hidden="true"
              className="block text-4xl sm:text-5xl font-black text-slate-200 mb-1"
            >
              15
            </span>
            <h2 className="text-2xl font-bold text-[#0B1B3A] tracking-tight">
              Contact ProConsulting
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Vista Building, Second Floor, Office 203–204, I-8 Markaz, Islamabad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[680px] mb-12">
            <a
              href="tel:+92516135834"
              className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center gap-3 text-sm text-slate-800"
            >
              <Phone className="w-4 h-4 text-[#FF4D6D] shrink-0" />
              <div>
                <span className="block text-xs text-slate-500 font-medium">Pakistan landline</span>
                <span className="font-semibold">(051) 6135834</span>
              </div>
            </a>

            <a
              href="tel:+447432406993"
              className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center gap-3 text-sm text-slate-800"
            >
              <Phone className="w-4 h-4 text-[#FF4D6D] shrink-0" />
              <div>
                <span className="block text-xs text-slate-500 font-medium">UK direct line</span>
                <span className="font-semibold">+44 7432 406993</span>
              </div>
            </a>
          </div>

          {/* Official Information Utility Area */}
          <div className="pt-10 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Official Italy Guidance Sources
            </h3>
            <p className="text-xs text-slate-500 mb-6 max-w-2xl">
              Verified public guidance published by Italian higher education authorities and diplomatic missions. External links are informational only; they do not imply official partnership or endorsement.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ITALY_OFFICIAL_SOURCES.map((source) => (
                <a
                  key={source.id}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-[#FF4D6D]/40 transition-colors block text-left group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-[#0B1B3A] group-hover:text-[#FF4D6D] transition-colors">
                      {source.name}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FF4D6D] transition-colors shrink-0" />
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {source.description}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE STICKY BOTTOM CTA */}
      {showMobileCta && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3.5 sm:hidden shadow-lg">
          <Link
            to={ITALY_SEO.ctaHref}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#FF4D6D] hover:bg-[#E11D48] text-white font-bold text-sm py-3 px-5 rounded-xl shadow-md transition-colors"
          >
            <span>{ITALY_SEO.ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      <Footer />
    </div>
  );
}
