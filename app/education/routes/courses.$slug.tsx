"use client";

import { Link, useLoaderData } from "react-router";
import { Navbar } from "~/education/components/ui/Navbar";
import { Footer } from "~/education/components/ui/footer";
import { getCourseBySlug, type Course } from "~/education/lib/courses";
import type { Route } from "./+types/courses.$slug";
import { pageMeta, canonicalLink } from "~/education/lib/seo";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";

const BRAND = { navy: "#0B1B3A", pink: "#FF4D6D" };

type CourseDetail = {
  overview: string;
  whatYouCanStudy: string[];
  careers: string[];
  whyThisField: string[];
};

const COURSE_DETAILS: Record<string, CourseDetail> = {
  "social-sciences": {
    overview:
      "Social Sciences help you understand how people, societies, and institutions work. It’s a strong choice if you’re interested in research, policy, human behaviour, and real-world problem solving.",
    whatYouCanStudy: [
      "Sociology and social theory",
      "International relations and global politics",
      "Psychology and human behaviour",
      "Research methods and statistics",
      "Public policy and development",
    ],
    careers: [
      "Policy and research roles",
      "NGOs and international organisations",
      "Public administration and governance",
      "Human resources and people operations",
      "Market and social research",
    ],
    whyThisField: [
      "Flexible degree options across many universities",
      "Good pathway into policy, development, and public services",
      "Builds strong writing, research, and critical thinking skills",
    ],
  },
  sociology: {
    overview:
      "Sociology explores society, culture, inequality, and how communities change over time. It’s ideal if you’re curious about social issues and want a research-focused degree with practical relevance.",
    whatYouCanStudy: [
      "Social inequality and gender studies",
      "Culture, media, and identity",
      "Criminology and social justice (where offered)",
      "Urban studies and communities",
      "Qualitative and quantitative research methods",
    ],
    careers: [
      "Social research and analytics",
      "Community and youth programmes",
      "Public policy and social services",
      "NGO / advocacy work",
      "Graduate pathways into law, HR, and public administration",
    ],
    whyThisField: [
      "Strong research and communication foundation",
      "Relevant to real-world problems and public policy",
      "Good choice for students planning postgraduate study",
    ],
  },
  "international-relations": {
    overview:
      "International Relations focuses on global affairs, diplomacy, conflict, and international cooperation. It suits students aiming for global careers or interdisciplinary pathways into policy, security, and development.",
    whatYouCanStudy: [
      "International politics and diplomacy",
      "Security studies and conflict resolution",
      "Foreign policy analysis",
      "International law (module options vary by university)",
      "Global development and humanitarian studies",
    ],
    careers: [
      "Diplomacy and public service",
      "International NGOs and development",
      "Risk, compliance, and policy analysis",
      "Research and think-tanks",
      "Corporate roles in global organisations",
    ],
    whyThisField: [
      "Highly transferable skills: writing, analysis, communication",
      "Many English-taught options across the UK/EU",
      "Pairs well with minors in economics, law, or data",
    ],
  },
};

function getDetails(course: Course): CourseDetail {
  const specific = COURSE_DETAILS[course.slug];
  if (specific) return specific;

  // Generic fallback for existing course categories
  return {
    overview:
      "This study area includes a range of programmes and specialisations. We’ll help you shortlist the right course based on your profile, budget, and target destination.",
    whatYouCanStudy: [
      "Popular specialisations and pathways",
      "Foundation and undergraduate options",
      "Master’s routes and conversion degrees (where available)",
      "Project work and practical modules",
      "Internship / placement options (country and university dependent)",
    ],
    careers: [
      "Graduate roles in your chosen industry",
      "Professional certifications (where relevant)",
      "Postgraduate research or specialisation",
    ],
    whyThisField: [
      "Strong global demand across multiple destinations",
      "Multiple intake options depending on country",
      "Flexible pathways for different academic backgrounds",
    ],
  };
}

export function loader({ params }: Route.LoaderArgs) {
  const course = getCourseBySlug(params.slug);
  return { course };
}

export function meta(args?: Route.MetaArgs) {
  const course = args?.data?.course as Course | undefined;
  if (!course) return [{ title: "Course not found | ProConsulting" }];

  const title = `${course.name} | Courses | ProConsulting`;
  const description = `Explore ${course.name}: modules, careers, and guidance for studying abroad.`;
  const pathname = args?.location?.pathname ?? (args?.params ? `/courses/${args.params.slug}` : "");
  return [
    { title },
    { name: "description", content: description },
    ...pageMeta({ title, description, pathname }),
  ];
}

export function links(args?: any) {
  const pathname = args?.location?.pathname ?? (args?.params ? `/education/courses/${args.params.slug}` : "");
  return pathname ? canonicalLink(pathname) : [];
}

export default function CourseSlugPage() {
  const { course } = useLoaderData<typeof loader>();

  if (!course) {
    return (
      <>
        <Navbar />
        <main className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-16">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Course not found</h1>
          <p className="text-slate-600 mb-6">The course you’re looking for doesn’t exist or has been moved.</p>
          <Link to="/education/courses" className="inline-flex items-center gap-2 text-[#FF4D6D] font-semibold hover:underline">
            <ArrowLeft className="w-4 h-4" />
            View all courses
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const details = getDetails(course);

  return (
    <>
      <Navbar />

      {/* Header */}
      <section className="border-b border-slate-200/80 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-10 md:pt-16 md:pb-14">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#0B1B3A] transition-colors">Home</Link>
            <span aria-hidden>/</span>
            <Link to="/education/courses" className="hover:text-[#0B1B3A] transition-colors">Courses</Link>
            <span aria-hidden>/</span>
            <span className="text-[#0B1B3A] font-medium">{course.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3" style={{ color: BRAND.pink }}>
                <BookOpen className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">Course area</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0B1B3A] tracking-tight">
                {course.name}
              </h1>
              <div className="mt-2 w-16 h-1 rounded-full" style={{ backgroundColor: BRAND.pink }} />
              <p className="mt-5 text-slate-600 text-lg max-w-2xl leading-relaxed">
                {course.description}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/education/courses"
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                All courses
              </Link>
              <Link
                to="/education/contact"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white hover:opacity-95 transition-opacity"
                style={{ backgroundColor: BRAND.pink }}
              >
                Get free consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
              <p className="text-slate-600 leading-relaxed">{details.overview}</p>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">What you can study</h3>
                  <ul className="space-y-3">
                    {details.whatYouCanStudy.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#FF4D6D] shrink-0 mt-0.5" aria-hidden />
                        <span className="text-slate-700 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Career pathways</h3>
                  <ul className="space-y-3">
                    {details.careers.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#FF4D6D] shrink-0 mt-0.5" aria-hidden />
                        <span className="text-slate-700 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 rounded-2xl border border-slate-200 bg-slate-50/80 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Why this field?</h3>
                <ul className="space-y-3">
                  {details.whyThisField.map((item) => (
                    <li key={item} className="flex items-start gap-3">
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



      <Footer />
    </>
  );
}

