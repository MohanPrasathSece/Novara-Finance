import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Shield, Eye, Lock, FileText } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden pt-10">
      {/* Background Sphere Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-1/4 bottom-0 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px]"
      />

      <Navbar />

      <main className="mx-auto max-w-4xl px-6 pt-32 pb-24 sm:px-8">
        <Reveal>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary-glow ring-1 ring-primary/20">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Privacy Policy</h1>
              <p className="text-xs text-muted-foreground mt-1">Last Updated: July 2026</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 space-y-10 text-[15px] leading-relaxed text-muted-foreground">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary-glow" /> 1. Data Collection & Usage
            </h2>
            <p>
              Solara Assets operates under strict cryptographic and data segregation principles. We collect minimal user-provided metadata strictly required for account management, authentication verification, and authorized communication. This includes account credentials, session states, and diagnostic system logs required to maintain real-time performance.
            </p>
            <p>
              No trading activities, portfolio structures, or custody allocation adjustments are shared with external marketing entities. All user interaction logs are cryptographically hashed and stored in secure infrastructure.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary-glow" /> 2. Security & Encryption Standards
            </h2>
            <p>
              Our infrastructure employs Multi-Party Computation (MPC) schemas and hardware security module (HSM) integrations. Database segments are encrypted at rest with AES-256 and in transit via TLS 1.3 tunnels. Internal data access is protected by strict zero-trust operational protocols.
            </p>
            <p>
              Session tokens are automatically revoked upon logout or after periods of inactivity. User data is co-custodied with Fidelity Digital Assets tier IV banking protocols, ensuring cold storage segregation and governance checks for institutional safety.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary-glow" /> 3. Third-Party Integrations
            </h2>
            <p>
              We integrate only with verified banking networks, crypto-custody providers, and secure system APIs. We do not distribute database slices, profiling metrics, or analytical parameters to third-party data hubs. Data transfers occur strictly over secure point-to-point tunnels with validation handshakes.
            </p>
          </section>

          <section className="space-y-4 border-t border-white/5 pt-8">
            <h2 className="text-lg font-bold text-white">4. Updates and Compliance</h2>
            <p>
              This policy is subject to changes reflecting shifts in multi-jurisdictional governance and crypto-asset compliance standards. Users will receive alerts inside the portal regarding updates to data retention timelines or policy frameworks.
            </p>
          </section>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
