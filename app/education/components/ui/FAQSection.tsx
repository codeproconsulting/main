"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "~/education/lib/utils";

const BRAND = { navy: "#0B1B3A", pink: "#FF4D6D", pinkDark: "#E11D48" };

const faqs = [
  {
    id: 1,
    question: "When should I start applying for study abroad?",
    answer:
      "We recommend starting at least 12–18 months before your intended intake. This gives you time to shortlist universities, prepare for English tests (IELTS/TOEFL), gather documents, and complete visa applications. For competitive courses or scholarships, earlier planning is better.",
  },
  {
    id: 2,
    question: "Do I need to take an English language test?",
    answer:
      "Most universities in the UK, Australia, Canada, USA, and New Zealand require proof of English proficiency. IELTS and TOEFL are widely accepted. Some institutions also accept PTE and Duolingo. Requirements vary by course and level—we can help you choose the right test and target score.",
  },
  {
    id: 3,
    question: "How long does the student visa process take?",
    answer:
      "Processing times vary by country. UK student visas often take 3–4 weeks; Australia and Canada can take 4–8 weeks or more. Delays can happen during peak seasons. We help you prepare a complete application to avoid unnecessary delays and refusals.",
  },
  {
    id: 4,
    question: "What documents do I need for university applications?",
    answer:
      "Typically you need academic transcripts, proof of English proficiency, a statement of purpose (SOP), letters of recommendation, your passport copy, and sometimes a CV. Some courses require portfolios or additional tests. We guide you through the exact requirements for each university and course.",
  },
  {
    id: 5,
    question: "Can I work while studying abroad?",
    answer:
      "Yes, in most popular destinations. For example, the UK allows part-time work during term and full-time during holidays; Australia and Canada have similar provisions. Rules differ by country and visa type. We can explain the work rights for your chosen destination and course level.",
  },
  {
    id: 6,
    question: "What is the difference between a consultant and applying on my own?",
    answer:
      "A consultant helps you shortlist the right universities and courses, avoid common application mistakes, prepare strong SOPs and documents, and navigate visa requirements. This saves time, reduces refusal risk, and often improves your chances of scholarships or better-fit programmes.",
  },
];

function FAQItem({
  index,
  question,
  answer,
  isOpen,
  onToggle,
}: {
  index: number;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        "relative rounded-2xl overflow-hidden transition-all duration-300",
        "border-l-4",
        isOpen
          ? "shadow-lg shadow-[#FF4D6D]/10 border-l-[#FF4D6D] bg-[#0B1B3A]/[0.04]"
          : "border-l-[#0B1B3A]/30 bg-white hover:border-l-[#0B1B3A]/60 hover:bg-[#0B1B3A]/[0.02]"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-start gap-4 text-left px-5 py-5 md:px-8 md:py-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 rounded-2xl"
        aria-expanded={isOpen}
      >
        <span
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-colors duration-300",
            isOpen ? "text-white" : "text-[#0B1B3A]"
          )}
          style={{
            backgroundColor: isOpen ? BRAND.pink : "rgba(11, 27, 58, 0.1)",
          }}
        >
          {index}
        </span>
        <span
          className={cn(
            "font-semibold text-base md:text-lg pt-1 flex-1 pr-2 transition-colors duration-200",
            isOpen ? "text-[#0B1B3A]" : "text-[#0B1B3A]/90"
          )}
        >
          {question}
        </span>
        <ChevronDown
          className={cn(
            "flex-shrink-0 w-5 h-5 mt-1 transition-all duration-300",
            isOpen ? "rotate-180 text-[#FF4D6D]" : "text-[#0B1B3A]/50"
          )}
          aria-hidden
        />
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div
            className="px-5 pb-6 md:px-8 md:pb-8 pt-0 pl-14 md:pl-20 text-[#0B1B3A]/80 text-sm md:text-base leading-relaxed"
            style={{ borderTop: "1px solid rgba(11, 27, 58, 0.08)" }}
          >
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(faqs[0].id);

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-white">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header with icon and brand block */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 mb-12 md:mb-14">
          <div className="flex items-start gap-4">
            <div
              className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-white"
              style={{
                background: `linear-gradient(135deg, ${BRAND.pink}, ${BRAND.pinkDark})`,
                boxShadow: "0 8px 24px -4px rgba(255, 77, 109, 0.35)",
              }}
            >
              <HelpCircle className="w-7 h-7" strokeWidth={2} />
            </div>
            <div>
              <p
                className="text-sm font-semibold uppercase tracking-[0.2em] mb-1"
                style={{ color: BRAND.pink }}
              >
                FAQ
              </p>
              <h2
                className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight"
                style={{ color: BRAND.navy }}
              >
                Frequently asked questions
              </h2>
            </div>
          </div>
          <p className="text-slate-600 text-sm md:text-base max-w-md sm:text-right">
            Quick answers about studying abroad, visas, and applications.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.id}
              index={index + 1}
              question={faq.question}
              answer={faq.answer}
              isOpen={openId === faq.id}
              onToggle={() => setOpenId((prev) => (prev === faq.id ? null : faq.id))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
