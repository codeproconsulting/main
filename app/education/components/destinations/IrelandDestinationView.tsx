"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Building2,
  GraduationCap,
  Briefcase,
  FileCheck2,
  Scale,
  Users2,
  BookOpen,
  ChevronDown,
  Compass,
  ShieldCheck,
  HelpCircle,
  Sparkles,
  CalendarClock,
  Wallet,
  Landmark,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  Palette,
  Check,
  ChevronRight,
  Home,
  Laptop,
  Microscope,
  Award,
} from "lucide-react";
import { Navbar } from "~/education/components/ui/Navbar";
import { Footer } from "~/education/components/ui/footer";
import {
  IRELAND_FAQS,
  IRELAND_SEO,
} from "~/education/lib/irelandDestinationData";

export function IrelandDestinationView() {
  const [activeAnchor, setActiveAnchor] = useState<string>("fit");
  const [showMobileCta, setShowMobileCta] = useState(true);
  const [hoveredFlowStep, setHoveredFlowStep] = useState<number | null>(null);
  const [hoveredRouteStage, setHoveredRouteStage] = useState<number | null>(null);
  const [activeFundingTab, setActiveFundingTab] = useState<"goi-ies" | "university">("goi-ies");

  useEffect(() => {
    const handleScroll = () => {
      const anchors = [
        "fit",
        "recognition",
        "route",
        "cost",
        "funding",
        "process",
        "comparison",
        "work",
        "faqs",
        "related",
        "assessment",
      ];
      const headerOffset = 160;

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
    { id: "fit", label: "Course Fit" },
    { id: "recognition", label: "ILEP & TrustEd" },
    { id: "route", label: "Application Route" },
    { id: "cost", label: "Housing & Fees" },
    { id: "funding", label: "Scholarships" },
    { id: "process", label: "Process" },
    { id: "comparison", label: "Planning Shifts" },
    { id: "work", label: "Work & Graduate" },
    { id: "faqs", label: "FAQs" },
  ];

  const recognitionNodes = [
    {
      num: 1,
      title: "PROVIDER",
      desc: "Recognised Irish university or higher education institution",
      icon: Landmark,
      detail:
        "Check the exact provider on official registries rather than relying solely on a familiar institution name or marketing materials.",
    },
    {
      num: 2,
      title: "EXACT COURSE",
      desc: "ILEP and TrustEd Ireland register verification",
      icon: BookOpen,
      detail:
        "Verify that your specific programme appears on the Interim List of Eligible Programmes (ILEP) or TrustEd Ireland register for study visa eligibility.",
    },
    {
      num: 3,
      title: "AWARD TYPE",
      desc: "NFQ Level 7 (Ordinary Degree), 8 (Honours), or 9 (Master's)",
      icon: Sparkles,
      detail:
        "Confirm the National Framework of Qualifications (NFQ) level and awarding body. Degree level governs post-study Third Level Graduate Programme eligibility.",
    },
    {
      num: 4,
      title: "INTENDED USE",
      desc: "Regulated profession licensure, Pakistan HEC or overseas career",
      icon: GraduationCap,
      detail:
        "Immigration eligibility and professional recognition are separate questions. If your career requires a licence, check the relevant professional authority before paying.",
    },
  ];

  const routeStages = [
    {
      stage: "Stage 01",
      title: "University Admission Offer",
      desc: "Course entry requirements and conditions check",
      icon: Building2,
      detail:
        "Start with the course entry requirements and any conditions on your offer. Confirm the teaching language, fees and acceptance terms directly with the provider.",
    },
    {
      stage: "Stage 02",
      title: "Study Visa Application (AVATS)",
      desc: "Online filing and comprehensive financial evidence",
      icon: FileCheck2,
      detail:
        "Then review the study visa requirements that apply to you. Irish guidance describes an online application and supporting evidence, with each application assessed on its merits.",
    },
    {
      stage: "Stage 03",
      title: "Border Entry & IRP Registration",
      desc: "Immigration control and permission to stay",
      icon: ShieldCheck,
      detail:
        "Visa approval and permission to stay are not simply another name for admission. Confirm the steps for entry and registration before making travel commitments.",
    },
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
            <span className="text-slate-900 font-medium">Ireland</span>
          </nav>
        </div>
      </div>

      <main>
        {/* ========================================================================= */}
        {/* S01 | Hero (Two-column layout, restrained destination SVG scene) */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/60 pt-12 pb-16 sm:pt-16 sm:pb-20 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Text & Primary CTA */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/90 text-[11px] font-bold text-slate-700 tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-[#FF4D6D] animate-pulse" />
                  <span>PROCONSULTING STUDY DESTINATIONS</span>
                </div>

                <div className="space-y-4">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1B3A] tracking-tight leading-[1.12]">
                    Study in Ireland
                  </h1>

                  <p className="text-lg sm:text-xl text-slate-700 leading-relaxed font-medium">
                    A course offer does not tell you whether housing, funding and visa plans will work. Check those together before committing to study in Ireland.
                  </p>

                  <p className="text-base text-slate-600 leading-relaxed">
                    ProConsulting helps you compare courses and understand the next application step. Start with a free assessment of your study plans.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <Link
                    to={IRELAND_SEO.ctaHref}
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-sm font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-lg shadow-[#FF4D6D]/20 hover:shadow-xl hover:shadow-[#FF4D6D]/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 text-center"
                  >
                    <span>Get free Ireland assessment</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href="#fit"
                    className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl text-sm font-bold text-[#0B1B3A] bg-slate-100 hover:bg-slate-200/80 transition-colors"
                  >
                    <span>Explore Study Guide</span>
                    <ChevronDown className="w-4 h-4" />
                  </a>
                </div>

                {/* 3 Decision Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 border-t border-slate-200/80 text-xs text-slate-600">
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-white/80 border border-slate-200/60">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Check the exact programme.</span>
                  </div>
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-white/80 border border-slate-200/60">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Plan housing alongside tuition.</span>
                  </div>
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-white/80 border border-slate-200/60">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Keep admission and immigration decisions separate.</span>
                  </div>
                </div>
              </div>

              {/* Right Image (5 cols) */}
              <div className="lg:col-span-5">
                <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl bg-slate-900 group">
                  <img
                    src="/destinations/Ireland.webp"
                    alt="Study in Ireland - Historic university campuses and technological institutes"
                    className="w-full h-[380px] sm:h-[440px] object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3A] via-[#0B1B3A]/30 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-white/40">
                    <img
                      src="https://flagcdn.com/w40/ie.png"
                      alt="Ireland flag"
                      className="w-5 h-3.5 object-cover rounded-xs"
                    />
                    <span className="text-xs font-bold text-[#0B1B3A]">Ireland</span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      European English-Speaking Hub
                    </span>
                  </div>

                  <div className="absolute bottom-0 inset-x-0 p-6 text-white space-y-2">
                    <h3 className="text-lg font-bold text-white">Universities &amp; Colleges</h3>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      Globally recognized degrees, ILEP-listed programmes, and research faculties across Dublin, Cork, Galway, and Limerick.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S02 | Fit (Editorial Course Comparison with Navigation Box on the Left) */}
        {/* ========================================================================= */}
        <section id="fit" className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* LEFT SIDE: In-page Navigation Box (Sticky Box as established) */}
              <aside className="lg:col-span-4">
                <div className="lg:sticky lg:top-24 rounded-3xl border border-slate-200/90 bg-slate-50/80 shadow-sm p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#0B1B3A] text-white flex items-center justify-center shadow-xs">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-[#0B1B3A] uppercase tracking-wider">
                          Ireland Study Guide
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
                      to={IRELAND_SEO.ctaHref}
                      className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-md hover:shadow-lg transition-all"
                    >
                      <span>Free Assessment</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </aside>

              {/* RIGHT SIDE: Choose skills you can use beyond one job market */}
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                    Curriculum Fit &amp; Global Portability
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                    Choose skills you can use beyond one job market
                  </h2>
                </div>

                <div className="space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
                  <div className="p-6 sm:p-7 rounded-2xl bg-slate-50/80 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all">
                    <p className="font-semibold text-slate-900 text-lg">
                      Compare the work you will do during the course. For computing, look at practical projects and technical depth. For life sciences, check laboratory work and access to facilities. For business, look for the subjects that fit your next role.
                    </p>
                  </div>

                  <div className="p-6 sm:p-7 rounded-2xl bg-slate-50/80 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all">
                    <p>
                      Ask whether a placement is required, optional or competitive. Do not treat an employer logo as a promised internship.
                    </p>
                  </div>

                  <div className="p-6 sm:p-7 rounded-2xl bg-amber-50/70 border border-amber-200/90 text-amber-950 font-medium shadow-2xs">
                    <p>
                      Consider the value of the qualification if you return to Pakistan. A course should make academic or career sense without depending on a graduate job abroad.
                    </p>
                  </div>
                </div>

                {/* Practical Disciplines Matrix */}
                <div className="p-6 sm:p-7 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
                    <div className="w-8 h-8 rounded-lg bg-[#FF4D6D]/10 text-[#FF4D6D] flex items-center justify-center">
                      <Scale className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-[#0B1B3A] text-base">
                      Discipline Evaluation Priorities
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs text-slate-700">
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                        <Laptop className="w-3.5 h-3.5" />
                        <span>Computing &amp; Data</span>
                      </div>
                      <span className="text-slate-600 block">Syllabus technical depth, cloud labs, and individual capstone projects.</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                        <Microscope className="w-3.5 h-3.5" />
                        <span>Life Sciences &amp; Pharma</span>
                      </div>
                      <span className="text-slate-600 block">Access to certified laboratory hours, clean-room facilities and QA standards.</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>Business &amp; Finance</span>
                      </div>
                      <span className="text-slate-600 block">Specialised quantitative modules and professional accreditations (ACCA/CFA).</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S03 | Recognition (Award Decision Diagram with Dynamic Hover In / Hover Out) */}
        {/* ========================================================================= */}
        <section id="recognition" className="py-16 sm:py-20 bg-slate-50/50 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Official Programme Verification
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Check the course, award and immigration eligibility
              </h2>
              <div className="mt-4 space-y-3 text-slate-700 text-base sm:text-lg leading-relaxed">
                <p>
                  Irish immigration guidance directs students to check both the ILEP and TrustEd Ireland eligible-programme lists. ILEP means the Interim List of Eligible Programmes. A programme may not appear on both lists.
                </p>
                <p>
                  Check the exact provider and course rather than relying on a familiar institution name. Then confirm the award level and awarding body.
                </p>
                <p className="font-semibold text-[#0B1B3A]">
                  Immigration eligibility and professional recognition are separate questions. If your career requires a licence, check the relevant professional authority before paying.
                </p>
              </div>
            </div>

            {/* Decision Nodes: 4-step sequence with Dynamic Hover In / Out */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Verification Sequence (Hover over any step)
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  Interactive Decision Map
                </span>
              </div>

              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                onMouseLeave={() => setHoveredFlowStep(null)}
              >
                {recognitionNodes.map((step) => {
                  const Icon = step.icon;
                  const isHovered = hoveredFlowStep === step.num;

                  return (
                    <div
                      key={step.num}
                      onMouseEnter={() => setHoveredFlowStep(step.num)}
                      className={`relative rounded-3xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between border ${
                        isHovered
                          ? "bg-white border-[#FF4D6D] shadow-xl ring-2 ring-[#FF4D6D]/15 -translate-y-1"
                          : "bg-slate-50 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span
                            className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center transition-colors ${
                              isHovered
                                ? "bg-[#FF4D6D] text-white"
                                : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {step.num}
                          </span>
                          <Icon
                            className={`w-5 h-5 transition-colors ${
                              isHovered ? "text-[#FF4D6D]" : "text-slate-400"
                            }`}
                          />
                        </div>

                        <div>
                          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
                            {step.title}
                          </span>
                          <h3 className="text-base font-bold text-[#0B1B3A] mt-1">
                            {step.desc}
                          </h3>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {step.detail}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold">
                        <span className={isHovered ? "text-[#FF4D6D]" : "text-slate-400"}>
                          {isHovered ? "Active Registry Check" : "Step " + step.num}
                        </span>
                        <ChevronRight
                          className={`w-3.5 h-3.5 transition-transform ${
                            isHovered ? "text-[#FF4D6D] translate-x-1" : "text-slate-300"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S04 | Route (Planning-Stage Timeline with Spacious Pills & Lucide Icons) */}
        {/* ========================================================================= */}
        <section id="route" className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Sequential Visa Steps
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                An offer is one stage, not permission to travel
              </h2>
              <div className="mt-4 space-y-3 text-slate-700 text-base sm:text-lg leading-relaxed">
                <p>
                  Start with the course entry requirements and any conditions on your offer. Confirm the teaching language, fees and acceptance terms directly with the provider.
                </p>
                <p>
                  Then review the study visa requirements that apply to you. Irish guidance describes an online application and supporting evidence, with each application assessed on its merits.
                </p>
                <p className="font-semibold text-[#0B1B3A]">
                  Visa approval and permission to stay are not simply another name for admission. Confirm the steps for entry and registration before making travel commitments.
                </p>
              </div>
            </div>

            {/* Stages with Spacious Badges & Distinct Icons */}
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              onMouseLeave={() => setHoveredRouteStage(null)}
            >
              {routeStages.map((stage, idx) => {
                const Icon = stage.icon;
                const isHovered = hoveredRouteStage === idx;

                return (
                  <div
                    key={stage.stage}
                    onMouseEnter={() => setHoveredRouteStage(idx)}
                    className={`rounded-3xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between ${
                      isHovered
                        ? "bg-white border-[#FF4D6D] shadow-xl ring-2 ring-[#FF4D6D]/15 -translate-y-1"
                        : "bg-slate-50 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Spacious Pill Tag + Icon Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border transition-colors ${
                            isHovered
                              ? "bg-[#FF4D6D] text-white border-[#FF4D6D]"
                              : "bg-slate-200/80 text-slate-700 border-slate-300"
                          }`}
                        >
                          {stage.stage}
                        </span>

                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                            isHovered
                              ? "bg-[#FF4D6D]/10 text-[#FF4D6D]"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-[#0B1B3A]">
                          {stage.title}
                        </h3>
                        <span className="text-xs text-slate-500 font-medium block mt-0.5">
                          {stage.desc}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
                        {stage.detail}
                      </p>
                    </div>

                    <div className="pt-4 mt-6 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold">
                      <span className={isHovered ? "text-[#FF4D6D]" : "text-slate-400"}>
                        {isHovered ? "Official Irish Guidance" : "Sequential Route"}
                      </span>
                      <CheckCircle2
                        className={`w-4 h-4 transition-colors ${
                          isHovered ? "text-[#FF4D6D]" : "text-slate-300"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S05 | Cost (Static Cost and Payment Explanation) */}
        {/* ========================================================================= */}
        <section id="cost" className="py-16 sm:py-20 bg-slate-50/50 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Total Budget Reality
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Plan housing and payment timing alongside tuition
              </h2>
              <div className="mt-4 space-y-3 text-slate-700 text-base sm:text-lg leading-relaxed">
                <p>
                  Compare housing options in the city where you will study. Ask about availability, payment dates and the terms of any booking. A tuition quote does not include the cost of setting up a home.
                </p>
                <p>
                  Separate course fees, housing, insurance, travel and everyday spending. Check which payments fall due before the visa decision and what can be refunded.
                </p>
              </div>
            </div>

            {/* Editorial Split: Housing & Fees vs Financial Evidence */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {/* Box 1: Housing & Living Realities */}
              <div className="rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-8 shadow-xs flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                    <div className="w-9 h-9 rounded-xl bg-[#0B1B3A] text-white flex items-center justify-center">
                      <Home className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0B1B3A] text-lg">
                        Accommodation Availability &amp; City Costs
                      </h3>
                      <span className="text-xs text-slate-500">Dublin vs Regional Hubs</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed">
                    Student accommodation in Dublin, Galway and Cork is subject to high demand. Booking deposits, private purpose-built student accommodations (PBSA), and utility contributions must be resolved well before departure.
                  </p>

                  <div className="space-y-3 pt-2 text-xs text-slate-600">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 block font-semibold">Payment Milestones:</strong>
                        Tuition deposits and private medical insurance policies must be paid before visa filing, with clear refund clauses documented.
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 block font-semibold">Cost Buffering:</strong>
                        Keep enough flexibility for costs that change. Do not fill a funding gap with an unconfirmed scholarship or hoped-for job.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500">
                  <span>Note: No estimate replaces official university invoices or verified accommodation contracts.</span>
                </div>
              </div>

              {/* Box 2: Visa Financial Evidence Rules */}
              <div className="rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-8 shadow-xs flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                    <div className="w-9 h-9 rounded-xl bg-[#FF4D6D]/10 text-[#FF4D6D] flex items-center justify-center">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0B1B3A] text-lg">
                        Family Budget vs Visa Evidence
                      </h3>
                      <span className="text-xs text-slate-500">Irish Immigration Service Standards</span>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
                    <p>
                      Your family budget is different from the financial evidence required for a visa. Review the rules for your funds and any sponsor rather than assuming payment of a deposit proves everything.
                    </p>
                    <p className="font-semibold text-slate-900">
                      Keep enough flexibility for costs that change. Do not fill a funding gap with an unconfirmed scholarship or hoped-for job.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 font-medium space-y-1.5">
                    <div className="flex items-center gap-2 text-amber-900 font-bold">
                      <AlertCircle className="w-4 h-4" />
                      <span>Sponsor History &amp; Verifiable Liquidity</span>
                    </div>
                    <p>
                      Immigration authorities assess 6-month continuous bank statements, legitimate origin of funds, and sponsor relationship documents. Unexplained recent deposits trigger refusal.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to={IRELAND_SEO.ctaHref}
                    className="inline-flex items-center justify-between w-full p-3.5 rounded-xl text-xs font-bold text-[#0B1B3A] bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <span>Discuss financial evidence with an advisor</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#FF4D6D]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S06 | Funding (Conditional Funding Panel: GOI-IES vs University / Self-Funded) */}
        {/* ========================================================================= */}
        <section id="funding" className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Scholarship Conditions &amp; Reality
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Check the award before counting the saving
              </h2>
              <div className="mt-4 space-y-3 text-slate-700 text-base sm:text-lg leading-relaxed">
                <p>
                  The Government of Ireland International Education Scholarship has its own eligibility and application terms. It is not an automatic benefit of admission or a general undergraduate funding promise.
                </p>
                <p>
                  Check the relevant call and eligible institution before planning around it. The award period and covered costs matter as much as the headline support.
                </p>
                <p>
                  University scholarships also have their own rules. Confirm whether you need a separate application, whether the offer can be renewed and what you must still pay.
                </p>
                <p className="font-semibold text-[#0B1B3A]">
                  If no award arrives, can your family still support the course? Resolve that question before committing to costs you cannot recover.
                </p>
              </div>
            </div>

            {/* Interactive Conditional Toggle Panel */}
            <div className="rounded-3xl border border-slate-200/90 bg-slate-50/70 p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Select Funding Evaluation Model:
                  </span>
                </div>

                <div className="inline-flex p-1 rounded-2xl bg-slate-200/70 border border-slate-300/60">
                  <button
                    onClick={() => setActiveFundingTab("goi-ies")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeFundingTab === "goi-ies"
                        ? "bg-[#0B1B3A] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    GOI-IES National Scheme
                  </button>
                  <button
                    onClick={() => setActiveFundingTab("university")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeFundingTab === "university"
                        ? "bg-[#0B1B3A] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    University &amp; Self-Funded
                  </button>
                </div>
              </div>

              {/* Panel Content based on Active Tab */}
              {activeFundingTab === "goi-ies" ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2">
                    <span className="text-[11px] font-black uppercase text-[#FF4D6D] tracking-wider block">
                      Eligibility
                    </span>
                    <h4 className="font-bold text-[#0B1B3A] text-sm">
                      Non-EEA Masters &amp; Final-Year Honours
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Awarded for one study year to high-achieving non-EEA students holding an unconditional or conditional offer at an eligible higher education institution.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2">
                    <span className="text-[11px] font-black uppercase text-[#FF4D6D] tracking-wider block">
                      Benefit Scope
                    </span>
                    <h4 className="font-bold text-[#0B1B3A] text-sm">
                      Stipend + Full Tuition Fee Waiver
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Consists of a €10,000 stipend for one year of study and a full tuition fee waiver from the host participating university.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2">
                    <span className="text-[11px] font-black uppercase text-[#FF4D6D] tracking-wider block">
                      Planning Rule
                    </span>
                    <h4 className="font-bold text-[#0B1B3A] text-sm">
                      One-Year Non-Renewable
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Competitive quota (60 awards nationally). Never budget for a multi-year degree relying solely on a one-year funding mechanism.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2">
                    <span className="text-[11px] font-black uppercase text-[#0B1B3A] tracking-wider block">
                      University Merit
                    </span>
                    <h4 className="font-bold text-[#0B1B3A] text-sm">
                      Partial Fee Reductions
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Many Irish universities offer merit fee discounts between €1,000 and €5,000 deducted directly from international tuition fees upon admission.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2">
                    <span className="text-[11px] font-black uppercase text-[#0B1B3A] tracking-wider block">
                      Independent Budget
                    </span>
                    <h4 className="font-bold text-[#0B1B3A] text-sm">
                      Unconditional Family Support
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Ensure your family has documented financial capacity to sustain the entire course and living expenses if scholarship competitions are unsuccessful.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2">
                    <span className="text-[11px] font-black uppercase text-[#0B1B3A] tracking-wider block">
                      Refund Guarantees
                    </span>
                    <h4 className="font-bold text-[#0B1B3A] text-sm">
                      Written Institution Terms
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Review university refund schedules for deposit protection in the event of visa refusal or non-fulfilment of conditions before payment.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S07 | Process (Assessment Process Flow) */}
        {/* ========================================================================= */}
        <section id="process" className="py-16 sm:py-20 bg-slate-50/50 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Free Assessment Journey
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Use the assessment to make your next step clearer
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                <span className="w-8 h-8 rounded-full bg-[#0B1B3A] text-white flex items-center justify-center text-xs font-extrabold">
                  1
                </span>
                <h3 className="text-base font-bold text-[#0B1B3A]">
                  Review Background &amp; Intent
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Explain your previous studies and the subject you want next. Tell us if your choice depends on a scholarship, a particular city or a family plan.
                </p>
              </div>

              <div className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                <span className="w-8 h-8 rounded-full bg-[#0B1B3A] text-white flex items-center justify-center text-xs font-extrabold">
                  2
                </span>
                <h3 className="text-base font-bold text-[#0B1B3A]">
                  Clarify Pivotal Constraints
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Discuss the questions that need answers before an application. Course eligibility, housing and funding may need attention before a shortlist makes sense.
                </p>
              </div>

              <div className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                <span className="w-8 h-8 rounded-full bg-[#0B1B3A] text-white flex items-center justify-center text-xs font-extrabold">
                  3
                </span>
                <h3 className="text-base font-bold text-[#0B1B3A]">
                  Establish Next Steps in Writing
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Confirm any paid support separately, including scope and fees. A free assessment does not give a university decision, scholarship award or immigration approval.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-start">
              <Link
                to={IRELAND_SEO.ctaHref}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-md hover:shadow-lg transition-all"
              >
                <span>Get free Ireland assessment</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S08 | Comparison (Before and Better-Decision Pairs) */}
        {/* ========================================================================= */}
        <section id="comparison" className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Decision Refinement
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Turn a country preference into a course decision
              </h2>
            </div>

            <div className="space-y-4">
              {/* Pair 1 */}
              <div className="rounded-3xl border border-slate-200/90 bg-slate-50/70 p-6 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="p-4 rounded-2xl bg-white border border-rose-200/70 space-y-1.5">
                  <span className="text-[11px] font-black uppercase text-rose-600 tracking-wider block">
                    Before
                  </span>
                  <p className="text-sm text-slate-800 font-medium">
                    choosing a course because Ireland has well-known employers.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-emerald-200/80 space-y-1.5 shadow-2xs">
                  <span className="text-[11px] font-black uppercase text-emerald-700 tracking-wider block">
                    Better decision
                  </span>
                  <p className="text-sm text-slate-900 font-bold">
                    comparing course content and realistic placement arrangements.
                  </p>
                </div>
              </div>

              {/* Pair 2 */}
              <div className="rounded-3xl border border-slate-200/90 bg-slate-50/70 p-6 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="p-4 rounded-2xl bg-white border border-rose-200/70 space-y-1.5">
                  <span className="text-[11px] font-black uppercase text-rose-600 tracking-wider block">
                    Before
                  </span>
                  <p className="text-sm text-slate-800 font-medium">
                    assuming every provider offers an eligible study route.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-emerald-200/80 space-y-1.5 shadow-2xs">
                  <span className="text-[11px] font-black uppercase text-emerald-700 tracking-wider block">
                    Better decision
                  </span>
                  <p className="text-sm text-slate-900 font-bold">
                    checking the exact programme against the relevant official lists.
                  </p>
                </div>
              </div>

              {/* Pair 3 */}
              <div className="rounded-3xl border border-slate-200/90 bg-slate-50/70 p-6 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="p-4 rounded-2xl bg-white border border-rose-200/70 space-y-1.5">
                  <span className="text-[11px] font-black uppercase text-rose-600 tracking-wider block">
                    Before
                  </span>
                  <p className="text-sm text-slate-800 font-medium">
                    budgeting for tuition and solving housing later.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-emerald-200/80 space-y-1.5 shadow-2xs">
                  <span className="text-[11px] font-black uppercase text-emerald-700 tracking-wider block">
                    Better decision
                  </span>
                  <p className="text-sm text-slate-900 font-bold">
                    reviewing housing costs and payment timing before accepting.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 italic">
              These are planning examples, not reported client outcomes.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S09 | Work & Graduate (Contained Navy Card Band) */}
        {/* ========================================================================= */}
        <section id="work" className="py-16 sm:py-20 bg-slate-50/50 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-[#0B1B3A] text-white p-8 sm:p-12 shadow-xl border border-slate-800 space-y-8">
              <div className="max-w-3xl space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] block">
                  Immigration Permission &amp; Post-Study Rules
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                  Keep work and graduate plans conditional
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-300 text-sm sm:text-base leading-relaxed">
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                      <Briefcase className="w-4 h-4" />
                      <span>Student Work Limits (Stamp 2)</span>
                    </div>
                    <p className="text-slate-300 text-sm">
                      Student work rights depend on your immigration permission and its conditions. A possible job is not a reliable way to fund tuition or rent.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                      <Award className="w-4 h-4" />
                      <span>Third Level Graduate Programme (Stamp 1G)</span>
                    </div>
                    <p className="text-slate-300 text-sm">
                      Ireland has a Third Level Graduate Programme with eligibility rules. Check the qualification, permission and application conditions before relying on it. Graduation does not automatically grant a job or permanent residence.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                      <Scale className="w-4 h-4" />
                      <span>No Automatic EU Mobility</span>
                    </div>
                    <p className="text-slate-300 text-sm">
                      Irish study permission does not create a general right to work elsewhere in the EU. Each destination has its own rules.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
                      <Users2 className="w-4 h-4" />
                      <span>Family Travel &amp; Return-Home Reality</span>
                    </div>
                    <p className="text-slate-300 text-sm">
                      Family travel also needs a separate review. Do not assume a partner or children can join you because you have an offer. Keep a useful return-home plan alongside any overseas career hopes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S10 | FAQ (Modern Rounded-3xl Cards with Rotating Chevrons) */}
        {/* ========================================================================= */}
        <section id="faqs" className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4D6D]/10 text-[#FF4D6D] text-xs font-bold">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>FREQUENTLY ASKED QUESTIONS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Questions about studying in Ireland
              </h2>
              <p className="text-sm text-slate-500">
                Official answers to common applicant inquiries about courses, housing, funding, and visas.
              </p>
            </div>

            <div className="space-y-4">
              {IRELAND_FAQS.map((faq) => (
                <details
                  key={faq.id}
                  className="group rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 hover:border-slate-300 open:border-[#FF4D6D]/40 open:shadow-md open:ring-1 open:ring-[#FF4D6D]/15 transition-all duration-200"
                >
                  <summary className="flex items-center justify-between gap-4 font-bold text-[#0B1B3A] text-base sm:text-lg cursor-pointer list-none select-none">
                    <span>{faq.q}</span>
                    <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-open:bg-[#FF4D6D] group-open:text-white transition-all duration-200">
                      <ChevronDown className="w-4 h-4 transition-transform duration-200 group-open:rotate-180" />
                    </span>
                  </summary>
                  <div className="mt-4 pt-4 border-t border-slate-100 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S11 | Related Guidance (Contextual Links to Real Routes) */}
        {/* ========================================================================= */}
        <section id="related" className="py-16 sm:py-20 bg-slate-50/50 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="max-w-3xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] block">
                Next Steps &amp; Sibling Destinations
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Choose support for the decision in front of you
              </h2>
            </div>

            <div className="space-y-4 text-base sm:text-lg text-slate-700 leading-relaxed">
              <p>
                Explore{" "}
                <Link
                  to="/education/services/admission"
                  className="font-bold text-[#0B1B3A] hover:text-[#FF4D6D] underline decoration-slate-300 underline-offset-4 hover:decoration-[#FF4D6D] transition-colors"
                >
                  admission guidance
                </Link>{" "}
                for course and offer questions. Explore{" "}
                <Link
                  to="/education/services/visa"
                  className="font-bold text-[#0B1B3A] hover:text-[#FF4D6D] underline decoration-slate-300 underline-offset-4 hover:decoration-[#FF4D6D] transition-colors"
                >
                  visa support
                </Link>{" "}
                for the immigration stage. Explore{" "}
                <Link
                  to="/education/services/scholarships"
                  className="font-bold text-[#0B1B3A] hover:text-[#FF4D6D] underline decoration-slate-300 underline-offset-4 hover:decoration-[#FF4D6D] transition-colors"
                >
                  scholarship support
                </Link>{" "}
                for funding applications.
              </p>

              <p>
                Still comparing countries? Browse{" "}
                <Link
                  to="/education/destinations"
                  className="font-bold text-[#0B1B3A] hover:text-[#FF4D6D] underline decoration-slate-300 underline-offset-4 hover:decoration-[#FF4D6D] transition-colors"
                >
                  all study destinations
                </Link>{" "}
                and compare Ireland with{" "}
                <Link
                  to="/education/destinations/study-in-uk"
                  className="font-bold text-[#0B1B3A] hover:text-[#FF4D6D] underline decoration-slate-300 underline-offset-4 hover:decoration-[#FF4D6D] transition-colors"
                >
                  the UK
                </Link>
                . Assess the actual course, costs and conditions in each country.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S12 | Close (Final Assessment Invitation + Honesty Statement) */}
        {/* ========================================================================= */}
        <section id="assessment" className="py-16 sm:py-24 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] block">
                Start With Informed Clarity
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1B3A] tracking-tight">
                Discuss the full plan before accepting a place
              </h2>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Bring your course interests and family funding questions to a free Ireland assessment. Tell us which decisions you need to make before paying a deposit.
              </p>
            </div>

            <div className="pt-2">
              <Link
                to={IRELAND_SEO.ctaHref}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-xl shadow-[#FF4D6D]/20 hover:shadow-2xl hover:shadow-[#FF4D6D]/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Get free Ireland assessment</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="pt-6 border-t border-slate-200/80 max-w-xl mx-auto">
              <p className="text-xs text-slate-500 font-medium">
                No consultant can guarantee a scholarship, admission or visa, and we do not.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Mobile CTA */}
      {showMobileCta && (
        <div className="fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200/90 z-40 sm:hidden shadow-lg">
          <Link
            to={IRELAND_SEO.ctaHref}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#FF4D6D] shadow-md"
          >
            <span>Get free Ireland assessment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      <Footer />
    </div>
  );
}
