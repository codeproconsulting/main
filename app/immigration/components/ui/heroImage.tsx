"use client";

import { Link } from "react-router";
import { motion } from "framer-motion";
import { Button } from "~/immigration/components/ui/button";

const HERO_IMAGE = "/Heroimg.png";

function HeroStats() {
  const stats = [
    { value: "700+", label: "Assessments done" },
    { value: "250+", label: "Visa granted" },
    { value: "250+", label: "Satisfied clients" },
  ] as const;

  return (
    <div className="w-full max-w-xl mx-auto md:mx-0 mt-6 md:mt-7">
      <div className="rounded-xl border border-white/15 bg-black/25 backdrop-blur-sm px-4 py-3 md:px-5 md:py-3.5 shadow-lg shadow-black/15">
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={[
                "text-center",
                i > 0 ? "border-l border-white/15 pl-2 md:pl-4" : "",
              ].join(" ")}
            >
              <div className="text-xl md:text-2xl font-extrabold text-white tracking-tight leading-none">
                {s.value}
              </div>
              <div className="mt-1 text-[10px] md:text-[11px] font-semibold text-white/80 uppercase tracking-wider">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <div className="relative w-full h-[77vh] overflow-hidden flex items-center bg-gray-900">
      {/* BACKGROUND IMAGE */}
      <motion.img
        src={HERO_IMAGE}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 w-full h-full object-cover object-[85%_10%] md:object-[center_10%] z-0"
        alt="Immigration and visa expertise"
      />

      {/* CONTENT - pt-75 pushes text lower like education hero */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 w-full grid grid-cols-1 md:grid-cols-2 items-end md:items-center relative z-10 pt-75 pb-6 md:pt-6 md:pb-0 min-h-0">
        <div className="flex flex-col items-center md:items-start justify-end md:justify-center -mt-0 md:-mt-32 w-full md:max-w-none col-span-1 md:pt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center md:text-left w-full min-w-0 rounded-xl px-5 py-4 md:px-0 md:py-0 bg-black/25 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none"
          >
            <h1 className="text-5xl md:text-6xl lg:text-6xl font-bold leading-tight text-white mb-4 md:mb-6">
              Your Journey Starts Here
            </h1>

            <p className="text-xl md:text-2xl font-medium text-white/95 max-w-lg mb-6 md:mb-10 leading-snug mx-auto md:mx-0">
              We Handle the Rest.
            </p>

            <div className="flex justify-center md:justify-start">
              <Link to="/immigration/contact">
                <Button
                  size="lg"
                  className="bg-pink-600 hover:bg-pink-700 text-white font-bold text-lg px-8 py-5 md:px-12 md:py-6 rounded-xl md:rounded-2xl shadow-lg transition-all hover:opacity-95"
                >
                  Get Free Consultation
                </Button>
              </Link>
            </div>

            <HeroStats />
          </motion.div>
        </div>

        <div />
      </div>
    </div>
  );
}
