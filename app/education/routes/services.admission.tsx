"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Navbar } from "~/education/components/ui/Navbar";
import { Footer } from "~/education/components/ui/footer";
import { pageMeta, canonicalLink } from "~/education/lib/seo";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Layers,
  GraduationCap,
  Scale,
  Compass,
  FileCheck,
  Shield,
  HelpCircle,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Check,
  AlertCircle,
  Eye,
} from "lucide-react";

const BRAND = {
  navy: "#0B1B3A",
  navyDark: "#071228",
  navySurface: "#102244",
  pink: "#FF4D6D",
  pinkHover: "#E03B5B",
  pinkPale: "#FFF1F3",
  pinkLight: "#FFE4E8",
  slateBg: "#F8FAFC",
};

const CANONICAL_URL = "https://proconsulting.uk/education/services/admission";
const TITLE = "Admission Guidance | ProConsulting";
const DESCRIPTION =
  "Choose a course that fits your goals, compare offer conditions and plan university applications with ProConsulting. Start with a free assessment.";

const ADMISSION_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://proconsulting.uk/education/services/admission#service",
      "name": "Admission Guidance",
      "url": "https://proconsulting.uk/education/services/admission",
      "serviceType": "Admission Guidance",
      "provider": {
        "@type": "Organization",
        "name": "ProConsulting",
        "url": "https://proconsulting.uk/"
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Education",
          "item": "https://proconsulting.uk/education"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Student services",
          "item": "https://proconsulting.uk/education/services"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Admission Guidance",
          "item": "https://proconsulting.uk/education/services/admission"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Can I get help before choosing a country?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. The initial assessment can start with your qualifications, interests and budget. A country choice should follow your priorities, not replace them."
          }
        },
        {
          "@type": "Question",
          "name": "Can you guarantee admission?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Each university makes its own decision. We help you understand requirements and prepare an application that reflects your real background."
          }
        },
        {
          "@type": "Question",
          "name": "Will you write my personal statement for me?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our published service includes review and improvement. Your experiences and reasons must remain your own. We will not invent achievements or a study history."
          }
        },
        {
          "@type": "Question",
          "name": "Does admission guidance include a scholarship?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Scholarships have separate eligibility, coverage and selection rules. Admission does not mean you have an award. Keep unconfirmed funding out of your committed budget."
          }
        },
        {
          "@type": "Question",
          "name": "What if I already have an offer?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We can discuss the offer conditions and your remaining questions. Explain what you have already done so the next step fits your situation."
          }
        },
        {
          "@type": "Question",
          "name": "What does the service cost?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The initial assessment is free. Ask for the scope and any further charges before you agree to additional support. University and other third-party fees are separate."
          }
        }
      ]
    }
  ]
};

