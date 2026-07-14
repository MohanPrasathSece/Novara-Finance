import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { BrainCircuit, LockKeyhole, Activity } from "lucide-react";
import { Reveal } from "./Reveal";

const features = [
  {
    icon: BrainCircuit,
    title: "AI Portfolio Management",
    body: "Quantitative models rebalance portfolio holdings continuously, optimizing for risk-adjusted returns across market cycles.",
  },
  {
    icon: LockKeyhole,
    title: "Institutional Security",
    body: "Multi-party computation custody, cold storage segregation, and SOC 2 Type II audited infrastructure.",
  },
  {
    icon: Activity,
    title: "Real-Time Performance",
    body: "Full transparency into every position, fee, and rebalance - streamed to your dashboard in real time.",
  },
];

function FeatureCard({
  icon: Icon,
  title,
  body,
  index,
}: (typeof features)[number] & { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [glow, setGlow] = useState({ x: 50, y: 50, active: false });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || reduced) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setGlow({ x: px * 100, y: py * 100, active: true });
    el.style.transform = `perspective(900px) rotateY(${(px - 0.5) * 4}deg) rotateX(${(0.5 - py) * 4}deg) translateY(-6px)`;
  };

  const onLeave = () => {
    setGlow((g) => ({ ...g, active: false }));
    if (ref.current)
      ref.current.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0px)";
  };

  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, y: 48, filter: "blur(10px)" }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay: index * 0.18, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <div
        ref={ref}
        data-cursor="card"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="glass border-gradient group relative overflow-hidden rounded-2xl p-7 transition-[transform,box-shadow] duration-500 ease-out will-change-transform hover:shadow-[0_24px_80px_-24px_oklch(0.58_0.21_285/35%)]"
      >
        {/* Cursor-follow light */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-500"
          style={{
            opacity: glow.active ? 1 : 0,
            background: `radial-gradient(360px circle at ${glow.x}% ${glow.y}%, rgba(123,97,255,0.12), transparent 65%)`,
          }}
        />
        <div className="relative">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary-glow ring-1 ring-primary/20 transition-shadow duration-500 group-hover:shadow-[0_0_28px_-6px_oklch(0.58_0.21_285/60%)]">
            <Icon className="h-5 w-5" aria-hidden />
          </div>
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">{body}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function WhySection() {
  return (
    <section id="solutions" className="relative py-32 sm:py-44">
      {/* Huge blurred glow behind cards */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-primary/8 blur-[160px]"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-16 px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <Reveal>
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-primary-glow">
              Why Solara
            </p>
            <h2 className="text-balance text-4xl font-bold leading-[1.08] tracking-[-0.025em] sm:text-5xl lg:text-[56px]">
              Why Modern Investors <span className="text-gradient-violet">Choose Us</span>
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
              We combine disciplined portfolio construction with the
              infrastructure standards of traditional finance - built for
              investors who think in decades, not days.
            </p>
          </Reveal>
        </div>

        <div className="flex flex-col gap-5">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
