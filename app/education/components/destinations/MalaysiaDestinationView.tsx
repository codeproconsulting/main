"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Building2,
  GraduationCap,
  FileCheck2,
  BookOpen,
  ChevronDown,
  Sparkles,
  Wallet,
  Landmark,
  ShieldCheck,
  Globe2,
  Compass,
  Scale,
  ChevronRight,
  Layers,
  HelpCircle,
  Plane,
} from "lucide-react";
import { Navbar } from "~/education/components/ui/Navbar";
import { Footer } from "~/education/components/ui/footer";
import {
  MALAYSIA_FAQS,
  MALAYSIA_SCENARIOS,
  MALAYSIA_SEO,
} from "~/education/lib/malaysiaDestinationData";

export function MalaysiaDestinationView() {
  const [activeAnchor, setActiveAnchor] = useState<string>("plans");
  const [showMobileCta, setShowMobileCta] = useState(true);
  const [hoveredFlowStep, setHoveredFlowStep] = useState<number | null>(null);
  const [hoveredRouteStage, setHoveredRouteStage] = useState<number | null>(null);
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const anchors = [
        "plans",
        "recognition",
        "scenarios",
        "costs",
        "student-pass",
        "work-funding",
        "guidance",
        "faqs",
        "assessment",
      ];
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
    { id: "plans", label: "Study Plans" },
    { id: "recognition", label: "Recognition" },
    { id: "scenarios", label: "Course Scenarios" },
    { id: "costs", label: "Actual Fees & Costs" },
    { id: "student-pass", label: "EMGS & Student Pass" },
    { id: "work-funding", label: "Work & Scholarships" },
    { id: "guidance", label: "Application Guidance" },
    { id: "faqs", label: "FAQs" },
  ];

  const recognitionNodes = [
    {
      num: 1,
      title: "AWARDING BODY",
      desc: "Local Malaysian institution vs overseas partner university",
      icon: Landmark,
      detail:
        "Confirm whether the degree parchment is issued directly by a Malaysian university or by an overseas partner institution. Legal awarding authority dictates credential status.",
    },
    {
      num: 2,
      title: "CAMPUS LOCATION",
      desc: "Main campus, branch campus, or multi-country arrangement",
      icon: Building2,
      detail:
        "Inspect which campus hosts your lectures and whether laboratory, clinical or practical modules require specific campus presence.",
    },
    {
      num: 3,
      title: "EXACT QUALIFICATION",
      desc: "Accreditation status, programme code, and degree level",
      icon: Sparkles,
      detail:
        "Check programme accreditation on official registries and verify course structure rather than relying only on the university's overseas name.",
    },
    {
      num: 4,
      title: "REGULATORY RECOGNITION",
      desc: "HEC Pakistan equivalence, PEC, PMDC or professional councils",
      icon: GraduationCap,
      detail:
        "If you intend to return to Pakistan, confirm equivalence rules for your discipline before enrolling, especially for regulated professions.",
    },
  ];

  const stageItems = [
    {
      stageNum: "Stage 01",
      title: "University Admission Offer",
      desc: "Academic document verification, conditional offer and official acceptance letter.",
      subText: "Step 1 of 3 · Academic Eligibility",
      icon: Building2,
    },
    {
      stageNum: "Stage 02",
      title: "EMGS Approval & VAL",
      desc: "Immigration file processing via EMGS and issuance of Visa Approval Letter before travel.",
      subText: "Step 2 of 3 · Immigration Clearance",
      icon: FileCheck2,
    },
    {
      stageNum: "Stage 03",
      title: "Student Pass Endorsement",
      desc: "Post-arrival medical check, passport submission and student pass sticker endorsement.",
      subText: "Step 3 of 3 · Legal Residence",
      icon: ShieldCheck,
    },
  ];

  const activeScenario = MALAYSIA_SCENARIOS[selectedScenarioIndex];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#FF4D6D]/15 selection:text-[#0B1B3A]">
      <Navbar />

      {/* Non-sticky Breadcrumb */}
      <div className="border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
            <Link to="/education" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <span aria-hidden className="text-slate-300">/</span>
            <Link to="/education/destinations" className="hover:text-slate-900 transition-colors">
              Destinations
            </Link>
            <span aria-hidden className="text-slate-300">/</span>
            <span className="text-slate-900 font-medium">Malaysia</span>
          </nav>
        </div>
      </div>

      <main>
        {/* ========================================================================= */}
        {/* S01: Hero (Two-column layout with visual image scene) */}
        {/* ========================================================================= */}
        <section className="relative bg-gradient-to-b from-slate-50/90 via-slate-50/50 to-white pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24 border-b border-slate-200/80 overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF4D6D]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-10 left-10 w-72 h-72 bg-[#0B1B3A]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Text Left (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200/90 shadow-2xs px-3.5 py-1.5 rounded-full mb-4">
                    <span className="w-2 h-2 rounded-full bg-[#FF4D6D] animate-pulse" />
                    <span>Study in Malaysia · Campus, Award &amp; Transfer Checks</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold text-[#0B1B3A] tracking-tight leading-[1.12]">
                    Study in Malaysia
                  </h1>
                </div>

                <p className="text-lg sm:text-xl font-medium text-slate-800 leading-relaxed">
                  A familiar university name does not answer every question about a Malaysian course. The campus, award and any transfer arrangement can change what you are actually buying.
                </p>

                <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                  ProConsulting helps you compare the course, awarding institution and full study plan. Start with a free assessment before you commit to a route you have not fully understood.
                </p>

                {/* Primary CTA and Microcopy */}
                <div className="pt-2 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <Link
                      to={MALAYSIA_SEO.ctaHref}
                      className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-md hover:shadow-lg shadow-pink-500/20 hover:scale-[1.01] transition-all min-h-[48px]"
                    >
                      <span>{MALAYSIA_SEO.ctaText}</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Know who awards your degree before you choose the campus.
                  </p>
                </div>
              </div>

              {/* Right Image (5 cols) with official Malaysia image */}
              <div className="lg:col-span-5">
                <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl bg-slate-900 group">
                  <img
                    src="/destinations/Malaysia.webp"
                    alt="Study in Malaysia - Campus and higher education"
                    className="w-full h-[380px] sm:h-[440px] object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3A] via-[#0B1B3A]/30 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-white/40">
                    <img
                      src="https://flagcdn.com/w40/my.png"
                      alt="Malaysia flag"
                      className="w-5 h-3.5 object-cover rounded-xs"
                    />
                    <span className="text-xs font-bold text-[#0B1B3A]">Malaysia</span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Award &amp; Route Checks
                    </span>
                  </div>

                  <div className="absolute bottom-0 inset-x-0 p-6 text-white space-y-2">
                    <h3 className="text-lg font-bold text-white">Malaysian Higher Education</h3>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      Local Malaysian awards, overseas branch campuses and international transfer routes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S02: Buyer Problem (With LEFT STICKY SUBNAV BOX as mandated by guidelines) */}
        {/* ========================================================================= */}
        <section id="plans" className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* LEFT SIDE: In-Page Navigation Sticky Box */}
              <aside className="lg:col-span-4">
                <div className="lg:sticky lg:top-24 rounded-3xl border border-slate-200/90 bg-slate-50/80 shadow-sm p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#0B1B3A] text-white flex items-center justify-center shadow-xs">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-[#0B1B3A] uppercase tracking-wider">
                          Malaysia Study Guide
                        </span>
                        <span className="text-[11px] text-slate-500">Navigation Menu</span>
                      </div>
                    </div>
                  </div>

                  <nav aria-label="Page navigation" className="space-y-1">
                    {navLinks.map((item) => {
                      const isActive = activeAnchor === item.id;
                      return (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                            isActive
                              ? "bg-[#0B1B3A] text-white shadow-xs"
                              : "text-slate-600 hover:text-slate-900 hover:bg-white"
                          }`}
                        >
                          <span>{item.label}</span>
                          <ChevronRight
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                              isActive ? "text-[#FF4D6D] translate-x-0.5" : "text-slate-400 opacity-60"
                            }`}
                          />
                        </a>
                      );
                    })}
                  </nav>

                  <div className="pt-3 border-t border-slate-200/80">
                    <Link
                      to={MALAYSIA_SEO.ctaHref}
                      className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-md hover:shadow-lg transition-all min-h-[44px]"
                    >
                      <span>Free Assessment</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </aside>

              {/* RIGHT SIDE: S02 Content */}
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                    Course Structuring
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                    One course name can describe different study plans
                  </h2>
                </div>

                <div className="space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
                  <div className="p-6 sm:p-7 rounded-2xl bg-slate-50/80 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all">
                    <p className="font-semibold text-slate-900 text-lg">
                      You may be comparing a Malaysian institution, an overseas branch campus or a programme involving study in more than one country. Read the actual arrangement before comparing the price.
                    </p>
                  </div>

                  <div className="p-6 sm:p-7 rounded-2xl bg-slate-50/80 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all">
                    <p>
                      Ask who awards the qualification, where you will study and whether a transfer is optional or required. If another campus is involved, check its{" "}
                      <Link
                        to="/education/services/admission"
                        className="text-[#FF4D6D] underline decoration-[#FF4D6D]/40 underline-offset-2 hover:decoration-[#FF4D6D] font-bold"
                      >
                        entry, fee and permission rules
                      </Link>{" "}
                      separately.
                    </p>
                  </div>

                  <div className="p-6 sm:p-7 rounded-2xl bg-amber-50/70 border border-amber-200/90 text-amber-950 font-medium shadow-2xs">
                    <p>
                      A transfer opportunity is not a guaranteed transfer. An overseas university name does not mean you receive permission to study in that university’s home country.
                    </p>
                  </div>
                </div>

                {/* Course Checklist */}
                <div className="p-6 sm:p-7 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
                    <div className="w-8 h-8 rounded-lg bg-[#FF4D6D]/10 text-[#FF4D6D] flex items-center justify-center">
                      <Scale className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-[#0B1B3A] text-base">
                      Study Plan Checklist
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs text-slate-700">
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Award Issuer</span>
                      </div>
                      <span className="text-slate-600 block">Check whether the degree is awarded by local institution or overseas partner.</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Transfer Rules</span>
                      </div>
                      <span className="text-slate-600 block">Verify if progression to overseas campus is guaranteed or requires separate entry.</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Immigration</span>
                      </div>
                      <span className="text-slate-600 block">Foreign campus name does not confer immigration rights in its home country.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S03: Useful Comparison (Interactive Flow with Hover In / Hover Out) */}
        {/* ========================================================================= */}
        <section id="recognition" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Qualification Status
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Recognition starts with the exact qualification
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
              <div className="lg:col-span-6 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
                <p>
                  Check the programme, campus and award rather than relying only on an institution’s name. Accreditation and professional recognition answer different questions. Neither should be assumed from an advertisement.
                </p>
                <p>
                  If you intend to return to Pakistan, establish how the specific qualification will be treated. For medicine, engineering or another regulated field, check the relevant professional authority as well.
                </p>
                <div className="p-5 rounded-2xl bg-white border-l-4 border-l-[#FF4D6D] border border-slate-200/80 shadow-xs">
                  <p className="font-semibold text-slate-900 text-base">
                    English is widely used in Malaysian higher education, but the course still sets its own language rules. Confirm the teaching language and accepted evidence for your intended intake.
                  </p>
                </div>
              </div>

              {/* Award Decision Interactive Flow - Hover In / Hover Out (Rule 2 Compliance) */}
              <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-xs sm:text-sm font-bold text-[#0B1B3A] uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#FF4D6D]" />
                    <span>Degree Verification Flow</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">Hover to explore</span>
                </div>

                <div className="space-y-3">
                  {recognitionNodes.map((step) => {
                    const isHovered = hoveredFlowStep === step.num;
                    const Icon = step.icon;
                    return (
                      <div
                        key={step.num}
                        onMouseEnter={() => setHoveredFlowStep(step.num)}
                        onMouseLeave={() => setHoveredFlowStep(null)}
                        className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                          isHovered
                            ? "bg-rose-50/60 border-[#FF4D6D] border-l-4 border-l-[#FF4D6D] shadow-md ring-1 ring-[#FF4D6D]/20 -translate-y-0.5"
                            : "bg-slate-50/70 border-slate-200/80 hover:bg-white hover:border-slate-300 hover:border-l-4 hover:border-l-slate-400"
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <span
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5 transition-colors duration-200 ${
                              isHovered
                                ? "bg-[#FF4D6D] text-white shadow-xs"
                                : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {step.num}
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <strong
                                className={`block text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${
                                  isHovered ? "text-[#FF4D6D]" : "text-slate-900"
                                }`}
                              >
                                {step.title}
                              </strong>
                              <Icon
                                className={`w-4 h-4 transition-colors duration-200 ${
                                  isHovered ? "text-[#FF4D6D]" : "text-slate-400"
                                }`}
                              />
                            </div>
                            <span className="text-xs sm:text-sm text-slate-700 font-medium block mt-0.5">
                              {step.desc}
                            </span>
                            {isHovered && (
                              <p className="mt-2 text-xs text-slate-600 bg-white/95 p-2.5 rounded-xl border border-rose-100 transition-all duration-200">
                                {step.detail}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S04: Synthetic Walkthrough (Three Scenarios with Card Hover States) */}
        {/* ========================================================================= */}
        <section id="scenarios" className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Planning Walkthrough
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Explore three course arrangements
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Illustrative planning scenario. These are synthetic examples, not offers, client work or confirmed partnerships.
              </p>
            </div>

            {/* Interactive Tab Selector */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50/80 border border-slate-200/90 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
                  Choose a scenario
                </span>
                <div
                  role="tablist"
                  aria-label="Course arrangement scenarios"
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-1.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs"
                >
                  {MALAYSIA_SCENARIOS.map((item, idx) => {
                    const isSelected = selectedScenarioIndex === idx;
                    return (
                      <button
                        key={item.id}
                        role="tab"
                        aria-selected={isSelected}
                        aria-controls={`panel-${item.id}`}
                        id={`tab-${item.id}`}
                        onClick={() => setSelectedScenarioIndex(idx)}
                        className={`min-h-[48px] px-4 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all text-center flex items-center justify-center gap-2 ${
                          isSelected
                            ? "bg-[#0B1B3A] text-white shadow-md"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-[#FF4D6D]" : "bg-slate-300"}`} />
                        <span>{item.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Scenario Display Panel */}
              <div
                role="tabpanel"
                id={`panel-${activeScenario.id}`}
                aria-labelledby={`tab-${activeScenario.id}`}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Scenario: {activeScenario.title}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold border bg-pink-50 text-[#FF4D6D] border-pink-200">
                    Arrangement #{selectedScenarioIndex + 1}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded bg-[#0B1B3A] text-white shrink-0 mt-0.5">
                      Input
                    </span>
                    <p className="text-base sm:text-lg font-semibold text-[#0B1B3A]">
                      {activeScenario.input}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded bg-slate-100 text-slate-700 shrink-0 mt-0.5 border border-slate-200">
                      Response
                    </span>
                    <p className="text-sm sm:text-base leading-relaxed text-slate-700">
                      {activeScenario.response}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 shrink-0 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                    Status
                  </span>
                  <p className="text-sm sm:text-base font-bold text-[#0B1B3A]">
                    {activeScenario.status}
                  </p>
                </div>
              </div>

              <div className="pt-2 text-center">
                <p className="text-xs text-slate-500">
                  This preview explains options. It does not confirm accreditation or a place.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S05: Cost and Funding Explanation */}
        {/* ========================================================================= */}
        <section id="costs" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              {/* Payment-sequence rail beside prose */}
              <div className="lg:col-span-5 order-2 lg:order-1">
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
                  <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-[#FF4D6D]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Payment Sequence Rail
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">Timing &amp; Scope</span>
                  </div>

                  <div className="space-y-3.5">
                    {[
                      { step: "01", label: "Tuition, institutional deposit and course fees" },
                      { step: "02", label: "Accommodation, food and daily living costs" },
                      { step: "03", label: "Medical insurance, travel and application charges" },
                      { step: "04", label: "Immigration financial evidence (EMGS approval)" },
                      { step: "05", label: "Multi-country tuition and living costs if transferring" },
                    ].map((item) => (
                      <div
                        key={item.step}
                        className="flex items-center gap-3.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all"
                      >
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold border bg-white text-[#0B1B3A] border-slate-200 shadow-2xs shrink-0">
                          {item.step}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-slate-800">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
                    Compare the full route in writing before judging affordability.
                  </div>
                </div>
              </div>

              {/* Prose */}
              <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                    Total Cost Overview
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                    A lower starting fee is not the whole-course cost
                  </h2>
                </div>

                <div className="space-y-5 text-slate-700 text-base sm:text-lg leading-relaxed max-w-prose">
                  <p>
                    Compare the full route in writing. Include tuition, accommodation, daily costs, insurance, travel and required application charges. Check when each payment falls due.
                  </p>
                  <p>
                    A transfer plan may introduce another country’s tuition and living costs. Do not judge it only by the first stage in Malaysia. Ask what happens if you complete the course without transferring.
                  </p>
                  <p>
                    Keep immigration financial evidence separate from your household budget. Confirm current requirements through the appropriate process. Future work income should not be the missing piece that makes the plan appear affordable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S06: Next Decision (Stages with Stage Badges & Dynamic Hover States) */}
        {/* ========================================================================= */}
        <section id="student-pass" className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Immigration Separation
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                An offer is not a student pass
              </h2>
            </div>

            <div className="space-y-5 text-slate-700 text-base sm:text-lg leading-relaxed max-w-4xl mb-10">
              <p>
                Admission and immigration approval are different steps. The EMGS process and Malaysian immigration requirements need their own review for your institution and circumstances.
              </p>
              <p>
                Confirm the application sequence before booking travel. An offer letter does not by itself establish permission to enter Malaysia or begin study. Follow the current arrival and student-pass instructions that apply to you.
              </p>
              <p>
                If a parent or partner plans to accompany you, check the separate conditions first. Do not assume that every student, course or family member qualifies.
              </p>
            </div>

            {/* Three Stage Cards with Rule 3 Compliant Badges & Hover States */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {stageItems.map((stage, idx) => {
                const stageIndex = idx + 1;
                const isHovered = hoveredRouteStage === stageIndex;
                const Icon = stage.icon;
                return (
                  <div
                    key={stage.stageNum}
                    onMouseEnter={() => setHoveredRouteStage(stageIndex)}
                    onMouseLeave={() => setHoveredRouteStage(null)}
                    className={`p-7 rounded-3xl border transition-all duration-300 relative flex flex-col justify-between ${
                      isHovered
                        ? "bg-white border-[#FF4D6D] shadow-lg ring-1 ring-[#FF4D6D]/20 -translate-y-1"
                        : "bg-slate-50/70 border-slate-200/90 hover:bg-white hover:border-slate-300 hover:shadow-md"
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors duration-200 ${
                            isHovered
                              ? "bg-[#FF4D6D] text-white shadow-xs"
                              : "bg-[#0B1B3A] text-white"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span
                          className={`text-xs font-extrabold px-3 py-1 rounded-full border transition-colors duration-200 ${
                            isHovered
                              ? "bg-pink-50 text-[#FF4D6D] border-pink-200"
                              : "bg-white text-slate-600 border-slate-200"
                          }`}
                        >
                          {stage.stageNum}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-[#0B1B3A]">
                        {stage.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {stage.desc}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-100 flex items-center text-xs font-semibold text-slate-500">
                      <span>{stage.subText}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
              <span className="text-slate-600">EMGS process and Malaysian immigration requirements require independent checks.</span>
              <Link
                to="/education/services/visa"
                className="text-[#FF4D6D] hover:text-[#e03b5b] inline-flex items-center gap-1.5 font-bold"
              >
                Review ProConsulting visa support
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S07: Longer-Term Decision (Work & Scholarships Realities) */}
        {/* ========================================================================= */}
        <section id="work-funding" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Work &amp; Post-Study Context
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Keep scholarships and work in their proper place
              </h2>
            </div>

            {/* Two Visual Paths */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {/* Path 1 */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-11 h-11 rounded-2xl bg-pink-50 text-[#FF4D6D] flex items-center justify-center font-bold border border-pink-100">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0B1B3A]">
                    Scholarships &amp; Tuition Coverage
                  </h3>
                  <p className="text-slate-700 text-base leading-relaxed">
                    Check scholarship eligibility with the institution or funder. Confirm coverage, renewal conditions and any separate application. A fee discount may leave most living and other costs unpaid.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <Link
                    to="/education/services/scholarships"
                    className="text-xs font-bold text-[#FF4D6D] hover:underline inline-flex items-center gap-1.5"
                  >
                    Explore scholarship guidance
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Path 2 */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-11 h-11 rounded-2xl bg-slate-100 text-[#0B1B3A] flex items-center justify-center font-bold border border-slate-200">
                    <Scale className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0B1B3A]">
                    Work Restrictions &amp; Return Value
                  </h3>
                  <div className="space-y-3 text-slate-700 text-base leading-relaxed">
                    <p>
                      Student work is restricted and subject to conditions. Do not treat Malaysia as a route where casual work will automatically pay your course fees.
                    </p>
                    <p>
                      Any permission after graduation needs a separate nationality and eligibility check. It is not a benefit to assume from enrolment. Choose a course whose learning still matters if you return home.
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-500">
                    Compliant planning without casual work assumptions
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S08: Service-Specific Ask */}
        {/* ========================================================================= */}
        <section id="guidance" className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-700">
              Clear Advice Scope
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Choose with a clearer view of the whole route
            </h2>

            <div className="space-y-5 text-slate-700 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              <p>
                Use the free assessment to discuss your subject, previous study and the course arrangement you are considering. Explain whether recognition, affordability or a possible transfer is your main concern.
              </p>
              <p>
                ProConsulting provides admission guidance and student visa support. Ask which checks and application steps any paid scope will cover before you proceed. You remain entitled to clear answers about what is uncertain.
              </p>
            </div>

            <div className="pt-4 flex flex-col items-center gap-3.5">
              <Link
                to={MALAYSIA_SEO.ctaHref}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-base text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-md hover:shadow-lg shadow-pink-500/20 transition-all min-h-[48px]"
              >
                <span>{MALAYSIA_SEO.ctaText}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/education/services"
                className="text-xs sm:text-sm text-slate-500 hover:text-slate-900 underline underline-offset-4 pt-1 font-medium"
              >
                Explore ProConsulting education services
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S09: FAQ (Rule 4 Compliance: Modern Rounded-3xl Cards with Pink Accent) */}
        {/* ========================================================================= */}
        <section id="faqs" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-700">
                <HelpCircle className="w-3.5 h-3.5 text-[#FF4D6D]" />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Questions before you commit
              </h2>
            </div>

            {/* Native details accordion with polished UI and SSR preservation */}
            <div className="space-y-4">
              {MALAYSIA_FAQS.map((faq, index) => (
                <details
                  key={faq.id}
                  open={index === 0}
                  className="group rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 transition-all duration-200 hover:border-slate-300 hover:shadow-xs open:border-[#FF4D6D]/40 open:shadow-md open:ring-1 open:ring-[#FF4D6D]/15"
                >
                  <summary className="flex cursor-pointer items-center justify-between text-base sm:text-lg font-bold text-[#0B1B3A] list-none focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#FF4D6D] rounded-xl">
                    <span className="pr-4">{faq.q}</span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-transform duration-300 group-open:rotate-180 group-open:bg-[#FF4D6D] group-open:text-white">
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </summary>
                  <div className="mt-4 border-t border-slate-100 pt-4 text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S10: Final Assessment Invitation */}
        {/* ========================================================================= */}
        <section
          id="assessment"
          className="py-16 sm:py-24 bg-[#0B1B3A] text-white relative overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold uppercase tracking-wider text-pink-300">
              Start Free Assessment
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Understand the award before choosing the route
            </h2>

            <div className="space-y-4 text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              <p>
                Before committing to a Malaysian course, know where it leads and who awards it. Tell us whether you are considering a local award, branch campus or transfer arrangement.
              </p>
              <p>
                Use the free assessment to discuss the questions that matter to your choice. Ask about the full route before you focus on the starting fee.
              </p>
            </div>

            <div className="pt-4 flex flex-col items-center gap-3.5">
              <Link
                to={MALAYSIA_SEO.ctaHref}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-base text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-lg shadow-pink-500/30 hover:shadow-xl transition-all min-h-[48px]"
              >
                <span>{MALAYSIA_SEO.ctaText}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-xs text-slate-400 font-medium pt-2 max-w-md">
                No consultant can guarantee a scholarship, admission or visa, and we do not.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Sticky Mobile CTA Bar */}
      {showMobileCta && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:hidden shadow-lg safe-area-pb">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#0B1B3A] truncate">Study in Malaysia</p>
              <p className="text-[11px] text-slate-500 truncate">Course &amp; Route Guidance</p>
            </div>
            <Link
              to={MALAYSIA_SEO.ctaHref}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shrink-0 min-h-[44px]"
            >
              Free Assessment
            </Link>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
