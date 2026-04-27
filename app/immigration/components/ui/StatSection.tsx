"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, motion } from "framer-motion";
import { ClipboardCheck, Stamp, Users } from "lucide-react";

const stats = [
  { id: 1, number: "700", label: "Assessments done", icon: ClipboardCheck },
  { id: 2, number: "250", label: "Visa granted", icon: Stamp },
  { id: 3, number: "250", label: "Satisfied clients", icon: Users },
];

function AnimatedNumber({ value, suffix = "+" }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [display, setDisplay] = useState(0);
  const target = parseInt(value, 10);

  useEffect(() => {
    if (!isInView || isNaN(target)) return;
    const controls = animate(0, target, {
      duration: 1.5,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {display}
      <span className="text-[#FF4D6D]">{suffix}</span>
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="relative py-16 md:py-20 overflow-hidden" style={{ backgroundColor: "#0B1B3A" }}>
      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(255,77,109,0.12), transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`
                flex flex-col items-center text-center px-6 py-10 md:py-14
                ${index > 0 ? "border-t sm:border-t-0 sm:border-l border-white/15" : ""}
              `}
            >
              <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-white/10 text-[#FF4D6D] mb-4 md:mb-5">
                <stat.icon className="h-6 w-6 md:h-7 md:w-7" strokeWidth={2} />
              </div>
              <div className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2">
                <AnimatedNumber value={stat.number} suffix="+" />
              </div>
              <p className="text-sm md:text-base font-medium text-white/80 uppercase tracking-wider">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
