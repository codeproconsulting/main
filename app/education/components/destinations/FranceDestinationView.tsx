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
} from "lucide-react";
import { Navbar } from "~/education/components/ui/Navbar";
import { Footer } from "~/education/components/ui/footer";
import {
  FRANCE_FAQS,
  FRANCE_SEO,
} from "~/education/lib/franceDestinationData";

export function FranceDestinationView() {
  const [activeAnchor, setActiveAnchor] = useState<string>("fit");
  const [showMobileCta, setShowMobileCta] = useState(true);
  const [hoveredFlowStep, setHoveredFlowStep] = useState<number | null>(null);
  const [hoveredRouteStage, setHoveredRouteStage] = useState<number | null>(null);

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
    { id: "route", label: "Études en France" },
    { id: "cost", label: "Actual Fees" },
    { id: "funding", label: "Scholarships" },
    { id: "process", label: "Process" },
    { id: "comparison", label: "Planning Shifts" },
    { id: "work", label: "Work & Family" },
    { id: "faqs", label: "FAQs" },
  ];

  const flowSteps = [
    {
      num: 1,
      title: "PROVIDER",
      desc: "Public University, Grande École, or Private Institute",
      icon: Landmark,
      detail:
        "Check whether the institution is a public university, an accredited grande école or a private institute. Legal status directly influences degree validity and fee schedules.",
    },
    {
      num: 2,
      title: "EXACT COURSE",
      desc: "Specific programme, campus and teaching language",
      icon: BookOpen,
      detail:
        "Inspect the curriculum syllabus, teaching language, campus location, and whether specific preparatory modules are mandatory for international students.",
    },
    {
      num: 3,
      title: "AWARD TYPE",
      desc: "Diplôme National (LMD), Titre d'Ingénieur, or RNCP Title",
      icon: Sparkles,
      detail:
        "Differentiate between a state-recognized Diplôme National, a commission-accredited engineering title, or a vocational RNCP registration before paying a deposit.",
    },
    {
      num: 4,
      title: "INTENDED USE",
      desc: "Doctoral progression, Pakistan HEC equivalence, or global employment",
      icon: GraduationCap,
      detail:
        "Verify if the qualification satisfies progression criteria for doctoral study, Pakistan HEC equivalence, and professional licensure boards in your target sector.",
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
            <span className="text-slate-900 font-medium">France</span>
          </nav>
        </div>
      </div>

      <main>
        {/* ========================================================================= */}
        {/* S01 | Hero (Two-column layout with visual scene) */}
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
                    <span>Study in France · Degree Types, Fees &amp; Études en France</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold text-[#0B1B3A] tracking-tight leading-[1.12]">
                    Study in France
                  </h1>
                </div>

                <p className="text-lg sm:text-xl font-medium text-slate-800 leading-relaxed">
                  A course can look right until the fees or degree details change your plans. Start with the award, language and full cost before choosing a French institution.
                </p>

                <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                  ProConsulting helps you compare your options and understand the next application step. Bring your study goals and questions to a free assessment.
                </p>

                {/* Primary CTA */}
                <div className="pt-2 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <Link
                      to={FRANCE_SEO.ctaHref}
                      className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-md hover:shadow-lg shadow-pink-500/20 hover:scale-[1.01] transition-all"
                    >
                      <span>{FRANCE_SEO.ctaText}</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Compare courses before paying. Understand the application route. Keep funding assumptions separate from confirmed support.
                  </p>
                </div>
              </div>

              {/* Right Image (5 cols) */}
              <div className="lg:col-span-5">
                <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl bg-slate-900 group">
                  <img
                    src="/destinations/France.webp"
                    alt="Study in France - Historic university campuses and grandes écoles"
                    className="w-full h-[380px] sm:h-[440px] object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3A] via-[#0B1B3A]/30 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-white/40">
                    <img
                      src="https://flagcdn.com/w40/fr.png"
                      alt="France flag"
                      className="w-5 h-3.5 object-cover rounded-xs"
                    />
                    <span className="text-xs font-bold text-[#0B1B3A]">France</span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      European Degree System
                    </span>
                  </div>

                  <div className="absolute bottom-0 inset-x-0 p-6 text-white space-y-2">
                    <h3 className="text-lg font-bold text-white">Universités &amp; Grandes Écoles</h3>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      National degrees, specialized engineering titles, and management schools across France.
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
              {/* LEFT SIDE: Navigation Box as requested by the user */}
              <aside className="lg:col-span-4">
                <div className="lg:sticky lg:top-24 rounded-3xl border border-slate-200/90 bg-slate-50/80 shadow-sm p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#0B1B3A] text-white flex items-center justify-center shadow-xs">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-[#0B1B3A] uppercase tracking-wider">
                          France Study Guide
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
                      to={FRANCE_SEO.ctaHref}
                      className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-md hover:shadow-lg transition-all"
                    >
                      <span>Free Assessment</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </aside>

              {/* RIGHT SIDE: Choose a course for the work you want to do */}
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                    Subject Choice &amp; Reality
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                    Choose a course for the work you want to do
                  </h2>
                </div>

                <div className="space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
                  <div className="p-6 sm:p-7 rounded-2xl bg-slate-50/80 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all">
                    <p className="font-semibold text-slate-900 text-lg">
                      Start with the subjects you want to study, not a school name. Compare modules, teaching language and the work you would produce. An English course title does not explain every language requirement.
                    </p>
                  </div>

                  <div className="p-6 sm:p-7 rounded-2xl bg-slate-50/80 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all">
                    <p>
                      For engineering, look at the award and any professional recognition you need. For business, compare the actual qualification rather than the school brochure. For arts, check portfolio expectations and access to facilities.
                    </p>
                  </div>

                  <div className="p-6 sm:p-7 rounded-2xl bg-amber-50/70 border border-amber-200/90 text-amber-950 font-medium shadow-2xs">
                    <p>
                      Ask what the course would help you do back in Pakistan. A useful project, research skill or technical specialism matters even if your plans change.
                    </p>
                  </div>
                </div>

                {/* Subject checklist */}
                <div className="p-6 sm:p-7 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
                    <div className="w-8 h-8 rounded-lg bg-[#FF4D6D]/10 text-[#FF4D6D] flex items-center justify-center">
                      <Scale className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-[#0B1B3A] text-base">
                      Subject Checklist
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs text-slate-700">
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Engineering</span>
                      </div>
                      <span className="text-slate-600 block">CTI accreditation and professional engineer title validation.</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Business &amp; Mgmt</span>
                      </div>
                      <span className="text-slate-600 block">RNCP state qualification level vs unaccredited school diploma.</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Language</span>
                      </div>
                      <span className="text-slate-600 block">English lectures still require French for daily life &amp; internships.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S03 | Recognition (Interactive Degree Verification Flow on Hover) */}
        {/* ========================================================================= */}
        <section id="recognition" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Qualification Status
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Check what qualification you will receive
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
              <div className="lg:col-span-6 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
                <p>
                  French higher education includes different awards and institution types. A national degree, a professional qualification and a school certificate should not be treated as the same thing.
                </p>
                <p>
                  Confirm the awarding body, qualification level and the exact course status. Then check the recognition or professional approval needed where you intend to work.
                </p>
                <div className="p-5 rounded-2xl bg-white border-l-4 border-l-[#FF4D6D] border border-slate-200/80 shadow-xs">
                  <p className="font-semibold text-slate-900 text-base">
                    An institution listing does not settle every professional question. If your career needs registration, check the relevant regulator before paying a deposit.
                  </p>
                </div>
              </div>

              {/* Award Decision Interactive Flow - Hover updates active styling */}
              <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-xs sm:text-sm font-bold text-[#0B1B3A] uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#FF4D6D]" />
                    <span>Degree Verification Flow</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">Hover to explore</span>
                </div>

                <div className="space-y-3">
                  {flowSteps.map((step) => {
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
        {/* S04 | Route (Études en France & Planning Timeline - Fixed Icons & Cards) */}
        {/* ========================================================================= */}
        <section id="route" className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Application Procedures
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Your application route depends on the programme
              </h2>
            </div>

            <div className="max-w-4xl space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed mb-12">
              <p>
                Campus France Pakistan describes both Etudes en France applications and a route for students applying directly to an institution. Etudes en France is the French study application platform.
              </p>
              <p>
                The correct route depends on the institution, course and your situation. A direct admission offer does not mean you can skip the later study or visa steps.
              </p>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 text-slate-900 font-semibold text-base">
                Compare the institution instructions with the relevant Campus France process. Keep admission, any Campus France review and the visa decision separate. None is a promise of the next.
              </div>
            </div>

            {/* Planning Stage Horizontal Sequence with Proper Icons and Dynamic Hover */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Stage 1 */}
              <div
                onMouseEnter={() => setHoveredRouteStage(1)}
                onMouseLeave={() => setHoveredRouteStage(null)}
                className={`p-7 rounded-3xl border transition-all duration-300 relative flex flex-col justify-between ${
                  hoveredRouteStage === 1
                    ? "bg-white border-[#FF4D6D] shadow-lg ring-1 ring-[#FF4D6D]/20 -translate-y-1"
                    : "bg-slate-50/70 border-slate-200/90 hover:bg-white hover:border-slate-300 hover:shadow-md"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors duration-200 ${
                        hoveredRouteStage === 1
                          ? "bg-[#FF4D6D] text-white shadow-xs"
                          : "bg-[#0B1B3A] text-white"
                      }`}
                    >
                      <Building2 className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-xs font-extrabold px-3 py-1 rounded-full border transition-colors duration-200 ${
                        hoveredRouteStage === 1
                          ? "bg-pink-50 text-[#FF4D6D] border-pink-200"
                          : "bg-white text-slate-600 border-slate-200"
                      }`}
                    >
                      Stage 01
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#0B1B3A]">
                    Institutional Admission
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Apply via Études en France candidature campaign or direct institutional platform depending on provider membership.
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center text-xs font-semibold text-slate-500">
                  <span>Step 1 of 3 · Platform Evaluation</span>
                </div>
              </div>

              {/* Stage 2 */}
              <div
                onMouseEnter={() => setHoveredRouteStage(2)}
                onMouseLeave={() => setHoveredRouteStage(null)}
                className={`p-7 rounded-3xl border transition-all duration-300 relative flex flex-col justify-between ${
                  hoveredRouteStage === 2
                    ? "bg-white border-[#FF4D6D] shadow-lg ring-1 ring-[#FF4D6D]/20 -translate-y-1"
                    : "bg-slate-50/70 border-slate-200/90 hover:bg-white hover:border-slate-300 hover:shadow-md"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors duration-200 ${
                        hoveredRouteStage === 2
                          ? "bg-[#FF4D6D] text-white shadow-xs"
                          : "bg-[#0B1B3A] text-white"
                      }`}
                    >
                      <Compass className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-xs font-extrabold px-3 py-1 rounded-full border transition-colors duration-200 ${
                        hoveredRouteStage === 2
                          ? "bg-pink-50 text-[#FF4D6D] border-pink-200"
                          : "bg-white text-slate-600 border-slate-200"
                      }`}
                    >
                      Stage 02
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#0B1B3A]">
                    Campus France Pakistan Review
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Complete file verification, academic interview and pre-consular validation required before the visa appointment.
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center text-xs font-semibold text-slate-500">
                  <span>Step 2 of 3 · Pre-Consular Verification</span>
                </div>
              </div>

              {/* Stage 3 */}
              <div
                onMouseEnter={() => setHoveredRouteStage(3)}
                onMouseLeave={() => setHoveredRouteStage(null)}
                className={`p-7 rounded-3xl border transition-all duration-300 relative flex flex-col justify-between ${
                  hoveredRouteStage === 3
                    ? "bg-white border-[#FF4D6D] shadow-lg ring-1 ring-[#FF4D6D]/20 -translate-y-1"
                    : "bg-slate-50/70 border-slate-200/90 hover:bg-white hover:border-slate-300 hover:shadow-md"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors duration-200 ${
                        hoveredRouteStage === 3
                          ? "bg-[#FF4D6D] text-white shadow-xs"
                          : "bg-[#0B1B3A] text-white"
                      }`}
                    >
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-xs font-extrabold px-3 py-1 rounded-full border transition-colors duration-200 ${
                        hoveredRouteStage === 3
                          ? "bg-pink-50 text-[#FF4D6D] border-pink-200"
                          : "bg-white text-slate-600 border-slate-200"
                      }`}
                    >
                      Stage 03
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#0B1B3A]">
                    Long-Stay Visa Decision
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Independent consular evaluation of financial means, accommodation and intention to study in France.
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center text-xs font-semibold text-slate-500">
                  <span>Step 3 of 3 · Final Consular Stage</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S05 | Cost (Static Cost & Payment Explanation) */}
        {/* ========================================================================= */}
        <section id="cost" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Tuition &amp; Budgets
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Compare the fee you will actually pay
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-8">
              <div className="p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0B1B3A] flex items-center justify-center mb-2">
                  <Wallet className="w-5 h-5 text-[#FF4D6D]" />
                </div>
                <h3 className="text-xl font-bold text-[#0B1B3A]">Non-EU Fee Realities</h3>
                <p className="text-slate-700 leading-relaxed text-base">
                  Do not build a budget around a headline public-university fee. Non-EU fees, exemptions and private-school charges can differ. Ask for the fee that applies to your course and intake.
                </p>
              </div>

              <div className="p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0B1B3A] flex items-center justify-center mb-2">
                  <Building2 className="w-5 h-5 text-[#FF4D6D]" />
                </div>
                <h3 className="text-xl font-bold text-[#0B1B3A]">City &amp; Housing Variations</h3>
                <p className="text-slate-700 leading-relaxed text-base">
                  Separate tuition from housing, insurance, travel and everyday living costs. Compare the chosen city and housing option rather than assuming Paris and other cities cost the same.
                </p>
              </div>

              <div className="p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0B1B3A] flex items-center justify-center mb-2">
                  <CalendarClock className="w-5 h-5 text-[#FF4D6D]" />
                </div>
                <h3 className="text-xl font-bold text-[#0B1B3A]">Payment Due Dates &amp; Refunds</h3>
                <p className="text-slate-700 leading-relaxed text-base">
                  Payment timing matters too. Check when an application charge, tuition deposit or housing payment becomes due. Read refund terms before paying, including what happens after a visa refusal.
                </p>
              </div>

              <div className="p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0B1B3A] flex items-center justify-center mb-2">
                  <ShieldAlert className="w-5 h-5 text-[#FF4D6D]" />
                </div>
                <h3 className="text-xl font-bold text-[#0B1B3A]">Living vs Visa Funds</h3>
                <p className="text-slate-700 leading-relaxed text-base">
                  Your family budget and visa funding evidence answer different questions. Money reserved for living costs may still need to meet specific evidence rules.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S06 | Funding (Conditional Funding Panel) */}
        {/* ========================================================================= */}
        <section id="funding" className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Scholarship Criteria
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                A scholarship search is not a funding award
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
              <div className="lg:col-span-8 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
                <p>
                  Campus France lists funding options that vary by nationality, study level and subject. Some applications involve an institution rather than a direct student submission.
                </p>
                <p>
                  Check the actual award terms before adding it to your plan. Tuition support may leave housing, travel or other costs unpaid. An offer of admission does not include a scholarship unless the written terms say so.
                </p>
                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 font-medium">
                  Keep an unfunded plan beside any scholarship application. If the course only works with an award, resolve that risk before making a payment you cannot recover.
                </div>
              </div>

              {/* Status Comparison Panel */}
              <div className="lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0B1B3A]">
                  Funding Status Checklist
                </h3>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-slate-900">Scholarship Search</span>
                      <span className="text-xs text-slate-500">Unconfirmed assumption</span>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                      Pending
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-emerald-200/80 flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-slate-900">Written Award Terms</span>
                      <span className="text-xs text-slate-500">Signed confirmation</span>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Confirmed
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-rose-200/80 flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-slate-900">Unfunded Self-Plan</span>
                      <span className="text-xs text-slate-500">Family savings baseline</span>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-[#FF4D6D] border border-rose-200">
                      Essential
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S07 | Process (Assessment Process) */}
        {/* ========================================================================= */}
        <section id="process" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Structured Advisory
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                What the assessment helps you decide
              </h2>
            </div>

            {/* 3 Step Process Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-10">
              <div className="p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
                <span className="w-10 h-10 rounded-2xl bg-[#0B1B3A] text-white flex items-center justify-center font-bold text-sm">
                  1
                </span>
                <p className="text-base text-slate-700 leading-relaxed font-medium">
                  First, explain your previous studies and the course you want next. Include your preferred language and whether your family has a firm spending limit.
                </p>
              </div>

              <div className="p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
                <span className="w-10 h-10 rounded-2xl bg-[#0B1B3A] text-white flex items-center justify-center font-bold text-sm">
                  2
                </span>
                <p className="text-base text-slate-700 leading-relaxed font-medium">
                  Next, discuss which questions need answers before an application. These may concern entry requirements, award status, fees or the relevant application route.
                </p>
              </div>

              <div className="p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
                <span className="w-10 h-10 rounded-2xl bg-[#FF4D6D] text-white flex items-center justify-center font-bold text-sm">
                  3
                </span>
                <p className="text-base text-slate-700 leading-relaxed font-medium">
                  Then agree the support you need. Ask for the scope and any service fee in writing before paid work begins. The free assessment is a starting conversation, not an admission or visa decision.
                </p>
              </div>
            </div>

            <div className="text-center sm:text-left">
              <Link
                to={FRANCE_SEO.ctaHref}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-md hover:shadow-lg transition-all"
              >
                <span>{FRANCE_SEO.ctaText}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S08 | Comparison (Before & Better Decision Pairs) */}
        {/* ========================================================================= */}
        <section id="comparison" className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Evidence-Based Decisions
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Move from a brochure choice to an informed plan
              </h2>
            </div>

            <div className="space-y-4 max-w-4xl mb-8">
              {/* Pair 1 */}
              <div className="p-6 sm:p-7 rounded-3xl border border-slate-200/90 bg-slate-50/70 grid grid-cols-1 md:grid-cols-2 gap-5 shadow-2xs hover:border-slate-300 transition-all">
                <div className="space-y-1.5">
                  <span className="inline-block text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    Before
                  </span>
                  <p className="text-base sm:text-lg text-slate-700 font-medium pt-1">
                    choosing a school because its headline fee looks low.
                  </p>
                </div>
                <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-slate-200/80 pt-4 md:pt-0 md:pl-6">
                  <span className="inline-block text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Better decision
                  </span>
                  <p className="text-base sm:text-lg font-bold text-slate-900 pt-1">
                    checking your actual fee category and the conditions for any exemption.
                  </p>
                </div>
              </div>

              {/* Pair 2 */}
              <div className="p-6 sm:p-7 rounded-3xl border border-slate-200/90 bg-slate-50/70 grid grid-cols-1 md:grid-cols-2 gap-5 shadow-2xs hover:border-slate-300 transition-all">
                <div className="space-y-1.5">
                  <span className="inline-block text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    Before
                  </span>
                  <p className="text-base sm:text-lg text-slate-700 font-medium pt-1">
                    treating an English-taught programme as a complete language plan.
                  </p>
                </div>
                <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-slate-200/80 pt-4 md:pt-0 md:pl-6">
                  <span className="inline-block text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Better decision
                  </span>
                  <p className="text-base sm:text-lg font-bold text-slate-900 pt-1">
                    checking course requirements and considering French for daily life.
                  </p>
                </div>
              </div>

              {/* Pair 3 */}
              <div className="p-6 sm:p-7 rounded-3xl border border-slate-200/90 bg-slate-50/70 grid grid-cols-1 md:grid-cols-2 gap-5 shadow-2xs hover:border-slate-300 transition-all">
                <div className="space-y-1.5">
                  <span className="inline-block text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    Before
                  </span>
                  <p className="text-base sm:text-lg text-slate-700 font-medium pt-1">
                    assuming a direct offer completes the process.
                  </p>
                </div>
                <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-slate-200/80 pt-4 md:pt-0 md:pl-6">
                  <span className="inline-block text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Better decision
                  </span>
                  <p className="text-base sm:text-lg font-bold text-slate-900 pt-1">
                    confirming the remaining Campus France and visa stages.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              This is a planning example, not a client result or a promised outcome.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S09 | Work (Conditional Work & Family in Navy Band) */}
        {/* ========================================================================= */}
        <section id="work" className="py-16 sm:py-20 bg-[#0B1B3A] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Work &amp; Family Realities
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                Plan without relying on a student job
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-5 text-base sm:text-lg text-slate-300 leading-relaxed">
                <p>
                  Student work depends on the permission and conditions that apply to you. A possible job is not confirmed funding for tuition or rent.
                </p>
                <p>
                  French language ability may affect the roles you can realistically pursue. Compare course demands with any permitted work rather than planning around maximum earnings.
                </p>
                <div className="p-5 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold">
                  Family travel and options after graduation need separate checks. Admission does not automatically give a partner permission to join you or create a right to remain. Keep a return-home plan that makes the course worthwhile.
                </div>
              </div>

              <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-4">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#FF4D6D]" />
                  <span>Key Policy Boundaries</span>
                </h3>
                <ul className="text-xs sm:text-sm text-slate-300 space-y-3">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D] mt-2 shrink-0" />
                    <span>Student work hours are strictly regulated under French labour law.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D] mt-2 shrink-0" />
                    <span>Local student jobs typically require conversational French proficiency.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D] mt-2 shrink-0" />
                    <span>Family accompany rights require independent eligibility and funds review.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S10 | FAQ (Elevated Modern Accordion) */}
        {/* ========================================================================= */}
        <section id="faqs" className="py-16 sm:py-24 bg-slate-50/70 border-b border-slate-200/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-pink-50 border border-pink-200/60 px-3 py-1 rounded-full mb-3">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Questions about studying in France
              </h2>
            </div>

            {/* Native details accordion with polished UI and SSR preservation */}
            <div className="space-y-4">
              {FRANCE_FAQS.map((faq, index) => (
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
        {/* S11 | Related Guidance */}
        {/* ========================================================================= */}
        <section id="related" className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Next Steps
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Compare your next step
              </h2>
            </div>

            <div className="max-w-4xl space-y-6 text-base sm:text-lg text-slate-700 leading-relaxed">
              <p>
                Need help choosing a programme?{" "}
                <Link
                  to="/education/services/admission"
                  className="text-[#0B1B3A] font-bold underline decoration-[#FF4D6D] decoration-2 underline-offset-4 hover:text-[#FF4D6D] transition-colors"
                >
                  Explore admission guidance
                </Link>
                . Preparing the study visa stage?{" "}
                <Link
                  to="/education/services/visa"
                  className="text-[#0B1B3A] font-bold underline decoration-[#FF4D6D] decoration-2 underline-offset-4 hover:text-[#FF4D6D] transition-colors"
                >
                  Explore visa support
                </Link>
                . Still comparing countries?{" "}
                <Link
                  to="/education/destinations"
                  className="text-[#0B1B3A] font-bold underline decoration-[#FF4D6D] decoration-2 underline-offset-4 hover:text-[#FF4D6D] transition-colors"
                >
                  Browse all study destinations
                </Link>
                .
              </p>

              <p>
                You can also compare France with{" "}
                <Link
                  to="/education/destinations/study-in-germany"
                  className="text-[#0B1B3A] font-bold underline decoration-[#FF4D6D] decoration-2 underline-offset-4 hover:text-[#FF4D6D] transition-colors"
                >
                  Germany
                </Link>{" "}
                for a different course and language pathway. Choose the country around a suitable programme, not a promise of easy entry.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S12 | Close (Final Assessment Invitation) */}
        {/* ========================================================================= */}
        <section id="assessment" className="py-16 sm:py-24 bg-slate-50/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-12 lg:p-16 rounded-3xl bg-white border border-slate-200/90 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF4D6D]/5 rounded-full blur-3xl pointer-events-none" />

              <div className="max-w-3xl space-y-6 relative z-10">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] block">
                  Starting Point
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                  Start with the questions that could change your decision
                </h2>

                <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                  Tell us what you want to study in France and what concerns your family most. Use the free assessment to discuss course fit, funding and the next application step.
                </p>

                <div className="pt-2">
                  <Link
                    to={FRANCE_SEO.ctaHref}
                    className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-md hover:shadow-lg transition-all"
                  >
                    <span>{FRANCE_SEO.ctaText}</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border-l-4 border-l-[#FF4D6D] text-slate-900 font-bold text-sm sm:text-base mt-6">
                  No consultant can guarantee a scholarship, admission or visa, and we do not.
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Mobile Sticky CTA */}
      {showMobileCta && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3.5 shadow-lg md:hidden">
          <Link
            to={FRANCE_SEO.ctaHref}
            className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-md"
          >
            <span>{FRANCE_SEO.ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      <Footer />
    </div>
  );
}
