import { createFileRoute } from "@tanstack/react-router";
import { getUsers, saveUsers, User } from "../../api/_lib/blobDb";
import { submitToCRM } from "../../api/_lib/crm";

const DIAL_CODES: Record<string, string> = {
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

function formatPhoneForSignup(phoneInput: string, countryCode: string = "CH"): string {
  let phone = (phoneInput || "").replace(/[^\d]/g, "").trim();
  const upperCountry = countryCode.toUpperCase();
  const code = DIAL_CODES[upperCountry] || "41";

  const doublePrefix = "00" + code;
  if (phone.startsWith(doublePrefix)) {
    phone = phone.slice(doublePrefix.length);
  } else if (phone.startsWith(code)) {
    phone = phone.slice(code.length);
  }

  if (phone.startsWith("0")) {
    phone = phone.slice(1);
  }

  return "+" + code + phone;
}

export const Route = createFileRoute("/api/signup")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => ({}));
          const { name, email, phone, countryCode } = body;
          const selectedCountry = countryCode || "CH";

          console.log(`[TanStack API Signup] Name="${name}", Email="${email}", Phone="${phone}", CountryCode="${selectedCountry}"`);

          if (!email || !email.trim()) {
            return new Response(JSON.stringify({ error: "Email is required" }), {
              status: 400,
              headers: { "Content-Type": "application/json" }
            });
          }

          if (!name || !name.trim()) {
            return new Response(JSON.stringify({ error: "Name is required" }), {
              status: 400,
              headers: { "Content-Type": "application/json" }
            });
          }

          const cleanPhone = phone ? formatPhoneForSignup(phone, selectedCountry) : "";

          // CRM Submission
          try {
            await submitToCRM({
              name: name.trim(),
              email: email.trim(),
              phone: cleanPhone,
              description: "Novara",
              outlineYourCase: "Signup Lead",
              countryCode: selectedCountry,
            });
          } catch (crmError: any) {
            const errMsg = crmError.message || "";
            if (errMsg.toLowerCase().includes("already exist") || errMsg.toLowerCase().includes("already exists")) {
              return new Response(
                JSON.stringify({ 
                  error: "You have already contacted us. A member of our team will get in touch with you shortly.", 
                  code: "ALREADY_EXISTS" 
                }), 
                {
                  status: 409,
                  headers: { "Content-Type": "application/json" }
                }
              );
            }
            console.error("[TanStack API Signup] CRM submission failed:", crmError);
          }

          // Save to Local Mock database
          const users = await getUsers();
          const existingIndex = users.findIndex((u) => u.email.toLowerCase() === email.trim().toLowerCase());

          if (existingIndex >= 0) {
            return new Response(
              JSON.stringify({ 
                error: "An account with this email already exists. Please sign in instead.", 
                code: "ALREADY_EXISTS" 
              }), 
              {
                status: 409,
                headers: { "Content-Type": "application/json" }
              }
            );
          }

          const updatedUser: User = {
            email: email.trim().toLowerCase(),
            name: name.trim(),
            phone: cleanPhone,
            createdAt: new Date().toISOString(),
          };

          users.push(updatedUser);
          await saveUsers(users);

          // Sync to dashboard
          try {
            const dashboardUrl = process.env.VITE_DASHBOARD_URL || "https://lead-dashboard-orcin.vercel.app/api/increment";
            await fetch(dashboardUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                website: "Novara",
                type: "signup",
                name: name.trim(),
                email: email.trim()
              })
            });
          } catch (dbError) {
            console.warn("[TanStack API Signup] Dashboard sync failed:", dbError);
          }

          return new Response(JSON.stringify({ success: true, user: updatedUser }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        } catch (error: any) {
          console.error("[TanStack API Signup] Critical error:", error);
          return new Response(JSON.stringify({ error: error.message || "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }
      }
    }
  }
});
