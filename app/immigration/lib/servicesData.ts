export type ServiceDetail = {
  slug: string;
  title: string;
  tag: string;
  metaDescription: string;
  tagline: string;
  description: string;
  sections: { heading: string; content: string; list?: string[] }[];
  benefits: string[];
  faqs: { question: string; answer: string }[];
};

export const services: ServiceDetail[] = [
  {
    slug: "visit-visa",
    title: "Visit Visa",
    tag: "Tourism • Business • Family",
    metaDescription:
      "Visit visa support for UK, USA, Canada, Australia, Schengen and more. Documents, application strategy, and submission guidance.",
    tagline:
      "Plan your trip with confidence — we help you prepare a strong visit visa application.",
    description:
      "Whether you’re travelling for tourism, business meetings, or to visit family, we guide you through eligibility, documentation, and a clear application narrative to reduce refusal risk.",
    sections: [
      {
        heading: "What we do",
        content:
          "We assess your profile, identify the right visit visa route, and help you build a complete file with consistent evidence.",
        list: [
          "Eligibility assessment and application strategy",
          "Document checklist tailored to your destination",
          "Cover letter / purpose of travel drafting",
          "Financial and ties documentation guidance",
          "Appointment readiness (where applicable)",
        ],
      },
      {
        heading: "Common refusal reasons we help avoid",
        content:
          "Many refusals happen due to unclear purpose, weak evidence of funds, or insufficient ties to return. We help you present your case clearly and consistently.",
        list: [
          "Unclear travel purpose or itinerary",
          "Weak financial evidence or unexplained deposits",
          "Insufficient home ties (job, family, assets)",
          "Inconsistent information across documents",
        ],
      },
    ],
    benefits: [
      "Clear, country-specific checklist",
      "Stronger supporting documents pack",
      "Reduced refusal risk through consistency",
      "End-to-end guidance until submission",
    ],
    faqs: [
      {
        question: "How early should I apply for a visit visa?",
        answer:
          "Ideally 4–8 weeks before travel. Some destinations (USA, Canada, Australia) can take longer during peak seasons. Applying early gives you room to gather correct documents and handle delays.",
      },
      {
        question: "Can I work on a visit visa?",
        answer:
          "No. Visit visas are generally for tourism, business meetings, or family visits. Paid work is not permitted. If you need to work, you should apply for the correct work route instead.",
      },
    ],
  },
  {
    slug: "family-reunion",
    title: "Family Reunion",
    tag: "Spouse • Partner • Dependants",
    metaDescription:
      "Family reunion and dependent visa guidance: eligibility, relationship evidence, documents and application preparation.",
    tagline:
      "Bring your family together — with clear eligibility checks and well-prepared evidence.",
    description:
      "Family routes depend heavily on relationship evidence and compliance with financial and suitability requirements. We help you prepare a complete and persuasive application.",
    sections: [
      {
        heading: "What we do",
        content:
          "We review eligibility, advise on required evidence, and help you build a strong relationship and financial document pack.",
        list: [
          "Eligibility review and route selection",
          "Relationship evidence planning and review",
          "Financial requirement guidance (where applicable)",
          "Document checklist and application structure",
        ],
      },
      {
        heading: "Evidence that matters",
        content:
          "Strong applications show a genuine relationship and a credible plan. We help you organise evidence so it’s easy to understand for the caseworker.",
        list: [
          "Relationship timeline and supporting proof",
          "Communication and cohabitation evidence (if applicable)",
          "Sponsor status and identity documents",
          "Accommodation and financial evidence",
        ],
      },
    ],
    benefits: [
      "Clear evidence plan (what to include vs avoid)",
      "Stronger relationship narrative",
      "Reduced risk from missing documents",
      "Guidance tailored to your route",
    ],
    faqs: [
      {
        question: "What counts as strong relationship evidence?",
        answer:
          "A clear relationship timeline supported by consistent evidence: photos, travel history, messages, shared finances, shared address (if applicable), and any official documents. Requirements vary by route and country.",
      },
      {
        question: "Can we apply if we have limited travel history?",
        answer:
          "Yes. We focus on other credible evidence and a clear explanation. The key is consistency and demonstrating a genuine relationship.",
      },
    ],
  },
  {
    slug: "immigration",
    title: "Immigration",
    tag: "Routes • Eligibility • Documents",
    metaDescription:
      "Immigration guidance for multiple routes: eligibility assessment, documentation strategy, and application support.",
    tagline:
      "Understand your options — we help you choose the right route and prepare correctly.",
    description:
      "Immigration applications can be complex. We help you understand requirements, build a solid document strategy, and prepare a complete application pack.",
    sections: [
      {
        heading: "How we help",
        content:
          "We start with your goals and background, then map the best route and requirements so you know exactly what’s needed.",
        list: [
          "Route comparison and eligibility assessment",
          "Document checklist and evidence planning",
          "Application form guidance and review",
          "Advice on timelines and next steps",
        ],
      },
    ],
    benefits: [
      "Clarity on the best route for your profile",
      "Country-specific document strategy",
      "Reduced mistakes and inconsistencies",
      "Professional guidance from start to submission",
    ],
    faqs: [
      {
        question: "How do I know which route is best for me?",
        answer:
          "We compare your eligibility across routes and explain the trade-offs (cost, processing time, evidence burden, risks). Then we recommend the most realistic path.",
      },
    ],
  },
  {
    slug: "visa-appeal",
    title: "Visa Appeal",
    tag: "Refusals • Reviews • Appeals",
    metaDescription:
      "Visa refusals: understand reasons, strengthen evidence, and proceed with appeal, administrative review, or reapplication where appropriate.",
    tagline:
      "If your visa was refused — we help you respond with a stronger strategy.",
    description:
      "Refusals can happen for many reasons. We review your refusal letter, identify weak points, and advise the best next step: appeal, review, or reapply with stronger evidence.",
    sections: [
      {
        heading: "Our process",
        content:
          "We start with your refusal letter and the submitted documents, then build the best path forward based on your destination’s options.",
        list: [
          "Refusal reason analysis",
          "Evidence gap checklist",
          "Strategy: appeal vs review vs reapply",
          "Drafting support for representations (where applicable)",
        ],
      },
    ],
    benefits: [
      "Clear explanation of refusal reasons",
      "Actionable evidence plan to address gaps",
      "Strategic next step recommendation",
      "Support preparing a stronger submission",
    ],
    faqs: [
      {
        question: "Should I appeal or reapply?",
        answer:
          "It depends on the destination and refusal reasons. Some countries allow appeal or administrative review; others are best handled by reapplying with stronger evidence. We advise based on your refusal letter and options.",
      },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  return services.find((s) => s.slug === slug);
}

export function getAllServiceSlugs(): string[] {
  return services.map((s) => s.slug);
}

