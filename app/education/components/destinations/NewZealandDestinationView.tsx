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
} from "lucide-react";
import { Navbar } from "~/education/components/ui/Navbar";
import { Footer } from "~/education/components/ui/footer";
import {
  NEW_ZEALAND_FAQS,
  NEW_ZEALAND_SEO,
} from "~/education/lib/newZealandDestinationData";

export function NewZealandDestinationView() {
  const [activeAnchor, setActiveAnchor] = useState<string>("overview");
  const [showMobileCta, setShowMobileCta] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const anchors = [
        "overview",
        "qualifications",
        "providers",
        "living",
        "budget",
        "scholarships",
        "visa",
        "work",
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
    { id: "overview", label: "Goals" },
    { id: "qualifications", label: "Qualifications" },
    { id: "providers", label: "Providers" },
    { id: "living", label: "Living" },
    { id: "budget", label: "Budget" },
    { id: "scholarships", label: "Scholarships" },
    { id: "visa", label: "Visa & Offers" },
    { id: "work", label: "Work Rights" },
    { id: "faqs", label: "FAQs" },
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
            <span className="text-slate-900 font-medium">New Zealand</span>
          </nav>
        </div>
      </div>

      <main>
        {/* ========================================================================= */}
        {/* 1. HERO SECTION (White) */}
        {/* ========================================================================= */}
        <section className="bg-white pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column (7 cols): Headline, Deck, CTA */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="inline-block text-xs sm:text-sm font-semibold tracking-wide text-slate-700 bg-slate-100 px-3.5 py-1.5 rounded-full mb-4">
                    Study in New Zealand · Academic Guidance &amp; Admissions
                  </span>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold text-[#0B1B3A] tracking-tight leading-[1.12]">
                    Study in New Zealand
                  </h1>
                </div>

                {/* MANDATORY FIRST PUBLIC PARAGRAPH (verbatim) */}
                <p className="text-lg sm:text-xl font-medium text-slate-800 leading-relaxed">
                  Study in New Zealand with a clearer view of your course options, family budget and application responsibilities. ProConsulting’s free assessment gives you a place to discuss your academic background, study goals and questions before deciding what to pursue. Bring a parent or sponsor into the conversation if they will help fund your studies.
                </p>

                {/* Second Public Paragraph (verbatim) */}
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                  A good decision starts with the qualification and the full cost, not a promise about a visa or a job. Explore how New Zealand could fit your plans, what needs checking and where you may need a different option.
                </p>

                {/* Primary CTA */}
                <div className="pt-2 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <Link
                      to={NEW_ZEALAND_SEO.ctaHref}
                      className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-base font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-md hover:shadow-lg transition-all"
                    >
                      <span>{NEW_ZEALAND_SEO.ctaText}</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    <span className="text-xs text-slate-500 font-medium">
                      Free initial assessment for students and parents.
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
                    src="/destinations/new_zealand.webp"
                    alt="Study in New Zealand - Modern campuses and world-class universities"
                    className="w-full h-[370px] sm:h-[430px] object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3A] via-[#0B1B3A]/40 to-black/20" />

                  {/* Floating Top Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-white/40">
                    <img src="https://flagcdn.com/w40/nz.png" alt="New Zealand flag" className="w-5 h-3.5 object-cover rounded-xs" />
                    <span className="text-xs font-bold text-[#0B1B3A]">New Zealand</span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Safe &amp; Welcoming</span>
                  </div>

                  {/* Bottom Overlay Info with Modern Structured Badges */}
                  <div className="absolute bottom-0 inset-x-0 p-6 text-white space-y-3">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-white">
                        Study in New Zealand
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">
                        Top-ranked universities, practical institute pathways, and globally recognised qualifications.
                      </p>
                    </div>

                    <div className="pt-1 grid grid-cols-3 gap-2">
                      <div className="flex flex-col items-start gap-1 bg-white/10 backdrop-blur-md border border-white/15 p-2 rounded-xl">
                        <div className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                          <Building2 className="w-3 h-3" />
                        </div>
                        <span className="text-[11px] font-medium text-slate-100">Top 8 Unis</span>
                      </div>
                      <div className="flex flex-col items-start gap-1 bg-white/10 backdrop-blur-md border border-white/15 p-2 rounded-xl">
                        <div className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-300 flex items-center justify-center">
                          <Award className="w-3 h-3" />
                        </div>
                        <span className="text-[11px] font-medium text-slate-100">Post-Study Visa</span>
                      </div>
                      <div className="flex flex-col items-start gap-1 bg-white/10 backdrop-blur-md border border-white/15 p-2 rounded-xl">
                        <div className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-300 flex items-center justify-center">
                          <GraduationCap className="w-3 h-3" />
                        </div>
                        <span className="text-[11px] font-medium text-slate-100">Practical Study</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STICKY SUB-NAVIGATION BAR */}
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
                      className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                        isActive
                          ? "bg-[#0B1B3A] text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      {tab.label}
                    </a>
                  );
                })}
              </div>

              <Link
                to={NEW_ZEALAND_SEO.ctaHref}
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] transition-colors shrink-0"
              >
                <span>{NEW_ZEALAND_SEO.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. DECIDE WHETHER NEW ZEALAND FITS YOUR GOALS */}
        {/* ========================================================================= */}
        <section id="overview" className="scroll-mt-36 py-16 sm:py-20 bg-slate-50/60 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Course &amp; Campus Fit
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Decide whether New Zealand fits your goals
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                New Zealand deserves a place on your shortlist when a particular course offers the subject depth, learning approach and qualification you need. Compare actual modules, assessment methods, campus facilities and student support rather than choosing from scenery or a university name alone.
              </p>
              <p>
                Distance from Pakistan matters too. Discuss travel costs, time differences, accommodation and how your family will stay connected. A destination can be attractive without being the right financial or academic choice for you.
              </p>
              <p className="font-medium text-slate-900">
                If your plan only works with a large scholarship or immediate employment, pause before committing. A stronger plan remains workable when an award does not arrive or finding work takes longer than expected.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. START WITH YOUR NEXT QUALIFICATION */}
        {/* ========================================================================= */}
        <section id="qualifications" className="scroll-mt-36 py-16 sm:py-20 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Academic Background
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Start with your next qualification
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                For undergraduate study, check how each provider assesses your Pakistani qualifications, subject preparation and English evidence. Do not assume the same entry decision applies across institutions. A pathway may be an option, but it adds its own fees, time and progression conditions.
              </p>
              <p>
                For postgraduate study, compare your previous degree content with the programme’s prerequisites. A similar course title does not establish eligibility. Research programmes can involve additional proposal or supervision requirements.
              </p>
              <p>
                Ask what you will learn, how you will be assessed and whether the course supports your intended role. Keep a second option that still makes academic sense, rather than applying widely without a clear reason for each choice.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. CHECK THE PROVIDER AND THE QUALIFICATION */}
        {/* ========================================================================= */}
        <section id="providers" className="scroll-mt-36 py-16 sm:py-20 bg-slate-50/60 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Institutional Recognition
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Check the provider and the qualification
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                Use official education information to check the organisation offering your course. NZQA’s education-organisation directory is a useful starting point; check current status and the relevant programme details rather than relying on an agent’s logo collection.
              </p>
              <p>
                Then confirm the exact qualification, campus, delivery mode, intake and international-student arrangements directly with the provider. Recognition of a provider does not mean every course leads to professional registration or every immigration outcome.
              </p>
              <p>
                If you intend to practise a regulated profession, ask the relevant professional body about registration. If you expect to return to Pakistan, check recognition with the appropriate Pakistani authority before paying. Your intended employer or further-study institution may also have specific requirements.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. COMPARE PLACES TO LIVE, NOT JUST COURSE FEES */}
        {/* ========================================================================= */}
        <section id="living" className="scroll-mt-36 py-16 sm:py-20 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              City &amp; Housing Costs
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Compare places to live, not just course fees
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                Compare Auckland, Wellington, Christchurch and other study locations against the actual campus you would attend. Look at available housing, transport routes, grocery costs, heating and the distance between accommodation and classes. Do not assume a city is affordable because a course fee looks manageable.
              </p>
              <p>
                Ask whether accommodation is available, what the contract includes and when payments become due. A room advertised online is not a confirmed booking. Consider temporary arrival accommodation if you cannot move straight into a longer-term option.
              </p>
              <p>
                For parents, these practical questions often matter as much as rankings. A realistic arrival plan reduces avoidable uncertainty without pretending that moving overseas will be effortless.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. BUILD A FAMILY BUDGET BEFORE APPLYING (Static semantic table) */}
        {/* ========================================================================= */}
        <section id="budget" className="scroll-mt-36 py-16 sm:py-20 bg-slate-50/70 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Financial Preparedness
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Build a family budget before applying
            </h2>
            <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
              Separate the total cost of studying from the evidence required for a visa. They answer different questions. An immigration minimum is not a personalised estimate of what your family will actually spend.
            </p>

            {/* Static Semantic Cost Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs my-6">
              <table className="w-full text-left border-collapse text-sm sm:text-base">
                <caption className="sr-only">Costs to check with your family</caption>
                <thead>
                  <tr className="bg-[#0B1B3A] text-white">
                    <th scope="col" className="p-4 sm:p-5 font-bold text-white w-1/3">
                      Cost area
                    </th>
                    <th scope="col" className="p-4 sm:p-5 font-bold text-white w-2/3">
                      What to confirm before committing
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <th scope="row" className="p-4 sm:p-5 font-semibold text-slate-900 align-top">
                      Tuition
                    </th>
                    <td className="p-4 sm:p-5 leading-relaxed">
                      Written course fees, payment dates, deposits and any compulsory charges
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <th scope="row" className="p-4 sm:p-5 font-semibold text-slate-900 align-top">
                      Daily living
                    </th>
                    <td className="p-4 sm:p-5 leading-relaxed">
                      Housing, food, utilities, transport, communications and personal spending
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <th scope="row" className="p-4 sm:p-5 font-semibold text-slate-900 align-top">
                      Arrival
                    </th>
                    <td className="p-4 sm:p-5 leading-relaxed">
                      Flights, temporary accommodation, rental setup and essential supplies
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <th scope="row" className="p-4 sm:p-5 font-semibold text-slate-900 align-top">
                      Other commitments
                    </th>
                    <td className="p-4 sm:p-5 leading-relaxed">
                      Insurance requirements, application charges, study materials and emergency funds
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed pt-2">
              <p>
                Keep the provider’s original currency visible when comparing quotes. Exchange rates and transfer costs can change what your family pays from Pakistan. A tuition deposit normally forms part of tuition already counted; do not treat it as a second full fee.
              </p>
              <p>
                Plan how funds will remain available throughout study, including later years where relevant. Do not subtract a scholarship until its award and payment conditions are confirmed.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. TREAT SCHOLARSHIPS AS AN OPPORTUNITY, NOT THE FOUNDATION */}
        {/* ========================================================================= */}
        <section id="scholarships" className="scroll-mt-36 py-16 sm:py-20 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Scholarship Clarity
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Treat scholarships as an opportunity, not the foundation
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                Scholarship availability depends on the provider, award, subject, level and application cycle. Read the actual eligibility and selection criteria. Pakistani nationality alone does not establish eligibility, and meeting the minimum criteria does not guarantee selection.
              </p>
              <p>
                Check what the award covers, what it excludes, whether a separate application is needed and when a decision or payment would occur. A tuition reduction does not automatically cover accommodation, travel or living expenses. Renewal may depend on academic performance or other conditions.
              </p>
              <p className="font-medium text-slate-900">
                Keep an affordable alternative if funding is unsuccessful. Never make a non-refundable commitment on the assumption that an unconfirmed award will cover it. Ask the provider for written clarification when scholarship and tuition deadlines do not line up.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. UNDERSTAND OFFERS, FEES AND VISA SEQUENCING */}
        {/* ========================================================================= */}
        <section id="visa" className="scroll-mt-36 py-16 sm:py-20 bg-slate-50/60 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Application Sequence
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Understand offers, fees and visa sequencing
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                Start by checking the provider’s admission requirements and the current Immigration New Zealand requirements for your circumstances. A course offer and a visa are separate decisions. A conditional offer can leave academic, English or other requirements outstanding.
              </p>
              <p>
                Before paying tuition, establish which evidence is required at each stage. Depending on the applicable process, an applicant outside New Zealand may be able to seek approval in principle before supplying evidence of tuition payment. Do not treat this as a universal entitlement or follow it without checking the current instructions.
              </p>
              <p>
                Confirm the provider’s payment deadlines, refund policy and what happens if a visa is refused or delayed. Approval in principle is not a final visa or permission to travel. Keep written records of the agreed sequence and payments.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 9. PREPARE EVIDENCE THAT EXPLAINS YOUR CIRCUMSTANCES */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-20 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Evidence &amp; Integrity
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Prepare evidence that explains your circumstances
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                An application should accurately explain your study purpose, background and funding. Your circumstances determine which application requirements need attention.
              </p>
              <p>
                Where a parent or another person funds study, clarify the relationship, availability of money and evidence required. The correct funding route matters; not every informal promise of support meets immigration requirements. Avoid unexplained transactions or documents prepared simply to create a misleading impression.
              </p>
              <p>
                Do not submit altered records or hide a previous refusal. Ask for clarification where evidence is incomplete. A consultant can help organise a process, but the applicant remains responsible for truthful information and the authorities make their own decisions.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 10. KEEP WORK OUTSIDE YOUR ESSENTIAL FUNDING PLAN */}
        {/* ========================================================================= */}
        <section id="work" className="scroll-mt-36 py-16 sm:py-20 bg-slate-50/60 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Student Employment
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Keep work outside your essential funding plan
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                Any permission to work depends on current immigration rules and the conditions attached to your visa. Do not assume that all students, courses or study arrangements have identical rights. Check the actual conditions before accepting employment, including any differences during scheduled breaks.
              </p>
              <p>
                Work is not guaranteed. Availability, hours, wages and travel time vary, and study commitments still come first. Build your essential funding plan without depending on part-time earnings to pay tuition or meet required living-fund evidence.
              </p>
              <p>
                If working is important to your experience, discuss it as a separate practical consideration. Never choose a course solely because an advertisement suggests that student employment will make an otherwise unaffordable plan affordable.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 11. THINK BEYOND GRADUATION, INCLUDING RETURNING HOME */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-20 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Career &amp; Long-term Value
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Think beyond graduation, including returning home
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                Post-study work eligibility is conditional. The qualification, study undertaken and immigration requirements at the relevant time matter. Not every programme creates the same options, and completing a course does not guarantee a job, a work visa or permanent residence.
              </p>
              <p>
                Before accepting an offer, check the current rules for that specific qualification and consider whether the course remains worthwhile if those rules change. Separate education value from a possible immigration pathway.
              </p>
              <p>
                Build a return-to-Pakistan scenario too. Consider recognised skills, portfolio or research outputs, professional requirements and how you would explain the qualification to employers. Compare those benefits with the family’s total investment. A sound education decision should not depend entirely on staying overseas.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 12. WHAT TO DISCUSS IN YOUR FREE ASSESSMENT */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-20 bg-slate-50/60 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Profile Review
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              What to discuss in your free assessment
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                Share your recent qualification, subject interests, preferred study level, intended intake and an approximate budget range. You do not need to have chosen a university. If you have a study gap, a previous refusal or an unusual academic history, mention it so the discussion starts with the real situation.
              </p>
              <p>
                Use the conversation to identify what still needs checking: entry fit, course value, funding readiness or the order of applications. An initial discussion is not an admission decision, scholarship award or immigration approval.
              </p>
              <p>
                Before purchasing any further service, ask for its scope, fees, exclusions and responsibilities in writing. Where regulated immigration advice is needed, confirm the adviser is appropriately authorised or exempt before relying on individual advice.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 13. MOVE FORWARD IN A SENSIBLE ORDER */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-20 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Practical Steps
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Move forward in a sensible order
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                First, clarify your study goal and what your family can fund. Next, compare suitable programmes and check provider status, entry requirements and recognition. Then review offers, costs, scholarship terms and the evidence needed for your circumstances.
              </p>
              <p>
                Only make payments after understanding the relevant terms and application sequence. Keep copies of offers, receipts and correspondence. Recheck deadlines before each submission rather than assuming an earlier conversation remains current.
              </p>
              <p>
                After a visa decision, confirm travel readiness, accommodation and arrival arrangements. If a requirement is not met, reconsider the intake or course instead of rushing an incomplete application. A later, better-prepared start can be more sensible than a hurried commitment.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 14. GIVE PARENTS AND SPONSORS A CLEAR ROLE */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-20 bg-slate-50/60 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-md inline-block">
              Family Involvement
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1B3A] tracking-tight">
              Give parents and sponsors a clear role
            </h2>
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p>
                Agree who is paying each cost and when that money is available. Discuss what happens if a scholarship is unsuccessful, a decision takes longer than expected or accommodation costs more than planned. These are planning questions, not reasons to abandon a worthwhile goal.
              </p>
              <p>
                Make sure the student understands the course choice rather than simply following a family preference. Parents should be able to see the provider’s written fee terms and understand which payments may be refundable.
              </p>
              <p className="font-medium text-slate-900">
                A shared understanding of the course, costs and responsibilities helps the whole family make a more confident decision.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 15. QUESTIONS STUDENTS AND PARENTS ASK (9 Native HTML Details Accordions) */}
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
                    Questions students and parents ask
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Direct answers on admissions, language evidence, parental funding, fees, work permissions and post-study opportunities.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-4">
                {NEW_ZEALAND_FAQS.map((faq) => (
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
        {/* 16. KEEP YOUR PLAN CURRENT */}
        {/* ========================================================================= */}
        <section className="py-12 sm:py-16 bg-slate-50/60 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight">
              Keep your plan current
            </h2>
            <p className="text-slate-700 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Course terms and immigration requirements can change between your first enquiry and your application. Review your choices with an adviser before committing to an intake or making payments. A useful plan should reflect your circumstances, not a previous applicant’s experience.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 17. START WITH THE QUESTIONS THAT MATTER (Brand Navy, anchor #assessment) */}
        {/* ========================================================================= */}
        <section id="assessment" className="scroll-mt-36 bg-[#0B1B3A] text-white py-16 sm:py-20 lg:py-24 border-t border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/15 px-3 py-1 rounded-full mb-3 inline-block">
                Start Your Evaluation
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                Start with the questions that matter to your family
              </h2>
              <p className="text-base sm:text-lg text-slate-300 mt-4 leading-relaxed">
                You do not need a perfect application plan to begin. Bring your academic background, your intended direction and the concerns you want answered. Discuss New Zealand with your parent or sponsor, including what would make another destination or a later intake more suitable.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Link
                to={NEW_ZEALAND_SEO.ctaHref}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-md transition-all hover:scale-[1.01]"
              >
                <span>{NEW_ZEALAND_SEO.ctaText}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <span className="text-xs sm:text-sm text-slate-400">
                Take the next step when you are ready to discuss your options.
              </span>
            </div>

            {/* Mandatory Protected Honesty Sentence */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 border-l-4 border-l-[#FF4D6D] text-xs sm:text-sm font-semibold text-white shadow-sm">
              No consultant can guarantee a scholarship, admission or visa, and we do not.
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
                Initial consultations are free. We discuss university options, admission criteria and required funding with complete transparency.
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
            to={NEW_ZEALAND_SEO.ctaHref}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#FF4D6D] hover:bg-[#e03b5b] shadow-md transition-colors"
          >
            <span>{NEW_ZEALAND_SEO.ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      <Footer />
    </div>
  );
}
