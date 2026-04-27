"use client";

import { Link } from "react-router";
import { Navbar } from "~/education/components/ui/Navbar";
import { Footer } from "~/education/components/ui/footer";
import { pageMeta, canonicalLink } from "~/education/lib/seo";
import type { Route } from "./+types/cookie-policy";

const BRAND = { navy: "#0B1B3A", pink: "#FF4D6D" };

const TITLE = "Cookie Policy | ProConsulting";
const DESCRIPTION = "How Pro Consulting uses cookies and similar technologies on its website.";

export function meta(args?: Route.MetaArgs) {
  const pathname = args?.location?.pathname ?? "/cookie-policy";
  return [
    { title: TITLE },
    { name: "description", content: DESCRIPTION },
    ...pageMeta({ title: TITLE, description: DESCRIPTION, pathname }),
  ];
}

export function links(args?: any) {
  return canonicalLink(args?.location?.pathname ?? "/cookie-policy");
}

export default function CookiePolicy() {
  return (
    <>
      <Navbar />
      <section className="border-b border-slate-200/80 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-10 md:pt-16 md:pb-14">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#0B1B3A] transition-colors">Home</Link>
            <span aria-hidden>/</span>
            <span className="text-[#0B1B3A] font-medium">Cookie Policy</span>
          </nav>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0B1B3A] tracking-tight">Cookie Policy</h1>
          <div className="mt-2 w-16 h-1 rounded-full bg-[#FF4D6D]" />
          <p className="mt-4 text-slate-600">Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
      </section>
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 prose prose-slate prose-headings:text-[#0B1B3A]">
          <p className="text-slate-600 leading-relaxed">
            This cookie policy explains how Pro Consulting uses cookies and similar technologies when you visit our website.
          </p>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: BRAND.navy }}>What are cookies?</h2>
          <p className="text-slate-600 leading-relaxed">
            Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences, improve performance, and understand how the site is used.
          </p>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: BRAND.navy }}>How we use cookies</h2>
          <p className="text-slate-600 leading-relaxed">
            We use a cookie to remember your consent choice. If you accept &quot;Accept all&quot;, we also set a first-party session cookie to help us understand how the site is used and improve your experience (e.g. remembering preferences). We may use strictly necessary cookies (required for the site to function), preference cookies (e.g. language or region), and analytics cookies—only when you have agreed. We do not use cookies to track you for advertising without your consent where required by law.
          </p>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: BRAND.navy }}>Managing cookies</h2>
          <p className="text-slate-600 leading-relaxed">
            You can control or delete cookies via your browser settings. Note that disabling certain cookies may affect how the website works.
          </p>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: BRAND.navy }}>Updates and contact</h2>
          <p className="text-slate-600 leading-relaxed">
            We may update this policy from time to time. For questions about our use of cookies, contact us at{" "}
            <a href="mailto:contact@proconsulting.uk" className="font-medium" style={{ color: BRAND.pink }}>contact@proconsulting.uk</a>.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
