/**
 * Universities from public/universities – proper names, image paths, and official website URLs.
 * smallLogo: true = logo graphic is small in the file.
 */
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
  { num: 17, file: "17 sapienza-university-of-rome.png", name: "Sapienza University of Rome", website: "https://www.uniroma1.it" },
  { num: 18, file: "18 university-of-amsterdam-logo-hd.png", name: "University of Amsterdam", website: "https://www.uva.nl" },
  { num: 19, file: "19 KU Leuven University.jpeg", name: "KU Leuven", website: "https://www.kuleuven.be" },
  { num: 20, file: "20 University-of-Padua-Logo-Vector.png", name: "University of Padua", website: "https://www.unipd.it" },
  { num: 21, file: "21 Alma mater studiorium universita di bologna.png", name: "University of Bologna", website: "https://www.unibo.it", smallLogo: true },
  { num: 22, file: "22 Logo_of_Sorbonne_University.png", name: "Sorbonne University", website: "https://www.sorbonne-universite.fr", smallLogo: true },
  { num: 23, file: "23 Aalto_University.png", name: "Aalto University", website: "https://www.aalto.fi", smallLogo: true },
  { num: 24, file: "24 University of OSLO.png", name: "University of Oslo", website: "https://www.uio.no", smallLogo: true },
  { num: 25, file: "25 Universität_Bon.png", name: "University of Bonn", website: "https://www.uni-bonn.de", smallLogo: true },
  { num: 26, file: "26 Tampere University.png", name: "Tampere University", website: "https://www.tuni.fi" },
  { num: 27, file: "27 University-of-Turku-Finland.png", name: "University of Turku", website: "https://www.utu.fi" },
  { num: 28, file: "28 Lut Universities.png", name: "LUT University", website: "https://www.lut.fi" },
  { num: 29, file: "29 AARHUS University.png", name: "Aarhus University", website: "https://www.au.dk" },
  { num: 30, file: "30 Universitat Budapest.png", name: "Eötvös Loránd University (ELTE)", website: "https://www.elte.hu" },
  { num: 31, file: "31 University of Debrecen.png", name: "University of Debrecen", website: "https://www.unideb.hu" },
  { num: 32, file: "32 ELTE_logo_new.svg", name: "Eötvös Loránd University (ELTE)", website: "https://www.elte.hu", smallLogo: true },
];

export const universities: University[] = data.map(({ num, file, name, website, smallLogo }) => ({
  number: num,
  image: `/universities/${encodeURIComponent(file)}`,
  name,
  website,
  smallLogo,
}));

/** Subset by number for home section carousel (first 16). */
export const universitiesForHome = universities.slice(0, 16);
