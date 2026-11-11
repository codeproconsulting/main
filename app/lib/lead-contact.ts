// Formatting and the international dial-out prefix are ignored. Country codes stay explicit.
export function phoneKey(value: string) {
  const phone = value.normalize("NFKC").trim();
  if (!/^\+?[0-9\s().-]+$/.test(phone)) return "";
  const digits = phone.replace(/[^0-9]/g, "");
  const key = phone.startsWith("00") ? digits.slice(2) : digits;
  return /^[0-9]{7,15}$/.test(key) ? key : "";
}

export function emailKey(value: string) {
  return value.trim().toLowerCase();
}

export const leadServices = ["Education", "Immigration", "Study Abroad", "Visit Visa", "General Enquiry"];
