"use client";

import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/education/components/ui/carousel";
import { popularDestinations } from "~/education/lib/destinations";

const BRAND = {
  navy: "#0B1B3A",
  accent: "#93b4e0",
};

export function StudyDestinationsSection() {
  return (
    <section
      className="relative py-20 overflow-hidden"
      style={{ backgroundColor: BRAND.navy }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:56px_56px] pointer-events-none"
        aria-hidden
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] mb-3 text-gray-400" style={{ color: BRAND.accent }}>
              Where to study
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Study destinations
            </h2>
          </div>
          <Link
            to="/education/destinations"
            className="group inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/10 hover:border-white/50 hover:text-white transition-all duration-300 shrink-0"
          >
            View all
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {popularDestinations.map((destination) => (
              <CarouselItem
                key={destination.id}
                className="pl-4 basis-[85%] md:basis-1/2 lg:basis-1/3"
              >
                <Link to={destination.link} className="block group">
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 transition-all duration-300 hover:border-white/30 hover:shadow-xl hover:shadow-black/20">
                    {/* Image or empty placeholder */}
                    {destination.image ? (
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-white/10 flex items-center justify-center">
                        <span className="text-white/50 text-sm font-medium">Image coming soon</span>
                      </div>
                    )}

                    {/* Short gradient only at bottom so photo stays visible */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1/3 min-h-[120px] pointer-events-none"
                      style={{
                        background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
                      }}
                    />

                    {/* Text at bottom; Explore on the other side, always visible */}
                    <div className="absolute bottom-0 left-0 right-0 flex flex-row justify-between items-end gap-4 p-3 md:p-4 pb-3 md:pb-4">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8), 0 0 16px rgba(0,0,0,0.4)" }}>
                          {destination.name}
                        </h3>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white shrink-0" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                        Explore
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="hidden md:block">
            <CarouselPrevious
              className="left-[-2rem] h-12 w-12 rounded-full border border-white/20 text-white hover:bg-white/15 hover:border-white/40 transition-colors"
              style={{ backgroundColor: "rgba(11,27,58,0.9)" }}
            />
            <CarouselNext
              className="right-[-2rem] h-12 w-12 rounded-full border border-white/20 text-white hover:bg-white/15 hover:border-white/40 transition-colors"
              style={{ backgroundColor: "rgba(11,27,58,0.9)" }}
            />
          </div>
        </Carousel>

        {/* Mobile link */}
        <div className="mt-8 text-center md:hidden">
          <Link
            to="/education/destinations"
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wider text-white/80 hover:text-white transition-colors"
          >
            See all destinations
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
