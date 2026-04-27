import type { LucideIcon } from "lucide-react";
import {
  Cpu,
  Wrench,
  Heart,
  Scale,
  ClipboardList,
  UtensilsCrossed,
  Calculator,
  Users,
  Globe,
  FlaskConical,
  Palette,
  GraduationCap,
  Building2,
  Leaf,
  Radio,
} from "lucide-react";

export interface Course {
  id: number;
  name: string;
  description: string;
  slug: string;
  icon: LucideIcon;
}

export const courses: Course[] = [
  {
    id: 1,
    name: "Computer Science & Data Science",
    description: "AI, Cybersecurity, Cloud Computing",
    slug: "computer-science-data-science",
    icon: Cpu,
  },
  {
    id: 2,
    name: "Engineering & Technology",
    description: "Civil, Mechanical, Electrical, Software, IT",
    slug: "engineering-technology",
    icon: Wrench,
  },
  {
    id: 3,
    name: "Health & Medicine",
    description: "MBBS, Nursing, Pharmacy, Public Health",
    slug: "health-medicine",
    icon: Heart,
  },
  {
    id: 4,
    name: "Law & Legal Studies",
    description: "International Law, Human Rights Law, Commercial Law",
    slug: "law-legal-studies",
    icon: Scale,
  },
  {
    id: 5,
    name: "Project Management",
    description: "Agile, PMP, and strategic project delivery",
    slug: "project-management",
    icon: ClipboardList,
  },
  {
    id: 6,
    name: "Hospitality & Tourism Management",
    description: "Hotel management, tourism, and events",
    slug: "hospitality-tourism",
    icon: UtensilsCrossed,
  },
  {
    id: 7,
    name: "Finance & Accounting",
    description: "Corporate finance, auditing, and accounting",
    slug: "finance-accounting",
    icon: Calculator,
  },
  {
    id: 8,
    name: "Social Sciences",
    description: "Psychology, Sociology, International Relations",
    slug: "social-sciences",
    icon: Users,
  },
  {
    id: 15,
    name: "Sociology",
    description: "Society, culture, social research, and policy",
    slug: "sociology",
    icon: Users,
  },
  {
    id: 16,
    name: "International Relations",
    description: "Global politics, diplomacy, security, and development",
    slug: "international-relations",
    icon: Globe,
  },
  {
    id: 9,
    name: "Natural & Applied Sciences",
    description: "Biotechnology, Physics, Chemistry, Mathematics",
    slug: "natural-applied-sciences",
    icon: FlaskConical,
  },
  {
    id: 10,
    name: "Arts & Humanities",
    description: "Design, History, Literature, Media Studies",
    slug: "arts-humanities",
    icon: Palette,
  },
  {
    id: 11,
    name: "Education & Teaching",
    description: "TESOL, Early Childhood Education",
    slug: "education-teaching",
    icon: GraduationCap,
  },
  {
    id: 12,
    name: "Architecture & Urban Planning",
    description: "Design, sustainability, and urban development",
    slug: "architecture-urban-planning",
    icon: Building2,
  },
  {
    id: 13,
    name: "Environmental Science & Sustainability",
    description: "Climate, conservation, and green technology",
    slug: "environmental-sustainability",
    icon: Leaf,
  },
  {
    id: 14,
    name: "Media & Communication Studies",
    description: "Journalism, Digital Media, PR",
    slug: "media-communication",
    icon: Radio,
  },
];

/** First 6 courses for the landing page "Popular" section */
export const popularCourses = courses.slice(0, 5);

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function getAllCourseSlugs(): string[] {
  return courses.map((c) => c.slug);
}
