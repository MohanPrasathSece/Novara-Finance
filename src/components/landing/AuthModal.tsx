import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { COUNTRY_PHONE_PATTERNS } from "@/lib/constants";
import { apiSignup, apiLogin } from "@/lib/authApi";

export function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup">("signup");
  
  // Form states
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("CH");
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ tab?: "login" | "signup" }>;
      if (customEvent.detail?.tab) {
        setActiveTab(customEvent.detail.tab);
      }
      setIsOpen(true);
    };

    window.addEventListener("open-auth-modal", handleOpen);
    return () => window.removeEventListener("open-auth-modal", handleOpen);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Reset form states
    setEmail("");
    setName("");
    setPhone("");
    setCountryCode("CH");
    setLoading(false);
    setErrorMsg("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!email.trim()) {
      toast.error("Please fill in your email address.");
      setErrorMsg("Please fill in your email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiLogin({ email: email.trim() });
      const data = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }
      
      localStorage.setItem("novara_user_email", email.trim());
      toast.success(`Welcome back, ${data.user?.name || "investor"}!`);
      handleClose();
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error("[Login] Error:", err);
      const msg = err.message || "No account found with this email. Please sign up first.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in all required fields.");
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    // Phone validation matching selected country regex
    const selectedCountry = COUNTRY_PHONE_PATTERNS[countryCode] || COUNTRY_PHONE_PATTERNS.CH;
    const cleanPhone = phone.replace(/[^0-9+]/g, '');

    if (cleanPhone && !selectedCountry.regex.test(cleanPhone)) {
      toast.error(`Please enter a valid phone number for ${selectedCountry.name}. Format example: ${selectedCountry.placeholder}`);
      setErrorMsg(`Please enter a valid phone number for ${selectedCountry.name}. Format example: ${selectedCountry.placeholder}`);
      return;
    }

    setLoading(true);
    try {
      const res = await apiSignup({
        name: name.trim(),
        email: email.trim(),
        phone: cleanPhone,
        countryCode
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 409 || (data.error && (data.error.toLowerCase().includes("already") || data.error.toLowerCase().includes("duplicate")))) {
          toast.info("You have already contacted us. A member of our advisory team will reach out to you shortly.");
          setErrorMsg("You have already contacted us. A member of our advisory team will reach out to you shortly.");
          handleClose();
          return;
        }
        throw new Error(data.error || "Registration failed");
      }

      localStorage.setItem("novara_user_email", email.trim());
      toast.success("Account created successfully!");
      handleClose();
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error("[Signup] Error:", err);
      const msg = err.message || "An error occurred during registration. Please try again.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="glass-strong border-gradient noise-overlay relative z-10 w-full max-w-md overflow-hidden rounded-3xl p-6 shadow-float sm:p-8"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 rounded-full border border-white/5 bg-secondary/40 p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Title / Brand logo */}
            <div className="mb-6 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary shadow-[0_0_12px_rgba(123,97,255,0.4)]">
                <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                  <path d="M2 12V2l10 10V2" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="text-sm font-semibold tracking-tight text-foreground">Novara Portal</span>
            </div>

            {/* Tab Controls */}
            <div className="mb-6 grid grid-cols-2 rounded-xl bg-secondary/40 p-1 border border-border">
              <button
                onClick={() => { setActiveTab("signup"); setErrorMsg(""); }}
                className={`rounded-lg py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === "signup"
                    ? "bg-primary text-primary-foreground shadow-[0_0_12px_rgba(123,97,255,0.25)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Create Account
              </button>
              <button
                onClick={() => { setActiveTab("login"); setErrorMsg(""); }}
                className={`rounded-lg py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === "login"
                    ? "bg-primary text-primary-foreground shadow-[0_0_12px_rgba(123,97,255,0.25)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Log In
              </button>
            </div>

            {/* Error Message Display */}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs text-red-400 font-semibold"
              >
                {errorMsg}
              </motion.div>
            )}

            {/* Form render based on active tab */}
            <AnimatePresence mode="wait">
              {activeTab === "signup" ? (
                <motion.form
                  key="signup"
                  onSubmit={handleSignup}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="text-[11px] font-semibold text-primary-glow tracking-wider uppercase block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm text-foreground outline-none transition-all duration-300 focus:border-primary/50 focus:bg-secondary/70 focus:shadow-[0_0_0_3px_oklch(0.58_0.21_285/12%)]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-primary-glow tracking-wider uppercase block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm text-foreground outline-none transition-all duration-300 focus:border-primary/50 focus:bg-secondary/70 focus:shadow-[0_0_0_3px_oklch(0.58_0.21_285/12%)]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-primary-glow tracking-wider uppercase block mb-1">Phone Number</label>
                    <div className="flex gap-2">
                      <div className="w-1/3">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="w-full h-full rounded-xl border border-border bg-secondary/40 px-3.5 py-3 text-sm text-foreground outline-none transition-all duration-300 focus:border-primary/50 focus:bg-secondary/70 focus:shadow-[0_0_0_3px_oklch(0.58_0.21_285/12%)] cursor-pointer"
                        >
                          {Object.values(COUNTRY_PHONE_PATTERNS).map((c) => (
                            <option key={c.code} value={c.code} className="bg-[#0b0b0e] text-white">
                              {c.code} (+{c.dialCode})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-2/3">
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder={COUNTRY_PHONE_PATTERNS[countryCode]?.placeholder || "Mobile phone"}
                          className="w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm text-foreground outline-none transition-all duration-300 focus:border-primary/50 focus:bg-secondary/70 focus:shadow-[0_0_0_3px_oklch(0.58_0.21_285/12%)]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_0_24px_rgba(123,97,255,0.3)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_36px_rgba(123,97,255,0.45)] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    >
                      {loading ? "Creating Account..." : "Create Account"}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.form
                  key="login"
                  onSubmit={handleLogin}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="text-[11px] font-semibold text-primary-glow tracking-wider uppercase block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm text-foreground outline-none transition-all duration-300 focus:border-primary/50 focus:bg-secondary/70 focus:shadow-[0_0_0_3px_oklch(0.58_0.21_285/12%)]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_0_24px_rgba(123,97,255,0.3)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_36px_rgba(123,97,255,0.45)] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    >
                      {loading ? "Logging In..." : "Log In"}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
