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
  CANADA_FAQS,
  CANADA_SEO,
} from "~/education/lib/canadaDestinationData";

export function CanadaDestinationView() {
  const [activeAnchor, setActiveAnchor] = useState<string>("overview");
  const [showMobileCta, setShowMobileCta] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const anchors = [
        "overview",
        "goals",
        "qualification",
        "dli",
        "admission",
        "pal",
        "costs",
        "finances",
        "scholarships",
        "work",
        "post-study",
        "preparation",
        "decisions",
        "honesty",
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
        aria-label="Canada page navigation"
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs transition-all"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-2.5 overflow-x-auto no-scrollbar text-xs sm:text-sm font-semibold text-slate-600">
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <span className="font-bold text-[#0B1B3A] flex items-center gap-1.5 pr-2 border-r border-slate-200">
                <img
                  src="https://flagcdn.com/w40/ca.png"
                  alt="Canada flag"
                  className="w-4 h-3 object-cover rounded-2xs"
                />
                Canada Guide
              </span>
              {[
                { id: "overview", label: "Overview" },
                { id: "goals", label: "Goals" },
                { id: "qualification", label: "Value" },
                { id: "dli", label: "DLI & PGWP" },
                { id: "admission", label: "Admission" },
                { id: "pal", label: "PAL & Quebec" },
                { id: "costs", label: "Costs" },
                { id: "finances", label: "Financials" },
                { id: "scholarships", label: "Scholarships" },
                { id: "work", label: "Work" },
                { id: "post-study", label: "Post-Study" },
                { id: "decisions", label: "Standards" },
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
              to={CANADA_SEO.ctaHref}
              className="shrink-0 hidden md:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] transition-all shadow-2xs"
            >
              <span>{CANADA_SEO.ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* ========================================================================= */}
        {/* 1. HERO SECTION (S01 Hero) */}
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
              <span className="text-[#0B1B3A] font-semibold">Canada</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              {/* Left Column (7 cols): Main Text & CTAs */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-[#0B1B3A]">
                  <span className="w-2 h-2 rounded-full bg-[#FF4D6D]" />
                  Canada Study Assessment &amp; Planning
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1B3A] tracking-tight leading-tight">
                  Study in Canada
                </h1>

                {/* EXACT MANDATORY OPENING PARAGRAPHS VERBATIM */}
                <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-normal">
                  Study in Canada with a plan built around your course, your family’s finances and the requirements that apply to your application. ProConsulting helps you compare options and prepare your next steps without treating university admission, a study permit or future work permission as the same decision.
                </p>

                <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                  Start with the questions that matter: does the programme build on your education, can you fund it responsibly, and have you checked the institution and programme separately?
                </p>

                {/* Primary CTA */}
                <div className="pt-2 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <Link
                      to={CANADA_SEO.ctaHref}
                      className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-base font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-md hover:shadow-lg transition-all"
                    >
                      <span>{CANADA_SEO.ctaText}</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    <span className="text-xs text-slate-500 font-medium">
                      A first assessment is a conversation about suitability, not an approval or a promise of funding.
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
                    src="/destinations/Canada.webp"
                    alt="Study in Canada - World-class universities and vibrant campuses"
                    className="w-full h-[370px] sm:h-[430px] object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3A] via-[#0B1B3A]/40 to-black/20" />

                  {/* Floating Top Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-white/40">
                    <img
                      src="https://flagcdn.com/w40/ca.png"
                      alt="Canada flag"
                      className="w-5 h-3.5 object-cover rounded-2xs"
                    />
                    <span className="text-xs font-bold text-[#0B1B3A]">Canada</span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Top Universities
                    </span>
                  </div>

                  {/* Bottom Overlay Info with Modern Structured Badges */}
                  <div className="absolute bottom-0 inset-x-0 p-6 text-white space-y-3">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-white">
                        Study in Canada
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">
                        Designated learning institutions, structured university degrees, and applied polytechnic pathways.
                      </p>
                    </div>

                    <div className="pt-1 grid grid-cols-3 gap-2">
                      <div className="flex flex-col items-start gap-1 bg-white/10 backdrop-blur-md border border-white/15 p-2 rounded-xl">
                        <div className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                          <Building2 className="w-3 h-3" />
                        </div>
                        <span className="text-[11px] font-medium text-slate-100">DLI Checks</span>
                      </div>
                      <div className="flex flex-col items-start gap-1 bg-white/10 backdrop-blur-md border border-white/15 p-2 rounded-xl">
                        <div className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-300 flex items-center justify-center">
                          <Award className="w-3 h-3" />
                        </div>
                        <span className="text-[11px] font-medium text-slate-100">PGWP Rules</span>
                      </div>
                      <div className="flex flex-col items-start gap-1 bg-white/10 backdrop-blur-md border border-white/15 p-2 rounded-xl">
                        <div className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-300 flex items-center justify-center">
                          <GraduationCap className="w-3 h-3" />
                        </div>
                        <span className="text-[11px] font-medium text-slate-100">PAL / TAL Steps</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. DECIDE WHETHER CANADA FITS YOUR EDUCATION GOALS (S02 Fit) */}
        {/* ========================================================================= */}
        <section id="goals" className="scroll-mt-36 py-16 sm:py-20 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Course &amp; Qualification Fit
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Decide whether Canada fits your education goals
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                Canada offers universities, colleges and different types of qualifications. Those choices are not interchangeable. A research degree, an applied diploma and a course-led master’s can serve very different purposes, even when their titles sound similar.
              </p>
              <p>
                Compare the curriculum, assessment methods, admission requirements and support available to international students. Check whether practical placements are compulsory, optional or competitively allocated. A programme mentioning industry experience does not necessarily provide a paid placement.
              </p>
              <p>
                Choose a course you can explain in academic and professional terms, rather than selecting a city because someone else moved there.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. MAKE THE QUALIFICATION VALUABLE BEYOND CANADA (S03 Return-home value) */}
        {/* ========================================================================= */}
        <section id="qualification" className="scroll-mt-36 py-16 sm:py-20 bg-slate-50/60 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Global Recognition
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Make the qualification valuable beyond Canada
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                Write down the work you want to do after graduation and the skills you currently lack. Then compare those needs with actual modules, projects, research supervision or professional training in each programme.
              </p>
              <p>
                If you return to Pakistan, would the qualification support a realistic next step? Consider employer expectations, professional registration and any recognition requirements for your intended occupation. Ask the relevant authority before assuming an overseas qualification meets a regulated profession’s requirements.
              </p>
              <p>
                If your plans change, the education should still have value. A possible immigration pathway is not a substitute for a credible academic reason to study.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. CHECK THE INSTITUTION AND THE PROGRAMME SEPARATELY (S04 DLI/programme) */}
        {/* ========================================================================= */}
        <section id="dli" className="scroll-mt-36 py-16 sm:py-20 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Institution Verification
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Check the institution and the programme separately
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                A designated learning institution, or DLI, is an institution approved by a province or territory to host international students. Check the institution, campus and DLI number against the official DLI list.
              </p>
              <p>
                DLI status alone does not mean every programme qualifies for a post-graduation work permit, known as a PGWP. Confirm the exact programme’s eligibility and the additional requirements that apply to you before paying a deposit.
              </p>
              <p>
                Keep the institution’s written confirmation and the relevant official information. A broad claim that a college is “PGWP eligible” is not enough to settle a particular course choice.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. UNDERSTAND WHAT ADMISSION DOES, AND DOES NOT, MEAN (S05 Admission) */}
        {/* ========================================================================= */}
        <section id="admission" className="scroll-mt-36 py-16 sm:py-20 bg-slate-50/60 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Admission vs Study Permit
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Understand what admission does, and does not, mean
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                An institution assesses your application against its academic and language requirements. Requirements can depend on qualification level, subject background, grades, experience and the programme itself. Do not assume one English test or score applies everywhere.
              </p>
              <p>
                An offer may contain conditions. Read the deadline, required documents, deposit terms and refund policy before accepting. Ask what happens if you cannot meet a condition or your study permit application is refused.
              </p>
              <p>
                Admission is not study permit approval. Immigration, Refugees and Citizenship Canada, or IRCC, makes a separate assessment under its requirements. An offer letter cannot remove that assessment.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. CHECK PAL, TAL AND QUEBEC REQUIREMENTS EARLY (S06 PAL/TAL/Quebec) */}
        {/* ========================================================================= */}
        <section id="pal" className="scroll-mt-36 py-16 sm:py-20 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Attestation Letters &amp; Provincial Rules
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Check PAL, TAL and Quebec requirements early
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                A provincial or territorial attestation letter, usually called a PAL or TAL, is normally part of the study permit process unless an exemption applies. Your programme, institution and circumstances matter. Use the current IRCC guidance rather than assuming every applicant follows the same route.
              </p>
              <p>
                Quebec has a separate provincial selection process, commonly involving a Quebec Acceptance Certificate, or CAQ. Check both Quebec’s requirements and the federal application requirements; a PAL/TAL exemption does not automatically settle whether you need a CAQ.
              </p>
              <p>
                Ask the institution which documents it issues, what you must request and when. An admission deadline and an immigration-document deadline may be different.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. BUILD A COMPLETE COST PICTURE BEFORE COMMITTING (S07 Costs) */}
        {/* ========================================================================= */}
        <section id="costs" className="scroll-mt-36 py-16 sm:py-20 bg-slate-50/60 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Budget &amp; Planning
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Build a complete cost picture before committing
            </h2>
            <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
              Tuition is only one part of the decision. Compare the institution’s published fees with accommodation, food, insurance, transport, books, equipment and other course expenses. Include travel, initial settling-in costs and a reserve for unexpected expenses.
            </p>

            {/* Static Semantic Cost Table (Zero calculators, sliders or inputs) */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200/90 shadow-2xs bg-white">
              <table className="w-full text-left border-collapse text-sm sm:text-base">
                <caption className="sr-only">Costs to check with your family</caption>
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-[#0B1B3A] font-bold">
                    <th scope="col" className="p-4 sm:p-5 w-1/3">
                      Cost area
                    </th>
                    <th scope="col" className="p-4 sm:p-5">
                      What to confirm
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <th scope="row" className="p-4 sm:p-5 font-semibold text-slate-900 align-top">
                      Course fees
                    </th>
                    <td className="p-4 sm:p-5 leading-relaxed">
                      International tuition, compulsory charges and payment dates
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <th scope="row" className="p-4 sm:p-5 font-semibold text-slate-900 align-top">
                      Housing
                    </th>
                    <td className="p-4 sm:p-5 leading-relaxed">
                      Rent, deposits, utilities and realistic availability
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <th scope="row" className="p-4 sm:p-5 font-semibold text-slate-900 align-top">
                      Daily living
                    </th>
                    <td className="p-4 sm:p-5 leading-relaxed">
                      Food, transport, insurance and personal essentials
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <th scope="row" className="p-4 sm:p-5 font-semibold text-slate-900 align-top">
                      Arrival and study setup
                    </th>
                    <td className="p-4 sm:p-5 leading-relaxed">
                      Travel, temporary accommodation and required equipment
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <th scope="row" className="p-4 sm:p-5 font-semibold text-slate-900 align-top">
                      Contingency
                    </th>
                    <td className="p-4 sm:p-5 leading-relaxed">
                      Funds available if costs rise or plans change
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
              Use written information from the institution and realistic housing options for the city you are considering. Review EduCanada’s cost guidance, but do not treat a national average as your personal quotation.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. SEPARATE FINANCIAL EVIDENCE FROM EVERYDAY SPENDING (S08 Funds) */}
        {/* ========================================================================= */}
        <section id="finances" className="scroll-mt-36 py-16 sm:py-20 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Funding Evidence
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Separate financial evidence from everyday spending
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                The amount you need to demonstrate for a study permit is not a complete personal budget. IRCC considers tuition, living expenses and transportation, with requirements affected by family circumstances, application timing and where you will study.
              </p>
              <p>
                Review the official financial support requirements. For a longer programme, consider how you will finance the full course, not only the initial year.
              </p>
              <p>
                If parents or another supporter will contribute, make the funding source and availability understandable and truthful. Avoid unexplained deposits, borrowed documents or arrangements you cannot substantiate. Confirm what evidence your own application requires before moving money or paying non-refundable charges.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 9. TREAT SCHOLARSHIPS AS POSSIBILITIES, NOT YOUR BASE BUDGET (S09) */}
        {/* ========================================================================= */}
        <section id="scholarships" className="scroll-mt-36 py-16 sm:py-20 bg-slate-50/60 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Scholarship Policy
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Treat scholarships as possibilities, not your base budget
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                Scholarships differ by institution, study level, nationality, subject and application cycle. Some cover only part of tuition. Others have conditions, separate applications or restrictions on how funding can be used.
              </p>
              <p>
                Check whether Pakistani applicants are eligible, whether the award applies to your programme and whether it is renewable. Read the decision date, payment timing and obligations attached to the award. Admission does not automatically mean a scholarship has been awarded.
              </p>
              <p>
                Explore official scholarship information and the institution’s own funding pages. Until funding is confirmed in writing, plan without it. An expected award should not disguise an unaffordable course.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 10. DO NOT RELY ON A PART-TIME JOB TO FINANCE STUDY (S10 Work) */}
        {/* ========================================================================= */}
        <section id="work" className="scroll-mt-36 py-16 sm:py-20 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Work Permissions
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Do not rely on a part-time job to finance study
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                Some international students may work off campus when they meet the applicable conditions. Permission depends on your circumstances and study permit conditions; it is not an unrestricted entitlement for every student or course.
              </p>
              <p>
                Read the current off-campus work rules before accepting work. Scheduled breaks, changes in enrolment and other circumstances can affect what is permitted.
              </p>
              <p>
                A job is not guaranteed, and earnings may vary. Your funding plan should work without assumed employment income. Allow enough time for classes and assignments instead of choosing a programme on the expectation that work will cover tuition and rent.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 11. REVIEW POST-STUDY OPTIONS WITHOUT A PR PROMISE (S11 Post-study) */}
        {/* ========================================================================= */}
        <section id="post-study" className="scroll-mt-36 py-16 sm:py-20 bg-slate-50/60 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              PGWP &amp; Immigration Facts
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Review post-study options without a PR promise
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                A PGWP is a separate immigration permission with eligibility requirements. These include programme and institution requirements and, where applicable, language and field-of-study requirements. Application dates and your study history can matter.
              </p>
              <p>
                Check IRCC’s PGWP eligibility guidance before choosing a programme, and review it again when preparing an application. Do not assume a particular work permit duration from a course advertisement.
              </p>
              <p>
                Graduation, a PGWP and Canadian work experience do not guarantee permanent residence. If long-term immigration is important to you, assess it separately under the rules and your circumstances at the relevant time.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 12. WHAT TO PREPARE FOR A USEFUL ASSESSMENT (S12 Preparation) */}
        {/* ========================================================================= */}
        <section id="preparation" className="scroll-mt-36 py-16 sm:py-20 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Consultation Readiness
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              What to prepare for a useful assessment
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                Bring a clear summary of your education, subject interests, intended qualification and preferred intake. Include any study gaps or changes of direction so the discussion can focus on an honest academic explanation.
              </p>
              <p>
                Think about the funding your family can reliably provide and any constraints on location or course length.
              </p>
              <p>
                Tell us if you already hold an offer, have a previous refusal or are considering Quebec. Those details can change the questions that need attention. Never conceal a material fact to make an application appear simpler.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 13. MOVE FROM UNCERTAINTY TO A DOCUMENTED DECISION (S13 Decisions) */}
        {/* ========================================================================= */}
        <section id="decisions" className="scroll-mt-36 py-16 sm:py-20 bg-slate-50/60 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Decision Framework
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Move from uncertainty to a documented decision
            </h2>
            <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
              A useful assessment should make the next decision clearer, not push you towards the first available offer. Ask for a comparison that explains academic fit, cost commitments and the checks still outstanding.
            </p>

            {/* Semantic Comparison Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200/90 shadow-2xs bg-white">
              <table className="w-full text-left border-collapse text-sm sm:text-base">
                <caption className="sr-only">Decision standards comparison</caption>
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-[#0B1B3A] font-bold">
                    <th scope="col" className="p-4 sm:p-5 w-1/2">
                      Before deciding
                    </th>
                    <th scope="col" className="p-4 sm:p-5 w-1/2">
                      A better decision standard
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 sm:p-5 leading-relaxed font-medium text-slate-800">
                      Choosing from a course title
                    </td>
                    <td className="p-4 sm:p-5 leading-relaxed">
                      Comparing modules and entry requirements
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 sm:p-5 leading-relaxed font-medium text-slate-800">
                      Assuming DLI means PGWP eligibility
                    </td>
                    <td className="p-4 sm:p-5 leading-relaxed">
                      Checking the exact programme and applicable rules
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 sm:p-5 leading-relaxed font-medium text-slate-800">
                      Looking only at tuition
                    </td>
                    <td className="p-4 sm:p-5 leading-relaxed">
                      Understanding living costs and payment timing
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 sm:p-5 leading-relaxed font-medium text-slate-800">
                      Expecting scholarship support
                    </td>
                    <td className="p-4 sm:p-5 leading-relaxed">
                      Separating confirmed funds from possible awards
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
              These are planning standards, not claims about past student outcomes. Before agreeing to paid support, request the service scope, charges and exclusions in writing. Confirm which institution or authority makes each decision.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 14. WHY START WITH AN HONEST CONVERSATION? (S14 Honesty) */}
        {/* ========================================================================= */}
        <section id="honesty" className="scroll-mt-36 py-16 sm:py-20 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Advisory Ethics
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Why start with an honest conversation?
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                You deserve room to ask difficult questions before your family commits money. ProConsulting’s Canada assessment is a starting point for discussing your profile, the options worth investigating and the information still needed.
              </p>

              {/* Mandatory Protected Honesty Sentence */}
              <div className="p-4 rounded-xl bg-slate-50 border-l-4 border-[#FF4D6D] text-sm sm:text-base font-semibold text-[#0B1B3A]">
                No consultant can guarantee a scholarship, admission or visa, and we do not.
              </div>

              <p>
                Ask who will handle each part of your enquiry and what assistance is included. Where regulated immigration advice or representation is needed, verify the individual’s authorisation before appointing them. Consultancy support does not replace official guidance or give an application special treatment.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 15. QUESTIONS PAKISTANI STUDENTS AND PARENTS ASK (S15 FAQs) */}
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
                    Questions Pakistani students and parents ask
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Clear answers on admission, DLI checks, study permits, PAL/TAL requirements, funding evidence, work permission and PGWP eligibility.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-4">
                {CANADA_FAQS.map((faq) => (
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
        {/* 16. TAKE THE NEXT STEP WITH CLEARER QUESTIONS (S16 Assessment & CTA) */}
        {/* ========================================================================= */}
        <section id="assessment" className="scroll-mt-36 bg-[#0B1B3A] text-white py-16 sm:py-20 lg:py-24 border-t border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/15 px-3 py-1 rounded-full mb-3 inline-block">
                Start Your Evaluation
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                Take the next step with clearer questions
              </h2>
              <p className="text-base sm:text-lg text-slate-300 mt-4 leading-relaxed">
                You do not need every answer before asking for guidance. Start with your current qualification, the subject you want to study and the questions holding you back. Parents and funding supporters can be part of the conversation.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Link
                to={CANADA_SEO.ctaHref}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-md transition-all hover:scale-[1.01]"
              >
                <span>{CANADA_SEO.ctaText}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <span className="text-xs sm:text-sm text-slate-400">
                Choose Canada on the assessment page to start a conversation about your study plans. Read our{" "}
                <Link to="/education/privacy-policy" className="text-white underline hover:text-[#FF4D6D]">
                  privacy policy
                </Link>{" "}
                before submitting.
              </span>
            </div>

            {/* Mandatory Protected Honesty Sentence */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 border-l-4 border-l-[#FF4D6D] text-xs sm:text-sm font-semibold text-white shadow-sm">
              No consultant can guarantee a scholarship, admission or visa, and we do not.
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              If Canada is not the right fit,{" "}
              <Link to="/education/destinations" className="text-[#FF4D6D] font-semibold underline hover:text-pink-400">
                compare study destinations
              </Link>{" "}
              rather than forcing an unsuitable application. For wider support, explore our{" "}
              <Link to="/education/services" className="text-[#FF4D6D] font-semibold underline hover:text-pink-400">
                education services
              </Link>
              .
            </p>

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
                  to="/education/destinations/australia"
                  className="px-4 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-sm font-semibold text-white hover:border-[#FF4D6D] transition-colors"
                >
                  Compare Australia
                </Link>
                <Link
                  to="/education/destinations/study-in-new-zealand"
                  className="px-4 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-sm font-semibold text-white hover:border-[#FF4D6D] transition-colors"
                >
                  Compare New Zealand
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
                Initial consultations are free. We discuss Canadian DLI options, admission criteria, PAL/TAL requirements and realistic funding with complete transparency.
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
            to={CANADA_SEO.ctaHref}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-md transition-colors"
          >
            <span>{CANADA_SEO.ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      <Footer />
    </div>
  );
}
