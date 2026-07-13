import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, ArrowRight } from "lucide-react";

export function FomoNotification() {
  const [isVisible, setIsVisible] = useState(false);
  const [cohortTimer, setCohortTimer] = useState<string>("");

  useEffect(() => {
    // Show after 4 seconds
    const showTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 4000);

    // Sync with localStorage deadline
    const getDeadline = () => {
      const stored = localStorage.getItem("solara_intake_deadline_v2");
      return stored ? parseInt(stored, 10) : (Date.now() + (1 * 60 * 60 * 1000 + 23 * 1000));
    };

    const deadline = getDeadline();

    const updateTimer = () => {
      const now = Date.now();
      const difference = deadline - now;

      if (difference <= 0) {
        setCohortTimer("00h 00m 00s");
        return;
      }

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setCohortTimer(
        `${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => {
      clearTimeout(showTimeout);
      clearInterval(interval);
    };
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
  };

  const handleTriggerSignup = () => {
    window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { tab: "signup" } }));
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="glass-strong border-gradient noise-overlay relative z-10 w-full max-w-lg overflow-hidden rounded-3xl p-8 shadow-float sm:p-10 text-center"
          >
            {/* Ambient light glow inside modal */}
            <div className="absolute -top-10 -right-10 h-[120px] w-[120px] bg-primary/20 rounded-full blur-2xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 rounded-full border border-white/5 bg-secondary/40 p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Warning Icon Badge */}
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary-glow ring-1 ring-primary/25">
              <Sparkles className="h-6 w-6" />
            </div>

            {/* Live Indicator */}
            <div className="mb-3 flex items-center justify-center gap-1.5 text-xs font-mono font-bold tracking-wider text-primary-glow uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Intake Window: 97% Full
            </div>

            {/* Content copy */}
            <h3 className="text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
              Only 4 Allocations Remain
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground max-w-md mx-auto">
              Institutional capacity is almost exhausted. The current private wealth intake window will close permanently in:
            </p>

            {/* Large Live Timer */}
            <div className="my-6 rounded-2xl bg-secondary/30 border border-border p-4">
              <span className="font-mono text-3xl sm:text-4xl font-extrabold tracking-widest text-foreground text-gradient-violet">
                {cohortTimer || "01h 00m 23s"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row justify-center mt-8">
              <button
                onClick={handleDismiss}
                className="w-full sm:w-auto rounded-xl border border-white/5 bg-secondary/30 px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-secondary transition-all"
              >
                Dismiss Warning
              </button>
              <button
                onClick={handleTriggerSignup}
                className="group w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_0_24px_rgba(123,97,255,0.3)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_36px_rgba(123,97,255,0.45)] cursor-pointer"
              >
                Secure Allocation Now
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
