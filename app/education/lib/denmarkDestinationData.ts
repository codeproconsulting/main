export interface DenmarkScenario {
  id: string;
  name: string;
  scenarioTitle: string;
  input: string;
  response: string;
  status: string;
}

export interface DenmarkFaq {
  question: string;
  answer: string;
}

export const DENMARK_SEO = {
  title: "Study in Denmark | ProConsulting",
  metaDescription:
    "Compare Denmark courses, funding questions and study application steps with ProConsulting. Start with a free assessment.",
  canonical: "https://proconsulting.uk/education/destinations/study-in-denmark",
  ogImage: "https://proconsulting.uk/og/study-in-denmark.svg",
};

export const DENMARK_SCENARIOS: DenmarkScenario[] = [
  {
    id: "related-degree",
    name: "Related degree",
    scenarioTitle: "Related degree",
    input: "My previous degree is in the same broad subject.",
    response:
      "Compare the required subjects with your previous course content. A similar degree title does not settle the entry decision.",
    status: "Subject match needs checking.",
  },
  {
    id: "new-field",
    name: "New field",
    scenarioTitle: "New field",
    input: "I want to move into a different discipline.",
    response:
      "Ask whether the programme accepts your academic background. Compare a different course if required subjects are missing.",
    status: "Entry route is unresolved.",
  },
  {
    id: "english-taught",
    name: "English-taught choice",
    scenarioTitle: "English-taught choice",
    input: "I found a course advertised in English.",
    response:
      "Confirm the intake, teaching language and accepted language evidence. Do not assume one test suits every programme.",
    status: "Programme rules need confirmation.",
  },
];

export const DENMARK_FAQS: DenmarkFaq[] = [
  {
    question: "Can I apply to a Danish course with my current qualification?",
    answer:
      "The institution decides whether your qualification and subject background meet its requirements. Check general, course-specific and language requirements together.",
  },
  {
    question: "Is studying in Denmark free for Pakistani applicants?",
    answer:
      "Do not assume free tuition. Fees depend on your status and programme. Obtain the institution’s current fee decision for your circumstances.",
  },
  {
    question: "Does Denmark offer scholarships for every international student?",
    answer:
      "No award should be assumed. Schemes have different eligible applicants, courses and selection rules. Admission is not a scholarship decision.",
  },
  {
    question: "Can I pay for the course with student work?",
    answer:
      "Do not base your plan on finding a job. Permission and work conditions need current verification, and employment is not guaranteed.",
  },
  {
    question: "Can my family join me and can I stay after study?",
    answer:
      "Those options require separate checks under the rules for your study route. Confirm eligibility before making family or long-term financial plans.",
  },
];

export const DENMARK_SCHEMA_GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://proconsulting.uk/education/destinations/study-in-denmark#service",
      name: "Denmark study application guidance",
      url: "https://proconsulting.uk/education/destinations/study-in-denmark",
      provider: {
        "@type": "Organization",
        name: "ProConsulting",
        url: "https://proconsulting.uk",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://proconsulting.uk/education",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Destinations",
          item: "https://proconsulting.uk/education/destinations",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Denmark",
          item: "https://proconsulting.uk/education/destinations/study-in-denmark",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://proconsulting.uk/education/destinations/study-in-denmark#faq",
      mainEntity: DENMARK_FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ],
};
