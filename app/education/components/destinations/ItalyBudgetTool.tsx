"use client";

import { useState } from "react";
import { Printer, RotateCcw, Info, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

interface ItalyPreset {
  id: string;
  name: string;
  description: string;
  tuition: number;
  monthlyRent: number;
  monthlyLiving: number;
  initialPrep: number;
  contingency: number;
  isScholarship: boolean;
  expectedScholarshipBenefit: number; // Annual cash grant + benefits
}

const PRESETS: ItalyPreset[] = [
  {
    id: "dsu-scholarship",
    name: "Regional Scholarship (DSU / ER.GO)",
    description: "Most Pakistani students qualify for regional income-based scholarships (ISEE < €25,000).",
    tuition: 156, // Regional tax only
    monthlyRent: 350,
    monthlyLiving: 250,
    initialPrep: 1200, // CIMEA, apostille, translations, visa, flights
    contingency: 800,
    isScholarship: true,
    expectedScholarshipBenefit: 6500, // Expected annual DSU grant + meal stipend
  },
  {
    id: "public-self-funded",
    name: "Public University (Self-Funded)",
    description: "Standard public university tuition fee based on family income without a scholarship grant.",
    tuition: 1200,
    monthlyRent: 450,
    monthlyLiving: 350,
    initialPrep: 1200,
    contingency: 1000,
    isScholarship: false,
    expectedScholarshipBenefit: 0,
  },
  {
    id: "private-institution",
    name: "Private University / Design School",
    description: "Private Italian universities and design academies (e.g. NABA, Bocconi, Cattolica, Marangoni).",
    tuition: 8500,
    monthlyRent: 600,
    monthlyLiving: 450,
    initialPrep: 1500,
    contingency: 1500,
    isScholarship: false,
    expectedScholarshipBenefit: 0,
  },
];

export function ItalyBudgetTool() {
  const [activePreset, setActivePreset] = useState<string>("dsu-scholarship");
  const [tuitionPerYear, setTuitionPerYear] = useState<number | "">(156);
  const [monthlyRent, setMonthlyRent] = useState<number | "">(350);
  const [monthlyLiving, setMonthlyLiving] = useState<number | "">(250);
  const [oneOffPrep, setOneOffPrep] = useState<number | "">(1200);
  const [contingencyReserve, setContingencyReserve] = useState<number | "">(800);
  const [hasScholarship, setHasScholarship] = useState<boolean>(true);
  const [scholarshipGrant, setScholarshipGrant] = useState<number | "">(6500);
  const [exchangeRatePKR, setExchangeRatePKR] = useState<number | "">(315);

  const applyPreset = (preset: ItalyPreset) => {
    setActivePreset(preset.id);
    setTuitionPerYear(preset.tuition);
    setMonthlyRent(preset.monthlyRent);
    setMonthlyLiving(preset.monthlyLiving);
    setOneOffPrep(preset.initialPrep);
    setContingencyReserve(preset.contingency);
    setHasScholarship(preset.isScholarship);
    setScholarshipGrant(preset.expectedScholarshipBenefit);
  };

  const handleReset = () => {
    if (typeof window !== "undefined") {
      const confirmed = window.confirm("Reset Italy budget worksheet figures?");
      if (!confirmed) return;
    }
    applyPreset(PRESETS[0]);
    setExchangeRatePKR(315);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Safe numerical calculations
  const numTuition = typeof tuitionPerYear === "number" ? Math.max(0, tuitionPerYear) : 0;
  const numRent = typeof monthlyRent === "number" ? Math.max(0, monthlyRent) : 0;
  const numLiving = typeof monthlyLiving === "number" ? Math.max(0, monthlyLiving) : 0;
  const numPrep = typeof oneOffPrep === "number" ? Math.max(0, oneOffPrep) : 0;
  const numContingency = typeof contingencyReserve === "number" ? Math.max(0, contingencyReserve) : 0;
  const numScholarship = hasScholarship && typeof scholarshipGrant === "number" ? Math.max(0, scholarshipGrant) : 0;

  // Annual living expenses (10-12 months)
  const annualRent = numRent * 12;
  const annualLiving = numLiving * 12;

  // Total gross outlay without deducting scholarship
  const grossAnnualOutlay = numTuition + annualRent + annualLiving + numPrep + numContingency;

  // Net outlay if scholarship is received
  const netAnnualOutlay = Math.max(0, grossAnnualOutlay - numScholarship);

  // CRUCIAL: Upfront cash needed in Pakistan before scholarship disbursement (First 3-4 months)
  // Most students must fund visa, flights, CIMEA, translations + 3 months rent & living before DSU pays out!
  const upfrontCashNeeded = numTuition + numPrep + (numRent * 3) + (numLiving * 3);

  const rate = typeof exchangeRatePKR === "number" && exchangeRatePKR > 0 ? exchangeRatePKR : 315;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-7 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block text-xs font-semibold tracking-wider uppercase text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-full">
              Interactive Planning Tool
            </span>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              DSU &amp; Regional Ready
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#0B1B3A]">
            Italy Study &amp; Scholarship Budget Planner
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Simulate realistic first-year costs with or without regional Italian scholarships (DSU, ER.GO, ALiSEO).
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

      {/* Preset Selector */}
      <div className="pt-5 pb-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
          Select Typical Scenario Preset:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {PRESETS.map((p) => {
            const isSelected = activePreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p)}
                className={`text-left p-3.5 rounded-xl border text-xs transition-all ${
                  isSelected
                    ? "border-[#0B1B3A] bg-[#0B1B3A] text-white shadow-sm ring-2 ring-[#0B1B3A]/20"
                    : "border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="font-bold mb-1 flex items-center justify-between">
                  <span>{p.name}</span>
                  {isSelected && <Sparkles className="w-3.5 h-3.5 text-[#FF4D6D]" />}
                </div>
                <p className={`text-[11px] leading-relaxed line-clamp-2 ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                  {p.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Breakdown */}
      <div className="py-5 space-y-4 border-t border-b border-slate-100 my-4">
        {/* Tuition */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center py-2 border-b border-slate-100">
          <div className="md:col-span-7">
            <label className="text-xs font-bold text-slate-900 block">
              Annual University Tuition Fee (€ / year)
            </label>
            <span className="text-[11px] text-slate-500">
              Italian public universities charge €156 regional tax up to €1,500–€2,500 based on ISEE Parificato. DSU holders receive 100% waiver.
            </span>
          </div>
          <div className="md:col-span-5 flex items-center rounded-lg border border-slate-200 overflow-hidden focus-within:border-[#0B1B3A]">
            <span className="bg-slate-100 text-slate-600 px-3 py-2 text-xs font-semibold">€</span>
            <input
              type="number"
              min="0"
              step="any"
              value={tuitionPerYear === "" ? "" : tuitionPerYear}
              onChange={(e) => {
                setActivePreset("custom");
                setTuitionPerYear(e.target.value === "" ? "" : Math.max(0, parseFloat(e.target.value) || 0));
              }}
              className="w-full px-3 py-2 text-xs text-slate-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Monthly Rent */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center py-2 border-b border-slate-100">
          <div className="md:col-span-7">
            <label className="text-xs font-bold text-slate-900 block">
              Monthly Accommodation &amp; Utilities (€ / month)
            </label>
            <span className="text-[11px] text-slate-500">
              Shared room or student residence (Milano/Rome €450–€650; Bologna/Padua/Turin €350–€500; South €250–€350).
            </span>
          </div>
          <div className="md:col-span-5 flex items-center rounded-lg border border-slate-200 overflow-hidden focus-within:border-[#0B1B3A]">
            <span className="bg-slate-100 text-slate-600 px-3 py-2 text-xs font-semibold">€</span>
            <input
              type="number"
              min="0"
              step="any"
              value={monthlyRent === "" ? "" : monthlyRent}
              onChange={(e) => {
                setActivePreset("custom");
                setMonthlyRent(e.target.value === "" ? "" : Math.max(0, parseFloat(e.target.value) || 0));
              }}
              className="w-full px-3 py-2 text-xs text-slate-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Monthly Living */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center py-2 border-b border-slate-100">
          <div className="md:col-span-7">
            <label className="text-xs font-bold text-slate-900 block">
              Food, Canteen, Transit &amp; Mobile (€ / month)
            </label>
            <span className="text-[11px] text-slate-500">
              Groceries, mensa university canteen card (often free/discounted with DSU), regional bus/train pass.
            </span>
          </div>
          <div className="md:col-span-5 flex items-center rounded-lg border border-slate-200 overflow-hidden focus-within:border-[#0B1B3A]">
            <span className="bg-slate-100 text-slate-600 px-3 py-2 text-xs font-semibold">€</span>
            <input
              type="number"
              min="0"
              step="any"
              value={monthlyLiving === "" ? "" : monthlyLiving}
              onChange={(e) => {
                setActivePreset("custom");
                setMonthlyLiving(e.target.value === "" ? "" : Math.max(0, parseFloat(e.target.value) || 0));
              }}
              className="w-full px-3 py-2 text-xs text-slate-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Initial Prep & Arrival in Pakistan */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center py-2 border-b border-slate-100">
          <div className="md:col-span-7">
            <label className="text-xs font-bold text-slate-900 block">
              One-off Prep, CIMEA, Legalisation &amp; Flights (€)
            </label>
            <span className="text-[11px] text-slate-500">
              CIMEA comparability/DOV, MOFA/HEC attestations, Italian translation, visa fees + airfare from Pakistan.
            </span>
          </div>
          <div className="md:col-span-5 flex items-center rounded-lg border border-slate-200 overflow-hidden focus-within:border-[#0B1B3A]">
            <span className="bg-slate-100 text-slate-600 px-3 py-2 text-xs font-semibold">€</span>
            <input
              type="number"
              min="0"
              step="any"
              value={oneOffPrep === "" ? "" : oneOffPrep}
              onChange={(e) => {
                setActivePreset("custom");
                setOneOffPrep(e.target.value === "" ? "" : Math.max(0, parseFloat(e.target.value) || 0));
              }}
              className="w-full px-3 py-2 text-xs text-slate-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Regional Scholarship Toggle */}
        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80">
          <div className="flex items-center justify-between gap-4">
            <div>
              <label className="text-xs font-bold text-[#0B1B3A] block">
                Applying for Regional Scholarship (DSU / ER.GO / laziodisco)?
              </label>
              <span className="text-[11px] text-slate-600">
                Covers tuition waiver, free meals, and provides an annual cash stipend (up to ~€7,500 in instalments).
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={hasScholarship}
                onChange={(e) => setHasScholarship(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF4D6D]"></div>
            </label>
          </div>

          {hasScholarship && (
            <div className="mt-3 pt-3 border-t border-blue-200/70 flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                Estimated Scholarship Cash Benefit:
              </span>
              <div className="flex items-center rounded-lg border border-blue-300 bg-white overflow-hidden max-w-[200px]">
                <span className="bg-blue-100 text-blue-900 px-2.5 py-1 text-xs font-semibold">€</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={scholarshipGrant === "" ? "" : scholarshipGrant}
                  onChange={(e) => setScholarshipGrant(e.target.value === "" ? "" : Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-2 py-1 text-xs text-slate-900 focus:outline-none"
                />
              </div>
              <span className="text-[11px] text-slate-500">/ academic year</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary Box with PKR and Upfront Safety Cash */}
      <div className="mt-4 p-5 sm:p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Calculated Italy Financial Breakdown
          </h4>

          {/* PKR Rate Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Exchange Rate:</span>
            <div className="flex items-center rounded border border-slate-300 bg-white px-2 py-1 text-xs">
              <span className="font-semibold text-slate-700 mr-1">1 € =</span>
              <input
                type="number"
                min="0"
                value={exchangeRatePKR === "" ? "" : exchangeRatePKR}
                onChange={(e) => setExchangeRatePKR(e.target.value === "" ? "" : Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-14 text-xs font-bold text-slate-900 focus:outline-none"
              />
              <span className="text-slate-500 ml-1">PKR</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Upfront Cash Needed in Pakistan */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              Upfront Cash (Departure &amp; First 3 Mo)
            </span>
            <div className="text-2xl font-black text-[#FF4D6D] mt-1">
              €{upfrontCashNeeded.toLocaleString()}
            </div>
            <div className="text-xs font-bold text-slate-800 mt-1">
              ≈ ₨ {(upfrontCashNeeded * rate).toLocaleString()} PKR
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Tuition deposit + flights + CIMEA/docs + first 3 months living before scholarship arrival.
            </p>
          </div>

          {/* Card 2: Gross Annual Expenses */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              Gross Full-Year Outlay
            </span>
            <div className="text-2xl font-black text-[#0B1B3A] mt-1">
              €{grossAnnualOutlay.toLocaleString()}
            </div>
            <div className="text-xs font-bold text-slate-800 mt-1">
              ≈ ₨ {(grossAnnualOutlay * rate).toLocaleString()} PKR
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Full cost of living (12 mo) + university fees + arrival documents &amp; emergency reserve.
            </p>
          </div>

          {/* Card 3: Net Family Outlay with Scholarship */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              Net Cost After Scholarship
            </span>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              €{netAnnualOutlay.toLocaleString()}
            </div>
            <div className="text-xs font-bold text-slate-800 mt-1">
              ≈ ₨ {(netAnnualOutlay * rate).toLocaleString()} PKR
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              {hasScholarship
                ? `Net out-of-pocket after ~€${numScholarship.toLocaleString()} DSU grant is credited.`
                : "No scholarship applied (self-funded baseline)."}
            </p>
          </div>
        </div>

        {/* Warning Alert about Scholarship Timing */}
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/90 flex items-start gap-2.5 text-xs text-amber-900 leading-relaxed">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>Vital Timeline Notice for Pakistani Families:</strong> Italian scholarship ranking lists are typically published in October/November, and cash instalments begin arriving in December/January. Your family <strong>must</strong> arrange upfront funds (~€2,500–€3,000) for initial travel, room deposit and early weeks in Italy.
          </div>
        </div>
      </div>
    </div>
  );
}
