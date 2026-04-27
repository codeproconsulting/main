/**
 * Country calling codes: curated list with country name and short form (ISO).
 * Used for phone prefix dropdown; avoids API noise (cities/regions).
 */
export interface CountryCode {
  name: string;
  /** ISO 2-letter or common short form (UK, USA, PK, etc.) */
  short: string;
  /** Dial code with + */
  code: string;
}

/** Static list: country name, short form, dial code. Pakistan first (default). */
const COUNTRY_CODES: CountryCode[] = [
  { name: "Pakistan", short: "PK", code: "+92" },
  { name: "United Kingdom", short: "UK", code: "+44" },
  { name: "United States", short: "USA", code: "+1" },
  { name: "Canada", short: "CA", code: "+1" },
  { name: "Australia", short: "AU", code: "+61" },
  { name: "India", short: "IN", code: "+91" },
  { name: "Bangladesh", short: "BD", code: "+880" },
  { name: "Nigeria", short: "NG", code: "+234" },
  { name: "Saudi Arabia", short: "SA", code: "+966" },
  { name: "United Arab Emirates", short: "UAE", code: "+971" },
  { name: "Turkey", short: "TR", code: "+90" },
  { name: "Malaysia", short: "MY", code: "+60" },
  { name: "Ireland", short: "IE", code: "+353" },
  { name: "New Zealand", short: "NZ", code: "+64" },
  { name: "South Africa", short: "ZA", code: "+27" },
  { name: "Egypt", short: "EG", code: "+20" },
  { name: "China", short: "CN", code: "+86" },
  { name: "Japan", short: "JP", code: "+81" },
  { name: "Germany", short: "DE", code: "+49" },
  { name: "France", short: "FR", code: "+33" },
  { name: "Netherlands", short: "NL", code: "+31" },
  { name: "Italy", short: "IT", code: "+39" },
  { name: "Spain", short: "ES", code: "+34" },
  { name: "Poland", short: "PL", code: "+48" },
  { name: "Sweden", short: "SE", code: "+46" },
  { name: "Norway", short: "NO", code: "+47" },
  { name: "Denmark", short: "DK", code: "+45" },
  { name: "Finland", short: "FI", code: "+358" },
  { name: "Belgium", short: "BE", code: "+32" },
  { name: "Switzerland", short: "CH", code: "+41" },
  { name: "Austria", short: "AT", code: "+43" },
  { name: "Singapore", short: "SG", code: "+65" },
  { name: "Hong Kong", short: "HK", code: "+852" },
  { name: "South Korea", short: "KR", code: "+82" },
  { name: "Indonesia", short: "ID", code: "+62" },
  { name: "Thailand", short: "TH", code: "+66" },
  { name: "Philippines", short: "PH", code: "+63" },
  { name: "Vietnam", short: "VN", code: "+84" },
  { name: "Kenya", short: "KE", code: "+254" },
  { name: "Ghana", short: "GH", code: "+233" },
  { name: "Morocco", short: "MA", code: "+212" },
  { name: "Brazil", short: "BR", code: "+55" },
  { name: "Mexico", short: "MX", code: "+52" },
  { name: "Argentina", short: "AR", code: "+54" },
  { name: "Colombia", short: "CO", code: "+57" },
  { name: "Chile", short: "CL", code: "+56" },
  { name: "Russia", short: "RU", code: "+7" },
  { name: "Ukraine", short: "UA", code: "+380" },
  { name: "Kazakhstan", short: "KZ", code: "+7" },
  { name: "Israel", short: "IL", code: "+972" },
  { name: "Iran", short: "IR", code: "+98" },
  { name: "Iraq", short: "IQ", code: "+964" },
  { name: "Qatar", short: "QA", code: "+974" },
  { name: "Kuwait", short: "KW", code: "+965" },
  { name: "Bahrain", short: "BH", code: "+973" },
  { name: "Oman", short: "OM", code: "+968" },
  { name: "Jordan", short: "JO", code: "+962" },
  { name: "Lebanon", short: "LB", code: "+961" },
  { name: "Sri Lanka", short: "LK", code: "+94" },
  { name: "Nepal", short: "NP", code: "+977" },
  { name: "Afghanistan", short: "AF", code: "+93" },
];

export async function fetchCountryCallingCodes(): Promise<CountryCode[]> {
  return Promise.resolve(COUNTRY_CODES);
}
