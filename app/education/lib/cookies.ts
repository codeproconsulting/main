/**
 * Cookie consent and tracking utilities.
 * Use these to respect user choice and enable tracking only when accepted.
 */

const CONSENT_COOKIE = "proconsulting_consent";
const CONSENT_EXPIRY_DAYS = 365;
const TRACKING_COOKIE = "proconsulting_session";
const TRACKING_EXPIRY_DAYS = 30;

export type ConsentStatus = "accepted" | "rejected" | null;

function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  // document.cookie formatting can be `a=1; b=2` OR `a=1;b=2` (no space after `;`)
  // so we must tolerate optional whitespace.
  const match = document.cookie.match(
    new RegExp(
      "(?:^|;\\s*)" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]*)"
    )
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Get the user's stored consent status.
 */
export function getConsent(): ConsentStatus {
  const raw = getCookie(CONSENT_COOKIE);
  if (raw === "accepted" || raw === "1") return "accepted";
  if (raw === "rejected" || raw === "0") return "rejected";
  return null;
}

/**
 * Save consent and, if accepted, set a first-party tracking/session cookie for analytics and better UX.
 */
export function setConsent(accepted: boolean): void {
  const value = accepted ? "accepted" : "rejected";
  setCookie(CONSENT_COOKIE, value, CONSENT_EXPIRY_DAYS);

  if (accepted) {
    const sessionId = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `s_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    setCookie(TRACKING_COOKIE, sessionId, TRACKING_EXPIRY_DAYS);
    if (typeof window !== "undefined") {
      (window as unknown as { __cookieConsent?: boolean }).__cookieConsent = true;
      window.dispatchEvent(new CustomEvent("cookieConsent", { detail: { accepted: true } }));
    }
  } else {
    setCookie(TRACKING_COOKIE, "", -1);
    if (typeof window !== "undefined") {
      (window as unknown as { __cookieConsent?: boolean }).__cookieConsent = false;
      window.dispatchEvent(new CustomEvent("cookieConsent", { detail: { accepted: false } }));
    }
  }
}

/**
 * Returns true if the user has accepted non-essential cookies (so tracking/analytics can run).
 */
export function hasTrackingConsent(): boolean {
  return getConsent() === "accepted";
}

/**
 * Get current session id if tracking is accepted; null otherwise.
 */
export function getSessionId(): string | null {
  if (getConsent() !== "accepted") return null;
  return getCookie(TRACKING_COOKIE);
}
