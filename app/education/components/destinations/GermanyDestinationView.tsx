"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  GraduationCap,
  FileCheck,
  Building2,
  MapPin,
  Phone,
  ShieldCheck,
  BookOpen,
} from "lucide-react";
import { Navbar } from "~/education/components/ui/Navbar";
import { Footer } from "~/education/components/ui/footer";
import { GermanyBudgetTool } from "./GermanyBudgetTool";
import {
  GERMANY_FAQS,
  GERMANY_OFFICIAL_SOURCES,
  GERMANY_SEO,
} from "~/education/lib/germanyDestinationData";

export function GermanyDestinationView() {
  const [activeAnchor, setActiveAnchor] = useState<string>("routes");
  const [showMobileCta, setShowMobileCta] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const anchors = ["routes", "bachelor", "master", "fees", "applications", "budget", "visa", "faq"];
      const headerOffset = 140;

      for (let i = anchors.length - 1; i >= 0; i--) {
        const el = document.getElementById(anchors[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= headerOffset) {
            setActiveAnchor(anchors[i]);
            break;
          }
        }
      }

      // Hide mobile sticky CTA if assessment section is in view
      const assessEl = document.getElementById("assessment");
      if (assessEl) {
        const rect = assessEl.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          setShowMobileCta(false);
          return;
        }
      }
      setShowMobileCta(true);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { id: "routes", label: "Study routes" },
    { id: "bachelor", label: "Bachelor's" },
    { id: "master", label: "Master's" },
    { id: "fees", label: "Fees" },
    { id: "applications", label: "Applications" },
    { id: "budget", label: "Budget" },
    { id: "visa", label: "Visa" },
    { id: "faq", label: "FAQs" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#FF4D6D]/15 selection:text-[#0B1B3A]">
      <Navbar />

      {/* Non-sticky Breadcrumb */}
      <div className="border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
            <Link to="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <span aria-hidden className="text-slate-300">/</span>
            <Link to="/education/destinations" className="hover:text-slate-900 transition-colors">
              Destinations
            </Link>
            <span aria-hidden className="text-slate-300">/</span>
            <span className="text-slate-900 font-medium">Germany</span>
          </nav>
        </div>
      </div>

      <main>
        {/* ========================================================================= */}
        {/* 1. HERO (White) */}
        {/* ========================================================================= */}
        <section className="bg-white pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column (7 cols): Headline, Deck, CTA */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="inline-block text-xs sm:text-sm font-semibold tracking-wide text-slate-600 bg-slate-100 px-3.5 py-1.5 rounded-full mb-4">
                    Study options for Pakistani students
                  </span>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold text-[#0B1B3A] tracking-tight leading-[1.12]">
                    Study in Germany from Pakistan
                  </h1>
                </div>

                {/* MANDATORY FIRST PUBLIC PARAGRAPH */}
                <p className="text-lg sm:text-xl font-medium text-slate-800 leading-relaxed">
                  Study in Germany from Pakistan with a degree that fits your qualifications, your subject and your family's budget—not just a country with a reputation for low tuition. ProConsulting helps you understand your Germany study route before you commit to applications, deposits or travel plans.
                </p>

                {/* Supporting Paragraph */}
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                  Start with your academic history, intended course, language level and available funding. Identify what needs checking, which requirements depend on the university, and what a realistic next step looks like.
                </p>

                {/* Primary CTA */}
                <div className="pt-2">
                  <Link
                    to={GERMANY_SEO.ctaHref}
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-base font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-md hover:shadow-lg transition-all"
                  >
                    <span>{GERMANY_SEO.ctaText}</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  <p className="mt-3.5 text-xs sm:text-sm text-slate-500 max-w-xl leading-normal">
                    For students and parents. Admission and visa decisions remain with the responsible institutions and authorities.
                  </p>
                </div>
              </div>

              {/* Right Column (5 cols): Quiet Typographic Route Diagram */}
              <div className="lg:col-span-5">
                <div className="bg-slate-50/90 rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-[#FF4D6D]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#0B1B3A]">
                        Germany Route Architecture
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      Orientation
                    </span>
                  </div>

                  <div className="divide-y divide-slate-200/70 text-sm">
                    <div className="py-4">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                        1. Qualification Check
                      </div>
                      <p className="font-semibold text-slate-900">
                        HZB Evaluation &amp; Subject Eligibility
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        Direct admission, subject-restricted access, or preparatory Studienkolleg pathway.
                      </p>
                    </div>

                    <div className="py-4">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                        2. Programme Prerequisite Match
                      </div>
                      <p className="font-semibold text-slate-900">
                        Consecutive Course &amp; Module Fit
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        Transcript-level module alignment and verified language evidence (IELTS / German).
                      </p>
                    </div>

                    <div className="py-4">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                        3. Budget &amp; Financing Evidence
                      </div>
                      <p className="font-semibold text-slate-900">
                        Blocked Account or Official Sponsorship
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        Separating semester contributions from living-cost proof accepted by the German mission.
                      </p>
                    </div>

                    <div className="py-4">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                        4. Application &amp; Visa Submission
                      </div>
                      <p className="font-semibold text-slate-900">
                        Direct / uni-assist / VPD to Digital Visa
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        Correct portal routing, HEC attested credentials, and mission jurisdiction.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                    <span>Evidence-based advisory</span>
                    <span className="font-medium text-[#0B1B3A]">ProConsulting Education</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STICKY IN-PAGE ANCHOR BAR (Desktop & Mobile) */}
        {/* ========================================================================= */}
        <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between overflow-x-auto scrollbar-hide py-3 gap-6">
              <div className="flex items-center gap-1 sm:gap-2">
                {navLinks.map((tab) => {
                  const isActive = activeAnchor === tab.id;
                  return (
                    <a
                      key={tab.id}
                      href={`#${tab.id}`}
                      className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                        isActive
                          ? "bg-[#0B1B3A] text-white"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      {tab.label}
                    </a>
                  );
                })}
              </div>

              <div className="hidden md:block shrink-0">
                <Link
                  to={GERMANY_SEO.ctaHref}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] rounded-lg transition-colors whitespace-nowrap shadow-2xs"
                >
                  <span>{GERMANY_SEO.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. LOW TUITION (Subtle Surface: bg-slate-50/70) */}
        {/* ========================================================================= */}
        <section className="bg-slate-50/70 py-16 sm:py-20 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
                  Reality Check
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight mt-3">
                  Low tuition is a starting point, not the whole plan
                </h2>
              </div>

              <div className="lg:col-span-9 space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
                <p>
                  Germany can offer strong academic options at public universities, universities of applied sciences and private institutions. But a low-tuition course is only useful if you qualify for it, can study in its teaching language and can afford life in its city.
                </p>
                <p>
                  A successful plan connects four things: academic eligibility, a suitable programme, an affordable budget and a credible visa application. Missing one can mean spending money on a route that does not fit.
                </p>
                <p className="font-semibold text-slate-900">
                  If you want to study in Germany from Pakistan, compare requirements before comparing university names. An attractive course title does not tell you whether your previous subjects meet its entry rules.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. WHICH GERMANY ROUTE (White; anchor #routes) */}
        {/* ========================================================================= */}
        <section id="routes" className="scroll-mt-36 bg-white py-16 sm:py-20 lg:py-24 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md mb-3 inline-block">
                Pathway Assessment
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Which Germany route should you explore?
              </h2>
            </div>

            {/* Three broad horizontal rows */}
            <div className="space-y-4">
              <div className="p-6 sm:p-7 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0B1B3A]" />
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      Starting a bachelor's degree?
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                    Your school qualification, subjects and any university study already completed determine the entry route. Do not assume an HSSC, A-level or another certificate automatically gives the same access as every other qualification.
                  </p>
                </div>
                <a
                  href="#bachelor"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF4D6D] hover:underline shrink-0"
                >
                  <span>Check bachelor requirements</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-6 sm:p-7 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0B1B3A]" />
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      Planning a master's degree?
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                    Start with your completed degree, institution, transcript and intended specialisation. A recognised qualification matters, but so does the academic relationship between your previous study and the new programme.
                  </p>
                </div>
                <a
                  href="#master"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF4D6D] hover:underline shrink-0"
                >
                  <span>Check master requirements</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-6 sm:p-7 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0B1B3A]" />
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      Not ready on language or entry requirements?
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                    Investigate the specific preparation required. That might involve language study, further academic preparation or, where applicable, Studienkolleg. A preparation route is not an admission guarantee.
                  </p>
                </div>
                <a
                  href="#applications"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF4D6D] hover:underline shrink-0"
                >
                  <span>Explore preparatory steps</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Uncertainty paragraph */}
            <div className="mt-8 p-6 rounded-2xl bg-white border border-slate-200 text-slate-800 text-sm sm:text-base leading-relaxed">
              <strong className="text-[#0B1B3A]">Unsure which applies?</strong> Share your qualification names and study history in the assessment. The first job is to identify the questions that need answering, not to push you towards a convenient intake.
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. BACHELOR'S ENTRY (Subtle surface; anchor #bachelor) */}
        {/* ========================================================================= */}
        <section id="bachelor" className="scroll-mt-36 bg-slate-50/70 py-16 sm:py-20 lg:py-24 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
              {/* 8-col Narrative */}
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md mb-3 inline-block">
                    Undergraduate Admission
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                    Bachelor's entry: check your actual qualification
                  </h2>
                </div>

                <div className="space-y-4 text-slate-700 text-base leading-relaxed">
                  <p>
                    German undergraduate entry depends on whether your education provides a recognised higher education entrance qualification and whether access is general or subject-restricted. Your certificate type, results, subjects and previous higher education can change the answer.
                  </p>
                  <p>
                    Use the DAAD admission database as an initial guide, then check the target university's published requirements. Its results are nonbinding and intended for undergraduate eligibility; the university makes the admission decision.
                  </p>
                  <p>
                    Some applicants need Studienkolleg, a preparatory course followed by an assessment examination. It is not compulsory for every Pakistani applicant. Where required, the course pathway must match the intended subject, and language and entrance-test requirements need checking separately.
                  </p>
                  <p className="font-semibold text-slate-900">
                    Studienkolleg commonly involves German-language preparation. An English-taught degree does not mean every preparatory stage is available in English. Confirm the route before paying for a language course or private preparation provider.
                  </p>
                </div>
              </div>

              {/* 4-col Margin Note linking DAAD */}
              <div className="lg:col-span-4">
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#FF4D6D]" />
                    <h3 className="text-sm font-bold text-[#0B1B3A] uppercase tracking-wider">
                      DAAD Database Orientation
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    The DAAD Admission Database provides nonbinding criteria for evaluating international secondary school certificates for German universities.
                  </p>
                  <div className="pt-2 border-t border-slate-100">
                    <a
                      href="https://www.daad.de/en/studying-in-germany/requirements/admission-database/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF4D6D] hover:underline"
                    >
                      <span>Open DAAD Admission Database</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. MASTER'S ENTRY (White; anchor #master) */}
        {/* ========================================================================= */}
        <section id="master" className="scroll-mt-36 bg-white py-16 sm:py-20 lg:py-24 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md mb-3 inline-block">
                Postgraduate Selection
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Master's entry: subject fit matters
              </h2>
            </div>

            {/* Transcript-to-Prerequisite Visual Card */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 mb-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white border border-slate-200">
                  <div className="text-xs font-bold text-[#FF4D6D] uppercase tracking-wider mb-1">
                    Completed Transcript
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    Actual Modules Studied
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Undergraduate credit distribution, specific subject hours and verified graduation status.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200">
                  <div className="text-xs font-bold text-[#0B1B3A] uppercase tracking-wider mb-1">
                    Prerequisite Matching
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    Programme Prerequisites
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Mandatory mathematics, theoretical or specialised credits required by the target department.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200">
                  <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                    Department Decision
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    Faculty Assessment
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Consecutive degree alignment, minimum grading thresholds and faculty admission boards.
                  </p>
                </div>
              </div>
            </div>

            {/* Copy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-700 text-base leading-relaxed">
              <div className="space-y-4">
                <p>
                  For a master's, universities generally expect a recognised undergraduate qualification equivalent to a German bachelor's in a related subject. Each programme sets its own criteria, including grades, language evidence and any additional experience or documents.
                </p>
                <p>
                  Read beyond “engineering”, “business” or “computer science” in the course title. Compare the published prerequisites with the modules you actually studied. Where a university specifies subject credits or particular coursework, your transcript must support that match.
                </p>
              </div>

              <div className="space-y-4">
                <p>
                  A degree title alone cannot establish eligibility. Neither can a single advertised CGPA threshold across Germany. Changing fields may be possible for certain programmes, but it must be justified by that programme's rules—not by a general promise from a consultant.
                </p>
                <p className="font-semibold text-slate-900">
                  If your degree is unfinished, check whether the university accepts provisional applications and what must be completed before enrolment. Do not assume every institution accepts final-semester applicants.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. FEES (Subtle surface; anchor #fees) */}
        {/* ========================================================================= */}
        <section id="fees" className="scroll-mt-36 bg-slate-50/70 py-16 sm:py-20 lg:py-24 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md mb-3 inline-block">
                Tuition &amp; Exceptions
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Public or private? Compare the whole commitment
              </h2>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Public Universities
                </span>
                <h3 className="text-lg font-bold text-[#0B1B3A]">
                  Tuition-free in most states
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Many bachelor's and most master's programmes at state institutions generally have no tuition fees. Semester contributions still apply. Some programmes and locations charge tuition, so “public” is not a reliable substitute for a fee check.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  State Exceptions
                </span>
                <h3 className="text-lg font-bold text-[#0B1B3A]">
                  Baden-Württemberg &amp; Bavaria
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Baden-Württemberg charges tuition to many non-EU students, subject to applicable exemptions. In Bavaria, individual institutions can charge non-EU international students. Certain continuing-education master's programmes also charge fees. Check your university, programme and applicant category.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0B1B3A] bg-slate-100 px-2 py-0.5 rounded">
                  Private Institutions
                </span>
                <h3 className="text-lg font-bold text-[#0B1B3A]">
                  Substantial commercial tuition
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Tuition can be a substantial part of the budget. Confirm institutional recognition, the qualification awarded, total charges, payment dates and refund terms. A scholarship discount does not automatically make the full course affordable.
                </p>
              </div>
            </div>

            <div className="mt-8 p-5 rounded-xl bg-white border-l-4 border-[#0B1B3A] text-slate-800 text-sm sm:text-base leading-relaxed">
              Compare the entire degree cost alongside course content, teaching language, entry requirements and city expenses. Do not choose solely because a deposit seems manageable.
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. APPLICATION ROUTES (White; anchor #applications) */}
        {/* ========================================================================= */}
        <section id="applications" className="scroll-mt-36 bg-white py-16 sm:py-20 lg:py-24 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md mb-3 inline-block">
                Application Channels
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Direct application, uni-assist or VPD?
              </h2>
            </div>

            {/* Three-step horizontal flow highlighting alternatives */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90">
                <div className="text-xs font-bold text-[#0B1B3A] uppercase tracking-wider mb-1">
                  Channel A
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Direct university portal
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Some universities manage international applications entirely through their own proprietary online admissions portal.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90">
                <div className="text-xs font-bold text-[#FF4D6D] uppercase tracking-wider mb-1">
                  Channel B
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  uni-assist centralised application
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Many universities mandate submitting certificates, attestations and fees directly through uni-assist for initial credential evaluation.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90">
                <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                  Channel C
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  VPD + University application
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  You obtain preliminary review documentation (VPD) from uni-assist, then submit the actual application directly to the university portal before deadline.
                </p>
              </div>
            </div>

            {/* Copy */}
            <div className="space-y-4 text-slate-700 text-base leading-relaxed max-w-4xl">
              <p>
                The university's instructions determine where you apply. Some applications go directly to the university. Others go through uni-assist. Even a university that uses uni-assist may use different procedures for different applicants or programmes.
              </p>
              <p>
                Some universities require a VPD: preliminary review documentation issued by uni-assist. In that route, obtaining the VPD is not the final university application. You must also submit the university's application, with the required documents, before its deadline.
              </p>
              <p>
                Keep a separate checklist for each programme: portal, documents, language evidence, fees and deadlines. A VPD is not universal, and submitting to the wrong portal can leave an application incomplete.
              </p>
              <div className="p-5 rounded-xl bg-slate-50 border-l-4 border-[#0B1B3A] text-slate-800 text-sm sm:text-base font-medium">
                For Pakistan, uni-assist's country guidance includes school certificates and subjects/grades, applicable degree documents with HEC attestation stamps, and the minimum grade required for the degree to be awarded. Follow the current document instructions for your case.
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. BUDGET (Subtle surface; anchor #budget) */}
        {/* ========================================================================= */}
        <section id="budget" className="scroll-mt-36 bg-slate-50/70 py-16 sm:py-20 lg:py-24 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
              {/* Left Column (5 cols): Narrative + Checklist Ledger */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md mb-3 inline-block">
                    Financial Planning
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                    Build a budget your family can understand
                  </h2>
                </div>

                <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
                  <p>
                    Separate money you spend from funds you must demonstrate. Visa funding evidence is not a university tuition fee and is not a payment to ProConsulting. A blocked account, where used, holds funds for living expenses under withdrawal conditions; provider charges are separate.
                  </p>
                  <p>
                    The German mission in Pakistan publishes accepted financing routes and current requirements. These include a blocked account, a qualifying declaration of commitment and qualifying official scholarship evidence. Confirm which evidence is accepted for your circumstances before transferring money.
                  </p>
                </div>

                {/* Family Budget Checklist Ledger */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                  <h3 className="font-bold text-[#0B1B3A] text-sm sm:text-base">
                    Use this budget checklist with your family:
                  </h3>
                  <ul className="space-y-2.5 text-xs text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FF4D6D] shrink-0 mt-0.5" />
                      <span>Tuition, where applicable, and recurring semester contributions.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FF4D6D] shrink-0 mt-0.5" />
                      <span>Application charges, document preparation, translations and attestations.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FF4D6D] shrink-0 mt-0.5" />
                      <span>Language preparation, examinations and any required preparatory study.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FF4D6D] shrink-0 mt-0.5" />
                      <span>Visa-related charges, insurance, travel and arrival expenses.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FF4D6D] shrink-0 mt-0.5" />
                      <span>Rent, deposit, utilities, food, transport and study materials.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FF4D6D] shrink-0 mt-0.5" />
                      <span>Funding evidence, account charges and a contingency reserve.</span>
                    </li>
                  </ul>

                  <p className="text-xs text-slate-800 font-medium pt-3 border-t border-slate-100">
                    Avoid counting blocked-account funds twice as both additional fees and living expenditure. Equally, do not assume the official minimum will cover every city's actual costs. Keep a separate estimate for initial cash needs and recurring expenses.
                  </p>
                </div>
              </div>

              {/* Right Column (7 cols): Germany Budget Tool */}
              <div className="lg:col-span-7">
                <GermanyBudgetTool />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 9. SCHOLARSHIPS (White) */}
        {/* ========================================================================= */}
        <section className="bg-white py-16 sm:py-20 lg:py-24 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Scholarship Realities
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Scholarships help—but need their own plan
            </h2>

            <div className="space-y-5 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                Scholarships differ in eligibility, deadlines, coverage and selection criteria. Some contribute to tuition; others support living costs. A tuition reduction does not necessarily meet visa funding requirements or pay for accommodation.
              </p>

              <p>
                Check each award's official terms and whether it is accepted as financial evidence. The Pakistan mission distinguishes qualifying official scholarships from other awards; a university discount should never be presented as automatically satisfying that requirement.
              </p>

              <p>
                If you plan to study in Germany from Pakistan, build a route that remains understandable even if a scholarship does not come through. Do not make an essential payment on the assumption that an unconfirmed award will arrive later.
              </p>

              {/* EXACT PROTECTED HONESTY SENTENCE */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1B3A] text-white">
                <div className="text-lg sm:text-2xl font-extrabold leading-snug tracking-tight text-white">
                  No consultant can guarantee a scholarship, admission or visa, and we do not.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 10. LANGUAGE & HOUSING (Subtle surface: bg-slate-50/70) */}
        {/* ========================================================================= */}
        <section className="bg-slate-50/70 py-16 sm:py-20 lg:py-24 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md mb-3 inline-block">
                Living &amp; Integration
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                English-taught does not mean German-free
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="p-7 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
                <h3 className="text-lg font-bold text-[#0B1B3A]">
                  Language requirements &amp; everyday German
                </h3>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                  Your chosen programme specifies the teaching language, accepted certificates and minimum results. English-taught courses require the English evidence they accept; German-taught courses require the relevant German evidence. Waivers must come from the university's rules, not an assumption about your previous school.
                </p>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                  German also matters outside lectures: finding accommodation, reading correspondence, attending appointments and exploring employment. Build practical language learning into your plan even when the degree is taught in English.
                </p>
              </div>

              <div className="p-7 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
                <h3 className="text-lg font-bold text-[#0B1B3A]">
                  Student housing &amp; accommodation search
                </h3>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                  Housing deserves early attention. Compare realistic rent and deposit costs in each city, research student accommodation and private options, and allow for temporary accommodation if needed. Verify the landlord, property and contract before sending money. Admission does not itself secure a room.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 11. VISA PREPARATION (White; anchor #visa) */}
        {/* ========================================================================= */}
        <section id="visa" className="scroll-mt-36 bg-white py-16 sm:py-20 lg:py-24 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Official Embassy Route
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Visa preparation follows the official process
            </h2>

            <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-7 sm:p-9 shadow-xs space-y-5 text-slate-700 text-base sm:text-lg leading-relaxed border-l-4 border-l-[#0B1B3A]">
              <p>
                Pakistani applicants should follow the German Missions in Pakistan's current student-visa instructions and the relevant Consular Services Portal process. The responsible mission depends on residence jurisdiction; check that before submitting.
              </p>

              <p>
                Your admission documents, educational history, financing and other required evidence must be consistent. The mission currently highlights past degree certificates, transcripts and tuition-payment evidence where applicable as mandatory, even if a portal field appears optional.
              </p>

              <p className="font-semibold text-slate-900">
                An offer letter is not a visa approval. Appointments, document requests and decisions are controlled by the authorities. Avoid non-refundable travel commitments based on an expected decision date, and check arrangements with your university if arrival may be delayed.
              </p>

              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-4 text-xs">
                <span className="font-bold text-[#0B1B3A]">Official Embassy Instructions:</span>
                <a
                  href="https://pakistan.diplo.de/pk-en/service/2-study-visa-seite-1676104"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#FF4D6D] hover:underline font-medium"
                >
                  <span>German Missions in Pakistan Student Visa Instructions</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 12. GUIDANCE STANDARDS (Subtle surface: bg-slate-50/70) */}
        {/* ========================================================================= */}
        <section className="bg-slate-50/70 py-16 sm:py-20 lg:py-24 border-b border-slate-200/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md mb-3 inline-block">
                Consultation Objective
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                What guidance should leave you with
              </h2>
            </div>

            <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
              Our Germany guidance is designed to turn a broad ambition into a route you can examine: an eligibility review, programme-fit questions, an application checklist and a clearer view of costs and dependencies.
            </p>

            <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
              For application support, agree the scope before paid work begins. Ask which programmes are covered, who submits each application, which charges are payable to third parties and what remains your responsibility. Keep access to your own accounts and copies of submissions.
            </p>

            {/* Explicit Before / Planning-Goal Contrast */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-base leading-relaxed">
              <div className="p-6 rounded-2xl bg-white border border-slate-200">
                <div className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                  Before planning
                </div>
                <p className="italic text-slate-800">
                  “Germany looks affordable, but we do not know the route.”
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200">
                <div className="text-xs font-bold uppercase tracking-wide text-[#0B1B3A] mb-2">
                  After careful planning
                </div>
                <p className="font-medium text-slate-900">
                  “We know which requirements need confirming, what documents are missing and which costs must be funded.”
                </p>
                <span className="block mt-2 text-xs text-slate-500">
                  This describes a planning goal, not a promised admission result.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 13. FREQUENTLY ASKED QUESTIONS (White; anchor #faq) */}
        {/* ========================================================================= */}
        <section id="faq" className="scroll-mt-36 bg-white py-16 sm:py-20 lg:py-24 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-36 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
                    Frequently Asked Questions
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                    Frequently asked questions
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Direct guidance on Studienkolleg, language requirements, blocked accounts and master's degree prerequisites.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-4">
                {GERMANY_FAQS.map((faq) => (
                  <details
                    key={faq.id}
                    className="group bg-slate-50 rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden transition-colors open:border-slate-300 open:bg-white"
                  >
                    <summary className="flex items-center justify-between gap-4 p-5 sm:p-6 cursor-pointer list-none select-none text-left font-bold text-slate-900 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]/30 min-h-[44px]">
                      <span>
                        {faq.id}. {faq.q}
                      </span>
                      <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
                    </summary>
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 pt-4">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 14. START WITH YOUR PROFILE (Subtle surface; anchor #assessment) */}
        {/* ========================================================================= */}
        <section id="assessment" className="scroll-mt-36 bg-slate-50/70 py-16 sm:py-20 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md mb-3 inline-block">
                Start Your Evaluation
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Start with your profile, not a promise
              </h2>
              <p className="text-base sm:text-lg text-slate-700 mt-4 leading-relaxed">
                Bring your qualification names, grades, intended subject, language level and approximate budget. You do not need a perfect shortlist to ask the first questions.
              </p>
            </div>

            <div>
              <Link
                to={GERMANY_SEO.ctaHref}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-md transition-all"
              >
                <span>{GERMANY_SEO.ctaText}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <strong>Notice:</strong> The initial assessment is free. Any paid support must be explained and agreed separately. Do not send passport scans, bank statements or payment details through an initial enquiry.
            </div>

            {/* Contact ProConsulting */}
            <div className="p-7 sm:p-9 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-5">
              <h3 className="text-xl font-bold text-[#0B1B3A]">
                Contact ProConsulting
              </h3>

              <div className="flex items-start gap-3 text-sm text-slate-700">
                <MapPin className="w-5 h-5 text-[#FF4D6D] shrink-0 mt-0.5" />
                <span>Vista Building, Second Floor, Office 203–204, I-8 Markaz, Islamabad.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <a
                  href="tel:+92516135834"
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center gap-3 hover:border-slate-300 transition-colors"
                >
                  <Phone className="w-5 h-5 text-[#FF4D6D]" />
                  <div>
                    <span className="block text-xs text-slate-500">Pakistan Landline</span>
                    <span className="text-sm font-bold text-slate-900">Pakistan: (051) 6135834</span>
                  </div>
                </a>

                <a
                  href="tel:+447432406993"
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center gap-3 hover:border-slate-300 transition-colors"
                >
                  <Phone className="w-5 h-5 text-[#FF4D6D]" />
                  <div>
                    <span className="block text-xs text-slate-500">UK Direct Line</span>
                    <span className="text-sm font-bold text-slate-900">UK: +44 7432 406993</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Official Guidance Source Registry */}
            <div className="pt-8 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Official Germany Guidance Sources
                </h4>
                <span className="text-xs text-slate-500">
                  Guidance last reviewed: {GERMANY_SEO.lastReviewedDate}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {GERMANY_OFFICIAL_SOURCES.map((src) => (
                  <a
                    key={src.id}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg border border-slate-200 hover:bg-white transition-colors flex items-start justify-between gap-2 group bg-slate-50"
                  >
                    <div>
                      <span className="font-semibold text-slate-800 group-hover:text-[#FF4D6D] transition-colors block">
                        {src.name}
                      </span>
                      <span className="text-slate-500 text-[11px] mt-0.5 line-clamp-1">
                        {src.description}
                      </span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FF4D6D] shrink-0 mt-0.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Bottom Action for Mobile */}
      {showMobileCta && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg md:hidden"
          style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
        >
          <Link
            to={GERMANY_SEO.ctaHref}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-md transition-colors"
          >
            <span>{GERMANY_SEO.ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      <Footer />
    </div>
  );
}
