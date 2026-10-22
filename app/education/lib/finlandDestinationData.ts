export interface FinlandFaqItem {
  id: number;
  q: string;
  a: string;
}

export interface FinlandScenarioItem {
  id: "research-interest" | "applied-career" | "tuition-support";
  title: string;
  input: string;
  response: string;
  status: string;
}

export const FINLAND_SEO = {
  title: "Study in Finland | ProConsulting",
  metaDescription:
    "Compare Finland courses, funding questions and study application steps with ProConsulting. Start with a free assessment.",
  h1: "Study in Finland",
  canonicalUrl: "https://proconsulting.uk/education/destinations/study-in-finland",
  ctaText: "Get free Finland assessment",
  ctaHref: "/education/contact?destination=finland",
  lastReviewedDate: "22 October 2026",
};

export const FINLAND_SCENARIOS: FinlandScenarioItem[] = [
  {
    id: "research-interest",
    title: "Research interest",
    input: "I want to progress towards research in my subject.",
    response:
      "Compare relevant modules, research areas and progression requirements. Check whether your previous degree meets the programme rules.",
    status: "Course-level checks needed.",
  },
  {
    id: "applied-career",
    title: "Applied career change",
    input: "I want practical study in a new field.",
    response:
      "Compare starting knowledge, practical teaching and any experience requirements. Do not assume the programme accepts every previous degree.",
    status: "Entry fit needs review.",
  },
  {
    id: "tuition-support",
    title: "Tuition support needed",
    input: "I can only proceed if a scholarship covers my tuition.",
    response:
      "Check the university award terms and retain a separate living-cost plan. An application is not a funding award.",
    status: "Funding remains unconfirmed.",
  },
];

export const FINLAND_FAQS: FinlandFaqItem[] = [
  {
    id: 1,
    q: "Can I study in Finland in English?",
    a: "English-taught programmes exist, but availability and language evidence depend on the course. Check the exact programme and intake before booking a test.",
  },
  {
    id: 2,
    q: "Are Finnish scholarships fully funded?",
    a: "Do not assume that. University scholarships and tuition waivers have their own terms. Living costs may remain your responsibility even when tuition support is offered.",
  },
  {
    id: 3,
    q: "Can I fund my studies through part-time work?",
    a: "Do not use future earnings as your main funding plan. Jobs are not guaranteed, and your permission determines what work is allowed.",
  },
  {
    id: 4,
    q: "Does an offer mean I can move to Finland?",
    a: "No. Admission and residence permission are separate decisions. Confirm the current funds, insurance and application requirements before making commitments.",
  },
  {
    id: 5,
    q: "Can my family join me or can I stay after graduation?",
    a: "These are separate eligibility questions. The applicable permission, your circumstances and current rules need review. Neither option follows automatically from admission.",
  },
];

export const FINLAND_SCHEMA_GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://proconsulting.uk/education/destinations/study-in-finland#service",
      "name": "Finland study application guidance",
      "url": "https://proconsulting.uk/education/destinations/study-in-finland",
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
          "name": "Finland",
          "item": "https://proconsulting.uk/education/destinations/study-in-finland",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://proconsulting.uk/education/destinations/study-in-finland#faq",
      "mainEntity": FINLAND_FAQS.map((faq) => ({
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
