"use client";

import { useState } from "react";
import { Link } from "react-router";
import { Navbar } from "~/education/components/ui/Navbar";
import { Footer } from "~/education/components/ui/footer";
import {
  FaArrowRightLong,
  FaCheck,
  FaEnvelope,
  FaComments,
  FaPenNib,
  FaGraduationCap,
  FaLocationDot,
  FaClock,
  FaBookOpen,
  FaPhone,
  FaWhatsapp,
  FaBuilding,
  FaCircleCheck,
  FaChevronDown,
  FaLightbulb,
  FaUsers,
  FaAward,
  FaShieldHalved,
  FaHeadphones,
  FaChartSimple,
} from "react-icons/fa6";
import { canonicalLink } from "../lib/seo";

const TITLE = "TOEFL preparation in Islamabad | ProConsulting";
const DESCRIPTION =
  "Ask about TOEFL preparation in Islamabad. Discuss current test tasks, English practice, coaching availability and your course requirement with ProConsulting.";
const PATHNAME = "/service-locations/islamabad/toefl-preparation-in-islamabad";
const CANONICAL_URL = `https://proconsulting.uk/service-locations/toefl-preparation-in-islamabad`;

export function meta() {
  return [
    { title: TITLE },
    { name: "description", content: DESCRIPTION },
    { name: "robots", content: "noindex, nofollow" },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "ProConsulting" },
    { property: "og:title", content: "TOEFL preparation in Islamabad" },
    {
      property: "og:description",
      content:
        "Check your materials and discuss preparation for the current TOEFL iBT tasks.",
    },
    { property: "og:url", content: CANONICAL_URL },
    { property: "og:locale", content: "en_GB" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "TOEFL preparation in Islamabad" },
    {
      name: "twitter:description",
      content:
        "Check your materials and discuss preparation for the current TOEFL iBT tasks.",
    },
  ];
}

export function links() {
  return canonicalLink(PATHNAME);
}

const FAQ_ITEMS = [
  {
    q: "Does ProConsulting offer TOEFL preparation in Islamabad?",
    a: "TOEFL is listed within ProConsulting's English test preparation service. Ask the team about current Islamabad sessions, online options and coaching for the current format.",
  },
  {
    q: "Can I use older TOEFL preparation materials?",
    a: "Some language practice may still help, but older materials can describe different tasks. Check their format against current ETS guidance before relying on them for test practice.",
  },
  {
    q: "What score should I aim for?",
    a: "Check your institution's stated requirement, including any section conditions. Ask how it interprets current TOEFL results if its published guidance is unclear. Do not rely on a friend's target.",
  },
  {
    q: "What will the preparation cost?",
    a: "Ask for the current fee and what it covers. Confirm teaching hours, group or individual sessions, practice arrangements and any separate test-booking costs before paying.",
  },
  {
    q: "Is TOEFL preparation the same as university interview coaching?",
    a: "No. TOEFL preparation develops responses for an English test. University or visa interview coaching concerns a different conversation and should be discussed separately.",
  },
  {
    q: "Can you guarantee the result I need?",
    a: "No test score is guaranteed. No consultant can guarantee a scholarship, admission or visa, and we do not.",
  },
];

const GUIDE_ITEMS = [
  {
    id: "s02",
    label: "Start with your requirement, then check your materials",
  },
  {
    id: "practice-example",
    label: "Try one change that makes an email more useful",
  },
  {
    id: "s06",
    label: "Choose coaching you can keep attending",
  },
  {
    id: "s07",
    label: "Questions before you start",
  },
];

