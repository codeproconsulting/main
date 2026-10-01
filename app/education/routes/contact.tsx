"use client";

import { useState } from "react";
import { Link, useFetcher, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  GraduationCap,
  Globe,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Award,
  FileCheck,
  Phone,
  MapPin,
  MessageCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import type { ActionFunctionArgs } from "react-router";
import { Navbar } from "~/education/components/ui/Navbar";
import { Footer } from "~/education/components/ui/footer";
import { Button } from "~/education/components/ui/button";
import { GOOGLE_SHEET_SCRIPT_URL } from "~/education/lib/google-sheet";
import { pageMeta, canonicalLink } from "~/education/lib/seo";
import { saveApplicant, type Applicant } from "~/education/lib/applicants.server";
import type { Route } from "./+types/contact";

const BRAND = {
  navy: "#0B1B3A",
  navyLight: "#162D4D",
  pink: "#FF4D6D",
  pinkDark: "#E11D48",
  gold: "#FFA700",
};

export function meta(args?: Route.MetaArgs) {
  const pathname = args?.location?.pathname ?? "/education/contact";
  const title = "Free Visa Assessment & Study Abroad Consultation | ProConsulting";
  const description =
    "Get an instant 100% free study abroad and visa assessment. Profile evaluation, university matching, scholarship checks, and visa readiness advisory.";
  return [
    { title },
    { name: "description", content: description },
    ...pageMeta({ title, description, pathname }),
  ];
}

export function links(args?: any) {
  return canonicalLink(args?.location?.pathname ?? "/education/contact");
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const applicantData = {
      fullName: (formData.get("fullName") as string) || "",
      email: (formData.get("email") as string) || "",
      phone: (formData.get("phone") as string) || "",
      city: (formData.get("city") as string) || "",
      currentEducation: (formData.get("currentEducation") as string) || "",
      majorSubject: (formData.get("majorSubject") as string) || "",
      gradeScore: (formData.get("gradeScore") as string) || "",
      passingYear: (formData.get("passingYear") as string) || "",
      targetCountry: (formData.get("targetCountry") as string) || "",
      targetDegree: (formData.get("targetDegree") as string) || "",
      targetIntake: (formData.get("targetIntake") as string) || "",
      budgetRange: (formData.get("budgetRange") as string) || "",
      needScholarship: (formData.get("needScholarship") as string) || "",
      englishTest: (formData.get("englishTest") as string) || "",
      hasRefusal: (formData.get("hasRefusal") as string) || "",
      studyGap: (formData.get("studyGap") as string) || "",
      notes: (formData.get("notes") as string) || "",
    };

    const saved = saveApplicant(applicantData);
    return { success: true, applicant: saved };
  } catch (error) {
    console.error("Action error:", error);
    return { success: false, error: "Failed to submit assessment" };
  }
}

