// Visit visa destinations.
// image: same paths as education site (copy from proconsulting_education/public/destinations/ into this app's public/destinations/).
// flagIcon: used when no image, and in navbar/destinations page.
export const destinations = [
  {
    id: "uk",
    name: "UK",
    slug: "uk",
    tag: "Standard Visitor Visa",
    description:
      "Prepare for your trip to the United Kingdom. Eligibility, supporting documents, and how to apply for your UK visit visa.",
    link: "/immigration/destinations/uk",
    flagIcon: "https://flagcdn.com/w40/gb.png",
    image: "/destinations/UK.webp",
  },
  {
    id: "canada",
    name: "Canada",
    slug: "canada",
    tag: "Single or Multiple Entry",
    description:
      "Discover Canada with a visit visa—whether for vacation, family, or business. Understand single-entry and multiple-entry options.",
    link: "/immigration/destinations/canada",
    flagIcon: "https://flagcdn.com/w40/ca.png",
    image: "/destinations/Canada.webp",
  },
  {
    id: "australia",
    name: "Australia",
    slug: "australia",
    tag: "Visitor stream",
    description:
      "Australia welcomes travellers for holiday, family visits, or business. Your first step to an unforgettable adventure.",
    link: "/immigration/destinations/australia",
    flagIcon: "https://flagcdn.com/w40/au.png",
    image: "/destinations/Australia.webp",
  },
  {
    id: "usa",
    name: "USA",
    slug: "usa",
    tag: "B-1/B-2",
    description:
      "Travel to the United States for tourism, business, or to visit family. We guide you through the application process.",
    link: "/immigration/destinations/usa",
    flagIcon: "https://flagcdn.com/w40/us.png",
    image: "/destinations/USA.webp",
  },
  {
    id: "europe",
    name: "Europe",
    slug: "europe",
    tag: "Schengen Area",
    description:
      "Explore Europe—iconic landmarks, culture, and business. Your gateway to the Schengen area.",
    link: "/immigration/destinations/europe",
    flagIcon: "https://flagcdn.com/w40/eu.png",
    image: "/destinations/Europe.webp",
  },
  {
    id: "sweden",
    name: "Sweden",
    slug: "sweden",
    tag: "Visit visa",
    description:
      "Visit Sweden for tourism, business, or family. We help you with Schengen visit visa requirements and application.",
    link: "/immigration/destinations/sweden",
    flagIcon: "https://flagcdn.com/w40/se.png",
    image: "/destinations/Sweden.webp",
  },
  {
    id: "france",
    name: "France",
    slug: "france",
    tag: "Schengen",
    description:
      "Travel to France for leisure, business, or family visits. Expert guidance on short-stay Schengen visa requirements.",
    link: "/immigration/destinations/france",
    flagIcon: "https://flagcdn.com/w40/fr.png",
    image: "/destinations/France.webp",
  },
  {
    id: "spain",
    name: "Spain",
    slug: "spain",
    tag: "Schengen",
    description:
      "Visit Spain for tourism, culture, or business. We guide you through the Schengen visa process for Spain.",
    link: "/immigration/destinations/spain",
    flagIcon: "https://flagcdn.com/w40/es.png",
    image: "/destinations/Spain.webp",
  },
  {
    id: "new-zealand",
    name: "New Zealand",
    slug: "new-zealand",
    tag: "Visitor visa",
    description:
      "Explore New Zealand—holiday, family, or business. We help you with visitor visa eligibility and application.",
    link: "/immigration/destinations/new-zealand",
    flagIcon: "https://flagcdn.com/w40/nz.png",
    image: "/destinations/new_zealand.webp",
  },
  {
    id: "ireland",
    name: "Ireland",
    slug: "ireland",
    tag: "Visit visa",
    description:
      "Visit Ireland for tourism, business, or family. Expert support for Irish visit visa requirements and applications.",
    link: "/immigration/destinations/ireland",
    flagIcon: "https://flagcdn.com/w40/ie.png",
    image: "/destinations/Ireland.webp",
  },
] as const;

// For navbar dropdown (first 8; same layout as education)
export const navbarDestinations = destinations.slice(0, 8).map((d) => ({
  id: d.id,
  name: d.name,
  tag: d.tag,
  link: d.link,
  flagIcon: d.flagIcon,
}));

