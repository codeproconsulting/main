export interface CanadaFaqItem {
  id: number;
  q: string;
  a: string;
}

export const CANADA_SEO = {
  title: "Study in Canada | ProConsulting",
  metaDescription:
    "Plan your Canadian studies with course-fit guidance, DLI and PGWP checks, realistic funding advice and study permit preparation. Get a free Canada assessment.",
  h1: "Study in Canada",
  canonicalUrl: "https://proconsulting.uk/education/destinations/study-in-canada",
  ctaText: "Get free Canada assessment",
  ctaHref: "/education/contact?destination=canada",
  lastReviewedDate: "19 October 2026",
};

export const CANADA_FAQS: CanadaFaqItem[] = [
  {
    id: 1,
    q: "How do I start planning to Study in Canada?",
    a: "Start with your academic background, a realistic funding plan and the qualification you want to pursue. Compare courses before committing to an institution. An initial assessment can identify questions to investigate; it cannot determine admission or study permit approval in advance.",
  },
  {
    id: 2,
    q: "Is every programme at a DLI eligible for a PGWP?",
    a: "No. DLI status and programme-level PGWP eligibility are different checks. Confirm the campus and exact programme, then review your own eligibility under IRCC’s current requirements. Do not rely only on an institution’s general marketing description.",
  },
  {
    id: 3,
    q: "Does a university offer guarantee a study permit?",
    a: "No. An institution’s admission decision is separate from IRCC’s study permit decision. You must meet the immigration requirements and provide truthful supporting evidence. Read offer conditions and refund terms before paying a deposit.",
  },
  {
    id: 4,
    q: "Will I need a PAL, TAL or CAQ?",
    a: "That depends on where and what you will study and whether an exemption applies. Check current IRCC guidance for PAL/TAL requirements. For Quebec, review the provincial selection and CAQ requirements separately as well as the federal requirements.",
  },
  {
    id: 5,
    q: "How much should my family budget?",
    a: "Use the institution’s current fee schedule and realistic local living costs, then include travel, insurance, setup costs and contingency. Check immigration financial evidence separately. There is no single total that fits every course, city, household and application date.",
  },
  {
    id: 6,
    q: "Can a scholarship cover everything?",
    a: "Only if a specific award’s written terms actually provide that coverage and you receive it. Many awards are partial or restricted. Confirm eligibility, exclusions and payment timing. Do not commit to a course your family cannot fund without an unconfirmed scholarship.",
  },
  {
    id: 7,
    q: "Can I pay my costs through part-time work?",
    a: "Do not build your plan around that assumption. Work permission has conditions, jobs are not guaranteed and study must remain manageable. Make sure your funding is sufficient without estimated wages, then check the rules before undertaking any employment.",
  },
  {
    id: 8,
    q: "Does studying in Canada lead automatically to permanent residence?",
    a: "No. Education, post-study work permission and permanent residence involve separate requirements and decisions. Rules may change before you graduate. Choose a programme with educational value even if your later immigration options differ from what you initially expected.",
  },
  {
    id: 9,
    q: "What happens during an assessment?",
    a: "We discuss your study goals, academic fit and the options worth exploring. You can ask questions and understand the proposed support before deciding whether to proceed.",
  },
];

export const CANADA_SCHEMA_GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://proconsulting.uk/education/destinations/study-in-canada#webpage",
      "url": "https://proconsulting.uk/education/destinations/study-in-canada",
      "name": CANADA_SEO.title,
      "description": CANADA_SEO.metaDescription,
      "inLanguage": "en",
      "isPartOf": {
        "@type": "WebSite",
        "@id": "https://proconsulting.uk/#website",
        "name": "ProConsulting",
        "url": "https://proconsulting.uk",
      },
      "mainEntity": {
        "@id": "https://proconsulting.uk/education/destinations/study-in-canada#service",
      },
      "breadcrumb": {
        "@id": "https://proconsulting.uk/education/destinations/study-in-canada#breadcrumb",
      },
    },
    {
      "@type": "Service",
      "@id": "https://proconsulting.uk/education/destinations/study-in-canada#service",
      "name": "Canada study assessment and application guidance",
      "url": "https://proconsulting.uk/education/destinations/study-in-canada",
      "serviceType": "Education consultancy",
      "areaServed": "Pakistan",
      "provider": {
        "@type": "Organization",
        "@id": "https://proconsulting.uk/#organization",
        "name": "ProConsulting",
        "url": "https://proconsulting.uk",
      },
      "description": CANADA_SEO.metaDescription,
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://proconsulting.uk/education/destinations/study-in-canada#breadcrumb",
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
          "name": "Canada",
          "item": "https://proconsulting.uk/education/destinations/study-in-canada",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://proconsulting.uk/education/destinations/study-in-canada#faq",
      "mainEntity": CANADA_FAQS.map((faq) => ({
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
