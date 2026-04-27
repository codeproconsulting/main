"use client";

import { useState, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBarsStaggered as MenuIcon,
  FaXmark,
  FaChevronRight,
  FaChevronDown,
  FaGraduationCap,
  FaPlane,
  FaPassport,
} from 'react-icons/fa6';
import { cn } from "../../lib/utils";
import { EDUCATION_URL, IMMIGRATION_URL } from "../../lib/constants";

const navLinks = [
  { to: "/", label: "Home" },
  { to: EDUCATION_URL, label: "Study Abroad" },
];

const immigrationSubLinks = [
  { to: `${IMMIGRATION_URL}/services`, label: "Visit Visa", icon: FaPlane, description: "Visit, tourism & business visas" },
  { to: IMMIGRATION_URL, label: "Immigration", icon: FaPassport, description: "Work, family, settlement & appeals" },
];

const CONSULTATION_OPTIONS = [
  { label: "Study Abroad", href: `${EDUCATION_URL}/contact`, icon: FaGraduationCap, description: "University admissions, student visas & more" },
  { label: "Immigration", href: `${IMMIGRATION_URL}/contact`, icon: FaPlane, description: "Visit, work, family & settlement visas" },
];

/** Button style matching education site navbar CTA */
const consultationButtonClass =
  "rounded-full px-5 py-4 text-base font-bold bg-pink-600 hover:bg-pink-700 text-white shadow-lg transition-transform hover:scale-105 whitespace-nowrap lg:px-7 lg:py-5 lg:text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-500";

