export interface MalaysiaFaqItem {
  id: number;
  q: string;
  a: string;
}

export interface MalaysiaScenarioItem {
  id: "malaysian-award" | "branch-campus" | "transfer-programme";
  title: string;
  input: string;
  response: string;
  status: string;
}

export const MALAYSIA_SEO = {
  title: "Study in Malaysia | ProConsulting",
  metaDescription:
    "Compare Malaysia courses, funding questions and study application steps with ProConsulting. Start with a free assessment.",
  h1: "Study in Malaysia",
  canonicalUrl: "https://proconsulting.uk/education/destinations/study-in-malaysia",
  ctaText: "Get free Malaysia assessment",
  ctaHref: "/education/contact?destination=malaysia",
  lastReviewedDate: "22 October 2026",
};

export const MALAYSIA_SCENARIOS: MalaysiaScenarioItem[] = [
  {
    id: "malaysian-award",
    title: "Malaysian award",
    input: "I plan to complete the degree in Malaysia.",
    response:
      "Confirm the awarding institution, programme status and campus. Review course content and recognition for your intended next step.",
    status: "Exact award needs checking.",
  },
  {
    id: "branch-campus",
    title: "Branch campus",
    input: "I recognise the overseas university name.",
    response:
      "Confirm the qualification issued by this campus and its specific course terms. Do not assume another campus has identical fees or entry rules.",
    status: "Campus terms need review.",
  },
  {
    id: "transfer-programme",
    title: "Transfer programme",
    input: "I want to start in Malaysia and finish elsewhere.",
    response:
      "Check transfer conditions, remaining fees and the separate immigration decision. Keep a workable plan if transfer does not happen.",
    status: "Transfer is not confirmed.",
  },
];

export const MALAYSIA_FAQS: MalaysiaFaqItem[] = [
  {
    id: 1,
    q: "Is a branch-campus degree the same as studying overseas?",
    a: "Check the exact award and campus terms. A university’s overseas name does not mean the programme includes study, immigration permission or a place in another country.",
  },
  {
    id: 2,
    q: "Is a twinning or transfer place guaranteed?",
    a: "Do not assume so. Transfers can depend on grades, places, fees and a separate immigration decision. Ask for the actual conditions in writing.",
  },
  {
    id: 3,
    q: "Will my Malaysian qualification be recognised in Pakistan?",
    a: "That depends on the exact qualification and intended use. Check academic recognition and any relevant professional requirements before enrolling.",
  },
  {
    id: 4,
    q: "Can I work to cover my tuition in Malaysia?",
    a: "Do not rely on that. Student work has restrictions and approval conditions. Build a funded plan without assuming a job or unrestricted working hours.",
  },
  {
    id: 5,
    q: "Does admission include a student pass, scholarship or graduate permission?",
    a: "No. These are separate decisions with their own conditions. Confirm each route and do not count an unconfirmed award or permission as secured.",
  },
];

export const MALAYSIA_SCHEMA_GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://proconsulting.uk/education/destinations/study-in-malaysia#service",
      "name": "Malaysia study application guidance",
      "url": "https://proconsulting.uk/education/destinations/study-in-malaysia",
      "provider": {
        "@type": "Organization",
        "name": "ProConsulting",
        "url": "https://proconsulting.uk",
      },
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://proconsulting.uk/education",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Destinations",
          "item": "https://proconsulting.uk/education/destinations",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Malaysia",
          "item": "https://proconsulting.uk/education/destinations/study-in-malaysia",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://proconsulting.uk/education/destinations/study-in-malaysia#faq",
      "mainEntity": MALAYSIA_FAQS.map((faq) => ({
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
