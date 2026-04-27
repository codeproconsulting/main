"use client";

import { Link } from "react-router";
import { Map, ArrowRight, Phone } from "lucide-react";
import { destinations, navbarDestinations } from "~/immigration/lib/destinations";

function DestinationRow({
  name,
  tag,
  link,
  flagIcon,
}: {
  name: string;
  tag: string;
  link: string;
  flagIcon: string;
}) {
  return (
    <Link
      to={link}
      className="group flex items-center gap-4 p-3 rounded-xl border border-slate-200/80 bg-white hover:border-[#FF4D6D]/40 hover:shadow-lg hover:shadow-[#FF4D6D]/5 transition-all duration-200"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 group-hover:bg-[#FF4D6D]/10 transition-colors">
        <img src={flagIcon} alt="" className="w-5 h-4 object-contain rounded bg-white/80" />
      </span>
      <div className="min-w-0 flex-1">
        <span className="block text-lg font-bold text-[#0B1B3A] group-hover:text-[#FF4D6D] transition-colors">
          {name}
        </span>
        <p className="text-sm text-slate-500 mt-0.5">{tag}</p>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-white group-hover:text-[#FF4D6D] group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}

export function DestinationsDropdown() {
  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-10 md:gap-12 lg:gap-16 py-2">
      <div className="flex-1 min-w-0">
        <div className="grid grid-cols-2 gap-2">
          {navbarDestinations.map((d) => (
            <DestinationRow
              key={d.id}
              name={d.name}
              tag={d.tag}
              link={d.link}
              flagIcon={d.flagIcon}
            />
          ))}
          <Link
            to="/immigration/destinations"
            className="group flex items-center gap-4 p-4 rounded-xl border-2 col-span-2 md:col-span-1 transition-all duration-200"
            style={{
              borderColor: "rgba(255, 77, 109, 0.5)",
              background:
                "linear-gradient(135deg, rgba(255, 77, 109, 0.08), rgba(225, 29, 72, 0.05))",
            }}
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
              style={{
                background: "linear-gradient(135deg, #FF4D6D, #E11D48)",
              }}
            >
              <ArrowRight className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <span className="block text-lg font-bold text-[#0B1B3A] group-hover:text-[#FF4D6D] transition-colors">
                View all destinations
              </span>
              <p className="text-sm text-slate-600 mt-0.5">
                {destinations.length} countries & regions
              </p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-[#FF4D6D] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full md:w-[280px] shrink-0">
        <div className="rounded-2xl overflow-hidden shadow-lg text-white p-5 bg-[#0B1B3A]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 mb-4">
            <Map className="h-5 w-5" />
          </div>
          <h4 className="text-base font-bold mb-1">Free consultation</h4>
          <p className="text-sm text-white/80 mb-4">
            Get personalized visa and immigration guidance
          </p>
          <Link
            to="/immigration/contact"
            className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm bg-[#FF4D6D] hover:bg-[#E11D48] transition-colors"
          >
            Book now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h4 className="flex items-center gap-2 text-sm font-bold text-[#0B1B3A] mb-4">
            <Phone className="h-4 w-4 text-[#FF4D6D]" />
            Need help?
          </h4>
          <div className="space-y-3">
            <a
              href="tel:+92516135834"
              className="flex items-center gap-2 text-sm text-slate-700 hover:text-[#FF4D6D] transition-colors"
            >
              <Phone className="h-4 w-4 shrink-0 text-white" />
              PK: (051) 6135834
            </a>
            <a
              href="tel:+923701902128"
              className="flex items-center gap-2 text-sm text-slate-700 hover:text-[#FF4D6D] transition-colors"
            >
              <Phone className="h-4 w-4 shrink-0 text-white" />
              PK: +92 370 1902128
            </a>
            <a
              href="tel:+447432406993"
              className="flex items-center gap-2 text-sm text-slate-700 hover:text-[#FF4D6D] transition-colors"
            >
              <Phone className="h-4 w-4 shrink-0 text-white" />
              UK: +44 7432 406993
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
