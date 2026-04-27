"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router";
import { setConsent, getConsent } from "~/education/lib/cookies";

const BRAND = { navy: "#0B1B3A", pink: "#FF4D6D" };

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = getConsent();
    if (consent === null) {
      // Small delay reduces layout shift and avoids showing too early.
      const t = window.setTimeout(() => setVisible(true), 800);
      return () => window.clearTimeout(t);
    }
  }, []);

  const accept = () => {
    setConsent(true);
    setVisible(false);
  };

  const reject = () => {
    setConsent(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6 shadow-[0_-4px_24px_rgba(0,0,0,0.12)] animate-in slide-in-from-bottom-4 duration-300"
      style={{ backgroundColor: BRAND.navy }}
    >
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="text-white text-sm md:text-base leading-relaxed flex-1">
          We use cookies to improve your experience, remember your preferences, and understand how our site is used so we can serve you better. By clicking &quot;Accept all&quot;, you agree to our use of cookies.{" "}
          <Link to="/education/cookie-policy" className="underline hover:text-white font-medium" style={{ color: BRAND.pink }}>
            Cookie policy
          </Link>
        </p>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={reject}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:text-white border border-slate-500 hover:border-slate-400 transition-colors"
          >
            Necessary only
          </button>
          <button
            type="button"
            onClick={accept}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-95 hover:shadow-lg"
            style={{ backgroundColor: BRAND.pink }}
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
