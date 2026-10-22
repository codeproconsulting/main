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
} from "lucide-react";
import { Navbar } from "~/education/components/ui/Navbar";
import { Footer } from "~/education/components/ui/footer";
import {
  FINLAND_FAQS,
  FINLAND_SCENARIOS,
  FINLAND_SEO,
} from "~/education/lib/finlandDestinationData";

export function FinlandDestinationView() {
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
    { id: "plans", label: "Course Choice" },
    { id: "recognition", label: "University vs UAS" },
    { id: "scenarios", label: "Shortlist Scenarios" },
    { id: "costs", label: "Tuition & Rent" },
    { id: "student-pass", label: "Application & Permit" },
    { id: "work-funding", label: "Work & Long-Term" },
    { id: "guidance", label: "Decision Guidance" },
    { id: "faqs", label: "FAQs" },
  ];

  const institutionDistinctions = [
    {
      num: 1,
      title: "INSTITUTION TYPE",
      desc: "Academic Research University vs University of Applied Sciences (UAS)",
      icon: Landmark,
      detail:
        "Finnish research universities emphasize scientific theory and research progression, whereas Universities of Applied Sciences (UAS / AMK) focus on practical, career-connected training.",
    },
    {
      num: 2,
      title: "PRIOR DEGREE & BACKGROUND",
      desc: "Specific subject prerequisites, tests, and relevant work experience",
      icon: BookOpen,
      detail:
        "Master's programmes at UAS frequently mandate 24 months of relevant professional work experience after bachelor's completion. Research universities require specific academic credit matches.",
    },
    {
      num: 3,
      title: "APPLICATION ROUTE",
      desc: "Joint national application window vs direct separate intake",
      icon: Sparkles,
      detail:
        "Finnish higher education uses Studyinfo for both joint application rounds and separate institutional application rounds. Application dates and intake rules differ by programme.",
    },
    {
      num: 4,
      title: "POST-STUDY & RETURN VALUE",
      desc: "Professional qualification value in Finland and equivalence in Pakistan",
      icon: GraduationCap,
      detail:
        "Establish how the Finnish qualification will be evaluated back in Pakistan by HEC or regulatory councils, ensuring the course serves your long-term plans in either scenario.",
    },
  ];

  const stageItems = [
    {
      stageNum: "Stage 01",
      title: "Studyinfo Application",
      desc: "Submit credentials during joint application or separate institutional admission rounds.",
      subText: "Step 1 of 3 · Academic Application",
      icon: Building2,
    },
    {
      stageNum: "Stage 02",
      title: "Admission Offer & Fee",
      desc: "Receive university offer letter, confirm study place and arrange initial tuition deposit.",
      subText: "Step 2 of 3 · Institutional Offer",
      icon: FileCheck2,
    },
    {
      stageNum: "Stage 03",
      title: "Migri Residence Permit",
      desc: "File student residence permit application with verified maintenance funds and private health insurance.",
      subText: "Step 3 of 3 · Legal Residence",
      icon: ShieldCheck,
    },
  ];

  const activeScenario = FINLAND_SCENARIOS[selectedScenarioIndex];

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
            <span className="text-slate-900 font-medium">Finland</span>
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
                    <span>Study in Finland · University vs UAS, Tuition &amp; Residence</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold text-[#0B1B3A] tracking-tight leading-[1.12]">
                    Study in Finland
                  </h1>
                </div>

                <p className="text-lg sm:text-xl font-medium text-slate-800 leading-relaxed">
                  A university ranking cannot tell you whether a course suits your next step. In Finland, the choice between a university and a university of applied sciences deserves a closer look.
                </p>

                <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                  ProConsulting helps you compare your academic background, course options and funding position. Start with a free assessment, then decide which applications deserve your time.
                </p>

                {/* Primary CTA and Microcopy */}
                <div className="pt-2 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <Link
                      to={FINLAND_SEO.ctaHref}
                      className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-md hover:shadow-lg shadow-pink-500/20 hover:scale-[1.01] transition-all min-h-[48px]"
                    >
                      <span>{FINLAND_SEO.ctaText}</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Choose the right kind of Finnish degree before you commit.
                  </p>
                </div>
              </div>

              {/* Right Image (5 cols) with official Finland image */}
              <div className="lg:col-span-5">
                <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl bg-slate-900 group">
                  <img
                    src="/destinations/Finland.webp"
                    alt="Study in Finland - University campus and modern academic environment"
                    className="w-full h-[380px] sm:h-[440px] object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3A] via-[#0B1B3A]/30 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-white/40">
                    <img
                      src="https://flagcdn.com/w40/fi.png"
                      alt="Finland flag"
                      className="w-5 h-3.5 object-cover rounded-xs"
                    />
                    <span className="text-xs font-bold text-[#0B1B3A]">Finland</span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Nordic Degree System
                    </span>
                  </div>

                  <div className="absolute bottom-0 inset-x-0 p-6 text-white space-y-2">
                    <h3 className="text-lg font-bold text-white">Finnish Higher Education</h3>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      Research universities and universities of applied sciences across Helsinki, Tampere, Turku and Oulu.
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
              {/* LEFT SIDE: In-Page Navigation Sticky Box (Rule 1 Compliance) */}
              <aside className="lg:col-span-4">
                <div className="lg:sticky lg:top-24 rounded-3xl border border-slate-200/90 bg-slate-50/80 shadow-sm p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#0B1B3A] text-white flex items-center justify-center shadow-xs">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-[#0B1B3A] uppercase tracking-wider">
                          Finland Study Guide
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
                      to={FINLAND_SEO.ctaHref}
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
                    Academic Direction
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                    A good destination can still be the wrong course
                  </h2>
                </div>

                <div className="space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
                  <div className="p-6 sm:p-7 rounded-2xl bg-slate-50/80 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all">
                    <p className="font-semibold text-slate-900 text-lg">
                      A research-focused degree and an applied programme can serve different goals. Look at the modules, teaching style and entry rules before choosing either.
                    </p>
                  </div>

                  <div className="p-6 sm:p-7 rounded-2xl bg-slate-50/80 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all">
                    <p>
                      For a student seeking advanced research, the research environment matters. For someone changing careers, the starting skills and practical content may matter more. Neither route is automatically the better choice.
                    </p>
                  </div>

                  <div className="p-6 sm:p-7 rounded-2xl bg-amber-50/70 border border-amber-200/90 text-amber-950 font-medium shadow-2xs">
                    <p>
                      Ask what you will learn that your current qualification does not cover. Then consider how you would use that learning if you returned to Pakistan.
                    </p>
                  </div>
                </div>

                {/* Course Comparison Checklist */}
                <div className="p-6 sm:p-7 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
                    <div className="w-8 h-8 rounded-lg bg-[#FF4D6D]/10 text-[#FF4D6D] flex items-center justify-center">
                      <Scale className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-[#0B1B3A] text-base">
                      Course Fit Checklist
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs text-slate-700">
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Research Fit</span>
                      </div>
                      <span className="text-slate-600 block">Check research areas and faculty supervision for academic continuation.</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Applied UAS</span>
                      </div>
                      <span className="text-slate-600 block">Review industry-practical projects and professional experience prerequisites.</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Return Value</span>
                      </div>
                      <span className="text-slate-600 block">Confirm that learning outcomes remain purposeful if returning home.</span>
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
                Higher Education Structure
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Compare universities and universities of applied sciences
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
              <div className="lg:col-span-6 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
                <p>
                  Universities and universities of applied sciences are distinct parts of Finnish higher education. Compare the actual award and entry requirements, rather than treating the labels as interchangeable.
                </p>
                <p>
                  Some programmes may require prior subjects, tests or relevant experience. An English-taught course still has its own language evidence rules. Your grades alone do not settle eligibility.
                </p>
                <div className="p-5 rounded-2xl bg-white border-l-4 border-l-[#FF4D6D] border border-slate-200/80 shadow-xs">
                  <p className="font-semibold text-slate-900 text-base">
                    Read the course page for your intended intake. Check the campus, study mode, teaching language and qualification awarded. For regulated careers, confirm recognition with the relevant professional authority before paying.
                  </p>
                </div>
              </div>

              {/* Institution Structure Interactive Flow - Hover In / Hover Out (Rule 2 Compliance) */}
              <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-xs sm:text-sm font-bold text-[#0B1B3A] uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#FF4D6D]" />
                    <span>Finnish Degree Verification Flow</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">Hover to explore</span>
                </div>

                <div className="space-y-3">
                  {institutionDistinctions.map((step) => {
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
        {/* S04: Synthetic Walkthrough (Three Scenarios) */}
        {/* ========================================================================= */}
        <section id="scenarios" className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Planning Walkthrough
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                See how a shortlist changes
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Illustrative planning scenario. This is an authored example, not a student case or an admission result.
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
                  aria-label="Planning scenarios"
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-1.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs"
                >
                  {FINLAND_SCENARIOS.map((item, idx) => {
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
                    Scenario #{selectedScenarioIndex + 1}
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
                  This preview does not assess eligibility or send your details.
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
                      { step: "01", label: "Tuition fee after scholarship or waiver discount" },
                      { step: "02", label: "Student housing, deposit and initial rent" },
                      { step: "03", label: "Daily food, utilities and local transport" },
                      { step: "04", label: "Comprehensive private health insurance coverage" },
                      { step: "05", label: "Migri maintenance funds evidence (separate from budget)" },
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
                    Plan for tuition, housing, food, insurance, travel and the first weeks after arrival.
                  </div>
                </div>
              </div>

              {/* Prose */}
              <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                    Financial Planning
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                    A tuition waiver does not pay the rent
                  </h2>
                </div>

                <div className="space-y-5 text-slate-700 text-base sm:text-lg leading-relaxed max-w-prose">
                  <p>
                    Finnish universities set their own scholarship and fee-waiver terms. Support may cover part or all of tuition while leaving living costs unpaid. Check the exact award before counting any saving.
                  </p>
                  <p>
                    Plan for tuition, housing, food, insurance, travel and the first weeks after arrival. Keep payment dates separate from the amount you need over the full course.
                  </p>
                  <p>
                    A residence application has its own funding and evidence requirements. A family budget is not a substitute for meeting those rules. Do not rely on finding a part-time job to close a funding gap.
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
                Application Sequence
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Know which step comes next
              </h2>
            </div>

            <div className="space-y-5 text-slate-700 text-base sm:text-lg leading-relaxed max-w-4xl mb-10">
              <p>
                An application, an admission offer and a residence permit are different steps. Acceptance by an institution does not grant permission to enter or live in Finland.
              </p>
              <p>
                Applications use the official Studyinfo service, with joint and separate application routes. Check the route and dates for each programme, rather than assuming one national deadline fits every course.
              </p>
              <p>
                After admission, confirm the current residence requirements with Migri. Funds, insurance and the application process need their own review. Avoid non-refundable travel plans based only on an offer.
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
              <span className="text-slate-600">Application routes on Studyinfo and Migri permit requirements need separate checks.</span>
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
        {/* S07: Longer-Term Decision (Work & Post-Study Planning) */}
        {/* ========================================================================= */}
        <section id="work-funding" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Long-Term Planning
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Make a plan that works beyond arrival
              </h2>
            </div>

            {/* Two Visual Paths */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {/* Path 1: Language & Employment Realities */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-11 h-11 rounded-2xl bg-pink-50 text-[#FF4D6D] flex items-center justify-center font-bold border border-pink-100">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0B1B3A]">
                    Language Needs &amp; Employment
                  </h3>
                  <div className="space-y-3 text-slate-700 text-base leading-relaxed">
                    <p>
                      Finland may suit your academic plans without making every later option available. Family applications and permission after graduation require separate eligibility checks. Do not build your course decision around an assumed outcome.
                    </p>
                    <p>
                      Consider language needs in daily life and your intended profession. An English-taught degree does not mean every employer works in English. Employment is not guaranteed.
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-500">
                    Realistic local language and career assessment
                  </span>
                </div>
              </div>

              {/* Path 2: Return-Home or Progression Purpose */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-11 h-11 rounded-2xl bg-slate-100 text-[#0B1B3A] flex items-center justify-center font-bold border border-slate-200">
                    <Scale className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0B1B3A]">
                    Two-Way Plan Evaluation
                  </h3>
                  <p className="text-slate-700 text-base leading-relaxed">
                    For your family discussion, compare the course value under two possibilities: returning home after study, or pursuing a separately eligible next step. A useful degree should have a clear purpose in either conversation.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <Link
                    to="/education/services/scholarships"
                    className="text-xs font-bold text-[#FF4D6D] hover:underline inline-flex items-center gap-1.5"
                  >
                    Discuss scholarship &amp; course fit
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
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
              Get help with the decisions that come before an application
            </h2>

            <div className="space-y-5 text-slate-700 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              <p>
                Bring your current qualification, intended subject and funding concerns to the free assessment. ProConsulting can help you identify what needs checking before you choose a route.
              </p>
              <p>
                Admission guidance, scholarship support and visa preparation address different parts of the journey. Discuss the scope and any paid work before committing. The assessment does not promise a scholarship or permission to study.
              </p>
            </div>

            <div className="pt-4 flex flex-col items-center gap-3.5">
              <Link
                to={FINLAND_SEO.ctaHref}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-base text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-md hover:shadow-lg shadow-pink-500/20 transition-all min-h-[48px]"
              >
                <span>{FINLAND_SEO.ctaText}</span>
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
              {FINLAND_FAQS.map((faq, index) => (
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
              Find your next Finnish course decision
            </h2>

            <div className="space-y-4 text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              <p>
                Not sure whether a university or an applied programme fits? Start with your intended subject and what you want to do next.
              </p>
              <p>
                Discuss your background and funding concerns in the free assessment. Choose an application route after the important questions are clear.
              </p>
            </div>

            <div className="pt-4 flex flex-col items-center gap-3.5">
              <Link
                to={FINLAND_SEO.ctaHref}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-base text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-lg shadow-pink-500/30 hover:shadow-xl transition-all min-h-[48px]"
              >
                <span>{FINLAND_SEO.ctaText}</span>
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
              <p className="text-xs font-bold text-[#0B1B3A] truncate">Study in Finland</p>
              <p className="text-[11px] text-slate-500 truncate">Course &amp; Route Guidance</p>
            </div>
            <Link
              to={FINLAND_SEO.ctaHref}
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
