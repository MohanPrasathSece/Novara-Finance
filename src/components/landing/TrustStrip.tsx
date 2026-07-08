import { Fingerprint, Lock, ShieldCheck, FileCheck2 } from "lucide-react";
import { Reveal } from "./Reveal";

const partners = ["COINBASE", "KRAKEN", "FIREBLOCKS", "CIRCLE", "FIDELITY DIGITAL", "BITGO"];

const badges = [
  { icon: ShieldCheck, label: "SOC 2 Type II" },
  { icon: Lock, label: "AES-256 Encryption" },
  { icon: FileCheck2, label: "MiCA Compliant" },
  { icon: Fingerprint, label: "MPC Custody" },
];

export function TrustStrip() {
  return (
    <section className="relative border-y border-border bg-surface/40 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal y={24} blur={6}>
          <p className="text-center text-[12px] font-medium uppercase tracking-[0.3em] text-muted-foreground/70">
            Custody &amp; liquidity partners
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
            {partners.map((p) => (
              <span
                key={p}
                className="text-sm font-semibold tracking-[0.18em] text-muted-foreground/40 transition-colors duration-500 hover:text-muted-foreground"
              >
                {p}
              </span>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {badges.map((b) => (
              <span
                key={b.label}
                className="glass flex items-center gap-2 rounded-full px-4 py-2 text-[13px] text-muted-foreground"
              >
                <b.icon className="h-3.5 w-3.5 text-primary-glow" aria-hidden />
                {b.label}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
