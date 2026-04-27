/**
 * University logos loaded from education.proconsulting.uk (same assets as education site).
 */

import { EDUCATION_ASSETS_BASE } from "./constants";

export interface University {
  number: number;
  image: string;
  name: string;
  website?: string;
  smallLogo?: boolean;
}

const data: { num: number; file: string; name: string; website: string; smallLogo?: boolean }[] = [
  { num: 1, file: "1 keele university.png", name: "Keele University", website: "https://www.keele.ac.uk", smallLogo: true },
  { num: 2, file: "2 university-of-greenwich.png", name: "University of Greenwich", website: "https://www.gre.ac.uk", smallLogo: true },
  { num: 3, file: "3 ulster.png", name: "Ulster University", website: "https://www.ulster.ac.uk", smallLogo: true },
  { num: 4, file: "4 birmingham city university.png", name: "Birmingham City University", website: "https://www.bcu.ac.uk", smallLogo: true },
  { num: 5, file: "5 middlesex university.png", name: "Middlesex University", website: "https://www.mdx.ac.uk", smallLogo: true },
  { num: 6, file: "6 brunel university london.png", name: "Brunel University London", website: "https://www.brunel.ac.uk", smallLogo: true },
  { num: 7, file: "7 university of hull.png", name: "University of Hull", website: "https://www.hull.ac.uk", smallLogo: true },
  { num: 8, file: "8 University_of_Roehampton.png", name: "University of Roehampton", website: "https://www.roehampton.ac.uk" },
  { num: 9, file: "9 University of East London.png", name: "University of East London", website: "https://www.uel.ac.uk" },
  { num: 10, file: "10 university of wolverhampton.png", name: "University of Wolverhampton", website: "https://www.wlv.ac.uk", smallLogo: true },
  { num: 11, file: "11 University of Chester.png", name: "University of Chester", website: "https://www.chester.ac.uk" },
  { num: 12, file: "12 de montfort university.png", name: "De Montfort University", website: "https://www.dmu.ac.uk", smallLogo: true },
  { num: 13, file: "13 PSL Universite Paris.png", name: "PSL University Paris", website: "https://www.psl.eu" },
  { num: 14, file: "14 Heidelberg University_(Ohio).png", name: "Heidelberg University", website: "https://www.uni-heidelberg.de" },
  { num: 15, file: "15 Karolinska_Institutet_seal.png", name: "Karolinska Institutet", website: "https://ki.se", smallLogo: true },
  { num: 16, file: "16 LMU_Muenchen_Logo.png", name: "LMU Munich", website: "https://www.lmu.de", smallLogo: true },
];

const base = EDUCATION_ASSETS_BASE.replace(/\/$/, "");

export const universitiesForHome: University[] = data.map(({ num, file, name, website, smallLogo }) => ({
  number: num,
  image: `${base}/universities/${encodeURIComponent(file)}`,
  name,
  website,
  smallLogo,
}));
