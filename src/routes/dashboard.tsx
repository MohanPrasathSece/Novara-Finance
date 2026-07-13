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
  Coins,
  Cpu,
  BarChart3,
  Lock
} from "lucide-react";
import { toast } from "sonner";
import { COUNTRY_PHONE_PATTERNS } from "@/lib/constants";
import { MagneticButton } from "@/components/landing/MagneticButton";
import { Reveal } from "@/components/landing/Reveal";

export const Route = createFileRoute("/dashboard")({
  component: DashboardComponent,
});

// A simulated live trading chart component
function LiveTradingChart() {
  const [prices, setPrices] = useState<number[]>([100, 102, 101, 104, 103, 107, 106, 110, 108, 112, 115]);
  const [activeTrade, setActiveTrade] = useState({ pair: "BTC/USDT", type: "BUY", price: 92430.50, profit: "+1.24%" });

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time compounding chart growth
      setPrices((prev) => {
        const next = [...prev.slice(1)];
        const last = prev[prev.length - 1];
        const change = (Math.random() - 0.4) * 3; // skewed slightly upwards
        next.push(Math.max(80, parseFloat((last + change).toFixed(2))));
        return next;
      });

      // Periodically update active simulation trade
      const pairs = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "USDC/DAI"];
      const types = ["BUY", "ARBITRAGE", "REBALANCE"];
      const randomPair = pairs[Math.floor(Math.random() * pairs.length)];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const basePrice = randomPair.startsWith("BTC") ? 92000 : randomPair.startsWith("ETH") ? 3400 : 140;
      const currentPrice = basePrice + (Math.random() - 0.5) * basePrice * 0.02;
      const profitVal = (Math.random() * 2.5).toFixed(2);
      
      setActiveTrade({
        pair: randomPair,
        type: randomType,
        price: parseFloat(currentPrice.toFixed(2)),
        profit: `+${profitVal}%`
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const priceRange = maxPrice - minPrice || 1;

  // Render SVG path based on prices
  const points = prices.map((price, index) => {
    const x = (index / (prices.length - 1)) * 500;
    const y = 160 - ((price - minPrice) / priceRange) * 120;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="glass-strong border-gradient p-6 rounded-2xl relative overflow-hidden h-full flex flex-col justify-between">
      <div className="absolute top-0 right-0 p-3">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Cpu className="h-4 w-4 text-primary-glow" />
          <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Algorithmic Arbitrage Engine</span>
        </div>
        <h4 className="text-lg font-bold">Active Engine Performance</h4>
        <p className="text-xs text-muted-foreground mt-1">Live compounding tracking model</p>
      </div>

      {/* Mini Trading Chart */}
      <div className="my-6 h-36 w-full relative">
        <svg viewBox="0 0 500 160" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7B61FF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#7B61FF" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(255,255,255,0.05)" />
          <line x1="0" y1="80" x2="500" y2="80" stroke="rgba(255,255,255,0.05)" />
          <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.05)" />
          
          {/* The line */}
          <polyline
            fill="none"
            stroke="#7B61FF"
            strokeWidth="3"
            points={points}
            className="transition-all duration-1000 ease-in-out"
          />
          {/* Filled Area */}
          <path
            d={`M0,160 L${points} L500,160 Z`}
            fill="url(#chartGradient)"
            className="transition-all duration-1000 ease-in-out"
          />
        </svg>
      </div>

      {/* Live status info */}
      <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4 text-xs">
        <div>
          <span className="text-muted-foreground block">System Status</span>
          <span className="font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Optimizing Yield
          </span>
        </div>
        <div>
          <span className="text-muted-foreground block">Last Operation</span>
          <span className="font-mono font-semibold text-foreground block mt-0.5">
            {activeTrade.type} {activeTrade.pair} @ {activeTrade.price}
          </span>
        </div>
      </div>
    </div>
  );
}

// Simulated active vaults dashboard allocation visualizer
function VaultAllocationVisual() {
  const [growth, setGrowth] = useState(450290);

  useEffect(() => {
    const timer = setInterval(() => {
      // Compounding simulation: increase portfolio by small amounts frequently
      setGrowth(prev => prev + parseFloat((Math.random() * 0.85).toFixed(2)));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass-strong border-gradient p-6 rounded-2xl relative overflow-hidden h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Coins className="h-4 w-4 text-primary-glow" />
          <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Compounding Vault Tier</span>
        </div>
        <h4 className="text-lg font-bold">Total Vault Balances</h4>
        <p className="text-xs text-muted-foreground mt-1">Real-time compound expansion tracking</p>
      </div>

      <div className="my-6">
        <div className="text-3xl font-mono font-extrabold tracking-tight text-white">
          ${growth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-500 font-semibold">
          <TrendingUp className="h-3.5 w-3.5 animate-bounce" />
          <span>Auto-Compounding Hourly (avg 15.1% APY)</span>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Bitcoin Core Vault (BTC-A)</span>
            <span className="text-foreground font-semibold font-mono">12.4% APY</span>
          </div>
          <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: "38%" }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Ethereum Staking Vault (ETH-S)</span>
            <span className="text-foreground font-semibold font-mono">14.8% APY</span>
          </div>
          <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
            <div className="h-full bg-primary-glow rounded-full" style={{ width: "35%" }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Stablecoin Yield Vault (USD-C)</span>
            <span className="text-foreground font-semibold font-mono">18.2% APY</span>
          </div>
          <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: "27%" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardComponent() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Investor");
  const [userEmail, setUserEmail] = useState("");
  
  // Form fields
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [countryCode, setCountryCode] = useState("CH");

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("solara_user_email") || "investor@solara.assets";
    setUserEmail(storedEmail);
    setFormEmail(storedEmail);
    
    const parts = storedEmail.split("@")[0];
    const formattedName = parts.charAt(0).toUpperCase() + parts.slice(1);
    setUserName(formattedName || "Investor");
    setFormName(formattedName || "Investor");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("solara_user_email");
    toast.success("Successfully logged out.");
    navigate({ to: "/" });
  };

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const selectedCountry = COUNTRY_PHONE_PATTERNS[countryCode] || COUNTRY_PHONE_PATTERNS.CH;
    const cleanPhone = formPhone.replace(/[^0-9+]/g, '');

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
          name: formName.trim(),
          email: formEmail.trim(),
          phone: cleanPhone,
          countryCode,
          message: formMessage.trim() || "Consultation enquiry from logged in portal",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg = errorData.error || errorData.details || "";
        
        if (response.status === 409 || errMsg.toLowerCase().includes("already") || errMsg.toLowerCase().includes("duplicate")) {
          toast.info("Your advisory enquiry has already been queued. Our managers will contact you soon.");
          setSubmitted(true);
          return;
        }
        
        throw new Error(errMsg || "Submission failed");
      }
      
      toast.success("Your contact details have been successfully synced to the CRM & Lead Dashboard.");
      setSubmitted(true);
    } catch (err: any) {
      console.error("[Logged In Contact Form] Error:", err);
      toast.error(err.message || "Failed to submit request. Please try again.");
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
                <path d="M10.5 4.5C10.5 3.5 9.7 2.5 8.5 2.5H5.5C4.3 2.5 3.5 3.5 3.5 4.5C3.5 5.5 4.3 6 5.5 6.2H8.5C9.7 6.4 10.5 6.9 10.5 7.9C10.5 8.9 9.7 9.9 8.5 9.9H5.5C4.3 9.9 3.5 8.9 3.5 7.9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-sm font-bold tracking-wider uppercase text-foreground">Solara Assets</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/5 bg-secondary/30 px-3 py-1 text-xs text-muted-foreground">
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

      {/* Welcome Banner */}
      <section className="mx-auto max-w-7xl px-6 pt-24 pb-6 sm:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-white/5 pb-6">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Welcome to the investor portal, <span className="text-gradient-violet">{userName}</span>
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Authorized access • Institutional Tier IV Custody Protocol
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 text-xs text-primary-glow font-semibold self-start sm:self-auto">
            <ShieldCheck className="h-4 w-4 animate-pulse" />
            <span>Fidelity Custody & Vault Services Active</span>
          </div>
        </div>
      </section>

      {/* Section 1: Algorithmic trading animation and Details */}
      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold text-primary-glow">
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Yield Generation Method</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
              How We Increase Your Invested Amount
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              At Solara Assets, your investment is grown through market-neutral arbitrage strategies, cross-venue spread captures, and liquidity provisioning. 
              By leveraging institutional algorithms, we identify and execute rapid trades across digital asset pairs that capture minor price differences 
              between global exchanges, guaranteeing yield and mitigating market downturns.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 pt-2">
              <div className="space-y-2">
                <h5 className="font-bold text-white flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/20 text-primary-glow text-xs">1</span>
                  Market Neutral Execution
                </h5>
                <p className="text-xs text-muted-foreground">
                  Our strategies do not take directional bets on market pricing. Instead, they benefit from volumetric volatility and structural inefficiencies.
                </p>
              </div>
              <div className="space-y-2">
                <h5 className="font-bold text-white flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/20 text-primary-glow text-xs">2</span>
                  Auto-Compounding System
                </h5>
                <p className="text-xs text-muted-foreground">
                  Arbitrage margins are re-injected automatically into active custody vaults, causing compound acceleration on your balance sheet hourly.
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 h-[340px]">
            <LiveTradingChart />
          </div>
        </div>
      </section>

      {/* Section 2: Vault Allocations & Institutional Security */}
      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8 border-t border-white/5">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-5 h-[340px] order-2 lg:order-1">
            <VaultAllocationVisual />
          </div>
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2 lg:pl-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold text-primary-glow">
              <Lock className="h-3.5 w-3.5" />
              <span>Capital Safeguard Systems</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
              Institutional Vault Security & Custody
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              We separate and lock assets into dedicated Multi-Party Computation (MPC) custody vaults. Co-custodied with Fidelity Digital Assets, 
              your allocations are secured by multi-layered institutional governance, cold storage reserves, and comprehensive insurance backing.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 pt-2">
              <div className="space-y-2">
                <h5 className="font-bold text-white flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/20 text-primary-glow text-xs">3</span>
                  Fidelity Co-Custody
                </h5>
                <p className="text-xs text-muted-foreground">
                  Assets remain housed in secure banking-grade networks with immediate clearance paths for liquidity requests.
                </p>
              </div>
              <div className="space-y-2">
                <h5 className="font-bold text-white flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/20 text-primary-glow text-xs">4</span>
                  Real-time Auditing
                </h5>
                <p className="text-xs text-muted-foreground">
                  Continuous cryptographic proof of reserves is maintained, allowing instant balance valuation audits anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation & CRM/Lead Dashboard Form Section */}
      <section className="mx-auto max-w-3xl px-6 py-16 sm:px-8 border-t border-white/5">
        <div className="glass-strong border-gradient rounded-2xl p-8 sm:p-10 relative">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-2xl font-bold tracking-tight mb-2">Speak to a Solara Assets Advisor</h3>
            <p className="text-sm text-muted-foreground">
              Request allocation adjustments, schedule premium tier yield consultations, or discuss private equity parameters.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-12 text-center"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary-glow">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-bold text-foreground">Enquiry Successfully Synced</h4>
                <p className="mt-3 text-sm text-muted-foreground max-w-md">
                  Your enquiry has been successfully linked to our CRM and CRM Lead Dashboard. A dedicated manager will contact you at <strong>{formPhone || "your registered number"}</strong> within 2 business hours.
                </p>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleContactSubmit} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-[11px] font-semibold text-primary-glow tracking-wider uppercase block mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm text-foreground outline-none transition-all duration-300 focus:border-primary/50 focus:bg-secondary/70"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-primary-glow tracking-wider uppercase block mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="e.g. investor@solara.assets"
                      className="w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm text-foreground outline-none transition-all duration-300 focus:border-primary/50 focus:bg-secondary/70"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-primary-glow tracking-wider uppercase block mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="w-1/3">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-full h-full rounded-xl border border-border bg-secondary/40 px-3.5 py-3 text-sm text-foreground outline-none transition-all duration-300 focus:border-primary/50 focus:bg-secondary/70 cursor-pointer"
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
                        required
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder={COUNTRY_PHONE_PATTERNS[countryCode]?.placeholder || "Mobile phone"}
                        className="w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm text-foreground outline-none transition-all duration-300 focus:border-primary/50 focus:bg-secondary/70"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-primary-glow tracking-wider uppercase block mb-1.5">
                    Message <span className="text-muted-foreground font-normal lowercase">(Optional)</span>
                  </label>
                  <textarea
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    rows={4}
                    placeholder="Describe any allocation targets, risk preferences, or custom timing..."
                    className="w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm text-foreground outline-none transition-all duration-300 focus:border-primary/50 focus:bg-secondary/70 resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_0_24px_rgba(123,97,255,0.3)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_36px_rgba(123,97,255,0.45)] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    {submitting ? "Submitting Enquiry..." : "Submit Consultation Request"}
                    <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