export default function Contact() {
  const fetcher = useFetcher<{ success: boolean; applicant?: Applicant; error?: string }>();
  const isSubmitting = fetcher.state === "submitting";
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const queryCountry = searchParams.get("country");

  const [step, setStep] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [form, setForm] = useState({
    // Step 1: Contact
    fullName: "",
    email: "",
    phone: "",
    city: "Islamabad",
    // Step 2: Academic
    currentEducation: "Bachelor's Degree (4-Year BS)",
    majorSubject: "",
    gradeScore: "",
    passingYear: "2025",
    // Step 3: Study Intent & Budget
    targetCountry: queryCountry || "United Kingdom",
    targetDegree: "Master's / Postgraduate (1 or 2 Years)",
    targetIntake: "September / Fall 2026",
    budgetRange: "£10,000 - £16,000 / year ($13k - $20k)",
    needScholarship: "Yes - Looking for Merit Scholarship",
    englishTest: "No Test Taken Yet (Looking for MOI Waiver / Online Test)",
    hasRefusal: "No Refusals (Clean Travel / Visa Record)",
    studyGap: "No Study Gap (Fresh Graduate / Currently Enrolled)",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleNextStep1 = () => {
    if (!form.fullName.trim()) {
      setErrorMessage("Please enter your full name as on passport/CNIC.");
      return;
    }
    if (!form.phone.trim()) {
      setErrorMessage("Please enter your active WhatsApp or phone number.");
      return;
    }
    if (!form.email.trim() || !form.email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!form.city.trim()) {
      setErrorMessage("Please enter your city of residence.");
      return;
    }
    setErrorMessage("");
    setStep(2);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  const handleNextStep2 = () => {
    if (!form.majorSubject.trim()) {
      setErrorMessage("Please enter your major field of study.");
      return;
    }
    if (!form.gradeScore.trim()) {
      setErrorMessage("Please enter your CGPA or marks percentage.");
      return;
    }
    setErrorMessage("");
    setStep(3);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Submit to React Router Action
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fetcher.submit(fd, { method: "post" });

    // Client-side fallback backup in localStorage for dashboard
    try {
      const existing = JSON.parse(
        localStorage.getItem("proconsulting_local_applicants") || "[]"
      );
      const localBackup = {
        ...form,
        id: `PC-${Math.floor(100000 + Math.random() * 900000)}`,
        createdAt: new Date().toISOString(),
        status: "New",
      };
      existing.unshift(localBackup);
      localStorage.setItem(
        "proconsulting_local_applicants",
        JSON.stringify(existing)
      );
    } catch (e) {
      // ignore
    }

    // Google Sheets Integration
    if (GOOGLE_SHEET_SCRIPT_URL) {
      try {
        await fetch(GOOGLE_SHEET_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=UTF-8" },
          body: JSON.stringify({
            ...form,
            type: "Free Visa & University Assessment",
            date: new Date().toISOString(),
          }),
        });
      } catch (err) {
        console.error("Google Sheet submission error:", err);
      }
    }

    // Meta Pixel Tracking
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Lead");
    }
  };

  const isConfirmed = fetcher.data?.success;
  const applicantResult = fetcher.data?.applicant;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* HERO BANNER */}
        <section
          className="relative py-12 md:py-16 text-white overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${BRAND.navy} 0%, #10264D 100%)`,
          }}
        >
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
            {/* Breadcrumb */}
            <nav
              className="flex items-center gap-2 text-xs md:text-sm text-slate-300 mb-5"
              aria-label="Breadcrumb"
            >
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span aria-hidden>/</span>
              <Link to="/education" className="hover:text-white transition-colors">
                Education
              </Link>
              <span aria-hidden>/</span>
              <span className="text-white font-medium">Free Assessment &amp; Consultation</span>
            </nav>

            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs md:text-sm font-semibold text-pink-300 mb-4">
                <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
                1-on-1 Free Profile Evaluation &amp; Visa Assessment
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
                Check Your Study Visa &amp; Scholarship{" "}
                <span className="text-[#FF4D6D]">Eligibility</span>
              </h1>

              <div
                className="w-24 h-1.5 mx-auto rounded-full mb-4"
                style={{
                  background: `linear-gradient(90deg, ${BRAND.pink}, ${BRAND.gold})`,
                }}
              />

              <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
                Complete the quick profile assessment below. Our certified senior education consultants will evaluate your admission chances, match matching global universities, and map your study visa roadmap.
              </p>
            </div>

            {/* STEPPER PILLS (3 Form Steps) */}
            {!isConfirmed && (
              <div className="mt-10 max-w-2xl mx-auto">
                <div className="grid grid-cols-3 gap-2 sm:gap-4 items-center">
                  {[
                    { num: 1, label: "Contact Details" },
                    { num: 2, label: "Academic Profile" },
                    { num: 3, label: "Study Goals & Budget" },
                  ].map((s) => {
                    const isActive = step === s.num;
                    const isCompleted = step > s.num;
                    return (
                      <button
                        key={s.num}
                        type="button"
                        onClick={() => {
                          if (s.num < step) setStep(s.num);
                        }}
                        className={`flex items-center gap-2 p-2.5 sm:p-3 rounded-xl border text-left transition-all ${
                          isActive
                            ? "bg-white/20 border-white text-white shadow-md ring-2 ring-pink-500/40"
                            : isCompleted
                            ? "bg-white/10 border-emerald-400/50 text-emerald-300 cursor-pointer"
                            : "bg-white/5 border-white/10 text-slate-400 opacity-60 cursor-not-allowed"
                        }`}
                      >
                        <span
                          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isCompleted
                              ? "bg-emerald-500 text-white"
                              : isActive
                              ? "bg-[#FF4D6D] text-white"
                              : "bg-white/20 text-white"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            s.num
                          )}
                        </span>
                        <span className="text-[11px] sm:text-xs font-semibold tracking-wide line-clamp-1">
                          {s.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* FORM CONTAINER */}
        <section className="py-10 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
              {/* Progress bar track */}
              {!isConfirmed && (
                <div className="h-1.5 w-full bg-slate-100">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF4D6D] to-[#E11D48] transition-all duration-300"
                    style={{
                      width: step === 1 ? "33.3%" : step === 2 ? "66.6%" : "100%",
                    }}
                  />
                </div>
              )}

              <div className="p-6 sm:p-10">
                {/* Validation Error Notice */}
                {errorMessage && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5">
                    <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {/* STEP 1: PERSONAL & CONTACT */}
                  {step === 1 && !isConfirmed && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-6"
                    >
                      <div className="border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-5 h-5 text-[#FF4D6D]" />
                          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                            Step 1: Your Contact Information
                          </h2>
                        </div>
                        <p className="text-sm text-slate-500">
                          Provide your active WhatsApp and contact details to receive your profile evaluation and university shortlist.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Full Name (as on Passport / CNIC) <span className="text-pink-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            required
                            value={form.fullName}
                            onChange={handleChange}
                            placeholder="e.g. Muhammad Ali"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm transition"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Email Address <span className="text-pink-500">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            placeholder="e.g. yourname@gmail.com"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm transition"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Mobile / WhatsApp Number <span className="text-pink-500">*</span>
                          </label>
                          <div className="flex rounded-xl border border-slate-200 overflow-hidden focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-500/20 transition">
                            <span className="bg-slate-50 text-slate-600 px-3.5 py-3 text-sm font-semibold border-r border-slate-200 flex items-center">
                              +92
                            </span>
                            <input
                              type="tel"
                              name="phone"
                              required
                              value={form.phone}
                              onChange={handleChange}
                              placeholder="300 1234567"
                              className="w-full px-4 py-3 text-slate-900 focus:outline-none text-sm"
                            />
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">
                            Our counselor will connect with you directly on this WhatsApp number.
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            City of Residence <span className="text-pink-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="city"
                            required
                            value={form.city}
                            onChange={handleChange}
                            placeholder="e.g. Islamabad, Rawalpindi, Lahore, Karachi, Peshawar"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm transition"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 border-t border-slate-100">
                        <Button
                          type="button"
                          size="lg"
                          onClick={handleNextStep1}
                          className="bg-[#0B1B3A] hover:bg-[#162D4D] text-white font-bold rounded-xl gap-2 px-8 py-3.5 shadow-md"
                        >
                          <span>Continue to Academic Profile</span>
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: ACADEMIC PROFILE */}
                  {step === 2 && !isConfirmed && (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-6"
                    >
                      <div className="border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <GraduationCap className="w-5 h-5 text-[#FF4D6D]" />
                          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                            Step 2: Academic Background &amp; Qualifications
                          </h2>
                        </div>
                        <p className="text-sm text-slate-500">
                          Accurate grades and degree details allow our counselors to match you with matching university entry criteria and scholarship brackets.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Highest Qualification Achieved <span className="text-pink-500">*</span>
                          </label>
                          <select
                            name="currentEducation"
                            value={form.currentEducation}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm bg-white"
                          >
                            <option value="Bachelor's Degree (4-Year BS)">
                              Bachelor's Degree (4-Year BS)
                            </option>
                            <option value="Intermediate / F.Sc / ICS / A-Levels">
                              Intermediate / F.Sc / ICS / A-Levels
                            </option>
                            <option value="Bachelor's Degree (2-Year BA/BSc)">
                              Bachelor's Degree (2-Year BA/BSc)
                            </option>
                            <option value="Master's / MS / MPhil Degree">
                              Master's / MS / MPhil Degree
                            </option>
                            <option value="Matric / O-Levels">
                              Matric / O-Levels
                            </option>
                            <option value="Associate Degree / DAE Diploma">
                              Associate Degree / DAE Diploma
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Major / Field of Study <span className="text-pink-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="majorSubject"
                            required
                            value={form.majorSubject}
                            onChange={handleChange}
                            placeholder="e.g. Computer Science, Business, Pre-Medical, Engineering"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            CGPA or Percentage / Marks <span className="text-pink-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="gradeScore"
                            required
                            value={form.gradeScore}
                            onChange={handleChange}
                            placeholder="e.g. 3.2 CGPA or 78% or ABB"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Year of Graduation / Completion
                          </label>
                          <select
                            name="passingYear"
                            value={form.passingYear}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm bg-white"
                          >
                            <option value="2026">2026 (Expected / Current Finalist)</option>
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                            <option value="2022">2022</option>
                            <option value="2021 or earlier">2021 or earlier</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep(1)}
                          className="gap-2 rounded-xl"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Back to Contact</span>
                        </Button>

                        <Button
                          type="button"
                          size="lg"
                          onClick={handleNextStep2}
                          className="bg-[#0B1B3A] hover:bg-[#162D4D] text-white font-bold rounded-xl gap-2 px-8 py-3.5 shadow-md"
                        >
                          <span>Continue to Study Goals</span>
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: STUDY GOALS, BUDGET & VISA INTENT */}
                  {step === 3 && !isConfirmed && (
                    <motion.form
                      key="step-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.25 }}
                      onSubmit={handleFinalSubmit}
                      className="space-y-6"
                    >
                      <div className="border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Globe className="w-5 h-5 text-[#FF4D6D]" />
                          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                            Step 3: Study Goals, Budget &amp; Visa Readiness
                          </h2>
                        </div>
                        <p className="text-sm text-slate-500">
                          Help us tailor university shortlists, intake timelines, and compliance requirements before your consultation.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Preferred Study Destination <span className="text-pink-500">*</span>
                          </label>
                          <select
                            name="targetCountry"
                            value={form.targetCountry}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm bg-white"
                          >
                            <option value="United Kingdom">United Kingdom (UK)</option>
                            <option value="Australia">Australia</option>
                            <option value="Canada">Canada</option>
                            <option value="United States">United States (USA)</option>
                            <option value="Germany & Europe">Germany &amp; Europe</option>
                            <option value="Ireland">Ireland</option>
                            <option value="Sweden">Sweden</option>
                            <option value="Turkey">Turkey</option>
                            <option value="Malaysia">Malaysia</option>
                            <option value="Open to Counselor Recommendation">
                              Open to Counselor Recommendation
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Target Degree Level <span className="text-pink-500">*</span>
                          </label>
                          <select
                            name="targetDegree"
                            value={form.targetDegree}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm bg-white"
                          >
                            <option value="Master's / Postgraduate (1 or 2 Years)">
                              Master's / Postgraduate (1 or 2 Years)
                            </option>
                            <option value="Bachelor's / Undergraduate (3 or 4 Years)">
                              Bachelor's / Undergraduate (3 or 4 Years)
                            </option>
                            <option value="1-Year Fast-Track Top-up Degree">
                              1-Year Fast-Track Top-up Degree
                            </option>
                            <option value="PhD / Doctoral Research">
                              PhD / Doctoral Research
                            </option>
                            <option value="Foundation / Pre-Master's Pathway">
                              Foundation / Pre-Master's Pathway
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Target Intake Period
                          </label>
                          <select
                            name="targetIntake"
                            value={form.targetIntake}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm bg-white"
                          >
                            <option value="September / Fall 2026">
                              September / Fall 2026 (Primary Intake)
                            </option>
                            <option value="January / Winter 2027">
                              January / Winter 2027
                            </option>
                            <option value="May / Spring 2027">
                              May / Spring 2027
                            </option>
                            <option value="Earliest Possible Intake">
                              Earliest Possible Intake
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Estimated Tuition Budget Range
                          </label>
                          <select
                            name="budgetRange"
                            value={form.budgetRange}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm bg-white"
                          >
                            <option value="Under £10,000 / year (Budget Friendly)">
                              Under £10,000 / year (Budget Friendly)
                            </option>
                            <option value="£10,000 - £16,000 / year ($13k - $20k)">
                              £10,000 - £16,000 / year ($13k - $20k)
                            </option>
                            <option value="£16,000 - £22,000 / year ($20k - $28k)">
                              £16,000 - £22,000 / year ($20k - $28k)
                            </option>
                            <option value="Above £22,000 / year (Russell Group / Top Tier)">
                              Above £22,000 / year (Russell Group / Top Tier)
                            </option>
                            <option value="Need 50% to 100% Scholarship Support">
                              Need 50% to 100% Scholarship Support
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Scholarship Requirement
                          </label>
                          <select
                            name="needScholarship"
                            value={form.needScholarship}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm bg-white"
                          >
                            <option value="Yes - Looking for Merit Scholarship">
                              Yes - Looking for Merit / Automatic Scholarship
                            </option>
                            <option value="Partial Scholarship is fine">
                              Partial Scholarship is fine
                            </option>
                            <option value="No - Self-funded student">
                              No - Self-funded student
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            English Language Proficiency Status
                          </label>
                          <select
                            name="englishTest"
                            value={form.englishTest}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm bg-white"
                          >
                            <option value="No Test Taken Yet (Looking for MOI Waiver / Online Test)">
                              No Test Taken Yet (Looking for MOI Waiver / Online Test)
                            </option>
                            <option value="IELTS Academic">IELTS Academic</option>
                            <option value="PTE Academic">PTE Academic</option>
                            <option value="Oxford ELLT">Oxford ELLT</option>
                            <option value="Duolingo English Test (DET)">
                              Duolingo English Test (DET)
                            </option>
                            <option value="Planning to Book Test Soon">
                              Planning to Book Test Soon
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Any Previous Visa Refusals? <span className="text-pink-500">*</span>
                          </label>
                          <select
                            name="hasRefusal"
                            value={form.hasRefusal}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm bg-white"
                          >
                            <option value="No Refusals (Clean Travel / Visa Record)">
                              No Refusals (Clean Travel / Visa Record)
                            </option>
                            <option value="Yes - UK Visa Refusal">
                              Yes - UK Visa Refusal
                            </option>
                            <option value="Yes - Canada Visa Refusal">
                              Yes - Canada Visa Refusal
                            </option>
                            <option value="Yes - Australia Visa Refusal">
                              Yes - Australia Visa Refusal
                            </option>
                            <option value="Yes - USA Visa Refusal">
                              Yes - USA Visa Refusal
                            </option>
                            <option value="Yes - Schengen / Other Country Refusal">
                              Yes - Schengen / Other Country Refusal
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Any Academic or Study Gap? <span className="text-pink-500">*</span>
                          </label>
                          <select
                            name="studyGap"
                            value={form.studyGap}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm bg-white"
                          >
                            <option value="No Study Gap (Fresh Graduate / Currently Enrolled)">
                              No Study Gap (Fresh Graduate / Currently Enrolled)
                            </option>
                            <option value="1 to 2 Years (With Work Experience / Job)">
                              1 to 2 Years (With Work Experience / Job)
                            </option>
                            <option value="3 to 5 Years (With Experience Letters)">
                              3 to 5 Years (With Experience Letters)
                            </option>
                            <option value="5+ Years (Require Gap Justification Advisory)">
                              5+ Years (Require Gap Justification Advisory)
                            </option>
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Specific Inquiries or University Preferences (Optional)
                          </label>
                          <textarea
                            rows={3}
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            placeholder="Mention any specific universities you are interested in, scholarship requirements, spouse visa inquiries, or financial ties questions..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm resize-none"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep(2)}
                          className="gap-2 rounded-xl"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Back to Academics</span>
                        </Button>

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-[#FF4D6D] hover:bg-[#E11D48] text-white font-bold rounded-xl gap-2 px-8 py-3.5 shadow-lg shadow-pink-500/25 transition-all hover:scale-[1.01]"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Submitting Assessment…</span>
                            </>
                          ) : (
                            <>
                              <span>Submit Free Assessment</span>
                              <CheckCircle2 className="w-4 h-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </motion.form>
                  )}

                  {/* STEP 4: SUCCESS / CONFIRMATION */}
                  {isConfirmed && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.35 }}
                      className="text-center py-6 space-y-6"
                    >
                      <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>

                      <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold mb-3">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>Assessment Ref: </span>
                          <span className="font-mono text-pink-600 font-bold">
                            {applicantResult?.id || "PC-849201"}
                          </span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                          Your Free Assessment Has Been Submitted!
                        </h2>

                        <p className="text-slate-600 max-w-lg mx-auto text-sm sm:text-base">
                          Thank you, <strong className="text-slate-900">{applicantResult?.fullName || form.fullName}</strong>.
                          Our senior counseling panel is now evaluating your academic background and matching your eligibility for{" "}
                          <strong className="text-slate-900">{applicantResult?.targetCountry || form.targetCountry}</strong>.
                        </p>
                      </div>

                      {/* Summary card */}
                      <div className="max-w-md mx-auto p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs sm:text-sm space-y-2.5">
                        <div className="flex justify-between border-b border-slate-200/60 pb-2">
                          <span className="text-slate-500">Student Name:</span>
                          <span className="font-semibold text-slate-900">
                            {applicantResult?.fullName || form.fullName}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200/60 pb-2">
                          <span className="text-slate-500">Destination:</span>
                          <span className="font-semibold text-slate-900">
                            {applicantResult?.targetCountry || form.targetCountry}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200/60 pb-2">
                          <span className="text-slate-500">Degree &amp; Intake:</span>
                          <span className="font-semibold text-slate-900">
                            {applicantResult?.targetDegree || form.targetDegree} ({applicantResult?.targetIntake || form.targetIntake})
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Budget Range:</span>
                          <span className="font-semibold text-slate-900">
                            {applicantResult?.budgetRange || form.budgetRange}
                          </span>
                        </div>
                      </div>

                      {/* Next Steps Card */}
                      <div className="max-w-xl mx-auto pt-2 text-left">
                        <h3 className="font-bold text-slate-900 text-sm mb-3 text-center sm:text-left">
                          What Happens Next:
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm text-xs space-y-1">
                            <span className="font-bold text-[#FF4D6D]">1. Profile Evaluation</span>
                            <p className="text-slate-500">
                              Our team checks your GPA and test requirements against university portals.
                            </p>
                          </div>
                          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm text-xs space-y-1">
                            <span className="font-bold text-[#FF4D6D]">2. WhatsApp Connect</span>
                            <p className="text-slate-500">
                              A senior counselor will WhatsApp/call you on (+92 {applicantResult?.phone || form.phone}) with your tailored shortlist.
                            </p>
                          </div>
                          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm text-xs space-y-1">
                            <span className="font-bold text-[#FF4D6D]">3. Visa Roadmap</span>
                            <p className="text-slate-500">
                              Guidance on scholarships, fee deposits, and document compliance.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                        <a
                          href={`https://wa.me/923701902128?text=${encodeURIComponent(
                            `Hello ProConsulting! I just submitted my study abroad assessment (Ref: ${applicantResult?.id || "PC-849201"}). Please share my university shortlist for ${applicantResult?.targetCountry || form.targetCountry}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-md transition"
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span>Instant WhatsApp Confirmation</span>
                        </a>

                        <Link
                          to="/education"
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
                        >
                          <span>Return to Homepage</span>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* WHY BOOK WITH PROCONSULTING SECTION */}
        <section className="py-14 bg-white border-t border-slate-200/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] mb-3">
                Why Book Your Consultation With ProConsulting?
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                We represent top-tier global universities and offer 100% ethical, transparent guidance from admissions to visa grants.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: ShieldCheck,
                  title: "100% Direct Partnerships",
                  desc: "Authorized partner university portals for priority application filing and exclusive institutional fee waivers.",
                  color: "text-[#0B1B3A]",
                },
                {
                  icon: Award,
                  title: "98.4% Visa Approval Rate",
                  desc: "Comprehensive financial vetting and 1-on-1 embassy interview preparation ensuring pristine compliance.",
                  color: "text-[#FFA700]",
                },
                {
                  icon: FileCheck,
                  title: "Merit Scholarship Advisory",
                  desc: "Mapping up to 50% tuition fee discounts and automatic academic excellence bursaries across UK, Aus & USA.",
                  color: "text-emerald-600",
                },
                {
                  icon: GraduationCap,
                  title: "Certified Expert Advisors",
                  desc: "British Council and ICEF trained counselors dedicated to finding the exact course that matches your budget and ambition.",
                  color: "text-[#FF4D6D]",
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-4">
                      <Icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* IN-PERSON WALK-IN BANNER */}
        <section
          className="py-12 text-white"
          style={{
            background: `linear-gradient(135deg, ${BRAND.navy} 0%, #162D4D 100%)`,
          }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-xl text-center lg:text-left">
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
                  Prefer a Direct In-Person Walk-In?
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Visit our dedicated Islamabad office located in Vista Building, I-8 Markaz, or our Birmingham UK office. Our senior counseling panel is available Monday to Saturday, 10:00 AM – 7:00 PM.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href="tel:+923701902128"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-[#FF4D6D] hover:bg-[#E11D48] text-white shadow-md transition"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call: +92 370 1902128</span>
                </a>

                <a
                  href="https://maps.google.com/?q=Vista+Building+I-8+Markaz+Islamabad"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition"
                >
                  <MapPin className="w-4 h-4" />
                  <span>View On Map</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
