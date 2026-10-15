"use client";

import { useState } from "react";
import { Link } from "react-router";
import { Navbar } from "../components/ui/Navbar";
import { Footer } from "../components/ui/Footer";
import {
  FaLocationDot,
  FaPhone,
  FaEnvelope,
  FaWhatsapp,
  FaCheck,
  FaClock,
  FaArrowRightLong,
  FaChevronDown,
  FaHeadphones,
  FaBookOpen,
  FaPenNib,
  FaComments,
  FaLightbulb,
  FaUsers,
  FaBuilding,
  FaXmark,
  FaCircleCheck,
  FaStar,
  FaQuoteLeft,
  FaGraduationCap,
  FaBriefcase,
  FaShieldHalved,
  FaChartSimple,
} from "react-icons/fa6";
import { BRAND, CONTACT } from "../lib/constants";
import { pageMeta, canonicalLink } from "../lib/seo";

const TITLE = "IELTS Preparation in Islamabad | PRO Consulting Academy I-8 Markaz";
const DESCRIPTION =
  "Looking for IELTS preparation in Islamabad? PRO Consulting is an IELTS preparation academy in Islamabad offering Academic, General Training & UKVI courses with mock tests, personal feedback, and free level check.";
const PATHNAME = "/service-locations/ielts-preparation-in-islamabad";

export function meta() {
  return [
    { title: TITLE },
    { name: "description", content: DESCRIPTION },
    ...pageMeta({ title: TITLE, description: DESCRIPTION, pathname: PATHNAME }),
  ];
}

export function links() {
  return canonicalLink(PATHNAME);
}

const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3320.5944979431342!2d73.07194787619261!3d33.66766743793821!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x650559946b3fe6c5%3A0x1579db6227ef7c40!2sPro%20Consulting!5e0!3m2!1sen!2s!4v1772273412763!5m2!1sen!2s";

function CircularGauge({
  value,
  percent,
  color,
}: {
  value: string;
  percent: number;
  color: string;
}) {
  const size = 58;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#F1F5F9"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-extrabold text-[#0B1B3A]">
        {value}
      </span>
    </div>
  );
}

const MODULES = [
  {
    id: "listening",
    letter: "L",
    title: "Listening",
    durationText: "MINUTES + 10 TO TRANSFER ANSWERS",
    durationColor: "text-[#E11D48]",
    description: "Practice across varied accents and audio types to capture specific information and details without hesitation.",
    minutes: "30",
    percent: 75,
    gaugeColor: "#E11D48",
    badgeBg: "bg-pink-100 text-[#E11D48]",
    activeClass: "border-2 border-[#E11D48] bg-rose-50/20 shadow-[0_12px_32px_rgba(225,29,72,0.18)]",
  },
  {
    id: "reading",
    letter: "R",
    title: "Reading",
    durationText: "MINUTES",
    durationColor: "text-slate-400",
    description: "Techniques for rapid text scanning, locating key evidence, and handling complex academic passages under time.",
    minutes: "60",
    percent: 100,
    gaugeColor: "#2563EB",
    badgeBg: "bg-blue-100 text-blue-600",
    activeClass: "border-2 border-blue-600 bg-blue-50/20 shadow-[0_12px_32px_rgba(37,99,235,0.18)]",
  },
  {
    id: "writing",
    letter: "W",
    title: "Writing",
    durationText: "MINUTES, 2 TASKS",
    durationColor: "text-slate-400",
    description: "Structure high-scoring reports and argumentative essays with cohesive paragraphs, vocabulary, and grammar accuracy.",
    minutes: "60",
    percent: 100,
    gaugeColor: "#7C3AED",
    badgeBg: "bg-purple-100 text-[#7C3AED]",
    activeClass: "border-2 border-[#7C3AED] bg-purple-50/25 shadow-[0_14px_36px_rgba(124,58,237,0.22)]",
  },
  {
    id: "speaking",
    letter: "S",
    title: "Speaking",
    durationText: "MINUTES, FACE TO FACE",
    durationColor: "text-slate-400",
    description: "Direct one-on-one speaking drills with instant corrections to build fluency, natural pronunciation, and confidence.",
    minutes: "11-14",
    percent: 25,
    gaugeColor: "#059669",
    badgeBg: "bg-emerald-100 text-emerald-600",
    activeClass: "border-2 border-emerald-600 bg-emerald-50/20 shadow-[0_12px_32px_rgba(5,150,105,0.18)]",
  },
];

