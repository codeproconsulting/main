"use client";

import { useState } from "react";
import { Printer, RotateCcw, Info, CheckCircle2 } from "lucide-react";

export function GermanyBudgetTool() {
  const [tuitionPerSemester, setTuitionPerSemester] = useState<number | "">("");
  const [semesterContribution, setSemesterContribution] = useState<number | "">("");
  const [monthlyRent, setMonthlyRent] = useState<number | "">("");
  const [monthlyLiving, setMonthlyLiving] = useState<number | "">("");
  const [oneOffArrival, setOneOffArrival] = useState<number | "">("");
  const [contingencyReserve, setContingencyReserve] = useState<number | "">("");

  // Convert empty string to 0 for calculations, safely validating non-negative values
  const numTuition = typeof tuitionPerSemester === "number" ? Math.max(0, tuitionPerSemester) : 0;
  const numContrib = typeof semesterContribution === "number" ? Math.max(0, semesterContribution) : 0;
  const numRent = typeof monthlyRent === "number" ? Math.max(0, monthlyRent) : 0;
  const numLiving = typeof monthlyLiving === "number" ? Math.max(0, monthlyLiving) : 0;
  const numArrival = typeof oneOffArrival === "number" ? Math.max(0, oneOffArrival) : 0;
  const numContingency = typeof contingencyReserve === "number" ? Math.max(0, contingencyReserve) : 0;

  // Annual calculation (2 semesters + 12 months)
  const annualTuition = numTuition * 2;
  const annualContrib = numContrib * 2;
  const annualRent = numRent * 12;
  const annualLiving = numLiving * 12;

  // Total estimated annual out-of-pocket spending
  const totalAnnualSpending =
    annualTuition + annualContrib + annualRent + annualLiving + numArrival + numContingency;

  // Upfront cash needed before/at arrival (e.g. 1st semester fees + one-off arrival + rental deposit estimate)
  const upfrontArrivalCash = numTuition + numContrib + numArrival + numRent * 2;

  const handleReset = () => {
    if (typeof window !== "undefined") {
      const confirmed = window.confirm(
        "Reset budget figures? All entered values in this session will be cleared."
      );
      if (!confirmed) return;
    }
    setTuitionPerSemester("");
    setSemesterContribution("");
    setMonthlyRent("");
    setMonthlyLiving("");
    setOneOffArrival("");
    setContingencyReserve("");
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-7 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="inline-block text-xs font-semibold tracking-wider uppercase text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-full mb-2">
            Planning Tool
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-[#0B1B3A]">
            Germany Study Budget Worksheet
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Calculate your estimated first-year cash requirements in Euros (€). Default empty.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title="Print worksheet"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Reset figures"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Input Rows */}
      <div className="py-6 space-y-4">
        {/* Tuition */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center py-2 border-b border-slate-100">
          <div className="md:col-span-7">
            <label className="text-xs font-bold text-slate-900 block">
              Tuition fee per semester (€)
            </label>
            <span className="text-[11px] text-slate-500">
              €0 for most public university programmes; Baden-Württemberg, private institutions or specific master's programmes may charge.
            </span>
          </div>
          <div className="md:col-span-5 flex items-center rounded-lg border border-slate-200 overflow-hidden focus-within:border-[#0B1B3A]">
            <span className="bg-slate-100 text-slate-600 px-3 py-2 text-xs font-semibold">€</span>
            <input
              type="number"
              min="0"
              step="any"
              placeholder="0 (leave 0 if tuition-free)"
              value={tuitionPerSemester === "" ? "" : tuitionPerSemester}
              onChange={(e) => {
                const val = e.target.value === "" ? "" : Math.max(0, parseFloat(e.target.value) || 0);
                setTuitionPerSemester(val);
              }}
              className="w-full px-3 py-2 text-xs text-slate-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Semester contribution */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center py-2 border-b border-slate-100">
          <div className="md:col-span-7">
            <label className="text-xs font-bold text-slate-900 block">
              Semester contribution / Semesterticket (€ per semester)
            </label>
            <span className="text-[11px] text-slate-500">
              Mandatory administrative contribution charged at all public universities (typically covers student services and public transit ticket).
            </span>
          </div>
          <div className="md:col-span-5 flex items-center rounded-lg border border-slate-200 overflow-hidden focus-within:border-[#0B1B3A]">
            <span className="bg-slate-100 text-slate-600 px-3 py-2 text-xs font-semibold">€</span>
            <input
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 250 - 400"
              value={semesterContribution === "" ? "" : semesterContribution}
              onChange={(e) => {
                const val = e.target.value === "" ? "" : Math.max(0, parseFloat(e.target.value) || 0);
                setSemesterContribution(val);
              }}
              className="w-full px-3 py-2 text-xs text-slate-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Monthly rent */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center py-2 border-b border-slate-100">
          <div className="md:col-span-7">
            <label className="text-xs font-bold text-slate-900 block">
              Monthly accommodation &amp; utilities (€ per month)
            </label>
            <span className="text-[11px] text-slate-500">
              Student dormitory (Studierendenwerk) or private shared room (WG). Munich/Frankfurt/Berlin typically cost more than smaller university towns.
            </span>
          </div>
          <div className="md:col-span-5 flex items-center rounded-lg border border-slate-200 overflow-hidden focus-within:border-[#0B1B3A]">
            <span className="bg-slate-100 text-slate-600 px-3 py-2 text-xs font-semibold">€</span>
            <input
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 350 - 650"
              value={monthlyRent === "" ? "" : monthlyRent}
              onChange={(e) => {
                const val = e.target.value === "" ? "" : Math.max(0, parseFloat(e.target.value) || 0);
                setMonthlyRent(val);
              }}
              className="w-full px-3 py-2 text-xs text-slate-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Monthly living */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center py-2 border-b border-slate-100">
          <div className="md:col-span-7">
            <label className="text-xs font-bold text-slate-900 block">
              Other monthly living costs (€ per month)
            </label>
            <span className="text-[11px] text-slate-500">
              Food, statutory health insurance (Krankenversicherung), phone/internet, clothing and leisure.
            </span>
          </div>
          <div className="md:col-span-5 flex items-center rounded-lg border border-slate-200 overflow-hidden focus-within:border-[#0B1B3A]">
            <span className="bg-slate-100 text-slate-600 px-3 py-2 text-xs font-semibold">€</span>
            <input
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 350 - 500"
              value={monthlyLiving === "" ? "" : monthlyLiving}
              onChange={(e) => {
                const val = e.target.value === "" ? "" : Math.max(0, parseFloat(e.target.value) || 0);
                setMonthlyLiving(val);
              }}
              className="w-full px-3 py-2 text-xs text-slate-900 focus:outline-none"
            />
          </div>
        </div>

        {/* One-off arrival / documents */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center py-2 border-b border-slate-100">
          <div className="md:col-span-7">
            <label className="text-xs font-bold text-slate-900 block">
              One-off initial &amp; travel costs (€)
            </label>
            <span className="text-[11px] text-slate-500">
              Flights from Pakistan, visa fees, uni-assist evaluation fees, HEC attestations, translations and blocked account opening fee.
            </span>
          </div>
          <div className="md:col-span-5 flex items-center rounded-lg border border-slate-200 overflow-hidden focus-within:border-[#0B1B3A]">
            <span className="bg-slate-100 text-slate-600 px-3 py-2 text-xs font-semibold">€</span>
            <input
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 800 - 1500"
              value={oneOffArrival === "" ? "" : oneOffArrival}
              onChange={(e) => {
                const val = e.target.value === "" ? "" : Math.max(0, parseFloat(e.target.value) || 0);
                setOneOffArrival(val);
              }}
              className="w-full px-3 py-2 text-xs text-slate-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Contingency */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center py-2 border-b border-slate-100">
          <div className="md:col-span-7">
            <label className="text-xs font-bold text-slate-900 block">
              Emergency contingency reserve (€)
            </label>
            <span className="text-[11px] text-slate-500">
              Reserve buffer for currency fluctuations and unexpected rental deposit or setup needs.
            </span>
          </div>
          <div className="md:col-span-5 flex items-center rounded-lg border border-slate-200 overflow-hidden focus-within:border-[#0B1B3A]">
            <span className="bg-slate-100 text-slate-600 px-3 py-2 text-xs font-semibold">€</span>
            <input
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 500 - 1000"
              value={contingencyReserve === "" ? "" : contingencyReserve}
              onChange={(e) => {
                const val = e.target.value === "" ? "" : Math.max(0, parseFloat(e.target.value) || 0);
                setContingencyReserve(val);
              }}
              className="w-full px-3 py-2 text-xs text-slate-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Summary Box */}
      <div className="mt-4 p-5 sm:p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Planning Summary (Euros)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-white border border-slate-200/90 shadow-2xs">
            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              Estimated 1st-Year Outlay
            </span>
            <div className="text-2xl font-bold text-[#0B1B3A] mt-1">
              €{totalAnnualSpending.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Tuition (2 sem) + semester contrib (2 sem) + rent (12 mo) + living (12 mo) + arrival &amp; reserve.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-white border border-slate-200/90 shadow-2xs">
            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              Upfront Cash for Arrival &amp; Setup
            </span>
            <div className="text-2xl font-bold text-[#FF4D6D] mt-1">
              €{upfrontArrivalCash.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              1st semester fees + flights/arrival + estimated room security deposit (2 months' rent).
            </p>
          </div>
        </div>

        {/* Vital distinction notice: Never sum blocked funds twice */}
        <div className="p-4 rounded-lg bg-blue-50/70 border border-blue-200/80 flex items-start gap-2.5 text-xs text-blue-900 leading-relaxed">
          <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <div>
            <strong>Important Funding Distinction:</strong> A blocked account (Sperrkonto), where required by the German mission, holds funds for your living costs and releases them monthly to you after arrival. Do not count blocked funds twice as both a separate tuition charge and living expenditure.
          </div>
        </div>

        <p className="text-[11px] text-slate-500 pt-1">
          * Calculated values are planning estimates for your family budget. They do not constitute an official quote, university fee invoice or visa compliance guarantee.
        </p>
      </div>
    </div>
  );
}
