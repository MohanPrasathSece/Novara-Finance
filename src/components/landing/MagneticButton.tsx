import { useRef, type ReactNode, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "ghost";
  size?: "md" | "lg";
};

export function MagneticButton({
  children,
  variant = "primary",
  size = "lg",
  className,
  ...rest
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const inner = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate3d(${x * 0.22}px, ${y * 0.28}px, 0)`;
    if (inner.current)
      inner.current.style.transform = `translate3d(${x * 0.08}px, ${y * 0.1}px, 0)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate3d(0,0,0)";
    if (inner.current) inner.current.style.transform = "translate3d(0,0,0)";
  };

  return (
    <button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[transform,box-shadow,background-color,border-color] duration-300 ease-out will-change-transform",
        size === "lg" ? "px-8 py-4 text-[15px]" : "px-6 py-3 text-sm",
        variant === "primary"
          ? "bg-primary text-primary-foreground shadow-[0_0_0_1px_oklch(1_0_0/10%)_inset,0_8px_32px_-8px_oklch(0.58_0.21_285/60%)] hover:shadow-[0_0_0_1px_oklch(1_0_0/16%)_inset,0_12px_48px_-8px_oklch(0.58_0.21_285/80%)]"
          : "glass text-foreground hover:border-strong hover:bg-card",
        className,
      )}
      {...rest}
    >
      <span
        ref={inner}
        className="relative z-10 inline-flex items-center gap-2 transition-transform duration-300 ease-out"
      >
        {children}
      </span>
      {variant === "primary" && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-gradient-to-b from-primary-glow/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}
    </button>
  );
}
