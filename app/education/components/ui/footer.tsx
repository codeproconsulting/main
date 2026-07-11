"use client";
import { Link } from "react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, ArrowRight } from "lucide-react";

const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/proconsultinguk",
  instagram: "https://www.instagram.com/proconsulting.education/",
  linkedin: "https://www.linkedin.com/company/proconsultinguk",
  x: "https://x.com/proconsulting_",
} as const;

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
const BRAND = { navy: "#0B1B3A", pink: "#FF4D6D" };

const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/education/about", label: "About Us" },
  { to: "/education/services", label: "Services" },
  { to: "/education/destinations", label: "Destinations" },
  { to: "/education/courses", label: "Courses" },
  { to: "/education/blog", label: "Blog" },
  { to: "/education/contact", label: "Get free consultation" },
];

const legalLinks = [
  { to: "/education/privacy-policy", label: "Privacy Policy" },
  { to: "/education/terms", label: "Terms of Service" },
  { to: "/education/cookie-policy", label: "Cookie Policy" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative pt-16 pb-8 overflow-hidden site-footer"
      style={{ backgroundColor: BRAND.navy }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none"
        aria-hidden
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-white/10">
          {/* Brand + tagline + social */}
          <div className="space-y-5">
            <Link to="/" className="inline-block">
              <img src="/logo.png" alt="ProConsulting" className="h-9 w-auto object-contain" />
            </Link>
            <p className="text-white text-sm leading-relaxed max-w-xs">
              Expert guidance on study abroad, visas, and university applications. We help deserving candidates reach their goals.
            </p>
            <div className="flex items-center gap-3">
              <SocialIcon icon={<Facebook className="w-4 h-4" />} href={SOCIAL_LINKS.facebook} ariaLabel="Facebook" />
              <SocialIcon icon={<Instagram className="w-4 h-4" />} href={SOCIAL_LINKS.instagram} ariaLabel="Instagram" />
              <SocialIcon icon={<Linkedin className="w-4 h-4" />} href={SOCIAL_LINKS.linkedin} ariaLabel="LinkedIn" />
              <SocialIcon icon={<XIcon className="w-4 h-4" />} href={SOCIAL_LINKS.x} ariaLabel="X (Twitter)" />
            </div>
          </div>

          {/* Quick links */}
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

          {/* Legal */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-5">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map(({ to, label }) => (
                <li key={to}>
                  <FooterLink to={to}>{label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + CTA */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-5">Contact</h3>
            <ul className="space-y-4 text-white text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5" style={{ color: BRAND.pink }} />
                <span className="leading-relaxed">
                  Vista Building Second Floor Office No 203, 204 i-8 Markaz, Islamabad
                </span>
              </li>
              <li className="flex flex-col gap-2">
                <a href="tel:+92516135834" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 shrink-0" style={{ color: BRAND.pink }} />
                  <span>PK: (051) 6135834</span>
                </a>
                <a href="tel:+923701902128" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 shrink-0" style={{ color: BRAND.pink }} />
                  <span>PK: +92 370 1902128</span>
                </a>
                <a href="tel:+447432406993" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 shrink-0" style={{ color: BRAND.pink }} />
                  <span>UK: +44 7432 406993</span>
                </a>
              </li>
              <li>
                <a href="mailto:contact@proconsulting.uk" className="flex items-center gap-3 hover:text-white transition-colors">
                  <Mail className="w-5 h-5 shrink-0" style={{ color: BRAND.pink }} />
                  <span>Email Us</span>
                </a>
              </li>
            </ul>
            <Link to="/education/contact" className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all hover:opacity-95" style={{ backgroundColor: BRAND.pink }}>
              Get Free Consultation
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white text-sm text-center sm:text-left">
            © {currentYear} Pro Consulting. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link to="/education/privacy-policy" className="text-white hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/education/terms" className="text-white hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="text-white hover:text-white transition-colors text-sm flex items-center gap-2 group"
    >
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
      className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#FF4D6D] hover:text-white transition-all duration-300"
      aria-label={ariaLabel}
    >
      {icon}
    </a>
  );
}
