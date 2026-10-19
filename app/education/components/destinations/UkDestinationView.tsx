"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ShieldCheck,
  FileCheck,
  Building,
  GraduationCap,
  Calendar,
  AlertCircle,
  HelpCircle,
  Phone,
  MapPin,
} from "lucide-react";
import { Navbar } from "~/education/components/ui/Navbar";
import { Footer } from "~/education/components/ui/footer";
import { UkBudgetWorksheet } from "./UkBudgetWorksheet";
import {
  UK_FAQS,
  UK_OFFICIAL_SOURCES,
  UK_SEO,
} from "~/education/lib/ukDestinationData";

const BRAND = {
  navy: "#0B1B3A",
  pink: "#FF4D6D",
};

export function UkDestinationView() {
  const [activeAnchor, setActiveAnchor] = useState<string>("courses");
  const [showMobileCta, setShowMobileCta] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const anchors = ["courses", "budget", "offers", "visa", "process", "faq"];
      const headerOffset = 140;

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

      // Hide mobile sticky CTA if assessment section is in view
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
    { id: "courses", label: "Courses" },
    { id: "budget", label: "Budget" },
    { id: "offers", label: "Offers" },
    { id: "visa", label: "Visa evidence" },
    { id: "process", label: "Process" },
    { id: "faq", label: "FAQs" },
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
            <span className="text-slate-900 font-medium">United Kingdom</span>
          </nav>
        </div>
      </div>

      <main>
        {/* ========================================================================= */}
        {/* SECTION 01: HERO (White) */}
        {/* ========================================================================= */}
        <section className="bg-white pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column (7 cols): Headline, Deck, CTA */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="inline-block text-xs sm:text-sm font-semibold tracking-wide text-slate-600 bg-slate-100 px-3.5 py-1.5 rounded-full mb-4">
                    For Pakistani students and the families backing them
                  </span>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold text-[#0B1B3A] tracking-tight leading-[1.12]">
                    Study in the UK from Pakistan
                  </h1>
                </div>

                {/* MANDATORY FIRST PUBLIC PARAGRAPH */}
                <p className="text-lg sm:text-xl font-medium text-slate-800 leading-relaxed">
                  Study in the UK from Pakistan with a course your ambitions—and your family budget—can support.
                </p>

                {/* Supporting Slogan & Explanation */}
                <div className="space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed">
                  <p>
                    Study in the UK with a clearer view of course value, admission requirements and the money you need before you commit. ProConsulting helps you connect your academic profile with a practical application plan, from university choices to the evidence needed for a Student visa.
                  </p>
                  <p className="text-slate-700 font-medium">
                    Start with your qualifications, intended subject and available funding. You do not need a finished university shortlist to ask useful questions.
                  </p>
                </div>

                {/* Primary CTA */}
                <div className="pt-2">
                  <Link
                    to={UK_SEO.ctaHref}
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-base font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-md hover:shadow-lg transition-all"
                  >
                    <span>{UK_SEO.ctaText}</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  <p className="mt-3.5 text-xs sm:text-sm text-slate-500 max-w-xl leading-normal">
                    Free initial assessment. University admission, scholarships and visa decisions remain with the relevant institutions and authorities.
                  </p>
                </div>
              </div>

              {/* Right Column (5 cols): Editorial Decision Sheet */}
              <div className="lg:col-span-5">
                <div className="bg-slate-50/90 rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-[#FF4D6D]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#0B1B3A]">
                        UK Planning Framework
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      Standard
                    </span>
                  </div>

                  <div className="divide-y divide-slate-200/70 text-sm">
                    <div className="py-4">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                        1. Academic Value &amp; Fit
                      </div>
                      <p className="font-semibold text-slate-900">
                        Course modules, teaching structure and professional recognition
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        Prioritizing what you will actually learn over brand prestige alone.
                      </p>
                    </div>

                    <div className="py-4">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                        2. Family Budget Reality
                      </div>
                      <p className="font-semibold text-slate-900">
                        Tuition, deposit timing and realistic living costs
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        Separating upfront deposit requirements from Student visa financial thresholds.
                      </p>
                    </div>

                    <div className="py-4">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                        3. Compliance &amp; CAS Checks
                      </div>
                      <p className="font-semibold text-slate-900">
                        Genuine financial holding periods &amp; institution checks
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        Meeting official UKVI requirements with verifiable family or student documentation.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                    <span>Evidence-based guidance</span>
                    <span className="font-medium text-[#0B1B3A]">ProConsulting Education</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STICKY IN-PAGE ANCHOR BAR (Desktop & Mobile) */}
        {/* ========================================================================= */}
        <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between overflow-x-auto scrollbar-hide py-3 gap-6">
              <div className="flex items-center gap-1 sm:gap-2">
                {navLinks.map((tab) => {
                  const isActive = activeAnchor === tab.id;
                  return (
                    <a
                      key={tab.id}
                      href={`#${tab.id}`}
                      className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                        isActive
                          ? "bg-[#0B1B3A] text-white"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      {tab.label}
                    </a>
                  );
                })}
              </div>

              <div className="hidden md:block shrink-0">
                <Link
                  to={UK_SEO.ctaHref}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] rounded-lg transition-colors whitespace-nowrap shadow-2xs"
                >
                  <span>{UK_SEO.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 02: DECISION (Subtle Surface: bg-slate-50/70) */}
        {/* ========================================================================= */}
        <section className="bg-slate-50/70 py-16 sm:py-20 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight mb-4">
                Start with the decision, not the destination photo
              </h2>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
                A UK offer is exciting. Paying a deposit before understanding the course, refund terms or funding gap is a different matter.
              </p>
            </div>

            {/* Two open columns separated by a hairline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 py-8 border-y border-slate-200/90">
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D]">
                  For Students
                </div>
                <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-normal">
                  For students, the questions are personal: Will this subject build the skills I want? Can I manage the academic workload? What happens after graduation?
                </p>
              </div>

              <div className="space-y-3 border-t md:border-t-0 md:border-l border-slate-200/90 pt-6 md:pt-0 md:pl-8 lg:pl-12">
                <div className="text-xs font-bold uppercase tracking-wider text-[#0B1B3A]">
                  For Parents
                </div>
                <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-normal">
                  For parents, the questions are equally practical: What must we pay, when is it due, and what evidence will be accepted?
                </p>
              </div>
            </div>

            <div className="mt-8 max-w-3xl">
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
                Put both conversations on the same page. A sensible plan should make the reasons for studying in the UK understandable to everyone supporting the decision.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 03: COURSE FIT (White; anchor #courses) */}
        {/* ========================================================================= */}
        <section id="courses" className="scroll-mt-36 bg-white py-16 sm:py-20 lg:py-24 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
              {/* Sticky Heading on Desktop */}
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-36 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md">
                    Academic Evaluation
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                    Choose the course before the university name
                  </h2>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Evaluating curriculum structure, career relevance and realistic return on investment before financial commitments.
                  </p>
                </div>
              </div>

              {/* Reading Column (8 cols) */}
              <div className="lg:col-span-8 space-y-6 text-slate-700 text-base sm:text-lg leading-relaxed">
                <p className="font-semibold text-slate-900 text-lg sm:text-xl">
                  A familiar name can start your research. It should not finish it.
                </p>

                <p>
                  Compare the modules you will actually study, assessment methods, entry requirements and opportunities to apply what you learn. Check whether a placement is included, optional or competitively allocated. “Industry links” do not automatically mean a placement or job for every student.
                </p>

                <p>
                  For regulated careers, investigate the relevant professional recognition before paying. A degree title alone does not establish permission to practise in the UK or recognition for your intended career in Pakistan.
                </p>

                <p>
                  Think about return on investment as a decision framework, not a salary promise. Compare total spending and time away from work with the skills, professional access and career options the course could reasonably support.
                </p>

                <div className="p-5 rounded-xl bg-slate-50 border-l-4 border-[#0B1B3A]">
                  <p className="text-slate-800 font-medium">
                    Include a return-to-Pakistan scenario. A course should still make educational sense if your preferred overseas job or later immigration route is unavailable.
                  </p>
                </div>

                {/* Course Comparison Annotation Card */}
                <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="font-bold text-[#0B1B3A] block mb-1">Curriculum Fit</span>
                    <span className="text-slate-600">Core syllabus modules, assessment methods &amp; practical coursework vs theoretical exams.</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="font-bold text-[#0B1B3A] block mb-1">Professional Recognition</span>
                    <span className="text-slate-600">Verification of UK professional body credentials and applicability in Pakistan.</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="font-bold text-[#0B1B3A] block mb-1">Placement Reality</span>
                    <span className="text-slate-600">Distinguishing competitive interview placement years from automatic job allocations.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 04: BUDGET (Subtle surface; anchor #budget) */}
        {/* ========================================================================= */}
        <section id="budget" className="scroll-mt-36 bg-slate-50/70 py-16 sm:py-20 lg:py-24 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
              {/* Cost Explanation Left (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md mb-3 inline-block">
                    Financial Planning
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                    Turn a shortlist into a family budget
                  </h2>
                </div>

                <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
                  <p>
                    Start with the university's published international tuition for your exact course and intake. Then check deposits, payment schedules and refund conditions directly with the institution.
                  </p>
                  <p>
                    Add accommodation, food, local travel, study materials, flights, visa-related charges and the immigration health surcharge. Include an emergency reserve and consider how changes between pounds and Pakistani rupees could affect affordability.
                  </p>
                  <p>
                    London and other UK locations can mean different living costs. The visa maintenance requirement also distinguishes London from elsewhere. That requirement is an evidence threshold, not a personalised estimate of everything you will spend.
                  </p>
                  <p className="font-semibold text-slate-900">
                    Separate the total cost from the timing of payments. Money needed for a deposit may be due before funds are needed for a visa application. Do not count the same money twice.
                  </p>
                </div>

                {/* Worksheet Criteria Checklist */}
                <div className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                  <h3 className="font-bold text-[#0B1B3A] text-sm sm:text-base">
                    Your UK budget worksheet
                  </h3>
                  <p className="text-xs text-slate-600">
                    For each shortlisted course, record:
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FF4D6D] shrink-0 mt-0.5" />
                      <span>Course, institution, location and intended intake.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FF4D6D] shrink-0 mt-0.5" />
                      <span>Tuition, deposit, payment dates and refund conditions.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FF4D6D] shrink-0 mt-0.5" />
                      <span>Any scholarship confirmed in writing, including its conditions.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FF4D6D] shrink-0 mt-0.5" />
                      <span>Estimated living costs, travel and visa-related spending.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FF4D6D] shrink-0 mt-0.5" />
                      <span>Funds available now, who controls them and any remaining gap.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FF4D6D] shrink-0 mt-0.5" />
                      <span>The source and date checked for every figure.</span>
                    </li>
                  </ul>

                  <p className="text-xs text-slate-800 font-medium pt-2 border-t border-slate-100">
                    Keep uncertain funding separate from confirmed money. If the plan only works with a scholarship you have not secured, treat that as a funding gap—not an affordable offer.
                  </p>
                </div>
              </div>

              {/* Functional Interactive Worksheet Right (7 cols) */}
              <div className="lg:col-span-7">
                <UkBudgetWorksheet />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 05: OFFERS (White; anchor #offers) */}
        {/* ========================================================================= */}
        <section id="offers" className="scroll-mt-36 bg-white py-16 sm:py-20 lg:py-24 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md mb-3 inline-block">
                Admissions &amp; Sponsorship
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Know what your offer actually says
              </h2>
            </div>

            {/* Three-stage horizontal text diagram */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 mb-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-xs font-bold text-[#FF4D6D] uppercase tracking-wider mb-1">
                    Stage 1
                  </div>
                  <div className="text-base font-bold text-slate-900">
                    Conditional offer
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Admission offered subject to meeting remaining academic, degree or language conditions.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-xs font-bold text-[#0B1B3A] uppercase tracking-wider mb-1">
                    Stage 2
                  </div>
                  <div className="text-base font-bold text-slate-900">
                    Conditions met
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Verified certificates, SELT language results and tuition deposit cleared.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                    Stage 3
                  </div>
                  <div className="text-base font-bold text-slate-900">
                    Provider's CAS checks
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Independent university compliance assessment before CAS issuance for visa application.
                  </p>
                </div>
              </div>
              <p className="text-center text-xs text-slate-500 mt-4">
                Note: Offers represent institutional admission stages; progression depends on individual verification and sponsor checks.
              </p>
            </div>

            {/* Full copy underneath in two reading columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-700 text-base leading-relaxed">
              <div className="space-y-4">
                <p>
                  A conditional offer means you still have requirements to meet. These may concern final academic results, English-language evidence or other course-specific documents. Read the offer itself rather than relying on a general checklist.
                </p>
                <p>
                  An unconditional offer does not remove the university's separate enrolment, payment or sponsorship checks. Confirm what must happen before the institution will issue a Confirmation of Acceptance for Studies, usually called a CAS.
                </p>
              </div>

              <div className="space-y-4">
                <p>
                  Keep your name, qualifications and course details consistent across documents. Explain academic gaps or a change of subject honestly. Your application should represent your own experience, not a manufactured story designed to sound impressive.
                </p>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  <strong className="text-slate-900 block mb-1">Integrity Notice:</strong>
                  Official CAS issuance is controlled exclusively by the licensed higher education provider. Consultants do not issue CAS numbers or decide university sponsorship.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 06: FINANCIAL EVIDENCE (Subtle surface; anchor #visa) */}
        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* SECTION 06: FINANCIAL EVIDENCE (Brand Navy; anchor #visa) */}
        {/* ========================================================================= */}
        <section id="visa" className="scroll-mt-36 bg-[#0B1B3A] text-white py-16 sm:py-20 lg:py-24 border-y border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/15 px-2.5 py-1 rounded-md mb-3 inline-block">
              Visa Compliance
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-8">
              Financial evidence needs planning, not a last-minute balance
            </h2>

            <div className="bg-slate-900/80 rounded-2xl border border-slate-700/80 p-7 sm:p-9 shadow-xs space-y-6 text-slate-300 text-base sm:text-lg leading-relaxed border-l-4 border-l-[#FF4D6D]">
              <p>
                A Student visa application may require evidence of tuition funding and money for living costs. The amount and evidence depend on your circumstances and the rules applying when you submit.
              </p>

              <p>
                For personal funds, UKVI guidance sets requirements for how long the money must be held (28 consecutive days) and how recent the evidence must be. Account access, the account holder and the form of evidence also matter. A large balance on one day is not a complete financial plan.
              </p>

              <p>
                If you use a parent's funds, check the consent and relationship evidence required. Loans and official sponsorship have their own documentary requirements. A family promise of support is not the same as compliant evidence.
              </p>

              <p className="font-semibold text-white">
                Check the official financial guidance before moving money or choosing an application date. Keep your genuine funding arrangements clear and verifiable. Never submit altered statements or documents you cannot explain.
              </p>

              {/* Official Source Links */}
              <div className="pt-6 border-t border-slate-700/80 flex flex-wrap items-center gap-4 text-xs">
                <span className="font-bold text-white">Official UKVI Guidance:</span>
                <a
                  href="https://www.gov.uk/guidance/financial-evidence-for-student-and-child-student-route-applicants"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#FF4D6D] hover:underline font-medium"
                >
                  <span>GOV.UK Financial Evidence Guidance</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://www.gov.uk/student-visa/money"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#FF4D6D] hover:underline font-medium"
                >
                  <span>GOV.UK Student Visa Money Requirements</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 07: PROCESS (Brand Navy; anchor #process) */}
        {/* ========================================================================= */}
        <section id="process" className="scroll-mt-36 bg-[#0B1B3A] text-white py-16 sm:py-20 lg:py-24 border-y border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/15 px-2.5 py-1 rounded-md mb-3 inline-block">
                Step-by-Step Roadmap
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                From your profile to a prepared application
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-2">
                A structured, transparent planning sequence with no arbitrary day counts or unrealistic guarantees.
              </p>
            </div>

            {/* Vertical 5-Step Timeline */}
            <div className="relative border-l-2 border-slate-700 ml-4 sm:ml-6 space-y-10">
              {/* Step 1 */}
              <div className="relative pl-7 sm:pl-9">
                <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-[#FF4D6D] text-white flex items-center justify-center text-xs font-bold ring-4 ring-[#0B1B3A]">
                  1
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                    First: establish your starting point
                  </h3>
                  <p className="text-slate-300 text-base leading-relaxed">
                    Share your academic history, intended subject, English-language position, preferred intake and realistic funding range. Mention previous refusals or other relevant immigration history accurately.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative pl-7 sm:pl-9">
                <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-[#FF4D6D] text-white flex items-center justify-center text-xs font-bold ring-4 ring-[#0B1B3A]">
                  2
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                    Next: compare suitable options
                  </h3>
                  <p className="text-slate-300 text-base leading-relaxed">
                    Review course fit, entry conditions, location and total cost together. A shortlist should show trade-offs, not simply present the most expensive or most familiar institution.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative pl-7 sm:pl-9">
                <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-[#FF4D6D] text-white flex items-center justify-center text-xs font-bold ring-4 ring-[#0B1B3A]">
                  3
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                    Then: manage offers and outstanding conditions
                  </h3>
                  <p className="text-slate-300 text-base leading-relaxed">
                    Prepare the documents each university requests. Track offer conditions, deposit decisions and deadlines so that accepting an offer is an informed step rather than a rushed payment.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative pl-7 sm:pl-9">
                <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-[#FF4D6D] text-white flex items-center justify-center text-xs font-bold ring-4 ring-[#0B1B3A]">
                  4
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                    Before a visa application: check the CAS and evidence
                  </h3>
                  <p className="text-slate-300 text-base leading-relaxed">
                    The education provider issues the CAS; a consultant cannot issue one. Check its details against your passport and offer. Review financial evidence and any other requirements relevant to you, such as tuberculosis testing or ATAS.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="relative pl-7 sm:pl-9">
                <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-[#FF4D6D] text-white flex items-center justify-center text-xs font-bold ring-4 ring-[#0B1B3A]">
                  5
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                    Before travel: confirm the practical details
                  </h3>
                  <p className="text-slate-300 text-base leading-relaxed">
                    Wait for the appropriate immigration permission. Check your status instructions, accommodation arrangements, university arrival requirements and travel dates before making commitments you cannot recover.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 08: SCOPE & PRICES (Subtle surface: bg-slate-50/70) */}
        {/* ========================================================================= */}
        <section className="bg-slate-50/70 py-16 sm:py-20 lg:py-24 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md mb-3 inline-block">
                Service Boundaries
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Understand what support includes
              </h2>
            </div>

            {/* Desktop 6/6 split: Free initial assessment vs additional scope */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="p-7 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Complimentary Consultation
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#0B1B3A]">
                  Free initial assessment
                </h3>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                  Your free UK assessment is the starting conversation: your study goals, academic background, funding position and the next questions to resolve.
                </p>
                <div className="pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Academic profile and grades review</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Intended intake and university criteria check</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>General financial and evidence baseline</span>
                  </div>
                </div>
              </div>

              <div className="p-7 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D6D]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Agreed Terms
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#0B1B3A]">
                  Scope for additional support
                </h3>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                  For further support, agree the scope before work begins. Ask whether it covers course research, application preparation, offer-condition tracking, CAS document organisation or assistance preparing your visa application documents. Ask what remains your responsibility.
                </p>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                  University charges, testing, medical checks, government fees and travel are separate costs unless explicitly stated otherwise. Free assessment does not mean free tuition or a fully funded application journey.
                </p>
                <p className="text-slate-800 font-medium text-xs sm:text-sm pt-2 border-t border-slate-100">
                  If a paid service is proposed, request its price, inclusions, exclusions and applicable cancellation or refund terms in writing before you accept. Immigration advice requiring regulated authorisation must be handled within the appropriate professional permissions.
                </p>
              </div>
            </div>

            {/* Ruled Cost Classification Breakdown */}
            <div className="mt-8 p-6 rounded-2xl bg-white border border-slate-200/90">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                Cost Transparency Breakdown
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <strong className="text-slate-900 block mb-1">Consultancy Services</strong>
                  <span className="text-slate-600">Free profile assessment; any subsequent advisory scope agreed in advance in writing.</span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <strong className="text-slate-900 block mb-1">University Charges</strong>
                  <span className="text-slate-600">Tuition fees, initial deposit payments &amp; university application or accommodation fees.</span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <strong className="text-slate-900 block mb-1">Government Fees</strong>
                  <span className="text-slate-600">UKVI Student visa application fee and mandatory Immigration Health Surcharge (IHS).</span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <strong className="text-slate-900 block mb-1">Third-Party Costs</strong>
                  <span className="text-slate-600">IELTS/PTE language tests, approved TB medical tests, flights and personal travel.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 09: SCHOLARSHIPS (White) */}
        {/* ========================================================================= */}
        <section className="bg-white py-16 sm:py-20 lg:py-24 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Funding Realities
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Scholarships: useful support, not the starting assumption
            </h2>

            <div className="space-y-5 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                Scholarships can change affordability, but eligibility, competition and award conditions vary. Some awards cover only part of tuition; others support a broader range of costs. Do not assume an award includes accommodation, travel or visa expenses.
              </p>

              <p>
                University awards and external scholarships can have different application processes and deadlines. Check whether an award requires a separate application, applies to your course and nationality, or carries obligations after study.
              </p>

              <p>
                Fully funded opportunities such as Chevening exist, but they are competitive and have their own eligibility rules. They are not an automatic addition to a university offer.
              </p>

              <div className="p-5 rounded-xl border border-amber-300 bg-amber-50/50 text-slate-800 text-sm sm:text-base font-medium">
                Build your budget around confirmed resources. If an award is essential, decide what you will do if it is not offered before paying a non-refundable charge.
              </div>

              <div className="pt-3 text-xs text-slate-500">
                Official reference:{" "}
                <a
                  href="https://www.chevening.org/scholarships/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FF4D6D] font-medium hover:underline inline-flex items-center gap-1"
                >
                  <span>Chevening Scholarships official criteria</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 10: WORK (Subtle surface: bg-slate-50/70) */}
        {/* ========================================================================= */}
        <section className="bg-slate-50/70 py-16 sm:py-20 lg:py-24 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md mb-3 inline-block">
                Employment Guidance
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                Work can support experience. It should not fund the plan.
              </h2>
            </div>

            {/* Two open columns: student employment & post-study options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="p-7 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
                <h3 className="text-lg font-bold text-[#0B1B3A]">
                  Student employment while studying
                </h3>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                  Your permission to work depends on your course and immigration conditions. Restrictions apply, and finding suitable work is not guaranteed. Check the conditions attached to your own permission before accepting employment.
                </p>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                  Do not make tuition or essential living costs depend on getting a part-time job after arrival. Academic demands, job availability and permitted work can make that assumption unsafe.
                </p>
                <div className="pt-2 text-xs">
                  <a
                    href="https://www.gov.uk/student-visa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF4D6D] hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    <span>GOV.UK Student visa work permissions guidance</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="p-7 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
                <h3 className="text-lg font-bold text-[#0B1B3A]">
                  Graduate visa &amp; post-study options
                </h3>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                  After graduation, a Graduate visa may be an option for eligible students who meet the rules in force when they apply. It is a separate application, not an automatic benefit of admission, and does not guarantee a job or permanent residence.
                </p>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                  Check current GOV.UK guidance when comparing courses and again before making an immigration decision. Your study choice should not rely on an outdated post-study work headline.
                </p>
                <div className="pt-2 text-xs">
                  <a
                    href="https://www.gov.uk/graduate-visa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF4D6D] hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    <span>GOV.UK Graduate visa application rules</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 11: TRUST / TARGET STATE (White) */}
        {/* ========================================================================= */}
        <section className="bg-white py-16 sm:py-20 lg:py-24 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md mb-3 inline-block">
                Transparent Advisory
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                A clearer plan, without a guaranteed outcome
              </h2>
            </div>

            {/* Plain two-column prose comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-700 text-base leading-relaxed">
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                  Before Planning
                </div>
                <p>
                  Before planning, you may have university names, mixed advice and a rough figure in rupees.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold uppercase tracking-wide text-[#0B1B3A] mb-2">
                  With a Structured Plan
                </div>
                <p>
                  The aim is to replace that uncertainty with course comparisons, a documented budget, outstanding conditions and a sequence of decisions you can check. This is a planning standard, not a claim about another student's results.
                </p>
              </div>
            </div>

            <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
              Choose support that lets you ask difficult questions. Why this course? What is still unconfirmed? What happens if the scholarship does not arrive? Which payments could be lost?
            </p>

            {/* CRITICAL PROTECTED HONESTY SENTENCE */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1B3A] text-white space-y-3">
              <div className="text-lg sm:text-2xl md:text-3xl font-extrabold leading-snug tracking-tight text-white">
                No consultant can guarantee a scholarship, admission or visa, and we do not.
              </div>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Universities decide admission and sponsorship. Scholarship providers decide awards. UK Visas and Immigration decides visa applications.
              </p>
            </div>

            <div className="pt-2">
              <Link
                to={UK_SEO.ctaHref}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-base font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-md transition-all"
              >
                <span>{UK_SEO.ctaText}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 12: FAQS (Subtle surface; anchor #faq) */}
        {/* ========================================================================= */}
        <section id="faq" className="scroll-mt-36 bg-slate-50/70 py-16 sm:py-20 lg:py-24 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
              {/* Left Column (4 cols): Section Title */}
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-36 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
                    Questions &amp; Clarity
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                    Questions students and parents ask
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Direct answers on UK admission criteria, English tests, parental sponsorship, and post-study opportunities.
                  </p>
                </div>
              </div>

              {/* Right Column (8 cols): 10 Native <details> items */}
              <div className="lg:col-span-8 space-y-4">
                {UK_FAQS.map((faq) => (
                  <details
                    key={faq.id}
                    className="group bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden transition-colors open:border-slate-300"
                  >
                    <summary className="flex items-center justify-between gap-4 p-5 sm:p-6 cursor-pointer list-none select-none text-left font-bold text-slate-900 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]/30 min-h-[44px]">
                      <span>
                        {faq.id}. {faq.q}
                      </span>
                      <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
                    </summary>
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 pt-4">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 13: ASSESSMENT & CONTACT (Brand Navy; anchor #assessment) */}
        {/* ========================================================================= */}
        <section id="assessment" className="scroll-mt-36 bg-[#0B1B3A] text-white py-16 sm:py-20 lg:py-24 border-t border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/15 px-2.5 py-1 rounded-md mb-3 inline-block">
                Start Your Evaluation
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                Get a plan you and your family can question
              </h2>
              <p className="text-base sm:text-lg text-slate-300 mt-4 leading-relaxed">
                Tell us where you are starting. We can begin with an unfinished shortlist, an existing offer or a funding question that needs a clearer answer.
              </p>
            </div>

            <div>
              <Link
                to={UK_SEO.ctaHref}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-md transition-all"
              >
                <span>{UK_SEO.ctaText}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Assessment Specification Panel */}
            <div className="p-7 sm:p-9 rounded-2xl bg-slate-900/80 border border-slate-700/80 shadow-2xs space-y-6 text-sm text-slate-300">
              <div className="border-b border-slate-700 pb-4">
                <h3 className="text-xl font-bold text-white">
                  Your UK assessment
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Required information mapped directly to our UK study assessment consultation:
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700">
                  <span className="font-semibold text-white block mb-1">Personal &amp; Contact:</span>
                  <span className="text-slate-300">Full name • Email address • Mobile / WhatsApp number • City of residence</span>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700">
                  <span className="font-semibold text-white block mb-1">Enquirer Identity:</span>
                  <span className="text-slate-300">I am enquiring as: Student / Parent or guardian</span>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700">
                  <span className="font-semibold text-white block mb-1">Academic Background &amp; Intent:</span>
                  <span className="text-slate-300">Highest qualification and completion status • Intended subject • Intended study level • Preferred intake, if known</span>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700">
                  <span className="font-semibold text-white block mb-1">Funding &amp; English Evidence:</span>
                  <span className="text-slate-300">English-language evidence, if available • Estimated total study budget and currency • Funding source</span>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700">
                  <span className="font-semibold text-white block mb-1">Background Details:</span>
                  <span className="text-slate-300">Existing offer or previous refusal to discuss, if relevant • Preferred contact method • Your main question</span>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700">
                  <span className="font-semibold text-white block mb-1">Target Destination:</span>
                  <span className="text-[#FF4D6D] font-bold">Destination: United Kingdom</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-600/60 text-xs text-amber-200">
                <strong>Document security:</strong> Please do not upload passports, bank statements or other sensitive documents at this initial stage.
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                By submitting, you ask ProConsulting to contact you about this assessment. Read our{" "}
                <Link to="/education/privacy-policy" className="text-[#FF4D6D] underline">
                  Privacy Policy
                </Link>{" "}
                to understand how your information is handled. Marketing choices are separate and optional.
              </p>

              <div className="pt-2">
                <Link
                  to={UK_SEO.ctaHref}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] transition-colors"
                >
                  <span>Submit: Get free UK assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <p className="text-xs text-slate-400 italic">
                After submission, we will use your details to contact you about your enquiry. This is not an admission, scholarship or visa application.
              </p>
            </div>

            {/* Speak to ProConsulting */}
            <div className="p-7 sm:p-9 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-5">
              <h3 className="text-xl font-bold text-[#0B1B3A]">
                Speak to ProConsulting
              </h3>

              <div className="flex items-start gap-3 text-sm text-slate-700">
                <MapPin className="w-5 h-5 text-[#FF4D6D] shrink-0 mt-0.5" />
                <span>Vista Building Second Floor Office 203–204 I-8 Markaz Islamabad</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <a
                  href="tel:+92516135834"
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center gap-3 hover:border-slate-300 transition-colors"
                >
                  <Phone className="w-5 h-5 text-[#FF4D6D]" />
                  <div>
                    <span className="block text-xs text-slate-500">Pakistan Landline</span>
                    <span className="text-sm font-bold text-slate-900">Pakistan: (051) 6135834</span>
                  </div>
                </a>

                <a
                  href="tel:+447432406993"
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center gap-3 hover:border-slate-300 transition-colors"
                >
                  <Phone className="w-5 h-5 text-[#FF4D6D]" />
                  <div>
                    <span className="block text-xs text-slate-500">UK Direct Line</span>
                    <span className="text-sm font-bold text-slate-900">UK: +44 7432 406993</span>
                  </div>
                </a>
              </div>

              <p className="text-sm text-slate-600 pt-2 border-t border-slate-100">
                Prefer to involve a parent? Include that in your enquiry so the conversation can address the family's questions as well as the student's goals.
              </p>
            </div>

            {/* Official Guidance Source Registry */}
            <div className="pt-8 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Official UK Guidance Sources
                </h4>
                <span className="text-xs text-slate-500">
                  Guidance last reviewed: {UK_SEO.lastReviewedDate}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {UK_OFFICIAL_SOURCES.map((src) => (
                  <a
                    key={src.id}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-start justify-between gap-2 group"
                  >
                    <div>
                      <span className="font-semibold text-slate-800 group-hover:text-[#FF4D6D] transition-colors block">
                        {src.name}
                      </span>
                      <span className="text-slate-500 text-[11px] mt-0.5 line-clamp-1">
                        {src.description}
                      </span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FF4D6D] shrink-0 mt-0.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Bottom Action for Mobile */}
      {showMobileCta && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg md:hidden"
          style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
        >
          <Link
            to={UK_SEO.ctaHref}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-md transition-colors"
          >
            <span>{UK_SEO.ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      <Footer />
    </div>
  );
}
