export interface IrelandFaqItem {
  id: number;
  q: string;
  a: string;
}

export const IRELAND_SEO = {
  title: "Study in Ireland | ProConsulting",
  metaDescription:
    "Compare Irish courses, eligible programmes, housing costs, funding and student visa steps. Get a free Ireland assessment with ProConsulting.",
  h1: "Study in Ireland",
  canonicalUrl: "https://proconsulting.uk/education/destinations/study-in-ireland",
  ctaText: "Get free Ireland assessment",
  ctaHref: "/education/contact?destination=ireland",
  lastReviewedDate: "21 October 2026",
};

export const IRELAND_FAQS: IrelandFaqItem[] = [
  {
    id: 1,
    q: "How do I check whether my course is eligible?",
    a: "Check the exact programme against the relevant ILEP and TrustEd Ireland lists. Current immigration guidance tells applicants to check both.",
  },
  {
    id: 2,
    q: "Is a placement guaranteed?",
    a: "Not unless the provider gives clear terms that support that claim. Ask whether placements are required, optional or competitive.",
  },
  {
    id: 3,
    q: "Does paying tuition guarantee a visa?",
    a: "No. Payment and admission do not replace the separate immigration assessment. Check the relevant evidence and refund terms before paying.",
  },
  {
    id: 4,
    q: "Can a scholarship cover the whole course?",
    a: "Only the award terms can answer that. Check the covered costs, duration and renewal conditions before relying on it.",
  },
  {
    id: 5,
    q: "Can I pay my expenses through student work?",
    a: "Do not plan on that basis. Job availability, study demands and permission conditions can limit earnings.",
  },
  {
    id: 6,
    q: "Can I stay after graduation?",
    a: "A graduate route has separate eligibility rules. Confirm your qualification and immigration position before treating it as part of your plan.",
  },
  {
    id: 7,
    q: "Can I bring my family?",
    a: "Do not assume so. Eligibility depends on your circumstances and the relevant route. Resolve this before booking family travel.",
  },
  {
    id: 8,
    q: "Does an Irish degree let me work anywhere in the EU?",
    a: "No general right follows from the degree. Professional recognition and immigration permission must be checked for the country where you want to work.",
  },
];

export const IRELAND_SCHEMA_GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://proconsulting.uk/education/destinations/study-in-ireland#webpage",
      "url": "https://proconsulting.uk/education/destinations/study-in-ireland",
      "name": IRELAND_SEO.title,
      "description": IRELAND_SEO.metaDescription,
      "inLanguage": "en",
      "isPartOf": {
        "@type": "WebSite",
        "@id": "https://proconsulting.uk/#website",
        "name": "ProConsulting",
        "url": "https://proconsulting.uk",
      },
      "mainEntity": {
        "@id": "https://proconsulting.uk/education/destinations/study-in-ireland#service",
      },
      "breadcrumb": {
        "@id": "https://proconsulting.uk/education/destinations/study-in-ireland#breadcrumb",
      },
    },
    {
      "@type": "Service",
      "@id": "https://proconsulting.uk/education/destinations/study-in-ireland#service",
      "name": "Study in Ireland guidance",
      "url": "https://proconsulting.uk/education/destinations/study-in-ireland",
      "serviceType": "Education consultancy",
      "areaServed": "Pakistan",
      "provider": {
        "@type": "Organization",
        "@id": "https://proconsulting.uk/#organization",
        "name": "ProConsulting",
        "url": "https://proconsulting.uk",
      },
      "description": IRELAND_SEO.metaDescription,
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://proconsulting.uk/education/destinations/study-in-ireland#breadcrumb",
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
          "name": "Study in Ireland",
          "item": "https://proconsulting.uk/education/destinations/study-in-ireland",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://proconsulting.uk/education/destinations/study-in-ireland#faq",
      "mainEntity": IRELAND_FAQS.map((faq) => ({
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
