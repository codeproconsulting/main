import fs from "fs";
import path from "path";

export type Applicant = {
  id: string;
  createdAt: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  currentEducation: string;
  majorSubject: string;
  gradeScore: string;
  passingYear: string;
  targetCountry: string;
  targetDegree: string;
  targetIntake: string;
  budgetRange: string;
  needScholarship: string;
  englishTest: string;
  hasRefusal: string;
  studyGap: string;
  notes: string;
  status: "New" | "Contacted" | "In Review" | "Enrolled" | "Archived";
};

const DATA_FILE = path.join(process.cwd(), "data", "applicants.json");

function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

export function getApplicants(): Applicant[] {
  try {
    ensureDirectoryExistence(DATA_FILE);
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data) as Applicant[];
  } catch (error) {
    console.error("Failed to read applicants.json:", error);
    return [];
  }
}

export function saveApplicant(applicantData: Omit<Applicant, "id" | "createdAt" | "status"> & { id?: string }): Applicant {
  try {
    ensureDirectoryExistence(DATA_FILE);
    const applicants = getApplicants();
    const newApplicant: Applicant = {
      ...applicantData,
      id: applicantData.id || `PC-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      status: "New",
    };

    applicants.unshift(newApplicant);
    fs.writeFileSync(DATA_FILE, JSON.stringify(applicants, null, 2), "utf-8");
    return newApplicant;
  } catch (error) {
    console.error("Failed to save applicant:", error);
    throw error;
  }
}

export function updateApplicantStatus(id: string, status: Applicant["status"]): boolean {
  try {
    ensureDirectoryExistence(DATA_FILE);
    const applicants = getApplicants();
    const index = applicants.findIndex((a) => a.id === id);
    if (index === -1) return false;

    applicants[index].status = status;
    fs.writeFileSync(DATA_FILE, JSON.stringify(applicants, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Failed to update applicant status:", error);
    return false;
  }
}

export function deleteApplicant(id: string): boolean {
  try {
    ensureDirectoryExistence(DATA_FILE);
    const applicants = getApplicants();
    const filtered = applicants.filter((a) => a.id !== id);
    if (filtered.length === applicants.length) return false;

    fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Failed to delete applicant:", error);
    return false;
  }
}
