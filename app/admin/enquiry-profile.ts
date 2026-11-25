const fields = [
 "city","currentEducation","majorSubject","gradeScore","passingYear","targetDegree","targetIntake",
 "budgetRange","needScholarship","englishTest","hasRefusal","studyGap","notes","message",
 "countryOfResidence","serviceType","blogSlug","blogTitle","enquiringAs","destination",
 "originPath","serviceContext",
];

export function enquiryFields(raw: string) {
 let parsed: unknown;
 try { parsed=JSON.parse(raw); } catch { return []; }
 if (!parsed || typeof parsed!=="object" || Array.isArray(parsed)) return [];
 const values=parsed as Record<string,unknown>;
 return fields.flatMap(key=>{
  const value=values[key];
  if (!["string","number","boolean"].includes(typeof value) || value===null || value===undefined) return [];
  const text=String(value).trim();
  return text ? [{key,label:key.replace(/([A-Z])/g," $1"),value:text.slice(0,key==="notes"||key==="message"?4000:1000)}] : [];
 });
}
