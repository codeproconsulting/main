"use client";

import { Link, useParams } from "react-router";
import { Navbar } from "~/education/components/ui/Navbar";
import { Footer } from "~/education/components/ui/footer";
import { getServiceBySlug, getAllServiceSlugs, type ServiceDetail } from "~/education/lib/servicesData";
import { pageMeta, canonicalLink } from "~/education/lib/seo";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import type { Route } from "./+types/services.$slug";

const BRAND = { navy: "#0B1B3A", pink: "#FF4D6D", pinkDark: "#E11D48" };

export function meta(args?: Route.MetaArgs) {
  const params = args?.params;
  const service = params ? getServiceBySlug(params.slug) : undefined;
  if (!service) return [{ title: "Service not found | ProConsulting" }];
  const title = `${service.title} | ProConsulting`;
  const pathname = args?.location?.pathname ?? (params ? `/services/${params.slug}` : "");
  return [
    { title },
    { name: "description", content: service.metaDescription },
    ...pageMeta({ title, description: service.metaDescription, pathname }),
  ];
}

export function links(args?: any) {
  const pathname = args?.location?.pathname ?? (args?.params ? `/services/${args.params.slug}` : "");
  return pathname ? canonicalLink(pathname) : [];
}

function ServiceContent({ service }: { service: ServiceDetail }) {
  return (
    <>
      <Navbar />

      {/* Title area – light, minimal, no dark hero */}
      <section className="border-b border-slate-200/80 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-10 md:pt-16 md:pb-14">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#0B1B3A] transition-colors">Home</Link>
            <span aria-hidden>/</span>
            <Link to="/education/services" className="hover:text-[#0B1B3A] transition-colors">Services</Link>
            <span aria-hidden>/</span>
            <span className="text-[#0B1B3A] font-medium">{service.title}</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
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
                to="/education/services"
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-[#0B1B3A] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                All services
              </Link>
              <Link
                to="/education/contact"
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

            {/* Sidebar: benefits + CTA */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 space-y-8">
                {service.benefits && service.benefits.length > 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6">
                    <h3 className="text-lg font-bold text-[#0B1B3A] mb-4">
                      Key benefits
                    </h3>
                    <ul className="space-y-3">
                      {service.benefits.map((b, i) => (
                        <li key={i} className="flex gap-3 text-slate-700 text-sm">
                          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#FF4D6D] mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div
                  className="rounded-2xl p-6 text-white"
                  style={{
                    background: `linear-gradient(145deg, ${BRAND.navy} 0%, #1a2d4a 100%)`,
                    boxShadow: "0 10px 40px rgba(11,27,58,0.2)",
                  }}
                >
                  <h3 className="text-xl font-bold mb-2">
                    {service.ctaHeading}
                  </h3>
                  <p className="text-white text-sm mb-6">
                    {service.ctaDescription}
                  </p>
                  <Link
                    to="/education/contact"
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-[#0B1B3A] bg-white hover:bg-slate-100 transition-colors"
                  >
                    Get in touch
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <p className="text-sm font-semibold text-slate-700 mb-3">
                    Other services
                  </p>
                  <ul className="space-y-2">
                    {getAllServiceSlugs()
                      .filter((s) => s !== service.slug)
                      .map((slug) => {
                        const other = getServiceBySlug(slug);
                        if (!other) return null;
                        return (
                          <li key={slug}>
                            <Link
                              to={`/services/${slug}`}
                              className="text-sm text-[#FF4D6D] hover:underline font-medium"
                            >
                              {other.title}
                            </Link>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default function ServiceSlugPage() {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getServiceBySlug(slug) : undefined;

  if (!service) {
    return (
      <>
        <Navbar />
        <section className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-24">
          <h1 className="text-2xl font-bold text-[#0B1B3A] mb-2">
            Service not found
          </h1>
          <p className="text-slate-600 mb-6">
            The page you’re looking for doesn’t exist or has been moved.
          </p>
          <Link
            to="/education/services"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white"
            style={{ backgroundColor: BRAND.pink }}
          >
            <ArrowLeft className="w-4 h-4" />
            View all services
          </Link>
        </section>
        <Footer />
      </>
    );
  }

  return <ServiceContent service={service} />;
}