export function meta() {
  const pathname = "/education/services/admission";
  return [
    { title: TITLE },
    { name: "description", content: DESCRIPTION },
    ...pageMeta({ title: TITLE, description: DESCRIPTION, pathname }),
    {
      "script:ld+json": ADMISSION_SCHEMA,
    },
  ];
}

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export default function AdmissionGuidance() {
  // S03 Course comparison interactive view
  const [comparisonView, setComparisonView] = useState<
    "learning" | "entry" | "value"
  >("learning");

  // S04 Stage cards interactive hover/focus state
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);

  // Active section for scrollspy
  const [activeSection, setActiveSection] = useState<string>("course-fit");

  const navItems = [
    { id: "course-fit", label: "Choose the course before you chase the offer", short: "Course Fit" },
    { id: "course-comparison", label: "Two similar titles can lead to different decisions", short: "Course Comparison" },
    { id: "application-route", label: "Know what each application needs", short: "Application Stages" },
    { id: "costs", label: "Look beyond the first tuition figure", short: "Cost & Budget" },
    { id: "recognition", label: "Make the qualification useful after graduation", short: "Recognition" },
    { id: "offer-comparison", label: "Read the conditions before you say yes", short: "Offer Conditions" },
    { id: "support", label: "Get help with the choice and the application", short: "Our Support" },
    { id: "boundaries", label: "Keep the decisions in the right hands", short: "Ethical Scope" },
    { id: "faq", label: "Questions about admission guidance", short: "FAQ" },
    { id: "next-step", label: "Bring the decision you are stuck on", short: "Next Step" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans antialiased selection:bg-[#FFF1F3] selection:text-[#0B1B3A]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ADMISSION_SCHEMA) }}
      />
      <Navbar />

      {/* S01: Hero Section */}
      <header
        id="hero"
        className="relative overflow-hidden border-b border-slate-200/90 bg-gradient-to-b from-white via-slate-50/70 to-slate-100/50 pt-8 pb-14 md:pt-12 md:pb-20"
      >
        {/* Subtle Decorative Ambient Glows */}
        <div
          aria-hidden="true"
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-pink-100/40 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-slate-200/50 blur-3xl pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 text-xs md:text-sm text-slate-500 mb-8"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="hover:text-[#0B1B3A] transition-colors font-medium">
              Home
            </Link>
            <span aria-hidden="true" className="text-slate-300">/</span>
            <Link to="/education" className="hover:text-[#0B1B3A] transition-colors font-medium">
              Education
            </Link>
            <span aria-hidden="true" className="text-slate-300">/</span>
            <Link to="/education/services" className="hover:text-[#0B1B3A] transition-colors font-medium">
              Services
            </Link>
            <span aria-hidden="true" className="text-slate-300">/</span>
            <span className="text-[#0B1B3A] font-semibold" aria-current="page">
              Admission Guidance
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Narrow Left Copy */}
            <div className="lg:col-span-7">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-xs text-xs font-semibold text-[#0B1B3A] mb-6">
                <span className="w-2 h-2 rounded-full bg-[#FF4D6D] animate-pulse" />
                <span className="tracking-wide uppercase text-[11px] text-slate-600 font-bold">
                  Academic Advisory · Course Evaluation
                </span>
              </div>

              {/* Single H1 */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-[#0B1B3A] tracking-tight leading-[1.12]">
                Admission Guidance
              </h1>

              <div className="mt-4 flex items-center gap-2">
                <div className="w-12 h-1 rounded-full bg-[#FF4D6D]" />
                <div className="w-3 h-1 rounded-full bg-slate-300" />
              </div>

              {/* Verified Text Blocks verbatim from Part 1 */}
              <p className="mt-6 text-xl sm:text-2xl font-bold text-[#0B1B3A] leading-snug">
                A university offer can still be the wrong choice.
              </p>

              <div className="mt-4 space-y-3.5 text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
                <p>
                  Choose a course for what you will learn, what it costs and where it leads. ProConsulting helps you compare options and prepare applications around your actual profile.
                </p>
                <p>
                  Start with your goals and qualifications. You do not need a final university shortlist.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4">
                <Link
                  to="/education/contact?service=admission"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl text-sm sm:text-base font-bold text-white shadow-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] focus:ring-offset-2"
                  style={{
                    backgroundColor: BRAND.pink,
                    boxShadow: "0 10px 25px -4px rgba(255, 77, 109, 0.38)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND.pinkHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BRAND.pink)}
                >
                  <span>Get free admission assessment</span>
                  <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </Link>

                <a
                  href="#course-comparison"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm sm:text-base font-semibold text-[#0B1B3A] bg-white border border-slate-300/80 hover:bg-slate-50 hover:border-slate-400/80 shadow-xs transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#0B1B3A] focus:ring-offset-2"
                >
                  <span>See how course choices compare</span>
                  <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" aria-hidden="true" />
                </a>
              </div>

              {/* Verified Hero Labels as stylish feature tags */}
              <div className="mt-10 pt-8 border-t border-slate-200/80">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    "Course and university selection.",
                    "Entry requirement checks.",
                    "Application and offer guidance.",
                  ].map((label, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/80 border border-slate-200/70 text-xs sm:text-[13px] font-semibold text-[#0B1B3A] shadow-2xs"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#FFF1F3] text-[#FF4D6D] flex items-center justify-center text-xs shrink-0 font-bold">
                        ✓
                      </span>
                      <span className="leading-tight">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Authored SVG relationship scene on the right */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 p-7 shadow-xl shadow-slate-200/50 relative overflow-hidden">
                {/* Subtle top indicator */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0B1B3A]">
                      Advisory Framework
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Structured Path
                  </span>
                </div>

                <svg
                  viewBox="0 0 360 280"
                  className="w-full h-auto select-none"
                  aria-label="Relationship between course selection, entry requirement checks, and application guidance"
                  role="img"
                >
                  <defs>
                    <linearGradient id="nodeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="100%" stopColor="#F8FAFC" />
                    </linearGradient>
                    <linearGradient id="nodeGradActive" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFF1F3" />
                      <stop offset="100%" stopColor="#FFFFFF" />
                    </linearGradient>
                    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="130%">
                      <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.06" />
                    </filter>
                  </defs>

                  {/* Pale pink background oval */}
                  <ellipse cx="180" cy="140" rx="165" ry="125" fill={BRAND.pinkPale} opacity="0.8" />

                  {/* Connectors (aria-hidden) */}
                  <g aria-hidden="true">
                    <line
                      x1="180"
                      y1="70"
                      x2="180"
                      y2="110"
                      stroke={BRAND.navy}
                      strokeWidth="2.5"
                      strokeDasharray="4,4"
                    />
                    <line
                      x1="180"
                      y1="168"
                      x2="180"
                      y2="208"
                      stroke={BRAND.navy}
                      strokeWidth="2.5"
                      strokeDasharray="4,4"
                    />
                  </g>

                  {/* Node 1: Course and university selection */}
                  <g transform="translate(30, 20)" filter="url(#cardShadow)">
                    <rect
                      x="0"
                      y="0"
                      width="300"
                      height="50"
                      rx="25"
                      fill="url(#nodeGrad1)"
                      stroke={BRAND.navy}
                      strokeWidth="2"
                    />
                    <circle cx="28" cy="25" r="14" fill="#0B1B3A" />
                    <text
                      x="28"
                      y="30"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontFamily="Inter, sans-serif"
                      fontSize="12"
                      fontWeight="700"
                    >
                      1
                    </text>
                    <text
                      x="165"
                      y="31"
                      textAnchor="middle"
                      fill={BRAND.navy}
                      fontFamily="Inter, sans-serif"
                      fontSize="13"
                      fontWeight="700"
                    >
                      Course and university selection
                    </text>
                  </g>

                  {/* Node 2: Entry requirement checks (Highlighted centerpiece) */}
                  <g transform="translate(30, 110)" filter="url(#cardShadow)">
                    <rect
                      x="0"
                      y="0"
                      width="300"
                      height="56"
                      rx="28"
                      fill="url(#nodeGradActive)"
                      stroke={BRAND.pink}
                      strokeWidth="2.5"
                    />
                    <circle cx="28" cy="28" r="15" fill="#FF4D6D" />
                    <text
                      x="28"
                      y="33"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontFamily="Inter, sans-serif"
                      fontSize="12"
                      fontWeight="700"
                    >
                      2
                    </text>
                    <text
                      x="165"
                      y="34"
                      textAnchor="middle"
                      fill={BRAND.navy}
                      fontFamily="Inter, sans-serif"
                      fontSize="13.5"
                      fontWeight="800"
                    >
                      Entry requirement checks
                    </text>
                  </g>

                  {/* Node 3: Application and offer guidance */}
                  <g transform="translate(30, 208)" filter="url(#cardShadow)">
                    <rect
                      x="0"
                      y="0"
                      width="300"
                      height="50"
                      rx="25"
                      fill="url(#nodeGrad1)"
                      stroke={BRAND.navy}
                      strokeWidth="2"
                    />
                    <circle cx="28" cy="25" r="14" fill="#0B1B3A" />
                    <text
                      x="28"
                      y="30"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontFamily="Inter, sans-serif"
                      fontSize="12"
                      fontWeight="700"
                    >
                      3
                    </text>
                    <text
                      x="165"
                      y="31"
                      textAnchor="middle"
                      fill={BRAND.navy}
                      fontFamily="Inter, sans-serif"
                      fontSize="13"
                      fontWeight="700"
                    >
                      Application and offer guidance
                    </text>
                  </g>
                </svg>

                <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D]" />
                    Evidence-led decisions
                  </span>
                  <span className="text-slate-400">Neutral profile evaluation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sticky Section Navigation */}
      <nav
        aria-label="Mobile section navigation"
        className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 py-3 overflow-x-auto whitespace-nowrap shadow-xs"
      >
        <div className="flex gap-2">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`inline-block text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all shrink-0 ${
                activeSection === item.id
                  ? "bg-[#0B1B3A] text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-[#FFF1F3] hover:text-[#0B1B3A]"
              }`}
            >
              {item.short}
            </a>
          ))}
        </div>
      </nav>

      {/* Main Grid: 4/8 Desktop Split */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* 4-col Left Aside Navigation (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0B1B3A]">
                    Contents Guide
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF1F3] text-[#FF4D6D]">
                    10 Sections
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Navigate through admission planning
                </p>
              </div>

              <ul className="space-y-1 text-sm" role="list">
                {navItems.map((item, idx) => {
                  const isActive = activeSection === item.id;
                  return (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className={`group flex items-start gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-150 text-xs font-semibold leading-relaxed ${
                          isActive
                            ? "bg-[#0B1B3A] text-white shadow-xs font-bold"
                            : "text-slate-600 hover:text-[#0B1B3A] hover:bg-slate-50"
                        }`}
                      >
                        <span
                          className={`text-[11px] font-mono font-bold shrink-0 mt-0.5 ${
                            isActive ? "text-[#FF4D6D]" : "text-slate-400 group-hover:text-[#0B1B3A]"
                          }`}
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="line-clamp-2">{item.label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>

              <div className="pt-4 border-t border-slate-100">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-pink-50/40 border border-slate-200/80 mb-3">
                  <div className="text-xs font-bold text-[#0B1B3A] mb-1">
                    Free Consultation
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Evaluate your course options with our advisors.
                  </p>
                </div>

                <Link
                  to="/education/contact?service=admission"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-white shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
                  style={{ backgroundColor: BRAND.pink }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND.pinkHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BRAND.pink)}
                >
                  <span>Get free admission assessment</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </aside>

          {/* 8-col Right Content Sections */}
          <main className="lg:col-span-8 space-y-14 md:space-y-18">
            {/* S02: Choose the course before you chase the offer */}
            <section
              id="course-fit"
              className="scroll-mt-28 bg-white rounded-3xl p-7 sm:p-10 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#0B1B3A] mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#FFF1F3] text-[#FF4D6D] flex items-center justify-center">
                  <Compass className="w-4 h-4" aria-hidden="true" />
                </div>
                <span>Course Fit & Shortlisting</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight leading-snug">
                Choose the course before you chase the offer
              </h2>
              <div className="mt-3 w-14 h-1 rounded-full bg-[#FF4D6D]" />

              <div className="mt-7 space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                <p>
                  A familiar university name tells you little about the course you will attend. The modules, campus and entry route matter too.
                </p>
                <p>
                  Perhaps you want to change fields. Perhaps your family needs a clear reason for the cost. Your shortlist should answer those questions before you spend on applications.
                </p>
                <p className="font-medium text-slate-700">
                  We help you connect your previous study with a realistic next step. The aim is a choice you can explain, rather than a list of places willing to consider you.
                </p>
              </div>
            </section>

            {/* S03: Two similar titles can lead to different decisions */}
            <section
              id="course-comparison"
              className="scroll-mt-28 bg-white rounded-3xl p-7 sm:p-10 border border-slate-200/90 shadow-sm"
            >
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#0B1B3A] mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#FFF1F3] text-[#FF4D6D] flex items-center justify-center">
                  <Scale className="w-4 h-4" aria-hidden="true" />
                </div>
                <span>Curriculum Comparison</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight leading-snug">
                Two similar titles can lead to different decisions
              </h2>
              <div className="mt-3 w-14 h-1 rounded-full bg-[#FF4D6D]" />

              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>Illustrative course comparison. These are invented course descriptions, not university offers or admission predictions.</span>
              </div>

              {/* Side-by-Side Comparison Cards */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Option A */}
                <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200 relative group hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-white text-[#0B1B3A] font-bold text-xs border border-slate-200 shadow-2xs">
                      Option A
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                      Broad Content
                    </span>
                  </div>
                  <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-medium">
                    A broad computing course with several management modules. The title sounds suitable, but the technical content needs a closer look.
                  </p>
                </div>

                {/* Option B */}
                <div className="bg-gradient-to-br from-[#FFF1F3]/50 to-white rounded-2xl p-6 border border-[#FFE4E8] relative group hover:border-[#FF4D6D]/40 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-white text-[#FF4D6D] font-bold text-xs border border-[#FFE4E8] shadow-2xs">
                      Option B
                    </span>
                    <span className="text-[11px] font-semibold text-[#FF4D6D] uppercase tracking-wide">
                      Specialist Content
                    </span>
                  </div>
                  <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-medium">
                    A specialist computing course with relevant technical modules. Its entry requirements may need evidence of prior subject knowledge.
                  </p>
                </div>
              </div>

              {/* Verified Comparison Points */}
              <div className="mt-7 p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 text-[#FF4D6D]">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-sm sm:text-base text-slate-700 font-semibold">
                    Compare learning: Which modules develop the skills you want?
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 text-[#FF4D6D]">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-sm sm:text-base text-slate-700 font-semibold">
                    Compare entry: Which requirements can your current qualifications meet?
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 text-[#FF4D6D]">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-sm sm:text-base text-slate-700 font-semibold">
                    Compare value: What would the qualification help you do back home?
                  </span>
                </div>
              </div>

              <p className="mt-6 text-slate-600 text-sm sm:text-base leading-relaxed">
                A more specialised title is not automatically a better fit. The right choice depends on your background and the actual course details.
              </p>

              {/* Interactive View Switcher Box */}
              <div
                className="mt-8 rounded-2xl border-2 border-slate-200/80 p-6 bg-white shadow-xs"
                role="region"
                aria-label="Course comparison perspective switcher"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0B1B3A]">
                    Select a view: Learning fit / Entry fit / Return-home value.
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Click to switch
                  </span>
                </div>

                {/* Switcher Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    aria-pressed={comparisonView === "learning"}
                    onClick={() => setComparisonView("learning")}
                    className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] cursor-pointer ${
                      comparisonView === "learning"
                        ? "bg-[#0B1B3A] text-white shadow-md scale-[1.01]"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Learning fit
                  </button>

                  <button
                    type="button"
                    aria-pressed={comparisonView === "entry"}
                    onClick={() => setComparisonView("entry")}
                    className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] cursor-pointer ${
                      comparisonView === "entry"
                        ? "bg-[#0B1B3A] text-white shadow-md scale-[1.01]"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Entry fit
                  </button>

                  <button
                    type="button"
                    aria-pressed={comparisonView === "value"}
                    onClick={() => setComparisonView("value")}
                    className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] cursor-pointer ${
                      comparisonView === "value"
                        ? "bg-[#0B1B3A] text-white shadow-md scale-[1.01]"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Return-home value
                  </button>
                </div>

                {/* Perspective statement */}
                <div className="mt-5 p-4 rounded-xl bg-[#FFF1F3] border border-[#FFE4E8]">
                  {comparisonView === "learning" && (
                    <p className="text-sm sm:text-base font-bold text-[#0B1B3A]">
                      Learning fit: Read module content, not just the course title.
                    </p>
                  )}
                  {comparisonView === "entry" && (
                    <p className="text-sm sm:text-base font-bold text-[#0B1B3A]">
                      Entry fit: An interesting course still needs a realistic entry route.
                    </p>
                  )}
                  {comparisonView === "value" && (
                    <p className="text-sm sm:text-base font-bold text-[#0B1B3A]">
                      Return-home value: Compare the skills with roles or further study you may pursue.
                    </p>
                  )}
                </div>

                {/* Screen-reader full transcript */}
                <div className="sr-only">
                  <p>Learning fit: Read module content, not just the course title.</p>
                  <p>Entry fit: An interesting course still needs a realistic entry route.</p>
                  <p>Return-home value: Compare the skills with roles or further study you may pursue.</p>
                </div>

                <div className="mt-4 text-xs text-slate-400 font-medium">
                  Demonstration only. No university has assessed this example.
                </div>
              </div>
            </section>

            {/* S04: Know what each application needs */}
            <section
              id="application-route"
              className="scroll-mt-28 bg-white rounded-3xl p-7 sm:p-10 border border-slate-200/90 shadow-sm"
            >
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#0B1B3A] mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#FFF1F3] text-[#FF4D6D] flex items-center justify-center">
                  <Layers className="w-4 h-4" aria-hidden="true" />
                </div>
                <span>Application Stages</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight leading-snug">
                Know what each application needs
              </h2>
              <div className="mt-3 w-14 h-1 rounded-full bg-[#FF4D6D]" />

              <div className="mt-7 space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                <p>
                  Applications do not all follow the same rules. One course may ask for subject experience. Another may require a portfolio or a different English result.
                </p>
                <p>
                  Our admission support covers entry requirement checks, application planning and personal statement review. You keep ownership of your experience and your reasons for applying.
                </p>
                <p className="font-medium text-slate-700">
                  We can help improve how you explain your background. We cannot turn an invented achievement into a valid application.
                </p>
              </div>

              {/* Interactive Stage Cards */}
              <div className="mt-9 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  {
                    stage: "Stage 01",
                    text: "Understand your profile. Discuss your qualifications, interests and study goals.",
                  },
                  {
                    stage: "Stage 02",
                    text: "Compare realistic options. Review course requirements and the reasons for each choice.",
                  },
                  {
                    stage: "Stage 03",
                    text: "Prepare the application. Work through the selected provider's requirements.",
                  },
                  {
                    stage: "Stage 04",
                    text: "Understand the decision. Review conditions before deciding what to accept.",
                  },
                ].map((item, idx) => {
                  const isHovered = hoveredStage === idx;
                  return (
                    <div
                      key={item.stage}
                      tabIndex={0}
                      onMouseEnter={() => setHoveredStage(idx)}
                      onMouseLeave={() => setHoveredStage(null)}
                      onFocus={() => setHoveredStage(idx)}
                      onBlur={() => setHoveredStage(null)}
                      className={`p-6 rounded-2xl border transition-all duration-200 cursor-pointer focus:outline-none ${
                        isHovered
                          ? "border-[#FF4D6D] bg-white shadow-xl shadow-pink-500/10 -translate-y-0.5"
                          : "border-slate-200 bg-slate-50/70 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3.5">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider transition-colors ${
                            isHovered
                              ? "bg-[#FF4D6D] text-white"
                              : "bg-[#0B1B3A] text-white"
                          }`}
                        >
                          {item.stage}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          Step 0{idx + 1}
                        </span>
                      </div>
                      <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
                        {item.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* S05: Look beyond the first tuition figure */}
            <section
              id="costs"
              className="scroll-mt-28 bg-white rounded-3xl p-7 sm:p-10 border border-slate-200/90 shadow-sm"
            >
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#0B1B3A] mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#FFF1F3] text-[#FF4D6D] flex items-center justify-center">
                  <BookOpen className="w-4 h-4" aria-hidden="true" />
                </div>
                <span>Financial Realism</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight leading-snug">
                Look beyond the first tuition figure
              </h2>
              <div className="mt-3 w-14 h-1 rounded-full bg-[#FF4D6D]" />

              <div className="mt-7 space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                <p>
                  A tuition quote does not show the whole commitment. Living costs, travel and course-related expenses can change which option fits your family.
                </p>
                <p>
                  Separate total cost from payment timing. A deposit may fall due before other decisions are complete. Read the provider's refund terms before making that payment.
                </p>
                <p>
                  Visa financial evidence is another question. A family budget and an immigration evidence rule serve different purposes.
                </p>
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-sm sm:text-base font-medium">
                  Do not build the plan around a scholarship you have not received. Treat paid work during study as uncertain, not as the money that makes the course possible.
                </div>
              </div>
            </section>

            {/* S06: Make the qualification useful after graduation */}
            <section
              id="recognition"
              className="scroll-mt-28 bg-white rounded-3xl p-7 sm:p-10 border border-slate-200/90 shadow-sm"
            >
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#0B1B3A] mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#FFF1F3] text-[#FF4D6D] flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" aria-hidden="true" />
                </div>
                <span>Future Recognition</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight leading-snug">
                Make the qualification useful after graduation
              </h2>
              <div className="mt-3 w-14 h-1 rounded-full bg-[#FF4D6D]" />

              <div className="mt-7 space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                <p>
                  Ask who awards the qualification and what you will study at the stated campus. For regulated careers, check the relevant professional body's rules before you commit.
                </p>
                <p>
                  A university's admission decision does not settle professional recognition in Pakistan or another country. Nor does it guarantee a job.
                </p>
                <p className="font-semibold text-[#0B1B3A]">
                  Compare a return-home route alongside your overseas plans. Look at the skills, further study options and recognition your intended career needs.
                </p>
              </div>
            </section>

            {/* S07: Read the conditions before you say yes */}
            <section
              id="offer-comparison"
              className="scroll-mt-28 bg-white rounded-3xl p-7 sm:p-10 border border-slate-200/90 shadow-sm"
            >
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#0B1B3A] mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#FFF1F3] text-[#FF4D6D] flex items-center justify-center">
                  <FileCheck className="w-4 h-4" aria-hidden="true" />
                </div>
                <span>Offer Strategy</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight leading-snug">
                Read the conditions before you say yes
              </h2>
              <div className="mt-3 w-14 h-1 rounded-full bg-[#FF4D6D]" />

              {/* Two-Column Process Comparison */}
              <div className="mt-8 space-y-6">
                {/* Comparison Pair 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl bg-slate-100/70 border border-slate-200/90 relative">
                    <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600 mb-2.5">
                      Before
                    </span>
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                      An offer arrives and the deposit becomes the next urgent task.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FFF1F3] to-white border border-[#FFE4E8] shadow-xs relative">
                    <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#FF4D6D] text-white mb-2.5">
                      A clearer approach
                    </span>
                    <p className="text-sm sm:text-base text-[#0B1B3A] font-bold leading-relaxed">
                      Read the academic conditions, remaining fees and payment terms first. Then decide what you can meet and what still needs an answer.
                    </p>
                  </div>
                </div>

                {/* Comparison Pair 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl bg-slate-100/70 border border-slate-200/90 relative">
                    <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600 mb-2.5">
                      Before
                    </span>
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                      A possible scholarship makes an expensive option appear affordable.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FFF1F3] to-white border border-[#FFE4E8] shadow-xs relative">
                    <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#FF4D6D] text-white mb-2.5">
                      A clearer approach
                    </span>
                    <p className="text-sm sm:text-base text-[#0B1B3A] font-bold leading-relaxed">
                      Keep the confirmed funding plan separate from any award still under review.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500 font-medium">
                This is a planning comparison, not a client result. A conditional offer still has conditions. An offer is not a visa approval.
              </div>
            </section>

            {/* S08: Get help with the choice and the application */}
            <section
              id="support"
              className="scroll-mt-28 bg-white rounded-3xl p-7 sm:p-10 border border-slate-200/90 shadow-sm"
            >
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#0B1B3A] mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#FFF1F3] text-[#FF4D6D] flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                </div>
                <span>Our Advisory Support</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight leading-snug">
                Get help with the choice and the application
              </h2>
              <div className="mt-3 w-14 h-1 rounded-full bg-[#FF4D6D]" />

              <div className="mt-7 space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                <p>
                  ProConsulting's admission guidance brings course selection, entry checks and application support into one conversation. That helps you see how one decision affects the next.
                </p>
                <p>
                  We can review your personal statement and help you understand university responses. You should know why an application is being made and what an offer asks of you.
                </p>
                <p className="font-semibold text-[#0B1B3A]">
                  Start with a free assessment. Ask us to explain any further service scope and charges before you agree to proceed.
                </p>
                <p>
                  Already holding an offer? Tell us what remains unclear, rather than starting the whole journey again.
                </p>
              </div>
            </section>

            {/* S09: Keep the decisions in the right hands */}
            <section
              id="boundaries"
              className="scroll-mt-28 bg-gradient-to-br from-slate-50 to-pink-50/20 rounded-3xl p-7 sm:p-10 border border-slate-200/90 shadow-sm"
            >
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#0B1B3A] mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#FFF1F3] text-[#FF4D6D] flex items-center justify-center">
                  <Shield className="w-4 h-4" aria-hidden="true" />
                </div>
                <span>Ethical Boundaries & Transparency</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight leading-snug">
                Keep the decisions in the right hands
              </h2>
              <div className="mt-3 w-14 h-1 rounded-full bg-[#FF4D6D]" />

              <div className="mt-7 space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                <p>
                  Universities decide who they admit. Scholarship providers decide awards. Immigration authorities decide visas.
                </p>
                <p>
                  A course that suits your goals may still have competitive entry. We will not describe an application as a guaranteed place.
                </p>
                <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                  <p className="font-bold text-[#0B1B3A] text-base">
                    No consultant can guarantee a scholarship, admission or visa, and we do not.
                  </p>
                </div>
                <p className="pt-2">
                  For a later stage, explore{" "}
                  <Link
                    to="/education/services/visa"
                    className="text-[#0B1B3A] font-bold underline decoration-[#FF4D6D] underline-offset-4 hover:text-[#FF4D6D] transition-colors"
                  >
                    student visa support
                  </Link>{" "}
                  or{" "}
                  <Link
                    to="/education/services/interview-prep"
                    className="text-[#0B1B3A] font-bold underline decoration-[#FF4D6D] underline-offset-4 hover:text-[#FF4D6D] transition-colors"
                  >
                    interview preparation
                  </Link>
                  . To compare countries, use the{" "}
                  <Link
                    to="/education/destinations"
                    className="text-[#0B1B3A] font-bold underline decoration-[#FF4D6D] underline-offset-4 hover:text-[#FF4D6D] transition-colors"
                  >
                    study destinations directory
                  </Link>
                  .
                </p>
              </div>
            </section>

            {/* S10: Questions about admission guidance (FAQ) */}
            <section
              id="faq"
              className="scroll-mt-28 bg-white rounded-3xl p-7 sm:p-10 border border-slate-200/90 shadow-sm"
            >
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#0B1B3A] mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#FFF1F3] text-[#FF4D6D] flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" aria-hidden="true" />
                </div>
                <span>Frequently Asked Questions</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight leading-snug">
                Questions about admission guidance
              </h2>
              <div className="mt-3 w-14 h-1 rounded-full bg-[#FF4D6D]" />

              <div className="mt-8 space-y-4">
                {[
                  {
                    q: "Can I get help before choosing a country?",
                    a: "Yes. The initial assessment can start with your qualifications, interests and budget. A country choice should follow your priorities, not replace them.",
                  },
                  {
                    q: "Can you guarantee admission?",
                    a: "No. Each university makes its own decision. We help you understand requirements and prepare an application that reflects your real background.",
                  },
                  {
                    q: "Will you write my personal statement for me?",
                    a: "Our published service includes review and improvement. Your experiences and reasons must remain your own. We will not invent achievements or a study history.",
                  },
                  {
                    q: "Does admission guidance include a scholarship?",
                    a: "Scholarships have separate eligibility, coverage and selection rules. Admission does not mean you have an award. Keep unconfirmed funding out of your committed budget.",
                  },
                  {
                    q: "What if I already have an offer?",
                    a: "We can discuss the offer conditions and your remaining questions. Explain what you have already done so the next step fits your situation.",
                  },
                  {
                    q: "What does the service cost?",
                    a: "The initial assessment is free. Ask for the scope and any further charges before you agree to additional support. University and other third-party fees are separate.",
                  },
                ].map((faq, idx) => (
                  <details
                    key={idx}
                    className="group rounded-2xl border border-slate-200/90 bg-white transition-all duration-200 open:border-[#FFE4E8] open:shadow-md"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between p-5 sm:p-6 text-left text-base sm:text-lg font-bold text-[#0B1B3A] min-h-[48px] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] rounded-2xl">
                      <span className="pr-4">{faq.q}</span>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all duration-200 group-open:rotate-180 group-open:bg-[#FF4D6D] group-open:text-white">
                        <ChevronDown className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </summary>
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100/60 mt-1">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </section>

            {/* S11: Bring the decision you are stuck on (Closing Navy Panel) */}
            <section
              id="next-step"
              className="scroll-mt-28 relative overflow-hidden rounded-3xl p-8 sm:p-14 text-white shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${BRAND.navy} 0%, #0E2248 100%)`,
              }}
            >
              {/* Radial glow background */}
              <div
                aria-hidden="true"
                className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-pink-500/20 blur-3xl pointer-events-none"
              />

              <div className="max-w-2xl relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-pink-300 mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                  <span>Free Initial Advisory</span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Bring the decision you are stuck on
                </h2>
                <div className="mt-3 w-14 h-1 rounded-full bg-[#FF4D6D]" />

                <div className="mt-6 space-y-3.5 text-slate-200 text-base sm:text-lg leading-relaxed">
                  <p>
                    You may be choosing a subject, comparing offers or unsure whether your grades fit. Tell us where the uncertainty starts.
                  </p>
                  <p>
                    A free admission assessment gives that conversation a clear starting point. Share your current qualification and the course you hope to study.
                  </p>
                </div>

                <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <Link
                    to="/education/contact?service=admission"
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0B1B3A]"
                    style={{
                      backgroundColor: BRAND.pink,
                      boxShadow: "0 10px 25px rgba(255, 77, 109, 0.4)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND.pinkHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BRAND.pink)}
                  >
                    <span>Get free admission assessment</span>
                    <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </Link>
                </div>

                <p className="mt-6 text-xs text-slate-400 font-medium">
                  You remain in control of where you apply and what you accept.
                </p>
              </div>
            </section>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
