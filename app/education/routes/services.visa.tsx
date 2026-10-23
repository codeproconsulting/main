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
  Check,
  Eye,
  RotateCcw,
  AlertCircle,
  FileText,
  BadgeAlert,
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

const CANONICAL_URL = "https://proconsulting.uk/education/services/visa";
const TITLE = "Student Visa Support | ProConsulting";
const DESCRIPTION =
  "Understand the next step after an offer. ProConsulting helps students prepare visa applications, review financial evidence and address unresolved questions.";

const VISA_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://proconsulting.uk/education/services/visa#service",
      "name": "Student Visa Support",
      "url": "https://proconsulting.uk/education/services/visa",
      "serviceType": "Student Visa Support",
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
          "name": "Student Visa Support",
          "item": "https://proconsulting.uk/education/services/visa"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Does a university offer mean I will receive a visa?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Admission and immigration are separate decisions. Your chosen route has its own requirements, and the relevant authority decides the application."
          }
        },
        {
          "@type": "Question",
          "name": "Can you guarantee approval or a faster decision?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. We cannot control an authority’s decision or processing time. Do not make non-refundable plans on the assumption of approval."
          }
        },
        {
          "@type": "Question",
          "name": "Can you help with financial evidence?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our published service includes financial evidence support. The review must use the chosen route’s current requirements and your genuine funding situation."
          }
        },
        {
          "@type": "Question",
          "name": "Can I fund the course through part-time work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Do not build an essential funding plan around future earnings. Work permission depends on your route, and permission does not guarantee a job."
          }
        },
        {
          "@type": "Question",
          "name": "Can my family travel with me?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "That requires a separate eligibility review. Student admission does not establish a partner’s or child’s permission to accompany you."
          }
        },
        {
          "@type": "Question",
          "name": "What if I have a previous refusal?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Mention it in the initial assessment. The reasons and your circumstances matter. Specialist advice may be needed before deciding whether or how to apply again."
          }
        },
        {
          "@type": "Question",
          "name": "What are the fees for support?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The initial assessment is free. Ask for a clear service scope and any further charges. Visa, provider and other third-party fees are separate."
          }
        }
      ]
    }
  ]
};

