export interface FranceFaqItem {
  id: number;
  q: string;
  a: string;
}

export const FRANCE_SEO = {
  title: "Study in France | ProConsulting",
  metaDescription:
    "Compare French courses, degree recognition, fees, funding and application routes. Get a free France assessment with ProConsulting.",
  h1: "Study in France",
  canonicalUrl: "https://proconsulting.uk/education/destinations/study-in-france",
  ctaText: "Get free France assessment",
  ctaHref: "/education/contact?destination=france",
  lastReviewedDate: "21 October 2026",
};

export const FRANCE_FAQS: FranceFaqItem[] = [
  {
    id: 1,
    q: "Do I need French for an English-taught course?",
    a: "Check the programme requirements. Teaching may be in English, while placements or daily tasks can involve French. Do not assume the course title settles every requirement.",
  },
  {
    id: 2,
    q: "Are all public universities free for Pakistani students?",
    a: "No. Fee categories and exemptions vary. Confirm the amount that applies to your nationality, programme and intake directly with the institution.",
  },
  {
    id: 3,
    q: "Can I apply directly to a university?",
    a: "Some institutions accept direct applications. Confirm how that route connects with the Campus France steps relevant to your situation.",
  },
  {
    id: 4,
    q: "Is a French qualification automatically accepted for my profession?",
    a: "Do not assume so. Check the exact award and the rules of the authority responsible for your intended profession and country.",
  },
  {
    id: 5,
    q: "Will a scholarship cover everything?",
    a: "Only the written award terms can answer that. Check tuition, living costs, duration and any conditions separately.",
  },
  {
    id: 6,
    q: "Can part-time work pay for my studies?",
    a: "Do not depend on it. Work conditions, available jobs and your study workload can limit earnings.",
  },
  {
    id: 7,
    q: "Can my family come with me?",
    a: "Family eligibility depends on the route and circumstances. Get a separate review before making housing or travel commitments.",
  },
  {
    id: 8,
    q: "What does the free assessment cover?",
    a: "It starts with your study plans and questions. Confirm the scope and price of any later paid support before proceeding.",
  },
];

export const FRANCE_SCHEMA_GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://proconsulting.uk/education/destinations/study-in-france#webpage",
      "url": "https://proconsulting.uk/education/destinations/study-in-france",
      "name": FRANCE_SEO.title,
      "description": FRANCE_SEO.metaDescription,
      "inLanguage": "en",
      "isPartOf": {
        "@type": "WebSite",
        "@id": "https://proconsulting.uk/#website",
        "name": "ProConsulting",
        "url": "https://proconsulting.uk",
      },
      "mainEntity": {
        "@id": "https://proconsulting.uk/education/destinations/study-in-france#service",
      },
      "breadcrumb": {
        "@id": "https://proconsulting.uk/education/destinations/study-in-france#breadcrumb",
      },
    },
    {
      "@type": "Service",
      "@id": "https://proconsulting.uk/education/destinations/study-in-france#service",
      "name": "Study in France guidance",
      "url": "https://proconsulting.uk/education/destinations/study-in-france",
      "serviceType": "Education consultancy",
      "areaServed": "Pakistan",
      "provider": {
        "@type": "Organization",
        "@id": "https://proconsulting.uk/#organization",
        "name": "ProConsulting",
        "url": "https://proconsulting.uk",
      },
      "description": FRANCE_SEO.metaDescription,
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://proconsulting.uk/education/destinations/study-in-france#breadcrumb",
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
          "name": "France",
          "item": "https://proconsulting.uk/education/destinations/study-in-france",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://proconsulting.uk/education/destinations/study-in-france#faq",
      "mainEntity": FRANCE_FAQS.map((faq) => ({
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
