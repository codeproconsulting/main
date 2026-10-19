export interface NewZealandFaqItem {
  id: number;
  q: string;
  a: string;
}

export const NEW_ZEALAND_SEO = {
  title: "Study in New Zealand | ProConsulting",
  metaDescription:
    "Compare New Zealand courses, family costs, funding and visa steps. Get a free ProConsulting assessment for students and parents in Pakistan.",
  h1: "Study in New Zealand",
  canonicalUrl: "https://proconsulting.uk/education/destinations/study-in-new-zealand",
  ctaText: "Get free New Zealand assessment",
  ctaHref: "/education/contact?destination=new-zealand",
  lastReviewedDate: "19 October 2026",
};

export const NEW_ZEALAND_FAQS: NewZealandFaqItem[] = [
  {
    id: 1,
    q: "How do I start planning to Study in New Zealand?",
    a: "Begin with your academic background, subject goal and realistic family funding. Compare suitable courses, check their entry requirements and verify the provider. A free assessment can help frame questions, but provider and immigration checks remain separate responsibilities.",
  },
  {
    id: 2,
    q: "Is an English test always required?",
    a: "English requirements depend on the programme, provider and relevant application requirements. Accepted tests, scores and alternative evidence can differ. Do not assume an exemption based on a friend’s admission or an earlier policy; obtain confirmation for your own application.",
  },
  {
    id: 3,
    q: "Can my parents fund my studies?",
    a: "Parental support may be part of a funding plan, but the evidence must meet the applicable requirements. Check how the relationship, source and availability of funds should be shown. A promise to pay is not a substitute for acceptable evidence.",
  },
  {
    id: 4,
    q: "Should I pay tuition before my visa application?",
    a: "Check the current process for your location and visa route before paying. Approval-in-principle arrangements may be relevant, but are not universal. Confirm tuition-payment evidence, provider deadlines and refund terms together rather than following a single rule for every applicant.",
  },
  {
    id: 5,
    q: "Can a scholarship cover everything?",
    a: "Only the actual award terms can answer that. Some awards cover limited tuition costs; others have different benefits and conditions. Check exclusions and payment timing, and keep a funding plan that does not rely on an award you have not received.",
  },
  {
    id: 6,
    q: "Can work pay for my course and living costs?",
    a: "Do not build the essential budget on that assumption. Work permission is conditional, jobs are not guaranteed and earnings may be insufficient. Required funding evidence must be addressed independently of hopes about future employment.",
  },
  {
    id: 7,
    q: "Will my qualification lead to post-study work or residence?",
    a: "Not automatically. Eligibility depends on the qualification, study and immigration rules that apply. Residence has separate requirements. Check the specific course rather than treating all New Zealand qualifications as equivalent immigration pathways.",
  },
  {
    id: 8,
    q: "Can my partner or children come with me?",
    a: "Family options depend on the relevant visa categories, your circumstances and current eligibility rules. Do not assume a student visa gives family members entry or work rights. Check the separate requirements and additional household costs before making commitments.",
  },
  {
    id: 9,
    q: "Is the assessment free, and what happens afterwards?",
    a: "The initial assessment is free. It is a discussion of your study plans, not a guarantee of eligibility or an obligation to proceed. Ask for written scope and fees before agreeing to any paid service, and decide after understanding what is included.",
  },
];

export const NEW_ZEALAND_SCHEMA_GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://proconsulting.uk/education/destinations/study-in-new-zealand#webpage",
      "url": "https://proconsulting.uk/education/destinations/study-in-new-zealand",
      "name": NEW_ZEALAND_SEO.title,
      "description": NEW_ZEALAND_SEO.metaDescription,
      "isPartOf": {
        "@type": "WebSite",
        "@id": "https://proconsulting.uk/#website",
        "name": "ProConsulting",
        "url": "https://proconsulting.uk",
      },
      "mainEntity": {
        "@id": "https://proconsulting.uk/education/destinations/study-in-new-zealand#service",
      },
      "breadcrumb": {
        "@id": "https://proconsulting.uk/education/destinations/study-in-new-zealand#breadcrumb",
      },
    },
    {
      "@type": "Service",
      "@id": "https://proconsulting.uk/education/destinations/study-in-new-zealand#service",
      "name": "New Zealand study application guidance",
      "url": "https://proconsulting.uk/education/destinations/study-in-new-zealand",
      "serviceType": "Study Abroad Advisory",
      "areaServed": "Pakistan",
      "provider": {
        "@type": "Organization",
        "@id": "https://proconsulting.uk/#organization",
        "name": "ProConsulting",
        "url": "https://proconsulting.uk",
      },
      "description": NEW_ZEALAND_SEO.metaDescription,
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://proconsulting.uk/education/destinations/study-in-new-zealand#breadcrumb",
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
          "name": "New Zealand",
          "item": "https://proconsulting.uk/education/destinations/study-in-new-zealand",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://proconsulting.uk/education/destinations/study-in-new-zealand#faq",
      "mainEntity": NEW_ZEALAND_FAQS.map((faq) => ({
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
