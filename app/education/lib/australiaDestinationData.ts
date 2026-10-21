export interface AustraliaFaqItem {
  id: number;
  q: string;
  a: string;
}

export const AUSTRALIA_SEO = {
  title: "Study in Australia | ProConsulting",
  metaDescription:
    "Compare Australian courses, tuition, living costs and Student visa steps. Get a free Australia assessment with ProConsulting before you commit.",
  h1: "Study in Australia",
  canonicalUrl: "https://proconsulting.uk/education/destinations/study-in-australia",
  ctaText: "Get free Australia assessment",
  ctaHref: "/education/contact?destination=australia",
  lastReviewedDate: "20 October 2026",
};

export const AUSTRALIA_FAQS: AustraliaFaqItem[] = [
  {
    id: 1,
    q: "How much will studying cost?",
    a: "It depends on the course, provider and place you live. Compare current tuition with realistic living costs. Check payment dates as well as the total.",
  },
  {
    id: 2,
    q: "Does a CoE mean my visa is approved?",
    a: "No. A CoE confirms enrolment for the visa process. Home Affairs still assesses your application against the visa requirements.",
  },
  {
    id: 3,
    q: "Can I cover my costs by working?",
    a: "Do not build your plan around that. Work rights are conditional, and a job is not guaranteed. Arrange reliable funding before you commit.",
  },
  {
    id: 4,
    q: "Will an Australian degree qualify me for subclass 485?",
    a: "Not automatically. Your qualification and personal circumstances must meet the current stream rules. Check eligibility before choosing a course for this reason.",
  },
  {
    id: 5,
    q: "Can my family join me?",
    a: "Only some applicants can include family under the current rules. Check eligibility separately before paying for travel, housing or school arrangements.",
  },
  {
    id: 6,
    q: "Can I apply without a scholarship?",
    a: "Yes, if you meet admission and visa requirements with suitable funding. An unconfirmed scholarship should not fill a gap in your budget.",
  },
];

export const AUSTRALIA_SCHEMA_GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://proconsulting.uk/education/destinations/study-in-australia#webpage",
      "url": "https://proconsulting.uk/education/destinations/study-in-australia",
      "name": AUSTRALIA_SEO.title,
      "description": AUSTRALIA_SEO.metaDescription,
      "inLanguage": "en",
      "isPartOf": {
        "@type": "WebSite",
        "@id": "https://proconsulting.uk/#website",
        "name": "ProConsulting",
        "url": "https://proconsulting.uk",
      },
      "mainEntity": {
        "@id": "https://proconsulting.uk/education/destinations/study-in-australia#service",
      },
      "breadcrumb": {
        "@id": "https://proconsulting.uk/education/destinations/study-in-australia#breadcrumb",
      },
    },
    {
      "@type": "Service",
      "@id": "https://proconsulting.uk/education/destinations/study-in-australia#service",
      "name": "Australia study assessment and application guidance",
      "url": "https://proconsulting.uk/education/destinations/study-in-australia",
      "serviceType": "Education consultancy",
      "areaServed": "Pakistan",
      "provider": {
        "@type": "Organization",
        "@id": "https://proconsulting.uk/#organization",
        "name": "ProConsulting",
        "url": "https://proconsulting.uk",
      },
      "description": AUSTRALIA_SEO.metaDescription,
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://proconsulting.uk/education/destinations/study-in-australia#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://proconsulting.uk",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Education",
          "item": "https://proconsulting.uk/education",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Destinations",
          "item": "https://proconsulting.uk/education/destinations",
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Australia",
          "item": "https://proconsulting.uk/education/destinations/study-in-australia",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://proconsulting.uk/education/destinations/study-in-australia#faq",
      "mainEntity": AUSTRALIA_FAQS.map((faq) => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a,
        },
      })),
    },
  ],
};
