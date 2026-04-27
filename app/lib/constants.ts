export const EDUCATION_URL = "/education";
export const IMMIGRATION_URL = "/immigration";

/** Education site base URL for assets (merged into public/) */
export const EDUCATION_ASSETS_BASE = "";

export const BRAND = {
  navy: "#0B1B3A",
  pink: "#FF4D6D",
  pinkDark: "#E11D48",
  gold: "#C9A84C",
} as const;

export const CONTACT = {
  email: "contact@proconsulting.uk",
  phonePK: "(051) 6135834",
  phonePK2: "+92 370 1902123",
  phoneUK: "+44 7432 406993",
  whatsapp: "+447432406993",
  address: "Vista Building, 2nd Floor, Office No 203-204, I-8 Markaz, Islamabad, Pakistan",
  addressShort: "Office No 203-204, Vista Building, 2nd Floor, I-8 Markaz, Islamabad",
} as const;

export const SOCIAL = {
  facebook: "https://www.facebook.com/proconsultinguk",
  instagram: "https://www.instagram.com/pro_consulting1/",
  linkedin: "https://www.linkedin.com/company/proconsultinguk",
  whatsapp: "https://wa.me/447432406993",
} as const;

export const STATS = [
  { number: "2000", label: "Assessments Done", suffix: "+" },
  { number: "700", label: "Cases Completed", suffix: "+" },
  { number: "500", label: "Visas Granted", suffix: "+" },
  { number: "500", label: "Satisfied Students", suffix: "+" },
] as const;
