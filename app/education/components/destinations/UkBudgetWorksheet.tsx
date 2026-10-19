"use client";

import { useState } from "react";
import { Printer, RotateCcw, Trash2, Info, CheckCircle2, Sparkles, Building, MapPin } from "lucide-react";

interface UkPreset {
  id: string;
  name: string;
  description: string;
  courseTitle: string;
  institution: string;
  location: string;
  tuition: number;
  deposit: number;
  living: number;
  travel: number;
  visaAndIhs: number;
  materials: number;
  contingency: number;
  scholarship: number;
}

const UK_PRESETS: UkPreset[] = [
  {
    id: "masters-regional",
    name: "UK Masters (Outside London)",
    description: "Typical 1-year postgraduate degree at universities in Manchester, Birmingham, Leeds, Glasgow, etc.",
    courseTitle: "MSc International Business / Data Science",
    institution: "University of Manchester / Leeds",
    location: "Outside London",
    tuition: 16500,
    deposit: 4000,
    living: 9207, // Official UKVI baseline threshold outside London (£1,023/month for 9 months)
    travel: 850,
    visaAndIhs: 1266, // Student visa £490 + 1-year IHS healthcare £776
    materials: 500,
    contingency: 1500,
    scholarship: 2000,
  },
  {
    id: "masters-london",
    name: "London University Masters",
    description: "Universities located in Greater London where living costs and UKVI maintenance thresholds are higher.",
    courseTitle: "MSc Project Management / Finance",
    institution: "Queen Mary / Brunel London",
    location: "London",
    tuition: 19000,
    deposit: 5000,
    living: 12006, // Official UKVI baseline threshold in London (£1,334/month for 9 months)
    travel: 900,
    visaAndIhs: 1266,
    materials: 500,
    contingency: 2000,
    scholarship: 2500,
  },
  {
    id: "bachelor-standard",
    name: "UK Undergraduate (Year 1)",
    description: "First year of a 3-year Bachelor's degree (BA / BSc / BEng).",
    courseTitle: "BSc Computer Science / Software Engineering",
    institution: "Coventry University / Hertfordshire",
    location: "Outside London",
    tuition: 15000,
    deposit: 4000,
    living: 9207,
    travel: 850,
    visaAndIhs: 2818, // 3-year IHS surcharge + visa fee
    materials: 600,
    contingency: 1500,
    scholarship: 1500,
  },
];

