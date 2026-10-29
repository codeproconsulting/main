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
  Stethoscope,
  Cpu,
  Globe2,
} from "lucide-react";
import { Navbar } from "~/education/components/ui/Navbar";
import { Footer } from "~/education/components/ui/footer";
import {
  HUNGARY_FAQS,
  HUNGARY_SEO,
} from "~/education/lib/hungaryDestinationData";

export function HungaryDestinationView() {
  const [activeAnchor, setActiveAnchor] = useState<string>("fit");
  const [showMobileCta, setShowMobileCta] = useState(true);
  const [hoveredFlowStep, setHoveredFlowStep] = useState<number | null>(null);
  const [hoveredRouteStage, setHoveredRouteStage] = useState<number | null>(null);
  const [activeFundingTab, setActiveFundingTab] = useState<"scholarship" | "selffunded">("scholarship");

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
    { id: "recognition", label: "Recognition" },
    { id: "route", label: "Application Route" },
    { id: "cost", label: "Actual Fees" },
    { id: "funding", label: "Scholarships" },
    { id: "process", label: "Process" },
    { id: "comparison", label: "Planning Shifts" },
    { id: "work", label: "Work & Family" },
    { id: "faqs", label: "FAQs" },
  ];

  const recognitionNodes = [
    {
      num: 1,
      title: "PROVIDER",
      desc: "State university or accredited higher education institution",
      icon: Landmark,
      detail:
        "Check whether the awarding institution is an accredited Hungarian state university or college. Legal accreditation is the foundation of any academic credential.",
    },
    {
      num: 2,
      title: "EXACT COURSE",
      desc: "Specific curriculum, clinical hours and teaching language",
      icon: BookOpen,
      detail:
        "Inspect the curriculum syllabus, practical laboratory projects, and whether clinical or workplace placement hours require Hungarian language competence.",
    },
    {
      num: 3,
      title: "AWARD TYPE",
      desc: "One-tier Master (Medicine/Dentistry), BSc, MSc, or PhD",
      icon: Sparkles,
      detail:
        "Distinguish between a traditional Bologna degree, an undivided one-tier professional medical degree, and vocational qualifications before paying a deposit.",
    },
    {
      num: 4,
      title: "INTENDED USE",
      desc: "Pakistan PMDC / HEC equivalence or overseas licensure",
      icon: GraduationCap,
      detail:
        "Verify if the exact award satisfies registration and licensing criteria with PMDC, PEC, or target healthcare and professional councils abroad.",
    },
  ];

  const routeStages = [
    {
      stage: "Stage 01",
      title: "University Admission Offer",
      desc: "Academic verification, entrance exam and formal offer",
      icon: Building2,
      detail:
        "Confirm the course and application route for your circumstances. Hungarian universities evaluate your prior credentials and often conduct subject entrance examinations (especially for medicine, dentistry, and STEM). An admission offer confirms academic eligibility.",
    },
    {
      stage: "Stage 02",
      title: "Route & Financial Evidence Check",
      desc: "Tuition deposit, living funds and sponsor verification",
      icon: FileCheck2,
      detail:
        "Then check the tuition payment requirements, financial evidence and other conditions relevant to your application. Hungarian guidance distinguishes financial evidence from the simple fact that you can pay an invoice.",
    },
    {
      stage: "Stage 03",
      title: "Study Residence Application",
      desc: "Consular filing, interview and residence permit issuance",
      icon: ShieldCheck,
      detail:
        "Hungarian immigration guidance describes a study residence route for eligible full-time study, including conditions on the institution and language ability. An offer alone does not establish that you meet all residence requirements.",
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
            <span className="text-slate-900 font-medium">Hungary</span>
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
                    Study in Hungary
                  </h1>

                  <p className="text-lg sm:text-xl text-slate-700 leading-relaxed font-medium">
                    An English-taught course can still leave big questions about recognition, funding and life after graduation. Answer those before paying for a place in Hungary.
                  </p>

                  <p className="text-base text-slate-600 leading-relaxed">
                    ProConsulting helps you compare courses and understand the next application step. Start with a free assessment of your study plans.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <Link
                    to={HUNGARY_SEO.ctaHref}
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-sm font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-lg shadow-[#FF4D6D]/20 hover:shadow-xl hover:shadow-[#FF4D6D]/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 text-center"
                  >
                    <span>Get free Hungary assessment</span>
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
                    <span>Compare the exact qualification.</span>
                  </div>
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-white/80 border border-slate-200/60">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Separate scholarship hopes from confirmed funding.</span>
                  </div>
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-white/80 border border-slate-200/60">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Check the residence route before committing.</span>
                  </div>
                </div>
              </div>

              {/* Right Image (5 cols) */}
              <div className="lg:col-span-5">
                <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl bg-slate-900 group">
                  <img
                    src="/destinations/Hungary.webp"
                    alt="Study in Hungary - Historic universities, medical faculties and technical colleges"
                    className="w-full h-[380px] sm:h-[440px] object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3A] via-[#0B1B3A]/30 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-white/40">
                    <img
                      src="https://flagcdn.com/w40/hu.png"
                      alt="Hungary flag"
                      className="w-5 h-3.5 object-cover rounded-xs"
                    />
                    <span className="text-xs font-bold text-[#0B1B3A]">Hungary</span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      European Degree System
                    </span>
                  </div>

                  <div className="absolute bottom-0 inset-x-0 p-6 text-white space-y-2">
                    <h3 className="text-lg font-bold text-white">Universities &amp; Medical Faculties</h3>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      Historic institutions, Bologna-accredited degrees, and clinical training across Budapest, Debrecen, Szeged, and Pécs.
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
                          Hungary Study Guide
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
                      to={HUNGARY_SEO.ctaHref}
                      className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-md hover:shadow-lg transition-all"
                    >
                      <span>Free Assessment</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </aside>

              {/* RIGHT SIDE: Choose the course before choosing the country */}
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                    Course Evaluation &amp; Career Reality
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                    Choose the course before choosing the country
                  </h2>
                </div>

                <div className="space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
                  <div className="p-6 sm:p-7 rounded-2xl bg-slate-50/80 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all">
                    <div className="flex items-start gap-3">
                      <Stethoscope className="w-5 h-5 text-[#FF4D6D] shrink-0 mt-1" />
                      <p className="font-semibold text-slate-900 text-lg">
                        If you are considering medicine or dentistry, start with professional recognition. Check the exact programme and the registration route in the country where you want to practise.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 sm:p-7 rounded-2xl bg-slate-50/80 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all">
                    <div className="flex items-start gap-3">
                      <Cpu className="w-5 h-5 text-[#0B1B3A] shrink-0 mt-1" />
                      <p>
                        For engineering or computing, compare modules, practical projects and entry requirements. A course title alone will not show how much specialist work you will do.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 sm:p-7 rounded-2xl bg-slate-50/80 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all">
                    <div className="flex items-start gap-3">
                      <Globe2 className="w-5 h-5 text-blue-600 shrink-0 mt-1" />
                      <p>
                        Ask about teaching and placement languages separately. An English-taught degree does not prove that every clinical placement or workplace task uses English.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 sm:p-7 rounded-2xl bg-amber-50/70 border border-amber-200/90 text-amber-950 font-medium shadow-2xs">
                    <p>
                      Think about returning to Pakistan too. The qualification should support a clear academic or career step without depending on a future overseas job.
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
                      Disciplines &amp; Verification Focus
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs text-slate-700">
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Medicine &amp; Dentistry</span>
                      </div>
                      <span className="text-slate-600 block">General medicine (6 yrs) &amp; dentistry (5 yrs) clinical language requirements.</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Engineering &amp; IT</span>
                      </div>
                      <span className="text-slate-600 block">BSc/MSc module balance, lab facilities and European credit transfer (ECTS).</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Pakistan Equivalence</span>
                      </div>
                      <span className="text-slate-600 block">PMDC and HEC document criteria reviewed before intake commitment.</span>
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
                Licensing &amp; Equivalence
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                An EU location is not automatic professional approval
              </h2>
              <div className="mt-4 space-y-3 text-slate-700 text-base sm:text-lg leading-relaxed">
                <p>
                  Do not assume every Hungarian qualification suits every career. Check the institution, awarding body and exact degree.
                </p>
                <p>
                  Professional registration is a separate decision. Medicine, dentistry and other regulated careers need particular care before you commit.
                </p>
                <p className="font-semibold text-[#0B1B3A]">
                  Ask the relevant authority about your intended qualification and route. University admission does not settle licensing, equivalence or permission to practise in another country.
                </p>
              </div>
            </div>

            {/* Decision Nodes: 4-step sequence with Dynamic Hover In / Out */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Degree Verification Sequence (Hover over any step)
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
                          {isHovered ? "Active Decision Check" : "Step " + step.num}
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
                Admission vs Immigration
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Keep university admission and residence approval separate
              </h2>
              <div className="mt-4 space-y-3 text-slate-700 text-base sm:text-lg leading-relaxed">
                <p>
                  Hungarian immigration guidance describes a study residence route for eligible full-time study, including conditions on the institution and language ability. An offer alone does not establish that you meet all residence requirements.
                </p>
                <p>
                  Confirm the course and application route for your circumstances. Then check the tuition payment requirements, financial evidence and other conditions relevant to your application.
                </p>
                <p className="font-semibold text-[#0B1B3A]">
                  Do not assume a preparatory course and the later degree have identical terms. Ask what progression requires and what happens if you do not meet the next entry conditions.
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
                        {isHovered ? "Official OIF Criterion" : "Sequential Route"}
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
                Budget Integrity
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Compare the whole course cost, not the first payment
              </h2>
              <div className="mt-4 space-y-3 text-slate-700 text-base sm:text-lg leading-relaxed">
                <p>
                  Separate tuition from housing, insurance, travel and daily spending. Compare the actual city and course length before calling a programme affordable.
                </p>
                <p>
                  Ask when tuition must be paid and how refunds work. An initial payment is not the same as the full cost of completing a degree.
                </p>
              </div>
            </div>

            {/* Editorial Split: Tuition & Living vs Funds & Sponsor Evidence */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {/* Box 1: Tuition & Living Costs */}
              <div className="rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-8 shadow-xs flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                    <div className="w-9 h-9 rounded-xl bg-[#0B1B3A] text-white flex items-center justify-center">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0B1B3A] text-lg">
                        Tuition, Living &amp; Housing Split
                      </h3>
                      <span className="text-xs text-slate-500">Full Programme Lifecycle</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed">
                    Hungarian tuition varies widely between disciplines. General medicine, dentistry and pharmacy carry significantly higher annual fees than humanities or computer science.
                  </p>

                  <div className="space-y-3 pt-2 text-xs text-slate-600">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 block font-semibold">City Variations:</strong>
                        Budapest rental costs differ from regional academic centers like Debrecen, Szeged, or Pécs.
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 block font-semibold">Mandatory Non-Tuition Items:</strong>
                        Private health insurance, residence permit registration fees, and textbook materials must be planned upfront.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500">
                  <span>Note: No estimate replaces official university invoices or current municipal living indices.</span>
                </div>
              </div>

              {/* Box 2: Payment Timing & Sponsor Evidence */}
              <div className="rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-8 shadow-xs flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                    <div className="w-9 h-9 rounded-xl bg-[#FF4D6D]/10 text-[#FF4D6D] flex items-center justify-center">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0B1B3A] text-lg">
                        Sponsorship &amp; Financial Evidence
                      </h3>
                      <span className="text-xs text-slate-500">Hungarian Immigration Standards</span>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
                    <p>
                      Your family may have funds but still need to show their source and availability correctly. Hungarian guidance distinguishes financial evidence from the simple fact that you can pay an invoice.
                    </p>
                    <p className="font-semibold text-slate-900">
                      If a parent will support you, review the evidence requirements for that support. Do not assume every transfer or bank balance will answer the same question.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 font-medium space-y-1.5">
                    <div className="flex items-center gap-2 text-amber-900 font-bold">
                      <AlertCircle className="w-4 h-4" />
                      <span>Legitimate Source &amp; Availability</span>
                    </div>
                    <p>
                      Bank statements must demonstrate genuine history and liquidity. Sudden lump-sum transfers without verifiable documentation risk consular refusal.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to={HUNGARY_SEO.ctaHref}
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
        {/* S06 | Funding (Conditional Funding Panel: Stipendium vs Self-Funded) */}
        {/* ========================================================================= */}
        <section id="funding" className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Scholarship vs Self-Funded Route
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Treat Stipendium Hungaricum as a separate application
              </h2>
              <div className="mt-4 space-y-3 text-slate-700 text-base sm:text-lg leading-relaxed">
                <p>
                  Stipendium Hungaricum has its own call, eligible programmes and sending-partner process. Availability depends on the applicable country and study route.
                </p>
                <p>
                  Read the call for your intended cycle. Check nomination steps and university selection rather than assuming one application guarantees a funded place.
                </p>
                <p>
                  An award may not remove every expense. Check tuition support, living support, accommodation arrangements and any costs your family must still meet.
                </p>
                <p className="font-semibold text-[#0B1B3A]">
                  Keep the self-funded route separate. A scholarship application is not money you can safely subtract from your budget before an award is confirmed.
                </p>
              </div>
            </div>

            {/* Interactive Conditional Toggle Panel */}
            <div className="rounded-3xl border border-slate-200/90 bg-slate-50/70 p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Select Funding Route Model:
                  </span>
                </div>

                <div className="inline-flex p-1 rounded-2xl bg-slate-200/70 border border-slate-300/60">
                  <button
                    onClick={() => setActiveFundingTab("scholarship")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeFundingTab === "scholarship"
                        ? "bg-[#0B1B3A] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Stipendium Hungaricum Route
                  </button>
                  <button
                    onClick={() => setActiveFundingTab("selffunded")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeFundingTab === "selffunded"
                        ? "bg-[#0B1B3A] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Direct Self-Funded Route
                  </button>
                </div>
              </div>

              {/* Panel Content based on Active Tab */}
              {activeFundingTab === "scholarship" ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2">
                    <span className="text-[11px] font-black uppercase text-[#FF4D6D] tracking-wider block">
                      Stage 01: Sending Partner
                    </span>
                    <h4 className="font-bold text-[#0B1B3A] text-sm">
                      National Nomination (e.g. HEC Pakistan)
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Applicants must apply through the designated national sending authority and sit required tests or pre-screening before nomination to Tempus Public Foundation.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2">
                    <span className="text-[11px] font-black uppercase text-[#FF4D6D] tracking-wider block">
                      Stage 02: University Exam
                    </span>
                    <h4 className="font-bold text-[#0B1B3A] text-sm">
                      Institutional Entrance Selection
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Nominated candidates are evaluated directly by the chosen Hungarian universities, requiring passing marks on entrance exams and oral interviews.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2">
                    <span className="text-[11px] font-black uppercase text-[#FF4D6D] tracking-wider block">
                      Stage 03: Final Award
                    </span>
                    <h4 className="font-bold text-[#0B1B3A] text-sm">
                      Award Letter &amp; Support Scope
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Covers tuition, modest monthly stipend and dormitory contribution. Travel costs and family living expenses remain non-covered liabilities.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2">
                    <span className="text-[11px] font-black uppercase text-[#0B1B3A] tracking-wider block">
                      Direct Application
                    </span>
                    <h4 className="font-bold text-[#0B1B3A] text-sm">
                      Direct University Portals
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Apply directly to university faculties with your academic transcripts and sit entrance exams without sending-partner nomination hurdles.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2">
                    <span className="text-[11px] font-black uppercase text-[#0B1B3A] tracking-wider block">
                      Budget Certainty
                    </span>
                    <h4 className="font-bold text-[#0B1B3A] text-sm">
                      Confirmed Family Funding
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Clear tuition fees and living expenses confirmed through parent bank statements and declared legal sponsorship without scholarship dependency.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2">
                    <span className="text-[11px] font-black uppercase text-[#0B1B3A] tracking-wider block">
                      Independent Timelines
                    </span>
                    <h4 className="font-bold text-[#0B1B3A] text-sm">
                      Flexible Intake Cycles
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Not bound to strict January Stipendium deadlines; many universities accept applications through spring and early summer for September start.
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
                Use the assessment to identify the next decision
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
                  Start with your previous qualification, intended subject and preferred level. Explain whether you are considering a scholarship, self-funding or both.
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
                  Discuss the questions that could change your choice. These may include professional recognition, entrance requirements or the amount your family can sustain.
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
                  Then confirm the help you need. Ask for any paid scope and fees in writing before work starts. The assessment cannot replace decisions by a university, scholarship body or immigration authority.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-start">
              <Link
                to={HUNGARY_SEO.ctaHref}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-md hover:shadow-lg transition-all"
              >
                <span>Get free Hungary assessment</span>
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
                Replace a low-fee assumption with a workable plan
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
                    choosing a medical degree because it is taught in English.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-emerald-200/80 space-y-1.5 shadow-2xs">
                  <span className="text-[11px] font-black uppercase text-emerald-700 tracking-wider block">
                    Better decision
                  </span>
                  <p className="text-sm text-slate-900 font-bold">
                    checking the qualification and your intended professional registration route.
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
                    treating a scholarship application as confirmed funding.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-emerald-200/80 space-y-1.5 shadow-2xs">
                  <span className="text-[11px] font-black uppercase text-emerald-700 tracking-wider block">
                    Better decision
                  </span>
                  <p className="text-sm text-slate-900 font-bold">
                    planning separately for an award and for no award.
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
                    assuming student residence includes your family.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-emerald-200/80 space-y-1.5 shadow-2xs">
                  <span className="text-[11px] font-black uppercase text-emerald-700 tracking-wider block">
                    Better decision
                  </span>
                  <p className="text-sm text-slate-900 font-bold">
                    reviewing family restrictions before making commitments.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 italic">
              These examples explain planning choices. They are not client results or promised outcomes.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S09 | Work & Family (Contained Navy Card Band) */}
        {/* ========================================================================= */}
        <section id="work" className="py-16 sm:py-20 bg-slate-50/50 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-[#0B1B3A] text-white p-8 sm:p-12 shadow-xl border border-slate-800 space-y-8">
              <div className="max-w-3xl space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] block">
                  Immigration &amp; Employment Limits
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                  Check family and work rules early
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-300 text-sm sm:text-base leading-relaxed">
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Family Reunification Restrictions</span>
                    </div>
                    <p className="text-slate-300 text-sm">
                      Hungarian study residence rules restrict family reunification, with a narrow exception described in official guidance. Do not plan on a partner or children joining through your student permission.
                    </p>
                  </div>

                  <p className="text-slate-300 text-sm">
                    If family travel is essential, resolve the route before paying for a course. Do not assume another family route is available.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                      <Briefcase className="w-4 h-4" />
                      <span>Student Part-Time Work Limits</span>
                    </div>
                    <p className="text-slate-300 text-sm">
                      Student work is subject to conditions and limits. It should not be the foundation of your tuition or housing budget.
                    </p>
                  </div>

                  <p className="text-slate-300 text-sm">
                    After study, a job-seeking or business route has separate conditions. Completing a degree does not automatically grant a job, long-term residence or permission to work across the EU.
                  </p>
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
                Questions about studying in Hungary
              </h2>
              <p className="text-sm text-slate-500">
                Official answers to common applicant inquiries about degrees, funding, and residence.
              </p>
            </div>

            <div className="space-y-4">
              {HUNGARY_FAQS.map((faq) => (
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
                Find help with the stage you are facing
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
                for course and application questions. Explore{" "}
                <Link
                  to="/education/services/scholarships"
                  className="font-bold text-[#0B1B3A] hover:text-[#FF4D6D] underline decoration-slate-300 underline-offset-4 hover:decoration-[#FF4D6D] transition-colors"
                >
                  scholarship support
                </Link>{" "}
                if you need help understanding an award route. For the residence stage, explore{" "}
                <Link
                  to="/education/services/visa"
                  className="font-bold text-[#0B1B3A] hover:text-[#FF4D6D] underline decoration-slate-300 underline-offset-4 hover:decoration-[#FF4D6D] transition-colors"
                >
                  visa support
                </Link>
                .
              </p>

              <p>
                Still choosing a country? Browse{" "}
                <Link
                  to="/education/destinations"
                  className="font-bold text-[#0B1B3A] hover:text-[#FF4D6D] underline decoration-slate-300 underline-offset-4 hover:decoration-[#FF4D6D] transition-colors"
                >
                  all study destinations
                </Link>{" "}
                and compare Hungary with{" "}
                <Link
                  to="/education/destinations/study-in-germany"
                  className="font-bold text-[#0B1B3A] hover:text-[#FF4D6D] underline decoration-slate-300 underline-offset-4 hover:decoration-[#FF4D6D] transition-colors"
                >
                  Germany
                </Link>
                . Check the actual course and funding plan for each.
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
                Make the difficult decisions before the deposit
              </h2>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Use a free Hungary assessment to discuss course fit, recognition and funding. Tell us early if your plans depend on a scholarship or on family travel.
              </p>
            </div>

            <div className="pt-2">
              <Link
                to={HUNGARY_SEO.ctaHref}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-xl shadow-[#FF4D6D]/20 hover:shadow-2xl hover:shadow-[#FF4D6D]/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Get free Hungary assessment</span>
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
            to={HUNGARY_SEO.ctaHref}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#FF4D6D] shadow-md"
          >
            <span>Get free Hungary assessment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      <Footer />
    </div>
  );
}
