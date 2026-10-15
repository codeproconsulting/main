"use client";

import { Link } from "react-router";
import { Navbar } from "../components/ui/Navbar";
import { Footer } from "../components/ui/Footer";
import {
  FaArrowRightLong,
  FaLocationDot,
  FaArrowUpRightFromSquare,
} from "react-icons/fa6";
import { BRAND } from "../lib/constants";
import { pageMeta, canonicalLink } from "../lib/seo";

const TITLE = "Service Locations | PRO Consulting";
const DESCRIPTION =
  "Explore PRO Consulting premier campus in Islamabad, Pakistan. Dedicated to guiding students and professionals towards global educational excellence.";
const PATHNAME = "/service-locations";

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

export default function ServiceLocationsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow">
        {/* Header Section */}
        <section className="border-b border-slate-200/80 bg-white">
          <div className="max-w-6xl mx-auto px-6 pt-12 pb-10 md:pt-16 md:pb-14">
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-[#0B1B3A] transition-colors">Home</Link>
              <span aria-hidden>/</span>
              <span className="text-[#0B1B3A] font-medium">Service Locations</span>
            </nav>

            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF4D6D] bg-pink-50 px-3.5 py-1.5 rounded-full inline-block mb-3">
                Global Network
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-[#0B1B3A] tracking-tight">
                Our Service Locations
              </h1>
              <div className="mt-3 w-16 h-1 rounded-full bg-[#FF4D6D]" />
              <p className="mt-4 text-slate-600 text-lg leading-relaxed">
                Connect with our premier education and consulting campus. Select our location below to discover tailored programs and consultation services.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Location Showcase (Attractive & Clean) */}
        <section className="py-14 md:py-20">
          <div className="max-w-6xl mx-auto px-6">
            {/* The Islamabad Interactive Card - Clean, Attractive, No extra details */}
            <Link
              to="/service-locations/ielts-preparation-in-islamabad"
              className="group block relative bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                {/* Visual Imagery */}
                <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto min-h-[340px] overflow-hidden bg-slate-900">
                  <img
                    src="/islamabad.jpg"
                    alt="Islamabad Capital Campus"
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent lg:hidden" />
                  
                  {/* Subtle Badge Overlay */}
                  <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#0B1B3A] shadow-md flex items-center gap-1.5">
                    <FaLocationDot className="text-[#FF4D6D]" />
                    <span>Pakistan • Primary Campus</span>
                  </div>
                </div>

                {/* Content Side: Just Heading, Paragraph & Action */}
                <div className="lg:col-span-5 p-8 sm:p-10 lg:p-12 flex flex-col justify-between bg-white">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] mb-2 block">
                      Featured Location
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B3A] tracking-tight mb-4 group-hover:text-[#FF4D6D] transition-colors">
                      Islamabad
                    </h2>
                    <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6">
                      Our flagship campus and premier consultation hub in Pakistan's capital city. Dedicated to guiding ambitious students and professionals toward world-class international educational pathways and comprehensive academic support.
                    </p>
                  </div>

                  {/* Clean CTA Link */}
                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-base font-bold text-[#FF4D6D] group-hover:translate-x-1 transition-transform">
                      <span>Explore Islamabad Location</span>
                      <FaArrowRightLong className="w-4 h-4" />
                    </span>
                    <span className="w-10 h-10 rounded-full bg-pink-50 text-[#FF4D6D] flex items-center justify-center group-hover:bg-[#FF4D6D] group-hover:text-white transition-all shadow-sm">
                      <FaArrowRightLong className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
