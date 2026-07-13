import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  TrendingUp, 
  ShieldCheck, 
  LogOut, 
  ArrowUpRight, 
  User, 
  Send, 
  Globe, 
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { toast } from "sonner";
import { COUNTRY_PHONE_PATTERNS } from "@/lib/constants";
import { MagneticButton } from "@/components/landing/MagneticButton";
import { Reveal } from "@/components/landing/Reveal";

export const Route = createFileRoute("/dashboard")({
  component: DashboardComponent,
});

function DashboardComponent() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Investor");
  const [userEmail, setUserEmail] = useState("");
  const [countryCode, setCountryCode] = useState("CH");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Quick local storage auth check (since we have a mock authentication system)
    const storedEmail = localStorage.getItem("novara_user_email") || "investor@novara.capital";
    setUserEmail(storedEmail);
    
    // Attempt to extract name from email
    const parts = storedEmail.split("@")[0];
    const formattedName = parts.charAt(0).toUpperCase() + parts.slice(1);
    setUserName(formattedName || "Investor");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("novara_user_email");
    toast.success("Successfully logged out.");
    navigate({ to: "/" });
  };

  const handleAdjustAllocation = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    // Phone validation
    const phoneVal = (data.phone as string) || "";
    const selectedCountry = COUNTRY_PHONE_PATTERNS[countryCode] || COUNTRY_PHONE_PATTERNS.CH;
    const cleanPhone = phoneVal.replace(/[^0-9+]/g, '');

    if (cleanPhone && !selectedCountry.regex.test(cleanPhone)) {
      toast.error(`Please enter a valid phone number for ${selectedCountry.name}. Format example: ${selectedCountry.placeholder}`);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          phone: cleanPhone,
          countryCode,
          message: `Dashboard adjustment request. TopUp amount: ${data.amount}. Notes: ${data.notes || "None"}`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg = errorData.error || errorData.details || "";
        
        if (response.status === 409 || errMsg.toLowerCase().includes("already") || errMsg.toLowerCase().includes("duplicate")) {
          toast.info("You have already submitted an allocation request. A manager will reach out shortly.");
          setSubmitted(true);
          return;
        }
        
        throw new Error(errMsg || "Submission failed");
      }
      
      toast.success("Your adjustment request has been sent to the CRM & Lead Dashboard.");
      setSubmitted(true);
    } catch (err: any) {
      console.error("[Dashboard Form] Error:", err);
      toast.error(err.message || "Could not process adjustment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden pt-10">
      {/* Background Sphere Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-1/4 bottom-0 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px]"
      />

      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/5 bg-background/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-6 sm:px-8">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary shadow-[0_0_12px_rgba(123,97,255,0.4)]">
              <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                <path d="M2 12V2l10 10V2" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-sm font-bold tracking-wider uppercase text-foreground">Novara Capital</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-white/5 bg-secondary/30 px-3 py-1 text-xs text-muted-foreground">
              <User className="h-3.5 w-3.5 text-primary-glow" />
              <span>{userEmail}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs font-medium text-foreground hover:bg-white/10 transition-all cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 pt-24 pb-20 sm:px-8">
        
        {/* Welcome Section */}
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Welcome back, <span className="text-gradient-violet">{userName}</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Account Status: <span className="text-primary-glow font-semibold font-mono">Active (Phase IV Allocation)</span>
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 text-xs text-primary-glow font-semibold">
            <ShieldCheck className="h-4 w-4" />
            <span>Fidelity Custody & MPC Vault Enabled</span>
          </div>
        </div>

        {/* SECTION 1: Portfolio Performance Overview */}
        <section className="mb-8 grid gap-5 sm:grid-cols-3">
          <div className="glass-strong border-gradient p-6 rounded-2xl relative overflow-hidden">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total Value Locked (TVL)</span>
            <div className="mt-2 text-3xl font-extrabold tracking-tight">$450,290.00</div>
            <div className="mt-2 flex items-center gap-1 text-xs text-emerald-500 font-semibold">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+18.4% intake tier reward lock</span>
            </div>
          </div>
          
          <div className="glass-strong border-gradient p-6 rounded-2xl relative overflow-hidden">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Yield Generated (24h)</span>
            <div className="mt-2 text-3xl font-extrabold tracking-tight">$184.22</div>
            <div className="mt-2 text-xs text-muted-foreground font-mono">
              Auto-compounding to capital balances
            </div>
          </div>

          <div className="glass-strong border-gradient p-6 rounded-2xl relative overflow-hidden">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Current Allocations</span>
            <div className="mt-2 text-3xl font-extrabold tracking-tight">3 Vaults</div>
            <div className="mt-2 text-xs text-primary-glow font-semibold flex items-center gap-1">
              <span>97% Cohort capacity reached</span>
            </div>
          </div>
        </section>

        {/* SECTION 2: Active Yield Allocations Table */}
        <section className="mb-8">
          <div className="glass-strong border-gradient rounded-2xl p-6 sm:p-8">
            <h3 className="text-lg font-bold text-foreground mb-4">Active Strategy Vaults</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-muted-foreground">
                <thead>
                  <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    <th className="py-3 pr-4">Asset Vault</th>
                    <th className="py-3 px-4">APY Tiers</th>
                    <th className="py-3 px-4">Balance</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 pl-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-4 pr-4 font-semibold text-foreground flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-orange-500" />
                      Bitcoin Core Vault (BTC-A)
                    </td>
                    <td className="py-4 px-4 font-mono font-semibold text-emerald-500">12.4% APY</td>
                    <td className="py-4 px-4 font-mono text-foreground font-medium">1.45 BTC ($145,000)</td>
                    <td className="py-4 px-4"><span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400 font-semibold">Compounding</span></td>
                    <td className="py-4 pl-4 text-right">
                      <a href="#adjust" className="text-xs text-primary-glow font-semibold hover:underline">Adjust Allocation</a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 font-semibold text-foreground flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-indigo-500" />
                      Ethereum Staking Vault (ETH-S)
                    </td>
                    <td className="py-4 px-4 font-mono font-semibold text-emerald-500">14.8% APY</td>
                    <td className="py-4 px-4 font-mono text-foreground font-medium">45.0 ETH ($180,000)</td>
                    <td className="py-4 px-4"><span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400 font-semibold">Compounding</span></td>
                    <td className="py-4 pl-4 text-right">
                      <a href="#adjust" className="text-xs text-primary-glow font-semibold hover:underline">Adjust Allocation</a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 font-semibold text-foreground flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Stablecoin Yield Vault (USD-C)
                    </td>
                    <td className="py-4 px-4 font-mono font-semibold text-emerald-500">18.2% APY</td>
                    <td className="py-4 px-4 font-mono text-foreground font-medium">125,290 USDC ($125,290)</td>
                    <td className="py-4 px-4"><span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400 font-semibold">Compounding</span></td>
                    <td className="py-4 pl-4 text-right">
                      <a href="#adjust" className="text-xs text-primary-glow font-semibold hover:underline">Adjust Allocation</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SECTION 3: Private Consultation & CRM Form */}
        <section id="adjust" className="max-w-2xl mx-auto mt-12">
          <div className="glass-strong border-gradient rounded-2xl p-8 relative">
            <h3 className="text-xl font-bold tracking-tight mb-2">Request Allocation Adjustment</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Request vault deposits, balance top-ups, or custom yield parameters. Your request will directly update your account manager in the CRM system and Lead Dashboard.
            </p>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-8 text-center"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary-glow">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h4 className="text-lg font-bold text-foreground">Adjustment Ticket Opened</h4>
                  <p className="mt-2 text-xs text-muted-foreground max-w-sm">
                    An advisory ticket has been synced to CRM and Lead Dashboard. Your advisor will contact you within 2 business hours.
                  </p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleAdjustAllocation} className="space-y-4">
                  <div>
                    <label className="text-[11px] font-semibold text-primary-glow tracking-wider uppercase block mb-1">Adjustment Target Vault</label>
                    <select
                      name="vault"
                      className="w-full rounded-xl border border-border bg-secondary/40 px-3.5 py-3 text-sm text-foreground outline-none transition-all duration-300 focus:border-primary/50 focus:bg-secondary/70 cursor-pointer"
                    >
                      <option value="BTC-A">Bitcoin Core Vault (BTC-A) — 12.4% APY</option>
                      <option value="ETH-S">Ethereum Staking Vault (ETH-S) — 14.8% APY</option>
                      <option value="USD-C">Stablecoin Yield Vault (USD-C) — 18.2% APY</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-primary-glow tracking-wider uppercase block mb-1">Top-Up Amount ($)</label>
                    <input
                      type="number"
                      required
                      name="amount"
                      placeholder="50,000"
                      className="w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm text-foreground outline-none transition-all duration-300 focus:border-primary/50 focus:bg-secondary/70"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-primary-glow tracking-wider uppercase block mb-1">Verification Phone Number</label>
                    <div className="flex gap-2">
                      <div className="w-1/3">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="w-full h-full rounded-xl border border-border bg-secondary/40 px-3.5 py-3 text-sm text-foreground outline-none transition-all duration-300 focus:border-primary/50 focus:bg-secondary/70 cursor-pointer"
                        >
                          {Object.values(COUNTRY_PHONE_PATTERNS).map((c) => (
                            <option key={c.code} value={c.code} className="bg-surface text-foreground">
                              {c.code} (+{c.dialCode})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-2/3">
                        <input
                          type="tel"
                          required
                          name="phone"
                          placeholder={COUNTRY_PHONE_PATTERNS[countryCode]?.placeholder || "Mobile phone"}
                          className="w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm text-foreground outline-none transition-all duration-300 focus:border-primary/50 focus:bg-secondary/70"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-primary-glow tracking-wider uppercase block mb-1">Instructions / Custom Notes</label>
                    <textarea
                      name="notes"
                      rows={3}
                      placeholder="Outline any specific parameters or request call request timeline..."
                      className="w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm text-foreground outline-none transition-all duration-300 focus:border-primary/50 focus:bg-secondary/70 resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_0_24px_rgba(123,97,255,0.3)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_36px_rgba(123,97,255,0.45)] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    >
                      {submitting ? "Opening Advisory Ticket..." : "Submit Adjustment Request"}
                      <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </div>
  );
}
