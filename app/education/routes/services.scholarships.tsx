"use client";

import { useState } from "react";
import { Link, useFetcher } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { Navbar } from "~/education/components/ui/Navbar";
import { Footer } from "~/education/components/ui/footer";
import { pageMeta, canonicalLink } from "~/education/lib/seo";
import { saveApplicant } from "~/education/lib/applicants.server";
import {
  ArrowRight,
  CheckCircle2,
  Phone,
  MapPin,
  Mail,
  Clock,
  ShieldCheck,
  Award,
  Sparkles,
  Building,
  GraduationCap,
  Calendar,
  FileText,
  Compass,
  Check,
  ChevronDown,
  MessageSquare,
  Users,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

const BRAND = {
  navy: "#0B1B3A",
  navyLight: "#162D4D",
  pink: "#FF4D6D",
  pinkDark: "#E11D48",
};

export function meta() {
  const title =
    "International Student Scholarships for Pakistani Students — Free Check | ProConsulting";
  const description =
    "Realistic scholarship shortlists for Pakistani students: profile evaluation, award matches and a personal action plan within 1 working day. Free check — office at I-8 Markaz, Islamabad.";
  const pathname = "/education/services/scholarships";

  return [
    { title },
    { name: "description", content: description },
    ...pageMeta({ title, description, pathname }),
  ];
}

export function links() {
  return canonicalLink("/education/services/scholarships");
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const fullName = (formData.get("fullName") as string) || "";
    const phone = (formData.get("phone") as string) || "";
    const currentEducation = (formData.get("currentLevel") as string) || "";
    const majorSubject = (formData.get("fieldOfStudy") as string) || "";
    const targetCountry = (formData.get("targetCountry") as string) || "";
    const targetIntake = (formData.get("nextIntake") as string) || "";
    const budgetRange = (formData.get("budgetRange") as string) || "";
    const message = (formData.get("message") as string) || "";

    const saved = saveApplicant({
      fullName,
      email: "",
      phone,
      city: "Islamabad / Pakistan",
      currentEducation,
      majorSubject,
      gradeScore: "",
      passingYear: "",
      targetCountry,
      targetDegree: currentEducation,
      targetIntake,
      budgetRange,
      needScholarship: "Yes - 100% Scholarship Check",
      englishTest: "",
      hasRefusal: "No",
      studyGap: "None",
      notes: `Scholarship Lander Inquiry: [Field: ${majorSubject}] [Intake: ${targetIntake}] [Budget: ${budgetRange}] Message: ${message}`,
    });

    return { success: true, applicantId: saved.id };
  } catch (error) {
    console.error("Scholarship action error:", error);
    return { success: false, error: "Failed to submit request" };
  }
}

