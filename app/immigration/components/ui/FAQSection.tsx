"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "~/immigration/lib/utils";

const BRAND = { navy: "#0B1B3A", pink: "#FF4D6D", pinkDark: "#E11D48" };

const faqs = [
  {
    id: 1,
    question: "When should I apply for a visit visa?",
    answer:
      "Apply as early as possible—typically at least 4–8 weeks before your planned travel date. Processing times vary by country: UK and Schengen can take 2–4 weeks; USA, Canada, and Australia may take longer, especially during peak seasons. We help you prepare a complete application to avoid delays and refusals.",
  },
  {
    id: 2,
    question: "What documents do I need for a visit visa?",
    answer:
      "Common requirements include a valid passport, completed application form, recent photographs, proof of funds (bank statements, sponsorship), travel itinerary or tickets, accommodation proof, and sometimes travel insurance. Exact documents depend on the destination. We guide you through the specific requirements for your chosen country.",
  },
  {
    id: 3,
    question: "How do I prove I will return to my home country?",
    answer:
      "Strong ties to your home country help: employment letter, property documents, family ties, business registration, or evidence of studies. The aim is to show you have reasons to leave the destination after your visit. We help you present your case clearly to meet eligibility requirements.",
  },
  {
    id: 4,
    question: "Can I work or study on a visit visa?",
    answer:
      "Visit visas are generally for tourism, business meetings, or short family visits. They do not allow paid work in the host country. Short courses or training may be allowed in some cases (e.g. UK Standard Visitor). We can advise on the rules for your destination and whether you need a different visa type.",
  },
  {
    id: 5,
    question: "My visa was refused. What can I do?",
    answer:
      "Depending on the country, you may be able to reapply with a stronger application, appeal the decision, or request an administrative review. We help you understand the refusal reasons, address gaps in evidence, and prepare a fresh application or appeal where applicable.",
  },
  {
    id: 6,
    question: "Why use a consultant for my visit visa?",
    answer:
      "A consultant helps you choose the right visa type, prepare a complete and consistent application, avoid common mistakes that lead to refusals, and meet country-specific requirements. This saves time, reduces refusal risk, and gives you confidence that your application is in order.",
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
            Quick answers about visit visas, documents, and applications.
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
              onToggle={() =>
                setOpenId((prev) => (prev === faq.id ? null : faq.id))
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
