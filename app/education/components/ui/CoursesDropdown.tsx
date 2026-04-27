"use client";

import { Link } from "react-router";
import { BookOpen, ArrowRight, LayoutGrid } from "lucide-react";
import { courses } from "~/education/lib/courses";

const COURSES_IN_DROPDOWN = 4;
const dropdownCourses = courses.slice(0, COURSES_IN_DROPDOWN);

export function CoursesDropdown() {
  return (
    <div className="w-full max-w-7xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 min-w-0">
          {dropdownCourses.map((course) => {
            const Icon = course.icon;
            return (
              <Link
                key={course.id}
                to="/education/courses"
                className="group flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-[#FF4D6D]/40 hover:shadow-lg hover:shadow-[#FF4D6D]/5 transition-all duration-200"
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors"
                  style={{ background: "linear-gradient(135deg, #FF4D6D15, #E11D4810)" }}
                >
                  <Icon className="h-5 w-5 text-[#FF4D6D]" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-lg font-bold text-[#0B1B3A] group-hover:text-[#FF4D6D] transition-colors line-clamp-2">
                    {course.name}
                  </h4>
                  <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">{course.description}</p>
                  <span className="inline-flex items-center gap-1.5 mt-2 text-sm font-semibold text-[#FF4D6D] group-hover:gap-2 transition-all">
                    View <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
        <Link
          to="/education/courses"
          className="group flex flex-col items-center justify-center gap-2 p-6 rounded-2xl min-h-[140px] min-w-[200px] sm:min-w-[220px] text-white transition-all duration-200 hover:opacity-95 shrink-0"
          style={{ background: "linear-gradient(135deg, #0B1B3A, #162d4d)" }}
        >
          <LayoutGrid className="h-8 w-8 text-white" />
          <span className="text-lg font-bold">View all courses</span>
          <span className="text-xs text-white/70">({courses.length} areas)</span>
        </Link>
      </div>
    </div>
  );
}
