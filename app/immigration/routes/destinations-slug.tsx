"use client";

import { useState } from "react";
import { Link, useLoaderData } from "react-router";
import { Navbar } from "~/immigration/components/ui/Navbar";
import { Footer } from "~/immigration/components/ui/footer";
import {
  getDestinationBySlug,
  destinationDetails,
  destinationFaqs,
  type DestinationFAQ,
} from "~/immigration/lib/destinations";
import { ArrowRight, ArrowLeft, MapPin, CheckCircle2, HelpCircle, ChevronDown } from "lucide-react";
import { cn } from "~/immigration/lib/utils";
import type { Route } from "./+types/destinations-slug";

const BRAND = { navy: "#0B1B3A", pink: "#FF4D6D" };

type Destination = (typeof import("~/immigration/lib/destinations").destinations)[number];

export function loader({ params }: Route.LoaderArgs) {
  const destination = getDestinationBySlug(params.slug);
  return { destination };
}

export function meta(args?: Route.MetaArgs) {
  const destination = args?.data?.destination as Destination | null | undefined;
  if (!destination) {
    return [{ title: "Destination not found | ProConsulting Immigration" }];
  }
  return [
    { title: `Visit ${destination.name} | ProConsulting Immigration` },
    { name: "description", content: destination.description },
  ];
}