export function meta() {
  const pathname = "/education/services/visa";
  return [
    { title: TITLE },
    { name: "description", content: DESCRIPTION },
    ...pageMeta({ title: TITLE, description: DESCRIPTION, pathname }),
    {
      "script:ld+json": VISA_SCHEMA,
    },
  ];
}

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export default function StudentVisaSupport() {
  // S03 Preparation demo 4 states
  const [activePrepState, setActivePrepState] = useState<
    "offer" | "funding" | "conflict" | "review"
  >("offer");

  // S07 Stage cards interactive hover/focus state
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);

  // Active section for scrollspy
  const [activeSection, setActiveSection] = useState<string>("offer-to-visa");

  const navItems = [
    { id: "offer-to-visa", label: "Turn the next step into a clear plan", short: "Offer to Visa" },
    { id: "preparation-demo", label: "An offer and a ready application are different states", short: "Preparation States" },
    { id: "route", label: "Use the rules for your actual route", short: "Route Rules" },
    { id: "financial-evidence", label: "Separate affordability from financial evidence", short: "Financial Evidence" },
    { id: "payment-timing", label: "Understand the commitment before paying", short: "Payment Timing" },
    { id: "support", label: "Get support through the preparation stages", short: "Preparation Stages" },
    { id: "comparison", label: "Resolve uncertainty rather than hide it", short: "Method Comparison" },
    { id: "limits", label: "Support cannot replace the authority’s decision", short: "Authority Limits" },
    { id: "faq", label: "Questions about student visa support", short: "FAQ" },
    { id: "next-step", label: "Start with the point you cannot resolve", short: "Next Step" },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(VISA_SCHEMA) }}
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
              Student Visa Support
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Narrow Left Copy */}
            <div className="lg:col-span-7">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-xs text-xs font-semibold text-[#0B1B3A] mb-6">
                <span className="w-2 h-2 rounded-full bg-[#FF4D6D] animate-pulse" />
                <span className="tracking-wide uppercase text-[11px] text-slate-600 font-bold">
                  Student Visa Advisory · Evidence Guidance
                </span>
              </div>

              {/* Single H1 */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-[#0B1B3A] tracking-tight leading-[1.12]">
                Student Visa Support
              </h1>

              <div className="mt-4 flex items-center gap-2">
                <div className="w-12 h-1 rounded-full bg-[#FF4D6D]" />
                <div className="w-3 h-1 rounded-full bg-slate-300" />
              </div>

              {/* Verified Text Blocks verbatim from Part 1 */}
              <p className="mt-6 text-xl sm:text-2xl font-bold text-[#0B1B3A] leading-snug">
                You have an offer. The visa application is a separate decision.
              </p>

              <div className="mt-4 space-y-3.5 text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
                <p>
                  An admission letter does not answer every question about evidence, funding or timing. ProConsulting helps you understand what your chosen student route requires and prepare your application.
                </p>
                <p>
                  Start with your destination and where you are in the process.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4">
                <Link
                  to="/education/contact?service=visa"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl text-sm sm:text-base font-bold text-white shadow-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] focus:ring-offset-2"
                  style={{
                    backgroundColor: BRAND.pink,
                    boxShadow: "0 10px 25px -4px rgba(255, 77, 109, 0.38)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND.pinkHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BRAND.pink)}
                >
                  <span>Get free student visa assessment</span>
                  <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </Link>

                <a
                  href="#preparation-demo"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm sm:text-base font-semibold text-[#0B1B3A] bg-white border border-slate-300/80 hover:bg-slate-50 hover:border-slate-400/80 shadow-xs transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#0B1B3A] focus:ring-offset-2"
                >
                  <span>Explore the preparation journey</span>
                  <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" aria-hidden="true" />
                </a>
              </div>

              {/* Verified Hero Labels as stylish feature tags */}
              <div className="mt-10 pt-8 border-t border-slate-200/80">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    "Application guidance.",
                    "Financial evidence review.",
                    "Submission and follow-up support where applicable.",
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
                      Visa Process Architecture
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Evidence First
                  </span>
                </div>

                <svg
                  viewBox="0 0 360 280"
                  className="w-full h-auto select-none"
                  aria-label="Relationship between application guidance, financial evidence review, and submission support"
                  role="img"
                >
                  <defs>
                    <linearGradient id="visaGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="100%" stopColor="#F8FAFC" />
                    </linearGradient>
                    <linearGradient id="visaGradActive" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFF1F3" />
                      <stop offset="100%" stopColor="#FFFFFF" />
                    </linearGradient>
                    <filter id="visaCardShadow" x="-10%" y="-10%" width="120%" height="130%">
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

                  {/* Node 1: Application guidance */}
                  <g transform="translate(30, 20)" filter="url(#visaCardShadow)">
                    <rect
                      x="0"
                      y="0"
                      width="300"
                      height="50"
                      rx="25"
                      fill="url(#visaGrad1)"
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
                      Application guidance
                    </text>
                  </g>

                  {/* Node 2: Financial evidence review (Highlighted centerpiece) */}
                  <g transform="translate(30, 110)" filter="url(#visaCardShadow)">
                    <rect
                      x="0"
                      y="0"
                      width="300"
                      height="56"
                      rx="28"
                      fill="url(#visaGradActive)"
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
                      Financial evidence review
                    </text>
                  </g>

                  {/* Node 3: Submission and follow-up support where applicable */}
                  <g transform="translate(30, 208)" filter="url(#visaCardShadow)">
                    <rect
                      x="0"
                      y="0"
                      width="300"
                      height="50"
                      rx="25"
                      fill="url(#visaGrad1)"
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
                      y="27"
                      textAnchor="middle"
                      fill={BRAND.navy}
                      fontFamily="Inter, sans-serif"
                      fontSize="11"
                      fontWeight="700"
                    >
                      Submission and follow-up support
                    </text>
                    <text
                      x="165"
                      y="40"
                      textAnchor="middle"
                      fill={BRAND.navy}
                      fontFamily="Inter, sans-serif"
                      fontSize="10.5"
                      fontWeight="700"
                    >
                      where applicable
                    </text>
                  </g>
                </svg>

                <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D]" />
                    Genuine documentation
                  </span>
                  <span className="text-slate-400">Route-specific checks</span>
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
                  Student visa preparation sections
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
                    Free Visa Evaluation
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Review your destination, route conditions and evidence.
                  </p>
                </div>

                <Link
                  to="/education/contact?service=visa"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-white shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
                  style={{ backgroundColor: BRAND.pink }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND.pinkHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BRAND.pink)}
                >
                  <span>Get free student visa assessment</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </aside>

          {/* 8-col Right Content Sections */}
          <main className="lg:col-span-8 space-y-14 md:space-y-18">
            {/* S02: Turn the next step into a clear plan */}
            <section
              id="offer-to-visa"
              className="scroll-mt-28 bg-white rounded-3xl p-7 sm:p-10 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#0B1B3A] mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#FFF1F3] text-[#FF4D6D] flex items-center justify-center">
                  <Compass className="w-4 h-4" aria-hidden="true" />
                </div>
                <span>Offer to Visa Planning</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight leading-snug">
                Turn the next step into a clear plan
              </h2>
              <div className="mt-3 w-14 h-1 rounded-full bg-[#FF4D6D]" />

              <div className="mt-7 space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                <p>
                  A provider may ask for payment while you are still resolving visa questions. A friend may describe a rule that applied to a different route.
                </p>
                <p>
                  Those details matter. The course, destination and your circumstances shape the requirements you need to meet.
                </p>
                <p className="font-medium text-slate-700">
                  Our support helps you separate what is ready from what needs attention. You can then ask better questions before committing money or submitting an application.
                </p>
              </div>
            </section>

            {/* S03: An offer and a ready application are different states */}
            <section
              id="preparation-demo"
              className="scroll-mt-28 bg-white rounded-3xl p-7 sm:p-10 border border-slate-200/90 shadow-sm"
            >
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#0B1B3A] mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#FFF1F3] text-[#FF4D6D] flex items-center justify-center">
                  <Scale className="w-4 h-4" aria-hidden="true" />
                </div>
                <span>Preparation States</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight leading-snug">
                An offer and a ready application are different states
              </h2>
              <div className="mt-3 w-14 h-1 rounded-full bg-[#FF4D6D]" />

              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>Illustrative preparation journey. This example uses no applicant data and does not assess visa eligibility.</span>
              </div>

              {/* 4 State Switcher */}
              <div
                className="mt-8 rounded-2xl border-2 border-slate-200/80 p-6 bg-slate-50/60 shadow-xs"
                role="region"
                aria-label="Visa preparation journey state switcher"
              >
                <div className="text-xs font-bold uppercase tracking-wider text-[#0B1B3A] mb-4">
                  Choose a situation: Offer received / Funding unclear / Information conflicts / Ready for review.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {[
                    { id: "offer", label: "Offer received" },
                    { id: "funding", label: "Funding unclear" },
                    { id: "conflict", label: "Information conflicts" },
                    { id: "review", label: "Ready for review" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      aria-pressed={activePrepState === tab.id}
                      onClick={() => setActivePrepState(tab.id as any)}
                      className={`px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] cursor-pointer ${
                        activePrepState === tab.id
                          ? "bg-[#0B1B3A] text-white shadow-md scale-[1.01]"
                          : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Perspective Card (Verbatim text) */}
                <div className="mt-6 p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  {activePrepState === "offer" && (
                    <div className="space-y-2">
                      <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-[#0B1B3A]">
                        Situation: Offer received
                      </div>
                      <p className="text-base sm:text-lg text-slate-800 font-semibold leading-relaxed">
                        Offer received: Read the course conditions and identify the next route-specific step. Admission is not permission to travel or study.
                      </p>
                    </div>
                  )}

                  {activePrepState === "funding" && (
                    <div className="space-y-2">
                      <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#FFF1F3] text-[#FF4D6D]">
                        Situation: Funding unclear
                      </div>
                      <p className="text-base sm:text-lg text-slate-800 font-semibold leading-relaxed">
                        Funding unclear: Separate the cost of studying from the financial evidence the route requires. An unexplained balance is not a complete funding explanation.
                      </p>
                    </div>
                  )}

                  {activePrepState === "conflict" && (
                    <div className="space-y-2">
                      <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                        Situation: Information conflicts
                      </div>
                      <p className="text-base sm:text-lg text-slate-800 font-semibold leading-relaxed">
                        Information conflicts: Resolve the difference before submitting. Do not change facts to make records appear consistent.
                      </p>
                    </div>
                  )}

                  {activePrepState === "review" && (
                    <div className="space-y-2">
                      <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                        Situation: Ready for review
                      </div>
                      <p className="text-base sm:text-lg text-slate-800 font-semibold leading-relaxed">
                        Ready for review: Check the application against the current route requirements. A review is not an authority's decision.
                      </p>
                    </div>
                  )}
                </div>

                {/* SSR Screen-reader Fallback */}
                <div className="sr-only">
                  <p>Offer received: Read the course conditions and identify the next route-specific step. Admission is not permission to travel or study.</p>
                  <p>Funding unclear: Separate the cost of studying from the financial evidence the route requires. An unexplained balance is not a complete funding explanation.</p>
                  <p>Information conflicts: Resolve the difference before submitting. Do not change facts to make records appear consistent.</p>
                  <p>Ready for review: Check the application against the current route requirements. A review is not an authority's decision.</p>
                </div>

                {/* Constant Status and Next Step */}
                <div className="mt-5 pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
                  <span className="font-semibold text-slate-600">
                    Status: Preparation only. This demonstration cannot submit an application or predict an outcome.
                  </span>
                  <span className="text-[#FF4D6D] font-bold">
                    Next step: Discuss the unresolved issue in a free assessment.
                  </span>
                </div>
              </div>
            </section>

            {/* S04: Use the rules for your actual route */}
            <section
              id="route"
              className="scroll-mt-28 bg-white rounded-3xl p-7 sm:p-10 border border-slate-200/90 shadow-sm"
            >
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#0B1B3A] mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#FFF1F3] text-[#FF4D6D] flex items-center justify-center">
                  <BookOpen className="w-4 h-4" aria-hidden="true" />
                </div>
                <span>Route Rules</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight leading-snug">
                Use the rules for your actual route
              </h2>
              <div className="mt-3 w-14 h-1 rounded-full bg-[#FF4D6D]" />

              <div className="mt-7 space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                <p>
                  Student visas are not one shared process across every country. An offer, a provider confirmation and a visa decision have different roles.
                </p>
                <p>
                  For example, UK Student visa guidance explains the role of a Confirmation of Acceptance for Studies, known as a CAS. Other destinations use different requirements and terms.
                </p>
                <p className="font-semibold text-[#0B1B3A]">
                  We help you understand the route you intend to use. A rule from one country should not become advice for another application.
                </p>
              </div>
            </section>

            {/* S05: Separate affordability from financial evidence */}
            <section
              id="financial-evidence"
              className="scroll-mt-28 bg-white rounded-3xl p-7 sm:p-10 border border-slate-200/90 shadow-sm"
            >
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#0B1B3A] mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#FFF1F3] text-[#FF4D6D] flex items-center justify-center">
                  <FileCheck className="w-4 h-4" aria-hidden="true" />
                </div>
                <span>Financial Proof</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight leading-snug">
                Separate affordability from financial evidence
              </h2>
              <div className="mt-3 w-14 h-1 rounded-full bg-[#FF4D6D]" />

              <div className="mt-7 space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                <p>
                  Your family needs a workable plan for tuition and living costs. Immigration authorities may also require evidence in a specific form.
                </p>
                <p>
                  These are related questions, but they are not interchangeable. Having enough for a deposit does not explain the full funding plan.
                </p>
                <p>
                  The source of funds matters too. Personal savings, family support, loans and confirmed awards may need different evidence under the chosen route.
                </p>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-sm sm:text-base font-semibold">
                  We can help review what the requirements ask for. We cannot make unsupported money or false records acceptable.
                </div>
              </div>
            </section>

            {/* S06: Understand the commitment before paying */}
            <section
              id="payment-timing"
              className="scroll-mt-28 bg-white rounded-3xl p-7 sm:p-10 border border-slate-200/90 shadow-sm"
            >
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#0B1B3A] mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#FFF1F3] text-[#FF4D6D] flex items-center justify-center">
                  <BadgeAlert className="w-4 h-4" aria-hidden="true" />
                </div>
                <span>Payment & Commitment</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight leading-snug">
                Understand the commitment before paying
              </h2>
              <div className="mt-3 w-14 h-1 rounded-full bg-[#FF4D6D]" />

              <div className="mt-7 space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                <p>
                  Read deposit and refund terms before sending money to a provider. Find out which conditions remain and when each payment falls due.
                </p>
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-sm sm:text-base font-medium">
                  Keep scholarship applications separate from confirmed funding. An award under consideration should not be treated as money already available.
                </div>
                <p>
                  Do not rely on finding work after arrival to cover essential study costs. Work permission and actual employment are separate questions.
                </p>
                <p className="font-medium text-slate-700">
                  If family members plan to travel too, discuss that early. Their eligibility and costs need their own review.
                </p>
              </div>
            </section>

            {/* S07: Get support through the preparation stages */}
            <section
              id="support"
              className="scroll-mt-28 bg-white rounded-3xl p-7 sm:p-10 border border-slate-200/90 shadow-sm"
            >
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#0B1B3A] mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#FFF1F3] text-[#FF4D6D] flex items-center justify-center">
                  <Layers className="w-4 h-4" aria-hidden="true" />
                </div>
                <span>Preparation Stages</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight leading-snug">
                Get support through the preparation stages
              </h2>
              <div className="mt-3 w-14 h-1 rounded-full bg-[#FF4D6D]" />

              <div className="mt-7 space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                <p>
                  ProConsulting's published student visa service covers requirement guidance, form support and application review. Appointment and submission support depend on the route and the available process.
                </p>
              </div>

              {/* Interactive Stage Cards */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  {
                    stage: "Stage 01",
                    text: "Explain your situation. Start with the destination, course and current application stage.",
                  },
                  {
                    stage: "Stage 02",
                    text: "Review unresolved requirements. Identify evidence or information that needs clarification.",
                  },
                  {
                    stage: "Stage 03",
                    text: "Prepare the application. Review the information before you authorise submission.",
                  },
                  {
                    stage: "Stage 04",
                    text: "Follow the process. Respond to official requests and track the application through the relevant channel.",
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

              <div className="mt-7 p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-pink-50/30 border border-slate-200/90 text-slate-700 text-sm sm:text-base font-semibold leading-relaxed">
                You should understand what is being submitted in your name. Questions or inconsistencies should come into the open, not disappear into a rushed application.
              </div>
            </section>

            {/* S08: Resolve uncertainty rather than hide it */}
            <section
              id="comparison"
              className="scroll-mt-28 bg-white rounded-3xl p-7 sm:p-10 border border-slate-200/90 shadow-sm"
            >
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#0B1B3A] mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#FFF1F3] text-[#FF4D6D] flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                </div>
                <span>Method Comparison</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight leading-snug">
                Resolve uncertainty rather than hide it
              </h2>
              <div className="mt-3 w-14 h-1 rounded-full bg-[#FF4D6D]" />

              {/* Two-Column Process Comparison */}
              <div className="mt-8 space-y-6">
                {/* Comparison Pair 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl bg-slate-100/70 border border-slate-200/90 relative">
                    <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600 mb-2.5">
                      A rushed approach
                    </span>
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                      Treat the offer as proof that the visa will follow.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FFF1F3] to-white border border-[#FFE4E8] shadow-xs relative">
                    <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#FF4D6D] text-white mb-2.5">
                      A clearer approach
                    </span>
                    <p className="text-sm sm:text-base text-[#0B1B3A] font-bold leading-relaxed">
                      Separate admission conditions from immigration requirements.
                    </p>
                  </div>
                </div>

                {/* Comparison Pair 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl bg-slate-100/70 border border-slate-200/90 relative">
                    <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600 mb-2.5">
                      A rushed approach
                    </span>
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                      Copy a friend's funding explanation.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FFF1F3] to-white border border-[#FFE4E8] shadow-xs relative">
                    <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#FF4D6D] text-white mb-2.5">
                      A clearer approach
                    </span>
                    <p className="text-sm sm:text-base text-[#0B1B3A] font-bold leading-relaxed">
                      Explain the funds that genuinely support your own application.
                    </p>
                  </div>
                </div>

                {/* Comparison Pair 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl bg-slate-100/70 border border-slate-200/90 relative">
                    <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600 mb-2.5">
                      A rushed approach
                    </span>
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                      Submit conflicting information and hope it is overlooked.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FFF1F3] to-white border border-[#FFE4E8] shadow-xs relative">
                    <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#FF4D6D] text-white mb-2.5">
                      A clearer approach
                    </span>
                    <p className="text-sm sm:text-base text-[#0B1B3A] font-bold leading-relaxed">
                      Investigate the difference and use accurate information.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500 font-medium">
                This compares preparation methods. It does not claim that a particular method guarantees approval.
              </div>
            </section>

            {/* S09: Support cannot replace the authority’s decision */}
            <section
              id="limits"
              className="scroll-mt-28 bg-gradient-to-br from-slate-50 to-pink-50/20 rounded-3xl p-7 sm:p-10 border border-slate-200/90 shadow-sm"
            >
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#0B1B3A] mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#FFF1F3] text-[#FF4D6D] flex items-center justify-center">
                  <Shield className="w-4 h-4" aria-hidden="true" />
                </div>
                <span>Ethical Boundaries & Authority Scope</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight leading-snug">
                Support cannot replace the authority’s decision
              </h2>
              <div className="mt-3 w-14 h-1 rounded-full bg-[#FF4D6D]" />

              <div className="mt-7 space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                <p>
                  Immigration authorities decide student visa applications. Processing times, requests for further information and outcomes remain outside a consultant's control.
                </p>
                <p>
                  A previous refusal or complex immigration history may need specialist advice. Raise it at the start so the appropriate next step can be discussed.
                </p>
                <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                  <p className="font-bold text-[#0B1B3A] text-base">
                    No consultant can guarantee a scholarship, admission or visa, and we do not.
                  </p>
                </div>
                <p className="pt-2">
                  Need help before the offer stage? Explore{" "}
                  <Link
                    to="/education/services/admission"
                    className="text-[#0B1B3A] font-bold underline decoration-[#FF4D6D] underline-offset-4 hover:text-[#FF4D6D] transition-colors"
                  >
                    admission guidance
                  </Link>
                  . If an interview is your next concern, see{" "}
                  <Link
                    to="/education/services/interview-prep"
                    className="text-[#0B1B3A] font-bold underline decoration-[#FF4D6D] underline-offset-4 hover:text-[#FF4D6D] transition-colors"
                  >
                    interview preparation
                  </Link>
                  .
                </p>
              </div>
            </section>

            {/* S10: Questions about student visa support (FAQ) */}
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
                Questions about student visa support
              </h2>
              <div className="mt-3 w-14 h-1 rounded-full bg-[#FF4D6D]" />

              <div className="mt-8 space-y-4">
                {[
                  {
                    q: "Does a university offer mean I will receive a visa?",
                    a: "No. Admission and immigration are separate decisions. Your chosen route has its own requirements, and the relevant authority decides the application.",
                  },
                  {
                    q: "Can you guarantee approval or a faster decision?",
                    a: "No. We cannot control an authority’s decision or processing time. Do not make non-refundable plans on the assumption of approval.",
                  },
                  {
                    q: "Can you help with financial evidence?",
                    a: "Our published service includes financial evidence support. The review must use the chosen route’s current requirements and your genuine funding situation.",
                  },
                  {
                    q: "Can I fund the course through part-time work?",
                    a: "Do not build an essential funding plan around future earnings. Work permission depends on your route, and permission does not guarantee a job.",
                  },
                  {
                    q: "Can my family travel with me?",
                    a: "That requires a separate eligibility review. Student admission does not establish a partner’s or child’s permission to accompany you.",
                  },
                  {
                    q: "What if I have a previous refusal?",
                    a: "Mention it in the initial assessment. The reasons and your circumstances matter. Specialist advice may be needed before deciding whether or how to apply again.",
                  },
                  {
                    q: "What are the fees for support?",
                    a: "The initial assessment is free. Ask for a clear service scope and any further charges. Visa, provider and other third-party fees are separate.",
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

            {/* S11: Start with the point you cannot resolve (Closing Navy Panel) */}
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
                  Start with the point you cannot resolve
                </h2>
                <div className="mt-3 w-14 h-1 rounded-full bg-[#FF4D6D]" />

                <div className="mt-6 space-y-3.5 text-slate-200 text-base sm:text-lg leading-relaxed">
                  <p>
                    Perhaps the offer is clear but the funding is not. Perhaps you are unsure which step comes before payment.
                  </p>
                  <p>
                    Tell us your destination, offer stage and main question. The free assessment is a starting conversation, not a visa decision.
                  </p>
                </div>

                <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <Link
                    to="/education/contact?service=visa"
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0B1B3A]"
                    style={{
                      backgroundColor: BRAND.pink,
                      boxShadow: "0 10px 25px rgba(255, 77, 109, 0.4)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND.pinkHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BRAND.pink)}
                  >
                    <span>Get free student visa assessment</span>
                    <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </Link>
                </div>

                <p className="mt-6 text-xs text-slate-400 font-medium">
                  For course and country planning, browse the{" "}
                  <Link
                    to="/education/destinations"
                    className="text-pink-300 underline underline-offset-2 hover:text-white transition-colors"
                  >
                    study destinations directory
                  </Link>
                  .
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
