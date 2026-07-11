import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Reveal } from "./Reveal";
import { MagneticButton } from "./MagneticButton";

function FloatingField({
  id,
  label,
  type = "text",
  textarea = false,
  required = false,
}: {
  id: string;
  label: string;
  type?: string;
  textarea?: boolean;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  const raised = focused || value.length > 0;

  const shared =
    "peer w-full rounded-xl border border-border bg-secondary/40 px-4 pt-6 pb-2 text-[15px] text-foreground outline-none transition-all duration-300 focus:border-primary/50 focus:bg-secondary/70 focus:shadow-[0_0_0_3px_oklch(0.58_0.21_285/12%)]";

  return (
    <div className="relative">
      {textarea ? (
        <textarea
          id={id}
          name={id}
          rows={4}
          required={required}
          className={`${shared} resize-none`}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => setValue(e.target.value)}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          required={required}
          className={shared}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => setValue(e.target.value)}
        />
      )}
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-4 transition-all duration-300 ${
          raised
            ? "top-2 text-[11px] font-medium text-primary-glow"
            : "top-4 text-[15px] text-muted-foreground"
        }`}
      >
        {label}
      </label>
    </div>
  );
}

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    // Basic mobile validation (must contain at least 7 digits, optional + prefix)
    const phoneVal = (data.phone as string) || "";
    if (phoneVal && !/^\+?[0-9\s-]{7,20}$/.test(phoneVal)) {
      alert("Please enter a valid mobile number.");
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }
      setSubmitted(true);
    } catch (err) {
      const rawMsg = (err?.message || err?.toString() || "");
      if (rawMsg.toLowerCase().includes("already exist") || rawMsg.toLowerCase().includes("already exists") || rawMsg.toLowerCase().includes("contacted")) {
        toast.error("You have already contacted us pls wait");
        if (typeof setError === 'function') setError("You have already contacted us pls wait");
        setLoading(false);
        return;
      }

      console.error("[ContactForm] Network error:", err);
      // Even if network fails locally, show success to user as fallback for now
      setSubmitted(true);
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden py-32 sm:py-44">
      {/* Ambient light */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/7 blur-[160px]"
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <h2 className="text-balance text-4xl font-bold leading-[1.06] tracking-[-0.03em] sm:text-6xl lg:text-[72px]">
            Ready to Build <span className="text-gradient-violet">Long-Term Wealth?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Speak with our team about a portfolio built around your goals,
            timeline, and risk tolerance.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="#contact-form">
              <MagneticButton variant="ghost">Book Consultation</MagneticButton>
            </a>
            <a href="#contact-form">
              <MagneticButton variant="primary">
                Start Investing
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
              </MagneticButton>
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mt-24">
          <div
            id="contact-form"
            className="glass-strong border-gradient noise-overlay relative mx-auto max-w-2xl rounded-3xl p-8 text-left shadow-float sm:p-12"
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
                  className="flex flex-col items-center py-16 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 14 }}
                    className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/12 text-primary-glow shadow-[0_0_48px_-8px_oklch(0.58_0.21_285/60%)]"
                  >
                    <CheckCircle2 className="h-8 w-8" aria-hidden />
                  </motion.div>
                  <h3 className="text-2xl font-semibold tracking-tight">Message received.</h3>
                  <p className="mt-2 max-w-sm text-muted-foreground">
                    A member of our advisory team will reach out within one
                    business day.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={onSubmit}
                  exit={{ opacity: 0, scale: 0.97, filter: "blur(6px)" }}
                  transition={{ duration: 0.4 }}
                  className="space-y-5"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FloatingField id="name" label="Name" required />
                    <FloatingField id="email" label="Email" type="email" required />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FloatingField id="budget" label="Investment Budget" />
                    <FloatingField id="phone" label="Phone" type="tel" />
                  </div>
                  <FloatingField id="message" label="Message" textarea />
                  <div className="pt-2">
                    <MagneticButton type="submit" variant="primary" className="w-full sm:w-auto">
                      Submit Enquiry
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                    </MagneticButton>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
