export interface SpainFaqItem {
  id: number;
  q: string;
  a: string;
}

export const SPAIN_SEO = {
  title: "Study in Spain | ProConsulting",
  metaDescription:
    "Compare Spanish courses, degree types, tuition, language needs and study visa steps. Build a clearer plan with a free ProConsulting Spain assessment.",
  h1: "Study in Spain",
  canonicalUrl: "https://proconsulting.uk/education/destinations/study-in-spain",
  ctaText: "Get free Spain assessment",
  ctaHref: "/education/contact?destination=spain",
  lastReviewedDate: "20 October 2026",
};

export const SPAIN_FAQS: SpainFaqItem[] = [
  {
    id: 1,
    q: "Can I study in Spain in English?",
    a: "Yes, English-taught options exist. Confirm the language of the whole course, including placements and assessment.",
  },
  {
    id: 2,
    q: "Are all Spanish master's awards the same?",
    a: "No. Check whether the award is an official Máster Universitario or a university-specific qualification. Match it to your academic and career goals.",
  },
  {
    id: 3,
    q: "Can a scholarship pay every cost?",
    a: "Only the award terms can answer that. Check coverage, exclusions and payment timing before relying on funding.",
  },
  {
    id: 4,
    q: "Can my family join me?",
    a: "An eligible family route may apply to some higher education students. Check the relationship rules and extra financial and insurance requirements.",
  },
];

export const SPAIN_SCHEMA_GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://proconsulting.uk/education/destinations/study-in-spain#webpage",
      "url": "https://proconsulting.uk/education/destinations/study-in-spain",
      "name": SPAIN_SEO.title,
      "description": SPAIN_SEO.metaDescription,
      "inLanguage": "en",
      "isPartOf": {
        "@type": "WebSite",
        "@id": "https://proconsulting.uk/#website",
        "name": "ProConsulting",
        "url": "https://proconsulting.uk",
      },
      "mainEntity": {
        "@id": "https://proconsulting.uk/education/destinations/study-in-spain#service",
      },
      "breadcrumb": {
        "@id": "https://proconsulting.uk/education/destinations/study-in-spain#breadcrumb",
      },
    },
    {
      "@type": "Service",
      "@id": "https://proconsulting.uk/education/destinations/study-in-spain#service",
      "name": "Study in Spain guidance",
      "url": "https://proconsulting.uk/education/destinations/study-in-spain",
      "serviceType": "Education consultancy",
      "areaServed": "Pakistan",
      "provider": {
        "@type": "Organization",
        "@id": "https://proconsulting.uk/#organization",
        "name": "ProConsulting",
        "url": "https://proconsulting.uk",
      },
      "description": SPAIN_SEO.metaDescription,
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://proconsulting.uk/education/destinations/study-in-spain#breadcrumb",
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
          "name": "Spain",
          "item": "https://proconsulting.uk/education/destinations/study-in-spain",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://proconsulting.uk/education/destinations/study-in-spain#faq",
      "mainEntity": SPAIN_FAQS.map((faq) => ({
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
