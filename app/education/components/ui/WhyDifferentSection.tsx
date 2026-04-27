"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Headphones, Zap, RefreshCw } from "lucide-react";

const features = [
  {
    id: "01",
    title: "Follow-Ups",
    description:
      "We don't leave you guessing. We track every step of your progress and proactively update you before you even ask.",
    icon: RefreshCw,
  },
  {
    id: "02",
    title: "24/7 Availability",
    description:
      "Our schedules don't follow a 9-to-5. Whether it's late night or weekend, you get assistance whenever you need it.",
    icon: Headphones,
  },
  {
    id: "03",
    title: "Fast Processing",
    description:
      "We know time is money. Our streamlined workflow ensures your applications are handled efficiently to save you unnecessary stress.",
    icon: Zap,
  },
];

export function WhyDifferentSection() {
  const lineRef = useRef<HTMLDivElement>(null);
  const isLineInView = useInView(lineRef, { once: true, amount: 0.2 });

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: headline block */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-sm font-semibold text-[#FF4D6D] uppercase tracking-[0.2em] mb-6"
            >
              The difference
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-3xl md:text-4xl lg:text-[2.75rem] xl:text-5xl font-bold text-[#0B1B3A] leading-[1.15]"
            >
              What makes us{" "}
              <span className="text-[#FF4D6D]">different</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-6 text-gray-600 text-lg max-w-sm"
            >
              We’re built around your schedule and your peace of mind.
            </motion.p>
            {/* Decorative: three dots */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex gap-2"
            >
              {[1, 2, 3].map((i) => (
                <motion.span
                  key={i}
                  className="h-2 w-2 rounded-full bg-[#FF4D6D]"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </motion.div>
          </div>

          {/* Right: timeline list */}
          <div className="lg:col-span-7 relative" ref={lineRef}>
            {/* Vertical line that draws on scroll */}
            <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-slate-200 overflow-hidden">
              <motion.div
                className="h-full w-full bg-[#FF4D6D]"
                initial={{ scaleY: 0 }}
                animate={isLineInView ? { scaleY: 1 } : { scaleY: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                style={{ originY: 0 }}
              />
            </div>

            <ul className="relative space-y-0">
              {features.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                    className="relative flex gap-8 pb-16 last:pb-0 group"
                  >
                    {/* Node dot */}
                    <motion.div
                      className="relative flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-[#FF4D6D] shadow-md shadow-[#FF4D6D]/25 z-10"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring" as const, stiffness: 200, damping: 20, delay: 0.3 + index * 0.12 }}
                      whileHover={{ scale: 1.15 }}
                    >
                      <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <motion.span
                        className="text-xs font-bold text-[#FF4D6D] tabular-nums"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + index * 0.15 }}
                      >
                        {item.id}
                      </motion.span>
                      <h3 className="text-xl font-bold text-[#0B1B3A] mt-1 mb-2 group-hover:text-[#FF4D6D] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
