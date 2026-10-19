"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  ChevronDown,
  Building2,
  GraduationCap,
  MapPin,
  Phone,
  ShieldCheck,
  Award,
  Compass,
  CheckCircle2,
  Clock,
  Briefcase,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Navbar } from "~/education/components/ui/Navbar";
import { Footer } from "~/education/components/ui/footer";
import {
  SWEDEN_FAQS,
  SWEDEN_SEO,
} from "~/education/lib/swedenDestinationData";

export function SwedenDestinationView() {
  const [activeAnchor, setActiveAnchor] = useState<string>("overview");
  const [showMobileCta, setShowMobileCta] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const anchors = [
        "overview",
        "fit",
        "programmes",
        "qualifications",
        "english",
        "sequence",
        "tuition",
        "costs",
        "timing",
        "funds",
        "scholarships",
        "permits",
        "housing",
        "work",
        "graduation",
        "assessment-scope",
        "faqs",
        "assessment",
      ];
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
        if (rect.top <= window.innerHeight - 80) {
          setShowMobileCta(false);
        } else {
          setShowMobileCta(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#FF4D6D]/15 selection:text-[#0B1B3A]">
      <Navbar />

      {/* STICKY SECONDARY SUB-NAVIGATION BAR */}
      <nav
        aria-label="Sweden page navigation"
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs transition-all"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-2.5 overflow-x-auto no-scrollbar text-xs sm:text-sm font-semibold text-slate-600">
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <span className="font-bold text-[#0B1B3A] flex items-center gap-1.5 pr-2 border-r border-slate-200">
                <img
                  src="https://flagcdn.com/w40/se.png"
                  alt="Sweden flag"
                  className="w-4 h-3 object-cover rounded-2xs"
                />
                Sweden Guide
              </span>
              {[
                { id: "overview", label: "Overview" },
                { id: "fit", label: "Fit" },
                { id: "programmes", label: "Programmes" },
                { id: "qualifications", label: "Qualifications" },
                { id: "english", label: "English" },
                { id: "sequence", label: "Application" },
                { id: "tuition", label: "Tuition" },
                { id: "costs", label: "Costs" },
                { id: "timing", label: "Payment Timing" },
                { id: "funds", label: "Maintenance" },
                { id: "scholarships", label: "Scholarships" },
                { id: "permits", label: "Permits" },
                { id: "work", label: "Work" },
                { id: "faqs", label: "FAQs" },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                    activeAnchor === item.id
                      ? "text-[#FF4D6D] bg-[#FF4D6D]/10 font-bold"
                      : "hover:text-[#0B1B3A] hover:bg-slate-100/80"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <Link
              to={SWEDEN_SEO.ctaHref}
              className="shrink-0 hidden md:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] transition-all shadow-2xs"
            >
              <span>{SWEDEN_SEO.ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* ========================================================================= */}
        {/* HERO SECTION */}
        {/* ========================================================================= */}
        <section
          id="overview"
          className="scroll-mt-36 relative bg-gradient-to-b from-slate-50 via-white to-slate-50/40 border-b border-slate-200/80 pt-8 pb-16 sm:pb-20 lg:pb-24 overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb Trail */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-xs text-slate-500 mb-6"
            >
              <Link to="/" className="hover:text-slate-900 transition-colors">
                Home
              </Link>
              <span aria-hidden>/</span>
              <Link to="/education" className="hover:text-slate-900 transition-colors">
                Education
              </Link>
              <span aria-hidden>/</span>
              <Link to="/education/destinations" className="hover:text-slate-900 transition-colors">
                Destinations
              </Link>
              <span aria-hidden>/</span>
              <span className="text-[#0B1B3A] font-semibold">Sweden</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              {/* Left Column (7 cols): Main Text & CTAs */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-[#0B1B3A]">
                  <span className="w-2 h-2 rounded-full bg-[#FF4D6D]" />
                  Sweden Study Assessment &amp; Planning
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1B3A] tracking-tight leading-tight">
                  Study in Sweden
                </h1>

                {/* EXACT MANDATORY OPENING PARAGRAPHS VERBATIM */}
                <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-normal">
                  Study in Sweden with a clearer view of your course options, upfront costs and residence-permit requirements. Before you commit, understand whether your academic background fits, how your family will fund the plan and what the qualification could help you do afterwards. ProConsulting can help you organise those decisions without treating admission as a promise of a visa.
                </p>

                {/* Primary CTA */}
                <div className="pt-2 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <Link
                      to={SWEDEN_SEO.ctaHref}
                      className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-base font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-md hover:shadow-lg transition-all"
                    >
                      <span>{SWEDEN_SEO.ctaText}</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    <span className="text-xs text-slate-500 font-medium">
                      Explore your options first. An assessment is not an admission decision, scholarship award or immigration approval.
                    </span>
                  </div>

                  {/* Mandatory Protected Honesty Sentence */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border-l-3 border-[#FF4D6D] text-xs sm:text-sm font-semibold text-[#0B1B3A]">
                    No consultant can guarantee a scholarship, admission or visa, and we do not.
                  </div>
                </div>
              </div>

              {/* Right Column (5 cols): Destination Visual Hero Card */}
              <div className="lg:col-span-5">
                <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl bg-slate-950 group">
                  <img
                    src="/destinations/Sweden.webp"
                    alt="Study in Sweden - World-class universities and innovation"
                    className="w-full h-[370px] sm:h-[430px] object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3A] via-[#0B1B3A]/40 to-black/20" />

                  {/* Floating Top Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-white/40">
                    <img
                      src="https://flagcdn.com/w40/se.png"
                      alt="Sweden flag"
                      className="w-5 h-3.5 object-cover rounded-2xs"
                    />
                    <span className="text-xs font-bold text-[#0B1B3A]">Sweden</span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Innovation &amp; Research
                    </span>
                  </div>

                  {/* Bottom Overlay Info with Modern Structured Badges */}
                  <div className="absolute bottom-0 inset-x-0 p-6 text-white space-y-3">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-white">
                        Study in Sweden
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">
                        Top research universities, English-taught degree options, and clear residence permit steps.
                      </p>
                    </div>

                    <div className="pt-1 grid grid-cols-3 gap-2">
                      <div className="flex flex-col items-start gap-1 bg-white/10 backdrop-blur-md border border-white/15 p-2 rounded-xl">
                        <div className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                          <Building2 className="w-3 h-3" />
                        </div>
                        <span className="text-[11px] font-medium text-slate-100">Top Unis</span>
                      </div>
                      <div className="flex flex-col items-start gap-1 bg-white/10 backdrop-blur-md border border-white/15 p-2 rounded-xl">
                        <div className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-300 flex items-center justify-center">
                          <Award className="w-3 h-3" />
                        </div>
                        <span className="text-[11px] font-medium text-slate-100">English Taught</span>
                      </div>
                      <div className="flex flex-col items-start gap-1 bg-white/10 backdrop-blur-md border border-white/15 p-2 rounded-xl">
                        <div className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-300 flex items-center justify-center">
                          <GraduationCap className="w-3 h-3" />
                        </div>
                        <span className="text-[11px] font-medium text-slate-100">Permit Steps</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 1. IS SWEDEN THE RIGHT FIT FOR YOUR PLANS? */}
        {/* ========================================================================= */}
        <section id="fit" className="scroll-mt-36 py-16 sm:py-20 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Course &amp; Qualification Fit
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Is Sweden the right fit for your plans?
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                Sweden deserves a place on your shortlist if you want an English-taught programme and can explain why its subjects suit your next step. Start with the curriculum, not photographs of a city or a university’s reputation alone.
              </p>
              <p>
                Look at assessment methods, research opportunities and the skills you need to develop. Then compare the same course in other destinations. A good decision should still make sense if a scholarship does not arrive and your first job after graduation is in Pakistan.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. CHOOSE THE PROGRAMME BEFORE THE DESTINATION STORY */}
        {/* ========================================================================= */}
        <section id="programmes" className="scroll-mt-36 py-16 sm:py-20 bg-slate-50/60 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Academic Shortlisting
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Choose the programme before the destination story
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                For a master’s degree, compare required subject credits with the courses on your transcript. Similar degree titles do not always mean similar preparation. A business graduate and an engineering graduate may face very different entry requirements for the same interdisciplinary programme.
              </p>
              <p>
                For undergraduate study, check the separate bachelor’s admission rules rather than applying master’s guidance to your school qualifications. Programme language, subject prerequisites and selection criteria all matter. Make a shortlist you can defend academically, not a long list built around the easiest-looking application.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. CHECK YOUR PAKISTANI QUALIFICATIONS CAREFULLY */}
        {/* ========================================================================= */}
        <section id="qualifications" className="scroll-mt-36 py-16 sm:py-20 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Entry Requirements
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Check your Pakistani qualifications carefully
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                University Admissions publishes specific instructions for master’s applicants educated in Pakistan. These cover qualifying degree combinations, document standards and exceptions. Having a degree does not automatically mean you satisfy every programme’s general and subject-specific requirements.
              </p>
              <p>
                Your qualification history and the selected programme determine what needs reviewing. ProConsulting can help you identify the relevant admission route and discuss any gaps before you commit to an application.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. ENGLISH EVIDENCE NEEDS ITS OWN CHECK */}
        {/* ========================================================================= */}
        <section id="english" className="scroll-mt-36 py-16 sm:py-20 bg-slate-50/60 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Language Evidence
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              English evidence needs its own check
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                An English-medium education is not a universal exemption. The Pakistan master’s instructions state that Pakistani upper-secondary studies do not meet the English requirement for Swedish study.
              </p>
              <p>
                Check the accepted evidence, test version, required result and document deadline for your application. Do not assume a university letter alone will be enough. If a test is needed, allow time for booking, results and a possible retake. Language preparation also matters beyond admission: you will need to read critically, join discussions and complete assessed work.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. UNDERSTAND THE APPLICATION SEQUENCE */}
        {/* ========================================================================= */}
        <section id="sequence" className="scroll-mt-36 py-16 sm:py-20 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Application Stages
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Understand the application sequence
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                Universityadmissions.se is the central starting point for many Swedish degree applications. Search programmes, check the relevant round, rank your choices carefully and follow the instructions for fees and documents. Programme order is a real decision, not a decorative preference list.
              </p>
              <p>
                Keep application, supporting-document, scholarship and tuition-payment dates separate. An application submitted on time can still be incomplete if required evidence or payment is missing. Use the published dates for your chosen intake; do not rely on a previous year’s calendar or assume every programme follows an identical schedule.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. COMPARE TUITION USING THE ACTUAL PROGRAMME FEE */}
        {/* ========================================================================= */}
        <section id="tuition" className="scroll-mt-36 py-16 sm:py-20 bg-slate-50/60 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Tuition Structure
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Compare tuition using the actual programme fee
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                Pakistani applicants will generally need to budget for application and tuition fees unless an exemption applies. Sweden is not automatically tuition-free for international students outside the EU/EEA. Confirm your fee status before assuming an exception.
              </p>
              <p>
                Find the programme’s own tuition information, including the full degree cost and payment schedule. A national average cannot tell your family what your offer will require. Read withdrawal, refund and scholarship-adjustment conditions before paying. Ask what happens if your plans change or a residence-permit decision arrives later than expected.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. BUILD A STATIC, REALISTIC COST PICTURE */}
        {/* ========================================================================= */}
        <section id="costs" className="scroll-mt-36 py-16 sm:py-20 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Family Budgeting
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Build a static, realistic cost picture
            </h2>
            <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
              Consider these costs separately rather than using one attractive headline figure:
            </p>

            {/* Static Semantic Cost Areas List (No interactive calculators or sliders) */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs space-y-4 text-slate-800 text-base sm:text-lg">
              <ul className="space-y-3.5 list-disc pl-5">
                <li>
                  <strong className="text-slate-900">Academic costs:</strong> application fee, tuition, required materials and any course-specific expenses.
                </li>
                <li>
                  <strong className="text-slate-900">Living costs:</strong> accommodation, food, local travel, utilities and everyday personal spending.
                </li>
                <li>
                  <strong className="text-slate-900">Arrival costs:</strong> travel, housing deposits, temporary accommodation and basic settling-in purchases.
                </li>
                <li>
                  <strong className="text-slate-900">Administrative costs:</strong> residence-permit application, document preparation and insurance where required.
                </li>
                <li>
                  <strong className="text-slate-900">Contingency:</strong> exchange-rate movement, an unexpected journey or a delayed move into permanent housing.
                </li>
              </ul>
            </div>

            <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
              Use published fees and current housing information for the actual city. Keep Swedish-krona obligations visible; a rupee estimate can change before payment. A housing deposit is a cash-flow commitment, not a reason to count the same expense twice.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. PAYMENT TIMING CAN DECIDE WHETHER THE PLAN WORKS */}
        {/* ========================================================================= */}
        <section id="timing" className="scroll-mt-36 py-16 sm:py-20 bg-slate-50/60 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Payment Sequencing
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Payment timing can decide whether the plan works
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                A family may be able to afford a degree overall but still struggle with the first payments. Map when money must be available: application stage, tuition invoice, residence-permit evidence, housing and travel.
              </p>
              <p>
                The Swedish Migration Agency requires any tuition fee due to be paid before the study residence-permit application. Follow your university’s invoice instructions and confirmation process. Do not assume that paying tuition also proves you can support yourself. Keep tuition payments and maintenance evidence as separate parts of the plan.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 9. UNDERSTAND MAINTENANCE FUNDS AND FAMILY SUPPORT */}
        {/* ========================================================================= */}
        <section id="funds" className="scroll-mt-36 py-16 sm:py-20 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Maintenance Evidence
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Understand maintenance funds and family support
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                The residence-permit process requires evidence that you can support yourself for the relevant period. Check the current maintenance requirement and the evidence rules for your application year directly with the Swedish Migration Agency. A minimum immigration threshold is not a personalised living-cost promise.
              </p>
              <p>
                Sweden’s guidance distinguishes recognised sponsors from private individuals. A parent’s support letter alone is not the same as accepted sponsorship. Under the current guidance, money from relatives must be held as accessible personal bank assets in your name. Check the permitted evidence and timing before arranging transfers, and keep the financial history truthful.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 10. TREAT SCHOLARSHIPS AS A SEPARATE COMPETITION */}
        {/* ========================================================================= */}
        <section id="scholarships" className="scroll-mt-36 py-16 sm:py-20 bg-slate-50/60 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Scholarship Policy
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Treat scholarships as a separate competition
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                Scholarships can change affordability, but an application is not funding. Read each university’s award rules for nationality, programme, selection, coverage and continuation conditions. A tuition reduction may leave living costs, travel and other expenses entirely with you.
              </p>
              <p>
                Be especially careful with Swedish Institute scholarship advice. Pakistani nationality must not be assumed eligible for every SI scheme or annual call. Check the current eligible-country list before spending time on an application.
              </p>
              <p>
                Until you have a confirmed award with usable terms, plan without deducting it. Also check when funds become available: an award paid later may not solve an earlier tuition deadline or maintenance-evidence requirement.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 11. ADMISSION AND RESIDENCE PERMISSION ARE DIFFERENT DECISIONS */}
        {/* ========================================================================= */}
        <section id="permits" className="scroll-mt-36 py-16 sm:py-20 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Immigration Assessment
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Admission and residence permission are different decisions
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                A university assesses your academic application. The Swedish Migration Agency assesses your residence-permit application. An offer, tuition payment or scholarship does not replace that second decision.
              </p>
              <p>
                For the relevant higher-education route, check admission status, full-time study requirements, passport validity, financial evidence and insurance. Follow official instructions if you must present your passport or attend an appointment. The residence permit must be issued before you travel under this route. Avoid non-refundable commitments based only on an offer or an assumed processing time.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 12. HOUSING, HEALTH COVER AND FAMILY PLANS */}
        {/* ========================================================================= */}
        <section id="housing" className="scroll-mt-36 py-16 sm:py-20 bg-slate-50/60 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Living Logistics
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Housing, health cover and family plans
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                Ask the university what accommodation help is actually available and whether any offer comes with conditions. Do not assume admission includes a room. Compare location, commuting costs, contract dates and what is included in the rent before paying a deposit.
              </p>
              <p>
                Insurance requirements depend on the study period and your circumstances; shorter programmes need particular attention. If a partner or children may accompany you, check their current eligibility and additional financial and document requirements separately. Family plans can change the budget substantially. Do not book around a student-only assessment and add dependants as an afterthought.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 13. WORK IS NOT YOUR FUNDING PLAN */}
        {/* ========================================================================= */}
        <section id="work" className="scroll-mt-36 py-16 sm:py-20 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Work Permissions
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Work is not your funding plan
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                Part-time earnings should not be the foundation of your tuition or living-cost plan. Finding suitable work takes time, language expectations vary and study must remain your priority.
              </p>
              <p>
                Swedish student-work rules have changed. Check the current restrictions, exceptions and the conditions relevant to when your permit was granted before accepting employment. Do not rely on older advice that students can work without limits. A possible job, an expected salary and an accepted form of financial evidence are different things. Build your plan so it remains workable without immediate employment.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 14. JUDGE THE DEGREE BY ITS VALUE AFTER GRADUATION */}
        {/* ========================================================================= */}
        <section id="graduation" className="scroll-mt-36 py-16 sm:py-20 bg-slate-50/60 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Career &amp; Return-Home Value
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Judge the degree by its value after graduation
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                Compare what you will learn with roles you could pursue in Pakistan as well as internationally. Read job descriptions in your field and identify the technical, analytical or communication skills the course would strengthen.
              </p>
              <p>
                Check recognition requirements with the appropriate authority or professional body where your intended career requires them. An overseas degree does not automatically confer professional registration. Likewise, a course project is not a guaranteed internship, and an internship is not a guaranteed job. Any future permission to remain in Sweden has its own rules and should not be sold as a settled outcome.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 15. WHAT YOUR ASSESSMENT SHOULD HELP CLARIFY */}
        {/* ========================================================================= */}
        <section id="assessment-scope" className="scroll-mt-36 py-16 sm:py-20 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Assessment Scope
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              What your assessment should help clarify
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                Bring your qualification level, subject, graduation year, approximate grades, intended intake and a realistic funding outline.
              </p>
              <p>
                Use the conversation to clarify programme fit, missing evidence, likely payment stages and the questions that need an official answer. Before accepting paid support, ask for the service scope, fees and exclusions in writing. Universities and authorities make their own decisions.
              </p>

              {/* Mandatory Protected Honesty Sentence */}
              <div className="p-4 rounded-xl bg-slate-50 border-l-4 border-[#FF4D6D] text-sm sm:text-base font-semibold text-[#0B1B3A]">
                No consultant can guarantee a scholarship, admission or visa, and we do not.
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 16. FREQUENTLY ASKED QUESTIONS */}
        {/* ========================================================================= */}
        <section id="faqs" className="scroll-mt-36 py-16 sm:py-20 lg:py-24 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-36 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
                    Frequently Asked Questions
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
                    Frequently asked questions
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Direct answers on admissions, IELTS evidence, Swedish Institute scholarships, maintenance funding and work permissions.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-4">
                {SWEDEN_FAQS.map((faq) => (
                  <details
                    key={faq.id}
                    className="group bg-slate-50 rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden transition-colors open:border-slate-300 open:bg-white"
                  >
                    <summary className="flex items-center justify-between gap-4 p-5 sm:p-6 cursor-pointer list-none select-none text-left font-bold text-slate-900 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]/30 min-h-[44px]">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 m-0">
                        {faq.q}
                      </h3>
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
        {/* 17. MAKE YOUR NEXT STEP A BETTER-INFORMED ONE */}
        {/* ========================================================================= */}
        <section id="assessment" className="scroll-mt-36 bg-[#0B1B3A] text-white py-16 sm:py-20 lg:py-24 border-t border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/15 px-3 py-1 rounded-full mb-3 inline-block">
                Start Your Evaluation
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                Make your next step a better-informed one
              </h2>
              <p className="text-base sm:text-lg text-slate-300 mt-4 leading-relaxed">
                You do not need to commit to Sweden before asking questions. Start with your academic fit, understand the funding gap and compare the route with your longer-term goals. Include the family member funding your studies in that discussion where helpful.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Link
                to={SWEDEN_SEO.ctaHref}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-md transition-all hover:scale-[1.01]"
              >
                <span>{SWEDEN_SEO.ctaText}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <span className="text-xs sm:text-sm text-slate-400">
                Prefer to compare first?{" "}
                <Link to="/education/destinations" className="text-white underline hover:text-[#FF4D6D]">
                  Explore all destinations
                </Link>{" "}
                or{" "}
                <Link to="/education/services" className="text-white underline hover:text-[#FF4D6D]">
                  read about education support
                </Link>
                .
              </span>
            </div>

            {/* Mandatory Protected Honesty Sentence */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 border-l-4 border-l-[#FF4D6D] text-xs sm:text-sm font-semibold text-white shadow-sm">
              No consultant can guarantee a scholarship, admission or visa, and we do not.
            </div>

            {/* Related Destinations Comparison Mesh */}
            <div className="pt-4 border-t border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                Explore Alternative Study Destinations
              </h3>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/education/destinations/study-in-uk"
                  className="px-4 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-sm font-semibold text-white hover:border-[#FF4D6D] transition-colors"
                >
                  Compare the UK
                </Link>
                <Link
                  to="/education/destinations/study-in-germany"
                  className="px-4 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-sm font-semibold text-white hover:border-[#FF4D6D] transition-colors"
                >
                  Compare Germany
                </Link>
                <Link
                  to="/education/destinations/study-in-canada"
                  className="px-4 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-sm font-semibold text-white hover:border-[#FF4D6D] transition-colors"
                >
                  Compare Canada
                </Link>
              </div>
            </div>

            {/* Speak to ProConsulting */}
            <div className="p-7 sm:p-9 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-5 text-slate-900">
              <h3 className="text-xl font-bold text-[#0B1B3A]">
                Speak to ProConsulting
              </h3>

              <div className="flex items-start gap-3 text-sm text-slate-700">
                <MapPin className="w-5 h-5 text-[#FF4D6D] shrink-0 mt-0.5" />
                <span>Vista Building Second Floor Office 203-204 I-8 Markaz Islamabad</span>
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
                Initial consultations are free. We discuss Swedish university entry criteria, English evidence requirements, maintenance rules and application stages with complete transparency.
              </p>
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
            to={SWEDEN_SEO.ctaHref}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-md transition-colors"
          >
            <span>{SWEDEN_SEO.ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      <Footer />
    </div>
  );
}
