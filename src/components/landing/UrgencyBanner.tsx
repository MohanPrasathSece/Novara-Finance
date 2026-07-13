import { useEffect, useState } from "react";
import { ArrowRight, Clock } from "lucide-react";

export function UrgencyBanner() {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const slotsLeft = 4; // Locked at 4 private allocations for authenticity

  useEffect(() => {
    // 1 hour 23 seconds countdown stored in localStorage
    const getDeadline = () => {
      const stored = localStorage.getItem("novara_intake_deadline_v2");
      const duration = 1 * 60 * 60 * 1000 + 23 * 1000; // 01:00:23
      if (stored) {
        const time = parseInt(stored, 10);
        // If the stored deadline is expired by more than 10 mins, reset it
        if (Date.now() - time > 10 * 60 * 1000) {
          const newDeadline = Date.now() + duration;
          localStorage.setItem("novara_intake_deadline_v2", newDeadline.toString());
          return newDeadline;
        }
        return time;
      } else {
        const newDeadline = Date.now() + duration;
        localStorage.setItem("novara_intake_deadline_v2", newDeadline.toString());
        return newDeadline;
      }
    };

    const deadline = getDeadline();

    const updateTimer = () => {
      const now = Date.now();
      const difference = deadline - now;

      if (difference <= 0) {
        setTimeLeft("00:00:00");
        return;
      }

      // Format as HH:MM:SS
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      const formatted = [
        hours.toString().padStart(2, "0"),
        minutes.toString().padStart(2, "0"),
        seconds.toString().padStart(2, "0"),
      ].join(":");

      setTimeLeft(formatted);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-10 w-full bg-background/80 border-b border-white/[0.04] backdrop-blur-md px-4 sm:px-6 flex items-center justify-between text-xs font-mono tracking-wider text-[#A3A3A3]">
      <div className="flex items-center gap-2 text-[#E5E5E5] font-semibold">
        <span className="h-1.5 w-1.5 rounded-full bg-primary-glow shadow-[0_0_10px_oklch(0.72_0.15_293)]" />
        <span className="hidden sm:inline text-muted-foreground">INSTITUTIONAL INTAKE ACTIVE:</span>
        <span>ONLY {slotsLeft} PRIVATE ALLOCATIONS REMAINING</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs text-[#E5E5E5]">
          <Clock className="h-3.5 w-3.5 text-primary-glow" />
          <span>Intake Window Closes: {timeLeft || "01:00:23"}</span>
        </div>

        <button
          onClick={() => window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { tab: "signup" } }))}
          className="group flex items-center gap-1 border border-white/10 hover:border-primary-glow bg-white/[0.02] hover:bg-primary/10 text-foreground px-3 py-1 rounded-full text-[11px] font-medium transition-all duration-300 cursor-pointer"
        >
          Secure Your Slot
          <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}
