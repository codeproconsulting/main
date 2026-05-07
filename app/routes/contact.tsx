"use client";

import { useState } from "react";
import { Navbar } from "../components/ui/Navbar";
import { Footer } from "../components/ui/Footer";
import { CONTACT, SOCIAL, BRAND } from "../lib/constants";

export function meta() {
  return [
    { title: "Contact Proconsulting | Free Consultation" },
    { name: "description", content: "Get in touch with Proconsulting for expert guidance on university admissions and visa processing. Book your free consultation today." },
  ];
}

const serviceOptions = [
  "Study Abroad",
  "Immigration",
  "Visit Visa",
  "General Enquiry",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq('track', 'Lead');
    }
  }

  return (
    <>
      <Navbar />

      <section className="py-12 md:py-16 bg-slate-50/50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0B1B3A] tracking-tight">
            Get in Touch
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Form */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-[#FF4D6D] focus:ring-2 focus:ring-[#FF4D6D]/20 outline-none transition"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-[#FF4D6D] focus:ring-2 focus:ring-[#FF4D6D]/20 outline-none transition"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-[#FF4D6D] focus:ring-2 focus:ring-[#FF4D6D]/20 outline-none transition"
                  />
                </div>
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-slate-700 mb-1">Service Interested In</label>
                  <select
                    id="service"
                    name="service"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-[#FF4D6D] focus:ring-2 focus:ring-[#FF4D6D]/20 outline-none transition"
                  >
                    {serviceOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-[#FF4D6D] focus:ring-2 focus:ring-[#FF4D6D]/20 outline-none transition resize-y"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto rounded-full px-8 py-3 text-base font-semibold text-white transition duration-200 hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF4D6D]/50"
                  style={{ backgroundColor: BRAND.pink }}
                >
                  Send Message
                </button>
                {submitted && (
                  <p className="text-sm text-green-600 mt-2">Thank you. We will get back to you soon.</p>
                )}
              </form>
            </div>

            {/* Details panel */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="font-bold text-[#0B1B3A] mb-4">Contact Details</h3>
                <ul className="space-y-3 text-slate-600 text-sm">
                  <li>
                    <span className="font-medium text-slate-700">PK:</span>{" "}
                    <a href={`tel:${CONTACT.phonePK.replace(/\D/g, "").replace(/^0/, "+92")}`} className="hover:text-[#FF4D6D]">{CONTACT.phonePK}</a>
                  </li>
                  <li>
                    <span className="font-medium text-slate-700">PK:</span>{" "}
                    <a href={`tel:${CONTACT.phonePK2.replace(/\s/g, "")}`} className="hover:text-[#FF4D6D]">{CONTACT.phonePK2}</a>
                  </li>
                  <li>
                    <span className="font-medium text-slate-700">UK:</span>{" "}
                    <a href={`tel:${CONTACT.phoneUK.replace(/\s/g, "")}`} className="hover:text-[#FF4D6D]">{CONTACT.phoneUK}</a>
                  </li>
                  <li>
                    <a href={`mailto:${CONTACT.email}`} className="hover:text-[#FF4D6D]">{CONTACT.email}</a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-[#0B1B3A] mb-2">Office</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{CONTACT.address}</p>
              </div>
              <a
                href={SOCIAL.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full rounded-full px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366]/50"
                style={{ backgroundColor: "#25D366" }}
              >
                Chat on WhatsApp
              </a>
              <div className="rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                <iframe
                  title="Pro Consulting office location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3318.0!2d73.08!3d33.71!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDQyJzM2LjAiTiA3M8KwMDQnNDguMCJF!5e0!3m2!1sen!2s!4v1!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
