import { useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Bell, Bot, LineChart, Wallet } from "lucide-react";
import { Reveal } from "./Reveal";
import { CountUp } from "./CountUp";

const marketPath =
  "M0,120 C50,112 80,90 130,92 C180,94 210,70 260,64 C310,58 340,72 390,52 C440,32 470,44 520,28 C570,12 600,22 640,10";

const floatCards = [
  {
    icon: Bell,
    title: "Portfolio gain",
    body: "+$24,180 this week",
    className: "left-[-4%] top-[12%] lg:left-[-9%]",
    delay: 0,
    anim: "animate-float-slow",
  },
  {
    icon: Wallet,
    title: "Asset purchase",
    body: "Acquired 1.2 BTC via DCA",
    className: "right-[-3%] top-[26%] lg:right-[-8%]",
    delay: 0.2,
    anim: "animate-float-slower",
  },
  {
    icon: LineChart,
    title: "Market update",
    body: "ETH volatility down 14%",
    className: "left-[-2%] bottom-[22%] lg:left-[-7%]",
    delay: 0.4,
    anim: "animate-float-slower",
  },
  {
    icon: Bot,
    title: "AI recommendation",
    body: "Rebalance: +3% stable yield",
    className: "right-[-4%] bottom-[10%] lg:right-[-10%]",
    delay: 0.6,
    anim: "animate-float-slow",
  },
];

const stats = [
  { label: "Assets Managed", value: 2.4, prefix: "$", suffix: "B", decimals: 1 },
  { label: "Active Investors", value: 48000, prefix: "", suffix: "+", decimals: 0 },
  { label: "Average Annual Growth", value: 21.7, prefix: "", suffix: "%", decimals: 1 },
];

export function PlatformSection() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-140px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [14, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.4, 1]);

  return (
    <section id="platform" className="relative overflow-hidden py-32 sm:py-44">
      {/* Gradient mesh backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[30%] h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-primary/6 blur-[180px]" />
        <div className="absolute left-[15%] top-[60%] h-[400px] w-[400px] rounded-full bg-primary-glow/4 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-primary-glow">
            Platform Experience
          </p>
          <h2 className="text-balance text-4xl font-bold leading-[1.08] tracking-[-0.025em] sm:text-5xl lg:text-[56px]">
            Portfolio Intelligence, Engineered for Clarity
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Every position, every rebalance, every insight - presented with
            the precision of an institutional terminal.
          </p>
        </Reveal>

        {/* Centerpiece mockup */}
        <div ref={ref} className="relative mt-20" style={{ perspective: 1800 }}>
          <motion.div
            style={reduced ? undefined : { scale, rotateX, opacity }}
            className="glass-strong border-gradient noise-overlay relative rounded-3xl p-2 shadow-float will-change-transform"
          >
            <div className="rounded-[calc(var(--radius-3xl)-4px)] bg-surface/85 p-5 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-2.5 w-2.5 rounded-full bg-secondary" />
                  ))}
                </div>
                <p className="text-[13px] text-muted-foreground">solaraassets.com / analytics</p>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-[12px] font-medium text-primary-glow">
                  Live
                </span>
              </div>

              <div className="grid gap-5 lg:grid-cols-3">
                {/* Market analytics chart */}
                <div className="glass rounded-2xl p-5 lg:col-span-2">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-medium">Market Analytics</p>
                    <p className="text-[12px] text-muted-foreground">Updated 2s ago</p>
                  </div>
                  <svg viewBox="0 0 640 140" className="h-36 w-full" aria-hidden>
                    <defs>
                      <linearGradient id="mFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#A88BFF" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#A88BFF" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {[28, 66, 104].map((gy) => (
                      <line key={gy} x1="0" y1={gy} x2="640" y2={gy} stroke="rgba(255,255,255,0.04)" />
                    ))}
                    <motion.path
                      d={`${marketPath} L640,140 L0,140 Z`}
                      fill="url(#mFill)"
                      initial={{ opacity: 0 }}
                      animate={inView ? { opacity: 1 } : {}}
                      transition={{ duration: 1.4, delay: 0.8 }}
                    />
                    <motion.path
                      d={marketPath}
                      fill="none"
                      stroke="#A88BFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={inView ? { pathLength: 1 } : {}}
                      transition={{ duration: 2.4, delay: 0.3, ease: "easeInOut" }}
                    />
                  </svg>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {[
                      { l: "Sharpe Ratio", v: "2.14" },
                      { l: "Max Drawdown", v: "−8.2%" },
                      { l: "Volatility", v: "11.6%" },
                    ].map((m) => (
                      <div key={m.l} className="rounded-xl bg-secondary/60 p-3">
                        <p className="text-[11px] text-muted-foreground">{m.l}</p>
                        <p className="mt-0.5 text-sm font-semibold">{m.v}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI insights */}
                <div className="glass rounded-2xl p-5">
                  <p className="mb-4 text-sm font-medium">AI Insights</p>
                  <div className="space-y-3">
                    {[
                      "Momentum shift detected in L2 sector - exposure adjusted +2%.",
                      "Staking yield above 90-day average. Compounding enabled.",
                      "Correlation to equities at 6-month low - hedge reduced.",
                    ].map((text, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 14 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 1 + i * 0.25, duration: 0.7 }}
                        className="rounded-xl border border-border bg-secondary/50 p-3.5 text-[13px] leading-relaxed text-muted-foreground"
                      >
                        <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium text-primary-glow">
                          <Bot className="h-3 w-3" aria-hidden /> SOLARA AI
                        </span>
                        {text}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating notification cards */}
          {floatCards.map((c) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, scale: 0.8, filter: "blur(8px)" }}
              animate={inView ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
              transition={{ delay: 1 + c.delay, duration: 0.9, ease: [0.21, 0.47, 0.32, 0.98] }}
              className={`absolute hidden md:block ${c.className}`}
            >
              <div className={`glass-strong shadow-float flex items-center gap-3 rounded-2xl px-4 py-3 ${c.anim}`}>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/12 text-primary-glow">
                  <c.icon className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="text-[13px] font-medium">{c.title}</p>
                  <p className="text-[12px] text-muted-foreground">{c.body}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-28 grid gap-10 border-t border-border pt-16 sm:grid-cols-3">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.15} className="text-center">
              <p className="text-5xl font-bold tracking-tight sm:text-6xl">
                <CountUp
                  value={s.value}
                  decimals={s.decimals}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  duration={2.4}
                  className="text-gradient-violet"
                />
              </p>
              <p className="mt-3 text-[15px] text-muted-foreground">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
