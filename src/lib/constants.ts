export interface CountryPattern {
  name: string;
  code: string;
  dialCode: string;
  regex: RegExp;
  placeholder: string;
}

export const COUNTRY_PHONE_PATTERNS: Record<string, CountryPattern> = {
  CH: { name: "Switzerland", code: "CH", dialCode: "41", regex: /^(0041|\+41)?(0)?[1-9]\d{8}$/, placeholder: "79 123 45 67" },
  FR: { name: "France", code: "FR", dialCode: "33", regex: /^(0033|\+33)?(0)?[1-9]\d{8}$/, placeholder: "6 12 34 56 78" },
  BE: { name: "Belgium", code: "BE", dialCode: "32", regex: /^(0032|\+32)?(0)?[1-9]\d{8}$/, placeholder: "470 12 34 56" },
  CA: { name: "Canada", code: "CA", dialCode: "1", regex: /^(001|\+1)?[2-9]\d{2}[2-9]\d{6}$/, placeholder: "416 555 0199" },
  US: { name: "USA", code: "US", dialCode: "1", regex: /^(001|\+1)?[2-9]\d{2}[2-9]\d{6}$/, placeholder: "202 555 0143" },
  GB: { name: "UK", code: "GB", dialCode: "44", regex: /^(0044|\+44)?(0)?[1-9]\d{9}$/, placeholder: "7911 123456" },
  DE: { name: "Germany", code: "DE", dialCode: "49", regex: /^(0049|\+49)?(0)?[1-9]\d{9,11}$/, placeholder: "151 12345678" },
  ES: { name: "Spain", code: "ES", dialCode: "34", regex: /^(0034|\+34)?[679]\d{8}$/, placeholder: "612 345 678" },
  IT: { name: "Italy", code: "IT", dialCode: "39", regex: /^(0039|\+39)?[37]\d{8,11}$/, placeholder: "312 345 6789" },
  NL: { name: "Netherlands", code: "NL", dialCode: "31", regex: /^(0031|\+31)?(0)?6\d{8}$/, placeholder: "6 12345678" },
  SE: { name: "Sweden", code: "SE", dialCode: "46", regex: /^(0046|\+46)?(0)?[1-9]\d{8}$/, placeholder: "70 123 45 67" },
  AU: { name: "Australia", code: "AU", dialCode: "61", regex: /^(0061|\+61)?(0)?4\d{8}$/, placeholder: "412 345 678" },
  IN: { name: "India", code: "IN", dialCode: "91", regex: /^(0091|\+91)?[6789]\d{9}$/, placeholder: "98765 43210" },
  AE: { name: "UAE", code: "AE", dialCode: "971", regex: /^(00971|\+971)?(0)?5\d{8}$/, placeholder: "50 123 4567" },
  SG: { name: "Singapore", code: "SG", dialCode: "65", regex: /^(0065|\+65)?[89]\d{7}$/, placeholder: "8123 4567" },
  ZA: { name: "South Africa", code: "ZA", dialCode: "27", regex: /^(0027|\+27)?(0)?[1-9]\d{8}$/, placeholder: "82 123 4567" },
  BR: { name: "Brazil", code: "BR", dialCode: "55", regex: /^(0055|\+55)?(0)?[1-9]\d{9,10}$/, placeholder: "11 98765-4321" },
  MX: { name: "Mexico", code: "MX", dialCode: "52", regex: /^(0052|\+52)?[1-9]\d{9}$/, placeholder: "55 1234 5678" },
  JP: { name: "Japan", code: "JP", dialCode: "81", regex: /^(0081|\+81)?(0)?[789]0\d{8}$/, placeholder: "90 1234 5678" },
  CY: { name: "Cyprus", code: "CY", dialCode: "357", regex: /^(00357|\+357)?[9]\d{7}$/, placeholder: "99 123456" },
   code: "IE", name: "Ireland", dialCode: "353", placeholder: "87 123 4567", regex: /^(00353|\+353)?(0)?[89]\d{7,8}$/ },
  GBR: { code: "GBR", name: "Great Britain", dialCode: "44", placeholder: "7700 900077", regex: /^(0044|\+44)?(0)?7\d{9}$/ },
};
