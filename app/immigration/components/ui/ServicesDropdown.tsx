"use client";

import { Link } from "react-router";
import { ArrowRight, FileCheck2, Gavel, Plane, Users } from "lucide-react";
import { immigrationServices } from "~/immigration/lib/services";

const iconById: Record<(typeof immigrationServices)[number]["id"], React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  visit: Plane,
  family: Users,
  immigration: FileCheck2,
  appeal: Gavel,
};

const descById: Record<(typeof immigrationServices)[number]["id"], string> = {
  visit: "Tourism, business, and family visit visa support — documents and strategy.",
  family: "Family reunion routes — relationship evidence and compliance guidance.",
  immigration: "Route planning, eligibility, and document strategy for immigration.",
  appeal: "Refusals, reviews, and appeals — understand reasons and respond strongly.",
};

export function ServicesDropdown() {
  return (
    <div className="w-full max-w-7xl mx-auto py-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {immigrationServices.map((s) => {
          const Icon = iconById[s.id] ?? FileCheck2;
          return (
            <Link
              key={s.id}
              to={s.link}
              className="group flex flex-col p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-[#FF4D6D]/40 hover:shadow-lg hover:shadow-[#FF4D6D]/5 transition-all duration-200"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FF4D6D]/10 text-[#FF4D6D] mb-4">
                <Icon className="h-6 w-6" strokeWidth={2} />
              </div>
              <h4 className="text-lg font-bold text-[#0B1B3A] group-hover:text-[#FF4D6D] transition-colors mb-2">
                {s.title}
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed flex-1">
                {descById[s.id]}
              </p>
              <span className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-[#FF4D6D] group-hover:gap-2 transition-all">
                Learn more <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
