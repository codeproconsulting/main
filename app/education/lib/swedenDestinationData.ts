export interface SwedenFaqItem {
  id: number;
  q: string;
  a: string;
}

export const SWEDEN_SEO = {
  title: "Study in Sweden | ProConsulting",
  metaDescription:
    "Explore Swedish courses, tuition, scholarships and residence-permit planning for Pakistani students. Get a free Sweden assessment with ProConsulting.",
  h1: "Study in Sweden",
  canonicalUrl: "https://proconsulting.uk/education/destinations/study-in-sweden",
  ctaText: "Get free Sweden assessment",
  ctaHref: "/education/contact?destination=sweden",
  lastReviewedDate: "19 October 2026",
};

export const SWEDEN_FAQS: SwedenFaqItem[] = [
  {
    id: 1,
    q: "Can I Study in Sweden after a bachelor’s degree?",
    a: "Possibly. Your degree structure must meet the general master’s entry requirements, and your transcript must satisfy the selected programme’s subject requirements. Check the Pakistan-specific instructions before treating your degree title as proof of eligibility.",
  },
  {
    id: 2,
    q: "Can I apply without IELTS?",
    a: "Check the accepted English-evidence routes rather than assuming either that IELTS is always compulsory or that a medium-of-instruction letter always works. Pakistani upper-secondary English study alone does not meet the published requirement.",
  },
  {
    id: 3,
    q: "Is studying in Sweden free for Pakistani students?",
    a: "Generally, application and tuition fees apply unless you qualify for an exemption. A scholarship is separate from fee status and may cover only part of the overall cost. Use the exact programme’s published fees.",
  },
  {
    id: 4,
    q: "Are Swedish Institute scholarships open to Pakistanis?",
    a: "Do not assume so. Eligibility depends on the named scheme and current call. The Global Professionals page checked for this guide did not list Pakistan among its eligible countries. Recheck before applying, because calls can change.",
  },
  {
    id: 5,
    q: "Can my parents fund my studies?",
    a: "Family money can support your plan, but evidence must follow Swedish rules. The Migration Agency distinguishes private relatives from accepted sponsors and specifies how relatives’ funds should be held. A support letter alone is not enough.",
  },
  {
    id: 6,
    q: "Can I pay tuition after applying for the residence permit?",
    a: "The Migration Agency says any tuition fee must be paid before you apply. Follow the university’s required payment and notification process. Do not confuse an unpaid offer with the admission status required for the permit application.",
  },
  {
    id: 7,
    q: "Can a part-time job cover my costs?",
    a: "Do not build your plan around that assumption. Employment is uncertain and work conditions must be followed. Your funding and required evidence should be arranged without depending on a job you have not secured.",
  },
  {
    id: 8,
    q: "Can my spouse or children come with me?",
    a: "They may be able to apply, subject to the current rules and their circumstances. Check additional maintenance, relationship documents and insurance requirements. Accompanying-family rules are time-sensitive and need review for your intended application date.",
  },
  {
    id: 9,
    q: "What happens during an assessment?",
    a: "We discuss your study goals, academic fit and the questions holding you back. You can compare suitable options before deciding whether to proceed.",
  },
];

export const SWEDEN_SCHEMA_GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://proconsulting.uk/education/destinations/study-in-sweden#webpage",
      "url": "https://proconsulting.uk/education/destinations/study-in-sweden",
      "name": SWEDEN_SEO.title,
      "description": SWEDEN_SEO.metaDescription,
      "inLanguage": "en",
      "isPartOf": {
        "@type": "WebSite",
        "@id": "https://proconsulting.uk/#website",
        "name": "ProConsulting",
        "url": "https://proconsulting.uk",
      },
      "mainEntity": {
        "@id": "https://proconsulting.uk/education/destinations/study-in-sweden#service",
      },
      "breadcrumb": {
        "@id": "https://proconsulting.uk/education/destinations/study-in-sweden#breadcrumb",
      },
    },
    {
      "@type": "Service",
      "@id": "https://proconsulting.uk/education/destinations/study-in-sweden#service",
      "name": "Sweden study application guidance",
      "url": "https://proconsulting.uk/education/destinations/study-in-sweden",
      "serviceType": "Education consultancy",
      "areaServed": "Pakistan",
      "provider": {
        "@type": "Organization",
        "@id": "https://proconsulting.uk/#organization",
        "name": "ProConsulting",
        "url": "https://proconsulting.uk",
      },
      "description": SWEDEN_SEO.metaDescription,
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://proconsulting.uk/education/destinations/study-in-sweden#breadcrumb",
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
          "name": "Sweden",
          "item": "https://proconsulting.uk/education/destinations/study-in-sweden",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://proconsulting.uk/education/destinations/study-in-sweden#faq",
      "mainEntity": SWEDEN_FAQS.map((faq) => ({
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
