import type { IncomingMessage, ServerResponse } from "http";
import { submitToCRM } from "./_lib/crm.js";

async function parseJsonBody(req: IncomingMessage & { body?: any }): Promise<Record<string, any>> {
  try {
    if (req.body !== undefined && req.body !== null) {
      return typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    }
  } catch {
    // fall through
  }
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => { body += chunk.toString(); });
    req.on("end", () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch { resolve({}); }
    });
  });
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  try {
    const body = await parseJsonBody(req);
    const { name, email, phone, message, countryCode } = body;
    const selectedCountry = countryCode || "CH";

    console.log(`[API Contact] Request: Name="${name}", Email="${email}", Phone="${phone}", CountryCode="${selectedCountry}", Message="${message}"`);

    if (!name || !email || !phone) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Name, email, and phone are required" }));
      return;
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
      console.log("[API Contact] CRM lead created/updated successfully.");
    } catch (crmError: any) {
      const errMsg = crmError.message || "";
      if (errMsg.toLowerCase().includes("already exist") || errMsg.toLowerCase().includes("already exists")) {
        console.warn("[API Contact] CRM duplicate detected, raising conflict.");
        res.statusCode = 409;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "You have already contacted us. A member of our team will get in touch with you shortly.", code: "ALREADY_EXISTS" }));
        return;
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
      console.log("[API Contact] Dashboard count incremented.");
    } catch (dbError) {
      console.warn("[API Contact] Dashboard sync failed:", dbError);
    }

    // Leads count sync
    try {
      const host = req.headers.host || "localhost:3000";
      const protocol = host.startsWith("localhost") ? "http" : "https";
      fetch(`${protocol}://${host}/api/leads-count`, { method: "POST" }).catch(() => {});
    } catch {}

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: true, message: "Enquiry submitted successfully" }));
  } catch (error: any) {
    console.error("[API Contact] Critical error:", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: error.message || "Internal server error" }));
  }
}
