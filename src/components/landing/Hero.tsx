import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, useEffect, useState } from "react";
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
      {/* Sphere backdrop — fixed full screen background effect */}
      <div
        className="pointer-events-none fixed inset-0 z-0 h-screen w-screen"
        aria-hidden
      >
        <div className="absolute inset-0 h-full w-full">
          <HeroSphere />
        </div>
        {/* Light rays */}
        <div className="absolute left-1/2 top-0 h-[70vh] w-[1px] -translate-x-[30vw] bg-gradient-to-b from-primary/20 via-primary/5 to-transparent" />
        <div className="absolute left-1/2 top-0 h-[55vh] w-[1px] translate-x-[26vw] bg-gradient-to-b from-primary-glow/15 via-primary/4 to-transparent" />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--background)_85%)]" />
      </div>

      <motion.div
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 pt-32 pb-16 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.4, ease }}
          className="glass mb-8 flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] text-muted-foreground font-mono"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary-glow animate-pulse-glow" />
          INTAKE CLOSING SOON: ONLY 3 MEMBERSHIP SPOTS REMAINING
          <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40, filter: "blur(14px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, delay: 0.55, ease }}
          className="text-gradient-hero max-w-4xl text-balance text-5xl font-bold leading-[1.04] tracking-[-0.03em] sm:text-6xl lg:text-[84px]"
        >
          Secure Your VIP Access Before Intake Closes.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.75, ease }}
          className="mt-7 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground"
        >
          Institutional capacity is 98% filled. The current registration window is closing soon. Submit your enquiry to secure one of the final 3 priority membership spots and lock in current portfolio yield strategies.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.95, ease }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <MagneticButton
            variant="primary"
            onClick={() => window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { tab: "signup" } }))}
            className="cursor-pointer"
          >
            Start Investing
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </MagneticButton>
          <a href="#solutions">
            <MagneticButton variant="ghost">Learn More</MagneticButton>
          </a>
        </motion.div>

        {/* Dynamic Urgent Intake status card */}
        <HeroIntakeStatus />
      </motion.div>

      {/* Floating dashboard below hero */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <DashboardPreview />
      </div>
    </section>
  );
}

// Stateful Subcomponent for Hero Scarcity Metrics
function HeroIntakeStatus() {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [hasMounted, setHasMounted] = useState(false);
  const slotsLeft = 3; // Locked at 3 private spots for authenticity

  useEffect(() => {
    setHasMounted(true);
    // Sync with the same localStorage deadline
    const getDeadline = () => {
      const stored = localStorage.getItem("solara_intake_deadline_v2");
      return stored ? parseInt(stored, 10) : (Date.now() + (1 * 60 * 60 * 1000 + 23 * 1000));
    };

    const deadline = getDeadline();

    const updateTimer = () => {
      const now = Date.now();
      const difference = deadline - now;

      if (difference <= 0) {
        setTimeLeft("00h 00m 00s");
        return;
      }

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const totalSlots = 150;
  const filledSlots = totalSlots - slotsLeft;
  const fillPercentage = (filledSlots / totalSlots) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 1.1 }}
      className="glass-strong border-gradient relative mt-16 w-full max-w-xl rounded-2xl p-6 text-left shadow-float overflow-hidden"
    >
      <div className="absolute top-0 right-0 h-[100px] w-[100px] bg-primary/10 rounded-full blur-2xl pointer-events-none" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary-glow animate-ping"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary-glow"></span>
            </span>
            <span className="text-[11px] font-semibold tracking-wider text-primary-glow uppercase">Intake Status</span>
          </div>
          <h4 className="text-md font-bold text-foreground mt-1">Institutional VIP Access Intake</h4>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-muted-foreground block">Closes In</span>
          <span className="font-mono text-sm font-bold text-primary-glow">{hasMounted ? timeLeft : "01h 00m 23s"}</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-1 font-mono">
          <span>Capacity Status: <strong>{filledSlots} / {totalSlots} units</strong></span>
          <span className="text-[#F43F5E] font-semibold animate-pulse">Only {slotsLeft} spots left</span>
        </div>
        <div className="w-full bg-secondary/50 rounded-full h-1.5 overflow-hidden border border-border">
          <motion.div 
            className="bg-gradient-to-r from-rose-500 via-primary to-primary-glow h-full rounded-full animate-pulse-glow" 
            initial={{ width: 0 }}
            animate={{ width: `${fillPercentage}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground pt-3 border-t border-border/40 font-mono">
        <span>Qualified Investor Protocol Enabled</span>
        <span className="font-medium text-foreground">Cohort Target Size: $15,000,000</span>
      </div>
    </motion.div>
  );
}
