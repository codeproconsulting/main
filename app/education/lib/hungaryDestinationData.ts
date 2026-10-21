export interface HungaryFaqItem {
  id: number;
  q: string;
  a: string;
}

export const HUNGARY_SEO = {
  title: "Study in Hungary | ProConsulting",
  metaDescription:
    "Plan study in Hungary around course recognition, real costs, scholarship conditions and residence requirements. Get a free assessment with ProConsulting.",
  h1: "Study in Hungary",
  canonicalUrl: "https://proconsulting.uk/education/destinations/study-in-hungary",
  ctaText: "Get free Hungary assessment",
  ctaHref: "/education/contact?destination=hungary",
  lastReviewedDate: "21 October 2026",
};

export const HUNGARY_FAQS: HungaryFaqItem[] = [
  {
    id: 1,
    q: "Is every Hungarian degree recognised across Europe?",
    a: "Do not treat recognition as universal. Check the award and any professional requirements in the country where you intend to use it.",
  },
  {
    id: 2,
    q: "Can I study medicine in English?",
    a: "Check the specific programme, entry process and teaching arrangements. Confirm clinical language needs and future licensing before choosing a course.",
  },
  {
    id: 3,
    q: "Does admission guarantee study residence?",
    a: "No. The residence application has separate requirements. An admission decision is not an immigration decision.",
  },
  {
    id: 4,
    q: "Does Stipendium Hungaricum guarantee a place?",
    a: "No. Check the current call, sending-partner requirements and university selection. Applying does not guarantee nomination, admission or an award.",
  },
  {
    id: 5,
    q: "Can my parents fund my studies?",
    a: "Family support may be relevant, but the evidence must meet the applicable rules. Review the sponsor and funding history before relying on it.",
  },
  {
    id: 6,
    q: "Can I bring my spouse and children?",
    a: "Study residence has restrictive family reunification rules. Get advice on your circumstances before making any family plans.",
  },
  {
    id: 7,
    q: "Can work cover my living costs?",
    a: "Do not rely on finding a job. Permission limits, job availability and your study workload all matter.",
  },
  {
    id: 8,
    q: "What should I discuss in the assessment?",
    a: "Explain your academic background, course interests and funding plan. If professional recognition or family travel is essential, raise that first.",
  },
];

export const HUNGARY_SCHEMA_GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://proconsulting.uk/education/destinations/study-in-hungary#webpage",
      "url": "https://proconsulting.uk/education/destinations/study-in-hungary",
      "name": HUNGARY_SEO.title,
      "description": HUNGARY_SEO.metaDescription,
      "inLanguage": "en",
      "isPartOf": {
        "@type": "WebSite",
        "@id": "https://proconsulting.uk/#website",
        "name": "ProConsulting",
        "url": "https://proconsulting.uk",
      },
      "mainEntity": {
        "@id": "https://proconsulting.uk/education/destinations/study-in-hungary#service",
      },
      "breadcrumb": {
        "@id": "https://proconsulting.uk/education/destinations/study-in-hungary#breadcrumb",
      },
    },
    {
      "@type": "Service",
      "@id": "https://proconsulting.uk/education/destinations/study-in-hungary#service",
      "name": "Study in Hungary guidance",
      "url": "https://proconsulting.uk/education/destinations/study-in-hungary",
      "serviceType": "Education consultancy",
      "areaServed": "Pakistan",
      "provider": {
        "@type": "Organization",
        "@id": "https://proconsulting.uk/#organization",
        "name": "ProConsulting",
        "url": "https://proconsulting.uk",
      },
      "description": HUNGARY_SEO.metaDescription,
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://proconsulting.uk/education/destinations/study-in-hungary#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://proconsulting.uk/",
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
          "name": "Study in Hungary",
          "item": "https://proconsulting.uk/education/destinations/study-in-hungary",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://proconsulting.uk/education/destinations/study-in-hungary#faq",
      "mainEntity": HUNGARY_FAQS.map((faq) => ({
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
