"use client";

import { Link } from "react-router";
import { ArrowRight, Target, ScrollText, FileCheck, AppWindow } from "lucide-react";

const BRAND = {
  navy: "#0B1B3A",
  pink: "#FF4D6D",
  pinkDark: "#E11D48",
};

const services = [
  {
    id: 1,
    title: "Interview Preparation",
    description:
      "Pro Consulting professional trainers will help you gain confidence, perfect your interview abilities, and gain insight into common interview questions.",
    icon: Target,
    link: "/education/services/interview-prep",
  },
  {
    id: 2,
    title: "Admission Guidance",
    description:
      "Our admissions counseling services are designed to help you get into your dream University. We offer personalized guidance in selecting the best courses, colleges, and countries.",
    icon: ScrollText,
    link: "/education/services/admission",
  },
  {
    id: 3,
    title: "Visa Processing",
    description:
      "Our visa processing services make the travel easier. We help with document preparation, application submission, and follow-ups.",
    icon: FileCheck,
    link: "/education/services/visa",
  },
  {
    id: 4,
    title: "English Test Preparation",
    description:
      "We offer exam preparation courses for students who wish to study in the UK, Australia, Canada, USA and other top study destinations.",
    icon: AppWindow,
    link: "/education/services/test-prep",
  },
];

function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) {
  const Icon = service.icon;
  return (
    <Link
      to={service.link}
      className="group block relative rounded-3xl overflow-hidden transition-all duration-300 h-full min-h-[280px] flex flex-col p-6 md:p-8 border border-white/5 hover:border-[#FF4D6D]/30 hover:shadow-xl hover:shadow-[#FF4D6D]/15"
      style={{
        background: `linear-gradient(145deg, ${BRAND.navy} 0%, #1a2d4a 40%, #1e2234 100%)`,
      }}
    >
      {/* Subtle pink glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `linear-gradient(145deg, transparent 0%, ${BRAND.pink}08 50%, ${BRAND.pinkDark}06 100%)`,
        }}
      />

      {/* Large corner number */}
      <span
        className="absolute bottom-4 right-6 text-[6rem] md:text-[7rem] font-bold leading-none select-none pointer-events-none"
        style={{ color: "rgba(255,255,255,0.12)" }}
      >
        {index + 1}
      </span>

      {/* Icon – top right, circular */}
      <div
        className="absolute top-5 right-5 w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all duration-300 group-hover:scale-105"
        style={{
          background: `linear-gradient(135deg, ${BRAND.pink}, ${BRAND.pinkDark})`,
          boxShadow: "0 4px 14px rgba(255,77,109,0.35)",
        }}
      >
        <Icon className="w-7 h-7 text-white" strokeWidth={2} />
      </div>

      <div className="relative z-10 flex flex-col flex-1 pt-2">
        <h3 className="text-xl md:text-2xl font-bold mb-3 pr-16 text-white">
          {service.title}
        </h3>
        <p className="text-sm leading-relaxed flex-1 mb-6 max-w-md text-white">
          {service.description}
        </p>
        <span className="inline-flex items-center gap-2 w-fit rounded-full bg-white px-4 py-2.5 text-sm font-semibold transition-all duration-300 group-hover:gap-3 group-hover:shadow-md" style={{ color: BRAND.navy }}>
          Show more
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}

export function StudentServicesSection() {
  return (
    <section
      className="relative py-20 md:py-28"
      style={{ backgroundColor: "#0f172a" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header: title left, subtitle + CTA right (like reference) */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12 md:mb-14">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              <span className="text-white">How we help – </span>
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: `linear-gradient(to right, ${BRAND.pink}, ${BRAND.pinkDark})`,
                }}
              >
                Student Services
              </span>
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6 lg:max-w-md">
            <Link
              to="/education/services"
              className="flex-shrink-0 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:opacity-95 hover:shadow-lg hover:shadow-[#FF4D6D]/30"
              style={{ backgroundColor: BRAND.pink }}
            >
              Browse all services
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Cards grid – all cards use brand gradient; hover adds emphasis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
