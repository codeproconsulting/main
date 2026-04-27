"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, motion } from "framer-motion";
import {
  FaClipboardCheck,
  FaFolderOpen,
  FaGraduationCap,
  FaStamp,
  FaUsers
} from 'react-icons/fa6';
import { BRAND } from "../../lib/constants";

/** From education site: StatSection.tsx */
const EDUCATION_STATS = [
  { id: 1, number: "2000", label: "Assessments Done", icon: FaClipboardCheck },
  { id: 2, number: "700", label: "Cases Completed", icon: FaFolderOpen },
  { id: 3, number: "500", label: "Student Visas Granted", icon: FaStamp },
  { id: 4, number: "500", label: "Satisfied Students", icon: FaGraduationCap },
] as const;

/** Immigration success stats */
const IMMIGRATION_STATS = [
  { id: 1, number: "700", label: "Assessments done", icon: FaClipboardCheck },
  { id: 2, number: "250", label: "Visa granted", icon: FaStamp },
  { id: 3, number: "250", label: "Satisfied clients", icon: FaUsers },
] as const;

function AnimatedNumber({ value, suffix = "+" }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [display, setDisplay] = useState(0);
  const target = parseInt(value, 10);

  useEffect(() => {
    if (!isInView || isNaN(target)) return;
    const controls = animate(0, target, {
      duration: 1.6,
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

function StatBlock({
  title,
  subtitle,
  stats,
  accentIconBg,
}: {
  title: string;
  subtitle: string;
  stats: readonly { id: number; number: string; label: string; icon: typeof FaClipboardCheck }[];
  accentIconBg: string;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
      <div className="px-6 pt-6 pb-4 border-b border-white/10">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-sm text-white mt-0.5">{subtitle}</p>
      </div>
      <div className="p-6 grid grid-cols-2 gap-4 md:gap-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center gap-3"
            >
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
                style={{ backgroundColor: accentIconBg }}
              >
                <Icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <div className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  <AnimatedNumber value={stat.number} suffix="+" />
                </div>
                <p className="text-white text-sm mt-0.5">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export function SuccessSections() {
  return (
    <section
      aria-label="Our success – Study Abroad and Immigration"
      className="py-16 md:py-20"
      style={{ backgroundColor: BRAND.navy }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10 md:mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-white mb-2">
            Our impact
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Trusted results across both services
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <StatBlock
            title="Study Abroad Success"
            subtitle="Education consultancy – university placements, student visas & guidance"
            stats={EDUCATION_STATS}
            accentIconBg="#4A90D9"
          />
          <StatBlock
            title="Immigration Success"
            subtitle="Visit, work, family & settlement visas – expert visa support"
            stats={IMMIGRATION_STATS}
            accentIconBg={BRAND.pink}
          />
        </div>
      </div>
    </section>
  );
}
