import Image from "next/image";
import type { ReactNode } from "react";
import { Reveal } from "@/components/reveal";
import { SITE } from "@/lib/site";
import seal from "@/public/brand/cordova-seal.png";
import logo from "@/public/brand/riskq-logo.png";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface LogoProps {
  className?: string;
  priority?: boolean;
}

/**
 * Brand lockup matching the app's HomeHeader: the RiskQ mark beside a stacked
 * Archivo Black wordmark — "CORDOVA" (with the Cordova seal as its O) in
 * primary red, "RISKQ" in secondary orange.
 */
export function Logo({ className, priority }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Image src={logo} alt="" width={40} height={41} priority={priority} className="h-10 w-auto" />
      <span className="flex flex-col font-wordmark text-[1.2rem] leading-[0.92] tracking-tighter uppercase">
        <span className="sr-only">{SITE.name}</span>
        {/* "C◉RDOVA": the municipal seal stands in for the O, as in the app header. */}
        <span aria-hidden className="flex items-center text-brand">
          C
          <Image src={seal} alt="" width={48} height={48} priority={priority} className="mx-[-0.03em] size-[0.92em]" />
          RDOVA
        </span>
        <span aria-hidden className="text-brand-secondary">
          RiskQ
        </span>
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

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.14em] text-brand uppercase",
        className,
      )}
    >
      <span aria-hidden className="eyebrow-line h-px w-6 bg-brand/60" />
      {children}
    </p>
  );
}

interface SectionProps {
  id?: string;
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
  className?: string;
  centered?: boolean;
}

export function Section({ id, eyebrow, title, intro, children, className, centered }: SectionProps) {
  const headingId = `${id ?? eyebrow.toLowerCase().replace(/\W+/g, "-")}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className={cn("py-20 sm:py-28", className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className={cn("max-w-3xl", centered && "mx-auto text-center")}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2
            id={headingId}
            className="mt-4 font-display text-3xl leading-[1.1] font-bold tracking-tight text-balance text-ink sm:text-[2.75rem]"
          >
            {title}
          </h2>
          {intro ? <p className="mt-5 text-lg leading-relaxed text-pretty text-muted">{intro}</p> : null}
        </Reveal>
        <div className="mt-12 sm:mt-14">{children}</div>
      </div>
    </section>
  );
}
