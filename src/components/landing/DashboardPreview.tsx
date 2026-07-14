import { motion, useReducedMotion, useScroll, useTransform, useInView } from "motion/react";
import { useRef } from "react";
import { ArrowUpRight, ShieldCheck, TrendingUp } from "lucide-react";
import { CountUp } from "./CountUp";

const performancePath =
  "M0,150 C40,142 70,120 110,118 C150,116 180,128 220,110 C260,92 290,96 330,78 C370,60 400,66 440,48 C480,30 520,38 560,24 C600,10 640,18 680,8";

const portfolioWeights = [
  { label: "Bitcoin", pct: 38 },
  { label: "Ethereum", pct: 27 },
  { label: "Stablecoin Yield", pct: 18 },
  { label: "Layer-2 Index", pct: 11 },
  { label: "Cash Reserve", pct: 6 },
];

const assets = [
  { name: "BTC", full: "Bitcoin", value: "$4.21M", change: "+2.4%" },
  { name: "ETH", full: "Ethereum", value: "$2.98M", change: "+1.8%" },
  { name: "SOL", full: "Solana", value: "$1.12M", change: "+3.1%" },
];

export function DashboardPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 0.35], [10, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.35], [0.94, 1]);
  const y = useTransform(scrollYProgress, [0, 0.35], [60, 0]);

  return (
    <div ref={ref} style={{ perspective: 1600 }}>
      <motion.div
        style={reduced ? undefined : { rotateX, scale, y }}
        className="glass-strong border-gradient noise-overlay relative rounded-3xl p-2 shadow-float will-change-transform"
      >
        {/* Ambient glow beneath */}
        <div
          aria-hidden
          className="absolute -inset-x-16 -bottom-24 top-1/2 -z-10 rounded-full bg-primary/12 blur-[100px]"
        />

        <div className="rounded-[calc(var(--radius-3xl)-4px)] bg-surface/80 p-5 sm:p-8">
          {/* Header row */}
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[13px] text-muted-foreground">Total Portfolio Value</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
                {inView ? (
                  <CountUp value={12847290} prefix="$" duration={2.4} />
                ) : (
                  "$0"
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-[13px] font-medium text-primary-glow">
                <TrendingUp className="h-3.5 w-3.5" aria-hidden />
                {inView ? <CountUp value={18.4} decimals={1} prefix="+" suffix="% YTD" duration={2.2} /> : "+0%"}
              </span>
              <span className="glass hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] text-muted-foreground sm:flex">
                <ShieldCheck className="h-3.5 w-3.5 text-primary-glow" aria-hidden />
                Risk Score: Low
              </span>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
            {/* Performance chart */}
            <div className="glass rounded-2xl p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium">Performance</p>
                <div className="flex gap-1 text-[11px] text-muted-foreground">
                  {["1M", "6M", "1Y", "All"].map((t, i) => (
                    <span
                      key={t}
                      className={
                        i === 2
                          ? "rounded-md bg-primary/15 px-2 py-1 text-primary-glow"
                          : "rounded-md px-2 py-1"
                      }
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <svg viewBox="0 0 680 160" className="h-40 w-full" aria-hidden>
                <defs>
                  <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7B61FF" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#7B61FF" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#7B61FF" />
                    <stop offset="100%" stopColor="#A88BFF" />
                  </linearGradient>
                </defs>
                {[32, 72, 112].map((gy) => (
                  <line key={gy} x1="0" y1={gy} x2="680" y2={gy} stroke="rgba(255,255,255,0.04)" />
                ))}
                <motion.path
                  d={`${performancePath} L680,160 L0,160 Z`}
                  fill="url(#chartFill)"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 1.2, delay: 1 }}
                />
                <motion.path
                  d={performancePath}
                  fill="none"
                  stroke="url(#chartLine)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={inView ? { pathLength: 1 } : {}}
                  transition={{ duration: 2.2, delay: 0.4, ease: "easeInOut" }}
                />
                <motion.circle
                  cx="680"
                  cy="8"
                  r="4"
                  fill="#A88BFF"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 2.4 }}
                />
              </svg>
            </div>

            {/* Allocation */}
            <div className="glass rounded-2xl p-5">
              <p className="mb-4 text-sm font-medium">Asset Weighting</p>
              <div className="space-y-3.5">
                {portfolioWeights.map((a, i) => (
                  <div key={a.label}>
                    <div className="mb-1.5 flex justify-between text-[13px]">
                      <span className="text-muted-foreground">{a.label}</span>
                      <span className="font-medium">{a.pct}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow"
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${a.pct}%` } : {}}
                        transition={{ duration: 1.2, delay: 0.6 + i * 0.12, ease: [0.21, 0.47, 0.32, 0.98] }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom row: yield + assets */}
          <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_1.6fr]">
            <div className="glass flex flex-col justify-between rounded-2xl p-5">
              <p className="text-sm font-medium">Yield (Annualized)</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-primary-glow">
                {inView ? <CountUp value={7.2} decimals={1} suffix="%" duration={2} /> : "0%"}
              </p>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Generated via institutional staking &amp; custody yield
              </p>
            </div>
            <div className="glass rounded-2xl p-5">
              <p className="mb-3 text-sm font-medium">Assets</p>
              <div className="space-y-2.5">
                {assets.map((a, i) => (
                  <motion.div
                    key={a.name}
                    initial={{ opacity: 0, x: 16 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.9 + i * 0.15, duration: 0.7 }}
                    className="flex items-center justify-between rounded-xl bg-secondary/60 px-3.5 py-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/12 text-[11px] font-semibold text-primary-glow">
                        {a.name}
                      </span>
                      <span className="text-sm text-muted-foreground">{a.full}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-medium">{a.value}</span>
                      <span className="flex items-center gap-0.5 text-[13px] text-primary-glow">
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                        {a.change}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
