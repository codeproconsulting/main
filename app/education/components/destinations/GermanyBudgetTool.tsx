"use client";

import { useState } from "react";
import { Printer, RotateCcw, Info, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";

interface GermanyPreset {
  id: string;
  name: string;
  description: string;
  tuitionPerSemester: number;
  semesterContribution: number;
  monthlyRent: number;
  monthlyLiving: number;
  oneOffArrival: number;
  contingencyReserve: number;
  blockedAccountRequired: boolean;
  blockedAccountAmount: number;
}

const PRESETS: GermanyPreset[] = [
  {
    id: "public-free",
    name: "Tuition-Free Public University",
    description: "Standard public universities in Germany. Zero tuition, only semester transit contribution.",
    tuitionPerSemester: 0,
    semesterContribution: 350,
    monthlyRent: 450,
    monthlyLiving: 400,
    oneOffArrival: 1200,
    contingencyReserve: 1000,
    blockedAccountRequired: true,
    blockedAccountAmount: 11904, // Official German embassy requirement (~€992/month for 12 months)
  },
  {
    id: "private-uni",
    name: "Private University / Business School",
    description: "Private institutions charging tuition fees per semester alongside living & blocked account costs.",
    tuitionPerSemester: 5500,
    semesterContribution: 300,
    monthlyRent: 550,
    monthlyLiving: 450,
    oneOffArrival: 1200,
    contingencyReserve: 1200,
    blockedAccountRequired: true,
    blockedAccountAmount: 11904,
  },
  {
    id: "sponsored",
    name: "Sponsored / Verpflichtungserklärung",
    description: "Students with a German resident sponsor providing a formal Declaration of Commitment (no blocked account).",
    tuitionPerSemester: 0,
    semesterContribution: 350,
    monthlyRent: 450,
    monthlyLiving: 400,
    oneOffArrival: 1200,
    contingencyReserve: 1000,
    blockedAccountRequired: false,
    blockedAccountAmount: 0,
  },
];

export function GermanyBudgetTool() {
  const [activePreset, setActivePreset] = useState<string>("public-free");
  const [tuitionPerSemester, setTuitionPerSemester] = useState<number | "">(0);
  const [semesterContribution, setSemesterContribution] = useState<number | "">(350);
  const [monthlyRent, setMonthlyRent] = useState<number | "">(450);
  const [monthlyLiving, setMonthlyLiving] = useState<number | "">(400);
  const [oneOffArrival, setOneOffArrival] = useState<number | "">(1200);
  const [contingencyReserve, setContingencyReserve] = useState<number | "">(1000);
  const [hasBlockedAccount, setHasBlockedAccount] = useState<boolean>(true);
  const [blockedAccountAmount, setBlockedAccountAmount] = useState<number | "">(11904);
  const [exchangeRatePKR, setExchangeRatePKR] = useState<number | "">(315);

  const applyPreset = (p: GermanyPreset) => {
    setActivePreset(p.id);
    setTuitionPerSemester(p.tuitionPerSemester);
    setSemesterContribution(p.semesterContribution);
    setMonthlyRent(p.monthlyRent);
    setMonthlyLiving(p.monthlyLiving);
    setOneOffArrival(p.oneOffArrival);
    setContingencyReserve(p.contingencyReserve);
    setHasBlockedAccount(p.blockedAccountRequired);
    setBlockedAccountAmount(p.blockedAccountAmount);
  };

  const handleReset = () => {
    if (typeof window !== "undefined") {
      const confirmed = window.confirm("Reset Germany budget worksheet to defaults?");
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

  // Convert empty string to 0 for calculations safely
  const numTuition = typeof tuitionPerSemester === "number" ? Math.max(0, tuitionPerSemester) : 0;
  const numContrib = typeof semesterContribution === "number" ? Math.max(0, semesterContribution) : 0;
  const numRent = typeof monthlyRent === "number" ? Math.max(0, monthlyRent) : 0;
  const numLiving = typeof monthlyLiving === "number" ? Math.max(0, monthlyLiving) : 0;
  const numArrival = typeof oneOffArrival === "number" ? Math.max(0, oneOffArrival) : 0;
  const numContingency = typeof contingencyReserve === "number" ? Math.max(0, contingencyReserve) : 0;
  const numBlocked = hasBlockedAccount && typeof blockedAccountAmount === "number" ? Math.max(0, blockedAccountAmount) : 0;

  // Annual calculations
  const annualTuition = numTuition * 2;
  const annualContrib = numContrib * 2;
  const annualLivingActual = (numRent + numLiving) * 12;

  // Upfront cash required in Pakistan before departing (Blocked account deposit + 1st sem tuition & contrib + arrival travel/visa)
  const upfrontCashNeeded = numBlocked + numTuition + numContrib + numArrival;

  // Total annual family cost (Tuition + Contribution + Living + Arrival + Buffer)
  // (Note: Blocked account covers living, so living is not added on top of blocked account for actual out-of-pocket expenditure)
  const totalAnnualSpending = annualTuition + annualContrib + annualLivingActual + numArrival + numContingency;

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
            <span className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
              Sperrkonto / Blocked Account Ready
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#0B1B3A]">
            Germany Study Budget &amp; Blocked Account Worksheet
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Calculate accurate upfront funding requirements and living expenditure for Pakistani students.
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
          Select Route Preset:
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
        {/* Blocked Account (Sperrkonto) Section */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/90">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-xs text-amber-950">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>German Visa Financing: Blocked Account (Sperrkonto)</span>
              </div>
              <span className="text-[11px] text-amber-900/80 block mt-0.5">
                Required by the German Embassy in Pakistan. Current statutory threshold is €11,904/year (€992/month).
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={hasBlockedAccount}
                onChange={(e) => {
                  setActivePreset("custom");
                  setHasBlockedAccount(e.target.checked);
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF4D6D]"></div>
            </label>
          </div>

          {hasBlockedAccount && (
            <div className="mt-3 pt-3 border-t border-amber-200/80 flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-amber-950">
                Blocked Account Escrow Deposit (€):
              </span>
              <div className="flex items-center rounded-lg border border-amber-300 bg-white overflow-hidden max-w-[200px]">
                <span className="bg-amber-100 text-amber-900 px-2.5 py-1 text-xs font-semibold">€</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={blockedAccountAmount === "" ? "" : blockedAccountAmount}
                  onChange={(e) => {
                    setActivePreset("custom");
                    setBlockedAccountAmount(e.target.value === "" ? "" : Math.max(0, parseFloat(e.target.value) || 0));
                  }}
                  className="w-full px-2 py-1 text-xs text-slate-900 focus:outline-none font-semibold"
                />
              </div>
            </div>
          )}
        </div>

        {/* Tuition Fee */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center py-2 border-b border-slate-100">
          <div className="md:col-span-7">
            <label className="text-xs font-bold text-slate-900 block">
              Tuition fee per semester (€)
            </label>
            <span className="text-[11px] text-slate-500">
              €0 for public universities in 15 of 16 German states. Enter fee only if applying to private universities or specific Baden-Württemberg master's.
            </span>
          </div>
          <div className="md:col-span-5 flex items-center rounded-lg border border-slate-200 overflow-hidden focus-within:border-[#0B1B3A]">
            <span className="bg-slate-100 text-slate-600 px-3 py-2 text-xs font-semibold">€</span>
            <input
              type="number"
              min="0"
              step="any"
              value={tuitionPerSemester === "" ? "" : tuitionPerSemester}
              onChange={(e) => {
                setActivePreset("custom");
                setTuitionPerSemester(e.target.value === "" ? "" : Math.max(0, parseFloat(e.target.value) || 0));
              }}
              className="w-full px-3 py-2 text-xs text-slate-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Semester Contribution */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center py-2 border-b border-slate-100">
          <div className="md:col-span-7">
            <label className="text-xs font-bold text-slate-900 block">
              Semester contribution / Semesterticket (€ per semester)
            </label>
            <span className="text-[11px] text-slate-500">
              Mandatory administrative contribution at public universities (covers student union fees and unlimited regional transit pass).
            </span>
          </div>
          <div className="md:col-span-5 flex items-center rounded-lg border border-slate-200 overflow-hidden focus-within:border-[#0B1B3A]">
            <span className="bg-slate-100 text-slate-600 px-3 py-2 text-xs font-semibold">€</span>
            <input
              type="number"
              min="0"
              step="any"
              value={semesterContribution === "" ? "" : semesterContribution}
              onChange={(e) => {
                setActivePreset("custom");
                setSemesterContribution(e.target.value === "" ? "" : Math.max(0, parseFloat(e.target.value) || 0));
              }}
              className="w-full px-3 py-2 text-xs text-slate-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Monthly Rent */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center py-2 border-b border-slate-100">
          <div className="md:col-span-7">
            <label className="text-xs font-bold text-slate-900 block">
              Monthly accommodation &amp; utilities (€ per month)
            </label>
            <span className="text-[11px] text-slate-500">
              Studierendenwerk dormitory or private shared room (WG). Typically paid out of your monthly €992 blocked account payout.
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
              Food, Health Insurance &amp; Mobile (€ per month)
            </label>
            <span className="text-[11px] text-slate-500">
              Statutory student health insurance (~€125/mo), groceries, mobile, laundry, leisure.
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

        {/* One-off Travel & Prep */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center py-2 border-b border-slate-100">
          <div className="md:col-span-7">
            <label className="text-xs font-bold text-slate-900 block">
              One-off Prep, uni-assist, Visa &amp; Flights (€)
            </label>
            <span className="text-[11px] text-slate-500">
              Flights from Pakistan, uni-assist fee (€75 + €30/subsequent), German visa fee (€75), HEC/MOFA attestations &amp; translations.
            </span>
          </div>
          <div className="md:col-span-5 flex items-center rounded-lg border border-slate-200 overflow-hidden focus-within:border-[#0B1B3A]">
            <span className="bg-slate-100 text-slate-600 px-3 py-2 text-xs font-semibold">€</span>
            <input
              type="number"
              min="0"
              step="any"
              value={oneOffArrival === "" ? "" : oneOffArrival}
              onChange={(e) => {
                setActivePreset("custom");
                setOneOffArrival(e.target.value === "" ? "" : Math.max(0, parseFloat(e.target.value) || 0));
              }}
              className="w-full px-3 py-2 text-xs text-slate-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Summary Box with Live PKR */}
      <div className="mt-4 p-5 sm:p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Calculated Germany Financial Requirements
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Upfront Liquid Capital Needed in Pakistan */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              Upfront Capital Needed in Pakistan
            </span>
            <div className="text-2xl font-black text-[#FF4D6D] mt-1">
              €{upfrontCashNeeded.toLocaleString()}
            </div>
            <div className="text-xs font-bold text-slate-800 mt-1">
              ≈ ₨ {(upfrontCashNeeded * rate).toLocaleString()} PKR
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              {hasBlockedAccount
                ? `Includes €${numBlocked.toLocaleString()} Blocked Account (Sperrkonto) + semester fee + flights & visa preparation.`
                : "Includes 1st semester fees + flights & arrival setup without blocked account requirement."}
            </p>
          </div>

          {/* Card 2: Actual Annual Out-of-Pocket Expense */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              Estimated 1st-Year Outlay
            </span>
            <div className="text-2xl font-black text-[#0B1B3A] mt-1">
              €{totalAnnualSpending.toLocaleString()}
            </div>
            <div className="text-xs font-bold text-slate-800 mt-1">
              ≈ ₨ {(totalAnnualSpending * rate).toLocaleString()} PKR
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Tuition (2 sem) + Semesterticket (2 sem) + 12 months room &amp; food + flights &amp; emergency buffer.
            </p>
          </div>
        </div>

        {/* Clear Explanation of Blocked Account */}
        <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200/90 flex items-start gap-2.5 text-xs text-blue-900 leading-relaxed">
          <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <div>
            <strong>How the Sperrkonto Works:</strong> The €{numBlocked.toLocaleString()} in your blocked account is <strong>not a payment</strong> to a university or consultant. It is held in your own name at an authorised German escrow provider (e.g. Expatrio/Coracle/Fintiba) and released back to your German current account at <strong>€992 every month</strong> to cover your rent and living expenses.
          </div>
        </div>
      </div>
    </div>
  );
}
