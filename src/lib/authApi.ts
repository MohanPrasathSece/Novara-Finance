export interface SignupInput {
  name: string;
  email: string;
  phone?: string;
  countryCode: string;
}

export interface LoginInput {
  email: string;
}

export async function apiSignup(input: SignupInput) {
  const response = await fetch("/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  return response;
}

export async function apiLogin(input: LoginInput) {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  return response;
}
