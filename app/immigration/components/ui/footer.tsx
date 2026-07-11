"use client";

import { Link } from "react-router";
import { Facebook, Instagram, Linkedin, Twitter, Mail, MapPin, Phone } from "lucide-react";
import { LOGO_URL } from "~/immigration/lib/site";

const BRAND = { navy: "#0B1B3A", pink: "#FF4D6D" };

const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/immigration/about", label: "About Us" },
  { to: "/immigration/blog", label: "Blog" },
  { to: "/immigration/destinations", label: "Destinations" },
  { to: "/immigration/services", label: "Services" },
  { to: "/immigration/contact", label: "Get free consultation" },
];

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-[#FF4D6D] transition-colors"
      aria-label={href}
    >
      {icon}
    </a>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="text-white hover:text-white transition-colors text-sm">
      {children}
    </Link>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative pt-16 pb-8 overflow-hidden site-footer"
      style={{ backgroundColor: BRAND.navy }}
    >
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none"
        aria-hidden
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-white/10">
          <div className="space-y-5">
            <Link to="/" className="inline-block">
              <img src={LOGO_URL} alt="ProConsulting Immigration" className="h-12 w-auto object-contain" />
            </Link>
            <p className="text-white text-sm leading-relaxed max-w-xs">
              Expert immigration advice and visa services. We help you navigate your journey with confidence.
            </p>
            <div className="flex items-center gap-3">
              <SocialIcon icon={<Facebook className="w-4 h-4" />} href="https://facebook.com" />
              <SocialIcon icon={<Instagram className="w-4 h-4" />} href="https://instagram.com" />
              <SocialIcon icon={<Linkedin className="w-4 h-4" />} href="https://linkedin.com" />
              <SocialIcon icon={<Twitter className="w-4 h-4" />} href="https://twitter.com" />
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <FooterLink to={to}>{label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-5">Contact</h3>
            <ul className="space-y-4 text-white text-sm">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 shrink-0 text-[#FF4D6D]" />
                <a href="mailto:info@proconsulting.uk" className="hover:text-white transition-colors">
                  Email Us
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 shrink-0 text-[#FF4D6D]" />
                <a href="tel:03701902125" className="hover:text-white transition-colors">
                  0370 1902125
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 shrink-0 text-[#FF4D6D] mt-0.5" />
                <span>Vista Building, 2nd Floor, Office No 203-204, I-8 Markaz, Islamabad, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-white text-sm">
          <p>© {currentYear} ProConsulting. All rights reserved.</p>
          <p>proconsulting.uk/immigration</p>
        </div>
      </div>
    </footer>
  );
}
