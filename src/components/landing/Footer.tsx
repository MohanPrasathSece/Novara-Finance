import { Github, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M10.5 4.5C10.5 3.5 9.7 2.5 8.5 2.5H5.5C4.3 2.5 3.5 3.5 3.5 4.5C3.5 5.5 4.3 6 5.5 6.2H8.5C9.7 6.4 10.5 6.9 10.5 7.9C10.5 8.9 9.7 9.9 8.5 9.9H5.5C4.3 9.9 3.5 8.9 3.5 7.9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-sm font-semibold tracking-tight">Solara Assets</span>
        </div>

        <p className="text-[13px] text-muted-foreground">
          © {new Date().getFullYear()} Solara Assets Digital Asset Management. All rights reserved.
        </p>

        <div className="flex items-center gap-6">
          <a href="#" className="text-[13px] text-muted-foreground transition-colors hover:text-foreground">
            Privacy
          </a>
          <a href="#" className="text-[13px] text-muted-foreground transition-colors hover:text-foreground">
            Terms
          </a>
          <div className="flex items-center gap-3">
            {[
              { Icon: Twitter, label: "Twitter" },
              { Icon: Linkedin, label: "LinkedIn" },
              { Icon: Github, label: "GitHub" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="text-muted-foreground/60 transition-colors duration-300 hover:text-primary-glow"
              >
                <Icon className="h-4 w-4" aria-hidden />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
