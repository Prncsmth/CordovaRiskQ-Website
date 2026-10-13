import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import type { CSSProperties } from "react";
import { DownloadButton } from "@/components/download-button";
import { buttonStyles } from "@/components/ui";
import { release } from "@/lib/release";
import { SITE } from "@/lib/site";
import logo from "@/public/brand/riskq-logo.png";

const rise = (delay: number) => ({ "--rise-delay": `${delay}ms` }) as CSSProperties;

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-[radial-gradient(120%_80%_at_85%_10%,#fdecea_0%,#fff7f5_38%,#ffffff_70%)]"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-14 pb-20 sm:px-6 sm:pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:pt-24 lg:pb-28">
        <div>
          <p
            className="animate-rise inline-flex items-center gap-2 rounded-full border border-brand/15 bg-white/80 px-3 py-1 text-sm font-medium text-brand-dark"
            style={rise(0)}
          >
            <MapPin aria-hidden className="size-4" />
            {SITE.locality} · Android app
          </p>

          <h1
            id="hero-heading"
            className="animate-rise mt-5 font-display text-4xl leading-[1.08] font-bold tracking-tight text-balance text-ink sm:text-5xl lg:text-6xl"
            style={rise(80)}
          >
            Emergency Assistance. <span className="text-brand">Better Coordination.</span>
          </h1>

          <p
            className="animate-rise mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted"
            style={rise(160)}
          >
            {SITE.name} is a geolocation-based emergency and assistance coordination system for
            Cordova, Cebu. Send an SOS, report incidents with a pinned location, find evacuation
            centers, and follow updates on your reports.
          </p>

          <div className="animate-rise mt-8 flex flex-col gap-3 sm:flex-row" style={rise(240)}>
            <DownloadButton describedBy="hero-download-status" />
            <a href="#how-it-works" className={buttonStyles.secondary}>
              How it works
              <ArrowRight aria-hidden className="size-4" />
            </a>
          </div>

          <p id="hero-download-status" className="animate-rise mt-4 text-sm text-muted" style={rise(240)}>
            {release.available ? (
              <>
                Version {release.version} · Released {release.releaseDateLabel}
                {release.fileSizeLabel ? ` · ${release.fileSizeLabel}` : null}
              </>
            ) : (
              "The official Android APK has not been published yet. Check back on this page for the release."
            )}
          </p>
        </div>

        <div className="animate-rise relative mx-auto w-full max-w-[26rem]" style={rise(160)}>
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}

/**
 * Brand mark inside a decorative coverage ring. Purely illustrative — it does
 * not show, simulate or imply any real location or responder tracking.
 */
function HeroIllustration() {
  return (
    <div className="relative aspect-square">
      <svg aria-hidden viewBox="0 0 400 400" className="absolute inset-0 size-full" fill="none">
        <circle cx="200" cy="200" r="196" stroke="#e6e9eb" strokeDasharray="4 8" />
        <circle cx="200" cy="200" r="160" stroke="#eef1f2" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="160" fill="#c8102e" fillOpacity="0.03" />
        <circle className="radius-pulse" cx="200" cy="200" r="168" stroke="#c8102e" strokeOpacity="0.35" strokeWidth="1.5" />
      </svg>

      <div className="absolute inset-[17%] flex items-center justify-center rounded-full border border-line bg-white shadow-[0_24px_60px_-28px_rgba(23,24,26,0.35)]">
        <Image
          src={logo}
          alt={`${SITE.name} logo`}
          priority
          sizes="(min-width: 1024px) 220px, 50vw"
          className="w-[72%] object-contain"
        />
      </div>

      <span
        aria-hidden
        className="absolute top-[9%] right-[13%] flex size-10 items-center justify-center rounded-full border border-line bg-white text-tide shadow-sm"
      >
        <MapPin className="size-5" />
      </span>
    </div>
  );
}
