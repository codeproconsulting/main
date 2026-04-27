"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import {
  FaClipboardCheck,
  FaFolderOpen,
  FaGraduationCap,
  FaStamp
} from 'react-icons/fa6';
import { STATS, BRAND } from "../../lib/constants";

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
      <span style={{ color: BRAND.pink }}>{suffix}</span>
    </span>
  );
}

const icons = [FaClipboardCheck, FaFolderOpen, FaStamp, FaGraduationCap];

export function StatsBar() {
  return (
    <section aria-label="Our impact" className="py-16 md:py-20 bg-[#0B1B3A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {STATS.map((stat, index) => {
            const Icon = icons[index];
            return (
              <div key={stat.label} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-3" style={{ backgroundColor: BRAND.pink }}>
                  <Icon className="w-6 h-6" strokeWidth={2} />
                </div>
                <div className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                  <AnimatedNumber value={stat.number} suffix={stat.suffix} />
                </div>
                <p className="text-white text-sm mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
