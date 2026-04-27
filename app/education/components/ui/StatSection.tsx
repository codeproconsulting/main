"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, motion } from "framer-motion";
import { ClipboardCheck, FolderCheck, GraduationCap, Stamp } from "lucide-react";

const stats = [
  {
    id: 1,
    number: "2000",
    label: "Assessments Done",
    icon: ClipboardCheck,
  },
  {
    id: 2,
    number: "700",
    label: "Cases Completed",
    icon: FolderCheck,
  },
  {
    id: 3,
    number: "500",
    label: "Visa Granted",
    icon: Stamp,
  },
  {
    id: 4,
    number: "500",
    label: "Satisfied Students",
    icon: GraduationCap,
  },
];

function AnimatedNumber({ value, suffix = "+" }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [display, setDisplay] = useState(0);
  const target = parseInt(value, 10);

  useEffect(() => {
    if (!isInView || isNaN(target)) return;
    const controls = animate(0, target, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}
      <span className="text-[#FF4D6D]">{suffix}</span>
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="relative pt-8 md:pt-10 pb-20 md:pb-28 overflow-hidden bg-white">
      {/* Subtle pink tint at top */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(255,77,109,0.04), transparent 50%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0B1B3A] tracking-tight mb-4">
            Building{" "}
            <span className="text-[#FF4D6D]">enduring</span> value through bold strategies
          </h2>
          <p className="text-gray-600 text-lg">
            Numbers that reflect our commitment to your success.
          </p>
        </div>

        {/* Stats grid — card style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative flex flex-col p-6 md:p-8 rounded-2xl bg-slate-50 border border-slate-200/80 overflow-hidden transition-all duration-300 hover:bg-white hover:border-[#FF4D6D]/30 hover:shadow-lg hover:shadow-[#FF4D6D]/5"
            >
              {/* Top accent on hover */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5 bg-[#FF4D6D] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"
                aria-hidden
              />

              <div className="flex items-center gap-4 mb-5">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-[#FF4D6D] flex items-center justify-center shadow-lg shadow-[#FF4D6D]/20 group-hover:scale-105 transition-transform duration-300">
                  <stat.icon className="w-7 h-7 text-white" strokeWidth={2} />
                </div>
                <p className="text-base font-medium text-gray-600 group-hover:text-[#0B1B3A] transition-colors">
                  {stat.label}
                </p>
              </div>

              <div className="text-4xl md:text-5xl font-extrabold text-[#0B1B3A] tracking-tight">
                <AnimatedNumber value={stat.number} suffix="+" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