export function Navbar({ className }: { className?: string } = {}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [immigrationOpen, setImmigrationOpen] = useState(false);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("consult") === "open") {
      setConsultationOpen(true);
      // Clean up the URL
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("consult");
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const openConsultation = () => {
    setConsultationOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <div className="site-navbar sticky top-0 z-[100] w-full bg-white">
        <div className={cn("shadow-md h-20 w-full", className)}>
          <div className="relative w-full max-w-7xl mx-auto h-full flex items-center px-3 sm:px-5 md:px-6 lg:px-4">
            <Link
              to="/"
              className="flex items-center shrink-0 mr-auto py-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 transition-shadow"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img src="/Logo_main.png" alt="Pro Consulting" className="h-11 w-auto object-contain" />
            </Link>

            <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-x-6">
              {navLinks.map(({ to, label, external }) =>
                external ? (
                  <a
                    key={to}
                    href={to}
                    className="font-medium text-black hover:text-neutral-800 whitespace-nowrap text-sm lg:text-base py-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 transition-colors"
                  >
                    {label}
                  </a>
                ) : (
                  <Link
                    key={to}
                    to={to}
                    className={cn(
                      "font-medium whitespace-nowrap text-sm lg:text-base py-2 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 text-black hover:text-neutral-800",
                      location.pathname === to && "text-black"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {label}
                  </Link>
                )
              )}

              {/* Immigration dropdown – between Study Abroad and About Us */}
              <div
                className="relative"
                onMouseEnter={() => setImmigrationOpen(true)}
                onMouseLeave={() => setImmigrationOpen(false)}
              >
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 font-medium whitespace-nowrap text-sm lg:text-base py-2 rounded transition-colors text-black hover:text-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400"
                >
                  Immigration
                  <FaChevronDown className={cn("w-3 h-3 transition-transform duration-200", immigrationOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {immigrationOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/60 overflow-hidden z-50"
                    >
                      {immigrationSubLinks.map(({ to, label, icon: Icon, description }) => (
                        <Link
                          key={to}
                          to={to}
                          className="flex items-start gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors group"
                          onClick={() => setImmigrationOpen(false)}
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white mt-0.5" style={{ backgroundColor: "#FF4D6D" }}>
                            <Icon className="w-4 h-4" />
                          </span>
                          <div>
                            <span className="block text-sm font-semibold text-slate-900 group-hover:text-pink-600 transition-colors">{label}</span>
                            <span className="block text-xs text-slate-500 mt-0.5">{description}</span>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* About Us – after Immigration dropdown */}
              <Link
                to="/about"
                className={cn(
                  "font-medium whitespace-nowrap text-sm lg:text-base py-2 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 text-black hover:text-neutral-800",
                  location.pathname === "/about" && "text-black"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
            </div>

            {/* Right CTA – same style as education site, opens consultation choice */}
            <div className="hidden lg:block shrink-0 ml-auto">
              <button
                type="button"
                onClick={openConsultation}
                className={cn("inline-flex items-center justify-center", consultationButtonClass)}
              >
                Get Free Consultation
              </button>
            </div>

            <button
              className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 p-2 text-black z-50 bg-transparent rounded-lg transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon className="w-8 h-8" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring" as const, stiffness: 100, damping: 20 }}
            className="site-navbar fixed inset-0 z-[120] bg-white flex flex-col lg:hidden overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400"
              >
                <img src="/Logo_main.png" alt="Pro Consulting" className="h-9 w-auto object-contain" />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400"
                aria-label="Close menu"
              >
                <FaXmark className="w-6 h-6 text-black" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Menu</h3>
                {navLinks.map(({ to, label, external }) =>
                  external ? (
                    <a
                      key={to}
                      href={to}
                      className="flex items-center justify-between text-lg font-medium text-black hover:text-pink-600 rounded-lg py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 group"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {label}
                      <FaChevronRight className="w-4 h-4 text-gray-300 group-hover:text-pink-600" />
                    </a>
                  ) : (
                    <Link
                      key={to}
                      to={to}
                      className="flex items-center justify-between text-lg font-medium text-black hover:text-pink-600 rounded-lg py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 group"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {label}
                      <FaChevronRight className="w-4 h-4 text-gray-300 group-hover:text-pink-600" />
                    </Link>
                  )
                )}

                {/* Immigration sub-section */}
                <div className="pt-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Immigration</p>
                  {immigrationSubLinks.map(({ to, label, icon: Icon, description }) => (
                    <Link
                      key={to}
                      to={to}
                      className="flex items-center gap-3 py-3 text-black hover:text-pink-600 transition-colors group"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white" style={{ backgroundColor: "#FF4D6D" }}>
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="text-base font-medium">{label}</span>
                      <FaChevronRight className="ml-auto w-4 h-4 text-gray-300 group-hover:text-pink-600" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <button
                type="button"
                onClick={openConsultation}
                className={cn("w-full", consultationButtonClass)}
              >
                Get Free Consultation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Consultation choice modal – Which service are you interested in? */}
      <AnimatePresence>
        {consultationOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[130] bg-black/50 backdrop-blur-sm"
              onClick={() => setConsultationOpen(false)}
              aria-hidden
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: "spring" as const, damping: 28, stiffness: 280 }}
              className="fixed left-1/2 top-1/2 z-[140] w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white shadow-2xl mx-4 overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby="consultation-modal-title"
            >
              {/* Header */}
              <div className="bg-gradient-to-br from-slate-50 to-white border-b border-slate-100 px-8 pt-8 pb-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-pink-600 mb-2">
                      Free Consultation
                    </p>
                    <h2 id="consultation-modal-title" className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                      Which service are you interested in?
                    </h2>
                    <p className="mt-2 text-slate-600 text-base">
                      We'll take you to the right team for expert guidance.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setConsultationOpen(false)}
                    className="p-2.5 rounded-xl text-white hover:bg-white hover:text-slate-700 hover:shadow-sm border border-transparent hover:border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/50 transition-all shrink-0"
                    aria-label="Close"
                  >
                    <FaXmark className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="p-8 space-y-4">
                {CONSULTATION_OPTIONS.map(({ label, href, icon: Icon, description }) => (
                  <a
                    key={href}
                    href={href}
                    className="group flex items-center gap-5 rounded-2xl border-2 border-slate-200 bg-white p-5 md:p-6 transition-all duration-200 hover:border-pink-300 hover:bg-gradient-to-br hover:from-pink-50/80 hover:to-white hover:shadow-lg hover:shadow-pink-500/10"
                    onClick={() => setConsultationOpen(false)}
                  >
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-pink-600 text-white shadow-lg shadow-pink-500/30 group-hover:scale-105 group-hover:shadow-pink-500/40 transition-transform duration-200">
                      <Icon className="h-7 w-7" strokeWidth={2} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="block text-lg font-bold text-slate-900 group-hover:text-pink-700 transition-colors">
                        {label}
                      </span>
                      <span className="block text-sm text-slate-600 mt-0.5">{description}</span>
                    </div>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 group-hover:bg-pink-100 group-hover:text-pink-600 transition-colors">
                      <FaChevronRight className="h-5 w-5" />
                    </span>
                  </a>
                ))}
              </div>

              <p className="px-8 pb-8 text-center text-sm text-slate-500">
                You'll be redirected to our dedicated team for your chosen service.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