function DestinationFAQBlock({
  faqs,
  destinationName,
}: {
  faqs: DestinationFAQ[];
  destinationName: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative py-16 md:py-20 overflow-hidden bg-slate-50/50 border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-start gap-4 mb-10">
          <div
            className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-white"
            style={{
              background: `linear-gradient(135deg, ${BRAND.pink}, #E11D48)`,
              boxShadow: "0 8px 24px -4px rgba(255, 77, 109, 0.35)",
            }}
          >
            <HelpCircle className="w-6 h-6" strokeWidth={2} />
          </div>
          <div>
            <p
              className="text-sm font-semibold uppercase tracking-[0.2em] mb-1"
              style={{ color: BRAND.pink }}
            >
              FAQ
            </p>
            <h2
              className="text-2xl md:text-3xl font-bold tracking-tight"
              style={{ color: BRAND.navy }}
            >
              Frequently asked questions about {destinationName}
            </h2>
          </div>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={cn(
                "relative rounded-2xl overflow-hidden transition-all duration-300 border-l-4",
                openIndex === index
                  ? "shadow-lg shadow-[#FF4D6D]/10 border-l-[#FF4D6D] bg-white"
                  : "border-l-[#0B1B3A]/30 bg-white hover:border-l-[#0B1B3A]/60"
              )}
            >
              <button
                type="button"
                onClick={() => setOpenIndex((prev) => (prev === index ? null : index))}
                className="w-full flex items-start gap-4 text-left px-5 py-5 md:px-8 md:py-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 rounded-2xl"
                aria-expanded={openIndex === index}
              >
                <span
                  className={cn(
                    "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-colors duration-300",
                    openIndex === index ? "text-white" : "text-[#0B1B3A]"
                  )}
                  style={{
                    backgroundColor: openIndex === index ? BRAND.pink : "rgba(11, 27, 58, 0.1)",
                  }}
                >
                  {index + 1}
                </span>
                <span className="font-semibold text-base md:text-lg pt-1 flex-1 pr-2 text-[#0B1B3A]">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    "flex-shrink-0 w-5 h-5 mt-1 transition-all duration-300",
                    openIndex === index ? "rotate-180 text-[#FF4D6D]" : "text-[#0B1B3A]/50"
                  )}
                  aria-hidden
                />
              </button>
              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-300 ease-in-out",
                  openIndex === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="overflow-hidden">
                  <div
                    className="px-5 pb-6 md:px-8 md:pb-8 pt-0 pl-14 md:pl-20 text-[#0B1B3A]/80 text-sm md:text-base leading-relaxed border-t border-slate-200/80"
                  >
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DestinationContent({ destination }: { destination: Destination }) {
  const details = destinationDetails[destination.id];
  const faqs = destinationFaqs[destination.id];
  const hasImage = "image" in destination && destination.image;

  return (
    <>
      <Navbar />

      {/* Hero / title area – same structure as education */}
      <section className="border-b border-slate-200/80 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-10 md:pt-16 md:pb-14">
          <nav
            className="flex items-center gap-2 text-sm text-slate-500 mb-6"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <span aria-hidden>/</span>
            <Link
              to="/immigration/destinations"
              className="hover:text-slate-900 transition-colors"
            >
              Destinations
            </Link>
            <span aria-hidden>/</span>
            <span className="text-slate-900 font-medium">{destination.name}</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            {/* Left: title and description */}
            <div className="min-w-0 md:max-w-xl">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={destination.flagIcon}
                  alt=""
                  className="w-10 h-8 object-contain rounded shadow bg-white"
                />
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide"
                  style={{
                    backgroundColor: `${BRAND.pink}20`,
                    color: BRAND.pink,
                  }}
                >
                  {destination.tag}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
                Visit {destination.name}
              </h1>
              <div
                className="mt-2 w-16 h-1 rounded-full"
                style={{ backgroundColor: BRAND.pink }}
              />
              <p className="mt-4 text-slate-600 text-lg max-w-2xl">
                {destination.description}
              </p>
            </div>

            {/* Right: large image pushed to the far side */}
            {hasImage && (
              <div className="hidden md:block flex-1 flex justify-end">
                <div className="w-full max-w-md h-52 md:h-60 rounded-2xl overflow-hidden border border-slate-200/80 shadow-md bg-slate-100">
                  <img
                    src={(destination as { image?: string }).image}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main content: visa types + eligibility sidebar – education-style two-column */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Visit visa: {destination.name}
              </h2>
              <p className="text-slate-600 leading-relaxed mb-8">
                {destination.description}
              </p>
              {details?.visaTypes && details.visaTypes.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-900">
                    Visa types & options
                  </h3>
                  <div
                    className={
                      details.visaTypes.length >= 2
                        ? "grid sm:grid-cols-2 gap-4"
                        : "space-y-4"
                    }
                  >
                    {details.visaTypes.map((vt, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-slate-200 bg-slate-50/50 p-5"
                      >
                        <h4 className="font-bold text-slate-900 mb-2">
                          {vt.title}
                        </h4>
                        <p className="text-sm text-slate-600">{vt.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 rounded-2xl border border-slate-200 bg-slate-50/80 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Eligibility requirements
                </h3>
                {details?.eligibility && details.eligibility.length > 0 ? (
                  <ul className="space-y-3">
                    {details.eligibility.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2
                          className="w-5 h-5 shrink-0 mt-0.5"
                          style={{ color: BRAND.pink }}
                          aria-hidden
                        />
                        <span className="text-slate-700 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-600 text-sm">
                    Contact us for eligibility guidance for your situation.
                  </p>
                )}
                <Link
                  to="/immigration/contact"
                  className="mt-6 inline-flex items-center justify-center gap-2 w-full rounded-lg px-4 py-3 text-sm font-semibold text-white hover:opacity-95 transition-opacity"
                  style={{ backgroundColor: BRAND.pink }}
                >
                  Free consultation
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Country-specific FAQ */}
      {faqs && faqs.length > 0 && (
        <DestinationFAQBlock faqs={faqs} destinationName={destination.name} />
      )}

      {/* CTA strip – same as education */}
      <section className="relative py-16 md:py-20 overflow-hidden bg-slate-900">
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(255,77,109,0.15),transparent)]"
          aria-hidden
        />
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <MapPin
            className="w-12 h-12 mb-6"
            style={{ color: BRAND.pink }}
          />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to visit {destination.name}?
          </h2>
          <p className="text-white max-w-lg mb-8">
            We’ll help you with visa requirements, documents, and applications.
            Book a free consultation today.
          </p>
          <Link
            to="/immigration/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full text-white font-bold px-8 py-3.5 transition-all hover:opacity-95"
            style={{ backgroundColor: BRAND.pink }}
          >
            Get free consultation
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default function DestinationSlugPage() {
  const { destination } = useLoaderData<typeof loader>();

  if (!destination) {
    return (
      <>
        <Navbar />
        <main className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-16">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Destination not found
          </h1>
          <p className="text-slate-600 mb-6">
            The destination you’re looking for doesn’t exist or has been moved.
          </p>
          <Link
            to="/immigration/destinations"
            className="inline-flex items-center gap-2 font-semibold hover:underline"
            style={{ color: BRAND.pink }}
          >
            <ArrowLeft className="w-4 h-4" />
            View all destinations
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return <DestinationContent destination={destination} />;
}