/** Get destination by URL slug (e.g. "uk", "new-zealand"). */
export function getDestinationBySlug(slug: string): (typeof destinations)[number] | undefined {
  return destinations.find((d) => d.slug === slug);
}

/** All destination slugs for routes. */
export function getAllDestinationSlugs(): string[] {
  return destinations.map((d) => d.slug);
}

// Visa types and eligibility per destination (shown on destinations page like Canada)
export type DestinationDetail = {
  visaTypes: { title: string; description: string }[];
  eligibility: string[];
};

export const destinationDetails: Record<string, DestinationDetail> = {
  uk: {
    visaTypes: [
      {
        title: "Standard Visitor Visa",
        description:
          "For tourism, business, study (up to 6 months), or private medical treatment. Most common visit visa for the UK.",
      },
      {
        title: "Marriage / Civil Partnership visit",
        description:
          "For visiting the UK to get married or form a civil partnership. You must leave the UK after the ceremony.",
      },
    ],
    eligibility: [
      "Valid passport or travel document",
      "Proof of funds to support your stay and return",
      "Strong ties to your home country (job, family, property)",
      "Intent to leave the UK at the end of your visit",
      "No intention to work or claim public funds",
      "Meet suitability requirements (character, immigration history)",
    ],
  },
  canada: {
    visaTypes: [
      {
        title: "Single-Entry Visa",
        description:
          "Allows one entry into Canada. After you leave, you need a new visa to return.",
      },
      {
        title: "Multiple-Entry Visa",
        description:
          "Enter and leave Canada multiple times during the validity period—up to ten years or one month before your passport expires, whichever comes first.",
      },
    ],
    eligibility: [
      "Valid passport",
      "Good health",
      "No criminal or immigration-related convictions",
      "Ties to your home country (job, home, assets, or family)",
      "Intent to leave Canada at the end of your visit",
      "Enough money for your stay (varies by length and accommodation)",
    ],
  },
  australia: {
    visaTypes: [
      {
        title: "Tourist stream (subclass 600)",
        description:
          "For holidays, recreation, or visiting family and friends. Usually up to 3, 6, or 12 months.",
      },
      {
        title: "Business Visitor stream",
        description:
          "For business meetings, conferences, or negotiations. No work in Australia.",
      },
      {
        title: "Sponsored Family stream",
        description:
          "When an Australian citizen or permanent resident sponsors your visit.",
      },
    ],
    eligibility: [
      "Genuine temporary entrant (intent to leave after stay)",
      "Adequate funds for stay and onward travel",
      "Meet health and character requirements",
      "No work (unless permitted under your visa stream)",
      "Valid passport with sufficient validity",
    ],
  },
  usa: {
    visaTypes: [
      {
        title: "B-1 (Business)",
        description:
          "For business activities such as meetings, conferences, negotiations, or training. No employment or paid work in the US.",
      },
      {
        title: "B-2 (Tourism / Pleasure)",
        description:
          "For tourism, holiday, visiting family or friends, medical treatment, or short recreational courses.",
      },
    ],
    eligibility: [
      "Valid passport (valid for at least 6 months beyond stay)",
      "Non-immigrant intent—you must show you will return home",
      "Strong ties to your home country (job, family, property)",
      "Sufficient funds to cover your trip",
      "No ineligibilities (e.g. certain immigration or criminal history)",
      "Purpose of visit must be clear and permitted under B-1/B-2",
    ],
  },
  europe: {
    visaTypes: [
      {
        title: "Short-stay Schengen (Type C)",
        description:
          "Allows stays of up to 90 days in any 180-day period across the Schengen area. Apply at the embassy of your main destination or first entry.",
      },
      {
        title: "Single vs multiple entry",
        description:
          "Single entry: one stay. Multiple entry: travel in and out of Schengen within the visa validity. Long-term multi-entry (e.g. 1–5 years) may be available for frequent travellers.",
      },
    ],
    eligibility: [
      "Valid passport (valid at least 3 months after intended departure, issued in last 10 years)",
      "Proof of purpose of visit (tourism, business, family, etc.)",
      "Evidence of accommodation and travel itinerary",
      "Sufficient means of subsistence for the stay",
      "Travel medical insurance (min coverage typically €30,000) for the Schengen area",
      "No threat to public policy, security, or international relations",
    ],
  },
  sweden: {
    visaTypes: [
      {
        title: "Schengen short-stay visa",
        description:
          "Apply for a Schengen visa through the Swedish embassy/consulate if Sweden is your main destination or first entry. Up to 90 days in 180 days across Schengen.",
      },
    ],
    eligibility: [
      "Valid passport meeting Schengen requirements",
      "Proof of purpose (tourism, business, family visit)",
      "Accommodation and travel plans",
      "Sufficient funds for the stay",
      "Travel health insurance covering the Schengen area",
      "Intent to leave before the visa expires",
    ],
  },
  france: {
    visaTypes: [
      {
        title: "Schengen short-stay visa",
        description:
          "Apply at the French embassy/consulate if France is your main destination. Allows stays up to 90 days in 180 days in France and other Schengen countries.",
      },
    ],
    eligibility: [
      "Valid passport (Schengen rules)",
      "Proof of travel purpose and itinerary",
      "Accommodation proof",
      "Means of subsistence",
      "Schengen travel insurance",
      "No threat to public order, security, or international relations",
    ],
  },
  spain: {
    visaTypes: [
      {
        title: "Schengen short-stay visa",
        description:
          "Apply at the Spanish embassy/consulate if Spain is your main destination or first entry. Up to 90 days in 180 days in the Schengen area.",
      },
    ],
    eligibility: [
      "Valid passport meeting Schengen criteria",
      "Purpose of visit and itinerary",
      "Accommodation and transport",
      "Sufficient financial means",
      "Travel medical insurance for Schengen",
      "Return intent and no threat to public policy",
    ],
  },
  "new-zealand": {
    visaTypes: [
      {
        title: "General Visitor Visa",
        description:
          "For holiday, visiting family or friends, or short business visits. Stay usually up to 9 months (or 6 months if from visa-waiver country).",
      },
      {
        title: "Business Visitor",
        description:
          "For business meetings, conferences, or negotiations. No work for a New Zealand employer.",
      },
    ],
    eligibility: [
      "Genuine intention to visit and leave New Zealand",
      "Sufficient funds for stay and onward travel",
      "Good character and health (may need medical or character checks for longer stays)",
      "Valid passport",
      "No work (unless allowed under your visa conditions)",
    ],
  },
  ireland: {
    visaTypes: [
      {
        title: "Short-stay (visit) visa",
        description:
          "Ireland is not in Schengen. Apply for an Irish visit visa for tourism, business, or family visits. Typically allows stays up to 90 days.",
      },
    ],
    eligibility: [
      "Valid passport",
      "Proof of purpose of visit",
      "Evidence of accommodation and funds",
      "Intent to leave Ireland after your stay",
      "No prohibition on entry (e.g. immigration or criminal grounds)",
      "Return ties to your home country",
    ],
  },
};

