import Image from "next/image";
import type { ReactNode } from "react";
import { SITE } from "@/lib/site";
import logo from "@/public/brand/riskq-logo.png";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface LogoProps {
  className?: string;
  priority?: boolean;
  /** Smaller wordmark on narrow screens, hidden below 380px (the header uses this). */
  compact?: boolean;
}

export function Logo({ className, priority, compact }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Image src={logo} alt="" width={36} height={37} priority={priority} className="size-9 object-contain" />
      <span
        className={cn(
          "font-wordmark leading-none tracking-tight text-ink",
          compact ? "hidden text-[0.9rem] min-[380px]:inline sm:text-[1.05rem]" : "text-[1.05rem]",
        )}
      >
        {SITE.name}
      </span>
    </span>
  );
}

const BUTTON_BASE =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-[0.95rem] font-semibold transition duration-200 ease-out-soft";

export const buttonStyles = {
  primary: cn(
    BUTTON_BASE,
    "bg-brand text-white shadow-[0_1px_2px_rgba(156,12,36,0.25)]",
    "hover:-translate-y-px hover:bg-brand-dark hover:shadow-[0_6px_16px_-6px_rgba(156,12,36,0.45)]",
    "active:translate-y-0 active:scale-[0.98] active:shadow-none",
  ),
  secondary: cn(
    BUTTON_BASE,
    "border border-line bg-white text-ink",
    "hover:-translate-y-px hover:border-faint hover:bg-surface",
    "active:translate-y-0 active:scale-[0.98]",
  ),
  disabled: cn(
    BUTTON_BASE,
    "cursor-not-allowed border border-dashed border-faint bg-surface text-muted",
  ),
} as const;

interface SectionProps {
  id: string;
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Section({ id, eyebrow, title, intro, children, className }: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className={cn("py-20 sm:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-wide text-brand uppercase">{eyebrow}</p>
          <h2
            id={headingId}
            className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-ink sm:text-4xl"
          >
            {title}
          </h2>
          {intro ? <p className="mt-4 text-lg leading-relaxed text-pretty text-muted">{intro}</p> : null}
        </div>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}
