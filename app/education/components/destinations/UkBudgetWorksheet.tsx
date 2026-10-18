"use client";

import { useState } from "react";
import { Printer, RotateCcw, Plus, Trash2, Info, AlertTriangle, CheckCircle2 } from "lucide-react";

interface CostItem {
  id: string;
  category: string;
  label: string;
  amount: number | "";
  currency: "GBP" | "PKR";
  paymentDue: string;
  sourceUrl: string;
  dateChecked: string;
  confidence: "estimate" | "confirmed";
  note?: string;
  isDeposit?: boolean;
  isScholarship?: boolean;
}

interface CourseOption {
  id: string;
  courseTitle: string;
  institution: string;
  location: string;
  intake: string;
  costs: CostItem[];
}

const DEFAULT_COST_ITEMS: Omit<CostItem, "id">[] = [
  {
    category: "Tuition",
    label: "Tuition fee (published international rate)",
    amount: "",
    currency: "GBP",
    paymentDue: "Per university schedule",
    sourceUrl: "",
    dateChecked: "",
    confidence: "estimate",
    note: "Full course tuition as published by the university for your exact intake.",
  },
  {
    category: "Deposit",
    label: "Initial tuition deposit",
    amount: "",
    currency: "GBP",
    paymentDue: "Before CAS issuance",
    sourceUrl: "",
    dateChecked: "",
    confidence: "estimate",
    isDeposit: true,
    note: "Part of the tuition total, NOT an added fee. Needed upfront before CAS.",
  },
  {
    category: "Living",
    label: "Estimated accommodation & living expenses",
    amount: "",
    currency: "GBP",
    paymentDue: "Monthly / termly after arrival",
    sourceUrl: "",
    dateChecked: "",
    confidence: "estimate",
    note: "Rent, groceries, utilities, local travel. Note: Visa maintenance threshold is an evidence floor, not actual spending.",
  },
  {
    category: "Travel",
    label: "Flights & UK local transit",
    amount: "",
    currency: "GBP",
    paymentDue: "Prior to departure",
    sourceUrl: "",
    dateChecked: "",
    confidence: "estimate",
    note: "Return flights, airport transfers, local transit cards.",
  },
  {
    category: "Government",
    label: "Student visa fee + Immigration Health Surcharge (IHS)",
    amount: "",
    currency: "GBP",
    paymentDue: "At visa submission",
    sourceUrl: "",
    dateChecked: "",
    confidence: "estimate",
    note: "Official UKVI application fee + IHS healthcare coverage for study duration.",
  },
  {
    category: "Materials",
    label: "Study materials, books & equipment",
    amount: "",
    currency: "GBP",
    paymentDue: "Start of term",
    sourceUrl: "",
    dateChecked: "",
    confidence: "estimate",
    note: "Laptop, specialized books, lab materials, professional memberships.",
  },
  {
    category: "Contingency",
    label: "Emergency family reserve",
    amount: "",
    currency: "GBP",
    paymentDue: "Liquid reserve",
    sourceUrl: "",
    dateChecked: "",
    confidence: "estimate",
    note: "Buffer for currency fluctuation (PKR/GBP) and unexpected initial costs.",
  },
  {
    category: "Scholarship",
    label: "Confirmed institutional scholarship (in writing)",
    amount: "",
    currency: "GBP",
    paymentDue: "Deducted from tuition",
    sourceUrl: "",
    dateChecked: "",
    confidence: "estimate",
    isScholarship: true,
    note: "Deducted ONLY if confirmed in an official letter with written conditions.",
  },
];

