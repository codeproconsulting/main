export interface ItalyFaqItem {
  id: number;
  q: string;
  a: string;
}

export interface ItalyOfficialSource {
  id: string;
  name: string;
  url: string;
  description: string;
}

export const ITALY_SEO = {
  title: "Study in Italy | ProConsulting",
  metaDescription:
    "Plan to study in Italy with guidance on university admissions, regional scholarships, documents, Universitaly and visa preparation. Get a free assessment.",
  h1: "Study in Italy",
  canonicalUrl: "https://proconsulting.uk/education/destinations/study-in-italy",
  ctaText: "Get free Italy assessment",
  ctaHref: "/education/contact?destination=italy",
  lastReviewedDate: "18 October 2026",
};

export const ITALY_FAQS: ItalyFaqItem[] = [
  {
    id: 1,
    q: "Can Pakistani students study in Italy in English?",
    a: "Yes, English-taught programmes are available, but the course must match your qualifications and subject background. Check the institution’s current entry criteria and language evidence requirements. An English programme title does not mean every applicant can enter without a test or other proof.",
  },
  {
    id: 2,
    q: "Is a DSU scholarship guaranteed for Pakistani students?",
    a: "No. Regional benefits have their own eligibility rules, documents and deadlines. The term “DSU” does not create a universal entitlement. Read the relevant call and distinguish eligibility, award status, accommodation availability and actual payment.",
  },
  {
    id: 3,
    q: "Does university admission include a scholarship?",
    a: "Not automatically. Admission and regional benefits are separate processes. A university may also have its own scholarships, with different rules. Check what you have actually received rather than treating an offer letter as a funding commitment.",
  },
  {
    id: 4,
    q: "Does Universitaly approval guarantee my visa?",
    a: "No. University validation of pre-enrolment supports the procedure but does not guarantee a visa appointment or visa. The competent Italian diplomatic or consular authority assesses the visa application independently.",
  },
  {
    id: 5,
    q: "Which family financial documents will I need?",
    a: "The regional call determines the required household, income and asset evidence, reference periods and submission method. Documents issued abroad may need translation and legalisation or an accepted alternative. Your checklist must match your circumstances and the body receiving it.",
  },
  {
    id: 6,
    q: "Do all students need CIMEA or a Declaration of Value?",
    a: "No universal rule makes both compulsory for everyone. The university evaluates foreign qualifications and specifies its requirements; other authorities may have their own instructions. Confirm what is required for your case before ordering either service.",
  },
  {
    id: 7,
    q: "Can I travel before scholarship money arrives?",
    a: "Do not assume an award will fund departure or your first expenses. Confirm payment conditions and prepare accessible funds for costs due beforehand. Any visa financial evidence must meet the competent authority’s current requirements.",
  },
  {
    id: 8,
    q: "Can I study in Italy without IELTS?",
    a: "Possibly, where the selected programme accepts another form of evidence or an exemption. Requirements are course-specific. A medium-of-instruction letter is not accepted everywhere, and university language rules should not be confused with visa instructions.",
  },
  {
    id: 9,
    q: "How much does ProConsulting charge?",
    a: "The initial Italy assessment is free. If you want further assistance, request a written scope and fee quotation. Check third-party charges separately and ask about cancellation and refund terms before paying. No published package price is promised here.",
  },
  {
    id: 10,
    q: "Can I apply without a consultant?",
    a: "Yes. Official university, scholarship and Universitaly processes can be used directly. Optional guidance may help you organise requirements, but it does not change who decides your application. Never pay anyone claiming they can guarantee an award or bypass official checks.",
  },
];

export const ITALY_OFFICIAL_SOURCES: ItalyOfficialSource[] = [
  {
    id: "S5",
    name: "Universitaly: International Student Procedures",
    url: "https://www.universitaly.it/it/studenti-stranieri",
    description: "Official pre-enrolment portal guidelines separating university academic validation from consular visa processing.",
  },
  {
    id: "S6",
    name: "Study in Italy: Enrolment Procedures",
    url: "https://studyinitaly.esteri.it/Static/ProcedureIscrizione",
    description: "Official procedures for international student enrolment, institution deadlines, and qualification evaluation guidance.",
  },
  {
    id: "S7",
    name: "Study in Italy: Student Visa Guidance",
    url: "https://studyinitaly.esteri.it/Static/Visto",
    description: "Official visa overview detailing the competent Italian diplomatic mission checks and financial evidence requirements.",
  },
  {
    id: "S8",
    name: "Italian Embassy Islamabad: Visa Services",
    url: "https://ambislamabad.esteri.it/en/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/visti/",
    description: "Consular information for Pakistani residents regarding long-stay study visa selection and official appointment channels.",
  },
  {
    id: "S10",
    name: "DSU Toscana: Regional Scholarship Calls",
    url: "https://www.dsu.toscana.it/borsa-di-studio",
    description: "Regional student support specifications detailing economic evaluation, merit criteria, accommodation quotas and payment instalments.",
  },
  {
    id: "S11",
    name: "ER.GO: International Student Guidance",
    url: "https://www.er-go.it/international-students",
    description: "Emilia-Romagna regional authority guidelines on foreign household income/assets documentation, translations and legalisations.",
  },
];

export const ITALY_SCHEMA_GRAPH = {
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
      "@id": "https://proconsulting.uk/education/destinations/italy#service",
      "name": "Italy study-abroad guidance",
      "serviceType": "Study abroad consultancy",
      "url": "https://proconsulting.uk/education/destinations/italy",
      "provider": { "@id": "https://proconsulting.uk/#organization" },
      "areaServed": { "@type": "Country", "name": "Pakistan" },
      "description":
        "Plan study in Italy from Pakistan with guidance on university admission, regional scholarships, documents, budgets and visa steps.",
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://proconsulting.uk/education/destinations/italy#breadcrumb",
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
          "name": "Italy",
          "item": "https://proconsulting.uk/education/destinations/italy",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://proconsulting.uk/education/destinations/italy#faq",
      "mainEntity": ITALY_FAQS.map((faq) => ({
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
