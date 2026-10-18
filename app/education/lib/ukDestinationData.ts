export interface UkFaqItem {
  id: number;
  q: string;
  a: string;
}

export interface UkOfficialSource {
  id: string;
  name: string;
  url: string;
  description: string;
}

export const UK_SEO = {
  title: "Study in the UK from Pakistan | ProConsulting",
  metaDescription:
    "Plan to study in the UK from Pakistan with guidance on course choices, costs, admission requirements, CAS and student visa preparation. Get a free assessment.",
  h1: "Study in the UK from Pakistan",
  canonicalUrl: "https://proconsulting.uk/education/destinations/uk",
  ctaText: "Get free UK assessment",
  ctaHref: "/education/contact?destination=uk",
  lastReviewedDate: "18 October 2026",
};

export const UK_FAQS: UkFaqItem[] = [
  {
    id: 1,
    q: "How do I start planning to study in the UK from Pakistan?",
    a: "Start with your qualifications, preferred subject, intended intake and available funding. Bring any English-language results and existing offers. If you are still exploring, share your goals rather than guessing a university choice. The first useful step is identifying what fits and what needs checking.",
  },
  {
    id: 2,
    q: "Can I apply before my final results arrive?",
    a: "Some universities consider applications with results pending and may issue a conditional offer. Policies vary by course and institution. Check what evidence is accepted initially, what must follow and the deadline for meeting each condition.",
  },
  {
    id: 3,
    q: "Do all UK universities require IELTS?",
    a: "No single English-evidence route applies to every applicant. Universities and visa rules have specific requirements, and eligible higher education providers can assess English in certain circumstances. Confirm the evidence accepted for your exact course and sponsorship arrangements; do not assume a waiver.",
  },
  {
    id: 4,
    q: "Is an offer letter the same as a CAS?",
    a: "No. An offer sets out an admission decision and any conditions. A CAS is a sponsorship reference issued by your education provider for your Student visa application. Check the provider's requirements for issuing it. Neither an offer nor a CAS guarantees a visa.",
  },
  {
    id: 5,
    q: "Can my parents provide my study funds?",
    a: "UKVI guidance allows qualifying parental funds with the required supporting evidence. Check account control, access to the money, consent, relationship evidence and applicable holding requirements. Review the complete rules rather than treating a parent's bank balance as sufficient on its own.",
  },
  {
    id: 6,
    q: "How much will my UK study plan cost?",
    a: "There is no honest single price for every student. Tuition, location, course length, accommodation and personal circumstances change the total. Separate university and government costs from consultancy charges. Request current figures and a written service scope before committing.",
  },
  {
    id: 7,
    q: "Can I get a fully funded scholarship?",
    a: "Possibly, if you meet an award's criteria and are selected. Fully funded awards are competitive, and many scholarships cover only part of the cost. Check the official award terms and never treat an application or verbal suggestion as confirmed funding.",
  },
  {
    id: 8,
    q: "Can I pay my tuition through part-time work?",
    a: "Do not use that as your funding strategy. Work permission is conditional, jobs are uncertain and study must remain manageable. Arrange adequate funding before travel and check your own immigration conditions before taking any work.",
  },
  {
    id: 9,
    q: "Can my partner or children come with me?",
    a: "Not every Student visa holder can bring dependants. Eligibility depends on the course and sponsorship category, with restrictions affecting many taught postgraduate students. Check the current family-member rules and the additional financial requirements before planning a family move.",
  },
  {
    id: 10,
    q: "What if I have a study gap or a previous visa refusal?",
    a: "Disclose it accurately. The relevance depends on your history, the institution and the applicable immigration requirements. Supply truthful explanations and requested evidence. A new application should address the actual issues; nobody can promise that a gap or refusal will be ignored.",
  },
];

export const UK_OFFICIAL_SOURCES: UkOfficialSource[] = [
  {
    id: "S3",
    name: "Student visa overview and work conditions",
    url: "https://www.gov.uk/student-visa",
    description: "Official UKVI overview on sponsor licences, admission, English, and working conditions.",
  },
  {
    id: "S4",
    name: "Course requirements and CAS guidance",
    url: "https://www.gov.uk/student-visa/course",
    description: "Official criteria for licensed higher education providers, study levels, and CAS issuance.",
  },
  {
    id: "S5",
    name: "Financial requirements for Student visa",
    url: "https://www.gov.uk/student-visa/money",
    description: "Course fee funding, London vs outside-London maintenance thresholds, and holding periods.",
  },
  {
    id: "S6",
    name: "Detailed financial evidence guidance",
    url: "https://www.gov.uk/guidance/financial-evidence-for-student-and-child-student-route-applicants",
    description: "Official UKVI guidance on qualifying bank accounts, parental consent, regulated loans, and foreign exchange.",
  },
  {
    id: "S7",
    name: "Mandatory visa documents checklist",
    url: "https://www.gov.uk/student-visa/documents-you-must-provide",
    description: "Passport, CAS statement, financial proof, TB testing, and circumstance-dependent paperwork.",
  },
  {
    id: "S8",
    name: "Knowledge of English requirements",
    url: "https://www.gov.uk/student-visa/knowledge-of-english",
    description: "Approved SELT tests, eligible higher education provider assessments, and exemption criteria.",
  },
  {
    id: "S9",
    name: "Graduate visa (post-study work)",
    url: "https://www.gov.uk/graduate-visa",
    description: "Separate post-study work application rules, eligibility guidelines, and application date criteria.",
  },
  {
    id: "S10",
    name: "Student visa family members & dependants",
    url: "https://www.gov.uk/student-visa/family-members",
    description: "Dependant eligibility restrictions for taught courses and additional financial requirements.",
  },
  {
    id: "S11",
    name: "Chevening Scholarships",
    url: "https://www.chevening.org/scholarships/",
    description: "Official UK government international awards programme funded by the Foreign, Commonwealth and Development Office.",
  },
  {
    id: "S12",
    name: "Tuberculosis test for UK visa applicants",
    url: "https://www.gov.uk/tb-test-visa/countries-where-you-need-a-tb-test-to-enter-the-uk",
    description: "Approved screening clinics in Pakistan and requirements for applicants staying longer than 6 months.",
  },
];

export const UK_SCHEMA_GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://proconsulting.uk/#organization",
      "name": "ProConsulting",
      "url": "https://proconsulting.uk/",
    },
    {
      "@type": "Service",
      "@id": "https://proconsulting.uk/education/destinations/uk#service",
      "name": "UK study assessment and application support",
      "serviceType": "Study abroad consultancy",
      "url": "https://proconsulting.uk/education/destinations/uk",
      "provider": { "@id": "https://proconsulting.uk/#organization" },
      "areaServed": { "@type": "Country", "name": "Pakistan" },
      "description":
        "UK course selection, funding planning and application preparation for students in Pakistan.",
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://proconsulting.uk/education/destinations/uk#breadcrumb",
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
          "name": "Destinations",
          "item": "https://proconsulting.uk/education/destinations",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "United Kingdom",
          "item": "https://proconsulting.uk/education/destinations/uk",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://proconsulting.uk/education/destinations/uk#faq",
      "mainEntity": UK_FAQS.map((faq) => ({
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