export default function ToeflPreparationInIslamabadPage() {
  const [selectedFocus, setSelectedFocus] = useState<"clarity" | "contribution">("clarity");
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setActiveFaq((prev) => (prev === idx ? null : idx));
  };

  const jsonLdGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://proconsulting.uk/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Service Locations",
            item: "https://proconsulting.uk/service-locations",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Islamabad",
            item: "https://proconsulting.uk/service-locations/islamabad",
          },
          {
            "@type": "ListItem",
            position: 4,
            name: "TOEFL preparation in Islamabad",
            item: CANONICAL_URL,
          },
        ],
      },
      {
        "@type": "Service",
        "@id": `${CANONICAL_URL}#service`,
        name: "TOEFL preparation in Islamabad",
        description: DESCRIPTION,
        serviceType: "test-prep",
        areaServed: {
          "@type": "City",
          name: "Islamabad",
        },
        provider: {
          "@type": "Organization",
          "@id": "https://proconsulting.uk/#organization",
          name: "ProConsulting",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-[#0B1B3A]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />

      <Navbar />

      <main className="flex-grow">
        {/* ================= SECTION 01: HERO (Navy Surface with Full Modern Styling) ================= */}
        <section className="relative overflow-hidden bg-[#0B1B3A] text-white pt-12 pb-16 md:pt-16 md:pb-24 border-b border-slate-800">
          {/* Subtle Grid + Radial Glow */}
          <div
            className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"
            aria-hidden
          />
          <div className="absolute top-1/4 right-10 w-96 h-96 bg-[#FF4D6D]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-6">
            {/* Breadcrumb matching website standard */}
            <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span aria-hidden>/</span>
              <Link to="/service-locations" className="hover:text-white transition-colors">
                Service Locations
              </Link>
              <span aria-hidden>/</span>
              <Link to="/service-locations/islamabad" className="hover:text-white transition-colors">
                Islamabad
              </Link>
              <span aria-hidden>/</span>
              <span className="text-[#FF4D6D] font-medium">TOEFL preparation</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Column: Public Copy S01 */}
              <div className="lg:col-span-7">
                <span className="text-xs font-bold uppercase tracking-widest text-[#FF4D6D] bg-white/10 px-3.5 py-1.5 rounded-full inline-block mb-3 border border-white/10">
                  Current TOEFL iBT Format
                </span>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
                  TOEFL preparation <br className="hidden sm:inline" />
                  <span className="text-[#FF4D6D]">in Islamabad</span>
                </h1>
                <div className="mt-3 w-16 h-1 rounded-full bg-[#FF4D6D]" />

                <h2 className="mt-6 text-xl sm:text-2xl font-semibold text-slate-100 tracking-tight leading-snug">
                  Make sure your practice matches the test you will take
                </h2>

                <p className="mt-4 text-slate-300 text-base md:text-lg leading-relaxed">
                  An old practice pack can leave you preparing for the wrong tasks. Before spending weeks on it, check the current TOEFL iBT format.
                </p>

                <p className="mt-3 text-slate-300 text-base md:text-lg leading-relaxed">
                  ProConsulting offers TOEFL preparation through its English test preparation service. Discuss your course requirement, current English level and the practice you have already tried.
                </p>

                <p className="mt-3 text-slate-300 text-base md:text-lg leading-relaxed">
                  Ask about coaching in Islamabad or online. Build a study routine around the skills and tasks you need now.
                </p>

                {/* Highlight Pills */}
                <div className="flex flex-wrap gap-2.5 sm:gap-3 mt-6 mb-8">
                  {[
                    "Current iBT Format",
                    "Email Task Practice",
                    "Spoken Interview Prep",
                    "I-8 Markaz or Online",
                  ].map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs sm:text-sm font-medium text-white shadow-sm"
                    >
                      <FaCheck className="w-3 h-3 text-[#FF4D6D]" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                  <Link
                    to="/education/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm md:text-base font-bold text-white bg-[#FF4D6D] hover:bg-[#ff3358] transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] min-h-[48px]"
                  >
                    <span>Ask about TOEFL preparation</span>
                    <FaArrowRightLong className="w-4 h-4 shrink-0" />
                  </Link>

                  <a
                    href="#practice-example"
                    className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-sm md:text-base font-semibold text-white border border-white/30 hover:bg-white/10 transition-all min-h-[48px]"
                  >
                    <span>Explore a practice example</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Hero Visual Feature Box */}
              <div className="lg:col-span-5">
                <div className="rounded-3xl border border-white/15 bg-white/5 backdrop-blur-md p-6 sm:p-8 shadow-2xl space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] block mb-1">
                        Official Curriculum
                      </span>
                      <h3 className="text-lg font-bold text-white">Current Task Structure</h3>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-[#FF4D6D]">
                      <FaGraduationCap className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    <div className="p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-3 text-white font-semibold text-sm mb-1.5">
                        <span className="w-8 h-8 rounded-lg bg-pink-500/20 text-[#FF4D6D] flex items-center justify-center">
                          <FaPenNib className="w-4 h-4" />
                        </span>
                        <span>Current Writing Tasks</span>
                      </div>
                      <p className="text-xs text-slate-300 pl-11 leading-relaxed">
                        Sentence building, email writing, and contributing to academic discussions.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-3 text-white font-semibold text-sm mb-1.5">
                        <span className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center">
                          <FaComments className="w-4 h-4" />
                        </span>
                        <span>Current Speaking Tasks</span>
                      </div>
                      <p className="text-xs text-slate-300 pl-11 leading-relaxed">
                        Listening and repeating, and taking an interview under exam timing.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-3 text-white font-semibold text-sm mb-1.5">
                        <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                          <FaLocationDot className="w-4 h-4" />
                        </span>
                        <span>Campus Location</span>
                      </div>
                      <p className="text-xs text-slate-300 pl-11 leading-relaxed">
                        I-8 Markaz executive classrooms or structured online delivery.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <FaCircleCheck className="text-[#FF4D6D] w-3.5 h-3.5" />
                      <span>Individual & Group</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FaCircleCheck className="text-[#FF4D6D] w-3.5 h-3.5" />
                      <span>Score Planning</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 02: GUIDE + S02 MAIN CONTENT ================= */}
        <section id="s02" className="py-16 md:py-24 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Sticky Guide Aside */}
              <aside className="lg:col-span-4 lg:sticky lg:top-24">
                <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 sm:p-7 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#FF4D6D] block mb-3">
                    Page Navigation
                  </span>
                  <nav aria-label="Page Sections" className="flex flex-col gap-2">
                    {GUIDE_ITEMS.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="text-left px-4 py-3 rounded-2xl text-sm font-semibold text-[#0B1B3A] bg-white border border-slate-200/80 hover:border-[#FF4D6D] hover:text-[#FF4D6D] transition-all shadow-xs flex items-center justify-between"
                      >
                        <span className="truncate pr-2">{item.label}</span>
                        <FaArrowRightLong className="w-3.5 h-3.5 text-[#FF4D6D] shrink-0" />
                      </a>
                    ))}
                  </nav>

                  <div className="mt-6 pt-5 border-t border-slate-200">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Need Assistance?
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Discuss your university requirements with our test counselors in I-8 Markaz.
                    </p>
                    <Link
                      to="/education/contact"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#FF4D6D] hover:underline"
                    >
                      <span>Book Free Consultation</span>
                      <FaArrowRightLong className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </aside>

              {/* S02 Main Panel */}
              <div className="lg:col-span-8">
                <div className="bg-slate-50/50 rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#FF4D6D] bg-pink-50 px-3.5 py-1.5 rounded-full inline-block mb-3">
                    Verification First
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight mb-4">
                    Start with your requirement, then check your materials
                  </h2>
                  <div className="w-16 h-1 rounded-full bg-[#FF4D6D] mb-6" />

                  <div className="space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed">
                    <p>
                      Your chosen institution decides which tests and results it accepts. Confirm the required test, scores and any conditions before paying for a booking.
                    </p>
                    <p>
                      TOEFL iBT has changed. Current Writing tasks include building sentences, writing an email and contributing to an academic discussion. Speaking includes listening and repeating, and taking an interview.
                    </p>
                    <p>
                      A resource can carry the TOEFL name and still describe an older format. Compare its tasks with the current ETS guidance before using it as your main preparation plan.
                    </p>
                    <p>
                      Any separate visa requirement also needs checking for your actual route. Test preparation does not establish eligibility for admission or a visa.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 03: CLARITY & RESPONSE ================= */}
        <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Public Text */}
              <div className="lg:col-span-7">
                <span className="text-xs font-bold uppercase tracking-widest text-[#FF4D6D] bg-pink-50 px-3.5 py-1.5 rounded-full inline-block mb-3">
                  Applied Skills
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight mb-4">
                  Turn familiar English into a clear response
                </h2>
                <div className="w-16 h-1 rounded-full bg-[#FF4D6D] mb-6" />

                <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed">
                  Knowing vocabulary is useful. Applying it to a specific task takes practice.
                </p>

                <div className="mt-4 space-y-4 text-base sm:text-lg text-slate-600 leading-relaxed">
                  <p>
                    ProConsulting advertises structured practice across Reading, Listening, Writing and Speaking. Writing and speaking feedback can help you identify what to work on next.
                  </p>
                  <p>
                    Bring any practice materials you already use to the discussion. Ask how the proposed coaching addresses the current test rather than assuming every course does.
                  </p>
                </div>
              </div>

              {/* Right Column: 2 Modern Elevated Feature Cards */}
              <div className="lg:col-span-5 space-y-5">
                <div className="p-7 rounded-3xl border border-slate-200 bg-white shadow-md hover:shadow-xl transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#FF4D6D] flex items-center justify-center mb-4 shadow-xs">
                    <FaEnvelope className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0B1B3A] mb-2">Email Writing Clarity</h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    For an email task, you need to understand the situation and make your message clear.
                  </p>
                </div>

                <div className="p-7 rounded-3xl border border-slate-200 bg-white shadow-md hover:shadow-xl transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 shadow-xs">
                    <FaComments className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0B1B3A] mb-2">Spoken Interview Response</h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    For a spoken interview response, you need to answer the question rather than recite an unrelated speech.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 04: ORIGINAL WALKTHROUGH ASSET ================= */}
        <section id="practice-example" className="py-16 md:py-24 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <figure
              className="bg-[#0B1B3A] text-white border border-slate-800 p-8 sm:p-12 rounded-3xl shadow-2xl w-full"
              aria-labelledby="practice-example-title"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Left Side: Context & Caption */}
                <div className="lg:col-span-5">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#FF4D6D] bg-white/10 px-3.5 py-1.5 rounded-full inline-block mb-4">
                    Original Teaching Example
                  </span>
                  <h2
                    id="practice-example-title"
                    className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug"
                  >
                    Try one change that makes an email more useful
                  </h2>

                  <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                    Original teaching example. This is not an ETS question, a student's work or an official score assessment.
                  </p>

                  <figcaption className="mt-8 pt-6 border-t border-slate-800 text-xs sm:text-sm text-slate-400">
                    The revision demonstrates a teaching point. It does not predict a TOEFL score.
                  </figcaption>
                </div>

                {/* Right Side: Interactive Paper Simulation */}
                <div className="lg:col-span-7 bg-white text-[#0B1B3A] border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-xl">
                  {/* Situation Card */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF4D6D] block mb-1">
                      Task Prompt
                    </span>
                    <p className="text-sm sm:text-base text-slate-900 font-semibold leading-relaxed">
                      Situation: You cannot attend a scheduled study-group meeting. Write to the organiser and suggest another way to contribute.
                    </p>
                  </div>

                  {/* Starting Draft */}
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 mb-5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 block mb-1">
                      Initial Draft
                    </span>
                    <p className="text-sm sm:text-base text-slate-700">
                      Starting response: I cannot attend. Please tell me what to do.
                    </p>
                  </div>

                  {/* Focus Toggle */}
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-sm font-bold text-[#0B1B3A] mb-3">Choose a focus:</p>

                    <div className="flex flex-wrap gap-3 mb-4">
                      <button
                        type="button"
                        aria-pressed={selectedFocus === "clarity"}
                        onClick={() => setSelectedFocus("clarity")}
                        className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all min-h-[44px] cursor-pointer ${
                          selectedFocus === "clarity"
                            ? "bg-[#FF4D6D] text-white shadow-md"
                            : "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        Clarity
                      </button>
                      <button
                        type="button"
                        aria-pressed={selectedFocus === "contribution"}
                        onClick={() => setSelectedFocus("contribution")}
                        className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all min-h-[44px] cursor-pointer ${
                          selectedFocus === "contribution"
                            ? "bg-[#FF4D6D] text-white shadow-md"
                            : "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        Contribution
                      </button>
                    </div>

                    {/* Interactive Explanation Panel */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 min-h-[60px] flex items-center">
                      {selectedFocus === "clarity" ? (
                        <p className="text-sm sm:text-base text-[#0B1B3A]">
                          <strong className="font-bold text-[#0B1B3A]">Clarity:</strong> Explain which meeting you mean and what you are asking for.
                        </p>
                      ) : (
                        <p className="text-sm sm:text-base text-[#0B1B3A]">
                          <strong className="font-bold text-[#0B1B3A]">Contribution:</strong> Offer a practical way to help even though you cannot attend.
                        </p>
                      )}
                    </div>

                    <noscript>
                      <dl className="mt-4 space-y-2 text-sm text-[#0B1B3A]">
                        <dt className="font-bold">Clarity</dt>
                        <dd className="mb-2">Explain which meeting you mean and what you are asking for.</dd>
                        <dt className="font-bold">Contribution</dt>
                        <dd>Offer a practical way to help even though you cannot attend.</dd>
                      </dl>
                    </noscript>
                  </div>

                  {/* Revised Output */}
                  <div className="mt-5 pt-5 border-t border-slate-200 space-y-3">
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                        Revised Output
                      </span>
                      <p className="text-sm sm:text-base text-slate-900 font-semibold leading-relaxed">
                        Revised response: I cannot attend Thursday's study-group meeting. Could I send my reading notes beforehand so the group can use them?
                      </p>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 italic">
                      Practice next: Write your own response to the same situation. Keep the request clear and the contribution relevant.
                    </p>
                  </div>
                </div>
              </div>
            </figure>
          </div>
        </section>

        {/* ================= SECTION 05: GET MORE FROM EACH PRACTICE SESSION ================= */}
        <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF4D6D] bg-pink-50 px-3.5 py-1.5 rounded-full inline-block mb-3">
                Study Method
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Get more from each practice session
              </h2>
              <div className="mt-3 w-16 h-1 rounded-full bg-[#FF4D6D] mx-auto" />
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <span className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 font-bold text-sm flex items-center justify-center mb-4">
                  ✕
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Before
                </span>
                <p className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed">
                  You repeat a full exercise without knowing what needs attention.
                </p>
              </div>

              <div className="rounded-3xl border border-[#FF4D6D]/40 bg-white p-8 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-pink-50 rounded-bl-full pointer-events-none" />
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 font-bold text-sm flex items-center justify-center mb-4">
                  ✓
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] block mb-2">
                  A more useful routine
                </span>
                <p className="text-base sm:text-lg text-[#0B1B3A] font-bold leading-relaxed">
                  Review the task, identify one weakness and practise that part again. Then try a fresh response under appropriate conditions.
                </p>
              </div>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 text-slate-600 text-base sm:text-lg space-y-4 leading-relaxed">
              <p>
                The advertised service includes a level discussion, target-score planning, timed practice and feedback. Discuss which of these you need and what your coaching will include.
              </p>
              <p>
                You should know the teaching hours, practice arrangements and fees before committing. No fixed score gain or preparation time is promised here.
              </p>
            </div>
          </div>
        </section>

        {/* ================= SECTION 06: CHOOSE COACHING ================= */}
        <section id="s06" className="py-16 md:py-24 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: S06 Public Text */}
              <div className="lg:col-span-7">
                <span className="text-xs font-bold uppercase tracking-widest text-[#FF4D6D] bg-pink-50 px-3.5 py-1.5 rounded-full inline-block mb-3">
                  Campus & Online
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight mb-4">
                  Choose coaching you can keep attending
                </h2>
                <div className="w-16 h-1 rounded-full bg-[#FF4D6D] mb-6" />

                <div className="space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed">
                  <p>
                    A preparation plan only helps if you can follow it. If classes compete with university or work, discuss that before joining.
                  </p>
                  <p>
                    ProConsulting advertises group and one-to-one sessions, in person or online. Ask about current TOEFL availability and whether the teaching plan uses the current tasks.
                  </p>
                  <p>
                    The team is based in I-8 Markaz, Islamabad. Confirm the session location and timing before travelling. Online availability is something to discuss, not a promise of an immediate place.
                  </p>
                  <p>
                    If your course choice is still uncertain, start with the free assessment. A test booking should follow a checked requirement, not a guess.
                  </p>
                </div>
              </div>

              {/* Right Column: High-End Contact Box */}
              <div className="lg:col-span-5">
                <div className="p-8 sm:p-10 rounded-3xl bg-[#0B1B3A] text-white border border-slate-800 shadow-2xl space-y-6">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF4D6D]">
                    <FaLocationDot className="w-4 h-4" />
                    <span>I-8 Markaz, Islamabad</span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      Discuss TOEFL preparation arrangements
                    </h3>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      Start with a clear assessment of your current level, target requirements, and suitable schedule.
                    </p>
                  </div>

                  <div className="pt-2">
                    <Link
                      to="/education/contact"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-bold bg-[#FF4D6D] text-white hover:bg-[#ff3358] transition-all shadow-lg min-h-[48px]"
                    >
                      <span>Get a free assessment</span>
                      <FaArrowRightLong className="w-4 h-4 shrink-0" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 07: QUESTIONS BEFORE YOU START (Accordion like IELTS) ================= */}
        <section id="s07" className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF4D6D] bg-pink-50 px-3.5 py-1.5 rounded-full inline-block mb-3">
                QUESTIONS
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Questions before you start
              </h2>
              <div className="mt-3 w-16 h-1 rounded-full bg-[#FF4D6D] mx-auto" />
              <p className="mt-4 text-slate-600 text-base">
                Quick answers to common questions about TOEFL preparation in Islamabad.
              </p>
            </div>

            {/* Premium Accordion with smooth toggle */}
            <div className="space-y-4">
              {FAQ_ITEMS.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all duration-200"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-bold text-[#0B1B3A] text-base md:text-lg hover:text-[#FF4D6D] transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-[#FF4D6D] font-extrabold text-sm shrink-0">
                          Q{index + 1}.
                        </span>
                        <span>{faq.q}</span>
                      </span>
                      <FaChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-[#FF4D6D]" : ""
                        }`}
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

        {/* ================= SECTION 08: FINAL CTA ================= */}
        <section className="py-16 md:py-24 bg-[#0B1B3A] text-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <span className="text-xs font-bold uppercase tracking-widest text-[#FF4D6D] bg-white/10 px-3.5 py-1.5 rounded-full inline-block mb-3 border border-white/10">
                  Take the Next Step
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug">
                  Ask whether the preparation fits your next step
                </h2>
                <div className="mt-3 w-16 h-1 rounded-full bg-[#FF4D6D]" />

                <div className="mt-6 space-y-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                  <p>
                    Tell the team which course you are considering and whether TOEFL is required. Mention any previous test attempt and the practice you have tried.
                  </p>
                  <p>
                    Use the free assessment to start that conversation. Confirm the available coaching, current task coverage, schedule and fees before choosing a course.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-4">
                <Link
                  to="/education/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-bold bg-[#FF4D6D] text-white hover:bg-[#ff3358] transition-all shadow-lg hover:scale-[1.02] text-center min-h-[48px]"
                >
                  <span>Ask about TOEFL preparation</span>
                  <FaArrowRightLong className="w-4 h-4 shrink-0" />
                </Link>

                <Link
                  to="/education/services/test-prep"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-base font-semibold text-white border border-white/30 hover:bg-white/10 transition-all text-center min-h-[48px]"
                >
                  <span>Compare English test preparation</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
