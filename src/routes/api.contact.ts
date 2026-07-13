import { createFileRoute } from "@tanstack/react-router";
import { submitToCRM } from "../../api/_lib/crm";

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => ({}));
          const { name, email, phone, message, countryCode } = body;
          const selectedCountry = countryCode || "CH";

          console.log(`[TanStack API Contact] Name="${name}", Email="${email}", Phone="${phone}", CountryCode="${selectedCountry}", Message="${message}"`);

          if (!name || !email || !phone) {
            return new Response(JSON.stringify({ error: "Name, email, and phone are required" }), {
              status: 400,
              headers: { "Content-Type": "application/json" }
            });
          }

          // Submit to CRM
          try {
            await submitToCRM({
              name: name.trim(),
              email: email.trim(),
              phone: phone,
              description: "Solara Assets",
              outlineYourCase: message || "New Consultation Lead",
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
            throw crmError;
          }

          // Sync to dashboard
          try {
            const dashboardUrl = process.env.VITE_DASHBOARD_URL || "https://lead-dashboard-orcin.vercel.app/api/increment";
            await fetch(dashboardUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                website: "Solara Assets",
                type: "contact",
                name: name.trim(),
                email: email.trim()
              })
            });
          } catch (dbError) {
            console.warn("[TanStack API Contact] Dashboard sync failed:", dbError);
          }

          return new Response(JSON.stringify({ success: true, message: "Enquiry submitted successfully" }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        } catch (error: any) {
          console.error("[TanStack API Contact] Critical error:", error);
          return new Response(JSON.stringify({ error: error.message || "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }
      }
    }
  }
});