export function UkBudgetWorksheet() {
  const [activePreset, setActivePreset] = useState<string>("masters-regional");
  const [courseTitle, setCourseTitle] = useState<string>("MSc International Business / Data Science");
  const [institution, setInstitution] = useState<string>("University of Manchester / Leeds");
  const [location, setLocation] = useState<string>("Outside London");

  const [tuitionFee, setTuitionFee] = useState<number | "">(16500);
  const [deposit, setDeposit] = useState<number | "">(4000);
  const [livingCost, setLivingCost] = useState<number | "">(9207);
  const [travelCost, setTravelCost] = useState<number | "">(850);
  const [visaAndIhs, setVisaAndIhs] = useState<number | "">(1266);
  const [materials, setMaterials] = useState<number | "">(500);
  const [contingency, setContingency] = useState<number | "">(1500);
  const [scholarship, setScholarship] = useState<number | "">(2000);
  const [exchangeRatePKR, setExchangeRatePKR] = useState<number | "">(365);

  const applyPreset = (p: UkPreset) => {
    setActivePreset(p.id);
    setCourseTitle(p.courseTitle);
    setInstitution(p.institution);
    setLocation(p.location);
    setTuitionFee(p.tuition);
    setDeposit(p.deposit);
    setLivingCost(p.living);
    setTravelCost(p.travel);
    setVisaAndIhs(p.visaAndIhs);
    setMaterials(p.materials);
    setContingency(p.contingency);
    setScholarship(p.scholarship);
  };

  const handleReset = () => {
    if (typeof window !== "undefined") {
      const confirmed = window.confirm("Reset UK budget worksheet to defaults?");
      if (!confirmed) return;
    }
    applyPreset(UK_PRESETS[0]);
    setExchangeRatePKR(365);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Convert empty values to safe numbers
  const numTuition = typeof tuitionFee === "number" ? Math.max(0, tuitionFee) : 0;
  const numDeposit = typeof deposit === "number" ? Math.max(0, deposit) : 0;
  const numLiving = typeof livingCost === "number" ? Math.max(0, livingCost) : 0;
  const numTravel = typeof travelCost === "number" ? Math.max(0, travelCost) : 0;
  const numVisa = typeof visaAndIhs === "number" ? Math.max(0, visaAndIhs) : 0;
  const numMaterials = typeof materials === "number" ? Math.max(0, materials) : 0;
  const numContingency = typeof contingency === "number" ? Math.max(0, contingency) : 0;
  const numScholarship = typeof scholarship === "number" ? Math.max(0, scholarship) : 0;

  // Net Tuition after scholarship deduction
  const netTuition = Math.max(0, numTuition - numScholarship);

  // Remaining Tuition Balance payable after arrival (Tuition - Deposit - Scholarship)
  const remainingTuitionPayable = Math.max(0, netTuition - numDeposit);

  // Upfront cash needed in Pakistan before departure (CAS Deposit + Visa/IHS + Airfare)
  const upfrontCashNeeded = numDeposit + numVisa + numTravel;

  // Total Course Outlay (Net tuition + living + travel + visa/ihs + materials + buffer)
  // Deposit is not double counted because it is already inside net tuition
  const totalEstimatedCost = netTuition + numLiving + numTravel + numVisa + numMaterials + numContingency;

  const rate = typeof exchangeRatePKR === "number" && exchangeRatePKR > 0 ? exchangeRatePKR : 365;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-7 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block text-xs font-semibold tracking-wider uppercase text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-full">
              Planning Tool
            </span>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              CAS &amp; UKVI Ready
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#0B1B3A]">
            UK Course &amp; Family Budget Planner
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Calculate exact upfront cash before CAS and total course outlays for Pakistani applicants.
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

      {/* Preset Buttons */}
      <div className="pt-5 pb-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
          Select Typical Course Benchmark:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {UK_PRESETS.map((p) => {
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

      {/* Course Details Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 py-4 border-t border-slate-100 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Course Title
          </label>
          <input
            type="text"
            value={courseTitle}
            onChange={(e) => {
              setActivePreset("custom");
              setCourseTitle(e.target.value);
            }}
            placeholder="e.g. MSc Data Science"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:border-[#0B1B3A] text-xs"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            University / Institution
          </label>
          <input
            type="text"
            value={institution}
            onChange={(e) => {
              setActivePreset("custom");
              setInstitution(e.target.value);
            }}
            placeholder="e.g. University of Manchester"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:border-[#0B1B3A] text-xs"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Campus Location
          </label>
          <select
            value={location}
            onChange={(e) => {
              setActivePreset("custom");
              setLocation(e.target.value);
              if (e.target.value === "London") {
                setLivingCost(12006);
              } else {
                setLivingCost(9207);
              }
            }}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:border-[#0B1B3A] text-xs bg-white"
          >
            <option value="Outside London">Outside London (UKVI floor £9,207)</option>
            <option value="London">London (UKVI floor £12,006)</option>
          </select>
        </div>
      </div>

      {/* Cost Breakdown Inputs */}
      <div className="py-4 space-y-3.5 border-t border-b border-slate-100 my-2">
        {/* Full Tuition */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center py-2 border-b border-slate-100">
          <div className="md:col-span-7">
            <label className="text-xs font-bold text-slate-900 block">
              Full International Tuition Fee (£)
            </label>
            <span className="text-[11px] text-slate-500">
              Published tuition for the exact programme as stated on university website / conditional offer.
            </span>
          </div>
          <div className="md:col-span-5 flex items-center rounded-lg border border-slate-200 overflow-hidden focus-within:border-[#0B1B3A]">
            <span className="bg-slate-100 text-slate-600 px-3 py-2 text-xs font-semibold">£</span>
            <input
              type="number"
              min="0"
              step="any"
              value={tuitionFee === "" ? "" : tuitionFee}
              onChange={(e) => {
                setActivePreset("custom");
                setTuitionFee(e.target.value === "" ? "" : Math.max(0, parseFloat(e.target.value) || 0));
              }}
              className="w-full px-3 py-2 text-xs text-slate-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Initial CAS Deposit */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center py-2 border-b border-slate-100">
          <div className="md:col-span-7">
            <label className="text-xs font-bold text-slate-900 block">
              Initial CAS Tuition Deposit (£)
            </label>
            <span className="text-[11px] text-slate-500">
              Paid upfront in Pakistan to receive your CAS letter. <strong>Deducted from your tuition</strong>, not an extra fee.
            </span>
          </div>
          <div className="md:col-span-5 flex items-center rounded-lg border border-slate-200 overflow-hidden focus-within:border-[#0B1B3A]">
            <span className="bg-slate-100 text-slate-600 px-3 py-2 text-xs font-semibold">£</span>
            <input
              type="number"
              min="0"
              step="any"
              value={deposit === "" ? "" : deposit}
              onChange={(e) => {
                setActivePreset("custom");
                setDeposit(e.target.value === "" ? "" : Math.max(0, parseFloat(e.target.value) || 0));
              }}
              className="w-full px-3 py-2 text-xs text-slate-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Scholarship Deduction */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center py-2 border-b border-slate-100">
          <div className="md:col-span-7">
            <label className="text-xs font-bold text-slate-900 block">
              Confirmed Scholarship Award (£)
            </label>
            <span className="text-[11px] text-slate-500">
              Institutional merit or early-bird scholarship deducted directly from tuition fee on your CAS.
            </span>
          </div>
          <div className="md:col-span-5 flex items-center rounded-lg border border-slate-200 overflow-hidden focus-within:border-[#0B1B3A]">
            <span className="bg-slate-100 text-slate-600 px-3 py-2 text-xs font-semibold">£</span>
            <input
              type="number"
              min="0"
              step="any"
              value={scholarship === "" ? "" : scholarship}
              onChange={(e) => {
                setActivePreset("custom");
                setScholarship(e.target.value === "" ? "" : Math.max(0, parseFloat(e.target.value) || 0));
              }}
              className="w-full px-3 py-2 text-xs text-slate-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Living Expenses */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center py-2 border-b border-slate-100">
          <div className="md:col-span-7">
            <label className="text-xs font-bold text-slate-900 block">
              Estimated 9-Month Living Expenses (£)
            </label>
            <span className="text-[11px] text-slate-500">
              UKVI maintenance threshold: £9,207 (£1,023/mo) outside London; £12,006 (£1,334/mo) in London.
            </span>
          </div>
          <div className="md:col-span-5 flex items-center rounded-lg border border-slate-200 overflow-hidden focus-within:border-[#0B1B3A]">
            <span className="bg-slate-100 text-slate-600 px-3 py-2 text-xs font-semibold">£</span>
            <input
              type="number"
              min="0"
              step="any"
              value={livingCost === "" ? "" : livingCost}
              onChange={(e) => {
                setActivePreset("custom");
                setLivingCost(e.target.value === "" ? "" : Math.max(0, parseFloat(e.target.value) || 0));
              }}
              className="w-full px-3 py-2 text-xs text-slate-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Visa & IHS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center py-2 border-b border-slate-100">
          <div className="md:col-span-7">
            <label className="text-xs font-bold text-slate-900 block">
              Student Visa Application Fee + IHS Surcharge (£)
            </label>
            <span className="text-[11px] text-slate-500">
              Paid to UKVI online at visa submission: £490 Student Visa fee + £776 per year Immigration Health Surcharge (IHS).
            </span>
          </div>
          <div className="md:col-span-5 flex items-center rounded-lg border border-slate-200 overflow-hidden focus-within:border-[#0B1B3A]">
            <span className="bg-slate-100 text-slate-600 px-3 py-2 text-xs font-semibold">£</span>
            <input
              type="number"
              min="0"
              step="any"
              value={visaAndIhs === "" ? "" : visaAndIhs}
              onChange={(e) => {
                setActivePreset("custom");
                setVisaAndIhs(e.target.value === "" ? "" : Math.max(0, parseFloat(e.target.value) || 0));
              }}
              className="w-full px-3 py-2 text-xs text-slate-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Travel & Flights */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center py-2 border-b border-slate-100">
          <div className="md:col-span-7">
            <label className="text-xs font-bold text-slate-900 block">
              Flights from Pakistan &amp; UK Airport Transit (£)
            </label>
            <span className="text-[11px] text-slate-500">
              One-way flight from Pakistan (Islamabad / Lahore / Karachi to Heathrow / Manchester) + train / coach to university.
            </span>
          </div>
          <div className="md:col-span-5 flex items-center rounded-lg border border-slate-200 overflow-hidden focus-within:border-[#0B1B3A]">
            <span className="bg-slate-100 text-slate-600 px-3 py-2 text-xs font-semibold">£</span>
            <input
              type="number"
              min="0"
              step="any"
              value={travelCost === "" ? "" : travelCost}
              onChange={(e) => {
                setActivePreset("custom");
                setTravelCost(e.target.value === "" ? "" : Math.max(0, parseFloat(e.target.value) || 0));
              }}
              className="w-full px-3 py-2 text-xs text-slate-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Emergency Contingency */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center py-2">
          <div className="md:col-span-7">
            <label className="text-xs font-bold text-slate-900 block">
              Emergency Reserve &amp; Exchange Buffer (£)
            </label>
            <span className="text-[11px] text-slate-500">
              Protects against PKR / GBP currency fluctuations and unexpected rental setup costs.
            </span>
          </div>
          <div className="md:col-span-5 flex items-center rounded-lg border border-slate-200 overflow-hidden focus-within:border-[#0B1B3A]">
            <span className="bg-slate-100 text-slate-600 px-3 py-2 text-xs font-semibold">£</span>
            <input
              type="number"
              min="0"
              step="any"
              value={contingency === "" ? "" : contingency}
              onChange={(e) => {
                setActivePreset("custom");
                setContingency(e.target.value === "" ? "" : Math.max(0, parseFloat(e.target.value) || 0));
              }}
              className="w-full px-3 py-2 text-xs text-slate-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Summary Box with PKR and Live Breakdown */}
      <div className="mt-4 p-5 sm:p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Worksheet Summary &amp; Cash Flow Split
          </h4>

          {/* PKR Rate Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Exchange Rate:</span>
            <div className="flex items-center rounded border border-slate-300 bg-white px-2 py-1 text-xs">
              <span className="font-semibold text-slate-700 mr-1">1 £ =</span>
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
          {/* Upfront Cash in Pakistan */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              Upfront Cash Before Travel
            </span>
            <div className="text-2xl font-black text-[#FF4D6D] mt-1">
              £{upfrontCashNeeded.toLocaleString()}
            </div>
            <div className="text-xs font-bold text-slate-800 mt-1">
              ≈ ₨ {(upfrontCashNeeded * rate).toLocaleString()} PKR
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Deposit (£{numDeposit.toLocaleString()}) + flights (£{numTravel.toLocaleString()}) + visa &amp; IHS (£{numVisa.toLocaleString()}).
            </p>
          </div>

          {/* Remaining Tuition Payable in UK */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              Remaining Tuition at University
            </span>
            <div className="text-2xl font-black text-[#0B1B3A] mt-1">
              £{remainingTuitionPayable.toLocaleString()}
            </div>
            <div className="text-xs font-bold text-slate-800 mt-1">
              ≈ ₨ {(remainingTuitionPayable * rate).toLocaleString()} PKR
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Tuition net of scholarship (£{netTuition.toLocaleString()}) minus initial deposit already paid.
            </p>
          </div>

          {/* Total Course Outlay */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              Total Estimated Full-Course Outlay
            </span>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              £{totalEstimatedCost.toLocaleString()}
            </div>
            <div className="text-xs font-bold text-slate-800 mt-1">
              ≈ ₨ {(totalEstimatedCost * rate).toLocaleString()} PKR
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Full tuition + 9 months living (£{numLiving.toLocaleString()}) + flights + visa &amp; IHS + buffer.
            </p>
          </div>
        </div>

        {/* Clear Notice */}
        <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200/90 flex items-start gap-2.5 text-xs text-blue-900 leading-relaxed">
          <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <div>
            <strong>UKVI 28-Day Bank Statement Rule:</strong> In addition to paying your deposit, UKVI requires you to hold your remaining first-year tuition fee PLUS the required maintenance living amount (£9,207 outside London / £12,006 in London) in an approved bank account for at least <strong>28 consecutive days</strong> before visa submission.
          </div>
        </div>
      </div>
    </div>
  );
}
