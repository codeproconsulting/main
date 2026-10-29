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
  MessageSquare,
  Sparkles,
  Users,
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

const CANONICAL_URL = "https://proconsulting.uk/education/services/interview-prep";
const TITLE = "Interview Preparation | ProConsulting";
const DESCRIPTION =
  "Practise explaining your real study plans with ProConsulting. Prepare for university or student visa interviews through mock questions and focused feedback.";

const INTERVIEW_PREP_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://proconsulting.uk/education/services/interview-prep#service",
      "name": "Interview Preparation",
      "url": "https://proconsulting.uk/education/services/interview-prep",
      "serviceType": "Interview Preparation",
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
          "name": "Interview Preparation",
          "item": "https://proconsulting.uk/education/services/interview-prep"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Do you prepare students for university and visa interviews?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our published service covers both. Preparation should follow your actual invitation, destination and circumstances, because the conversations have different purposes."
          }
        },
        {
          "@type": "Question",
          "name": "Will you give me answers to memorise?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The aim is to help you explain your own situation. An example can show structure, but it should not become a copied story or a false claim."
          }
        },
        {
          "@type": "Question",
          "name": "Can you guarantee that I will pass?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. The institution or relevant authority makes its own decision. A mock interview cannot predict or guarantee an outcome."
          }
        },
        {
          "@type": "Question",
          "name": "What if I get nervous during follow-up questions?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Tell us which part of the conversation causes difficulty. Mock questions and focused feedback can help you practise that moment without promising a result."
          }
        },
        {
          "@type": "Question",
          "name": "What if I do not know an answer about my course?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Treat that as a gap to resolve, not a line to invent. Check the course information and return to practice with an explanation you understand."
          }
        },
        {
          "@type": "Question",
          "name": "Does a session include visa application review?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Interview practice and application review are different services. Explain what you need in the free assessment and confirm the scope before booking further support."
          }
        },
        {
          "@type": "Question",
          "name": "How much does preparation cost?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The initial assessment is free. Confirm session scope, availability and charges before booking paid preparation. No fixed session package is promised on this page."
          }
        }
      ]
    }
  ]
};