export function UkBudgetWorksheet() {
  const [courses, setCourses] = useState<CourseOption[]>([
    {
      id: "course-1",
      courseTitle: "",
      institution: "",
      location: "",
      intake: "",
      costs: DEFAULT_COST_ITEMS.map((item, idx) => ({
        ...item,
        id: `c1-item-${idx}`,
      })),
    },
  ]);

  const [activeCourseIndex, setActiveCourseIndex] = useState(0);
  const [exchangeRatePKR, setExchangeRatePKR] = useState<number | "">("");

  const activeCourse = courses[activeCourseIndex] || courses[0];

  const updateCourseMeta = (field: keyof Omit<CourseOption, "id" | "costs">, val: string) => {
    setCourses((prev) => {
      const updated = [...prev];
      updated[activeCourseIndex] = {
        ...updated[activeCourseIndex],
        [field]: val,
      };
      return updated;
    });
  };

  const updateCostItem = (itemId: string, field: keyof CostItem, val: any) => {
    setCourses((prev) => {
      const updated = [...prev];
      const curCourse = updated[activeCourseIndex];
      const newCosts = curCourse.costs.map((c) => {
        if (c.id === itemId) {
          return { ...c, [field]: val };
        }
        return c;
      });
      updated[activeCourseIndex] = { ...curCourse, costs: newCosts };
      return updated;
    });
  };

  const addCourse = () => {
    if (courses.length >= 3) return;
    const newIdx = courses.length + 1;
    const newCourse: CourseOption = {
      id: `course-${newIdx}`,
      courseTitle: "",
      institution: "",
      location: "",
      intake: "",
      costs: DEFAULT_COST_ITEMS.map((item, idx) => ({
        ...item,
        id: `c${newIdx}-item-${idx}`,
      })),
    };
    setCourses((prev) => [...prev, newCourse]);
    setActiveCourseIndex(courses.length);
  };

  const removeCourse = (indexToRemove: number) => {
    if (courses.length <= 1) return;
    setCourses((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setActiveCourseIndex(0);
  };

  const resetWorksheet = () => {
    if (typeof window !== "undefined") {
      const confirmed = window.confirm(
        "Reset the worksheet? All entered figures in this browser session will be cleared."
      );
      if (!confirmed) return;
    }
    setCourses([
      {
        id: "course-1",
        courseTitle: "",
        institution: "",
        location: "",
        intake: "",
        costs: DEFAULT_COST_ITEMS.map((item, idx) => ({
          ...item,
          id: `c1-item-${idx}`,
        })),
      },
    ]);
    setActiveCourseIndex(0);
    setExchangeRatePKR("");
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Calculations
  const tuitionRow = activeCourse.costs.find((c) => c.category === "Tuition");
  const depositRow = activeCourse.costs.find((c) => c.isDeposit);
  const scholarshipRow = activeCourse.costs.find((c) => c.isScholarship);

  const tuitionNum = typeof tuitionRow?.amount === "number" ? tuitionRow.amount : 0;
  const depositNum = typeof depositRow?.amount === "number" ? depositRow.amount : 0;

  // Only deduct scholarship if user has marked it confirmed!
  const isScholarshipConfirmed = scholarshipRow?.confidence === "confirmed";
  const scholarshipDeduction =
    isScholarshipConfirmed && typeof scholarshipRow?.amount === "number" ? scholarshipRow.amount : 0;

  // Other non-tuition, non-deposit, non-scholarship cost items
  const otherCostTotal = activeCourse.costs.reduce((sum, item) => {
    if (item.category === "Tuition" || item.isDeposit || item.isScholarship) return sum;
    const val = typeof item.amount === "number" ? item.amount : 0;
    return sum + val;
  }, 0);

  // Total Estimated Outlay: Tuition (net of confirmed scholarship) + other costs
  // Deposit is explicitly NOT counted twice because it is already inside Tuition!
  const netTuition = Math.max(0, tuitionNum - scholarshipDeduction);
  const totalEstimatedCost = netTuition + otherCostTotal;

  // Upfront Near-Term Cash needed before departure: Deposit + Travel + Visa & IHS
  const travelRow = activeCourse.costs.find((c) => c.category === "Travel");
  const govtRow = activeCourse.costs.find((c) => c.category === "Government");
  const travelNum = typeof travelRow?.amount === "number" ? travelRow.amount : 0;
  const govtNum = typeof govtRow?.amount === "number" ? govtRow.amount : 0;
  const upfrontCashNeeded = depositNum + travelNum + govtNum;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-7 md:p-8">
      {/* Worksheet Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="inline-block text-xs font-semibold tracking-wider uppercase text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-full mb-2">
            Planning Worksheet
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-[#0B1B3A]">
            UK Course &amp; Family Budget Planner
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Fill in published figures for your course options. No data is sent or saved externally.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title="Print or save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Worksheet</span>
          </button>
          <button
            type="button"
            onClick={resetWorksheet}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Reset all entered values"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Course Tabs (Course 1, Course 2, etc.) */}
      <div className="flex items-center gap-2 pt-5 pb-4 overflow-x-auto border-b border-slate-100">
        {courses.map((c, idx) => (
          <div key={c.id} className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveCourseIndex(idx)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeCourseIndex === idx
                  ? "bg-[#0B1B3A] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {c.courseTitle || `Course Option ${idx + 1}`}
            </button>
            {courses.length > 1 && (
              <button
                type="button"
                onClick={() => removeCourse(idx)}
                className="p-1.5 text-slate-400 hover:text-red-500 rounded-md transition-colors"
                title="Remove course option"
                aria-label={`Remove Course Option ${idx + 1}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}

        {courses.length < 3 && (
          <button
            type="button"
            onClick={addCourse}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium text-[#FF4D6D] border border-dashed border-[#FF4D6D]/40 hover:bg-[#FF4D6D]/5 transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Course Option</span>
          </button>
        )}
      </div>

      {/* Course Meta Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 py-5 border-b border-slate-100 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Course Title
          </label>
          <input
            type="text"
            placeholder="e.g. MSc Data Science"
            value={activeCourse.courseTitle}
            onChange={(e) => updateCourseMeta("courseTitle", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:border-[#0B1B3A] text-xs"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            University / Institution
          </label>
          <input
            type="text"
            placeholder="e.g. University of Manchester"
            value={activeCourse.institution}
            onChange={(e) => updateCourseMeta("institution", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:border-[#0B1B3A] text-xs"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Location
          </label>
          <input
            type="text"
            placeholder="e.g. Manchester (Outside London)"
            value={activeCourse.location}
            onChange={(e) => updateCourseMeta("location", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:border-[#0B1B3A] text-xs"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Intended Intake
          </label>
          <input
            type="text"
            placeholder="e.g. September 2026"
            value={activeCourse.intake}
            onChange={(e) => updateCourseMeta("intake", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:border-[#0B1B3A] text-xs"
          />
        </div>
      </div>

      {/* Cost Table */}
      <div className="pt-4 overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700 border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/70">
              <th className="py-2.5 px-3">Item Description</th>
              <th className="py-2.5 px-3 w-36">Amount (£)</th>
              <th className="py-2.5 px-3 hidden md:table-cell">Timing / Due</th>
              <th className="py-2.5 px-3 w-32">Status</th>
              <th className="py-2.5 px-3 hidden lg:table-cell">Source / Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {activeCourse.costs.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-3">
                  <div className="font-semibold text-slate-900">{item.label}</div>
                  {item.note && (
                    <div className="text-[11px] text-slate-500 mt-0.5">{item.note}</div>
                  )}
                  {item.isDeposit && (
                    <span className="inline-block mt-1 text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                      Notice: Deducted from tuition, not an added cost
                    </span>
                  )}
                  {item.isScholarship && (
                    <span className="inline-block mt-1 text-[10px] font-medium text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                      Only counted if status is Confirmed in Writing
                    </span>
                  )}
                </td>

                <td className="py-3 px-3">
                  <div className="flex items-center rounded-lg border border-slate-200 overflow-hidden focus-within:border-[#0B1B3A]">
                    <span className="bg-slate-100 text-slate-600 px-2.5 py-1.5 text-xs font-semibold">
                      £
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0"
                      value={item.amount === "" ? "" : item.amount}
                      onChange={(e) => {
                        const val = e.target.value === "" ? "" : Math.max(0, parseFloat(e.target.value) || 0);
                        updateCostItem(item.id, "amount", val);
                      }}
                      className="w-full px-2 py-1.5 text-slate-900 text-xs focus:outline-none"
                    />
                  </div>
                </td>

                <td className="py-3 px-3 hidden md:table-cell">
                  <input
                    type="text"
                    value={item.paymentDue}
                    onChange={(e) => updateCostItem(item.id, "paymentDue", e.target.value)}
                    className="w-full px-2 py-1 rounded border border-slate-200 text-[11px] text-slate-700 focus:outline-none focus:border-[#0B1B3A]"
                  />
                </td>

                <td className="py-3 px-3">
                  <select
                    value={item.confidence}
                    onChange={(e) => updateCostItem(item.id, "confidence", e.target.value)}
                    className="w-full px-2 py-1 rounded border border-slate-200 text-[11px] bg-white text-slate-800 focus:outline-none focus:border-[#0B1B3A]"
                  >
                    <option value="estimate">Estimate</option>
                    <option value="confirmed">Confirmed</option>
                  </select>
                </td>

                <td className="py-3 px-3 hidden lg:table-cell">
                  <div className="space-y-1">
                    <input
                      type="text"
                      placeholder="Source URL / ref"
                      value={item.sourceUrl}
                      onChange={(e) => updateCostItem(item.id, "sourceUrl", e.target.value)}
                      className="w-full px-2 py-1 rounded border border-slate-200 text-[11px] text-slate-700 focus:outline-none"
                    />
                    <input
                      type="date"
                      value={item.dateChecked}
                      onChange={(e) => updateCostItem(item.id, "dateChecked", e.target.value)}
                      className="w-full px-2 py-0.5 rounded border border-slate-200 text-[10px] text-slate-600 focus:outline-none"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Calculated Planning Summary Box */}
      <div className="mt-6 p-5 sm:p-6 rounded-xl bg-slate-50 border border-slate-200">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Worksheet Summary &amp; Cash Flow Split
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-white border border-slate-200/90 shadow-2xs">
            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              Total Estimated Outlay
            </span>
            <div className="text-xl sm:text-2xl font-bold text-[#0B1B3A] mt-1">
              £{totalEstimatedCost.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Tuition (net of confirmed awards) + estimated living, flights, visa fees &amp; reserve.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-white border border-slate-200/90 shadow-2xs">
            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              Upfront Cash Before Travel
            </span>
            <div className="text-xl sm:text-2xl font-bold text-[#FF4D6D] mt-1">
              £{upfrontCashNeeded.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Deposit (£{depositNum.toLocaleString()}) + flights (£{travelNum.toLocaleString()}) + visa &amp; IHS (£{govtNum.toLocaleString()}).
            </p>
          </div>

          <div className="p-4 rounded-lg bg-white border border-slate-200/90 shadow-2xs">
            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              PKR Conversion (Optional)
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs text-slate-500">1 £ = </span>
              <input
                type="number"
                min="0"
                placeholder="e.g. 360"
                value={exchangeRatePKR === "" ? "" : exchangeRatePKR}
                onChange={(e) => {
                  const val = e.target.value === "" ? "" : Math.max(0, parseFloat(e.target.value) || 0);
                  setExchangeRatePKR(val);
                }}
                className="w-24 px-2 py-1 rounded border border-slate-200 text-xs font-semibold text-slate-800"
              />
              <span className="text-xs text-slate-500">PKR</span>
            </div>
            {typeof exchangeRatePKR === "number" && exchangeRatePKR > 0 && (
              <div className="text-xs font-bold text-slate-800 mt-2">
                ≈ ₨ {(totalEstimatedCost * exchangeRatePKR).toLocaleString()} PKR
              </div>
            )}
          </div>
        </div>

        {/* Clear Planning Disclaimer */}
        <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-start gap-2 text-xs text-slate-600">
          <Info className="w-4 h-4 text-[#0B1B3A] shrink-0 mt-0.5" />
          <p>
            <strong>Decision notice:</strong> These calculations are planning estimates for your family budget. They do not constitute an official quote, university invoice, or guarantee of visa compliance. Confirm exact fees and refund rules directly with the institution.
          </p>
        </div>
      </div>
    </div>
  );
}
