import type { IncomingMessage, ServerResponse } from "http";
import { submitToCRM } from "./_lib/crm.js";
import { getUsers, saveUsers, User } from "./_lib/blobDb.js";

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
    const { name, email, phone, countryCode } = body;
    const selectedCountry = countryCode || "CH";

    console.log(`[API Signup] Request: Name="${name}", Email="${email}", Phone="${phone}", CountryCode="${selectedCountry}"`);

    // Validation
    if (!email || !email.trim()) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Email is required" }));
      return;
    }

    if (!name || !name.trim()) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Name is required" }));
      return;
    }

    const cleanPhone = phone ? formatPhoneForSignup(phone, selectedCountry) : "";

    // CRM Submission
    try {
      await submitToCRM({
        name: name.trim(),
        email: email.trim(),
        phone: cleanPhone,
        description: "Solara Assets",
        outlineYourCase: "Signup Lead",
        countryCode: selectedCountry,
      });
      console.log("[API Signup] CRM lead created/updated successfully.");
    } catch (crmError) {
      const errMsg = (crmError as Error).message || "";
      if (errMsg.toLowerCase().includes("already exist") || errMsg.toLowerCase().includes("already exists")) {
        console.warn("[API Signup] CRM duplicate detected, raising conflict.");
        res.statusCode = 409;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "You have already contacted us. A member of our team will get in touch with you shortly.", code: "ALREADY_EXISTS" }));
        return;
      }
      console.error("[API Signup] CRM submission failed:", crmError);
    }

    // Save to Local Mock database
    const users = await getUsers();
    const existingIndex = users.findIndex((u) => u.email.toLowerCase() === email.trim().toLowerCase());

    if (existingIndex >= 0) {
      res.statusCode = 409;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "An account with this email already exists. Please sign in instead.", code: "ALREADY_EXISTS" }));
      return;
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
          website: "Solara Assets",
          type: "signup",
          name: name.trim(),
          email: email.trim()
        })
      });
      console.log("[API Signup] Dashboard count incremented.");
    } catch (dbError) {
      console.warn("[API Signup] Dashboard sync failed:", dbError);
    }

    // Leads count sync
    try {
      const host = req.headers.host || "localhost:3000";
      const protocol = host.startsWith("localhost") ? "http" : "https";
      fetch(`${protocol}://${host}/api/leads-count`, { method: "POST" }).catch(() => {});
    } catch {}

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: true, user: updatedUser }));
  } catch (error: any) {
    console.error("[API Signup] Critical error:", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: error.message || "Internal server error" }));
  }
}
