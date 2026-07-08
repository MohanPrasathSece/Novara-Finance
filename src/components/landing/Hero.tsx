import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { HeroSphere } from "./HeroSphere";
import { MagneticButton } from "./MagneticButton";
import { DashboardPreview } from "./DashboardPreview";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const sphereY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section id="home" ref={ref} className="relative overflow-hidden">
      {/* Sphere backdrop — parallax slower than content */}
      <motion.div
        style={reduced ? undefined : { y: sphereY }}
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden
      >
        <div className="absolute left-1/2 top-[8%] h-[110vmin] w-[110vmin] -translate-x-1/2">
          <HeroSphere />
        </div>
        {/* Light rays */}
        <div className="absolute left-1/2 top-0 h-[70vh] w-[1px] -translate-x-[30vw] bg-gradient-to-b from-primary/20 via-primary/5 to-transparent" />
        <div className="absolute left-1/2 top-0 h-[55vh] w-[1px] translate-x-[26vw] bg-gradient-to-b from-primary-glow/15 via-primary/4 to-transparent" />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--background)_85%)]" />
      </motion.div>

      <motion.div
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 pt-32 pb-16 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.4, ease }}
          className="glass mb-8 flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] text-muted-foreground"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary-glow animate-pulse-glow" />
          Institutional Digital Asset Management
          <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40, filter: "blur(14px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, delay: 0.55, ease }}
          className="text-gradient-hero max-w-4xl text-balance text-5xl font-bold leading-[1.04] tracking-[-0.03em] sm:text-6xl lg:text-[84px]"
        >
          Invest in Digital Assets With Institutional Confidence.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.75, ease }}
          className="mt-7 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground"
        >
          AI-powered crypto portfolio management designed for long-term wealth
          creation, transparent performance, and enterprise-grade security.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.95, ease }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <a href="#contact">
            <MagneticButton variant="primary">
              Start Investing
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </MagneticButton>
          </a>
          <a href="#platform">
            <MagneticButton variant="ghost">See Platform</MagneticButton>
          </a>
        </motion.div>
      </motion.div>

      {/* Floating dashboard below hero */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-28 sm:px-6">
        <DashboardPreview />
      </div>
    </section>
  );
}
