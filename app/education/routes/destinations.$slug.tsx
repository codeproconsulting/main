"use client";

import { Link, useLoaderData } from "react-router";
import { Navbar } from "~/education/components/ui/Navbar";
import { Footer } from "~/education/components/ui/footer";
import { getDestinationBySlug, type Destination } from "~/education/lib/destinations";
import { pageMeta, canonicalLink } from "~/education/lib/seo";
import { ArrowRight, ArrowLeft, GraduationCap, CheckCircle2 } from "lucide-react";
import type { Route } from "./+types/destinations.$slug";

const BRAND = { navy: "#0B1B3A", pink: "#FF4D6D" };

export function loader({ params }: Route.LoaderArgs) {
  const destination = getDestinationBySlug(params.slug);
  return { destination };
}

export function meta(args: Route.MetaArgs) {
  const destination = args?.data?.destination as Destination | null | undefined;
  if (!destination) {
    return [{ title: "Destination not found | ProConsulting" }];
  }
  const title = `Study in ${destination.name} | ProConsulting`;
  const description = destination.description;
  const pathname = args?.location?.pathname ?? (args?.params ? `/education/destinations/${args.params.slug}` : "");
  return [
    { title },
    { name: "description", content: description },
    ...pageMeta({ title, description, pathname }),
  ];
}

export function links(args: Route.LinksArgs) {
  const pathname = args?.location?.pathname ?? (args?.params ? `/education/destinations/${args.params.slug}` : "");
  return pathname ? canonicalLink(pathname) : [];
}

function DestinationContent({ destination }: { destination: Destination }) {
  return (
    <>
      <Navbar />

      {/* Hero / title area */}
      <section className="border-b border-slate-200/80 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-10 md:pt-16 md:pb-14">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <span aria-hidden>/</span>
            <Link to="/education/destinations" className="hover:text-slate-900 transition-colors">Destinations</Link>
            <span aria-hidden>/</span>
            <span className="text-slate-900 font-medium">{destination.name}</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <img src={destination.flagIcon} alt="" className="w-10 h-8 object-cover rounded shadow" />
                <span className="px-3 py-1 rounded-full bg-[#FF4D6D]/10 text-[#FF4D6D] text-xs font-semibold uppercase tracking-wide">
                  {destination.tag}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
                Study in {destination.name}
              </h1>
              <div className="mt-2 w-16 h-1 rounded-full bg-[#FF4D6D]" />
              <p className="mt-5 text-slate-600 text-lg max-w-2xl">
                {destination.description}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/education/destinations"
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                All destinations
              </Link>
              <Link
                to="/education/contact"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white bg-[#FF4D6D] hover:opacity-95 transition-opacity"
              >
                Get guidance
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Optional hero image */}
      {destination.image && (
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-6 py-8 md:py-10">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-100 shadow-sm">
              {/* Blurred backdrop (fills space, adds visual energy) */}
              <img
                src={destination.image}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-30"
              />
              {/* Soft brand glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_20%,rgba(255,77,109,0.25),transparent_60%)]" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/20 to-white/60" />

              {/* Foreground image: not cropped, centered */}
              <div className="relative h-64 md:h-80 flex items-center justify-center p-4 md:p-6">
                <img
                  src={destination.image}
                  alt={`Study in ${destination.name}`}
                  className="max-h-full max-w-full object-contain object-center drop-shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main content: long description + highlights */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Why choose {destination.name}?</h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
                {destination.longDescription.split(/\n\n?/).filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 rounded-2xl border border-slate-200 bg-slate-50/80 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Key points</h3>
                <ul className="space-y-3">
                  {destination.highlights.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#FF4D6D] shrink-0 mt-0.5" aria-hidden />
                      <span className="text-slate-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/education/contact"
                  className="mt-6 inline-flex items-center justify-center gap-2 w-full rounded-lg px-4 py-3 text-sm font-semibold text-white bg-[#FF4D6D] hover:opacity-95 transition-opacity"
                >
                  Free consultation
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="relative py-10 md:py-12 overflow-hidden bg-slate-50 border-t border-slate-200/80">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(255,77,109,0.18),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur p-5 md:p-7 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl border border-slate-200/80 flex items-center justify-center bg-[#FF4D6D]/5 shrink-0">
                  <GraduationCap className="w-6 h-6 text-[#FF4D6D]" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-[#0B1B3A]">
                    Ready to study in {destination.name}?
                  </h2>
                  <p className="mt-1 text-slate-600 text-sm md:text-base max-w-2xl">
                    We’ll help you with applications, visas, and choosing the right course.
                  </p>
                </div>
              </div>

              <Link
                to="/education/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF4D6D] hover:opacity-95 text-white font-bold px-7 py-3 text-sm md:text-base transition-all shadow-md shadow-pink-500/20 whitespace-nowrap"
              >
                Get free consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
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
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Destination not found</h1>
          <p className="text-slate-600 mb-6">The destination you’re looking for doesn’t exist or has been moved.</p>
          <Link
            to="/education/destinations"
            className="inline-flex items-center gap-2 text-[#FF4D6D] font-semibold hover:underline"
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
