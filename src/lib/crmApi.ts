export interface SubmitLeadInput {
  name: string;
  email: string;
  phone: string;
  message?: string;
  budget?: string;
  countryCode: string;
  leadType?: "signup" | "contact";
}

export async function submitLead(input: SubmitLeadInput) {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: input.name,
      email: input.email,
      phone: input.phone,
      message: input.message || "",
      budget: input.budget || "",
      countryCode: input.countryCode,
      leadType: input.leadType || "contact",
    }),
  });
  return response;
}