// FAQs per destination (shown on each country's destination page)
export type DestinationFAQ = { question: string; answer: string };

export const destinationFaqs: Record<string, DestinationFAQ[]> = {
  uk: [
    {
      question: "How long can I stay in the UK on a Standard Visitor Visa?",
      answer:
        "Usually up to 6 months. For some reasons (e.g. private medical treatment) you may apply for longer. You must leave before your visa expires.",
    },
    {
      question: "Can I extend my UK visit visa?",
      answer:
        "You can apply to extend from inside the UK in limited cases (e.g. medical treatment). For tourism or business you normally need to leave and reapply from abroad.",
    },
    {
      question: "Do I need a visa to transit through the UK?",
      answer:
        "It depends on your nationality and whether you need to pass through border control. Some nationals need a Direct Airside Transit Visa or a Visitor in Transit visa. We can advise for your situation.",
    },
  ],
  canada: [
    {
      question: "What is the difference between single-entry and multiple-entry Canadian visit visas?",
      answer:
        "Single-entry allows one entry; once you leave you need a new visa to return. Multiple-entry lets you enter and leave multiple times during the validity period, often up to 10 years or until passport expiry.",
    },
    {
      question: "How long can I stay in Canada per visit?",
      answer:
        "Usually up to 6 months per entry. The officer at the border may allow less. For longer stays you may need to apply for an extension from inside Canada.",
    },
    {
      question: "Can I work or study on a Canadian visitor visa?",
      answer:
        "No. A visitor visa is for tourism, family visits, or business meetings. For work or study you need a work or study permit.",
    },
  ],
  australia: [
    {
      question: "What is the difference between the Tourist stream and Business Visitor stream?",
      answer:
        "Tourist stream is for holidays and visiting family/friends. Business Visitor stream is for business meetings, conferences, or negotiations—no work for an Australian employer.",
    },
    {
      question: "How long does an Australian visitor visa take to process?",
      answer:
        "Processing times vary; often 2–4 weeks but can be longer during busy periods. We help you submit a complete application to reduce delays.",
    },
    {
      question: "Can I extend my stay in Australia on a visitor visa?",
      answer:
        "You may apply for another visitor visa before your current one expires. You must meet eligibility again and explain why you need more time.",
    },
  ],
  usa: [
    {
      question: "What is the difference between B-1 and B-2 visas?",
      answer:
        "B-1 is for business (meetings, conferences, negotiations); B-2 is for tourism, holiday, visiting family, or medical treatment. Many applicants receive a combined B-1/B-2 visa.",
    },
    {
      question: "How long can I stay in the USA on a B-2 visa?",
      answer:
        "The officer at the border decides your length of stay, typically up to 6 months. You must leave before the date stamped on your I-94.",
    },
    {
      question: "Do I need to attend an interview for a US visit visa?",
      answer:
        "Most applicants aged 14–79 must attend an in-person interview at the US embassy or consulate. There are limited exceptions (e.g. renewals in some cases).",
    },
  ],
  europe: [
    {
      question: "How long can I stay in the Schengen area on a short-stay visa?",
      answer:
        "Up to 90 days within any 180-day period across the whole Schengen area. The 180 days is rolling, not a fixed calendar period.",
    },
    {
      question: "Which country should I apply to for a Schengen visa?",
      answer:
        "Apply to the country that is your main destination (longest stay), or the country of first entry if stays are equal. We help you decide and prepare the right application.",
    },
    {
      question: "Can I visit the UK or Ireland with a Schengen visa?",
      answer:
        "No. The UK and Ireland are not in Schengen. You need a separate visa for each. A Schengen visa only covers the Schengen member countries.",
    },
  ],
  sweden: [
    {
      question: "Do I need a visa to visit Sweden?",
      answer:
        "It depends on your nationality. Many non-EU nationals need a Schengen short-stay visa. Apply at the Swedish embassy/consulate if Sweden is your main destination.",
    },
    {
      question: "How long can I stay in Sweden on a Schengen visa?",
      answer:
        "Up to 90 days in any 180-day period across the whole Schengen area, not just Sweden.",
    },
  ],
  france: [
    {
      question: "How do I apply for a France visit visa?",
      answer:
        "Apply at the French embassy or consulate (or their visa centre) in your country of residence if France is your main destination. You may need to book an appointment and provide biometrics.",
    },
    {
      question: "Can I use a French Schengen visa to visit other European countries?",
      answer:
        "Yes. A Schengen visa issued by France allows travel to all Schengen countries within the validity and 90/180-day rule.",
    },
  ],
  spain: [
    {
      question: "Where do I apply for a Spain visit visa?",
      answer:
        "At the Spanish embassy or consulate (or their designated visa centre) if Spain is your main destination or first port of entry in Schengen.",
    },
    {
      question: "How long is a Spain Schengen visa valid?",
      answer:
        "Validity varies; it can be single or multiple entry. You can still only stay 90 days in any 180-day period in the Schengen area.",
    },
  ],
  "new-zealand": [
    {
      question: "Do I need a visa to visit New Zealand?",
      answer:
        "It depends on your nationality. Many nationals need a visitor visa. Visa-waiver countries may get a visa on arrival or an NZeTA. We can check for your passport.",
    },
    {
      question: "How long can I stay in New Zealand as a visitor?",
      answer:
        "Usually up to 9 months in an 18-month period for most visitor visas; some get 6 months. Conditions are on your visa.",
    },
  ],
  ireland: [
    {
      question: "Is Ireland part of Schengen?",
      answer:
        "No. Ireland is not in the Schengen area. You need a separate Irish visit visa; a Schengen visa does not allow entry to Ireland.",
    },
    {
      question: "How long can I stay in Ireland on a visit visa?",
      answer:
        "Typically up to 90 days. The exact period is stated on your visa. You must leave before it expires.",
    },
  ],
};