export function meta() {
  const pathname = "/education/services/interview-prep";
  return [
    { title: TITLE },
    { name: "description", content: DESCRIPTION },
    ...pageMeta({ title: TITLE, description: DESCRIPTION, pathname }),
    {
      "script:ld+json": INTERVIEW_PREP_SCHEMA,
    },
  ];
}

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export default function InterviewPreparation() {
  // S03 Walkthrough interactive view: "view1" | "view2" | "view3"
  const [activeWalkthroughView, setActiveWalkthroughView] = useState<
    "view1" | "view2" | "view3"
  >("view1");

  // S06 Stage cards interactive hover/focus state
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);

  // Active section for scrollspy
  const [activeSection, setActiveSection] = useState<string>("interview-type");

  const navItems = [
    { id: "interview-type", label: "Prepare for the right conversation", short: "Interview Type" },
    { id: "answer-demo", label: "A specific answer starts with a real reason", short: "Answer Walkthrough" },
    { id: "course-reasons", label: "Know what you are choosing", short: "Course Reasons" },
    { id: "funding-explanation", label: "Understand the plan you will describe", short: "Funding Plan" },
    { id: "practice", label: "Use feedback to improve the next attempt", short: "Feedback Stages" },
    { id: "comparison", label: "Replace a script with understanding", short: "Method Comparison" },
    { id: "confidence", label: "Practise the difficult follow-up", short: "Difficult Follow-ups" },
    { id: "boundaries", label: "The strongest answer is still your own", short: "Authentic Answers" },
    { id: "faq", label: "Questions about interview preparation", short: "FAQ" },
    { id: "next-step", label: "Bring the question that keeps catching you out", short: "Next Step" },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(INTERVIEW_PREP_SCHEMA) }}
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
              Interview Preparation
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Narrow Left Copy */}
            <div className="lg:col-span-7">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-xs text-xs font-semibold text-[#0B1B3A] mb-6">
                <span className="w-2 h-2 rounded-full bg-[#FF4D6D] animate-pulse" />
                <span className="tracking-wide uppercase text-[11px] text-slate-600 font-bold">
                  Mock Sessions · Credibility Practice
                </span>
              </div>

              {/* Single H1 */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-[#0B1B3A] tracking-tight leading-[1.12]">
                Interview Preparation
              </h1>

              <div className="mt-4 flex items-center gap-2">
                <div className="w-12 h-1 rounded-full bg-[#FF4D6D]" />
                <div className="w-3 h-1 rounded-full bg-slate-300" />
              </div>

              {/* Verified Text Blocks verbatim from Part 1 */}
              <p className="mt-6 text-xl sm:text-2xl font-bold text-[#0B1B3A] leading-snug">
                You know your plans. Can you explain them when the question changes?
              </p>

              <div className="mt-4 space-y-3.5 text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
                <p>
                  A memorised answer can fall apart under a simple follow-up. ProConsulting helps you practise explaining your real course choice, background and study plans in your own words.
                </p>
                <p>
                  Prepare for the interview you actually face, whether it concerns university admission or a student visa.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4">
                <Link
                  to="/education/contact?service=interview-prep"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl text-sm sm:text-base font-bold text-white shadow-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] focus:ring-offset-2"
                  style={{
                    backgroundColor: BRAND.pink,
                    boxShadow: "0 10px 25px -4px rgba(255, 77, 109, 0.38)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND.pinkHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BRAND.pink)}
                >
                  <span>Get free interview preparation assessment</span>
                  <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </Link>

                <a
                  href="#answer-demo"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm sm:text-base font-semibold text-[#0B1B3A] bg-white border border-slate-300/80 hover:bg-slate-50 hover:border-slate-400/80 shadow-xs transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#0B1B3A] focus:ring-offset-2"
                >
                  <span>Try the answer walkthrough</span>
                  <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" aria-hidden="true" />
                </a>
              </div>

              {/* Verified Hero Labels as stylish feature tags */}
              <div className="mt-10 pt-8 border-t border-slate-200/80">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    "Mock interviews.",
                    "Focused feedback.",
                    "Practice linked to your course and circumstances.",
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
                      Practice Framework
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Credibility First
                  </span>
                </div>

                <svg
                  viewBox="0 0 360 280"
                  className="w-full h-auto select-none"
                  aria-label="Relationship between mock interviews, focused feedback, and tailored practice"
                  role="img"
                >
                  <defs>
                    <linearGradient id="prepGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="100%" stopColor="#F8FAFC" />
                    </linearGradient>
                    <linearGradient id="prepGradActive" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFF1F3" />
                      <stop offset="100%" stopColor="#FFFFFF" />
                    </linearGradient>
                    <filter id="prepCardShadow" x="-10%" y="-10%" width="120%" height="130%">
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

                  {/* Node 1: Mock interviews */}
                  <g transform="translate(30, 20)" filter="url(#prepCardShadow)">
                    <rect
                      x="0"
                      y="0"
                      width="300"
                      height="50"
                      rx="25"
                      fill="url(#prepGrad1)"
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
                      Mock interviews
                    </text>
                  </g>

                  {/* Node 2: Focused feedback (Highlighted centerpiece) */}
                  <g transform="translate(30, 110)" filter="url(#prepCardShadow)">
                    <rect
                      x="0"
                      y="0"
                      width="300"
                      height="56"
                      rx="28"
                      fill="url(#prepGradActive)"
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
                      Focused feedback
                    </text>
                  </g>

                  {/* Node 3: Practice linked to your course and circumstances */}
                  <g transform="translate(30, 208)" filter="url(#prepCardShadow)">
                    <rect
                      x="0"
                      y="0"
                      width="300"
                      height="50"
                      rx="25"
                      fill="url(#prepGrad1)"
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
                      Practice linked to your course
                    </text>
                    <text
                      x="165"
                      y="40"
                      textAnchor="middle"
                      fill={BRAND.navy}
                      fontFamily="Inter, sans-serif"
                      fontSize="11"
                      fontWeight="700"
                    >
                      and circumstances
                    </text>
                  </g>
                </svg>

                <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D]" />
                    Conversational spontaneity
                  </span>
                  <span className="text-slate-400">No scripted reciting</span>
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
                  Interview preparation & practice guide
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
                    Free Profile Evaluation
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Practise answering common admissions or visa questions.
                  </p>
                </div>

                <Link
                  to="/education/contact?service=interview-prep"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-white shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
                  style={{ backgroundColor: BRAND.pink }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND.pinkHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BRAND.pink)}
                >
                  <span>Get free interview preparation assessment</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </aside>

          {/* 8-col Right Content Sections */}
          <main className="lg:col-span-8 space-y-14 md:space-y-18">
            {/* S02: Prepare for the right conversation */}
            <section
              id="interview-type"
              className="scroll-mt-28 bg-white rounded-3xl p-7 sm:p-10 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#0B1B3A] mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#FFF1F3] text-[#FF4D6D] flex items-center justify-center">
                  <Compass className="w-4 h-4" aria-hidden="true" />
                </div>
                <span>Interview Types</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight leading-snug">
                Prepare for the right conversation
              </h2>
              <div className="mt-3 w-14 h-1 rounded-full bg-[#FF4D6D]" />

              <div className="mt-7 space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                <p>
                  A university interview and an immigration interview do not serve the same purpose. Start with who invited you and what the invitation says.
                </p>
                <p>
                  An admissions discussion may explore your subject interests or experience. A student visa interview may examine your study plans and the information in your application.
                </p>
                <p className="font-medium text-slate-700">
                  We tailor preparation to your interview type and destination. Practice should help you explain your situation, not give you someone else's story.
                </p>
              </div>
            </section>

            {/* S03: A specific answer starts with a real reason */}
            <section
              id="answer-demo"
              className="scroll-mt-28 bg-white rounded-3xl p-7 sm:p-10 border border-slate-200/90 shadow-sm"
            >
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#0B1B3A] mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#FFF1F3] text-[#FF4D6D] flex items-center justify-center">
                  <Scale className="w-4 h-4" aria-hidden="true" />
                </div>
                <span>Answer Walkthrough</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight leading-snug">
                A specific answer starts with a real reason
              </h2>
              <div className="mt-3 w-14 h-1 rounded-full bg-[#FF4D6D]" />

              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>Illustrative practice example. This is an invented learning scenario, not a real applicant answer or a script to copy.</span>
              </div>

              {/* The Central Question Box */}
              <div className="mt-7 p-5 rounded-2xl bg-[#0B1B3A] text-white shadow-md">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-pink-300 block mb-1">
                  Mock Interview Prompt
                </span>
                <div className="text-base sm:text-lg font-extrabold">
                  Question: Why did you choose this course?
                </div>
              </div>

              {/* Walkthrough Controls / Switcher */}
              <div
                className="mt-6 rounded-2xl border-2 border-slate-200/80 p-6 bg-slate-50/60 shadow-xs"
                role="region"
                aria-label="Answer Walkthrough View Switcher"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0B1B3A]">
                    Choose a view: General answer / Evidence-led explanation / Follow-up practice.
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveWalkthroughView("view1")}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF4D6D] hover:underline cursor-pointer focus:outline-none"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset practice</span>
                  </button>
                </div>

                {/* Switcher Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    aria-pressed={activeWalkthroughView === "view1"}
                    onClick={() => setActiveWalkthroughView("view1")}
                    className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] cursor-pointer ${
                      activeWalkthroughView === "view1"
                        ? "bg-[#0B1B3A] text-white shadow-md scale-[1.01]"
                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    View 1: General answer
                  </button>

                  <button
                    type="button"
                    aria-pressed={activeWalkthroughView === "view2"}
                    onClick={() => setActiveWalkthroughView("view2")}
                    className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] cursor-pointer ${
                      activeWalkthroughView === "view2"
                        ? "bg-[#0B1B3A] text-white shadow-md scale-[1.01]"
                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    View 2: Evidence-led explanation
                  </button>

                  <button
                    type="button"
                    aria-pressed={activeWalkthroughView === "view3"}
                    onClick={() => setActiveWalkthroughView("view3")}
                    className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] cursor-pointer ${
                      activeWalkthroughView === "view3"
                        ? "bg-[#0B1B3A] text-white shadow-md scale-[1.01]"
                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    View 3: Follow-up practice
                  </button>
                </div>

                {/* Displaying Current View (verbatim text & feedback) */}
                <div className="mt-6 space-y-4">
                  {activeWalkthroughView === "view1" && (
                    <div className="space-y-4">
                      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          View 1: General answer.
                        </div>
                        <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                          I chose it because the university is famous and the course has good opportunities.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-[#FFF1F3] border border-[#FFE4E8]">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#0B1B3A] mb-1.5 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#FF4D6D]" />
                          Feedback:
                        </div>
                        <p className="text-sm sm:text-base text-[#0B1B3A] font-medium leading-relaxed">
                          This does not explain the course itself. A follow-up could ask which part of the study interests you.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeWalkthroughView === "view2" && (
                    <div className="space-y-4">
                      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2">
                          View 2: Evidence-led explanation.
                        </div>
                        <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                          I want to build on my previous computing study. I would explain which verified modules match that goal and why they matter to me.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-[#FFF1F3] border border-[#FFE4E8]">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#0B1B3A] mb-1.5 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#FF4D6D]" />
                          Feedback:
                        </div>
                        <p className="text-sm sm:text-base text-[#0B1B3A] font-medium leading-relaxed">
                          The next step is personal detail. Name only modules you have checked and can discuss honestly.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeWalkthroughView === "view3" && (
                    <div className="space-y-4">
                      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#0B1B3A] mb-2">
                          View 3: Follow-up practice.
                        </div>
                        <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-bold">
                          Which module interests you, and how does it connect to your previous work?
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-[#FFF1F3] border border-[#FFE4E8]">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#0B1B3A] mb-1.5 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#FF4D6D]" />
                          Feedback:
                        </div>
                        <p className="text-sm sm:text-base text-[#0B1B3A] font-medium leading-relaxed">
                          Use your real experience. If you do not know a detail, check it before practising again.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* SSR Screen-reader Fallback */}
                <div className="sr-only">
                  <p>View 1: General answer. I chose it because the university is famous and the course has good opportunities. Feedback: This does not explain the course itself. A follow-up could ask which part of the study interests you.</p>
                  <p>View 2: Evidence-led explanation. I want to build on my previous computing study. I would explain which verified modules match that goal and why they matter to me. Feedback: The next step is personal detail. Name only modules you have checked and can discuss honestly.</p>
                  <p>View 3: Follow-up practice. Which module interests you, and how does it connect to your previous work? Feedback: Use your real experience. If you do not know a detail, check it before practising again.</p>
                </div>

                {/* Status indicator and reset practice note verbatim */}
                <div className="mt-5 pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
                  <span>Status: Practice example. There is no pass score or approval prediction.</span>
                  <span>Reset practice: Return to the general answer.</span>
                </div>
              </div>
            </section>

            {/* S04: Know what you are choosing */}
            <section
              id="course-reasons"
              className="scroll-mt-28 bg-white rounded-3xl p-7 sm:p-10 border border-slate-200/90 shadow-sm"
            >
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#0B1B3A] mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#FFF1F3] text-[#FF4D6D] flex items-center justify-center">
                  <BookOpen className="w-4 h-4" aria-hidden="true" />
                </div>
                <span>Course Clarity</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight leading-snug">
                Know what you are choosing
              </h2>
              <div className="mt-3 w-14 h-1 rounded-full bg-[#FF4D6D]" />

              <div className="mt-7 space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                <p>
                  You do not need a grand speech about your future. You do need to understand the course you have selected.
                </p>
                <p>
                  Review what you will study, where the course takes place and how it relates to your background. If the subject is new to you, explain the reason for that change honestly.
                </p>
                <p>
                  Think beyond an overseas job. What useful skills could you bring to a role or further study back home?
                </p>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-sm sm:text-base font-semibold">
                  For a regulated profession, do not confuse a course offer with permission to practise. Recognition needs its own check.
                </div>
              </div>
            </section>

            {/* S05: Understand the plan you will describe */}
            <section
              id="funding-explanation"
              className="scroll-mt-28 bg-white rounded-3xl p-7 sm:p-10 border border-slate-200/90 shadow-sm"
            >
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#0B1B3A] mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#FFF1F3] text-[#FF4D6D] flex items-center justify-center">
                  <FileCheck className="w-4 h-4" aria-hidden="true" />
                </div>
                <span>Funding Explanation</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight leading-snug">
                Understand the plan you will describe
              </h2>
              <div className="mt-3 w-14 h-1 rounded-full bg-[#FF4D6D]" />

              <div className="mt-7 space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                <p>
                  A confident tone cannot fix an unclear funding plan. Know who will pay, what the main costs are and what information supports that explanation.
                </p>
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-sm sm:text-base font-medium">
                  Do not describe a possible scholarship as an award you already hold. Do not rely on expected part-time work as guaranteed funding.
                </div>
                <p className="font-medium text-slate-700">
                  An interview answer should agree with your actual circumstances and submitted information. If there is a difference, raise it before practising a smoother version.
                </p>
              </div>
            </section>

            {/* S06: Use feedback to improve the next attempt */}
            <section
              id="practice"
              className="scroll-mt-28 bg-white rounded-3xl p-7 sm:p-10 border border-slate-200/90 shadow-sm"
            >
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#0B1B3A] mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#FFF1F3] text-[#FF4D6D] flex items-center justify-center">
                  <Layers className="w-4 h-4" aria-hidden="true" />
                </div>
                <span>Feedback Stages</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight leading-snug">
                Use feedback to improve the next attempt
              </h2>
              <div className="mt-3 w-14 h-1 rounded-full bg-[#FF4D6D]" />

              <div className="mt-7 space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                <p>
                  Our published preparation service includes mock interviews and written or verbal feedback. We focus practice on your interview type and the areas you find difficult.
                </p>
              </div>

              {/* Interactive Stage Cards */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  {
                    stage: "Stage 01",
                    text: "Set the context. Explain the interview invitation, course and preparation concerns.",
                  },
                  {
                    stage: "Stage 02",
                    text: "Practise a realistic conversation. Answer questions and respond to follow-ups.",
                  },
                  {
                    stage: "Stage 03",
                    text: "Review the gaps. Identify answers that are vague, unclear or unsupported.",
                  },
                  {
                    stage: "Stage 04",
                    text: "Practise again with a purpose. Work on those gaps without memorising a false story.",
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
                The useful question is not whether an answer sounds impressive. It is whether you understand it and can explain it naturally.
              </div>
            </section>

            {/* S07: Replace a script with understanding */}
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
                Replace a script with understanding
              </h2>
              <div className="mt-3 w-14 h-1 rounded-full bg-[#FF4D6D]" />

              {/* Two-Column Process Comparison */}
              <div className="mt-8 space-y-6">
                {/* Comparison Pair 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl bg-slate-100/70 border border-slate-200/90 relative">
                    <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600 mb-2.5">
                      Script-led practice
                    </span>
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                      Learn one polished answer for each expected question.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FFF1F3] to-white border border-[#FFE4E8] shadow-xs relative">
                    <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#FF4D6D] text-white mb-2.5">
                      Purposeful practice
                    </span>
                    <p className="text-sm sm:text-base text-[#0B1B3A] font-bold leading-relaxed">
                      Understand your reasons so you can handle a differently worded question.
                    </p>
                  </div>
                </div>

                {/* Comparison Pair 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl bg-slate-100/70 border border-slate-200/90 relative">
                    <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600 mb-2.5">
                      Script-led practice
                    </span>
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                      Use a model funding story because it sounds convincing.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FFF1F3] to-white border border-[#FFE4E8] shadow-xs relative">
                    <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#FF4D6D] text-white mb-2.5">
                      Purposeful practice
                    </span>
                    <p className="text-sm sm:text-base text-[#0B1B3A] font-bold leading-relaxed">
                      Explain your real funding arrangements and resolve anything unclear.
                    </p>
                  </div>
                </div>

                {/* Comparison Pair 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl bg-slate-100/70 border border-slate-200/90 relative">
                    <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600 mb-2.5">
                      Script-led practice
                    </span>
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                      Hide a study gap behind a rehearsed excuse.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FFF1F3] to-white border border-[#FFE4E8] shadow-xs relative">
                    <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#FF4D6D] text-white mb-2.5">
                      Purposeful practice
                    </span>
                    <p className="text-sm sm:text-base text-[#0B1B3A] font-bold leading-relaxed">
                      Explain the actual timeline and the reason for your next step.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500 font-medium">
                This is a comparison of practice methods, not evidence of an interview result.
              </div>
            </section>

            {/* S08: Practise the difficult follow-up */}
            <section
              id="confidence"
              className="scroll-mt-28 bg-white rounded-3xl p-7 sm:p-10 border border-slate-200/90 shadow-sm"
            >
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#0B1B3A] mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#FFF1F3] text-[#FF4D6D] flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" aria-hidden="true" />
                </div>
                <span>Handling Uncertainty</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight leading-snug">
                Practise the difficult follow-up
              </h2>
              <div className="mt-3 w-14 h-1 rounded-full bg-[#FF4D6D]" />

              <div className="mt-7 space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                <p>
                  You may speak comfortably until someone asks why you changed subjects. Or you may understand the course but rush when discussing money.
                </p>
                <p>
                  Bring that specific concern to the assessment. Focused practice is more useful than repeating answers you already know.
                </p>
                <p>
                  We can help with clear communication and the structure of an explanation. We cannot promise which questions will appear or how an interviewer will respond.
                </p>
                <p className="pt-2">
                  If your main barrier is an English test requirement, explore{" "}
                  <Link
                    to="/education/services/test-prep"
                    className="text-[#0B1B3A] font-bold underline decoration-[#FF4D6D] underline-offset-4 hover:text-[#FF4D6D] transition-colors"
                  >
                    English test preparation
                  </Link>
                  . An interview session is not a substitute for an accepted test result.
                </p>
              </div>
            </section>

            {/* S09: The strongest answer is still your own */}
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
                The strongest answer is still your own
              </h2>
              <div className="mt-3 w-14 h-1 rounded-full bg-[#FF4D6D]" />

              <div className="mt-7 space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                <p>
                  Interview preparation should never invent experience, hide relevant history or teach you to mislead an institution or authority.
                </p>
                <p>
                  A mock session is practice, not an official assessment. We do not offer secret interview questions or a guaranteed pass.
                </p>
                <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                  <p className="font-bold text-[#0B1B3A] text-base">
                    No consultant can guarantee a scholarship, admission or visa, and we do not.
                  </p>
                </div>
                <p className="pt-2">
                  If the underlying application needs attention, see{" "}
                  <Link
                    to="/education/services/admission"
                    className="text-[#0B1B3A] font-bold underline decoration-[#FF4D6D] underline-offset-4 hover:text-[#FF4D6D] transition-colors"
                  >
                    admission guidance
                  </Link>{" "}
                  or{" "}
                  <Link
                    to="/education/services/visa"
                    className="text-[#0B1B3A] font-bold underline decoration-[#FF4D6D] underline-offset-4 hover:text-[#FF4D6D] transition-colors"
                  >
                    student visa support
                  </Link>
                  .
                </p>
              </div>
            </section>

            {/* S10: Questions about interview preparation (FAQ) */}
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
                Questions about interview preparation
              </h2>
              <div className="mt-3 w-14 h-1 rounded-full bg-[#FF4D6D]" />

              <div className="mt-8 space-y-4">
                {[
                  {
                    q: "Do you prepare students for university and visa interviews?",
                    a: "Our published service covers both. Preparation should follow your actual invitation, destination and circumstances, because the conversations have different purposes.",
                  },
                  {
                    q: "Will you give me answers to memorise?",
                    a: "The aim is to help you explain your own situation. An example can show structure, but it should not become a copied story or a false claim.",
                  },
                  {
                    q: "Can you guarantee that I will pass?",
                    a: "No. The institution or relevant authority makes its own decision. A mock interview cannot predict or guarantee an outcome.",
                  },
                  {
                    q: "What if I get nervous during follow-up questions?",
                    a: "Tell us which part of the conversation causes difficulty. Mock questions and focused feedback can help you practise that moment without promising a result.",
                  },
                  {
                    q: "What if I do not know an answer about my course?",
                    a: "Treat that as a gap to resolve, not a line to invent. Check the course information and return to practice with an explanation you understand.",
                  },
                  {
                    q: "Does a session include visa application review?",
                    a: "Interview practice and application review are different services. Explain what you need in the free assessment and confirm the scope before booking further support.",
                  },
                  {
                    q: "How much does preparation cost?",
                    a: "The initial assessment is free. Confirm session scope, availability and charges before booking paid preparation. No fixed session package is promised on this page.",
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

            {/* S11: Bring the question that keeps catching you out (Closing Navy Panel) */}
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
                  Bring the question that keeps catching you out
                </h2>
                <div className="mt-3 w-14 h-1 rounded-full bg-[#FF4D6D]" />

                <div className="mt-6 space-y-3.5 text-slate-200 text-base sm:text-lg leading-relaxed">
                  <p>
                    You do not have to arrive with perfect answers. Tell us what interview you face and where you lose confidence.
                  </p>
                  <p>
                    Start with a free assessment, then discuss whether focused mock practice fits your needs. Your own reasons are the material we work with.
                  </p>
                </div>

                <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <Link
                    to="/education/contact?service=interview-prep"
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0B1B3A]"
                    style={{
                      backgroundColor: BRAND.pink,
                      boxShadow: "0 10px 25px rgba(255, 77, 109, 0.4)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND.pinkHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BRAND.pink)}
                  >
                    <span>Get free interview preparation assessment</span>
                    <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </Link>
                </div>

                <p className="mt-6 text-xs text-slate-400 font-medium">
                  Prepare to have a conversation, rather than recite a page.
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
