"use client";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Navbar } from "~/education/components/ui/Navbar";
import { Footer } from "~/education/components/ui/footer";
import { Button } from "~/education/components/ui/button";
import { destinations } from "~/education/lib/destinations";
import { GOOGLE_SHEET_SCRIPT_URL } from "~/education/lib/google-sheet";
import { MessageCircle, Send, CheckCircle } from "lucide-react";
import type { Route } from "./+types/contact";
import { pageMeta, canonicalLink } from "~/education/lib/seo";

export function meta(args?: Route.MetaArgs) {
  const pathname = args?.location?.pathname ?? "/contact";
  const isApply = pathname === "/apply";
  const title = isApply ? "Apply Now | ProConsulting" : "Free Consultation | ProConsulting";
  const description = isApply
    ? "Apply for your study abroad consultation. Tell us your goals and we'll help with destinations, courses, and next steps."
    : "Book a free consultation with our education consultants. Tell us your goals and we'll help you with destinations, courses, and next steps.";
  return [
    { title },
    { name: "description", content: description },
    ...pageMeta({ title, description, pathname }),
  ];
}

export function links(args?: any) {
  return canonicalLink(args?.location?.pathname ?? "/contact");
}

/** Last qualification options (above matric). */
const LAST_QUALIFICATION_OPTIONS = [
  "Intermediate / F.A. / F.Sc. / A-Levels",
  "Diploma / Associate degree",
  "Undergraduate (Bachelor’s)",
  "Postgraduate (Master’s)",
  "PhD / Research",
  "Professional degree (e.g. MBBS, LLB)",
  "Other",
];

/** Destinations for form: UK first, then rest. */
const FORM_DESTINATIONS = (() => {
  const uk = destinations.find((d) => d.name === "UK");
  const rest = destinations.filter((d) => d.name !== "UK");
  return uk ? [uk, ...rest] : destinations;
})();

const PROGRAM_OPTIONS = [
  "MBA", "Computer Science", "Business Administration", "Data Science",
  "Engineering", "Mechanical Engineering", "Electrical Engineering", "Civil Engineering",
  "Medicine", "MBBS", "Nursing", "Public Health",
  "Law", "LLB", "LLM",
  "Accounting & Finance", "Economics", "International Business",
  "Psychology", "Architecture", "Design",
  "Artificial Intelligence", "Cybersecurity", "Information Technology",
  "Environmental Science", "Biotechnology", "Pharmacy",
  "English Language", "Foundation Programme", "Pre-Master's",
  "Other",
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const location = useLocation();
  const isApplyPage = location.pathname === "/apply";
  const searchParams = new URLSearchParams(location.search);
  const defaultCountry = searchParams.get("country") || "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    const phoneNumber = (data.get("phoneNumber") as string) ?? "";
    const phone = phoneNumber.trim();
    const payload = {
      name: (data.get("name") as string) ?? "",
      email: (data.get("email") as string) ?? "",
      phone,
      level: (data.get("level") as string) ?? "",
      interestedCountry: (data.get("interestedCountry") as string) ?? "",
      course: (data.get("course") as string) ?? "",
      currentCity: (data.get("currentCity") as string) ?? "",
      date: new Date().toISOString(),
    };

    if (GOOGLE_SHEET_SCRIPT_URL) {
      setSubmitting(true);
      try {
        await fetch(GOOGLE_SHEET_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=UTF-8" },
          body: JSON.stringify(payload),
        });
      } catch {
        setSubmitError(
          "Could not send to our system. Please try again or contact us directly."
        );
        setSubmitting(false);
        return;
      }
      setSubmitting(false);
    }
    setSubmitted(true);
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq('track', 'Lead');
    }
  }

  return (
    <>
      <Navbar />

      {/* Title area – match other sections */}
      <section className="py-16 md:py-24 bg-slate-50/50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6">
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-3" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <span aria-hidden>/</span>
            <span className="text-slate-900 font-medium">{isApplyPage ? "Apply Now" : "Contact"}</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[#FF4D6D] mb-1">
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">{isApplyPage ? "Apply Now" : "Free Consultation"}</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
                {isApplyPage ? "Apply for your study abroad consultation" : "Get in touch with our consultants"}
              </h1>
              <p className="mt-2 text-slate-600 text-base lg:text-lg max-w-2xl">
                Fill in the form below and we’ll follow up to discuss your study plans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form section – align with other pages */}
      <section className="pt-8 pb-16 md:pt-10 md:pb-24 bg-slate-50/50">
        <div className="max-w-4xl mx-auto px-6">
            {submitted ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-4">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  Thank you for reaching out
                </h2>
                <p className="text-slate-600 mb-4 text-sm">
                  We will contact you back as soon as possible.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSubmitted(false)}
                >
                  Submit another enquiry
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-5"
              >
                {/* Row 1: name + email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-0.5">
                      Full name <span className="text-pink-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition"
                      placeholder="e.g. Alex Johnson"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-0.5">
                      Email <span className="text-pink-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Row 2: phone + current city */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700 mb-0.5">
                      Phone <span className="text-pink-500">*</span>
                    </label>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      required
                      autoComplete="tel"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition"
                      placeholder="e.g. 0300 1234567"
                    />
                  </div>
                  <div>
                    <label htmlFor="currentCity" className="block text-sm font-medium text-slate-700 mb-0.5">
                      Current city <span className="text-pink-500">*</span>
                    </label>
                    <input
                      id="currentCity"
                      name="currentCity"
                      type="text"
                      required
                      autoComplete="address-level2"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition text-sm"
                      placeholder="e.g. Lahore, Karachi"
                    />
                  </div>
                </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <div>
                  <label htmlFor="interestedCountry" className="block text-sm font-medium text-slate-700 mb-1">
                    Interested country <span className="text-pink-500">*</span>
                  </label>
                  <select
                    id="interestedCountry"
                    name="interestedCountry"
                    defaultValue={defaultCountry}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition"
                  >
                    <option value="">Select country</option>
                    {FORM_DESTINATIONS.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="level" className="block text-sm font-medium text-slate-700 mb-1">
                    Your last qualification <span className="text-pink-500">*</span>
                  </label>
                  <select
                    id="level"
                    name="level"
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition"
                  >
                    <option value="">Select qualification</option>
                    {LAST_QUALIFICATION_OPTIONS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="course" className="block text-sm font-medium text-slate-700 mb-1">
                  Course or program of interest <span className="text-pink-500">*</span>
                </label>
                <select
                  id="course"
                  name="course"
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition"
                >
                  <option value="">Select course or program</option>
                  {PROGRAM_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {submitError && (
                <p className="text-red-600 text-sm font-medium" role="alert">
                  {submitError}
                </p>
              )}
              <div className="pt-2">
                <Button
                  type="submit"
                  size="lg"
                  disabled={submitting}
                  className="w-full sm:w-auto gap-2 bg-[#FF4D6D] hover:bg-[#E11D48] text-white"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? "Sending…" : "Submit enquiry"}
                </Button>
              </div>
            </form>
            )}
          </div>
        </section>

      <Footer />
    </>
  );
}
