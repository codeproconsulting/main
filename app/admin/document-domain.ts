export const documentCategories = [
  "Passport", "Transcript", "Degree certificate", "English test", "Financial evidence",
  "Visa decision", "Application form", "Other",
] as const;
export const documentStatuses = ["Pending review", "Accepted", "Needs replacement"] as const;
export const documentLimit = 20_000_000;

export type ClientDocument = {
  $id: string;
  leadId: string;
  fileId: string;
  name: string;
  mime: string;
  category: string;
  status: string;
  expiresAt: string;
  checksum: string;
  uploadedBy: string;
  scannedAt?: string;
  reviewVersion?: number;
  reviewNotes?: string;
};

export function expiryDay(value: string) {
  if (!value || !Number.isFinite(Date.parse(value))) return "";
  return new Date(Date.parse(value) + 5 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function documentState(doc: Pick<ClientDocument, "status" | "expiresAt" | "scannedAt">, now = Date.now()) {
  if (!doc.scannedAt) return "Scan required";
  if (doc.expiresAt && Date.parse(doc.expiresAt) <= now) return "Expired";
  return doc.status;
}
