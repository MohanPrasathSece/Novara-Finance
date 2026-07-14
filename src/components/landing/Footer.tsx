import { Github, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background py-12 relative z-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row text-center sm:text-left">
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M10.5 4.5C10.5 3.5 9.7 2.5 8.5 2.5H5.5C4.3 2.5 3.5 3.5 3.5 4.5C3.5 5.5 4.3 6 5.5 6.2H8.5C9.7 6.4 10.5 6.9 10.5 7.9C10.5 8.9 9.7 9.9 8.5 9.9H5.5C4.3 9.9 3.5 8.9 3.5 7.9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-sm font-semibold tracking-tight text-white">Solara Assets</span>
        </div>

        <p className="text-[13px] text-white/90">
          © {new Date().getFullYear()} Solara Assets Digital Asset Management. All rights reserved.
        </p>

        <div className="flex items-center gap-6">
          <a href="/privacy" className="text-[13px] text-white hover:text-primary-glow font-medium transition-colors">
            Privacy Policy
          </a>
          <a href="/terms" className="text-[13px] text-white hover:text-primary-glow font-medium transition-colors">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
