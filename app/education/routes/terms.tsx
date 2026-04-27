"use client";

import { Link } from "react-router";
import { Navbar } from "~/education/components/ui/Navbar";
import { Footer } from "~/education/components/ui/footer";
import { pageMeta, canonicalLink } from "~/education/lib/seo";
import type { Route } from "./+types/terms";

const BRAND = { navy: "#0B1B3A", pink: "#FF4D6D" };

const TITLE = "Terms of Service | ProConsulting";
const DESCRIPTION = "Terms of service for using Pro Consulting website and education consultancy services.";

export function meta(args?: Route.MetaArgs) {
  const pathname = args?.location?.pathname ?? "/terms";
  return [
    { title: TITLE },
    { name: "description", content: DESCRIPTION },
    ...pageMeta({ title: TITLE, description: DESCRIPTION, pathname }),
  ];
}

export function links(args?: any) {
  return canonicalLink(args?.location?.pathname ?? "/terms");
}

export default function Terms() {
  return (
    <>
      <Navbar />
      <section className="border-b border-slate-200/80 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-10 md:pt-16 md:pb-14">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#0B1B3A] transition-colors">Home</Link>
            <span aria-hidden>/</span>
            <span className="text-[#0B1B3A] font-medium">Terms of Service</span>
          </nav>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0B1B3A] tracking-tight">Terms of Service</h1>
          <div className="mt-2 w-16 h-1 rounded-full bg-[#FF4D6D]" />
          <p className="mt-4 text-slate-600">Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
      </section>
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 prose prose-slate prose-headings:text-[#0B1B3A]">
          <p className="text-slate-600 leading-relaxed">
            By using the Pro Consulting website and our services, you agree to these terms. Please read them carefully.
          </p>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: BRAND.navy }}>Use of our services</h2>
          <p className="text-slate-600 leading-relaxed">
            Our website and consultancy services are provided for lawful purposes related to education and study-abroad guidance. You agree to provide accurate information when requesting consultations or using our services and not to misuse our site or systems.
          </p>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: BRAND.navy }}>Consultancy and advice</h2>
          <p className="text-slate-600 leading-relaxed">
            Guidance we provide (including on admissions, visas, and destinations) is general and informative. Final decisions and outcomes depend on institutions, embassies, and your own circumstances. We are not responsible for decisions made by third parties or for outcomes beyond our control.
          </p>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: BRAND.navy }}>Intellectual property</h2>
          <p className="text-slate-600 leading-relaxed">
            Content on this site (text, logos, images) is owned by Pro Consulting or its licensors. You may not copy, modify, or distribute it without our prior written consent.
          </p>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: BRAND.navy }}>Limitation of liability</h2>
          <p className="text-slate-600 leading-relaxed">
            To the extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of our website or services. Our liability is limited to the extent permitted under applicable law.
          </p>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: BRAND.navy }}>Changes and contact</h2>
          <p className="text-slate-600 leading-relaxed">
            We may update these terms from time to time. Continued use after changes constitutes acceptance. For questions, contact us at{" "}
            <a href="mailto:contact@proconsulting.uk" className="font-medium" style={{ color: BRAND.pink }}>contact@proconsulting.uk</a>.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
