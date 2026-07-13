import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Reveal } from "./Reveal";
import { MagneticButton } from "./MagneticButton";
import { toast } from "sonner";
import { COUNTRY_PHONE_PATTERNS } from "@/lib/constants";

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

function PhoneField({
  countryCode,
  setCountryCode,
}: {
  countryCode: string;
  setCountryCode: (val: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  const raised = focused || value.length > 0;

  const country = COUNTRY_PHONE_PATTERNS[countryCode] || COUNTRY_PHONE_PATTERNS.CH;

  return (
    <div className="relative flex gap-2.5">
      <div className="w-1/3 relative">
        <select
          name="countryCode"
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          className="w-full h-full rounded-xl border border-border bg-secondary/40 px-3.5 pt-5 pb-1 text-[14px] text-foreground outline-none transition-all duration-300 focus:border-primary/50 focus:bg-secondary/70 focus:shadow-[0_0_0_3px_oklch(0.58_0.21_285/12%)] cursor-pointer"
        >
          {Object.values(COUNTRY_PHONE_PATTERNS).map((c) => (
            <option key={c.code} value={c.code} className="bg-surface text-foreground">
              {c.code} (+{c.dialCode})
            </option>
          ))}
        </select>
        <span className="absolute top-1.5 left-3.5 text-[9px] font-semibold text-primary-glow tracking-wider uppercase pointer-events-none">Code</span>
      </div>
      <div className="w-2/3 relative">
        <input
          id="phone"
          name="phone"
          type="tel"
          className="peer w-full rounded-xl border border-border bg-secondary/40 px-4 pt-6 pb-2 text-[15px] text-foreground outline-none transition-all duration-300 focus:border-primary/50 focus:bg-secondary/70 focus:shadow-[0_0_0_3px_oklch(0.58_0.21_285/12%)]"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => setValue(e.target.value)}
          placeholder={focused ? country.placeholder : ""}
        />
        <label
          htmlFor="phone"
          className={`pointer-events-none absolute left-4 transition-all duration-300 ${
            raised
              ? "top-2 text-[11px] font-medium text-primary-glow"
              : "top-4 text-[15px] text-muted-foreground"
          }`}
        >
          Phone Number
        </label>
      </div>
    </div>
  );
}

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [countryCode, setCountryCode] = useState("CH");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    // Country code phone validation logic
    const phoneVal = (data.phone as string) || "";
    const selectedCountry = COUNTRY_PHONE_PATTERNS[countryCode] || COUNTRY_PHONE_PATTERNS.CH;
    const cleanPhone = phoneVal.replace(/[^0-9+]/g, '');

    if (cleanPhone && !selectedCountry.regex.test(cleanPhone)) {
      toast.error(`Please enter a valid phone number for ${selectedCountry.name}. Format example: ${selectedCountry.placeholder}`);
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          countryCode
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg = errorData.error || errorData.details || "";
        
        if (response.status === 409 || errMsg.toLowerCase().includes("already") || errMsg.toLowerCase().includes("duplicate")) {
          toast.info("You have already contacted us. A member of our advisory team will reach out to you shortly.");
          setSubmitted(true);
          return;
        }
        
        throw new Error(errMsg || "An error occurred while submitting your enquiry.");
      }
      setSubmitted(true);
    } catch (err: any) {
      console.error("[ContactForm] Error:", err);
      toast.error(err.message || "An error occurred while submitting your enquiry. Please verify your details and try again.");
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
                  {/* Urgency Notice & Live Ticker */}
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mb-4">
                    <div className="flex items-center justify-between gap-2 text-xs font-semibold text-primary-glow">
                      <span className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary-glow animate-pulse-glow" />
                        Allocation Lock-In Active
                      </span>
                      <span className="font-mono text-[10px] bg-secondary px-2 py-0.5 rounded text-muted-foreground uppercase">
                        First-Come Priority
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      Complete your enquiry to instantly reserve your institutional intake position. Submissions lock in current yield tiers for 24 hours.
                    </p>
                    <RecentActivityTicker />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FloatingField id="name" label="Name" required />
                    <FloatingField id="email" label="Email" type="email" required />
                  </div>
                  <PhoneField countryCode={countryCode} setCountryCode={setCountryCode} />
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

import { useEffect } from "react";

function RecentActivityTicker() {
  const [index, setIndex] = useState(0);
  const activities = [
    { location: "Zurich, Switzerland", amount: "CHF 150k", time: "2 minutes ago" },
    { location: "London, UK", amount: "GBP 300k", time: "5 minutes ago" },
    { location: "Geneva, Switzerland", amount: "CHF 500k", time: "11 minutes ago" },
    { location: "Frankfurt, Germany", amount: "EUR 250k", time: "17 minutes ago" },
    { location: "Lugano, Switzerland", amount: "CHF 100k", time: "24 minutes ago" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % activities.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [activities.length]);

  const act = activities[index];

  return (
    <div className="mt-3 pt-3 border-t border-primary/10 flex items-center justify-between text-[11px] text-muted-foreground min-h-[20px] transition-all duration-500">
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Recent intake secured:</span>
      </div>
      <span className="font-semibold text-foreground">
        {act.location} &bull; {act.amount} &bull; <span className="text-primary-glow font-mono font-normal">{act.time}</span>
      </span>
    </div>
  );
}
