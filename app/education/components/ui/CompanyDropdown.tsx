"use client";

import { Link } from "react-router";
import { Building2, ArrowRight } from "lucide-react";

const companyLinks = [
  { label: "Book Consultation", href: "/contact" },
  { label: "About Us", href: "/about" },
];

export function CompanyDropdown() {
  return (
    <div className="w-full max-w-7xl mx-auto py-4">
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2D7FF9] text-white mb-3">
          <Building2 className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-bold text-[#212529]">Company</h3>
      </div>
      <div className="flex flex-wrap justify-center gap-x-12 gap-y-2">
        {companyLinks.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className="group flex items-center gap-2 py-2 text-[15px] font-bold text-[#212529] hover:text-pink-600 transition-colors"
          >
            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-600" />
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
