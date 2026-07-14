import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Scale, Users, ShieldAlert, BadgeCheck } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
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
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Terms of Service</h1>
              <p className="text-xs text-muted-foreground mt-1">Last Updated: July 2026</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 space-y-10 text-[15px] leading-relaxed text-muted-foreground">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-primary-glow" /> 1. Client Eligibility & Registration
            </h2>
            <p>
              By accessing our quantitative portfolio dashboard, you warrant that you are of legal age and possess the capacity to enter binding financial services agreements. Solara Assets provides services reserved for qualified high-net-worth investors, family offices, and institutional partners.
            </p>
            <p>
              Users are solely responsible for maintaining the confidentiality of their session access tokens and authentication details. You must notify us immediately of any unauthorized system intrusions or credential compromise.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary-glow" /> 2. Market Risk Disclosure
            </h2>
            <p>
              Digital asset markets are subject to high volatility, liquidity shifts, and structural risks. Past performance statistics and simulated yield metrics shown on our visualizers do not guarantee future performance values. Users acknowledge that trading, yield compounding, and staking parameters involve underlying asset risk, protocol vulnerabilities, and potential capital loss.
            </p>
            <p>
              All quantitative algorithms, rebalance strategies, and exposure distributions are optimized under mathematical models, but absolute margins are not guaranteed.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-primary-glow" /> 3. Proprietary Technology
            </h2>
            <p>
              All software modules, compounding logic, algorithmic visualizers, branding assets, and performance charts remain the exclusive intellectual property of Solara Assets. Clients are granted a limited, non-transferable license to access performance figures via the authorized dashboard portal. Reverse engineering, scraping, or automatic extraction of structural platform assets is strictly prohibited.
            </p>
          </section>

          <section className="space-y-4 border-t border-white/5 pt-8">
            <h2 className="text-lg font-bold text-white">4. Termination & Settlement</h2>
            <p>
              Solara Assets reserves the right to suspend platform access for non-compliance, regulatory requirements, or suspected security breaches. Account settlements and custody asset clearances are executed in accordance with fidelity co-custody timelines.
            </p>
          </section>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
