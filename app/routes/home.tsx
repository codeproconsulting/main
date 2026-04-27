import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { FaGraduationCap, FaPlane, FaArrowRightLong } from 'react-icons/fa6';
import { Navbar } from "../components/ui/Navbar";
import { Footer } from "../components/ui/Footer";
import { SuccessSections } from "../components/ui/SuccessSections";
import { WhyChooseUs } from "../components/ui/WhyChooseUs";
import { ReviewsSection } from "../components/ui/ReviewsSection";
import { PartnerUniversitiesSection } from "../components/ui/PartnerUniversitiesSection";
import { BlogPreview } from "../components/ui/BlogPreview";
import { EDUCATION_URL, IMMIGRATION_URL, BRAND } from "../lib/constants";

const HEADLINE_WORDS = ["Your Trusted Partner", "for Education", "& Immigration"];

export default function HomePage() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setMouse({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <Navbar />

      <main>
        {/* Elite Premium Hero */}
        <section
          ref={sectionRef}
          aria-label="Hero"
          className="relative min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#030712]"
        >
          {/* Animated Mesh Gradient Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
            <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob" style={{ background: `linear-gradient(to top right, ${BRAND.pink}, #7B3FAE, #2B4EAE)` }} />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-blob animation-delay-2000" style={{ background: `linear-gradient(to bottom left, #2B4EAE, #4A90D9, #0ea5e9)` }} />
            <div className="absolute top-[20%] right-[20%] w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] rounded-full mix-blend-screen filter blur-[90px] opacity-20 animate-blob animation-delay-4000" style={{ background: `linear-gradient(to right, ${BRAND.gold}, #F59E0B)` }} />
          </div>

          {/* Micro-grid Texture */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50 pointer-events-none" />

          {/* Floating Elements managed by Framer Motion for smoother interactivity */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
            <motion.div animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[20%] left-[15%] text-white/10">
              <FaGraduationCap className="w-12 h-12 md:w-16 md:h-16" />
            </motion.div>
            <motion.div animate={{ y: [0, 25, 0], rotate: [0, -10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute bottom-[25%] right-[12%] text-white/10">
              <FaPlane className="w-10 h-10 md:w-14 md:h-14" />
            </motion.div>
          </div>

          <div className="relative z-10 max-w-6xl mx-auto py-20 text-center flex flex-col items-center">

            {/* Headline */}
            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-8 leading-[1.1] max-w-5xl">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="block"
              >
                Your Trusted Partner
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="block bg-clip-text text-transparent bg-gradient-to-r from-[#FF4D6D] via-[#FF859D] to-[#C9A84C] pb-2 drop-shadow-sm"
              >
                for Education & Immigration
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-lg md:text-2xl text-white max-w-3xl mx-auto mb-14 font-light leading-relaxed"
            >
              Whether you're planning to study abroad or navigate the immigration
              process — we guide you every step of the way with absolute clarity.
            </motion.p>

            {/* Sexy Glassmorphism CTA Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl mx-auto"
            >
              <Link
                to="/education"
                className="group relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-2xl p-6 text-left transition-all duration-500 hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-[0_0_40px_-10px_rgba(74,144,217,0.3)] hover:border-white/[0.15]"
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative flex items-center gap-5">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] group-hover:scale-110 transition-transform duration-500 ease-out">
                    <FaGraduationCap className="h-8 w-8 text-white drop-shadow-md" strokeWidth={1.5} />
                  </div>
                  <div>
                    <span className="block font-heading text-xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">Study Abroad</span>
                    <span className="block text-sm text-white">Universities & visas</span>
                  </div>
                  <FaArrowRightLong className="ml-auto h-6 w-6 text-white group-hover:text-white group-hover:translate-x-2 transition-all duration-300" />
                </div>
              </Link>

              <Link
                to="/immigration"
                className="group relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-2xl p-6 text-left transition-all duration-500 hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-[0_0_40px_-10px_rgba(233,30,140,0.3)] hover:border-white/[0.15]"
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative flex items-center gap-5">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] group-hover:scale-110 transition-transform duration-500 ease-out">
                    <FaPlane className="h-8 w-8 text-white drop-shadow-md" strokeWidth={1.5} />
                  </div>
                  <div>
                    <span className="block font-heading text-xl font-bold text-white mb-1 group-hover:text-pink-300 transition-colors">Immigration</span>
                    <span className="block text-sm text-white">Visas & settlement</span>
                  </div>
                  <FaArrowRightLong className="ml-auto h-6 w-6 text-white group-hover:text-white group-hover:translate-x-2 transition-all duration-300" />
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-12"
            >
              <Link to="/?consult=open" className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-white transition-colors group">
                <span className="border-b border-slate-700 group-hover:border-white transition-colors pb-0.5">Or book a free consultation</span>
                <FaArrowRightLong className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Services Overview */}
        <section
          aria-label="Our services"
          className="py-20 md:py-24 bg-zinc-50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-12 text-center">
              What We Do
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Card 1 – Study Abroad */}
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-all duration-200 focus-within:ring-2 focus-within:ring-slate-300 focus-within:ring-offset-2">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white mb-6" style={{ backgroundColor: BRAND.pink }}>
                  <FaGraduationCap className="w-7 h-7" strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Education Consulting</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  We help students get admitted to top universities worldwide — UK, Europe, Canada, Australia, USA, and more. From shortlisting to visa processing, we handle it all.
                </p>
                <ul className="space-y-2 text-sm text-slate-700 mb-6">
                  {["University Admissions", "Student Visas", "IELTS / Test Prep", "Career Counselling", "Pre-Departure Guidance"].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="text-green-600">✓</span> {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/education"
                  className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white w-full sm:w-auto transition-all duration-200 hover:opacity-95 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400"
                  style={{ backgroundColor: BRAND.pink }}
                >
                  Explore Education Services
                </Link>
              </div>

              {/* Card 2 – Immigration */}
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-all duration-200 focus-within:ring-2 focus-within:ring-slate-300 focus-within:ring-offset-2">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white mb-6" style={{ backgroundColor: BRAND.navy }}>
                  <FaPlane className="w-7 h-7" strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Immigration & Visas</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Navigating immigration can be overwhelming. Our experts simplify the process — visit visas, work permits, family reunification, or settlement.
                </p>
                <ul className="space-y-2 text-sm text-slate-700 mb-6">
                  {["Visit Visas", "Work Permits", "Family Visas", "Settlement Applications", "Appeal Support"].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="text-green-600">✓</span> {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/immigration"
                  className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white w-full sm:w-auto transition-all duration-200 hover:opacity-95 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400"
                  style={{ backgroundColor: BRAND.navy }}
                >
                  Explore Immigration Services
                </Link>
              </div>
            </div>
          </div>
        </section>

        <SuccessSections />
        <WhyChooseUs />
        <ReviewsSection />
        <PartnerUniversitiesSection />

        {/* Lead Generation CTA */}
        <section
          aria-label="Get free consultation"
          className="py-20 md:py-24 bg-[#C9A84C]"
        >
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Ready to take the next step?
            </h2>
            <p className="text-slate-800 text-lg mb-8">
              Book a free consultation — it costs nothing and could change everything.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full px-5 py-4 text-base lg:px-7 lg:py-5 lg:text-lg font-bold text-white shadow-lg transition-transform hover:scale-105 hover:opacity-95 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-700"
              style={{ backgroundColor: BRAND.pink }}
            >
              Get Free Consultation
            </Link>
          </div>
        </section>

        <BlogPreview />
      </main>

      <Footer />
    </>
  );
}
