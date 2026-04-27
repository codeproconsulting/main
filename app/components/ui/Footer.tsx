"use client";

import { Link } from "react-router";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaEnvelope,
  FaLocationDot,
  FaPhone,
  FaArrowRightLong
} from 'react-icons/fa6';
import { CONTACT, SOCIAL, BRAND, EDUCATION_URL, IMMIGRATION_URL } from "../../lib/constants";

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/education/blog", label: "Blog", external: true },
  { to: "/contact", label: "Get free consultation" },
];

function FooterLink({ to, children, external }: { to: string; children: React.ReactNode; external?: boolean }) {
  const linkClass =
    "text-white hover:text-white transition-colors text-sm flex items-center gap-2 group rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1B3A]";
  if (external) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className={linkClass}>
        <span className="w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: BRAND.pink }} />
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={linkClass}>
      <span className="w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: BRAND.pink }} />
      {children}
    </Link>
  );
}

function SocialIcon({ icon, href, ariaLabel }: { icon: React.ReactNode; href: string; ariaLabel: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#FF4D6D] hover:text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1B3A]"
      aria-label={ariaLabel}
    >
      {icon}
    </a>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative pt-16 pb-8 overflow-hidden site-footer"
      style={{ backgroundColor: BRAND.navy }}
    >
      {/* Subtle grid – same as education */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none"
        aria-hidden
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-white/10">
          {/* Brand + tagline + social – logo from this site's public folder */}
          <div className="space-y-5">
            <Link
              to="/"
              className="inline-block rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1B3A]"
            >
              <img src="/logo.png" alt="Pro Consulting" className="h-9 w-auto object-contain" />
            </Link>
            <p className="text-white text-sm leading-relaxed max-w-xs">
              Opening doors to a brighter future. Expert guidance on study abroad, visas, and university applications.
            </p>
            <div className="flex items-center gap-3">
              <SocialIcon icon={<FaFacebook className="w-4 h-4" />} href={SOCIAL.facebook} ariaLabel="FaFacebook" />
              <SocialIcon icon={<FaInstagram className="w-4 h-4" />} href={SOCIAL.instagram} ariaLabel="FaInstagram" />
              <SocialIcon icon={<FaLinkedin className="w-4 h-4" />} href={SOCIAL.linkedin} ariaLabel="LinkedIn" />
              <SocialIcon icon={<XIcon className="w-4 h-4" />} href="https://x.com/proconsulting_" ariaLabel="X (Twitter)" />
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map(({ to, label, external }) => (
                <li key={to}>
                  <FooterLink to={to} external={external}>{label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Education & Immigration */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-5">Education</h3>
            <ul className="space-y-3">
              <li><a href={EDUCATION_URL} className="text-white hover:text-white text-sm flex items-center gap-2 group transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1B3A]"><span className="w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: BRAND.pink }} />Study Abroad</a></li>
              <li><a href={`${EDUCATION_URL}/destinations`} className="text-white hover:text-white text-sm flex items-center gap-2 group transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1B3A]"><span className="w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: BRAND.pink }} />Destinations</a></li>
              <li><a href={`${EDUCATION_URL}/services`} className="text-white hover:text-white text-sm flex items-center gap-2 group transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1B3A]"><span className="w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: BRAND.pink }} />Services</a></li>
            </ul>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-5 mt-6">Immigration</h3>
            <ul className="space-y-3">
              <li><a href={IMMIGRATION_URL} className="text-white hover:text-white text-sm flex items-center gap-2 group transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1B3A]"><span className="w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: BRAND.pink }} />Visa Services</a></li>
            </ul>
          </div>

          {/* Contact + CTA – same structure as education */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-5">Contact</h3>
            <ul className="space-y-4 text-white text-sm">
              <li className="flex items-start gap-3">
                <FaLocationDot className="w-5 h-5 shrink-0 mt-0.5" style={{ color: BRAND.pink }} />
                <span className="leading-relaxed">{CONTACT.address}</span>
              </li>
              <li className="flex flex-col gap-2">
                <a href="tel:+92516135834" className="flex items-center gap-2 hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1B3A]">
                  <FaPhone className="w-4 h-4 shrink-0" style={{ color: BRAND.pink }} />
                  <span>PK: {CONTACT.phonePK}</span>
                </a>
                <a href="tel:+923701902123" className="flex items-center gap-2 hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1B3A]">
                  <FaPhone className="w-4 h-4 shrink-0" style={{ color: BRAND.pink }} />
                  <span>PK: {CONTACT.phonePK2}</span>
                </a>
                <a href="tel:+447432406993" className="flex items-center gap-2 hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1B3A]">
                  <FaPhone className="w-4 h-4 shrink-0" style={{ color: BRAND.pink }} />
                  <span>UK: {CONTACT.phoneUK}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1B3A]">
                  <FaEnvelope className="w-5 h-5 shrink-0" style={{ color: BRAND.pink }} />
                  <span>{CONTACT.email}</span>
                </a>
              </li>
            </ul>
            <Link
              to="/?consult=open"
              className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1B3A]"
              style={{ backgroundColor: BRAND.pink }}
            >
              Get Free Consultation
              <FaArrowRightLong className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Bottom bar – same as education */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white text-sm text-center sm:text-left">
            © {currentYear} Pro Consulting. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <a href="/education/privacy-policy" className="text-white hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1B3A]">Privacy Policy</a>
            <a href="/education/terms" className="text-white hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1B3A]">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
