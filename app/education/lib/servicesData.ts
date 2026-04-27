/**
 * Full content for each student service – used by services index and detail pages.
 */
export interface ServiceSection {
  heading: string;
  content: string;
  list?: string[];
}

export interface ServiceDetail {
  slug: string;
  title: string;
  tagline: string;
  shortDescription: string;
  metaDescription: string;
  sections: ServiceSection[];
  benefits?: string[];
  ctaHeading: string;
  ctaDescription: string;
}

export const servicesDetail: ServiceDetail[] = [
  {
    slug: "interview-prep",
    title: "Interview Preparation",
    tagline: "Build confidence and ace your university or visa interviews.",
    shortDescription:
      "Our professional trainers help you gain confidence, perfect your interview technique, and prepare for common questions so you present your best self.",
    metaDescription:
      "Expert interview preparation for university and visa interviews. Mock interviews, common questions, and personalised feedback from ProConsulting.",
    sections: [
      {
        heading: "What we offer",
        content:
          "Whether you're facing a university admissions interview or a visa/consulate interview, we prepare you for success. Our sessions are tailored to your destination country and institution.",
        list: [
          "One-on-one mock interviews with detailed feedback",
          "Coverage of common questions for UK, Australia, Canada, USA, and EU",
          "Visa and credibility interview preparation (CAS, GTE, study plans)",
          "Body language and communication tips",
          "Follow-up practice until you feel confident",
        ],
      },
      {
        heading: "How it works",
        content:
          "We start by understanding your profile and the type of interview you’ll face. You’ll then have structured practice sessions, with feedback and targeted improvement areas.",
        list: [
          "Initial assessment of your goals and interview type",
          "Structured mock interviews (in person or online)",
          "Written and verbal feedback with improvement points",
          "Optional extra sessions before your actual interview",
        ],
      },
      {
        heading: "Why choose us",
        content:
          "Our consultants have helped hundreds of students succeed in university and visa interviews. We know what panels look for and how to help you articulate your goals clearly.",
      },
    ],
    benefits: [
      "Experienced trainers familiar with top destinations",
      "Flexible scheduling (in person or online)",
      "Focused on your specific course and country",
    ],
    ctaHeading: "Ready to prepare for your interview?",
    ctaDescription: "Book a session with our team and get tailored feedback.",
  },
  {
    slug: "admission",
    title: "Admission Guidance",
    tagline: "Personalised support to get into your dream university and course.",
    shortDescription:
      "From choosing the right course and country to submitting a strong application, we guide you at every step so you can secure an offer from a top institution.",
    metaDescription:
      "End-to-end admission guidance: course and country selection, application strategy, and personal statement support. Trusted by students worldwide.",
    sections: [
      {
        heading: "What we offer",
        content:
          "Our admission counselling is designed to match you with the best-fit universities and programmes. We help you build a strong application and avoid common pitfalls.",
        list: [
          "Free initial consultation to understand your goals and profile",
          "Country and university shortlisting based on your budget and preferences",
          "Course selection and entry requirement checks",
          "Application strategy and timeline planning",
          "Personal statement / SOP review and improvement",
          "Reference and document checklist support",
          "Follow-up with universities and offer management",
        ],
      },
      {
        heading: "How it works",
        content:
          "We work with you from the first conversation until you hold an offer. You’ll have a dedicated point of contact and a clear timeline so you never miss a deadline.",
        list: [
          "Consultation and profile assessment",
          "Shortlist of universities and courses with entry requirements",
          "Document preparation and application submission",
          "Ongoing support until you receive decisions",
        ],
      },
      {
        heading: "Why choose us",
        content:
          "We are trusted representatives of 250+ universities. Our team has first-hand knowledge of entry requirements, deadlines, and what admissions offices look for in strong applications.",
      },
    ],
    benefits: [
      "Direct links with universities in the UK, Australia, Canada, USA, and Europe",
      "Transparent advice on fees, scholarships, and visas",
      "Dedicated counsellor for the full journey",
    ],
    ctaHeading: "Start your admission journey",
    ctaDescription: "Tell us your goals and we’ll recommend the best options for you.",
  },
  {
    slug: "visa",
    title: "Visa Processing",
    tagline: "Stress-free visa support from documents to submission and follow-up.",
    shortDescription:
      "We simplify the visa process with document preparation, application review, and submission support so you can focus on your studies instead of paperwork.",
    metaDescription:
      "Student visa processing for UK, Australia, Canada, USA, and more. Document preparation, application submission, and expert follow-up.",
    sections: [
      {
        heading: "What we offer",
        content:
          "Our visa team helps you prepare a complete, compliant application. We guide you through forms, financial evidence, and any additional requirements for your destination.",
        list: [
          "Document checklist tailored to your country and visa type",
          "Help with financial proof and sponsorship letters",
          "Form filling and application review before submission",
          "Appointment booking and submission support where applicable",
          "Preparation for credibility interviews (e.g. UK, Australia)",
          "Follow-up and tracking until a decision",
        ],
      },
      {
        heading: "How it works",
        content:
          "After you have an offer from a university, we take you through the visa process step by step. We ensure nothing is missed and that your application is presented in the best light.",
        list: [
          "Visa type and requirement briefing",
          "Document collection and verification",
          "Draft application review and corrections",
          "Submission and any interview preparation",
          "Post-submission support until outcome",
        ],
      },
      {
        heading: "Why choose us",
        content:
          "We understand the requirements of major study destinations and keep up with rule changes. Our aim is to reduce stress and improve the chances of a smooth, successful outcome.",
      },
    ],
    benefits: [
      "Experience with UK, Australia, Canada, USA, and Schengen student visas",
      "Clear checklist and timeline so you know what to provide",
      "Support in your language and time zone",
    ],
    ctaHeading: "Need help with your student visa?",
    ctaDescription: "Share your offer and destination and we’ll guide you through the process.",
  },
  {
    slug: "test-prep",
    title: "English Test Preparation",
    tagline: "Prepare for IELTS, PTE, TOEFL, and other English tests for study abroad.",
    shortDescription:
      "We offer focused preparation for the English tests required by universities in the UK, Australia, Canada, USA, and other top study destinations.",
    metaDescription:
      "IELTS, PTE, TOEFL and other English test preparation. Courses and coaching for students planning to study in the UK, Australia, Canada, and USA.",
    sections: [
      {
        heading: "What we offer",
        content:
          "Our test preparation is aimed at the scores you need for your chosen course and country. We cover all four skills and exam strategies so you can perform your best on the day.",
        list: [
          "Preparation for IELTS, PTE, TOEFL, and other recognised tests",
          "Structured practice for Listening, Reading, Writing, and Speaking",
          "Target score planning based on your university requirements",
          "Mock tests and timed practice under exam conditions",
          "Feedback on writing and speaking with improvement tips",
          "Flexible schedules (group or one-on-one, in person or online)",
        ],
      },
      {
        heading: "How it works",
        content:
          "We assess your current level and your target score, then design a plan that fits your timeline. You’ll get regular practice and feedback until you’re ready to book your test.",
        list: [
          "Level check and target score discussion",
          "Structured course or coaching plan",
          "Regular practice tests and skill-focused sessions",
          "Final mock and test-day tips",
        ],
      },
      {
        heading: "Why choose us",
        content:
          "Our trainers are familiar with the format and marking of major English tests. We focus on the skills that matter for university admission and visa requirements.",
      },
    ],
    benefits: [
      "Aligned with requirements for UK, Australia, Canada, and USA",
      "Flexible delivery to suit your schedule",
      "Practical focus on achieving your target band or score",
    ],
    ctaHeading: "Ready to reach your target score?",
    ctaDescription: "Get a study plan and start preparing with our expert trainers.",
  },
];

export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  return servicesDetail.find((s) => s.slug === slug);
}

export function getAllServiceSlugs(): string[] {
  return servicesDetail.map((s) => s.slug);
}