export default function IslamabadIeltsPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    targetBand: "7.0",
    classType: "In-Person (I-8 Markaz, Islamabad)",
    notes: "",
  });

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Lead");
    }
  };

  const WHATSAPP_LINK =
    "https://wa.me/923701902128?text=" +
    encodeURIComponent(
      "Hi PRO Consulting Islamabad, I would like to book a Free Level Check and inquire about your IELTS course at I-8 Markaz."
    );

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-800">
      <Navbar />

      <main className="flex-grow">
        {/* ================= HERO SECTION (Page 1) ================= */}
        <section className="relative overflow-hidden bg-[#0B1B3A] text-white pt-12 pb-16 md:pt-16 md:pb-24 border-b border-slate-800">
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"
            aria-hidden
          />

          <div className="relative max-w-7xl mx-auto px-6">
            {/* Breadcrumb matching website standard */}
            <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span aria-hidden>/</span>
              <Link to="/service-locations" className="hover:text-white transition-colors">Service Locations</Link>
              <span aria-hidden>/</span>
              <span className="text-[#FF4D6D] font-medium">Islamabad Campus</span>
            </nav>

            <div className="max-w-4xl">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.15]">
                IELTS Preparation <br className="hidden sm:inline" />
                <span style={{ color: BRAND.pink }}>in Islamabad</span>
              </h1>
              <div className="mt-3 w-16 h-1 rounded-full" style={{ backgroundColor: BRAND.pink }} />

              <p className="mt-6 text-slate-200 text-lg md:text-xl leading-relaxed font-normal">
                Looking for IELTS preparation in Islamabad? PRO Consulting is an IELTS preparation academy in Islamabad that helps you reach the band score your university and visa need.
              </p>
              <p className="mt-3 text-slate-300 text-base md:text-lg leading-relaxed">
                Our IELTS course in Islamabad Pakistan is built around your target score and your timeline. Join in person or online, in a group or one-on-one.
              </p>

              {/* 5 Highlight Pills from Page 1 */}
              <div className="flex flex-wrap gap-2.5 sm:gap-3 mt-8 mb-10">
                {[
                  "Level check",
                  "Target score plan",
                  "Mock tests",
                  "Writing & speaking feedback",
                  "Online & in person",
                ].map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-xs sm:text-sm font-semibold text-white transition-all shadow-sm"
                  >
                    <FaCheck className="w-3.5 h-3.5 shrink-0" style={{ color: BRAND.pink }} />
                    <span>{item}</span>
                  </span>
                ))}
              </div>

              {/* CTAs matching website standard */}
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                <a
                  href="#book-level-check"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm md:text-base font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{ backgroundColor: BRAND.pink }}
                >
                  <span>Book a Free Level Check</span>
                  <FaArrowRightLong className="w-4 h-4" />
                </a>

                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-sm md:text-base font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-md"
                >
                  <FaWhatsapp className="w-5 h-5 text-white" />
                  <span>WhatsApp Us</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ================= THE BASICS: WHAT IS IELTS? (Page 1) ================= */}
        <section className="py-16 md:py-24 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl mb-12">
              <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B1B3A] tracking-tight">
                What Is IELTS?
              </h2>
              <div className="mt-2.5 w-14 h-1 rounded-full bg-[#E11D48]" />
              <p className="mt-5 text-slate-600 text-base md:text-lg leading-relaxed">
                The International English Language Testing System (IELTS) is one of the most widely accepted English tests in the world. You need it for university admission, student visas, work and immigration, mainly in the UK, Australia, Canada and other English-speaking countries.
              </p>
            </div>

            {/* 4 Interactive Module Cards matching screenshot */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
              onMouseLeave={() => setActiveModule(null)}
            >
              {MODULES.map((mod, idx) => {
                const isActive = activeModule === idx;
                return (
                  <div
                    key={mod.id}
                    onMouseEnter={() => setActiveModule(idx)}
                    onMouseLeave={() => setActiveModule(null)}
                    className={`cursor-pointer rounded-3xl p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between ${
                      isActive
                        ? `${mod.activeClass} -translate-y-1.5`
                        : "border-2 border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-md"
                    }`}
                  >
                    <div>
                      {/* Top Row: Badge Letter + Circular Gauge Ring */}
                      <div className="flex items-center justify-between mb-5">
                        <div
                          className={`w-9 h-9 rounded-xl font-extrabold text-sm flex items-center justify-center ${mod.badgeBg}`}
                        >
                          {mod.letter}
                        </div>
                        <CircularGauge
                          value={mod.minutes}
                          percent={mod.percent}
                          color={mod.gaugeColor}
                        />
                      </div>

                      {/* Title & Subtitle */}
                      <h3 className="text-xl font-bold text-[#0B1B3A] mb-1">{mod.title}</h3>
                      <p className={`text-[11px] font-bold tracking-wider uppercase mb-4 ${mod.durationColor}`}>
                        {mod.durationText}
                      </p>

                      {/* Description */}
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {mod.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom 4-Column Strip matching screenshot */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-slate-200">
                {/* 1. Academic */}
                <div className="flex items-start gap-3.5 lg:pr-6">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0 border border-pink-100">
                    <FaGraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0B1B3A]">IELTS Academic</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">For university and college study.</p>
                  </div>
                </div>

                {/* 2. General Training */}
                <div className="flex items-start gap-3.5 lg:px-6">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0 border border-pink-100">
                    <FaBriefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0B1B3A]">IELTS General Training</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">For work and migration.</p>
                  </div>
                </div>

                {/* 3. Band score 0 to 9 with stepped visualizer */}
                <div className="flex items-start gap-3.5 lg:px-6">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0 border border-pink-100">
                    <FaChartSimple className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0B1B3A]">Band score 0 to 9</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">One overall band, plus a score for each skill.</p>
                    {/* Stepped Band Bars (matches screenshot) */}
                    <div className="flex items-end gap-1 mt-2.5">
                      <span className="w-2.5 h-1 rounded-sm bg-pink-100" />
                      <span className="w-2.5 h-1.5 rounded-sm bg-pink-200" />
                      <span className="w-2.5 h-2 rounded-sm bg-pink-200" />
                      <span className="w-2.5 h-2.5 rounded-sm bg-pink-300" />
                      <span className="w-2.5 h-3 rounded-sm bg-pink-300" />
                      <span className="w-2.5 h-3.5 rounded-sm bg-pink-400" />
                      <span className="w-2.5 h-4 rounded-sm bg-pink-400" />
                      <span className="w-2.5 h-4.5 rounded-sm bg-pink-500" />
                      <span className="w-2.5 h-5 rounded-sm bg-[#E11D48]" />
                    </div>
                  </div>
                </div>

                {/* 4. UKVI IELTS */}
                <div className="flex items-start gap-3.5 lg:pl-6">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0 border border-pink-100">
                    <FaShieldHalved className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0B1B3A]">UKVI IELTS</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Needed for some UK visa categories.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= INSPIRATIONAL CALLOUT (Page 2) ================= */}
        <section className="py-16 md:py-20 bg-[#0B1B3A] text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <FaQuoteLeft className="w-10 h-10 mx-auto mb-6 opacity-30 text-[#FF4D6D]" />
            <h2 className="text-2xl md:text-4xl font-bold mb-6 tracking-tight">
              IELTS Is Your Key to Unlocking the World
            </h2>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-6">
              One test score can open the door to universities in the UK, Canada, Australia and beyond. With the right IELTS preparation in Islamabad Pakistan, you walk into the exam knowing the format, the timing and the marking, instead of guessing.
            </p>
            <p className="text-xl md:text-2xl font-bold text-white" style={{ color: BRAND.pink }}>
              That is the difference between hoping for your band score and planning for it.
            </p>
          </div>
        </section>

        {/* ================= WHY US (Page 2) ================= */}
        <section className="py-16 md:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: BRAND.pink }}>
                WHY US
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1B3A] tracking-tight">
                Why Choose PRO Consulting Islamabad?
              </h2>
              <div className="mt-2 w-16 h-1 rounded-full mx-auto" style={{ backgroundColor: BRAND.pink }} />
              <p className="mt-5 text-slate-600 text-base md:text-lg leading-relaxed">
                Students searching for the best IELTS preparation institute in Islamabad usually want three things: a clear plan, real exam practice and honest feedback. That is exactly how we run our IELTS course in Islamabad.
              </p>
            </div>

            {/* 6 Feature Cards matching WhyChooseUs styling */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  id: "01",
                  title: "Target-score plan",
                  description: "We check your university and visa requirement first, then plan backwards from it.",
                  icon: FaLightbulb,
                },
                {
                  id: "02",
                  title: "All 4 skills",
                  description: "Structured practice for Listening, Reading, Writing and Speaking.",
                  icon: FaBookOpen,
                },
                {
                  id: "03",
                  title: "Real mock tests",
                  description: "Timed practice under exam conditions, so test day feels familiar.",
                  icon: FaClock,
                },
                {
                  id: "04",
                  title: "Personal feedback",
                  description: "Clear tips on your writing and speaking, so you know what to fix.",
                  icon: FaComments,
                },
                {
                  id: "05",
                  title: "Flexible classes",
                  description: "Group or one-on-one, in person at I-8 Markaz or online.",
                  icon: FaUsers,
                },
                {
                  id: "06",
                  title: "One team",
                  description: "IELTS academy in Islamabad, admissions and visa guidance under one roof.",
                  icon: FaBuilding,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-white p-7 md:p-8 hover:border-[#FF4D6D]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white"
                          style={{ backgroundColor: BRAND.pink }}
                        >
                          <Icon className="w-7 h-7" />
                        </div>
                        <span className="text-sm font-bold tabular-nums" style={{ color: BRAND.pink }}>
                          {item.id}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-[#0B1B3A] mb-2">{item.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS (Page 2) ================= */}
        <section className="py-16 md:py-24 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: BRAND.pink }}>
                HOW IT WORKS
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1B3A] tracking-tight">
                Your Path to Your Target Band
              </h2>
              <div className="mt-2 w-16 h-1 rounded-full mx-auto" style={{ backgroundColor: BRAND.pink }} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: "1",
                  title: "Level check",
                  desc: "We find your strengths and weak areas.",
                },
                {
                  step: "2",
                  title: "Set target",
                  desc: "We match your band to your university or visa.",
                },
                {
                  step: "3",
                  title: "Practice",
                  desc: "Skill sessions, practice tests and feedback.",
                },
                {
                  step: "4",
                  title: "Final mock",
                  desc: "Last mock test and test-day tips.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 p-7 hover:bg-white hover:shadow-lg transition-all"
                >
                  <div
                    className="w-12 h-12 rounded-xl text-white font-extrabold text-lg flex items-center justify-center mb-5 shadow-sm"
                    style={{ backgroundColor: BRAND.pink }}
                  >
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-[#0B1B3A] mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= PROBLEMS WE SOLVE: PROBLEM VS SOLUTION (Page 3) ================= */}
        <section className="py-16 md:py-24 bg-slate-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: BRAND.pink }}>
                PROBLEMS WE SOLVE
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1B3A] tracking-tight">
                Problem vs Solution
              </h2>
              <div className="mt-2 w-16 h-1 rounded-full mx-auto" style={{ backgroundColor: BRAND.pink }} />
              <p className="mt-4 text-slate-600 text-base md:text-lg">
                Most students struggle with the same few things. Here is how we fix them.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  problem: "You don't know what band score you need",
                  solution: "We check your university and visa and set a clear target",
                },
                {
                  problem: "You're not sure about your current level",
                  solution: "A level check shows your strengths and weak areas",
                },
                {
                  problem: "Writing and Speaking are hard to improve alone",
                  solution: "Regular feedback with practical correction tips",
                },
                {
                  problem: "You run out of time in Reading or Listening",
                  solution: "Timed drills and a strategy for each question type",
                },
                {
                  problem: "Self-study feels random",
                  solution: "A structured plan that fits your timeline",
                },
                {
                  problem: "Test day makes you nervous",
                  solution: "A final mock test and test-day tips",
                },
              ].map((pair, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Problem */}
                  <div className="flex-1 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      ✕
                    </span>
                    <div>
                      <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block">
                        The Problem
                      </span>
                      <p className="text-slate-800 font-semibold text-base mt-0.5">
                        {pair.problem}
                      </p>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center justify-center text-slate-400 px-3">
                    <FaArrowRightLong className="w-4 h-4 text-slate-400" />
                  </div>

                  {/* Solution */}
                  <div className="flex-1 flex items-start gap-3 bg-emerald-50/70 p-4 rounded-xl border border-emerald-100">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      ✓
                    </span>
                    <div>
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                        Our Solution
                      </span>
                      <p className="text-emerald-950 font-semibold text-base mt-0.5">
                        {pair.solution}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= BEFORE AND AFTER (Page 3) ================= */}
        <section className="py-16 md:py-24 bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: BRAND.pink }}>
                YOUR PROGRESS
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1B3A] tracking-tight">
                Before and After
              </h2>
              <div className="mt-2 w-16 h-1 rounded-full mx-auto" style={{ backgroundColor: BRAND.pink }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Before */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                  <h3 className="text-2xl font-bold text-slate-800">Before</h3>
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                    Without Structure
                  </span>
                </div>

                <ul className="space-y-4">
                  {[
                    "Unsure about the exam format",
                    "No clear target score",
                    "Weak, unstructured writing",
                    "Hesitant when speaking",
                    "Poor time management",
                    "Stressed about booking the test",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-slate-600 text-base">
                      <FaXmark className="w-4 h-4 text-rose-500 shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* After */}
              <div className="rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-b from-emerald-50/40 to-white p-8 shadow-xl">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-emerald-100">
                  <h3 className="text-2xl font-bold text-[#0B1B3A]">After PRO Consulting</h3>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                    Prepared & Confident
                  </span>
                </div>

                <ul className="space-y-4">
                  {[
                    "Confident with every module",
                    "A target linked to your admission or visa",
                    "Clear essay and letter structure",
                    "Fluent, organised speaking answers",
                    "Finishing each section on time",
                    "Ready to book your test",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[#0B1B3A] text-base font-semibold">
                      <FaCircleCheck className="text-emerald-600 w-4 h-4 shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ================= WHAT WE DELIVER (Page 4) ================= */}
        <section className="py-16 md:py-24 bg-slate-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: BRAND.pink }}>
                INCLUDED
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1B3A] tracking-tight">
                What We Deliver
              </h2>
              <div className="mt-2 w-16 h-1 rounded-full mx-auto" style={{ backgroundColor: BRAND.pink }} />
              <p className="mt-4 text-slate-600 text-base md:text-lg">
                Everything you get when you join our IELTS course in Islamabad.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {[
                "Level check and target-score discussion",
                "A structured course or coaching plan",
                "Skill sessions for all four modules",
                "Regular practice tests and timed practice",
                "Writing and speaking feedback",
                "Final mock test and test-day guidance",
                "Group or one-on-one classes, online or in person",
              ].map((item, idx) => (
                <div
                  key={item}
                  className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4 ${
                    idx === 6 ? "md:col-span-2" : ""
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: BRAND.pink }}
                  >
                    <FaCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[#0B1B3A] text-base font-bold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= WHAT YOU'LL MASTER (Page 4) ================= */}
        <section className="py-16 md:py-24 bg-white border-y border-slate-200">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: BRAND.pink }}>
                SKILLS
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1B3A] tracking-tight">
                What You'll Master
              </h2>
              <div className="mt-2 w-16 h-1 rounded-full mx-auto" style={{ backgroundColor: BRAND.pink }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-6">
              {/* Listening */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-7">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                    style={{ backgroundColor: BRAND.pink }}
                  >
                    <FaHeadphones className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0B1B3A]">Listening</h3>
                </div>
                <ul className="space-y-2.5 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: BRAND.pink }} />
                    Understand different accents
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: BRAND.pink }} />
                    Catch key details
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: BRAND.pink }} />
                    Avoid common traps
                  </li>
                </ul>
              </div>

              {/* Reading */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-7">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white bg-blue-600">
                    <FaBookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0B1B3A]">Reading</h3>
                </div>
                <ul className="space-y-2.5 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    Skim and scan fast
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    True / False / Not Given
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    Matching headings
                  </li>
                </ul>
              </div>

              {/* Writing */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-7">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white bg-purple-600">
                    <FaPenNib className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0B1B3A]">Writing</h3>
                </div>
                <ul className="space-y-2.5 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                    Task 1: graphs, charts, letters
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                    Task 2: essays with strong structure
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                    Better vocabulary and grammar
                  </li>
                </ul>
              </div>

              {/* Speaking */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-7">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white bg-emerald-600">
                    <FaComments className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0B1B3A]">Speaking</h3>
                </div>
                <ul className="space-y-2.5 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    Fluency and pronunciation
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    Confident answers in all 3 parts
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    Organised ideas under pressure
                  </li>
                </ul>
              </div>
            </div>

            {/* Exam Strategy Banner */}
            <div className="max-w-4xl mx-auto rounded-2xl border border-slate-200 bg-[#0B1B3A] text-white p-7 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest block mb-1" style={{ color: BRAND.pink }}>
                  Bonus Exam Guidance
                </span>
                <h4 className="text-xl font-bold text-white">Exam strategy</h4>
                <p className="text-slate-300 text-sm mt-1">
                  Time management, avoiding common mistakes, and staying calm on test day.
                </p>
              </div>
              <a
                href="#book-level-check"
                className="px-6 py-3 rounded-full font-bold text-white text-xs whitespace-nowrap transition-transform hover:scale-105"
                style={{ backgroundColor: BRAND.pink }}
              >
                Join Next Batch
              </a>
            </div>
          </div>
        </section>

        {/* ================= FREQUENTLY ASKED QUESTIONS (Page 5) ================= */}
        <section className="py-16 md:py-24 bg-slate-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: BRAND.pink }}>
                QUESTIONS
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1B3A] tracking-tight">
                Frequently Asked Questions
              </h2>
              <div className="mt-2 w-16 h-1 rounded-full mx-auto" style={{ backgroundColor: BRAND.pink }} />
              <p className="mt-4 text-slate-600 text-base">
                Quick answers to what students ask us most.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "Which is the best IELTS preparation institute in Islamabad?",
                  a: "The best institute is the one that fits your target score, schedule and learning style. At PRO Consulting we offer a free level check and a personalised plan, so you can judge for yourself before you commit.",
                },
                {
                  q: "How long is the IELTS course in Islamabad?",
                  a: "It depends on your current level and your target band. After the level check, we design a plan that fits your timeline.",
                },
                {
                  q: "Should I take IELTS Academic or General Training?",
                  a: "Academic is usually needed for university admission. General Training is mainly for work and migration. We help you confirm which one your university or visa needs, including whether you need UKVI IELTS.",
                },
                {
                  q: "Do you offer online IELTS classes?",
                  a: "Yes. You can join online or in person at our I-8 Markaz, Islamabad office, in a group or one-on-one.",
                },
                {
                  q: "Will I get mock tests and feedback?",
                  a: "Yes. You get regular practice tests, timed mock tests, and feedback on your writing and speaking, so you can see exactly where to improve.",
                },
              ].map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all duration-200"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-bold text-[#0B1B3A] text-base md:text-lg hover:text-[#FF4D6D] transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <span style={{ color: BRAND.pink }} className="font-extrabold text-sm">
                          Q{index + 1}.
                        </span>
                        {faq.q}
                      </span>
                      <FaChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        style={isOpen ? { color: BRAND.pink } : undefined}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 pt-1 text-slate-600 text-sm md:text-base leading-relaxed border-t border-slate-100 bg-slate-50/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= FINAL CTA & REGISTRATION (Page 5) ================= */}
        <section id="book-level-check" className="py-16 md:py-24 bg-[#0B1B3A] text-white relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full inline-block mb-3" style={{ backgroundColor: `${BRAND.pink}30`, color: BRAND.pink }}>
                GET STARTED
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                Ready to reach your target band score?
              </h2>
              <div className="mt-2 w-16 h-1 rounded-full mx-auto" style={{ backgroundColor: BRAND.pink }} />
              <p className="mt-4 text-slate-300 text-base md:text-lg">
                Get a free level check and a personalised study plan from the IELTS preparation academy in Islamabad that plans around your goals.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Registration Form */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-7 md:p-10 text-slate-900 shadow-2xl">
                <h3 className="text-2xl font-bold text-[#0B1B3A] mb-2">
                  Book Your Free Level Check
                </h3>
                <p className="text-slate-600 text-sm mb-6">
                  Fill in your details below and our Islamabad academic instructor will contact you.
                </p>

                {formSubmitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                      ✓
                    </div>
                    <h4 className="text-xl font-bold text-emerald-900 mb-2">Registration Received!</h4>
                    <p className="text-emerald-800 text-sm mb-5">
                      Thank you, {formData.name || "Student"}. Our academic team at I-8 Markaz Islamabad will connect with you shortly.
                    </p>
                    <a
                      href={WHATSAPP_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-colors"
                    >
                      <FaWhatsapp className="w-4 h-4" />
                      <span>Chat Immediately on WhatsApp</span>
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D] outline-none text-sm transition"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          WhatsApp / Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="0300 1234567"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D] outline-none text-sm transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Target Band Score
                        </label>
                        <select
                          value={formData.targetBand}
                          onChange={(e) => setFormData({ ...formData, targetBand: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D] outline-none text-sm bg-white transition"
                        >
                          <option value="6.0">Band 6.0</option>
                          <option value="6.5">Band 6.5</option>
                          <option value="7.0">Band 7.0</option>
                          <option value="7.5">Band 7.5</option>
                          <option value="8.0+">Band 8.0+</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Class Mode
                      </label>
                      <select
                        value={formData.classType}
                        onChange={(e) => setFormData({ ...formData, classType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D] outline-none text-sm bg-white transition"
                      >
                        <option value="In-Person (I-8 Markaz, Islamabad)">
                          In-Person Classes (I-8 Markaz, Islamabad)
                        </option>
                        <option value="Online Classes (Live)">
                          Online Classes (Live Interactive)
                        </option>
                        <option value="1-on-1 Personalized Coaching">
                          1-on-1 Personalized Coaching
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Requirements or Questions (Optional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Tell us about your visa or university deadline..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D] outline-none text-sm transition"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-full font-bold text-white text-base transition-transform hover:scale-[1.01] shadow-lg mt-2"
                      style={{ backgroundColor: BRAND.pink }}
                    >
                      Get Free Consultation
                    </button>
                  </form>
                )}
              </div>

              {/* Office Details & Map (Page 5) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-7 border border-white/15">
                  <span className="text-xs font-bold uppercase tracking-widest block mb-1" style={{ color: BRAND.pink }}>
                    Islamabad Academy
                  </span>
                  <h4 className="text-2xl font-bold text-white mb-4">Visit Our Center</h4>

                  <div className="space-y-4 text-sm text-slate-200 mb-6">
                    <div className="flex items-start gap-3">
                      <FaLocationDot className="w-5 h-5 shrink-0 mt-0.5" style={{ color: BRAND.pink }} />
                      <div>
                        <strong className="block text-white font-semibold">Address:</strong>
                        <span>Vista Building, 2nd Floor, Office 203-204, I-8 Markaz, Islamabad, Pakistan</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaPhone className="w-4 h-4 shrink-0" style={{ color: BRAND.pink }} />
                      <span>(051) 6135834 &nbsp;|&nbsp; +92 370 1902128</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaPhone className="w-4 h-4 shrink-0" style={{ color: BRAND.pink }} />
                      <span>UK: +44 7432 406993</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaEnvelope className="w-4 h-4 shrink-0" style={{ color: BRAND.pink }} />
                      <span>contact@proconsulting.uk</span>
                    </div>
                  </div>

                  <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors shadow-md"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                    <span>Instant WhatsApp Message</span>
                  </a>
                </div>

                {/* Google Maps Embed */}
                <div className="rounded-3xl overflow-hidden border border-white/15 shadow-xl h-64 bg-slate-900">
                  <iframe
                    title="PRO Consulting Islamabad Office Map"
                    src={MAP_EMBED_URL}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
