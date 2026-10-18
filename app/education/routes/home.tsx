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

import { ReviewsSection } from "~/education/components/ui/ReviewsSection";

const TITLE = "Study Abroad Consultants for Pakistani Students | ProConsulting";
const DESCRIPTION =
  "Explore study destinations, university applications, scholarships and student visa guidance with ProConsulting. Start with a free study abroad assessment.";
const CANONICAL_URL = "https://proconsulting.uk/education";

const EDUCATION_HUB_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://proconsulting.uk/education#webpage",
      "url": CANONICAL_URL,
      "name": TITLE,
      "description": DESCRIPTION,
      "isPartOf": {
        "@type": "WebSite",
        "name": "Proconsulting",
        "url": "https://proconsulting.uk"
      }
    },
    {
      "@type": "Service",
      "@id": "https://proconsulting.uk/education#service",
      "name": "Study Abroad Consulting Services",
      "serviceType": "Study abroad consulting",
      "url": CANONICAL_URL,
      "provider": { "@id": "https://proconsulting.uk/#organization" },
      "areaServed": { "@type": "Country", "name": "Pakistan" },
      "description": DESCRIPTION
    }
  ]
};

export function meta(args?: Route.MetaArgs) {
  const pathname = "/education";
  return [
    { title: TITLE },
    { name: "description", content: DESCRIPTION },
    ...pageMeta({ title: TITLE, description: DESCRIPTION, pathname }),
    {
      "script:ld+json": EDUCATION_HUB_SCHEMA,
    },
  ];
}

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(EDUCATION_HUB_SCHEMA) }}
      />
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

      <Footer />
    </>
  );
}
