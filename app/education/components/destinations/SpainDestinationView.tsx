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
  Globe,
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
  SPAIN_FAQS,
  SPAIN_SEO,
} from "~/education/lib/spainDestinationData";

export function SpainDestinationView() {
  const [activeAnchor, setActiveAnchor] = useState<string>("first-decision");
  const [showMobileCta, setShowMobileCta] = useState(true);
  const [selectedDecisionStage, setSelectedDecisionStage] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const anchors = [
        "first-decision",
        "degree-identity",
        "course-value",
        "language",
        "tuition",
        "funds-housing",
        "scholarships",
        "admission",
        "visa-stay",
        "work-rights",
        "family-return",
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
    { id: "first-decision", label: "Starting Point" },
    { id: "degree-identity", label: "Degree Types" },
    { id: "course-value", label: "Course Value" },
    { id: "language", label: "Language" },
    { id: "tuition", label: "Tuition" },
    { id: "funds-housing", label: "Funds & Housing" },
    { id: "scholarships", label: "Scholarships" },
    { id: "admission", label: "Admission" },
    { id: "visa-stay", label: "Visa & Stay" },
    { id: "work-rights", label: "Work Rights" },
    { id: "family-return", label: "Family & Return" },
    { id: "faqs", label: "FAQs" },
  ];

  const decisionStages = [
    {
      title: "I am choosing a course",
      detail:
        "Start with your subject, entry level and career goal. Compare the exact award and teaching language before you compare city photos.",
      icon: BookOpen,
    },
    {
      title: "I have an offer",
      detail:
        "Check the conditions, payment dates and refund terms. Confirm what remains outstanding before you treat the place as secure.",
      icon: FileCheck2,
    },
    {
      title: "I am planning with my family",
      detail:
        "Agree who will pay, when funds will be available and what happens if plans change. Keep expected earnings outside your core funding plan.",
      icon: Users2,
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
            <span className="text-slate-900 font-medium">Spain</span>
          </nav>
        </div>
      </div>

      <main>
        {/* ========================================================================= */}
        {/* S01 | Hero (Light destination hero) */}
        {/* ========================================================================= */}
        <section className="bg-slate-50/70 pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Text Left (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="inline-block text-xs sm:text-sm font-semibold tracking-wide text-slate-700 bg-slate-200/70 px-3.5 py-1.5 rounded-full mb-4">
                    Study in Spain · Academic Direction, Costs &amp; Visa Steps
                  </span>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-extrabold text-[#0B1B3A] tracking-tight leading-[1.12]">
                    Study in Spain
                  </h1>
                </div>

                <p className="text-lg sm:text-xl font-medium text-slate-800 leading-relaxed">
                  A course can look affordable until you check the award, language and housing costs. Start with those details before you pay a deposit.
                </p>

                <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                  ProConsulting helps you compare Spanish study options against your grades, goals and family budget. We can discuss admission steps, funding questions and the study visa route that fits your plans.
                </p>

                <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                  Choose a course for what it teaches and where it can take you. A place in Spain should still make sense if you return to Pakistan after graduation.
                </p>

                {/* Primary CTA */}
                <div className="pt-2 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <Link
                      to={SPAIN_SEO.ctaHref}
                      className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-base font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-md hover:shadow-lg transition-all"
                    >
                      <span>{SPAIN_SEO.ctaText}</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Bring your study goals and current qualification. You do not need a final university choice to begin.
                  </p>
                </div>
              </div>

              {/* Right Image (5 cols) */}
              <div className="lg:col-span-5">
                <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl bg-slate-900 group">
                  <img
                    src="/destinations/Spain.webp"
                    alt="Study in Spain - Historic universities and European academic culture"
                    className="w-full h-[360px] sm:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3A] via-[#0B1B3A]/30 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-white/40">
                    <img
                      src="https://flagcdn.com/w40/es.png"
                      alt="Spain flag"
                      className="w-5 h-3.5 object-cover rounded-xs"
                    />
                    <span className="text-xs font-bold text-[#0B1B3A]">Spain</span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      European Higher Education
                    </span>
                  </div>

                  <div className="absolute bottom-0 inset-x-0 p-6 text-white space-y-2">
                    <h3 className="text-lg font-bold text-white">Spanish Universities &amp; Institutes</h3>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      Official bachelor and master degrees in the heart of Europe.
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
                  to={SPAIN_SEO.ctaHref}
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
        {/* S02 | A useful first decision (White) */}
        {/* ========================================================================= */}
        <section id="first-decision" className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Starting Point
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                What do you need to decide first?
              </h2>
            </div>

            {/* Three Native Selectable Buttons with Adjacent Explanation Region */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
              <div className="lg:col-span-5 space-y-3">
                {decisionStages.map((stage, idx) => {
                  const Icon = stage.icon;
                  const isSelected = selectedDecisionStage === idx;
                  return (
                    <button
                      key={stage.title}
                      type="button"
                      onClick={() => setSelectedDecisionStage(idx)}
                      className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? "bg-white border-[#0B1B3A] shadow-md ring-1 ring-[#0B1B3A]"
                          : "bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? "bg-[#0B1B3A] text-white" : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{stage.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Click to view decision focus</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Detail display */}
              <div className="lg:col-span-7">
                <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate-200/80 pb-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Decision Focus
                    </span>
                    <span className="text-sm font-bold text-[#0B1B3A]">
                      {decisionStages[selectedDecisionStage].title}
                    </span>
                  </div>
                  <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-medium">
                    {decisionStages[selectedDecisionStage].detail}
                  </p>
                </div>

                {/* Mobile / SSR Stacked List */}
                <div className="mt-6 space-y-3 lg:hidden">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    All Decision Categories
                  </span>
                  {decisionStages.map((stage) => (
                    <div key={stage.title} className="p-4 rounded-xl border border-slate-200 bg-white">
                      <strong className="block text-sm font-bold text-slate-900 mb-1">
                        {stage.title}
                      </strong>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {stage.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-100/70 border border-slate-200 max-w-3xl">
              <p className="text-sm sm:text-base text-slate-700 font-medium">
                Your starting point helps focus the assessment. It does not predict admission or visa approval.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S03 | Degree identity (Pale) */}
        {/* ========================================================================= */}
        <section id="degree-identity" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Qualification Framework
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Check the award, not just the course name
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-8">
              {/* Column 1: Official Degrees */}
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-[#0B1B3A] text-white flex items-center justify-center font-bold text-xs">
                      MU
                    </span>
                    <h3 className="text-lg font-bold text-[#0B1B3A]">Máster Universitario (Official)</h3>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-base">
                    Spain has official university degrees and university-specific awards. They are not interchangeable simply because both use the word master.
                  </p>
                  <p className="text-slate-700 leading-relaxed text-base">
                    An official Máster Universitario belongs to Spain's official degree system. University-specific qualifications, often called títulos propios, serve a different purpose. Some focus on professional learning or further training.
                  </p>
                </div>
              </div>

              {/* Column 2: Títulos Propios & Authorization */}
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-[#FF4D6D] text-white flex items-center justify-center font-bold text-xs">
                      TP
                    </span>
                    <h3 className="text-lg font-bold text-[#0B1B3A]">Títulos Propios &amp; Recognition</h3>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-base">
                    Ask which institution awards the qualification and what its exact title will be. Check whether it supports your next step, such as doctoral entry or a regulated profession.
                  </p>
                  <p className="text-slate-700 leading-relaxed text-base">
                    A university-specific award is not automatically excluded from study authorization. The institution, programme and current rules still need checking. Academic recognition and immigration eligibility are separate questions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S04 | Course value (White) */}
        {/* ========================================================================= */}
        <section id="course-value" className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Academic Rigor
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Choose a course you can explain
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <p className="font-medium text-slate-900">
                    A strong shortlist starts with the work you want to do. Compare modules, practical projects, assessment methods and access to relevant facilities.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <p>
                    For business, ask what you will produce beyond presentations. For engineering or computing, look at project depth and technical teaching. For hospitality, check the placement terms rather than assuming paid experience.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <p>
                    Ask whether a placement is compulsory, competitive or simply available to apply for. Confirm its language needs and any professional restrictions.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 text-amber-950 font-medium">
                  <p>
                    Look beyond the university name. The course should help you build skills you can describe to an employer in Spain or at home.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-4 p-6 sm:p-7 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
                <h3 className="font-bold text-[#0B1B3A] text-base flex items-center gap-2">
                  <Scale className="w-5 h-5 text-[#FF4D6D]" />
                  <span>Syllabus Checklist</span>
                </h3>
                <ul className="text-xs sm:text-sm text-slate-600 space-y-2.5">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Exact module breakdown &amp; credits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Practical laboratory &amp; technical projects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Internship language &amp; competition criteria</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Professional licensing relevance</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S05 | Language (Pale) */}
        {/* ========================================================================= */}
        <section id="language" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Classroom &amp; Daily Life
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                English teaching does not remove Spanish from daily life
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
                <p>
                  English-taught options exist, especially at postgraduate level. Check the language of every compulsory module, assessment and placement.
                </p>
                <p>
                  A course described as bilingual may still need substantial Spanish. Some regions also use a co-official language. Ask the institution what you need before classes begin.
                </p>
                <p>
                  Language evidence depends on the course. Do not assume one test, score or exemption works everywhere.
                </p>
                <p className="font-semibold text-slate-900">
                  Spanish can matter when you rent a room, arrange healthcare or apply for local work. Plan time to practise it even if your degree is in English. A language course and a higher education programme can also follow different immigration conditions.
                </p>

                <div className="pt-2">
                  <Link
                    to="/education/services/test-prep"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#0B1B3A] hover:text-[#FF4D6D] underline underline-offset-4 transition-colors"
                  >
                    <span>Learn about English &amp; language preparation guidance →</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-4 p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-[#0B1B3A] font-bold text-base">
                  <Globe className="w-5 h-5 text-[#FF4D6D]" />
                  <span>Language Realities</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Even in fully English-taught master's degrees, basic conversational Spanish is essential for leasing agreements, local registrations, hospital visits and community integration.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S06 | Tuition (White) */}
        {/* ========================================================================= */}
        <section id="tuition" className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Tuition Transparency
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Compare the fee that applies to you
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="text-lg font-bold text-[#0B1B3A]">Public University Tuition</h3>
                <p className="text-slate-700 leading-relaxed text-base">
                  Public university fees can depend on the region, programme and student category. A headline fee may not be the fee for a non-EU applicant.
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="text-lg font-bold text-[#0B1B3A]">Private Institution Fees</h3>
                <p className="text-slate-700 leading-relaxed text-base">
                  Private institutions set their own charges. Compare the full programme cost, not only the first payment or a promotional discount.
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="text-lg font-bold text-[#0B1B3A]">Official Fee Schedules</h3>
                <p className="text-slate-700 leading-relaxed text-base">
                  Request the current fee schedule for your exact course and intake. Ask about enrolment charges, repeated modules, deposits and refund conditions.
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="text-lg font-bold text-[#0B1B3A]">Payment Due Dates &amp; Refunds</h3>
                <p className="text-slate-700 leading-relaxed text-base">
                  Check when each payment falls due. A cheaper course can still create pressure if a large payment comes early. Read the rules for withdrawal, delayed arrival and visa refusal before paying.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S07 | Funds and housing (Pale) */}
        {/* ========================================================================= */}
        <section id="funds-housing" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Living Costs &amp; Immigration
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Separate visa funds from your real living budget
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#0B1B3A] text-white flex items-center justify-center font-bold text-xs">
                    VF
                  </div>
                  <h3 className="text-lg font-bold text-[#0B1B3A]">Visa Financial Requirements</h3>
                </div>
                <p className="text-slate-700 leading-relaxed text-base">
                  Financial means are part of the immigration assessment. They are not a promise that your money will cover your chosen lifestyle.
                </p>
                <p className="text-slate-700 leading-relaxed text-base">
                  Plan for tuition, rent, deposits, insurance, food, transport and travel. Allow for initial costs before your normal monthly routine begins.
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FF4D6D] text-white flex items-center justify-center font-bold text-xs">
                    RH
                  </div>
                  <h3 className="text-lg font-bold text-[#0B1B3A]">Real Housing &amp; City Costs</h3>
                </div>
                <p className="text-slate-700 leading-relaxed text-base">
                  Housing costs vary between cities and neighbourhoods. Compare the commute, contract length, bills and deposit terms. Do not assume university accommodation is available with your offer.
                </p>
                <p className="text-slate-700 leading-relaxed text-base">
                  Discuss who will support you and how funds become available. Money shown for an application must meet the relevant evidence rules. Expected wages or an unconfirmed scholarship should not fill a funding gap.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S08 | Scholarships (Navy Feature Strip) */}
        {/* ========================================================================= */}
        <section id="scholarships" className="py-16 sm:py-20 bg-[#0B1B3A] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Award Terms
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                Treat scholarships as applications, not promises
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-5 text-base sm:text-lg text-slate-300 leading-relaxed">
                <p>
                  Scholarships can come from universities or specific funding programmes. Eligibility may depend on nationality, residence, grades, subject or the chosen intake.
                </p>
                <p>
                  Check what an award covers. A tuition reduction may leave rent, travel and insurance entirely with your family. Some awards have separate applications and earlier closing dates.
                </p>
                <p>
                  Erasmus Mundus Joint Masters can offer scholarships through selected joint programmes. A Spanish university's involvement does not make every course there eligible.
                </p>
                <p className="font-semibold text-white">
                  Build a plan that works without an award until funding is confirmed in writing. Ask about renewal conditions and payment timing. Admission does not mean a scholarship has been granted.
                </p>

                <div className="pt-2">
                  <Link
                    to="/education/services/scholarships"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF4D6D] text-white text-sm font-bold hover:bg-[#e03b5b] transition-colors shadow-md"
                  >
                    <span>Explore scholarship guidance</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-4 p-6 sm:p-7 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-3">
                <h3 className="font-bold text-white text-base">Key Award Considerations</h3>
                <ul className="text-xs sm:text-sm text-slate-300 space-y-2.5">
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF4D6D] font-bold">•</span>
                    <span>Separate admission and funding deadlines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF4D6D] font-bold">•</span>
                    <span>Tuition-only discounts vs living stipends</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF4D6D] font-bold">•</span>
                    <span>Written confirmation on official award terms</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S09 | Admission and timing (White) */}
        {/* ========================================================================= */}
        <section id="admission" className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Timeline Planning
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Work backwards from the course start
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="w-7 h-7 rounded-lg bg-[#0B1B3A] text-white flex items-center justify-center font-bold text-xs">
                  01
                </span>
                <h3 className="font-bold text-slate-900 text-base">Admission Route</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Start with academic fit and the institution's admission route. Entry requirements can differ between undergraduate, postgraduate and professional courses.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="w-7 h-7 rounded-lg bg-[#0B1B3A] text-white flex items-center justify-center font-bold text-xs">
                  02
                </span>
                <h3 className="font-bold text-slate-900 text-base">Qualification Assessment</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Check how your previous qualification will be assessed. Some routes need extra recognition or admission steps before a university can confirm entry.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="w-7 h-7 rounded-lg bg-[#0B1B3A] text-white flex items-center justify-center font-bold text-xs">
                  03
                </span>
                <h3 className="font-bold text-slate-900 text-base">Offer Terms &amp; Visa</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Next, review the offer conditions and payment terms. Then plan the visa application around the current rules and available appointments.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="w-7 h-7 rounded-lg bg-[#0B1B3A] text-white flex items-center justify-center font-bold text-xs">
                  04
                </span>
                <h3 className="font-bold text-slate-900 text-base">Translations &amp; Delays</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Leave room for translations, institutional replies and further questions. An admission deadline is not a visa appointment. If timing becomes tight, ask the university about deferral and refund options. Do not rely on a guaranteed decision date.
                </p>
              </div>
            </div>

            <div>
              <Link
                to="/education/services/admission"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#0B1B3A] hover:text-[#FF4D6D] underline underline-offset-4 transition-colors"
              >
                <span>Learn about university admission guidance →</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S10 | Visa and stay (Pale) */}
        {/* ========================================================================= */}
        <section id="visa-stay" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Consular Authorization
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Admission and permission to stay are different
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                  <Compass className="w-5 h-5 text-[#FF4D6D]" />
                  <span>Entry &amp; Consular Jurisdiction</span>
                </div>
                <p className="text-slate-700 leading-relaxed text-base">
                  An offer does not grant a visa. Applicants planning a longer study stay must check the applicable Spanish study visa and authorization process.
                </p>
                <p className="text-slate-700 leading-relaxed text-base">
                  For an application from Pakistan, confirm the responsible Spanish consular office and its current submission instructions. Your residence and the office's jurisdiction matter. Do not assume another country's embassy process applies.
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                  <FileCheck2 className="w-5 h-5 text-[#0B1B3A]" />
                  <span>Ongoing Stay &amp; Formalities</span>
                </div>
                <p className="text-slate-700 leading-relaxed text-base">
                  Admission, paid enrolment, financial means and suitable insurance can affect the route. The exact requirements depend on your case and current rules.
                </p>
                <p className="text-slate-700 leading-relaxed text-base">
                  After arrival, further identity-card or stay formalities may apply. Keep track of your permission, enrolment and renewal duties. A visa appointment, university place or adviser cannot guarantee approval.
                </p>
              </div>
            </div>

            <div>
              <Link
                to="/education/services/visa"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#0B1B3A] hover:text-[#FF4D6D] underline underline-offset-4 transition-colors"
              >
                <span>Learn about study visa preparation support →</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S11 | Work and next steps (White) */}
        {/* ========================================================================= */}
        <section id="work-rights" className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Work Permission Realities
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Keep work outside your funding promise
              </h2>
            </div>

            <div className="max-w-4xl space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
              <p>
                Eligible higher education study authorization can permit compatible work under current rules. That does not mean every student route has the same conditions.
              </p>
              <p>
                Check the permission attached to your programme before accepting work. Hours, location and compatibility with study can matter. A language course should not be treated as a degree route.
              </p>
              <p>
                Finding a job also depends on language, skills and local demand. Do not plan to pay essential tuition or rent through work you have not secured.
              </p>
              <p className="font-semibold text-slate-900">
                After graduation, any job-search or employment route needs its own eligibility check. A Spanish qualification does not automatically give permanent residence or the right to work across the EU.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S12 | Family and return home (Pale) */}
        {/* ========================================================================= */}
        <section id="family-return" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Dependants &amp; Long-Term Recognition
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Plan for your family and your return
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                  <Users2 className="w-5 h-5 text-[#FF4D6D]" />
                  <span>Family Route Conditions</span>
                </div>
                <p className="text-slate-700 leading-relaxed text-base">
                  Some higher education students may have an eligible family route. Relationship, funds, insurance and the student's permission all matter. Do not assume a partner can work under that family permission.
                </p>
                <p className="text-slate-700 leading-relaxed text-base">
                  Schengen travel conditions are separate from employment rights. Permission for visits does not create an EU-wide right to live or work.
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                  <GraduationCap className="w-5 h-5 text-[#0B1B3A]" />
                  <span>Return-Home Recognition</span>
                </div>
                <p className="text-slate-700 leading-relaxed text-base">
                  If you expect to return to Pakistan, check the exact qualification with HEC and any relevant professional council before enrolling. Admission in Spain is not a Pakistani recognition decision.
                </p>
                <p className="text-slate-700 leading-relaxed text-base">
                  For regulated careers, confirm the professional pathway separately. Keep a return-home plan alongside any overseas career hopes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* S13 | Support and FAQ (White) */}
        {/* ========================================================================= */}
        <section id="faqs" className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                Guidance &amp; Verification
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight mb-4">
                Get help with the decisions that affect your application
              </h2>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                Use the assessment to discuss course fit, language, costs and the next application step. ProConsulting can explain where further checks are needed. Universities, funders and public authorities make their own decisions.
              </p>
            </div>

            {/* Honesty disclaimer */}
            <div className="p-5 rounded-2xl bg-slate-50 border-l-4 border-[#FF4D6D] text-slate-900 font-bold text-sm sm:text-base mb-12">
              No consultant can guarantee a scholarship, admission or visa, and we do not.
            </div>

            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-[#0B1B3A]">
                Questions about studying in Spain
              </h3>
            </div>

            {/* Native details accordion with all 4 FAQs SSR */}
            <div className="space-y-4">
              {SPAIN_FAQS.map((faq, index) => (
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
        {/* S14 | Final assessment (Pale CTA Section) */}
        {/* ========================================================================= */}
        <section id="assessment" className="py-16 sm:py-24 bg-slate-50/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-12 lg:p-16 rounded-3xl bg-white border border-slate-200/90 shadow-lg">
              <div className="max-w-3xl space-y-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] block">
                  Next Step
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                  Make your Spain plan clearer
                </h2>

                <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                  You may still be comparing subjects, holding an offer or deciding whether the cost is manageable. Start with the question that could change your decision.
                </p>

                <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                  Share your qualification, preferred course and intended intake through the free assessment. Add your current priorities so the discussion starts in the right place.
                </p>

                <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                  We will use your details to respond to your enquiry. Any further service scope and charges should be agreed separately before you commit.
                </p>

                {/* Primary CTA and Destination Confirmation */}
                <div className="pt-2 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <Link
                      to={SPAIN_SEO.ctaHref}
                      className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-md hover:shadow-lg transition-all"
                    >
                      <span>{SPAIN_SEO.ctaText}</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>

                    <div className="flex items-center gap-3 pt-2 sm:pt-0">
                      <Link
                        to="/education/destinations/study-in-germany"
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-slate-800 hover:bg-slate-100 transition-colors"
                      >
                        <span>Compare Germany</span>
                        <ArrowUpRight className="w-4 h-4 text-slate-400" />
                      </Link>
                      <Link
                        to="/education/destinations/study-in-italy"
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-slate-800 hover:bg-slate-100 transition-colors"
                      >
                        <span>Compare Italy</span>
                        <ArrowUpRight className="w-4 h-4 text-slate-400" />
                      </Link>
                    </div>
                  </div>

                  <div className="pt-2 space-y-1 text-xs sm:text-sm text-slate-500 font-medium">
                    <p className="text-slate-800 font-semibold">Your selected destination: Spain</p>
                    <p>Continue to the assessment form to review your details and study goals.</p>
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
            to={SPAIN_SEO.ctaHref}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#FF4D6D] text-white font-bold text-sm shadow-md"
          >
            <span>{SPAIN_SEO.ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      <Footer />
    </div>
  );
}
