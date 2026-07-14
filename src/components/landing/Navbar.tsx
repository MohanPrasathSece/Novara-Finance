import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const links = [
  { label: "Home", href: "#home" },
  { label: "Solutions", href: "#solutions" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isHome, setIsHome] = useState(true);

  useEffect(() => {
    setIsHome(window.location.pathname === "/");
    setIsLoggedIn(!!localStorage.getItem("solara_user_email"));

    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("solara_user_email");
    setIsLoggedIn(false);
    toast.success("Successfully logged out.");
    window.location.href = "/";
  };

  const getHref = (href: string) => {
    if (isHome) return href;
    if (href === "#home") return "/";
    return `/${href}`;
  };

  return (
    <motion.header
      initial={{ y: -32, opacity: 0, filter: "blur(8px)" }}
      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.9, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="fixed inset-x-0 top-10 z-50 flex justify-center px-4"
    >
      <nav
        className={cn(
          "flex w-full max-w-4xl items-center justify-between rounded-full px-5 py-2.5 transition-all duration-500",
          scrolled ? "glass-strong shadow-float" : "glass",
        )}
        aria-label="Main navigation"
      >
        <a href={getHref("#home")} className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary shadow-[0_0_20px_-4px_oklch(0.58_0.21_285)]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M10.5 4.5C10.5 3.5 9.7 2.5 8.5 2.5H5.5C4.3 2.5 3.5 3.5 3.5 4.5C3.5 5.5 4.3 6 5.5 6.2H8.5C9.7 6.4 10.5 6.9 10.5 7.9C10.5 8.9 9.7 9.9 8.5 9.9H5.5C4.3 9.9 3.5 8.9 3.5 7.9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-[15px] font-semibold tracking-tight">Solara Assets</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={getHref(l.href)}
                className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors duration-300 hover:bg-secondary hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <a
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                Dashboard
              </a>
              <button
                onClick={handleLogout}
                className="rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs font-medium text-foreground hover:bg-white/10 transition-all cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { tab: "login" } }))}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 cursor-pointer"
              >
                Log In
              </button>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { tab: "signup" } }))}
                className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-[0_0_24px_-6px_oklch(0.58_0.21_285/70%)] transition-all duration-300 hover:shadow-[0_0_36px_-6px_oklch(0.58_0.21_285)] hover:brightness-110 cursor-pointer"
              >
                Start Investing
              </button>
            </>
          )}
        </div>
      </nav>
    </motion.header>
  );
}
