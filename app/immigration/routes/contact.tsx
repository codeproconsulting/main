"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, CheckCircle2, ArrowRight, Loader2, Globe, Send } from "lucide-react";
import { Navbar } from "~/immigration/components/ui/Navbar";
import { Footer } from "~/immigration/components/ui/footer";
import { destinations } from "~/immigration/lib/destinations";
import type { Route } from "./+types/contact";

const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SHEET_SCRIPT_URL;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Free Consultation – ProConsulting Immigration" },
    {
      name: "description",
      content: "Book a free immigration consultation. Share your details and we’ll get back to you about visit visas, family routes, immigration, or appeals.",
    },
  ];
}

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  countryOfResidence: string;
  destinationCountry: string;
  serviceType: string;
};

const initialForm: FormState = {
  fullName: "",
  email: "",
  phone: "",
  countryOfResidence: "",
  destinationCountry: "",
  serviceType: "",
};

export default function Contact() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    if (!form.fullName || !form.email || !form.phone || !form.serviceType || !form.destinationCountry) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!SCRIPT_URL) {
      setError("Form submission is not configured yet. Please contact us via email or phone.");
      return;
    }

    setSubmitting(true);
    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify({
          source: "immigration_site_free_consultation",
          ...form,
        }),
      });

      setSuccess("Thank you! Your request has been sent successfully. We will get back to you shortly.");
      setForm(initialForm);
    } catch (err) {
      setError("Something went wrong. Please try again or contact us directly via WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <Navbar />
      
      {/* Hero Header */}
      <div className="bg-[#0B1B3A] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              Start Your Journey <span className="text-pink-500">Today</span>
            </h1>
            <p className="text-white text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Book a free consultation with our immigration experts. We simplify the complex visa process so you can focus on your future.
            </p>
          </motion.div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 -mt-12 pb-24">
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 items-start">
          
          {/* Form Card */}
          <motion.section 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                <Send className="w-5 h-5 text-pink-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#0B1B3A]">Free Consultation Form</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Full Name *</label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={onChange("fullName")}
                    className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-4 py-3.5 text-slate-900 transition-all focus:border-pink-500 focus:bg-white focus:outline-none"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Email Address *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={onChange("email")}
                    className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-4 py-3.5 text-slate-900 transition-all focus:border-pink-500 focus:bg-white focus:outline-none"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={onChange("phone")}
                    className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-4 py-3.5 text-slate-900 transition-all focus:border-pink-500 focus:bg-white focus:outline-none"
                    placeholder="+92 3XX XXXXXXX"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Current Residence</label>
                  <input
                    type="text"
                    value={form.countryOfResidence}
                    onChange={onChange("countryOfResidence")}
                    className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-4 py-3.5 text-slate-900 transition-all focus:border-pink-500 focus:bg-white focus:outline-none"
                    placeholder="Country name"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Target Destination *</label>
                  <div className="relative">
                    <select
                      value={form.destinationCountry}
                      onChange={onChange("destinationCountry")}
                      className="w-full appearance-none rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-4 py-3.5 text-slate-900 transition-all focus:border-pink-500 focus:bg-white focus:outline-none"
                      required
                    >
                      <option value="">Select country</option>
                      {destinations.map((d) => (
                        <option key={d.id} value={d.slug}>{d.name}</option>
                      ))}
                    </select>
                    <Globe className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Visa Category *</label>
                  <select
                    value={form.serviceType}
                    onChange={onChange("serviceType")}
                    className="w-full appearance-none rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-4 py-3.5 text-slate-900 transition-all focus:border-pink-500 focus:bg-white focus:outline-none"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="visit-visa">Visit Visa</option>
                    <option value="family-reunion">Family Reunion</option>
                    <option value="immigration">Skilled Migration</option>
                    <option value="appeal">Visa Refusal / Appeal</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>



              {error && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-red-50 text-red-700 text-sm font-medium border border-red-100">
                  {error}
                </motion.div>
              )}
              
              {success && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-100 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5" />
                  {success}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full group relative overflow-hidden rounded-2xl bg-[#0B1B3A] py-4 text-white font-bold transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <div className="relative z-10 flex items-center justify-center gap-2">
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Book Free Consultation</span>
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </form>
          </motion.section>

          {/* Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Contact Details */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/30">
              <h3 className="text-xl font-bold text-[#0B1B3A] mb-6">Contact Information</h3>
              <div className="space-y-6">
                <a href="mailto:info@proconsulting.uk" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-pink-50 transition-colors">
                    <Mail className="w-5 h-5 text-blue-600 group-hover:text-pink-600 transition-colors" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Email Us</p>
                    <p className="text-slate-900 font-bold group-hover:text-pink-600 transition-colors">info@proconsulting.uk</p>
                  </div>
                </a>
                <a href="tel:03701902125" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-pink-50 transition-colors">
                    <Phone className="w-5 h-5 text-blue-600 group-hover:text-pink-600 transition-colors" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Call / WhatsApp</p>
                    <p className="text-slate-900 font-bold group-hover:text-pink-600 transition-colors">0370 1902125</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Next Steps Card */}
            <div className="bg-[#0B1B3A] rounded-[2rem] p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
              <h3 className="text-xl font-bold mb-6 relative z-10">What happens next?</h3>
              <div className="space-y-4 relative z-10">
                {[
                  "Case evaluation by experts",
                  "Call within 24 business hours",
                  "Personalized visa roadmap",
                  "Transparent fee breakdown"
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-pink-400" />
                    </div>
                    <span className="text-sm text-white">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

