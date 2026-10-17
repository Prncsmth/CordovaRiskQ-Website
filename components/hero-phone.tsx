"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import phone from "@/public/brand/app-home-phone.png";
import mapScreen from "@/public/brand/guide/map-screen.jpg";

/*
 * Geometry of the real app screenshot in public/brand/app-home-phone.png
 * (1560 × 1536 px; overlay coordinates below use half that scale,
 * 780 × 768, matching the SVG viewBox). The phone is rendered tilted in perspective; its top edge
 * runs along U and its left edge along V:
 *   U = (0.992, 0.127)   V = (-0.381, 0.925)
 * STRAIGHTEN is the inverse of [U V], so applying it stands the phone upright.
 * Callout labels are drawn with the forward matrix [U V] so they end up level
 * once the phone is straightened.
 */
const STRAIGHTEN = "matrix(0.958, -0.131, 0.394, 1.027, 0, 0)";
const TILT = "matrix(0.992 0.127 -0.381 0.925 0 0)";

/** Highlighted region, in viewBox units. */
const SOS = { cx: 413, cy: 327, w: 232, h: 44, angle: 7.5 };

export function HeroPhone() {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [inViewOnTouch, setInViewOnTouch] = useState(false);

  // Touch screens have no hover: straighten once the phone scrolls into view.
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: none)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInViewOnTouch(entry?.isIntersecting ?? false),
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const active = hovered || inViewOnTouch;

  return (
    <figure
      ref={ref}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(event) => event.pointerType === "mouse" && setHovered(false)}
      data-active={active || undefined}
      // The image has generous transparent margins around the phone, so it is
      // drawn wider than its column; the hero clips anything past the viewport.
      className="phone-figure group relative left-1/2 w-[150%] max-w-[min(46rem,130vh)] -translate-x-1/2 select-none sm:w-[120%] lg:w-[130%]"
    >
      <div className="phone-float">
        <div
          className="phone-stage relative"
          style={{ transform: active ? STRAIGHTEN : "matrix(1, 0, 0, 1, 0, 0)" }}
        >
          <Image
            src={phone}
            alt="CORDOVA RISKQ app home screen with the tide level, the Slide to Send SOS button and the nearest evacuation center"
            priority
            quality={90}
            sizes="(min-width: 1024px) 46rem, 150vw"
            className="h-auto w-full"
            draggable={false}
          />

          <svg
            aria-hidden
            viewBox="0 0 780 768"
            className="pointer-events-none absolute inset-0 size-full overflow-visible"
          >
            <defs>
              <filter id="phone-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" />
              </filter>
            </defs>

            <Highlight region={SOS} delay={0} />

            {/* "Slide to Send SOS" callout: below the button on phones (no room beside it)… */}
            <g className="sm:hidden" transform={`translate(${SOS.cx - 30} ${SOS.cy + 12}) ${TILT}`}>
              <g className="phone-callout" style={{ transitionDelay: "380ms" }}>
                <line x1="0" y1="8" x2="0" y2="34" stroke="#c8102e" strokeWidth="2" strokeDasharray="3 4" />
                <circle cx="0" cy="8" r="4" fill="#c8102e" />
                <rect x="-84" y="34" width="168" height="34" rx="17" fill="#c8102e" />
                <text x="0" y="56" textAnchor="middle" className="phone-callout-text" fill="#ffffff">
                  Slide to Send SOS
                </text>
              </g>
            </g>

            {/* …and to the right of it on wider screens. */}
            <g className="max-sm:hidden" transform={`translate(${SOS.cx + SOS.w / 2 - 4} ${SOS.cy + 14}) ${TILT}`}>
              <g className="phone-callout" style={{ transitionDelay: "380ms" }}>
                <line x1="4" y1="0" x2="58" y2="0" stroke="#c8102e" strokeWidth="2" strokeDasharray="3 4" />
                <circle cx="4" cy="0" r="4" fill="#c8102e" />
                <rect x="58" y="-17" width="168" height="34" rx="17" fill="#c8102e" />
                <text x="142" y="5" textAnchor="middle" className="phone-callout-text" fill="#ffffff">
                  Slide to Send SOS
                </text>
              </g>
            </g>

          </svg>
        </div>
      </div>
    </figure>
  );
}

function Highlight({ region, delay }: { region: typeof SOS; delay: number }) {
  const { cx, cy, w, h, angle } = region;
  const rect = { x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx: h / 2 };
  return (
    <g transform={`rotate(${angle} ${cx} ${cy})`}>
      <g className="phone-highlight" style={{ transitionDelay: `${200 + delay}ms` }}>
        <rect {...rect} fill="none" stroke="#c8102e" strokeWidth="8" opacity="0.55" filter="url(#phone-glow)" />
        <rect {...rect} fill="none" stroke="#c8102e" strokeWidth="3" />
        <rect {...rect} className="phone-highlight-pulse" fill="none" stroke="#c8102e" strokeWidth="2" />
      </g>
    </g>
  );
}

/**
 * Second phone beside the hero phone: the real Map tab (evacuation centers),
 * with the nearest center's pin and the Map tab highlighted.
 */
export function HeroMapPhone({ className }: { className?: string }) {
  return (
    <figure className={className}>
      <div className="phone-float [animation-delay:-3s]">
        <div className="relative rotate-[-9deg] overflow-hidden rounded-[2rem] border-[6px] border-ink bg-ink shadow-[0_40px_60px_-30px_rgba(23,24,26,0.6)]">
          <div className="relative overflow-hidden rounded-[1.55rem]">
            <Image
              src={mapScreen}
              alt="CORDOVA RISKQ Map tab showing the nearest evacuation center pin"
              sizes="(min-width: 1024px) 15rem, 34vw"
              className="block h-auto w-full"
              draggable={false}
            />
            {/* Pulsing ring on the evacuation center pin. */}
            <span aria-hidden className="absolute top-[46%] left-1/2 aspect-square w-[22%] -translate-x-1/2 -translate-y-1/2">
              <span className="absolute inset-0 rounded-full border-2 border-success bg-success/15" />
              <span className="map-pin-pulse absolute inset-0 rounded-full border-2 border-success" />
            </span>
            {/* Map tab highlighted in the bottom bar. */}
            <span
              aria-hidden
              className="absolute top-[93.8%] left-[32.2%] h-[8%] w-[19%] -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-white shadow-[0_0_14px_rgba(255,255,255,0.9)]"
            />
          </div>
        </div>
        <figcaption className="absolute -top-[7%] left-[4%] rotate-[-9deg] rounded-full bg-success px-3 py-1.5 font-mono text-[0.62rem] font-semibold tracking-wide whitespace-nowrap text-white uppercase shadow-lg sm:text-xs">
          Evacuation map
        </figcaption>
      </div>
    </figure>
  );
}
