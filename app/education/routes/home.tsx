"use client";

import { WhyDifferentSection } from "~/education/components/ui/WhyDifferentSection";
import { Footer } from "~/education/components/ui/footer";
import { StatsSection } from "~/education/components/ui/StatSection";
import { StudyDestinationsSection } from "~/education/components/ui/StudyDestinationsSection";
import { Navbar } from "~/education/components/ui/Navbar";
import type { Route } from "./+types/home";
import { pageMeta, canonicalLink } from "~/education/lib/seo";
import { Hero } from "~/education/components/ui/heroImage";
import { StudentServicesSection } from "~/education/components/ui/StudentServicesSection";
import { RecentUpdatesSection } from "~/education/components/ui/RecentUpdatesSection";
import { PopularCoursesSection } from "~/education/components/ui/PopularCoursesSection";
import { FAQSection } from "~/education/components/ui/FAQSection";
import { PartnerUniversitiesSection } from "~/education/components/ui/PartnerUniversitiesSection";
import { FreeConsultationSection } from "~/education/components/ui/FreeConsultationSection";
import { ReviewsSection } from "~/education/components/ui/ReviewsSection";

const TITLE = "Proconsulting Education";
const DESCRIPTION =
  "Expert study abroad consultancy: university applications, visa guidance, and career counselling for UK, Australia, Canada, USA and more. Free consultation.";

export function meta(args?: Route.MetaArgs) {
  const pathname = args?.location?.pathname ?? "/";
  return [
    { title: TITLE },
    { name: "description", content: DESCRIPTION },
    ...pageMeta({ title: TITLE, description: DESCRIPTION, pathname }),
  ];
}

export function links(args?: any) {
  return canonicalLink(args?.location?.pathname ?? "/");
}

export default function Home() {
  return (
    <>
      <Navbar />
      <div>
        <Hero />
      </div>
      <StatsSection />
      <StudentServicesSection />
      <PartnerUniversitiesSection />
      <WhyDifferentSection />
      <ReviewsSection />
      <PopularCoursesSection />
      <RecentUpdatesSection />
      <StudyDestinationsSection />
      <FAQSection />
      <FreeConsultationSection />
      <Footer />
    </>
  );
}
