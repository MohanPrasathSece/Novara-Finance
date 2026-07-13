import { createFileRoute } from "@tanstack/react-router";
import { getUsers } from "../../api/_lib/blobDb";

export const Route = createFileRoute("/api/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => ({}));
          const { email } = body;

          console.log(`[TanStack API Login] Email: "${email}"`);

          if (!email || !email.trim()) {
            return new Response(JSON.stringify({ error: "Email is required" }), {
              status: 400,
              headers: { "Content-Type": "application/json" }
            });
          }

          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email.trim())) {
            return new Response(JSON.stringify({ error: "Please enter a valid email address" }), {
              status: 400,
              headers: { "Content-Type": "application/json" }
            });
          }

          const users = await getUsers();
          const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

          if (!user) {
            return new Response(JSON.stringify({ error: "No account found with this email. Please sign up first." }), {
              status: 404,
              headers: { "Content-Type": "application/json" }
            });
          }

          return new Response(JSON.stringify({ success: true, user }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        } catch (error: any) {
          console.error("[TanStack API Login] Error:", error);
          return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }
      }
    }
  }
});
