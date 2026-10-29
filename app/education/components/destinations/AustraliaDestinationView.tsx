"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Building2,
  GraduationCap,
  Briefcase,
  HelpCircle,
  FileCheck2,
  DollarSign,
  Scale,
  Users2,
  BookOpen,
  ChevronDown,
  Compass,
} from "lucide-react";
import { Navbar } from "~/education/components/ui/Navbar";
import { Footer } from "~/education/components/ui/footer";
import {
  AUSTRALIA_FAQS,
  AUSTRALIA_SEO,
} from "~/education/lib/australiaDestinationData";

export function AustraliaDestinationView() {
  const [activeAnchor, setActiveAnchor] = useState<string>("fit");
  const [showMobileCta, setShowMobileCta] = useState(true);
  const [selectedCourseLane, setSelectedCourseLane] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const anchors = [
        "fit",
        "courses",
        "recognition",
        "costs",
        "evidence",
        "scholarships",
        "admission",
        "genuine-student",
        "work-rights",
        "post-study",
        "process",
        "faqs",
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
    { id: "fit", label: "Country Fit" },
    { id: "courses", label: "Courses" },
    { id: "recognition", label: "Recognition" },
    { id: "costs", label: "Costs" },
    { id: "evidence", label: "Financial Evidence" },
    { id: "scholarships", label: "Scholarships" },
    { id: "admission", label: "Offer & CoE" },
    { id: "genuine-student", label: "Genuine Student" },
    { id: "work-rights", label: "Work Rights" },
    { id: "post-study", label: "Graduate & Family" },
    { id: "process", label: "Process" },
    { id: "faqs", label: "FAQs" },
  ];

  const courseLanes = [
    {
      title: "Business and accounting",
      summary:
        "Compare subjects, assessment methods and professional recognition. A broad business degree and a specialist accounting course can lead to different next steps.",
      icon: Briefcase,
    },
    {
      title: "Computing and engineering",
      summary:
        "Read the module list and entry rules. Check the balance of theory, practical projects and specialist options. Do not assume every course includes a work placement.",
      icon: Building2,
    },
    {
      title: "Health and education",
      summary:
        "Check clinical or teaching requirements early. Professional registration can involve separate English, placement and licensing rules. Graduation alone may not allow you to practise.",
      icon: GraduationCap,
    },
    {
      title: "Research study",
      summary:
        "Look for a suitable supervisor and research area. Confirm how supervision, facilities and funding work before choosing a project.",
      icon: BookOpen,
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
            <span className="text-slate-900 font-medium">Australia</span>
          </nav>
        </div>
      </div>

      <main>
        {/* ========================================================================= */}
        {/* S01 | Hero (Pale Hero) */}
        {/* ========================================================================= */}
        <section className="bg-slate-50/70 pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Text Left (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="inline-block text-xs sm:text-sm font-semibold tracking-wide text-slate-700 bg-slate-200/70 px-3.5 py-1.5 rounded-full mb-4">
                    Study in Australia · Academic Fit, Costs &amp; Visa Steps
                  </span>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-extrabold text-[#0B1B3A] tracking-tight leading-[1.12]">
                    Study in Australia
                  </h1>
                </div>

                <p className="text-lg sm:text-xl font-medium text-slate-800 leading-relaxed">
                  A course can look right until the full cost becomes clear. Before you pay a deposit, check what you will study. Check what your family can fund and what the visa requires.
                </p>

                <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                  ProConsulting helps you compare Australian study options against your grades and plans. Start with course fit, then review costs, entry rules and next steps.
                </p>

                <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                  Your study choice should still make sense if you return home after graduation. A possible work route should not carry the whole decision.
                </p>

                {/* Primary CTA */}
                <div className="pt-2 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <Link
                      to={AUSTRALIA_SEO.ctaHref}
                      className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-base font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-md hover:shadow-lg transition-all"
                    >
                      <span>{AUSTRALIA_SEO.ctaText}</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Explore courses, funding questions and application steps before you commit.
                  </p>
                </div>
              </div>

              {/* Right Image (5 cols) */}
              <div className="lg:col-span-5">
                <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl bg-slate-900 group">
                  <img
                    src="/destinations/Australia.webp"
                    alt="Study in Australia - Campus and higher education"
                    className="w-full h-[360px] sm:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3A] via-[#0B1B3A]/30 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-white/40">
                    <img
                      src="https://flagcdn.com/w40/au.png"
                      alt="Australia flag"
                      className="w-5 h-3.5 object-cover rounded-xs"
                    />
                    <span className="text-xs font-bold text-[#0B1B3A]">Australia</span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      CRICOS Enrolment
                    </span>
                  </div>

                  <div className="absolute bottom-0 inset-x-0 p-6 text-white space-y-2">
                    <h3 className="text-lg font-bold text-white">Australian Higher Education</h3>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      Rigorous CRICOS-registered degrees across world-class universities and institutes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sticky Anchor Navigation Bar */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs hidden md:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-1 overflow-x-auto py-2.5 scrollbar-none text-xs font-semibold">
              {navLinks.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                    activeAnchor === item.id
                      ? "bg-[#0B1B3A] text-white"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <div className="ml-auto pl-4">
                <Link
                  to={AUSTRALIA_SEO.ctaHref}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#FF4D6D] text-white hover:bg-[#e03b5b] transition-colors font-bold text-xs shadow-xs"
                >
                  <span>Free Assessment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </nav>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* S02 | Country fit (White) */}
        {/* ========================================================================= */}
        <section id="fit" className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Decision Groundwork
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Is Australia right for your plan?
              </h2>
            </div>

            {/* Two-Column Fits / Pause Decision Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-10">
              {/* Column 1: Fits */}
              <div className="p-6 sm:p-8 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-950">When Australia fits your path</h3>
                </div>
                <p className="text-slate-700 leading-relaxed text-base">
                  Australia may suit you if a specific course supports your next career step. Look for useful modules, suitable teaching and a clear reason to choose that provider.
                </p>
              </div>

              {/* Column 2: Pause */}
              <div className="p-6 sm:p-8 rounded-2xl bg-amber-50/50 border border-amber-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-amber-950">When you should pause and reflect</h3>
                </div>
                <p className="text-slate-700 leading-relaxed text-base">
                  Pause if your plan depends on winning an unconfirmed scholarship. Pause if a future job must cover your first tuition payment. Those gaps need answers before an application moves forward.
                </p>
              </div>
            </div>

            {/* Summary sentence */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 max-w-4xl space-y-6">
              <p className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed">
                Compare the Australian option with a course closer to home. What extra learning or experience would justify the extra cost?
              </p>

              {/* Buttons jumping to S03 or S05 */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#courses"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B1B3A] text-white text-sm font-bold hover:bg-[#162D4D] transition-colors"
                >
                  <span>I want to compare courses</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#costs"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm font-bold hover:bg-slate-100 transition-colors"
                >
                  <span>I need to review funding first</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S03 | Course explorer (Pale) */}
        {/* ========================================================================= */}
        <section id="courses" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Academic Direction
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Choose the course, not just the country
              </h2>
            </div>

            {/* Accessible SSR Course Lanes with Interactive Selector Tabs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Lane buttons */}
              <div className="lg:col-span-5 space-y-3">
                {courseLanes.map((lane, idx) => {
                  const Icon = lane.icon;
                  const isSelected = selectedCourseLane === idx;
                  return (
                    <button
                      key={lane.title}
                      type="button"
                      onClick={() => setSelectedCourseLane(idx)}
                      className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? "bg-white border-[#0B1B3A] shadow-md ring-1 ring-[#0B1B3A]"
                          : "bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? "bg-[#0B1B3A] text-white" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{lane.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Click to view course-fit details</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Lane content card (SSR fallback: all lanes rendered for search engines & accessibility) */}
              <div className="lg:col-span-7">
                <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-md space-y-5">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#0B1B3A] text-white flex items-center justify-center">
                      {selectedCourseLane === 0 && <Briefcase className="w-5 h-5" />}
                      {selectedCourseLane === 1 && <Building2 className="w-5 h-5" />}
                      {selectedCourseLane === 2 && <GraduationCap className="w-5 h-5" />}
                      {selectedCourseLane === 3 && <BookOpen className="w-5 h-5" />}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Selected Field
                      </span>
                      <h3 className="text-xl font-bold text-[#0B1B3A]">
                        {courseLanes[selectedCourseLane].title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                    {courseLanes[selectedCourseLane].summary}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                    <span>CRICOS-verified qualification fit</span>
                    <a href="#assessment" className="text-[#FF4D6D] font-bold hover:underline">
                      Discuss this field in your assessment →
                    </a>
                  </div>
                </div>

                {/* Mobile / Screen-Reader Stacked Fallback (native details) */}
                <div className="mt-6 space-y-3 lg:hidden">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    All Course Streams (Summary List)
                  </span>
                  {courseLanes.map((lane) => (
                    <details
                      key={lane.title}
                      className="group rounded-xl border border-slate-200 bg-white p-4 open:shadow-xs"
                    >
                      <summary className="font-bold text-sm text-[#0B1B3A] cursor-pointer flex items-center justify-between">
                        <span>{lane.title}</span>
                        <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
                      </summary>
                      <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {lane.summary}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S04 | Recognition (White) */}
        {/* ========================================================================= */}
        <section id="recognition" className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Career Alignment
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Test the value beyond graduation
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* 4 Public Paragraphs */}
              <div className="lg:col-span-7 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <p className="font-medium text-slate-800">
                    Picture the role you want after study. Then ask which course skills that role needs. Compare those skills with the actual subjects you would take.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <p>
                    If you plan to return to Pakistan, check recognition with the relevant authority. Professional degrees may need further approval or registration. Ask about this before paying tuition.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <p>
                    A placement can add experience, but its terms matter. Check whether it is required, arranged or competitive. Ask whether it is paid and what extra costs apply.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 text-amber-950 font-medium">
                  <p>
                    A university name cannot guarantee a job. Choose a course you can explain clearly to a future employer.
                  </p>
                </div>
              </div>

              {/* Static Course-to-Career Diagram (Ordered Sequence) */}
              <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-6">
                <h3 className="text-lg font-bold text-[#0B1B3A] flex items-center gap-2">
                  <Scale className="w-5 h-5 text-[#FF4D6D]" />
                  <span>Course-to-Career Evaluation</span>
                </h3>

                <ol className="space-y-4 text-sm text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#0B1B3A] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <strong className="text-slate-900 block">Target Role Skills</strong>
                      Identify specific technical and professional competencies demanded by your chosen profession.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#0B1B3A] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <strong className="text-slate-900 block">Syllabus &amp; Modules</strong>
                      Verify that the syllabus covers those requirements in depth rather than broad survey topics.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#0B1B3A] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <strong className="text-slate-900 block">Home Country Recognition</strong>
                      Review accreditation requirements with Pakistani or target licensing boards prior to deposit payment.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#0B1B3A] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      4
                    </span>
                    <div>
                      <strong className="text-slate-900 block">Independent Value</strong>
                      Ensure the degree holds tangible, standalone academic merit even without overseas employment.
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S05 | Static cost plan (Pale) */}
        {/* ========================================================================= */}
        <section id="costs" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Financial Reality
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Build a budget your family can carry
              </h2>
            </div>

            {/* Editorial Cost-Category Strip (No input fields or calculators) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                <div className="flex items-center gap-2.5 text-[#0B1B3A]">
                  <DollarSign className="w-5 h-5 text-[#FF4D6D]" />
                  <h3 className="text-lg font-bold">1. Tuition &amp; Fee Schedules</h3>
                </div>
                <p className="text-slate-700 leading-relaxed text-base">
                  Start with the provider's current tuition quote. Check whether it covers one year or the whole course. Ask about deposits, later instalments and possible fee changes.
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                <div className="flex items-center gap-2.5 text-[#0B1B3A]">
                  <Building2 className="w-5 h-5 text-[#FF4D6D]" />
                  <h3 className="text-lg font-bold">2. Living &amp; Mandatory Outlays</h3>
                </div>
                <p className="text-slate-700 leading-relaxed text-base">
                  Then allow for housing, food, transport and daily spending. Include travel, health cover, visa charges and course costs. Some courses require equipment, materials or placement travel.
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                <div className="flex items-center gap-2.5 text-[#0B1B3A]">
                  <Compass className="w-5 h-5 text-[#FF4D6D]" />
                  <h3 className="text-lg font-bold">3. Location-Specific Differences</h3>
                </div>
                <p className="text-slate-700 leading-relaxed text-base">
                  Your city and housing choice can change the total. Compare realistic accommodation options near your campus, not a national average alone.
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                <div className="flex items-center gap-2.5 text-[#0B1B3A]">
                  <AlertCircle className="w-5 h-5 text-[#FF4D6D]" />
                  <h3 className="text-lg font-bold">4. Payment Timing &amp; Liquidity</h3>
                </div>
                <p className="text-slate-700 leading-relaxed text-base">
                  Write down when each payment falls due. A family may afford the total but struggle with the first large payment. Leave room for unexpected costs and exchange-rate changes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S06 | Financial evidence (White) */}
        {/* ========================================================================= */}
        <section id="evidence" className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Regulatory Standards
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Living costs and visa funds are different checks
              </h2>
            </div>

            {/* Split Panels: Real Spending vs Visa Financial Evidence */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#0B1B3A] text-white flex items-center justify-center font-bold text-xs">
                    RS
                  </div>
                  <h3 className="text-lg font-bold text-[#0B1B3A]">Real spending</h3>
                </div>
                <p className="text-slate-700 leading-relaxed text-base">
                  The immigration financial requirement is not a promise of affordable living. Your actual spending may be higher. Tuition also needs its own plan.
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FF4D6D] text-white flex items-center justify-center font-bold text-xs">
                    VF
                  </div>
                  <h3 className="text-lg font-bold text-[#0B1B3A]">Visa financial evidence</h3>
                </div>
                <p className="text-slate-700 leading-relaxed text-base">
                  Home Affairs may require evidence that suitable funds are available. The right evidence depends on the current rules and your circumstances. A bank balance alone does not explain every funding arrangement.
                </p>
              </div>
            </div>

            {/* Practical guidance paragraphs */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-100/70 border border-slate-200/90 max-w-4xl space-y-4">
              <p className="text-slate-800 leading-relaxed text-base sm:text-lg">
                If parents or another sponsor will help, discuss that arrangement early. The source of the money and your access to it must be clear.
              </p>
              <p className="text-slate-800 leading-relaxed text-base sm:text-lg">
                Plan the course without relying on future wages or an undecided award. We can discuss funding questions during your assessment before you commit money.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S07 | Scholarships (Pale) */}
        {/* ========================================================================= */}
        <section id="scholarships" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Funding Realities
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Treat scholarships as specific offers
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
                <p>
                  Australian providers and other bodies offer scholarships with different terms. Some reduce tuition only. Others target certain courses, research projects or applicant groups.
                </p>
                <p>
                  Check eligibility, selection rules and the closing date for each award. Read what it covers and what you must keep doing to retain it. A tuition discount may leave living costs entirely with your family.
                </p>
                <p>
                  Do not count an award as confirmed funding until you have written terms. Admission and scholarship decisions can be separate.
                </p>
                <p>
                  We can help you understand suitable opportunities and the application steps. We cannot promise an award or replace the funder's decision.
                </p>

                <div className="pt-2">
                  <Link
                    to="/education/services/scholarships"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B1B3A] text-white text-sm font-bold hover:bg-[#162D4D] transition-colors"
                  >
                    <span>Explore scholarship guidance</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Award Terms Panel */}
              <div className="lg:col-span-4 p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <FileCheck2 className="w-5 h-5 text-[#FF4D6D]" />
                  <span>Scholarship Terms Checklist</span>
                </div>
                <ul className="text-xs sm:text-sm text-slate-600 space-y-2.5">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Written confirmation on official letterhead</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Exact duration (single year vs multi-year)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Academic grade retention criteria</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Exclusion of living and accommodation costs</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S08 | Admission to visa (White) */}
        {/* ========================================================================= */}
        <section id="admission" className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Process Milestones
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                An offer is the start of another stage
              </h2>
            </div>

            {/* Sequential Process Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative">
                <span className="w-7 h-7 rounded-lg bg-[#0B1B3A] text-white flex items-center justify-center font-bold text-xs">
                  01
                </span>
                <h3 className="font-bold text-slate-900 text-base">Entry Rules &amp; English</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  First, compare entry rules with your qualifications and English evidence. Providers set their own requirements. A pathway course may add time and cost to your plan.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative">
                <span className="w-7 h-7 rounded-lg bg-[#0B1B3A] text-white flex items-center justify-center font-bold text-xs">
                  02
                </span>
                <h3 className="font-bold text-slate-900 text-base">CRICOS Course Register</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Check the exact provider and course on CRICOS. This is Australia's register for courses offered to overseas students. Check the campus and course details, not just a familiar provider name.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative">
                <span className="w-7 h-7 rounded-lg bg-[#0B1B3A] text-white flex items-center justify-center font-bold text-xs">
                  03
                </span>
                <h3 className="font-bold text-slate-900 text-base">Offer Terms &amp; CoE</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Read your offer conditions and refund terms before accepting. Your provider generally issues a Confirmation of Enrolment, called a CoE, for the visa stage.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-3 relative">
                <span className="w-7 h-7 rounded-lg bg-[#FF4D6D] text-white flex items-center justify-center font-bold text-xs">
                  04
                </span>
                <h3 className="font-bold text-rose-950 text-base">Visa Determination</h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  A CoE confirms enrolment. It does not grant a Student visa or guarantee its approval.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S09 | Genuine Student (Pale) */}
        {/* ========================================================================= */}
        <section id="genuine-student" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Visa Assessment Criteria
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Explain why this study makes sense
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Public text */}
              <div className="lg:col-span-7 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
                <p className="font-medium text-slate-800">
                  The Student visa includes a Genuine Student requirement. Studying must be the main reason for your application.
                </p>
                <p>
                  Your answers should explain your circumstances and your choice of course. You need to understand the provider, study demands and life in Australia. Explain how the learning will benefit you.
                </p>
                <p>
                  A copied story cannot explain your own education or work history. Gaps, course changes and previous visa decisions need honest treatment.
                </p>
                <p>
                  Future plans do not need to be invented to sound persuasive. Home Affairs recognises that genuine students may later consider permanent residence. That does not remove the need to meet the current student rules.
                </p>
              </div>

              {/* Reasoning diagram: Course / Circumstances / Benefit */}
              <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
                <h3 className="text-base font-bold text-[#0B1B3A] uppercase tracking-wider">
                  The 3 Pillars of Genuine Student
                </h3>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <strong className="text-slate-900 block text-sm font-bold mb-1">
                      1. Course Fit &amp; Logic
                    </strong>
                    <span className="text-xs sm:text-sm text-slate-600">
                      Why this exact subject, provider and level over alternatives at home or elsewhere.
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <strong className="text-slate-900 block text-sm font-bold mb-1">
                      2. Personal Circumstances
                    </strong>
                    <span className="text-xs sm:text-sm text-slate-600">
                      Honest background, academic history, study gaps and genuine family support.
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <strong className="text-slate-900 block text-sm font-bold mb-1">
                      3. Long-term Benefit
                    </strong>
                    <span className="text-xs sm:text-sm text-slate-600">
                      Real, tangible career value and skills gained that justify the expenditure.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S10 | Work during study (White) */}
        {/* ========================================================================= */}
        <section id="work-rights" className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Work Rights &amp; Limitations
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Work can help, but it cannot fund the promise
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
                <p>
                  Student work rights have conditions. Your course, study stage and visa conditions affect what you may do. Confirm your own rights before starting work.
                </p>
                <p>
                  Do not assume you can work before your course begins. Hours during study can be restricted. Different rules may apply during scheduled breaks or for some research students.
                </p>
                <p>
                  Check your visa grant letter and VEVO, the visa conditions service. Do not rely on a friend's work pattern.
                </p>
                <p className="font-semibold text-slate-900">
                  Finding a suitable job can take time. Wages and hours are not guaranteed. Your family funding plan should work without a job offer.
                </p>
              </div>

              {/* Conditional Rights Panel */}
              <div className="lg:col-span-4 p-6 sm:p-7 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h3 className="font-bold text-[#0B1B3A] text-base flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <span>Work Rules Verification</span>
                </h3>
                <ul className="text-xs sm:text-sm text-slate-600 space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-slate-900">VEVO Check:</span>
                    Always verify your individual conditions on the official VEVO database.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-slate-900">Course Start:</span>
                    Do not start work prior to official programme commencement.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-slate-900">Academic Focus:</span>
                    Study attendance and progression remain primary visa conditions.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S11 | After study and family (Navy Band) */}
        {/* ========================================================================= */}
        <section id="post-study" className="py-16 sm:py-20 bg-[#0B1B3A] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Post-Study &amp; Dependants
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                Keep graduate and family routes separate
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* Lane 1: After Graduation */}
              <div className="p-7 sm:p-9 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-4">
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="w-6 h-6 text-[#FF4D6D]" />
                  <h3 className="text-xl font-bold text-white">After graduation</h3>
                </div>
                <p className="text-slate-300 leading-relaxed text-base">
                  The Temporary Graduate visa, subclass 485, is a separate application. Eligibility depends on current rules, your qualification and your circumstances. Completing a course does not automatically qualify you.
                </p>
                <p className="text-slate-300 leading-relaxed text-base">
                  Check age rules, study requirements, timing and the relevant stream before relying on it. A graduate visa does not guarantee employment or permanent residence.
                </p>
              </div>

              {/* Lane 2: Bringing Family */}
              <div className="p-7 sm:p-9 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-4">
                <div className="flex items-center gap-2.5">
                  <Users2 className="w-6 h-6 text-emerald-400" />
                  <h3 className="text-xl font-bold text-white">Bringing family</h3>
                </div>
                <p className="text-slate-300 leading-relaxed text-base">
                  Do not assume a partner or child can accompany you. Student visa family rules changed in October 2026. Eligibility needs a separate check before any relocation plans.
                </p>
                <p className="text-slate-300 leading-relaxed text-base">
                  If family members can be included, review housing, health cover and schooling costs. Their work rights also need their own check. Student Guardian arrangements are a different route.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S12 | Service and process (White) */}
        {/* ========================================================================= */}
        <section id="process" className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                How We Support You
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Turn a broad idea into a clear next step
              </h2>
            </div>

            <div className="max-w-4xl space-y-6 text-base sm:text-lg text-slate-700 leading-relaxed mb-10">
              <p>
                Before an assessment, you may have several courses and no clear comparison. The aim is a shortlist you can judge against your grades, costs and goals.
              </p>
              <p>
                Start with your current qualification and preferred subject. Discuss the intake you are considering and what your family can fund. Then review suitable next steps and unresolved questions.
              </p>
              <p>
                ProConsulting provides{" "}
                <Link
                  to="/education/services/admission"
                  className="text-[#0B1B3A] font-bold underline decoration-[#FF4D6D] decoration-2 underline-offset-4 hover:text-[#FF4D6D] transition-colors"
                >
                  admission guidance
                </Link>
                ,{" "}
                <Link
                  to="/education/services/scholarships"
                  className="text-[#0B1B3A] font-bold underline decoration-[#FF4D6D] decoration-2 underline-offset-4 hover:text-[#FF4D6D] transition-colors"
                >
                  scholarship guidance
                </Link>{" "}
                and{" "}
                <Link
                  to="/education/services/visa"
                  className="text-[#0B1B3A] font-bold underline decoration-[#FF4D6D] decoration-2 underline-offset-4 hover:text-[#FF4D6D] transition-colors"
                >
                  visa preparation support
                </Link>
                . Ask what support applies to your case and what fees would apply before agreeing to paid work.
              </p>
              <p className="font-semibold text-slate-900">
                Universities decide admission. Scholarship bodies decide awards. Home Affairs decides visas.
              </p>
            </div>

            {/* Mandatory Honesty Statement Banner */}
            <div className="p-6 rounded-2xl bg-slate-50 border-l-4 border-[#FF4D6D] text-slate-900 font-bold text-sm sm:text-base max-w-4xl">
              No consultant can guarantee a scholarship, admission or visa, and we do not.
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S13 | FAQ (Pale) */}
        {/* ========================================================================= */}
        <section id="faqs" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Clear Answers
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Questions before you study in Australia
              </h2>
            </div>

            {/* Native details accordion with all 6 FAQs SSR */}
            <div className="space-y-4">
              {AUSTRALIA_FAQS.map((faq, index) => (
                <details
                  key={faq.id}
                  open={index === 0}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 transition-all open:shadow-md"
                >
                  <summary className="flex cursor-pointer items-center justify-between text-base sm:text-lg font-bold text-[#0B1B3A] list-none focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#FF4D6D] rounded-lg">
                    <span>{faq.q}</span>
                    <span className="ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition group-open:rotate-180">
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </summary>
                  <div className="mt-4 border-t border-slate-100 pt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S14 | Final assessment (White) */}
        {/* ========================================================================= */}
        <section id="assessment" className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-12 lg:p-16 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-lg">
              <div className="max-w-3xl space-y-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] block">
                  Next Step
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                  Get your Australia questions into focus
                </h2>

                <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                  You do not need a perfect shortlist to start. Share your study goals through the free assessment. Bring the questions that are holding up your decision.
                </p>

                <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                  The assessment asks about your contact details, academic background and study plans. Australia should remain selected as you move through the form. You can change your destination if your plans change.
                </p>

                <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                  Use it to discuss course fit, funding gaps and the next application stage. You can also compare Australia with Canada or New Zealand before choosing.
                </p>

                {/* CTAs */}
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <Link
                    to={AUSTRALIA_SEO.ctaHref}
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-md hover:shadow-lg transition-all"
                  >
                    <span>{AUSTRALIA_SEO.ctaText}</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  <div className="flex items-center gap-3 pt-2 sm:pt-0">
                    <Link
                      to="/education/destinations/study-in-canada"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-slate-800 hover:bg-slate-100 transition-colors"
                    >
                      <span>Compare Canada</span>
                      <ArrowUpRight className="w-4 h-4 text-slate-400" />
                    </Link>
                    <Link
                      to="/education/destinations/study-in-new-zealand"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-slate-800 hover:bg-slate-100 transition-colors"
                    >
                      <span>Compare New Zealand</span>
                      <ArrowUpRight className="w-4 h-4 text-slate-400" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Mobile Sticky CTA bar (hides when scrolled to final assessment section) */}
      {showMobileCta && (
        <div className="fixed bottom-0 inset-x-0 z-40 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-xl md:hidden safe-area-bottom">
          <Link
            to={AUSTRALIA_SEO.ctaHref}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#FF4D6D] text-white font-bold text-sm shadow-md"
          >
            <span>{AUSTRALIA_SEO.ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      <Footer />
    </div>
  );
}
