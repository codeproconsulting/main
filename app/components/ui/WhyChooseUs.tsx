"use client";

import { FaHeadphones, FaBolt, FaArrowsRotate } from 'react-icons/fa6';
import { BRAND } from "../../lib/constants";

const features = [
  {
    id: "01",
    title: "Follow-Ups",
    description: "We track your progress and update you at every stage.",
    icon: FaArrowsRotate,
  },
  {
    id: "02",
    title: "24/7 Availability",
    description: "Our team is available beyond regular hours, whenever you need.",
    icon: FaHeadphones,
  },
  {
    id: "03",
    title: "Fast Processing",
    description: "Streamlined workflows mean faster applications and less stress.",
    icon: FaBolt,
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: BRAND.pink }}>
          What makes us different
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0B1B3A] tracking-tight mb-10">
          What Makes Us Different
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 md:p-8 hover:border-[#FF4D6D]/30 hover:shadow-lg transition-all"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-white mb-4"
                  style={{ backgroundColor: BRAND.pink }}
                >
                  <Icon className="w-7 h-7" strokeWidth={2} />
                </div>
                <span className="text-xs font-bold text-[#FF4D6D] tabular-nums">{item.id}</span>
                <h3 className="text-xl font-bold text-[#0B1B3A] mt-1 mb-2">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
