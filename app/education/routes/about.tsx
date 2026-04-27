"use client";

import { Link } from "react-router";
import { Navbar } from "~/education/components/ui/Navbar";
import { Footer } from "~/education/components/ui/footer";
import {
  Quote,
  Target,
  Eye,
  ArrowRight,
  Handshake,
  Award,
  Scale,
  Heart,
  ClipboardCheck,
} from "lucide-react";
import type { Route } from "./+types/about";
import { pageMeta, canonicalLink } from "~/education/lib/seo";

const TITLE = "About Us | ProConsulting";
const DESCRIPTION =
  "Pro Consulting is your trusted partner for study abroad. We simplify visa and university placement for international education and work with leading universities worldwide.";

export function meta(args?: Route.MetaArgs) {
  const pathname = args?.location?.pathname ?? "/about";
  return [
    { title: TITLE },
    { name: "description", content: DESCRIPTION },
    ...pageMeta({ title: TITLE, description: DESCRIPTION, pathname }),
  ];
}

export function links(args?: any) {
  return canonicalLink(args?.location?.pathname ?? "/about");
}

const CORE_VALUES = [
  { name: "Integrity", icon: Handshake, color: "indigo" as const },
  { name: "Expertise", icon: Award, color: "pink" as const },
  { name: "Transparency", icon: Scale, color: "indigo" as const },
  { name: "Empathy", icon: Heart, color: "pink" as const },
  { name: "Results", icon: ClipboardCheck, color: "indigo" as const },
];

const STORY = [
  { year: "2020", title: "Company Foundation", detail: "Early start and first step into student consultancy." },
  { year: "2021", title: "Business Collaboration", detail: "Beginning of active interaction with business partners." },
  { year: "2022", title: "Office in UK", detail: "5 Saint Kilda's Road B83JQ Birmingham, United Kingdom." },
  { year: "2024", title: "Office in Islamabad", detail: "Head Office established in Islamabad, Pakistan." },
];

const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3320.5944979431342!2d73.07194787619261!3d33.66766743793821!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x650559946b3fe6c5%3A0x1579db6227ef7c40!2sPro%20Consulting!5e0!3m2!1sen!2s!4v1772273412763!5m2!1sen!2s";

