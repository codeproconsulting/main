"use client";

import { Link } from "react-router";
import { FileText, ArrowRight } from "lucide-react";

const blogLinks = [
  { label: "Latest News", href: "/blog" },
  { label: "Upcoming Events", href: "/events" },
];

export function BlogsDropdown() {
  return (
    <div className="w-full max-w-7xl mx-auto py-2">
      <div className="flex items-center justify-center gap-3 mb-8">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg"
          style={{ background: "linear-gradient(135deg, #FF4D6D, #E11D48)" }}
        >
          <FileText className="h-5 w-5" />
        </div>
        <div className="text-center">
          <p className="text-xs font-semibold text-[#FF4D6D] uppercase tracking-wider">Resources</p>
          <h3 className="text-lg font-bold text-[#0B1B3A]">Blogs</h3>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {blogLinks.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className="group flex items-center gap-3 px-5 py-4 rounded-2xl bg-white border border-slate-200/80 hover:border-[#FF4D6D]/40 hover:shadow-lg hover:shadow-[#FF4D6D]/5 transition-all duration-200"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FF4D6D]/10 text-[#FF4D6D] group-hover:bg-[#FF4D6D] group-hover:text-white transition-colors">
              <FileText className="h-5 w-5" />
            </span>
            <span className="text-[15px] font-bold text-[#0B1B3A] group-hover:text-[#FF4D6D] transition-colors">
              {item.label}
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-white group-hover:text-[#FF4D6D] group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
}