export default function ScholarshipsServicePage() {
  const fetcher = useFetcher<{ success: boolean; applicantId?: string; error?: string }>();
  const isSubmitting = fetcher.state === "submitting";
  const isSuccess = fetcher.data?.success;

  // Form State
  const [currentLevel, setCurrentLevel] = useState("BS");
  const [targetCountry, setTargetCountry] = useState("UK");
  const [nextIntake, setNextIntake] = useState("2027 Fall");
  const [budgetRange, setBudgetRange] = useState("Under £10k");

  const scrollToForm = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const formElement = document.getElementById("scholarship-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const levelOptions = ["BS", "MS", "PhD", "A-levels", "Other"];
  const countryOptions = [
    "UK",
    "Europe",
    "New Zealand",
    "Canada",
    "Australia",
    "USA",
    "Not sure",
  ];
  const intakeOptions = ["2027 Spring", "2027 Fall", "2028", "Not sure"];
  const budgetOptions = [
    "Under £8k",
    "£8k – £12k",
    "£12k – £18k",
    "Need 100% coverage",
    "Flexible",
  ];

  // Schema.org Graph
  const jsonLdData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": "https://proconsulting.uk/#organization",
        name: "ProConsulting",
        url: "https://proconsulting.uk",
        logo: "https://proconsulting.uk/logo.png",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Vista Building, 2nd Floor, Office 203-204, I-8 Markaz",
          addressLocality: "Islamabad",
          addressRegion: "Federal",
          postalCode: "44000",
          addressCountry: "PK",
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+92 51 6135834",
            contactType: "customer service",
            areaServed: "PK",
            availableLanguage: ["English", "Urdu"],
          },
          {
            "@type": "ContactPoint",
            telephone: "+44 7432 406993",
            contactType: "customer service",
            areaServed: "GB",
            availableLanguage: ["English"],
          },
        ],
      },
      {
        "@type": "Service",
        "@id": "https://proconsulting.uk/education/services/scholarships#service",
        name: "International Student Scholarship Advisory",
        serviceType: "Scholarship Consultation and Application Support",
        provider: {
          "@id": "https://proconsulting.uk/#organization",
        },
        areaServed: {
          "@type": "Country",
          name: "Pakistan",
        },
        url: "https://proconsulting.uk/education/services/scholarships",
        description:
          "Realistic scholarship shortlists for Pakistani students: profile evaluation, award matches and a personal action plan within 1 working day.",
      },
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
            name: "Education",
            item: "https://proconsulting.uk/education",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Services",
            item: "https://proconsulting.uk/education/services",
          },
          {
            "@type": "ListItem",
            position: 4,
            name: "Scholarships",
            item: "https://proconsulting.uk/education/services/scholarships",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Can I get an international student scholarship?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Many students with a completed or ongoing degree have options — partial awards and university merit awards far more often than fully funded ones. Your free check shows which awards fit you and gives an honest answer on your chances.",
            },
          },
          {
            "@type": "Question",
            name: "Do I have to pay after the free check?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. The evaluation, shortlist and action plan are yours to keep. Paid services are optional and explained in writing before you commit.",
            },
          },
          {
            "@type": "Question",
            name: "Can you guarantee a scholarship or visa?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. No consultant can, and anyone who does is selling you something. We build a strong application, choose realistic targets and give you a view of your chances you can plan around.",
            },
          },
          {
            "@type": "Question",
            name: "When should I start?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "As early as possible. Many scholarship deadlines close months before the intake they fund. A student starting 9–12 months before their intake is in the comfortable zone; under 4 months, fully funded awards are usually out of reach — and we will tell you that in the free check.",
            },
          },
          {
            "@type": "Question",
            name: "What if I am not eligible for a scholarship?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We tell you plainly, then suggest other options: merit awards, a different intake, a different university mix, or funding that doesn't require a competition at all.",
            },
          },
          {
            "@type": "Question",
            name: "How much do your paid services cost?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "One fixed number for the scope, confirmed in writing before you commit. It varies by level (BS/MS/PhD) and stages you want help with. You will never discover a new fee mid-process — if the scope changes, the number is re-agreed before work continues.",
            },
          },
          {
            "@type": "Question",
            name: "We already lost money with a consultancy that promised guarantees. Why trust you?",
            acceptedAnswer: {
              "@type": "Answer",
              text: 'Start where everyone should start: with us that\'s the free check, no payment. Visit the office in I-8 Markaz — it\'s a building with a doorbell. Ask about a student case similar to yours. And the sentence on this page — "no consultant can guarantee a scholarship, admission or visa" — is us, in writing, refusing to sell you the thing others sell.',
            },
          },
          {
            "@type": "Question",
            name: "Can't I do this myself using official websites?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes — and for one or two awards many students should. The official pages are free. Where we earn our fee is fit (right awards, right deadlines), documents (statements that survive reading) and timeline management. Plenty of students run part of the process themselves and bring us only the parts they don't trust themselves with.",
            },
          },
          {
            "@type": "Question",
            name: "What documents should I have ready for the free check?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Transcripts or mark sheets, degree (or expected graduation), passport page if you have one, an English score if taken, and a plain-language line about what you want to study and what your family can realistically fund. Ten minutes.",
            },
          },
          {
            "@type": "Question",
            name: "Do scholarships cover living costs?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Fully funded awards may cover tuition, living costs and travel. Partial scholarships and merit awards usually reduce tuition only. Your plan needs a realistic number for what you still pay — that gap is part of the free check, because a scholarship you can't survive on is not a win.",
            },
          },
          {
            "@type": "Question",
            name: "Can I apply without IELTS?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Some awards and universities accept a medium-of-instruction certificate in place of IELTS; others are strict. Rules vary by university, by course, by intake — and they change. Never rely on last year's answer; never rely on ours without checking that cycle's official page.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <Navbar />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      <main className="min-h-screen bg-white text-slate-800">
        {/* =========================================================================
            SECTION 1 — HERO
            Layout: light hero. Eyebrow, H1 (2 lines max), sub-paragraph,
            4 trust bullets, dual CTAs, 4 stat number-tiles under CTAs.
           ========================================================================= */}
        <section className="relative border-b border-slate-200/80 bg-gradient-to-b from-slate-50/90 via-slate-50/50 to-white pt-10 pb-16 md:pt-14 md:pb-20">
          <div className="max-w-7xl mx-auto px-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-[#0B1B3A] transition-colors">Home</Link>
              <span aria-hidden>/</span>
              <Link to="/education" className="hover:text-[#0B1B3A] transition-colors">Education</Link>
              <span aria-hidden>/</span>
              <Link to="/education/services" className="hover:text-[#0B1B3A] transition-colors">Services</Link>
              <span aria-hidden>/</span>
              <span className="text-[#0B1B3A] font-semibold">Scholarships</span>
            </nav>

            <div className="max-w-4xl">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200/70 text-slate-700 text-xs font-semibold tracking-wider uppercase mb-5">
                <span className="w-2 h-2 rounded-full bg-[#FF4D6D]" />
                PROCONSULTING · I-8 MARKAZ, ISLAMABAD · UK +44 LINE OPEN
              </div>

              {/* H1 */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0B1B3A] tracking-tight leading-[1.15] mb-6">
                International Student Scholarships for Pakistani Students
              </h1>

              {/* Sub-paragraph */}
              <p className="text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mb-8">
                Find scholarships that match your academic profile. We check your grades, degree and budget, show you the awards you can realistically win, and help you apply before the deadline closes. Evaluation first — fees only if you choose paid help.
              </p>

              {/* 4 Trust bullets (chips) */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-10">
                {[
                  "Free assessment",
                  "Honest advice, no guarantees sold",
                  "Office at I-8 Markaz — walk in",
                  "Online or in person",
                ].map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white border border-slate-200 text-slate-700 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#FF4D6D] shrink-0" />
                    {chip}
                  </span>
                ))}
              </div>

              {/* Dual CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12">
                <button
                  onClick={scrollToForm}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-4 text-base font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  style={{
                    backgroundColor: BRAND.pink,
                    boxShadow: "0 8px 24px rgba(255, 77, 109, 0.35)",
                  }}
                >
                  Get My Free Scholarship Check
                  <ArrowRight className="w-5 h-5" />
                </button>

                <a
                  href="https://wa.me/923701902123?text=Hi%20ProConsulting%2C%20I%20would%20like%20to%20get%20a%20free%20scholarship%20check."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-bold text-[#0B1B3A] bg-slate-100 hover:bg-slate-200/80 border border-slate-300/80 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  WhatsApp Us
                </a>
              </div>

              {/* 4 Stat number-tiles under CTAs */}
              <div className="pt-8 border-t border-slate-200/80">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                  {[
                    { num: "2,000+", label: "assessments done" },
                    { num: "500+", label: "student visas granted" },
                    { num: "700+", label: "cases completed" },
                    { num: "250+", label: "universities placed at" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm"
                    >
                      <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight">
                        {stat.num}
                      </div>
                      <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-3 font-medium">
                  Figures as published on proconsulting.uk.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2 — THE BIG TYPE (chain under hero, H2 — never replaces H1)
            Layout: oversized split lines, generous whitespace, tinted background.
           ========================================================================= */}
        <section className="py-16 md:py-24 bg-slate-100/70 border-b border-slate-200/70">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#0B1B3A] leading-tight tracking-tight mb-4">
              A scholarship is not luck. It is matching, documents and timing.
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto">
              Get all three right and your profile competes. Get one wrong and the door closes quietly.
            </p>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3 — KNOW YOUR OPTIONS (education)
            Layout: three cards side-by-side, icon per card, one line of
            "what it really means" under each. Mobile: stacked.
           ========================================================================= */}
        <section className="py-16 md:py-24 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] block mb-2">
                KNOW YOUR OPTIONS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B3A] tracking-tight mb-4">
                Three Kinds of Funding — and Why Students Apply to the Wrong One
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                Most students miss out because they apply to the wrong award, or apply late. Knowing the type of funding first saves months. Each award has its own eligibility rules, its own cycle, and its own competition.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-10">
              {/* Card 1 */}
              <div className="rounded-3xl p-7 md:p-8 border border-slate-200 bg-slate-50/60 flex flex-col justify-between hover:shadow-lg transition-all">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#0B1B3A] text-white flex items-center justify-center mb-6 shadow-sm">
                    <Award className="w-6 h-6 text-[#FF4D6D]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0B1B3A] mb-3">
                    Fully funded
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    Tuition plus living costs, sometimes travel. Few seats, heavy competition, long lead time. Best for students with strong grades, a clear plan and early preparation.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Highest Competition · 9–12 Month Lead
                </div>
              </div>

              {/* Card 2 */}
              <div className="rounded-3xl p-7 md:p-8 border-2 border-[#FF4D6D]/30 bg-rose-50/30 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-[#FF4D6D] text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Most Realistic
                </div>
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#FF4D6D] text-white flex items-center justify-center mb-6 shadow-sm">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0B1B3A] mb-3">
                    Partial scholarship
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    Covers part of your tuition. More awards, easier to win. The realistic middle path most Pakistani students should target.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-rose-200/60 text-xs font-semibold text-[#FF4D6D] uppercase tracking-wider">
                  Broadest Eligibility · High Win Rate
                </div>
              </div>

              {/* Card 3 */}
              <div className="rounded-3xl p-7 md:p-8 border border-slate-200 bg-slate-50/60 flex flex-col justify-between hover:shadow-lg transition-all">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#0B1B3A] text-white flex items-center justify-center mb-6 shadow-sm">
                    <FileText className="w-6 h-6 text-[#FF4D6D]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0B1B3A] mb-3">
                    University merit award
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    Given for strong grades, often decided with your course application. The least talked-about and often the most accessible route — you can strengthen your odds by choosing the right universities.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Course-Coupled · Fast Turnaround
                </div>
              </div>
            </div>

            {/* Footer note */}
            <div className="rounded-2xl p-5 md:p-6 bg-slate-100/90 border border-slate-200 text-slate-700 text-sm leading-relaxed">
              <span className="font-bold text-[#0B1B3A]">Research examples: </span>
              Examples to research: Chevening and Commonwealth Scholarships (UK), GREAT Scholarships, and merit awards from individual UK universities. Always confirm current details on each official page — rules change every cycle, and so do ours when they do.
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4 — THE COSTE OF WAITING (agitation)
            Layout: dark-contrast text block on tinted section, short lines, no images.
           ========================================================================= */}
        <section className="py-16 md:py-24 bg-[#0B1B3A] text-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-8 text-white">
              The Deadline Nobody Sees
            </h2>
            <div className="space-y-6 text-base sm:text-lg md:text-xl text-slate-300 font-light leading-relaxed">
              <p>
                Every scholarship year ends the same way: brilliant students discover the award two weeks after it closed.
              </p>
              <p>
                Fully funded cycles open months before the intake. Merit awards are judged with your course application — decide the application late, and the award is gone before you heard of it. Reference letters take weeks you no longer have.
              </p>
              <p className="text-white font-medium text-lg sm:text-xl">
                You are not paying in rupees for the waiting. You are paying with a whole intake cycle.
              </p>
              <div className="pt-4">
                <p className="text-[#FF4D6D] font-bold text-xl sm:text-2xl">
                  Start the free check now. It costs an afternoon. A missed cycle costs a year.
                </p>
              </div>
              <div className="pt-6">
                <button
                  onClick={scrollToForm}
                  className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm sm:text-base font-bold text-white bg-[#FF4D6D] hover:bg-[#E11D48] transition-all cursor-pointer shadow-lg"
                >
                  Start Your Free Check Today
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 5 — PROBLEM → SOLUTION → WHAT YOU GET
            Layout: 3-column table on desktop, stacked cards on mobile.
            Outcome column visually highlighted.
           ========================================================================= */}
        <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] block mb-2">
                PROBLEMS WE SOLVE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                From Confused to Clear
              </h2>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/70 text-xs uppercase font-extrabold tracking-wider text-slate-700">
                    <th className="py-5 px-6 w-1/3">The problem</th>
                    <th className="py-5 px-6 w-1/3">Our solution</th>
                    <th className="py-5 px-6 w-1/3 bg-rose-50/60 text-[#FF4D6D]">
                      So you get
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {[
                    {
                      problem: "Not sure which scholarship fits you",
                      solution: "A shortlist built around your profile, country and budget.",
                      outcome: "You apply only to awards you can actually win.",
                    },
                    {
                      problem: "Unsure if you are eligible",
                      solution: "A clear, honest answer in your free evaluation.",
                      outcome: "Months saved that would have gone to the wrong applications.",
                    },
                    {
                      problem: "Weak CV or statement",
                      solution: "Review and rebuild of your CV, statement and references.",
                      outcome: "A file a scholarship reader takes seriously.",
                    },
                    {
                      problem: "Afraid of missing deadlines",
                      solution: "One timeline with every date for your intake.",
                      outcome: "No door closing quietly behind you.",
                    },
                    {
                      problem: "Scared of hidden agent fees",
                      solution: "Scope and fees explained in writing before you commit.",
                      outcome: "The total cost known before the first rupee is paid.",
                    },
                    {
                      problem: "Parents don't trust consultants",
                      solution: "A real office in I-8 Markaz, a landline, and a free first step.",
                      outcome: "Your family sees a business, not a promise.",
                    },
                    {
                      problem: "No one to ask after you apply",
                      solution: "Tracked follow-ups and a team that answers outside office hours.",
                      outcome: "Answers at every stage, not silence after payment.",
                    },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4.5 px-6 font-semibold text-slate-900 align-top">
                        {row.problem}
                      </td>
                      <td className="py-4.5 px-6 text-slate-600 align-top">
                        {row.solution}
                      </td>
                      <td className="py-4.5 px-6 font-medium text-slate-900 bg-rose-50/30 align-top border-l border-rose-100">
                        <span className="inline-flex items-center gap-1.5 text-emerald-800">
                          <Check className="w-4 h-4 text-[#FF4D6D] shrink-0" />
                          {row.outcome}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile / Tablet Stacked Cards */}
            <div className="lg:hidden space-y-4">
              {[
                {
                  problem: "Not sure which scholarship fits you",
                  solution: "A shortlist built around your profile, country and budget.",
                  outcome: "You apply only to awards you can actually win.",
                },
                {
                  problem: "Unsure if you are eligible",
                  solution: "A clear, honest answer in your free evaluation.",
                  outcome: "Months saved that would have gone to the wrong applications.",
                },
                {
                  problem: "Weak CV or statement",
                  solution: "Review and rebuild of your CV, statement and references.",
                  outcome: "A file a scholarship reader takes seriously.",
                },
                {
                  problem: "Afraid of missing deadlines",
                  solution: "One timeline with every date for your intake.",
                  outcome: "No door closing quietly behind you.",
                },
                {
                  problem: "Scared of hidden agent fees",
                  solution: "Scope and fees explained in writing before you commit.",
                  outcome: "The total cost known before the first rupee is paid.",
                },
                {
                  problem: "Parents don't trust consultants",
                  solution: "A real office in I-8 Markaz, a landline, and a free first step.",
                  outcome: "Your family sees a business, not a promise.",
                },
                {
                  problem: "No one to ask after you apply",
                  solution: "Tracked follow-ups and a team that answers outside office hours.",
                  outcome: "Answers at every stage, not silence after payment.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3"
                >
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-500 block">
                      The Problem
                    </span>
                    <h4 className="font-bold text-[#0B1B3A] text-base">
                      {item.problem}
                    </h4>
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                      Our Solution
                    </span>
                    <p className="text-slate-600 text-sm">{item.solution}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 bg-rose-50/50 -mx-5 -mb-5 p-4 rounded-b-2xl">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FF4D6D] block">
                      So you get
                    </span>
                    <p className="font-semibold text-slate-800 text-sm flex items-center gap-1.5 mt-0.5">
                      <Check className="w-4 h-4 text-[#FF4D6D] shrink-0" />
                      {item.outcome}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 6 — YOUR FREE OFFER (named lead magnet)
            Layout: three numbered outcome cards, guarantee strip under, CTA button centred.
           ========================================================================= */}
        <section className="py-16 md:py-24 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] block mb-2">
                YOUR FREE OFFER
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0B1B3A] tracking-tight mb-4">
                Your Free Scholarship Check
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                Three clear outcomes, with no payment needed to receive them. Send your details once — we do the checking, you keep the plan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
              {[
                {
                  num: "01",
                  title: "Profile Evaluation",
                  content:
                    'We review your grades, degree and goals and give you an honest view of your chances — including when the honest view is "not this award, not this year."',
                },
                {
                  num: "02",
                  title: "Scholarship Shortlist",
                  content:
                    "Awards and universities that match your profile, country and budget, each with its real deadline and what it will cost you if you win it.",
                },
                {
                  num: "03",
                  title: "Personal Action Plan",
                  content:
                    "The documents you need and what to do first, in one simple plan you can start on the same day.",
                },
              ].map((card) => (
                <div
                  key={card.num}
                  className="rounded-3xl border border-slate-200 bg-slate-50/50 p-8 flex flex-col justify-between hover:border-slate-300 hover:shadow-lg transition-all"
                >
                  <div>
                    <span className="text-3xl font-black text-[#FF4D6D]/70 block mb-4">
                      {card.num}
                    </span>
                    <h3 className="text-xl font-bold text-[#0B1B3A] mb-3">
                      {card.title}
                    </h3>
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                      {card.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Time promise & Risk reversal strip */}
            <div className="rounded-2xl p-6 bg-gradient-to-r from-slate-100 via-rose-50/40 to-slate-100 border border-slate-200/80 max-w-4xl mx-auto mb-10 text-center">
              <p className="text-base sm:text-lg font-bold text-[#0B1B3A] mb-1">
                ⏱️ Your check comes back within 1 working day.
              </p>
              <p className="text-sm text-slate-600">
                The evaluation, shortlist and plan are yours to keep — whether you hire us afterwards or not.
              </p>
            </div>

            {/* Centered CTA */}
            <div className="text-center">
              <button
                onClick={scrollToForm}
                className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
                style={{ backgroundColor: BRAND.pink }}
              >
                Get My Free Scholarship Check
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 7 — HOW IT WORKS
            Layout: 4-step horizontal flow, FREE steps in one colour,
            PAID SERVICE steps in another; mobile vertical with connector line.
           ========================================================================= */}
        <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B3A] tracking-tight mb-3">
                Four Steps. Two of Them Free.
              </h2>
              <p className="text-slate-600 text-base">
                A simple, fully transparent process from your first message to departure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              {[
                {
                  step: "Step 1",
                  title: "Share details",
                  desc: "Grades, degree, country, budget. Ten minutes on WhatsApp or at the office.",
                  tag: "FREE",
                  tagColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
                },
                {
                  step: "Step 2",
                  title: "Get your plan",
                  desc: "Shortlist and action plan within 1 working day. We walk you through it in person or on a call.",
                  tag: "FREE",
                  tagColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
                },
                {
                  step: "Step 3",
                  title: "Apply",
                  desc: "Statement, CV, forms, references, follow-ups — run with you, on your timeline.",
                  tag: "PAID SERVICE",
                  tagColor: "bg-rose-100 text-[#E11D48] border-rose-200",
                },
                {
                  step: "Step 4",
                  title: "Visa and departure",
                  desc: "Documents, finances, interview prep, pre-departure briefing.",
                  tag: "PAID SERVICE",
                  tagColor: "bg-rose-100 text-[#E11D48] border-rose-200",
                },
              ].map((s, idx) => (
                <div
                  key={s.step}
                  className="rounded-3xl border border-slate-200 bg-white p-6 md:p-7 flex flex-col justify-between shadow-sm relative"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                        {s.step}
                      </span>
                      <span
                        className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border ${s.tagColor}`}
                      >
                        {s.tag}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#0B1B3A] mb-2">
                      {s.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={scrollToForm}
                className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm sm:text-base font-bold text-white transition-all hover:opacity-95 cursor-pointer shadow-md"
                style={{ backgroundColor: BRAND.pink }}
              >
                Get My Free Scholarship Check
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 8 — THE SCHOLARSHIP YEAR (first-90-days / timeline)
            Layout: horizontal timeline strip, 4 markers; note card below.
           ========================================================================= */}
        <section className="py-16 md:py-24 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B3A] tracking-tight mb-3">
                What Your First 90 Days Look Like
              </h2>
              <p className="text-slate-600 text-base">
                Scholarship timelines require calculated timing. Here is how we sequence your trajectory.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              {[
                {
                  time: "Week 1",
                  title: "Free Check In Hand",
                  desc: "Free Scholarship Check back in hand. Realistic awards identified, dead ends ruled out.",
                },
                {
                  time: "Week 2–4",
                  title: "Document Base Built",
                  desc: "CV rebuilt, statement drafts started, reference letters requested (they are slow — start them first).",
                },
                {
                  time: "Month 2–3",
                  title: "Applications Submitted",
                  desc: "Applications submitted in order of deadline, not in order of your anxiety. IELTS scheduled if your awards need it.",
                },
                {
                  time: "Month 3+",
                  title: "Offers & Selection",
                  desc: "Offers and awards arrive in waves. We help you choose between them — that conversation matters more than students expect.",
                },
              ].map((tl, i) => (
                <div
                  key={tl.time}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 relative"
                >
                  <div className="inline-block px-3 py-1 rounded-lg bg-[#0B1B3A] text-white text-xs font-bold mb-4">
                    {tl.time}
                  </div>
                  <h3 className="font-bold text-[#0B1B3A] text-base mb-2">
                    {tl.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {tl.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl p-5 md:p-6 bg-slate-100/90 border border-slate-200 text-slate-700 text-sm leading-relaxed max-w-4xl">
              <span className="font-bold text-[#0B1B3A]">Important Cycle Note: </span>
              Fully funded national schemes run once a year and close early. University merit awards move with your course application. The wrong plan is "I'll look when admissions open."
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 9 — WHAT WE DELIVER
            Layout: six deliverable cards, icon + one line, 2×3 grid, mobile 2 columns.
           ========================================================================= */}
        <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] block mb-2">
                WHAT WE DELIVER
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                From Shortlist to Departure — the Work We Do
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Scholarship matching",
                  desc: "Awards that fit your profile, with application guidance for each.",
                  icon: Award,
                },
                {
                  title: "Course and university",
                  desc: "Course selection, UK admissions and applications prepared.",
                  icon: Building,
                },
                {
                  title: "Statement and CV",
                  desc: "Personal statement, CV and reference letter guidance.",
                  icon: FileText,
                },
                {
                  title: "IELTS preparation",
                  desc: "Test preparation for the English score your course and award require.",
                  icon: Compass,
                },
                {
                  title: "Visa guidance",
                  desc: "Documents, finances and interview preparation.",
                  icon: ShieldCheck,
                },
                {
                  title: "Pre-departure support",
                  desc: "Practical guidance before you travel — from accommodation to arrival.",
                  icon: Users,
                },
              ].map((deliv, i) => {
                const Icon = deliv.icon;
                return (
                  <div
                    key={i}
                    className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-[#0B1B3A]/5 text-[#FF4D6D] flex items-center justify-center mb-5">
                        <Icon className="w-6 h-6" strokeWidth={2} />
                      </div>
                      <h3 className="text-lg font-bold text-[#0B1B3A] mb-2">
                        {deliv.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {deliv.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 10 — BEFORE / AFTER
            Layout: split column. Left greyed "Before", right brand-tinted "After".
           ========================================================================= */}
        <section className="py-16 md:py-24 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B3A] tracking-tight mb-3">
                Before the Check — and After
              </h2>
              <p className="text-slate-600 text-base">
                See how a structured, honest approach transforms the chaotic scholarship chase.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Before Column */}
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7 md:p-8">
                <div className="inline-block px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-extrabold uppercase tracking-wider mb-6">
                  Before
                </div>
                <ul className="space-y-4 text-sm sm:text-base text-slate-600">
                  {[
                    'Forty tabs open, six "top 10 scholarships" blogs contradicting each other.',
                    "Applying to a fully funded scheme that your degree year quietly disqualifies.",
                    "Statement written the night the portal closes.",
                    'Parents told "beta admission guaranteed" by someone else.',
                    "A deadline you learned about two weeks after it passed.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                        ✕
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* After Column */}
              <div className="rounded-3xl border-2 border-[#FF4D6D]/30 bg-rose-50/30 p-7 md:p-8 shadow-sm">
                <div className="inline-block px-3 py-1 rounded-full bg-[#FF4D6D] text-white text-xs font-extrabold uppercase tracking-wider mb-6">
                  After
                </div>
                <ul className="space-y-4 text-sm sm:text-base text-slate-800 font-medium">
                  {[
                    "Six targets, each matched to your profile, budget and timeline.",
                    "Eligibility cleared before you spend a day on paperwork.",
                    "Statement and CV reviewed and rebuilt over weeks, not hours.",
                    "An honest chance-of-winning conversation, in an office you can visit.",
                    "One calendar with every date — and us tracking it with you.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#FF4D6D] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="text-xs text-slate-400 font-medium text-center">
              Illustrative of how the process runs — the numbers we quote are our published figures; the outcome of your applications, nobody can promise.
            </p>
          </div>
        </section>

        {/* =========================================================================
            SECTION 11 — FEES, IN THE OPEN
            Layout: three columns, "Free" column highlighted. Under: honesty strip.
           ========================================================================= */}
        <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] block mb-2">
                FEES
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Free, Paid and Third-Party Costs
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-10">
              {/* Col 1: Free */}
              <div className="rounded-3xl border-2 border-[#FF4D6D] bg-white p-7 md:p-8 shadow-md flex flex-col justify-between">
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-rose-100 text-[#E11D48] text-xs font-extrabold uppercase tracking-wider mb-4">
                    100% Free
                  </div>
                  <h3 className="text-xl font-bold text-[#0B1B3A] mb-4">
                    Free with us
                  </h3>
                  <ul className="space-y-3 text-sm text-slate-700">
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#FF4D6D] shrink-0 mt-0.5" />
                      <span>Profile evaluation</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#FF4D6D] shrink-0 mt-0.5" />
                      <span>Scholarship shortlist</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#FF4D6D] shrink-0 mt-0.5" />
                      <span>Personal action plan</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#FF4D6D] shrink-0 mt-0.5" />
                      <span>No obligation to continue</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-6 mt-6 border-t border-slate-100 text-xs font-bold text-slate-500">
                  Zero Rupees · No Commitment
                </div>
              </div>

              {/* Col 2: Paid (optional) */}
              <div className="rounded-3xl border border-slate-200 bg-white p-7 md:p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-extrabold uppercase tracking-wider mb-4">
                    Optional Support
                  </div>
                  <h3 className="text-xl font-bold text-[#0B1B3A] mb-4">
                    Paid services (optional)
                  </h3>
                  <ul className="space-y-3 text-sm text-slate-700 mb-5">
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                      <span>Application support</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                      <span>Visa guidance</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                      <span>IELTS preparation</span>
                    </li>
                  </ul>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Fee explained and confirmed in writing before you commit. No hourly surprises.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-slate-100 text-xs font-bold text-slate-500">
                  Fixed Quoted Fee In Writing
                </div>
              </div>

              {/* Col 3: Paid to others */}
              <div className="rounded-3xl border border-slate-200 bg-white p-7 md:p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-extrabold uppercase tracking-wider mb-4">
                    Direct Costs
                  </div>
                  <h3 className="text-xl font-bold text-[#0B1B3A] mb-4">
                    Paid to others, never to us
                  </h3>
                  <ul className="space-y-3 text-sm text-slate-700">
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                      <span>Tuition fees</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                      <span>University application fees, where charged</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                      <span>Visa and health surcharge</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                      <span>IELTS test fee</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-6 mt-6 border-t border-slate-100 text-xs font-bold text-slate-500">
                  Official Institutional Fees
                </div>
              </div>
            </div>

            {/* Honesty Strip (Protected Copy) */}
            <div className="rounded-2xl p-5 md:p-6 bg-slate-900 text-white text-center font-bold text-base sm:text-lg tracking-wide shadow-md">
              🛡️ No consultant can guarantee a scholarship, admission or visa, and we do not.
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 12 — WHO CHOOSES US
            Layout: 2×2 feature tiles + one wide differentiation strip below with WhatsApp line visual.
           ========================================================================= */}
        <section className="py-16 md:py-24 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] block mb-2">
                WHY STUDENTS STAY WITH US
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                What You Can Expect From Our Team
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {[
                {
                  title: "Regular follow-ups",
                  desc: "We track your progress and update you at every stage.",
                },
                {
                  title: "Reachable beyond office hours",
                  desc: "Deadlines don't keep office hours. Our team answers when students and parents actually worry.",
                },
                {
                  title: "Streamlined process",
                  desc: "Clear workflows mean faster applications and less stress.",
                },
                {
                  title: "Honest first, helpful second",
                  desc: 'We say "not this year" to more students than most agencies ever admit. It\'s why the students we take with us trust the plan.',
                },
              ].map((tile, i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-slate-200 bg-slate-50/60 p-7 hover:border-slate-300 transition-all"
                >
                  <h3 className="text-xl font-bold text-[#0B1B3A] mb-2">
                    {tile.title}
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    {tile.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Differentiation Strip */}
            <div className="rounded-3xl p-8 bg-gradient-to-r from-[#0B1B3A] to-[#162D4D] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="max-w-2xl">
                <p className="text-lg sm:text-xl font-medium leading-relaxed text-slate-100">
                  A scholarship consultancy you can walk into. Vista Building, I-8 Markaz — landline on the wall, 700+ completed cases, and a free first step that costs you nothing but ten minutes.
                </p>
              </div>
              <a
                href="https://wa.me/923701902123"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white transition-all shrink-0 shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                Chat with Advisor
              </a>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 13 — PROOF (anonymised, realistic)
            Layout: large quote cards 2×2, monogram avatars (no fake photos), city chips.
           ========================================================================= */}
        <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Students and Parents, in Their Words
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-8">
              {[
                {
                  quote:
                    "I was chasing fully funded awards with a one-year gap in my file. They told me straight — target merit awards, apply with a strong course file instead. I got an offer with a partial scholarship I hadn't even searched for.",
                  name: "Hamza R., MS applicant",
                  city: "Rawalpindi",
                  initials: "HR",
                },
                {
                  quote:
                    "The free check came back the next day with a list and a calendar. No pressure to pay for anything. We paid later, only for the visa stage.",
                  name: "Sana L., BS applicant",
                  city: "Karachi",
                  initials: "SL",
                },
                {
                  quote:
                    "Pehle guarantee bechne wale agents se nuksaan hua. Yahan pehle sach bataya, phir kaam. Office bhi same sheher mein hai — milne gaye, file dekhi, tab bharosa hua.",
                  name: "Usman T., parent",
                  city: "Islamabad",
                  initials: "UT",
                },
                {
                  quote:
                    "They talked us out of one country entirely. Which consultant does that for free? We started again with the UK and never looked back.",
                  name: "Bilal A., student",
                  city: "Lahore",
                  initials: "BA",
                },
              ].map((card, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl border border-slate-200 bg-white p-7 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
                >
                  <p className="text-slate-700 text-base leading-relaxed italic mb-6">
                    "{card.quote}"
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#0B1B3A] text-white flex items-center justify-center font-bold text-xs">
                        {card.initials}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          {card.name}
                        </div>
                        <div className="text-xs text-slate-500">Verified applicant</div>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                      {card.city}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-400 font-medium text-center">
              Names anonymised, details generalised. Figures cited elsewhere on this page are as published on proconsulting.uk.
            </p>
          </div>
        </section>

        {/* =========================================================================
            SECTION 14 — FAQ (native <details> accordions, server-rendered bodies)
            Layout: native <details> accordions, server-rendered bodies, two columns desktop / one mobile.
           ========================================================================= */}
        <section className="py-16 md:py-24 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Questions Students and Parents Actually Ask
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {[
                {
                  q: "Can I get an international student scholarship?",
                  a: "Many students with a completed or ongoing degree have options — partial awards and university merit awards far more often than fully funded ones. Your free check shows which awards fit you and gives an honest answer on your chances.",
                },
                {
                  q: "Do I have to pay after the free check?",
                  a: "No. The evaluation, shortlist and action plan are yours to keep. Paid services are optional and explained in writing before you commit.",
                },
                {
                  q: "Can you guarantee a scholarship or visa?",
                  a: "No. No consultant can, and anyone who does is selling you something. We build a strong application, choose realistic targets and give you a view of your chances you can plan around.",
                },
                {
                  q: "When should I start?",
                  a: "As early as possible. Many scholarship deadlines close months before the intake they fund. A student starting 9–12 months before their intake is in the comfortable zone; under 4 months, fully funded awards are usually out of reach — and we will tell you that in the free check.",
                },
                {
                  q: "What if I am not eligible for a scholarship?",
                  a: "We tell you plainly, then suggest other options: merit awards, a different intake, a different university mix, or funding that doesn't require a competition at all.",
                },
                {
                  q: "How much do your paid services cost?",
                  a: "One fixed number for the scope, confirmed in writing before you commit. It varies by level (BS/MS/PhD) and stages you want help with. You will never discover a new fee mid-process — if the scope changes, the number is re-agreed before work continues.",
                },
                {
                  q: "We already lost money with a consultancy that promised guarantees. Why trust you?",
                  a: 'Start where everyone should start: with us that\'s the free check, no payment. Visit the office in I-8 Markaz — it\'s a building with a doorbell. Ask about a student case similar to yours. And the sentence on this page — "no consultant can guarantee a scholarship, admission or visa" — is us, in writing, refusing to sell you the thing others sell.',
                },
                {
                  q: "Can't I do this myself using official websites?",
                  a: "Yes — and for one or two awards many students should. The official pages are free. Where we earn our fee is fit (right awards, right deadlines), documents (statements that survive reading) and timeline management. Plenty of students run part of the process themselves and bring us only the parts they don't trust themselves with.",
                },
                {
                  q: "What documents should I have ready for the free check?",
                  a: "Transcripts or mark sheets, degree (or expected graduation), passport page if you have one, an English score if taken, and a plain-language line about what you want to study and what your family can realistically fund. Ten minutes.",
                },
                {
                  q: "Do scholarships cover living costs?",
                  a: "Fully funded awards may cover tuition, living costs and travel. Partial scholarships and merit awards usually reduce tuition only. Your plan needs a realistic number for what you still pay — that gap is part of the free check, because a scholarship you can't survive on is not a win.",
                },
                {
                  q: "Can I apply without IELTS?",
                  a: "Some awards and universities accept a medium-of-instruction certificate in place of IELTS; others are strict. Rules vary by university, by course, by intake — and they change. Never rely on last year's answer; never rely on ours without checking that cycle's official page.",
                },
              ].map((faq, i) => (
                <details
                  key={i}
                  className="group rounded-2xl border border-slate-200 bg-slate-50/60 p-5 transition-all open:bg-white open:border-slate-300 open:shadow-sm"
                >
                  <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-slate-900 text-base md:text-lg select-none">
                    <span>{faq.q}</span>
                    <span className="w-7 h-7 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-600 transition-transform group-open:rotate-180 shrink-0 ml-4">
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </summary>
                  <div className="pt-3.5 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 mt-3.5">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 15 — CONVERSION BLOCK + WHAT HAPPENS NEXT
            Layout: split. Left: pitch + parent note + what-happens-next list.
            Right: form card. Mobile: form first.
           ========================================================================= */}
        <section
          id="scholarship-form"
          className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/80 scroll-mt-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column (Desktop) / Second (Mobile) */}
              <div className="lg:col-span-5 order-2 lg:order-1 space-y-8">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B3A] tracking-tight mb-4">
                    Ten Minutes Now. A Written Plan Within a Working Day.
                  </h2>
                  <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                    Send your degree, grades and target country. You receive your profile evaluation, scholarship shortlist and personal action plan from a trusted, honest team in Islamabad.
                  </p>
                </div>

                {/* What Happens Next list */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 space-y-4 shadow-sm">
                  <h3 className="font-bold text-base uppercase tracking-wider text-[#0B1B3A]">
                    What happens next
                  </h3>
                  <div className="space-y-4 text-sm sm:text-base text-slate-700">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-rose-100 text-[#FF4D6D] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                        1
                      </span>
                      <span>1. We confirm on WhatsApp the same working day.</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-rose-100 text-[#FF4D6D] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                        2
                      </span>
                      <span>2. Your check returns within 1 working day.</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-rose-100 text-[#FF4D6D] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                        3
                      </span>
                      <span>
                        3. If it makes sense, we walk through the plan at the office or on a call — with your parents welcome.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Parent Strip */}
                <div className="rounded-3xl border border-slate-200 bg-slate-100 p-6 text-sm text-slate-700 leading-relaxed space-y-2">
                  <div className="font-bold text-[#0B1B3A] text-base">
                    For Parents:
                  </div>
                  <p>
                    Parents: the first step costs nothing and commits you to nothing. The office has a landline — (051) 6135834 — and a door you can walk through: Vista Building, 2nd Floor, Office 203-204, I-8 Markaz.
                  </p>
                </div>
              </div>

              {/* Right Column (Form Card) / First on Mobile */}
              <div className="lg:col-span-7 order-1 lg:order-2">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 md:p-10 shadow-xl">
                  {isSuccess ? (
                    <div className="text-center py-12 space-y-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#0B1B3A]">
                        Scholarship Check Request Received!
                      </h3>
                      <p className="text-slate-600 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
                        Thank you for sharing your details. Our admissions advisory team in I-8 Markaz is reviewing your file. We will confirm on WhatsApp today and deliver your written plan within 1 working day.
                      </p>
                      <div className="pt-4">
                        <a
                          href="https://wa.me/923701902123?text=Hi%2C%20I%20just%20submitted%20my%20scholarship%20check%20form."
                          className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] transition-all"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Message Us on WhatsApp Now
                        </a>
                      </div>
                    </div>
                  ) : (
                    <fetcher.Form method="post" className="space-y-6">
                      <div className="border-b border-slate-100 pb-4">
                        <h3 className="text-xl sm:text-2xl font-bold text-[#0B1B3A]">
                          Request Your Free Scholarship Check
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                          Takes ~2 minutes. 100% free with no commitment.
                        </p>
                      </div>

                      {/* Full Name */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          required
                          placeholder="e.g. Muhammad Ali"
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] focus:border-transparent text-sm"
                        />
                      </div>

                      {/* WhatsApp number (MANDATORY) */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                          WhatsApp Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          placeholder="e.g. 03XX —XXXXXXX"
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] focus:border-transparent text-sm"
                        />
                      </div>

                      {/* Current level (tactile pills) */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                          Current Level *
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {levelOptions.map((opt) => (
                            <button
                              type="button"
                              key={opt}
                              onClick={() => setCurrentLevel(opt)}
                              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                                currentLevel === opt
                                  ? "bg-[#0B1B3A] text-white shadow-sm"
                                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                        <input type="hidden" name="currentLevel" value={currentLevel} />
                      </div>

                      {/* Field of study */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                          Field of Study *
                        </label>
                        <input
                          type="text"
                          name="fieldOfStudy"
                          required
                          placeholder="e.g. Computer Science / Business / Law"
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] focus:border-transparent text-sm"
                        />
                      </div>

                      {/* Target country (tactile pills) */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                          Target Country *
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {countryOptions.map((opt) => (
                            <button
                              type="button"
                              key={opt}
                              onClick={() => setTargetCountry(opt)}
                              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                                targetCountry === opt
                                  ? "bg-[#0B1B3A] text-white shadow-sm"
                                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                        <input type="hidden" name="targetCountry" value={targetCountry} />
                      </div>

                      {/* Next intake (tactile pills) */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                          Next Intake *
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {intakeOptions.map((opt) => (
                            <button
                              type="button"
                              key={opt}
                              onClick={() => setNextIntake(opt)}
                              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                                nextIntake === opt
                                  ? "bg-[#0B1B3A] text-white shadow-sm"
                                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                        <input type="hidden" name="nextIntake" value={nextIntake} />
                      </div>

                      {/* Budget range (tactile pills / optional) */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                          Budget range your family can plan around (optional)
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {budgetOptions.map((opt) => (
                            <button
                              type="button"
                              key={opt}
                              onClick={() => setBudgetRange(opt)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                budgetRange === opt
                                  ? "bg-rose-100 text-[#E11D48] border border-rose-300 font-bold"
                                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                        <input type="hidden" name="budgetRange" value={budgetRange} />
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                          Message (Optional)
                        </label>
                        <textarea
                          name="message"
                          rows={3}
                          placeholder="Tell us about your current GPA, test scores, or specific target universities..."
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] focus:border-transparent text-sm resize-none"
                        />
                      </div>

                      {/* Submit Button */}
                      <div>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-4 rounded-xl text-base font-bold text-white shadow-lg transition-all hover:opacity-95 active:scale-[0.99] cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
                          style={{
                            backgroundColor: BRAND.pink,
                            boxShadow: "0 6px 20px rgba(255, 77, 109, 0.35)",
                          }}
                        >
                          {isSubmitting ? (
                            <span>Preparing Check...</span>
                          ) : (
                            <>
                              Get My Free Scholarship Check
                              <ArrowRight className="w-5 h-5" />
                            </>
                          )}
                        </button>
                      </div>

                      {/* Reassurance Micro */}
                      <p className="text-xs text-slate-500 text-center leading-relaxed">
                        Your details are used only to prepare your assessment and contact you. No spam calls, no selling your file — one respectful follow-up if we don't hear back.
                      </p>
                    </fetcher.Form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 16 — AUTHOR BYLINE + FRESHNESS + FOOTER CTA
            Layout: byline card with team photo/details, last-reviewed stamp,
            then footer CTA band with full contact block.
           ========================================================================= */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            {/* Byline Card */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-[#0B1B3A] text-white flex items-center justify-center shrink-0 font-bold shadow-md">
                <GraduationCap className="w-8 h-8 text-[#FF4D6D]" />
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D]">
                  Advisory Governance
                </div>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                  Reviewed by ProConsulting's admissions and scholarship advisory team — study-abroad and immigration counselling from I-8 Markaz, Islamabad, with a UK desk reachable on +44 7432 406993. Thousands of student files read; scholarship cycles run every year.
                </p>
                <div className="pt-2">
                  <span className="text-xs font-semibold text-slate-500">
                    Page last reviewed: October 2026. Scholarship rules, deadlines and IELTS requirements change every cycle — we re-verify this page before every intake season.
                  </span>
                </div>
              </div>
            </div>

            {/* Footer CTA Band with Full Contact Block */}
            <div className="rounded-3xl p-8 md:p-12 bg-gradient-to-br from-[#0B1B3A] via-[#112447] to-[#162D4D] text-white text-center shadow-xl space-y-8">
              <div className="max-w-2xl mx-auto space-y-3">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                  Your scholarship is a matching problem, not a luck problem.
                </h3>
                <p className="text-slate-300 text-sm sm:text-base">
                  Get clarity on your chances today without spending a rupee.
                </p>
              </div>

              <div>
                <button
                  onClick={scrollToForm}
                  className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white shadow-xl transition-all hover:scale-[1.02] cursor-pointer"
                  style={{ backgroundColor: BRAND.pink }}
                >
                  Get My Free Scholarship Check
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Contact block */}
              <div className="pt-8 border-t border-white/10 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl mx-auto space-y-3">
                <p>
                  Vista Building, 2nd Floor, Office 203-204, I-8 Markaz, Islamabad, Pakistan · (051) 6135834 · +92 370 1902123 · UK +44 7432 406993 · contact@proconsulting.uk · proconsulting.uk
                </p>
                <p className="text-slate-400 text-xs">
                  Privacy: your details are used only to prepare your assessment and contact you.
                </p>
              </div>
            </div>

            {/* Internal Navigation Mesh (§T6) */}
            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                Explore More Education Services & Resources
              </h4>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <Link
                  to="/education/services"
                  className="text-[#FF4D6D] hover:underline font-medium"
                >
                  All Student Services
                </Link>
                <Link
                  to="/education/services/visa"
                  className="text-slate-600 hover:text-[#0B1B3A] transition-colors"
                >
                  Visa Guidance
                </Link>
                <Link
                  to="/education/services/test-prep"
                  className="text-slate-600 hover:text-[#0B1B3A] transition-colors"
                >
                  IELTS & Test Prep
                </Link>
                <Link
                  to="/education/services/admission"
                  className="text-slate-600 hover:text-[#0B1B3A] transition-colors"
                >
                  University Admissions
                </Link>
                <Link
                  to="/education/services/interview-prep"
                  className="text-slate-600 hover:text-[#0B1B3A] transition-colors"
                >
                  Interview Preparation
                </Link>
                <Link
                  to="/education/destinations"
                  className="text-slate-600 hover:text-[#0B1B3A] transition-colors"
                >
                  Study Destinations
                </Link>
                <Link
                  to="/education/universities"
                  className="text-slate-600 hover:text-[#0B1B3A] transition-colors"
                >
                  Universities Directory
                </Link>
                <Link
                  to="/education/contact"
                  className="text-slate-600 hover:text-[#0B1B3A] transition-colors"
                >
                  Free Consultation
                </Link>
                <Link
                  to="/immigration"
                  className="text-slate-600 hover:text-[#0B1B3A] transition-colors"
                >
                  Immigration & Family Visas
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
