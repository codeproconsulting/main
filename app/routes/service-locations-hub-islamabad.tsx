"use client";

import { Link } from "react-router";
import { Navbar } from "../components/ui/Navbar";
import { Footer } from "../components/ui/Footer";
import {
  FaLocationDot,
  FaClock,
  FaArrowRightLong,
  FaGraduationCap,
  FaPenNib,
  FaBuilding,
  FaCheck,
} from "react-icons/fa6";
import { BRAND } from "../lib/constants";
import { pageMeta, canonicalLink } from "../lib/seo";

const TITLE = "Islamabad Campus | PRO Consulting Pakistan";
const DESCRIPTION =
  "Visit PRO Consulting flagship campus in I-8 Markaz, Islamabad. Premier hub for study abroad consulting, IELTS preparation, and TOEFL iBT preparation in Islamabad.";
const PATHNAME = "/service-locations/islamabad";

export function meta() {
  return [
    { title: TITLE },
    { name: "description", content: DESCRIPTION },
    ...pageMeta({ title: TITLE, description: DESCRIPTION, pathname: PATHNAME }),
  ];
}

export function links() {
  return canonicalLink(PATHNAME);
}

export default function IslamabadLocationPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-[#0B1B3A]">
      <Navbar />

      <main className="flex-grow">
        {/* ================= HERO SECTION ================= */}
        <section className="relative overflow-hidden bg-[#0B1B3A] text-white pt-12 pb-16 md:pt-16 md:pb-24 border-b border-slate-800">
          <div
            className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"
            aria-hidden
          />

          <div className="relative max-w-7xl mx-auto px-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span aria-hidden>/</span>
              <Link to="/service-locations" className="hover:text-white transition-colors">Service Locations</Link>
              <span aria-hidden>/</span>
              <span className="text-[#FF4D6D] font-medium">Islamabad Campus</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <span className="text-xs font-bold uppercase tracking-widest text-[#FF4D6D] bg-white/10 px-3.5 py-1.5 rounded-full inline-block mb-3 border border-white/10">
                  Pakistan • Primary Campus
                </span>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
                  Islamabad <span style={{ color: BRAND.pink }}>Campus</span>
                </h1>
                <div className="mt-3 w-16 h-1 rounded-full" style={{ backgroundColor: BRAND.pink }} />

                <p className="mt-6 text-slate-200 text-base sm:text-lg lg:text-xl leading-relaxed">
                  Our flagship campus and premier consultation hub in I-8 Markaz, Islamabad. Dedicated to guiding ambitious students and professionals toward world-class international educational pathways, university admissions, and expert test preparation.
                </p>

                {/* Quick Info Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-200">
                    <FaLocationDot className="w-4 h-4 text-[#FF4D6D] shrink-0" />
                    <span>Vista Building, 2nd Floor, I-8 Markaz</span>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-200">
                    <FaClock className="w-4 h-4 text-[#FF4D6D] shrink-0" />
                    <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-4 items-center">
                  <a
                    href="#test-prep-programs"
                    className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm sm:text-base font-bold bg-[#FF4D6D] text-white hover:bg-white hover:text-[#0B1B3A] transition-all shadow-md active:scale-95"
                  >
                    <span>View Test Preparation Programs</span>
                    <FaArrowRightLong className="w-4 h-4" />
                  </a>

                  <Link
                    to="/education/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm sm:text-base font-semibold text-white border border-white/30 hover:bg-white/10 transition-all"
                  >
                    <span>Book Free Consultation</span>
                  </Link>
                </div>
              </div>

              {/* Campus Visual Card */}
              <div className="lg:col-span-5">
                <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
                  <img
                    src="/islamabad.jpg"
                    alt="Islamabad Campus"
                    className="w-full h-80 sm:h-96 object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3A] via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md text-[#0B1B3A] shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF4D6D] block">
                          Flagship Facility
                        </span>
                        <h2 className="text-base sm:text-lg font-bold text-[#0B1B3A]">
                          I-8 Markaz Executive Suites
                        </h2>
                      </div>
                      <span className="w-9 h-9 rounded-full bg-pink-50 text-[#FF4D6D] flex items-center justify-center">
                        <FaBuilding className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= TEST PREPARATION PROGRAMS SECTION ================= */}
        <section id="test-prep-programs" className="py-16 md:py-24 bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF4D6D] bg-pink-50 px-3.5 py-1.5 rounded-full inline-block mb-3">
                Islamabad Campus • Choose Your Track
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1B3A] tracking-tight">
                Test Preparation Programs in Islamabad
              </h2>
              <div className="mt-3 w-16 h-1 rounded-full bg-[#FF4D6D] mx-auto" />
              <p className="mt-4 text-slate-600 text-base sm:text-lg">
                Select a course to view complete preparation details, course structure, and schedules:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {/* BOX 1: IELTS Preparation in Islamabad */}
              <Link
                to="/service-locations/islamabad/ielts-preparation-in-islamabad"
                className="group relative bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 hover:border-[#FF4D6D] shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-pink-50 px-3.5 py-1.5 rounded-full">
                      Academic & General
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#FF4D6D] flex items-center justify-center group-hover:bg-[#FF4D6D] group-hover:text-white transition-all shadow-sm">
                      <FaGraduationCap className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] mb-3 group-hover:text-[#FF4D6D] transition-colors">
                    IELTS Preparation in Islamabad
                  </h3>

                  <p className="text-slate-600 text-base leading-relaxed mb-6">
                    Academy in I-8 Markaz offering Academic, General Training & UKVI courses with mock tests, personal feedback, and free level check.
                  </p>

                  <div className="space-y-3 mb-8">
                    {[
                      "Target band score planning",
                      "Writing & speaking feedback",
                      "Online & in-person batches",
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-sm text-slate-700">
                        <FaCheck className="w-4 h-4 text-[#FF4D6D] shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-base font-bold text-[#FF4D6D] group-hover:translate-x-1.5 transition-transform inline-flex items-center gap-2">
                    <span>Explore IELTS Preparation</span>
                    <FaArrowRightLong className="w-4 h-4" />
                  </span>
                  <span className="w-10 h-10 rounded-full bg-pink-50 text-[#FF4D6D] flex items-center justify-center group-hover:bg-[#FF4D6D] group-hover:text-white transition-all shadow-sm">
                    <FaArrowRightLong className="w-4 h-4" />
                  </span>
                </div>
              </Link>

              {/* BOX 2: TOEFL Preparation in Islamabad */}
              <Link
                to="/service-locations/islamabad/toefl-preparation-in-islamabad"
                className="group relative bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 hover:border-[#FF4D6D] shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-pink-50 px-3.5 py-1.5 rounded-full">
                      Current iBT Format
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#FF4D6D] flex items-center justify-center group-hover:bg-[#FF4D6D] group-hover:text-white transition-all shadow-sm">
                      <FaPenNib className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] mb-3 group-hover:text-[#FF4D6D] transition-colors">
                    TOEFL preparation in Islamabad
                  </h3>

                  <p className="text-slate-600 text-base leading-relaxed mb-6">
                    Make sure your practice matches the test you will take. Coaching covering current email writing, academic discussion, and spoken interview tasks.
                  </p>

                  <div className="space-y-3 mb-8">
                    {[
                      "Current TOEFL iBT task coverage",
                      "Email & academic discussion writing",
                      "Spoken interview coaching in I-8 or online",
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-sm text-slate-700">
                        <FaCheck className="w-4 h-4 text-[#FF4D6D] shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-base font-bold text-[#FF4D6D] group-hover:translate-x-1.5 transition-transform inline-flex items-center gap-2">
                    <span>Explore TOEFL Preparation</span>
                    <FaArrowRightLong className="w-4 h-4" />
                  </span>
                  <span className="w-10 h-10 rounded-full bg-pink-50 text-[#FF4D6D] flex items-center justify-center group-hover:bg-[#FF4D6D] group-hover:text-white transition-all shadow-sm">
                    <FaArrowRightLong className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
