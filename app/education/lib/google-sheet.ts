/**
 * Google Apps Script Web App URL for the contact form.
 * Set VITE_GOOGLE_SHEET_SCRIPT_URL in .env to your script's "exec" URL.
 * When not set, form still works but submissions are not sent to a sheet.
 */
export const GOOGLE_SHEET_SCRIPT_URL = (
  import.meta.env.VITE_GOOGLE_SHEET_SCRIPT_URL ?? ""
).trim();
