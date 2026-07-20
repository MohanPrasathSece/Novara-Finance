import process from "process";

const DIAL_CODES: Record<string, string> = {
  IE: "353",
  CH: "41",
  FR: "33",
  BE: "32",
  CA: "1",
  US: "1",
  GB: "44",
  DE: "49",
  ES: "34",
  IT: "39",
  NL: "31",
  SE: "46",
  AU: "61",
  IN: "91",
  AE: "971",
  SG: "65",
  ZA: "27",
  BR: "55",
  MX: "52",
  JP: "81",
  CY: "357"
};

export function formatPhoneForCRM(phoneInput: string, countryCode: string = "CH"): string {
  // Strip non-digits
  let phone = (phoneInput || "").replace(/[^\d]/g, "").trim();
  const upperCountry = countryCode.toUpperCase();
  const code = DIAL_CODES[upperCountry] || "41";

  // Strip leading 00 + country code or leading country code if entered
  const doublePrefix = "00" + code;
  if (phone.startsWith(doublePrefix)) {
    phone = phone.slice(doublePrefix.length);
  } else if (phone.startsWith(code)) {
    phone = phone.slice(code.length);
  }

  // Strip single leading zero (common in local dialing formats, e.g., 079 -> 79)
  if (phone.startsWith("0")) {
    phone = phone.slice(1);
  }

  // Prepend correct prefix
  return "00" + code + phone;
}

export function parseName(fullName: string): { first_name: string; last_name: string } {
  const [first_name, ...lastNameParts] = (fullName || "Unknown").trim().split(" ");
  const last_name = lastNameParts.join(" ") || " ";
  return { first_name, last_name };
}

export interface CRMLeadData {
  name: string;
  email: string;
  phone: string;
  number?: string;
  description?: string;
  outlineYourCase?: string;
  countryCode?: string;
}

export async function submitToCRM(leadData: CRMLeadData) {
  const crmEndpoint =
    process.env.CRM_ENDPOINT || "https://api.myinvesttrade.com/api/lead_management/api/affiliates";
  const crmToken = process.env.CRM_TOKEN || "AFF_1_697ac63e6f88cac9f990b1a5c4beaefd";

  const { first_name, last_name } = parseName(leadData.name);
  const countryCode = leadData.countryCode || "CH";
  
  // Format phone number
  const rawPhone = leadData.number || leadData.phone || "";
  const finalPhone = formatPhoneForCRM(rawPhone, countryCode);
  const countryName = countryCode.toLowerCase();

  const payload = {
    first_name,
    last_name,
    email: leadData.email,
    phone: finalPhone,
    country: countryName,
    description: leadData.description || leadData.outlineYourCase || "New Lead",
    password: "Password123!"
  };

  // Bypass SSL certificate errors for this specific CRM API (UNABLE_TO_VERIFY_LEAF_SIGNATURE)
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  console.log("[CRM Submit] Target:", crmEndpoint);
  console.log("[CRM Submit] Headers & Token configured");
  console.log("[CRM Submit] Payload:", JSON.stringify(payload));

  const response = await fetch(crmEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Token": crmToken,
      "Authorization": `Bearer ${crmToken}`,
      "X-Affiliate-Token": crmToken,
      "x-token": crmToken
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.clone().text().catch(() => "");
  console.log(`[CRM Response] Status: ${response.status}. Body: ${responseText}`);

  const responseLower = responseText.toLowerCase();
  const isDuplicateError = responseLower.includes("already") || 
                           responseLower.includes("exist") || 
                           (responseLower.includes("duplicate") && !responseText.includes('"duplicate":false'));

  if (isDuplicateError) {
    console.warn("[CRM Submit] Lead already exists (detected duplicate pattern)");
    throw new Error("Account already exists");
  }

  if (!response.ok) {
    throw new Error(`CRM API request failed: ${response.status} - ${responseText}`);
  }

  return await response.json();
}