export default function About() {
  return (
    <>
      <Navbar />

      {/* Title area – light header */}
      <section className="border-b border-slate-200/80 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-10 md:pt-16 md:pb-14">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#0B1B3A] transition-colors">Home</Link>
            <span aria-hidden>/</span>
            <span className="text-[#0B1B3A] font-medium">About Us</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0B1B3A] tracking-tight">
                About Us
              </h1>
              <div className="mt-2 w-16 h-1 rounded-full bg-[#FF4D6D]" />
              <p className="mt-5 text-slate-600 text-lg max-w-2xl leading-relaxed">
                Pro Consulting has consistently been successful in eliminating myths about visa requirements and bringing smiles to deserving candidates.
              </p>
            </div>
            <Link
              to="/education/contact"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white shrink-0 transition-all hover:opacity-95 bg-[#FF4D6D]"
            >
              Contact us
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Welcome + intro – trusted partner for study abroad */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-[#FF4D6D] uppercase tracking-wider mb-4" aria-hidden="true">
            Welcome to Pro Consulting
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-[#0B1B3A] mb-6 leading-tight tracking-tight">
            Your trusted partner for study abroad
          </h2>
          <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-8">
            We help students navigate international education with clear visa guidance and direct links to leading universities. Our team cuts through the complexity of applications and requirements so you can focus on choosing the right course and destination.
          </p>
          <p className="text-slate-600 leading-relaxed max-w-3xl mx-auto mb-10">
            Pro Consulting works with recognised institutions worldwide and supports you with expert advice and, where needed, English language preparation—so you’re ready to make the most of your study abroad journey.
          </p>
          <Link
            to="/education/contact"
            className="inline-flex items-center gap-2 rounded-full bg-[#FF4D6D] hover:bg-[#E11D48] text-white font-bold px-8 py-3.5 transition-colors shadow-lg shadow-[#FF4D6D]/20 hover:shadow-[#FF4D6D]/30"
          >
            Get in touch <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-24 bg-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 md:mb-14">
            <span className="text-[#0B1B3A]">Core Values</span>
            <span className="text-[#FF4D6D]">.</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
            {CORE_VALUES.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className={`rounded-xl md:rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center min-h-[140px] md:min-h-[180px] ${
                    item.color === "indigo"
                      ? "bg-[#0B1B3A] text-white"
                      : "bg-[#FF4D6D] text-white"
                  }`}
                >
                  <Icon className="w-10 h-10 md:w-12 md:h-12 mb-3 md:mb-4 shrink-0" strokeWidth={1.5} />
                  <span className="font-bold text-sm md:text-base uppercase tracking-wide">{item.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story timeline */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-sm font-semibold text-[#FF4D6D] uppercase tracking-wider mb-3">
              Journey
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1B3A]">
              Our Story
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STORY.map((item) => (
              <div key={item.year} className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF4D6D] text-white font-bold">
                    {item.year.slice(-2)}
                  </span>
                  <span className="text-2xl font-bold text-[#0B1B3A]">{item.year}</span>
                </div>
                <h3 className="text-lg font-bold text-[#0B1B3A] mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location map */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <p className="text-sm font-semibold text-[#FF4D6D] uppercase tracking-wider mb-3">
              Find us
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1B3A]">
              Our location
            </h2>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-200/80 shadow-lg bg-white h-[450px] sm:h-[500px] md:h-[550px] lg:h-[600px]">
            <iframe
              src={MAP_EMBED_URL}
              title="Pro Consulting location on Google Maps"
              className="w-full h-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* Message from CEO */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-sm font-semibold text-[#FF4D6D] uppercase tracking-wider mb-4">
            From our CEO
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B1B3A] mb-8">
            Message from CEO
          </h2>
          <div className="relative pl-6 border-l-4 border-[#FF4D6D]">
            <Quote className="absolute -left-1 top-0 w-8 h-8 text-[#FF4D6D]/30" />
            <p className="text-gray-600 leading-relaxed mb-8">
              As the CEO of Pro Consulting, I welcome you to our official website. I assure you this is your right step towards your plan to study abroad in the world's best educational institutions we deal with. Our vision is to deliver you with unparalleled quality. As a task chief, I assure you that Our Zero Fault Policy makes Pro Consulting a name you can trust and rely on as we successfully navigate your guaranteed career path. &ldquo;Student satisfaction is our main goal.&rdquo; We believe in providing consistently outstanding service to our students, and we believe in 100% satisfaction, rather than just commercial sourcing. Keep in touch with us and we'll surely provide you the best options to build your career. Wishing you luck with your bright future.
            </p>
            <p className="font-bold text-[#0B1B3A]">Imran Abbas</p>
            <p className="text-sm text-gray-500">CEO</p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 bg-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="text-[#0B1B3A]">Mission</span>
            <span className="text-[#FF4D6D]"> & </span>
            <span className="text-[#0B1B3A]">Vision</span>
            <span className="text-[#FF4D6D]">.</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="rounded-2xl p-8 md:p-10 bg-[#0B1B3A] text-white flex flex-col">
              <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-white mb-6 shrink-0">
                <Target className="w-7 h-7" strokeWidth={2} />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h3>
              <p className="text-white leading-relaxed mb-6 flex-1">
                Our mission is clear — to empower students from all corners of the world to access quality education abroad. We are driven by the belief that every student deserves a chance to achieve their dreams, and we are here to make that journey as smooth as possible.
              </p>
              <Link
                to="/education/contact"
                className="inline-flex items-center gap-2 font-semibold text-white hover:text-[#FF4D6D] transition-colors w-fit"
              >
                Contact us today <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="rounded-2xl p-8 md:p-10 bg-[#FF4D6D] text-white flex flex-col">
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-white mb-6 shrink-0">
                <Eye className="w-7 h-7" strokeWidth={2} />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Our Vision</h3>
              <p className="text-white leading-relaxed mb-6 flex-1">
                Pro Consulting was established with a vision to simplify the path to international education. We are your trusted partners in realizing your academic ambitions on a global stage.
              </p>
              <Link
                to="/education/contact"
                className="inline-flex items-center gap-2 font-semibold text-white hover:text-[#0B1B3A] transition-colors w-fit border-b-2 border-white/50 hover:border-white"
              >
                Free consultation <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-[#0B1B3A]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Working with top institutions around the world
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            Pro Consulting has consistently been successful in eliminating myths about visa requirements.
          </p>
          <Link
            to="/education/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF4D6D] hover:bg-[#E11D48] text-white font-bold text-lg px-10 py-4 transition-colors"
          >
            Free consultation today
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
