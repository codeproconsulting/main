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
  DENMARK_FAQS,
  DENMARK_SCENARIOS,
  DENMARK_SEO,
} from "~/education/lib/denmarkDestinationData";

export function DenmarkDestinationView() {
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
        "scholarships",
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
    { id: "plans", label: "Subject History" },
    { id: "recognition", label: "Course & Awards" },
    { id: "scenarios", label: "Fit Scenarios" },
    { id: "costs", label: "Tuition & Costs" },
    { id: "scholarships", label: "Scholarships Check" },
    { id: "work-funding", label: "Permission & Family" },
    { id: "guidance", label: "Decision Guidance" },
    { id: "faqs", label: "FAQs" },
  ];

  const courseDistinctions = [
    {
      num: 1,
      title: "INSTITUTION & AWARD TYPES",
      desc: "Universities, University Colleges & Business Academies",
      icon: Landmark,
      detail:
        "Danish higher education features research universities, university colleges offering professional bachelor degrees, and business academies with academy profession programmes.",
    },
    {
      num: 2,
      title: "TEACHING & PROJECT WORK",
      desc: "Problem-Based Learning & Applied Course Modules",
      icon: BookOpen,
      detail:
        "Programmes frequently rely on collaborative group projects and independent problem-solving. Modules should solve a clear gap in your previous academic background.",
    },
    {
      num: 3,
      title: "QUALIFICATION RECOGNITION",
      desc: "Professional Equivalence & Return-Home Value",
      icon: Scale,
      detail:
        "Confirm whether your prospective Danish award satisfies regulatory and licensing bodies in Pakistan or internationally before paying application fees.",
    },
  ];

  const fundingStages = [
    {
      num: 1,
      title: "Scheme Eligibility Check",
      desc: "Confirm whether a Danish scholarship scheme is open to Pakistani applicants for your specific course.",
      icon: Building2,
      badge: "Stage 01",
    },
    {
      num: 2,
      title: "Separate Application Route",
      desc: "Identify whether financial support requires a dedicated application or is considered with admission.",
      icon: FileCheck2,
      badge: "Stage 02",
    },
    {
      num: 3,
      title: "Unassisted Cost Fallback",
      desc: "Retain a realistic living and tuition budget without relying on unconfirmed scholarship awards.",
      icon: ShieldCheck,
      badge: "Stage 03",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#FF4D6D] selection:text-white">
      <Navbar />

      {/* S01: HERO & DECISION PREVIEW */}
      <section className="relative overflow-hidden bg-[#0B1B3A] text-white pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs md:text-sm text-slate-300 mb-6"
          >
            <Link
              to="/education"
              className="hover:text-white transition-colors underline-offset-4 hover:underline"
            >
              Home
            </Link>
            <span aria-hidden="true" className="text-slate-500">
              /
            </span>
            <Link
              to="/education/destinations"
              className="hover:text-white transition-colors underline-offset-4 hover:underline"
            >
              Destinations
            </Link>
            <span aria-hidden="true" className="text-slate-500">
              /
            </span>
            <span className="text-white font-medium">Denmark</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-pink-300">
                <span className="w-2 h-2 rounded-full bg-[#FF4D6D] animate-pulse" />
                <span>Subject-Level Entry &amp; Course-Fit Guidance</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Study in Denmark
              </h1>

              <div className="space-y-4 text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
                <p>
                  An appealing course title can hide a subject gap. Before you spend on a Danish application, check whether your previous study matches the programme you want.
                </p>
                <p>
                  ProConsulting helps you compare course requirements with your academic history. Use the free assessment to decide what to check, what to question and where to focus.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
                <Link
                  to="/education/contact?destination=denmark"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-bold text-white bg-[#FF4D6D] hover:bg-[#E11D48] shadow-lg shadow-pink-500/25 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <span>Get free Denmark assessment</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 font-medium pt-1">
                Find a Danish course that fits your background, not just your ambition.
              </p>
            </div>

            {/* Right Column: Hero Visual Card with Real Image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 bg-slate-800/60 shadow-2xl backdrop-blur-sm group">
                <div className="aspect-[4/3] w-full relative overflow-hidden">
                  <img
                    src="/destinations/Denmark.webp"
                    alt="Study in Denmark - ProConsulting Higher Education Guidance"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3A] via-[#0B1B3A]/40 to-transparent" />
                  
                  {/* Floating Badge */}
                  <div className="absolute top-4 left-4 bg-[#0B1B3A]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs font-bold text-white flex items-center gap-2 shadow-lg">
                    <span className="text-base" role="img" aria-label="Denmark Flag">🇩🇰</span>
                    <span>Study in Denmark</span>
                  </div>

                  {/* Verification Tag */}
                  <div className="absolute top-4 right-4 bg-emerald-500/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-bold text-white flex items-center gap-1.5 shadow-lg">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Intakes 2026/2027</span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                      Decision Framework
                    </span>
                    <span className="text-xs font-semibold text-pink-400">
                      Subject Fit &amp; Recognition
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
                      <div className="text-[11px] text-slate-400 font-medium">Core Distinction</div>
                      <div className="text-sm font-bold text-white mt-0.5">Academic Match</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
                      <div className="text-[11px] text-slate-400 font-medium">Assessment</div>
                      <div className="text-sm font-bold text-pink-400 mt-0.5">Free Evaluation</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    Compare required modules, qualification recognition and funding rules with our counseling team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* S02: BUYER PROBLEM & STICKY SUBNAV CONTAINER */}
      <section id="plans" className="py-16 md:py-24 bg-white scroll-mt-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* LEFT STICKY SUBNAV (Enforced by Design Guidelines) */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24 self-start order-2 lg:order-1">
              <div className="rounded-3xl border border-slate-200/80 bg-slate-50/70 p-6 shadow-sm backdrop-blur-sm">
                <div className="flex items-center gap-2.5 pb-4 border-b border-slate-200">
                  <Compass className="w-5 h-5 text-[#FF4D6D]" />
                  <h3 className="font-extrabold text-slate-900 text-base tracking-tight">
                    Denmark Study Guide
                  </h3>
                </div>

                <nav aria-label="Section navigation" className="mt-4 space-y-1">
                  {navLinks.map((link) => {
                    const isActive = activeAnchor === link.id;
                    return (
                      <a
                        key={link.id}
                        href={`#${link.id}`}
                        className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs md:text-sm transition-all duration-150 ${
                          isActive
                            ? "bg-pink-50/80 text-[#FF4D6D] font-bold border-r-2 border-[#FF4D6D]"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium"
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${
                            isActive
                              ? "text-[#FF4D6D] translate-x-0.5"
                              : "text-slate-400 group-hover:translate-x-0.5"
                          }`}
                        />
                      </a>
                    );
                  })}
                </nav>

                {/* Subnav Sticky Assessment CTA Card */}
                <div className="mt-6 pt-5 border-t border-slate-200 space-y-3">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Need personal guidance?
                  </div>
                  <Link
                    to="/education/contact?destination=denmark"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-white bg-[#FF4D6D] hover:bg-[#E11D48] shadow-md shadow-pink-500/20 transition-all duration-150"
                  >
                    <span>Get free Denmark assessment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </aside>

            {/* RIGHT CONTENT COLUMN: S02 Content */}
            <div className="lg:col-span-8 space-y-8 order-1 lg:order-2">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
                  Course Matching
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Your subject history matters as much as your next goal
                </h2>
              </div>

              <div className="space-y-6 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                <p>
                  A course can sound right while asking for subjects you have not studied. This matters when you move between fields or compare qualifications from different systems.
                </p>
                <p>
                  Start with the programme requirements. Check the level of previous study, required subjects, grades and language evidence. Ask the institution about unclear equivalence before paying application costs.
                </p>
                <p>
                  For postgraduate study, look beyond the name of your degree. The content you studied may matter to the admissions decision. A broad subject match does not prove eligibility.
                </p>
              </div>

              {/* Typographic Margin Note Card */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#0B1B3A] uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-[#FF4D6D]" />
                  <span>Subject History Analysis</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Checking subject requirements, syllabus coverage and equivalence rules before applying helps identify eligibility gaps early.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* S03: USEFUL COMPARISON & NODE INTERACTION */}
      <section
        id="recognition"
        className="py-16 md:py-24 bg-slate-50/50 scroll-mt-20 border-b border-slate-200/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1B3A] text-white text-xs font-bold uppercase tracking-wider">
              Educational Framework
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Compare the learning, not the country label
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Public Prose */}
            <div className="lg:col-span-6 space-y-6 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              <p>
                Danish study options include different institutions and award types. Read the exact qualification and progression route rather than assuming every course offers the same next step.
              </p>
              <p>
                Look for modules that solve a real gap in your knowledge. If project work attracts you, check how the programme actually teaches and assesses it. A national reputation cannot describe every classroom.
              </p>
              <p>
                Consider how you would explain the course value to an employer at home. For a regulated profession, ask the relevant recognition body about the specific qualification before committing.
              </p>
            </div>

            {/* Right Column: Interactive Distinction Cards with Hover In / Hover Out Reset */}
            <div className="lg:col-span-6 space-y-4">
              {courseDistinctions.map((item, idx) => {
                const IconComponent = item.icon;
                const isHovered = hoveredFlowStep === idx;
                return (
                  <div
                    key={item.num}
                    onMouseEnter={() => setHoveredFlowStep(idx)}
                    onMouseLeave={() => setHoveredFlowStep(null)}
                    className={`p-6 rounded-2xl transition-all duration-200 border ${
                      isHovered
                        ? "bg-white border-[#FF4D6D]/40 ring-1 ring-[#FF4D6D]/20 shadow-lg -translate-y-0.5"
                        : "bg-slate-50/70 border-slate-200/80 shadow-sm"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isHovered
                            ? "bg-[#FF4D6D] text-white"
                            : "bg-slate-200/80 text-slate-700"
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            {item.title}
                          </span>
                          <span
                            className={`text-xs font-bold transition-colors ${
                              isHovered ? "text-[#FF4D6D]" : "text-slate-400"
                            }`}
                          >
                            0{item.num}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">
                          {item.desc}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1 font-normal">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Decorative Linked-Node SVG (aria-hidden) */}
              <div
                aria-hidden="true"
                className="hidden sm:block p-4 rounded-2xl bg-white border border-slate-200/70"
              >
                <svg
                  className="w-full h-12"
                  viewBox="0 0 400 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="40" cy="24" r="8" fill="#0B1B3A" />
                  <text x="40" y="44" textAnchor="middle" fill="#64748B" fontSize="10" fontWeight="600">
                    Institution
                  </text>
                  <line x1="48" y1="24" x2="192" y2="24" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" />
                  <circle cx="200" cy="24" r="8" fill="#FF4D6D" />
                  <text x="200" y="44" textAnchor="middle" fill="#FF4D6D" fontSize="10" fontWeight="600">
                    Teaching
                  </text>
                  <line x1="208" y1="24" x2="352" y2="24" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" />
                  <circle cx="360" cy="24" r="8" fill="#0B1B3A" />
                  <text x="360" y="44" textAnchor="middle" fill="#64748B" fontSize="10" fontWeight="600">
                    Recognition
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* S04: SYNTHETIC WALKTHROUGH & ACCESSIBLE SCENARIO TABS */}
      <section id="scenarios" className="py-16 md:py-24 bg-white scroll-mt-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
              Planning Scenarios
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Try a course-fit conversation
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Illustrative planning scenario. These examples explain a comparison, not an admission decision or client result.
            </p>
          </div>

          <div className="bg-slate-50/80 rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Choose a scenario
            </div>

            {/* Accessible Tab Controls */}
            <div
              role="tablist"
              aria-label="Planning scenarios"
              className="flex flex-wrap gap-2.5 pb-6 border-b border-slate-200"
            >
              {DENMARK_SCENARIOS.map((sc, idx) => {
                const isSelected = selectedScenarioIndex === idx;
                return (
                  <button
                    key={sc.id}
                    role="tab"
                    id={`tab-${sc.id}`}
                    aria-selected={isSelected}
                    aria-controls={`panel-${sc.id}`}
                    tabIndex={isSelected ? 0 : -1}
                    onClick={() => setSelectedScenarioIndex(idx)}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowRight") {
                        setSelectedScenarioIndex((idx + 1) % DENMARK_SCENARIOS.length);
                      } else if (e.key === "ArrowLeft") {
                        setSelectedScenarioIndex(
                          (idx - 1 + DENMARK_SCENARIOS.length) % DENMARK_SCENARIOS.length
                        );
                      } else if (e.key === "Home") {
                        setSelectedScenarioIndex(0);
                      } else if (e.key === "End") {
                        setSelectedScenarioIndex(DENMARK_SCENARIOS.length - 1);
                      }
                    }}
                    className={`min-h-[44px] px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 ${
                      isSelected
                        ? "bg-[#0B1B3A] text-white shadow-md ring-2 ring-[#0B1B3A]/20"
                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {sc.name}
                  </button>
                );
              })}
            </div>

            {/* Active Panel View */}
            <div className="pt-6">
              {DENMARK_SCENARIOS.map((sc, idx) => {
                const isSelected = selectedScenarioIndex === idx;
                if (!isSelected) return null;
                return (
                  <div
                    key={sc.id}
                    role="tabpanel"
                    id={`panel-${sc.id}`}
                    aria-labelledby={`tab-${sc.id}`}
                    tabIndex={0}
                    className="space-y-6 focus:outline-none"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                      <div className="md:col-span-5 p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Scenario: {sc.scenarioTitle}
                        </div>
                        <div className="text-sm font-semibold text-slate-900 leading-snug">
                          Input: {sc.input}
                        </div>
                      </div>

                      <div className="md:col-span-7 p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                        <div className="text-[11px] font-bold text-pink-500 uppercase tracking-wider">
                          Evaluation Response
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed font-normal">
                          Response: {sc.response}
                        </p>
                        <div className="pt-2 flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500">Status:</span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                            <span>{sc.status}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200 text-xs text-slate-400 font-medium text-center sm:text-left">
              This preview gives planning examples. It does not assess your application.
            </div>
          </div>
        </div>
      </section>

      {/* S05: COST & FUNDING EXPLANATION */}
      <section id="costs" className="py-16 md:py-24 bg-white scroll-mt-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
              Financial Breakdown
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Separate the course bill from the money needed to move
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Public Prose */}
            <div className="lg:col-span-7 space-y-6 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              <p>
                For a fee-paying applicant, tuition is only one part of the decision. Ask for the actual course fee, payment schedule and refund terms. Do not substitute a country-wide price range for an offer.
              </p>
              <p>
                Plan housing, food, local travel, insurance where required and arrival costs separately. Housing deposits and early payments can create pressure before the course begins.
              </p>
              <p>
                Residence evidence has its own rules. Confirm what applies to your institution, course and circumstances. Expected student earnings are not a safe replacement for funds you need before departure.
              </p>
            </div>

            {/* Right Column: Payment Sequence Rail */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-6 space-y-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-[#FF4D6D]" />
                    <span className="font-extrabold text-slate-900 text-sm">
                      Payment Sequence Rail
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">Per-Intake Verification</span>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      label: "Tuition & Institutional Deposit",
                      detail:
                        "Course fees set by Danish universities and academies, including payment schedules and refund terms.",
                    },
                    {
                      label: "Housing, Deposits & Initial Living",
                      detail:
                        "Securing accommodation deposits, rent, food, transport and early arrival expenses.",
                    },
                    {
                      label: "SIRI Residence Maintenance Proof",
                      detail:
                        "Verified liquid maintenance funds required for the residence permit, independent of expected part-time work.",
                    },
                  ].map((seq, i) => (
                    <div key={i} className="flex gap-3.5">
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-[#0B1B3A] text-white flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </div>
                        {i < 2 && <div className="w-0.5 flex-1 bg-slate-300 my-1" />}
                      </div>
                      <div className="space-y-0.5 pb-2">
                        <div className="text-sm font-bold text-slate-900">{seq.label}</div>
                        <p className="text-xs text-slate-600 leading-relaxed font-normal">
                          {seq.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-pink-50/60 border border-pink-100 text-xs text-slate-700 leading-relaxed">
                  Budget planning must distinguish between the tuition invoice and the independent maintenance amount required for relocation.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* S06: NEXT DECISION / SCHOLARSHIP CHECK */}
      <section
        id="scholarships"
        className="py-16 md:py-24 bg-slate-50/50 scroll-mt-20 border-b border-slate-200/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1B3A] text-white text-xs font-bold uppercase tracking-wider">
              Scholarship Validation
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Scholarships need their own eligibility check
            </h2>
          </div>

          <div className="space-y-8">
            <div className="max-w-4xl space-y-6 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              <p>
                A scholarship listed for Denmark is not necessarily open to your course or applicant category. Some schemes support exchanges or specific joint programmes rather than any full degree.
              </p>
              <p>
                Check who can apply, what the award covers and how selection works. Confirm whether a separate application is required. Do not assume admission includes financial support.
              </p>
              <p>
                Keep an affordable plan without an unconfirmed award. If funding is essential, establish that condition before making a payment you cannot recover.
              </p>
            </div>

            {/* Navy-Framed Inset Container with 3 Stage Badges */}
            <div className="rounded-3xl border border-slate-800 bg-[#0B1B3A] text-white p-6 sm:p-10 shadow-xl space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/80 pb-6">
                <div>
                  <h3 className="text-xl font-extrabold text-white tracking-tight">
                    Funding Verification Stages
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-normal mt-1">
                    Check award eligibility, scheme coverage and affordable contingency routes.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-pink-300 text-xs font-bold shrink-0">
                  <span>Transparent Award Terms</span>
                </div>
              </div>

              {/* 3 Stage Badges with horizontal rounded pills */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {fundingStages.map((stg, idx) => {
                  const IconComp = stg.icon;
                  const isHovered = hoveredRouteStage === idx;
                  return (
                    <div
                      key={stg.num}
                      onMouseEnter={() => setHoveredRouteStage(idx)}
                      onMouseLeave={() => setHoveredRouteStage(null)}
                      className={`p-6 rounded-2xl border transition-all duration-200 ${
                        isHovered
                          ? "bg-slate-800/90 border-[#FF4D6D] ring-1 ring-[#FF4D6D]/30 -translate-y-1"
                          : "bg-slate-800/50 border-slate-700/80 hover:border-slate-600"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold border bg-pink-500/10 text-pink-300 border-pink-500/30">
                          {stg.badge}
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-slate-200">
                          <IconComp className="w-4 h-4" />
                        </div>
                      </div>
                      <h4 className="text-base font-bold text-white mb-2">{stg.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-normal">{stg.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* S07: LONGER-TERM DECISION / WORK & FAMILY */}
      <section
        id="work-funding"
        className="py-16 md:py-24 bg-white scroll-mt-20 border-b border-slate-200/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
              Longer-Term Perspective
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Do not choose a course on an assumed work route
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 space-y-6 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              <p>
                Study permission and later work options depend on current rules and the exact study route. Confirm the status of your chosen programme before relying on any related entitlement.
              </p>
              <p>
                Family eligibility also needs a separate review. Admission does not settle whether a partner or child can accompany you. Include their costs only after understanding the relevant route.
              </p>
              <p>
                Consider the course on its academic value first. Think about returning home, using the skills elsewhere, or applying for a later option if eligible. None of those outcomes is guaranteed.
              </p>
            </div>

            {/* Two Balanced Decision Paths */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Perspective A: Returning Home</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  Degree Utility &amp; Domestic Recognition
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Evaluating how Danish learning, project methodology and subject depth translate into professional career advantage in Pakistan.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-[#FF4D6D]" />
                  <span>Perspective B: Subsequent Entitlements</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  Separately Checked Permission Routes
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Checking independent post-study and family regulations under current rules rather than assuming guaranteed immigration outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* S08: SERVICE-SPECIFIC ASK */}
      <section id="guidance" className="py-16 md:py-24 bg-slate-50/50 scroll-mt-20 border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1B3A] text-white text-xs font-bold uppercase tracking-wider">
              Advisory Support
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Replace a long wish list with a clearer next step
            </h2>
          </div>

          <div className="space-y-6 text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-3xl mx-auto">
            <p>
              ProConsulting supports course selection, admissions and visa preparation. The free assessment is a starting point for discussing your background and where the gaps may be.
            </p>
            <p>
              You should understand why a course belongs on your shortlist. Ask what entry questions remain, which costs come first and what any further support includes.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/education/contact?destination=denmark"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white bg-[#FF4D6D] hover:bg-[#E11D48] shadow-lg shadow-pink-500/25 transition-all duration-200 hover:-translate-y-0.5 min-h-[44px]"
            >
              <span>Get free Denmark assessment</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Contextual service anchors */}
          <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-500 font-medium">
            <span>Explore service scopes:</span>
            <Link
              to="/education/services/admission"
              className="text-[#FF4D6D] hover:underline font-semibold"
            >
              Admission Guidance
            </Link>
            <span>•</span>
            <Link
              to="/education/services/visa"
              className="text-[#FF4D6D] hover:underline font-semibold"
            >
              Visa Guidance
            </Link>
            <span>•</span>
            <Link
              to="/education/services/scholarships"
              className="text-[#FF4D6D] hover:underline font-semibold"
            >
              Scholarship Support
            </Link>
          </div>
        </div>
      </section>

      {/* S09: FAQ ACCORDION (MODERN PINK ACCENTS & ROTATING CHEVRON) */}
      <section id="faqs" className="py-16 md:py-24 bg-white scroll-mt-20 border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
              Essential Answers
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Questions before you commit
            </h2>
          </div>

          <div className="space-y-4">
            {DENMARK_FAQS.map((faq, i) => (
              <details
                key={i}
                className="group rounded-3xl border border-slate-200/80 bg-slate-50/60 p-6 transition-all duration-200 open:border-[#FF4D6D]/40 open:ring-1 open:ring-[#FF4D6D]/15 open:bg-white shadow-sm"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-bold text-slate-900 text-base md:text-lg list-none select-none">
                  <span>{faq.question}</span>
                  <span className="h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 transition-all duration-200 group-open:rotate-180 group-open:bg-[#FF4D6D] group-open:text-white group-open:border-[#FF4D6D]">
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </summary>
                <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal border-t border-slate-100 pt-4">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* S10: FINAL ASSESSMENT INVITATION */}
      <section id="assessment" className="py-16 md:py-24 bg-[#0B1B3A] text-white scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-pink-300">
              <span className="w-2 h-2 rounded-full bg-[#FF4D6D]" />
              <span>Free Consultation &amp; Academic Background Review</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              Check the fit before paying to apply
            </h2>
          </div>

          <div className="space-y-4 text-base sm:text-lg text-slate-200 leading-relaxed font-normal max-w-2xl mx-auto">
            <p>
              A Danish course should make sense on paper before you commit. Bring your intended subject and previous qualification to the free assessment.
            </p>
            <p>
              Talk through the entry questions and the costs that need checking. Then decide which course deserves a closer look.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/education/contact?destination=denmark"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white bg-[#FF4D6D] hover:bg-[#E11D48] shadow-lg shadow-pink-500/30 transition-all duration-200 hover:-translate-y-0.5 min-h-[44px]"
            >
              <span>Get free Denmark assessment</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-800 max-w-xl mx-auto">
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              No consultant can guarantee a scholarship, admission or visa, and we do not.
            </p>
          </div>
        </div>
      </section>

      {/* MOBILE STICKY CTA BAR (Bottom) */}
      {showMobileCta && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 sm:hidden shadow-lg">
          <Link
            to="/education/contact?destination=denmark"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-[#FF4D6D] shadow-md min-h-[44px]"
          >
            <span>Get free Denmark assessment</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      <Footer />
    </div>
  );
}
