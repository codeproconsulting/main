"use client";

import { Link, useLoaderData } from "react-router";
import { Navbar } from "~/immigration/components/ui/Navbar";
import { Footer } from "~/immigration/components/ui/footer";
import { getServiceBySlug, type ServiceDetail } from "~/immigration/lib/servicesData";
import { ArrowRight, ArrowLeft, CheckCircle2, HelpCircle, ChevronDown } from "lucide-react";
import { cn } from "~/immigration/lib/utils";
import { useState } from "react";
import type { Route } from "./+types/services-slug";

const BRAND = { navy: "#0B1B3A", pink: "#FF4D6D" };

export function loader({ params }: Route.LoaderArgs) {
  const service = getServiceBySlug(params.slug);
  return { service };
}

export function meta(args?: Route.MetaArgs) {
  const service = args?.data?.service as ServiceDetail | null | undefined;
  if (!service) return [{ title: "Service not found | ProConsulting Immigration" }];
  return [
    { title: `${service.title} | ProConsulting Immigration` },
    { name: "description", content: service.metaDescription },
  ];
}

function ServiceFAQ({ faqs, title }: { faqs: ServiceDetail["faqs"]; title: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative py-16 md:py-20 overflow-hidden bg-slate-50/50 border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-start gap-4 mb-10">
          <div
            className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-white"
            style={{
              background: "linear-gradient(135deg, #FF4D6D, #E11D48)",
              boxShadow: "0 8px 24px -4px rgba(255, 77, 109, 0.35)",
            }}
          >
            <HelpCircle className="w-6 h-6" strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] mb-1" style={{ color: BRAND.pink }}>
              FAQ
            </p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: BRAND.navy }}>
              Frequently asked questions about {title}
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
                  <div className="px-5 pb-6 md:px-8 md:pb-8 pt-0 pl-14 md:pl-20 text-[#0B1B3A]/80 text-sm md:text-base leading-relaxed border-t border-slate-200/80">
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

function ServiceContent({ service }: { service: ServiceDetail }) {
  return (
    <>
      <Navbar />

      {/* Title area */}
      <section className="border-b border-slate-200/80 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-10 md:pt-16 md:pb-14">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#0B1B3A] transition-colors">Home</Link>
            <span aria-hidden>/</span>
            <Link to="/immigration/services" className="hover:text-[#0B1B3A] transition-colors">Services</Link>
            <span aria-hidden>/</span>
            <span className="text-[#0B1B3A] font-medium">{service.title}</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[#FF4D6D] mb-3">
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">{service.tag}</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0B1B3A] tracking-tight">
                {service.title}
              </h1>
              <div className="mt-2 w-16 h-1 rounded-full" style={{ backgroundColor: BRAND.pink }} />
              <p className="mt-5 text-slate-600 text-lg max-w-2xl">
                {service.tagline}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/immigration/services"
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-[#0B1B3A] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                All services
              </Link>
              <Link
                to="/immigration/contact"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-95"
                style={{ backgroundColor: BRAND.pink }}
              >
                Get in touch
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main content + sidebar */}
      <section className="relative py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-8">
              <p className="text-slate-600 leading-relaxed mb-10">
                {service.description}
              </p>
              {service.sections.map((section, i) => (
                <div key={i} className="mb-12 last:mb-0">
                  <h2 className="text-2xl font-bold text-[#0B1B3A] mb-4">
                    {section.heading}
                  </h2>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    {section.content}
                  </p>
                  {section.list && (
                    <ul className="space-y-3">
                      {section.list.map((item, j) => (
                        <li key={j} className="flex gap-3 text-slate-600">
                          <span
                            className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5"
                            style={{ backgroundColor: BRAND.pink }}
                          >
                            ✓
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 space-y-8">
                {service.benefits.length > 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6">
                    <h3 className="text-lg font-bold text-[#0B1B3A] mb-4">Key benefits</h3>
                    <ul className="space-y-3">
                      {service.benefits.map((b, i) => (
                        <li key={i} className="flex gap-3 text-slate-700 text-sm">
                          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#FF4D6D] mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/immigration/contact"
                      className="mt-6 inline-flex items-center justify-center gap-2 w-full rounded-lg px-4 py-3 text-sm font-semibold text-white hover:opacity-95 transition-opacity"
                      style={{ backgroundColor: BRAND.pink }}
                    >
                      Free consultation
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}

                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h3 className="text-lg font-bold text-[#0B1B3A] mb-3">What you’ll get</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    A clear checklist, document strategy, and step-by-step guidance—so your application is complete, consistent, and ready to submit.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {service.faqs.length > 0 && <ServiceFAQ faqs={service.faqs} title={service.title} />}

      <Footer />
    </>
  );
}

export default function ServiceSlugPage() {
  const { service } = useLoaderData<typeof loader>();

  if (!service) {
    return (
      <>
        <Navbar />
        <main className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-16">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Service not found</h1>
          <p className="text-slate-600 mb-6">The service you’re looking for doesn’t exist or has been moved.</p>
          <Link to="/immigration/services" className="inline-flex items-center gap-2 text-[#FF4D6D] font-semibold hover:underline">
            <ArrowLeft className="w-4 h-4" />
            View all services
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return <ServiceContent service={service} />;
}

