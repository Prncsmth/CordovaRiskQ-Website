import { ArrowDown, ArrowRight, Check, MapPin } from "lucide-react";
import type { CSSProperties } from "react";
import { DownloadButton } from "@/components/download-button";
import { HeroPhone } from "@/components/hero-phone";
import { RotatingText } from "@/components/rotating-text";
import { buttonStyles } from "@/components/ui";
import { HERO_CHECKS, HERO_ROTATING } from "@/lib/content";
import { release } from "@/lib/release";
import { SITE } from "@/lib/site";

const rise = (delay: number) => ({ "--rise-delay": `${delay}ms` }) as CSSProperties;

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-[radial-gradient(110%_70%_at_70%_0%,#fdecea_0%,#fff7f5_40%,#ffffff_75%)]"
    >
      <div aria-hidden className="bg-dots absolute inset-0 -z-10" />
      <HeroRings />

      <div className="mx-auto grid max-w-6xl items-center gap-6 px-4 *:min-w-0 pt-14 pb-16 sm:px-6 sm:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-4 lg:pt-16 lg:pb-20">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <p
            className="animate-rise inline-flex items-center gap-2 rounded-full border border-brand/15 bg-white/85 px-3.5 py-1.5 font-mono text-[0.7rem] font-semibold tracking-wider text-brand-dark uppercase shadow-sm sm:text-xs"
            style={rise(0)}
          >
            <MapPin aria-hidden className="size-3.5" />
            {SITE.locality} · Android app
          </p>

          <h1
            id="hero-heading"
            className="animate-rise mt-6 font-wordmark text-[min(2.6rem,10vw)] leading-[0.98] tracking-tight text-balance text-ink uppercase sm:text-[min(3.75rem,calc(8vh+1.25rem))] lg:text-[min(4rem,5.4vw)]"
            style={rise(80)}
          >
            Emergency Assistance. <span className="text-brand">Better Coordination.</span>
          </h1>

          <p
            className="animate-rise mt-4 h-[1.3em] font-display text-xl font-semibold text-faint sm:text-2xl"
            style={rise(140)}
          >
            <RotatingText phrases={HERO_ROTATING} />
          </p>

          <p className="animate-rise mt-5 max-w-xl text-lg leading-relaxed text-pretty text-muted" style={rise(180)}>
            {SITE.name} is a geolocation-based emergency and assistance coordination system for
            Cordova, Cebu. Send an SOS, report incidents with a pinned location, find evacuation
            centers, and follow updates on your reports.
          </p>

          <ul
            className="animate-rise mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 font-mono text-xs text-muted lg:justify-start"
            style={rise(220)}
          >
            {HERO_CHECKS.map((item) => (
              <li key={item} className="inline-flex items-center gap-1.5">
                <Check aria-hidden className="size-3.5 text-success" />
                {item}
              </li>
            ))}
          </ul>

          <div className="animate-rise mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row" style={rise(260)}>
            <DownloadButton describedBy="hero-download-status" className="sm:min-w-60" />
            <a href="#showcase" className={buttonStyles.secondary}>
              See the app in action
              <ArrowRight aria-hidden className="size-4" />
            </a>
          </div>

          <p id="hero-download-status" className="animate-rise mt-4 font-mono text-xs text-muted" style={rise(260)}>
            {release.available ? (
              <>
                Version {release.version} · Released {release.releaseDateLabel}
                {release.fileSizeLabel ? ` · ${release.fileSizeLabel}` : null}
              </>
            ) : (
              "The official Android APK has not been published yet. Check back on this page for the release."
            )}
          </p>

          <a
            href="#showcase"
            className="animate-rise mt-8 hidden items-center gap-2 py-2 font-mono text-[0.7rem] font-semibold tracking-[0.18em] text-faint uppercase transition-colors hover:text-brand lg:inline-flex"
            style={rise(320)}
          >
            Scroll to explore the features
            <ArrowDown aria-hidden className="size-3.5" />
          </a>
        </div>

        <div className="animate-fade-in lg:-mr-10">
          <HeroPhone />
        </div>
      </div>
    </section>
  );
}

/** Decorative coverage rings behind the phone. Illustration only — no real location data. */
function HeroRings() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 800 800"
      className="pointer-events-none absolute top-8 left-1/2 -z-10 w-208 max-w-none -translate-x-1/2 lg:-top-16 lg:left-[72%] lg:w-240"
      fill="none"
    >
      <circle cx="400" cy="400" r="390" stroke="#c8102e" strokeOpacity="0.06" />
      <circle cx="400" cy="400" r="300" stroke="#c8102e" strokeOpacity="0.08" strokeDasharray="3 9" />
      <circle cx="400" cy="400" r="210" stroke="#c8102e" strokeOpacity="0.1" />
      <circle className="radius-pulse" cx="400" cy="400" r="330" stroke="#c8102e" strokeOpacity="0.18" strokeWidth="1.5" />
    </svg>
  );
}
