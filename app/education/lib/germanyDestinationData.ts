export interface GermanyFaqItem {
  id: number;
  q: string;
  a: string;
}

export interface GermanyOfficialSource {
  id: string;
  name: string;
  url: string;
  description: string;
}

export const GERMANY_SEO = {
  title: "Study in Germany from Pakistan | ProConsulting",
  metaDescription:
    "Explore study in Germany from Pakistan: academic eligibility, public and private university costs, application routes and funding evidence. Get a free assessment.",
  h1: "Study in Germany from Pakistan",
  canonicalUrl: "https://proconsulting.uk/education/destinations/germany",
  ctaText: "Get free Germany assessment",
  ctaHref: "/education/contact?destination=germany",
  lastReviewedDate: "18 October 2026",
};

export const GERMANY_FAQS: GermanyFaqItem[] = [
  {
    id: 1,
    q: "How do I start to study in Germany from Pakistan?",
    a: "Start with your qualifications, intended degree, subject, language evidence and budget. Check eligibility before shortlisting. Then confirm each university's application process and the Pakistan mission's current visa requirements.",
  },
  {
    id: 2,
    q: "Is university in Germany completely free?",
    a: "No. Many public programmes have no tuition, but semester contributions and living costs remain. Tuition exceptions include certain programmes, Baden-Württemberg and institutions in Bavaria. Private institutions can charge substantial tuition.",
  },
  {
    id: 3,
    q: "Does every Pakistani student need Studienkolleg?",
    a: "No. It depends on the qualification and study history, the recognised entry route and intended subject. Confirm your individual position using official guidance and the university rather than treating nationality alone as the answer.",
  },
  {
    id: 4,
    q: "Can I change subjects for a master's?",
    a: "Only where the programme's admission rules allow it. Many require a related first degree and relevant academic content. Compare your transcript with the exact prerequisites before paying application charges.",
  },
  {
    id: 5,
    q: "Must every application go through uni-assist?",
    a: "No. Universities may accept direct applications or use uni-assist for specified applicants. Some require a VPD followed by a separate university application. Read the programme's current instructions.",
  },
  {
    id: 6,
    q: "Can I apply without IELTS?",
    a: "Possibly, if the programme accepts another certificate or an applicable waiver. There is no Germany-wide IELTS exemption. Confirm both university language rules and the evidence required for your visa process.",
  },
  {
    id: 7,
    q: "Is blocked-account money a tuition fee?",
    a: "No. It is a form of living-cost funding evidence, with conditions on access. Tuition, semester contributions and provider charges are separate. Confirm the current amount and accepted alternatives with the mission.",
  },
  {
    id: 8,
    q: "Will part-time work cover everything?",
    a: "Do not build the plan on that assumption. Employment is uncertain and subject to applicable rules. Arrange credible funding first; a hoped-for job is not a substitute for required visa evidence.",
  },
  {
    id: 9,
    q: "Can parents join the assessment discussion?",
    a: "You can tell us that you would like a parent involved. Share the questions that matter most, particularly total costs and funding responsibilities. Do not submit another person's personal documents without their permission.",
  },
  {
    id: 10,
    q: "Does an assessment guarantee admission or a visa?",
    a: "No. It helps identify requirements and next steps. Universities decide admission, scholarship bodies decide awards and the responsible authorities decide visas. Ask for a written explanation of any paid support before proceeding.",
  },
];

export const GERMANY_OFFICIAL_SOURCES: GermanyOfficialSource[] = [
  {
    id: "S3",
    name: "DAAD Requirements Overview",
    url: "https://www.daad.de/en/studying-in-germany/requirements/overview/",
    description: "Official guide to higher education entrance qualifications, subject eligibility and Studienkolleg pathways.",
  },
  {
    id: "S4",
    name: "DAAD Admission Database",
    url: "https://www.daad.de/en/studying-in-germany/requirements/admission-database/",
    description: "Orientation tool to check how Pakistani qualifications (HSSC, A-Levels, Bachelor's) are evaluated for undergraduate entry.",
  },
  {
    id: "S5",
    name: "DAAD Living Costs & Finances",
    url: "https://www.daad.de/en/studying-in-germany/living-in-germany/finances/",
    description: "Overview of semester contributions, state tuition exceptions (Baden-Württemberg, Bavaria), and living costs.",
  },
  {
    id: "S6",
    name: "uni-assist Master's Guidelines",
    url: "https://www.uni-assist.de/en/how-to-apply/get-information/master/",
    description: "Official prerequisites for postgraduate entry, consecutive degree alignment and university-specific criteria.",
  },
  {
    id: "S7",
    name: "uni-assist VPD (Vorprüfungsdokumentation)",
    url: "https://www.uni-assist.de/en/how-to-apply/plan-your-application/vpd/",
    description: "Guidelines on preliminary review documentation required prior to submitting direct university applications.",
  },
  {
    id: "S8",
    name: "uni-assist Country Information: Pakistan",
    url: "https://www.uni-assist.de/en/tools/info-country-by-country/details-country/country/pk/",
    description: "Specific documentation guidelines for Pakistani school certificates, HEC degree attestations and grading scales.",
  },
  {
    id: "S9",
    name: "German Missions in Pakistan: Student Visa",
    url: "https://pakistan.diplo.de/pk-en/service/2-study-visa-seite-1676104",
    description: "Official visa requirements, Consular Services Portal procedures, and mandatory degree/transcript evidence.",
  },
  {
    id: "S10",
    name: "German Missions in Pakistan: Financing Requirements",
    url: "https://pakistan.diplo.de/pk-en/service/1995528-1995528",
    description: "Accepted financing proofs: blocked accounts (Sperrkonto), formal declaration of commitment (Verpflichtungserklärung), and official scholarships.",
  },
];

export const GERMANY_SCHEMA_GRAPH = {
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
      "@id": "https://proconsulting.uk/education/destinations/germany#service",
      "name": "Germany study application guidance",
      "serviceType": "Study abroad application guidance",
      "url": "https://proconsulting.uk/education/destinations/germany",
      "provider": { "@id": "https://proconsulting.uk/#organization" },
      "areaServed": { "@type": "Country", "name": "Pakistan" },
      "description":
        "Germany bachelor's and master's degree eligibility checks, funding planning, and student visa advisory for Pakistani students.",
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://proconsulting.uk/education/destinations/germany#breadcrumb",
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
          "name": "Germany",
          "item": "https://proconsulting.uk/education/destinations/germany",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://proconsulting.uk/education/destinations/germany#faq",
      "mainEntity": GERMANY_FAQS.map((faq) => ({
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
