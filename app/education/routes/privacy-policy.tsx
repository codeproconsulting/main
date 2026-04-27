"use client";

import { Link } from "react-router";
import { Navbar } from "~/education/components/ui/Navbar";
import { Footer } from "~/education/components/ui/footer";
import { pageMeta, canonicalLink } from "~/education/lib/seo";
import type { Route } from "./+types/privacy-policy";

const BRAND = { navy: "#0B1B3A", pink: "#FF4D6D" };

const TITLE = "Privacy Policy | ProConsulting";
const DESCRIPTION = "Privacy policy for Pro Consulting. How we collect, use, and protect your personal information.";

export function meta(args?: Route.MetaArgs) {
  const pathname = args?.location?.pathname ?? "/privacy-policy";
  return [
    { title: TITLE },
    { name: "description", content: DESCRIPTION },
    ...pageMeta({ title: TITLE, description: DESCRIPTION, pathname }),
  ];
}

export function links(args?: any) {
  return canonicalLink(args?.location?.pathname ?? "/privacy-policy");
}

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <section className="border-b border-slate-200/80 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-10 md:pt-16 md:pb-14">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#0B1B3A] transition-colors">Home</Link>
            <span aria-hidden>/</span>
            <span className="text-[#0B1B3A] font-medium">Privacy Policy</span>
          </nav>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0B1B3A] tracking-tight">Privacy Policy</h1>
          <div className="mt-2 w-16 h-1 rounded-full bg-[#FF4D6D]" />
          <p className="mt-4 text-slate-600">Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
      </section>
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 prose prose-slate prose-headings:text-[#0B1B3A]">
          <p className="text-slate-600 leading-relaxed">
            Pro Consulting (&quot;we&quot;, &quot;us&quot;) is committed to protecting your privacy. This policy explains how we collect, use, store, and protect your personal information when you use our website and services.
          </p>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: BRAND.navy }}>Information we collect</h2>
          <p className="text-slate-600 leading-relaxed">
            We may collect information you provide when you contact us, request a consultation, or use our services—such as your name, email address, phone number, country of interest, and study goals. We may also collect usage data (e.g. pages visited) to improve our site.
          </p>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: BRAND.navy }}>How we use your information</h2>
          <p className="text-slate-600 leading-relaxed">
            We use your information to respond to your enquiries, provide counselling and application support, send relevant updates (with your consent), and improve our services. We do not sell your personal data to third parties.
          </p>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: BRAND.navy }}>Data security and retention</h2>
          <p className="text-slate-600 leading-relaxed">
            We take reasonable steps to protect your data. We retain your information only as long as needed for the purposes described above or as required by law.
          </p>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: BRAND.navy }}>Your rights</h2>
          <p className="text-slate-600 leading-relaxed">
            You may request access to, correction of, or deletion of your personal data. You can also withdraw consent for marketing communications at any time. Contact us at{" "}
            <a href="mailto:contact@proconsulting.uk" className="font-medium" style={{ color: BRAND.pink }}>contact@proconsulting.uk</a> for any privacy-related requests.
          </p>
          <p className="text-slate-500 text-sm mt-8">
            We may update this policy from time to time. Continued use of our services after changes constitutes acceptance of the updated policy.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
