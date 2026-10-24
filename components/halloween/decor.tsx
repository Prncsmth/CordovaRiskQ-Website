import type { CSSProperties } from "react";

const BAT_PATH =
  "M50 15 C48 11 46 11 45 14 C39 8 29 6 18 10 C24 12 26 16 24 20 C20 18 13 18 7 22 C14 22 18 26 18 31 C26 25 36 24 44 27 C46 31 48 33 50 33 C52 33 54 31 56 27 C64 24 74 25 82 31 C82 26 86 22 93 22 C87 18 80 18 76 20 C74 16 76 12 82 10 C71 6 61 8 55 14 C54 11 52 11 50 15 Z M46 13 L45 8 L48 12 Z M54 13 L55 8 L52 12 Z";

// top (% of hero), size (px), duration (s), delay (s), direction
const BATS: [number, number, number, number, 1 | -1][] = [
  [14, 46, 15, 0, 1],
  [24, 30, 19, 3.5, 1],
  [9, 22, 22, 7, -1],
  [36, 38, 17, 10, -1],
  [18, 26, 24, 13, 1],
  [44, 20, 21, 5, 1],
];

/** Bats flapping across the screen now and then. */
export function Bats() {
  return (
    <div aria-hidden className="hw-only hw-bats pointer-events-none absolute inset-0 overflow-hidden">
      {BATS.map(([top, size, dur, delay, dir], i) => (
        <span
          key={i}
          className="hw-bat"
          style={
            {
              top: `${top}%`,
              width: size,
              "--bat-dur": `${dur}s`,
              "--bat-delay": `${delay}s`,
              "--bat-dir": dir,
            } as CSSProperties
          }
        >
          <svg viewBox="0 0 100 40" className="hw-bat-wings">
            <path d={BAT_PATH} />
          </svg>
        </span>
      ))}
    </div>
  );
}

/** Slow fog drifting along the bottom edge. */
export function Fog({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`hw-only pointer-events-none absolute inset-x-0 bottom-0 h-56 overflow-hidden ${className}`}>
      <div className="hw-fog hw-fog-a" />
      <div className="hw-fog hw-fog-b" />
    </div>
  );
}

/** A real cobweb photo tucked into a corner. */
export function CobwebCorner({ corner }: { corner: "tl" | "tr" | "bl" | "br" }) {
  return <div aria-hidden className={`hw-only hw-web hw-web-${corner} pointer-events-none absolute`} />;
}

// Deterministic pseudo-random numbers so the blood looks hand-made but never
// changes between server and browser renders.
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const BLOOD_W = 1600;
const BLOOD_H = 120;

/**
 * Builds one organic blood shape: a lumpy band along the top, with drips of
 * different thickness that wobble and lean as they run, ending in heavy drops.
 */
function organicBlood(seed: number) {
  const r = rng(seed);
  const beads: { x: number; y: number; rx: number; ry: number }[] = [];
  let d = `M0 -4 L${BLOOD_W} -4 L${BLOOD_W} ${6 + r() * 6}`;
  let x = BLOOD_W;
  while (x > 30) {
    // Lumpy edge between drips.
    const gap = 30 + r() * 110;
    const nx = Math.max(0, x - gap);
    const base = 6 + r() * 9;
    d += ` C${(x - gap * 0.3).toFixed(1)} ${(base + 4 + r() * 5).toFixed(1)} ${(nx + gap * 0.3).toFixed(1)} ${(base - 2).toFixed(1)} ${nx.toFixed(1)} ${base.toFixed(1)}`;
    x = nx;
    if (x < 40) break;

    // A drip: sometimes a short blob, sometimes a long thin run.
    const long = r() < 0.4;
    const w = long ? 7 + r() * 9 : 5 + r() * 7;
    const len = long ? 40 + r() * 70 : 6 + r() * 26;
    const lean = (r() - 0.5) * (long ? 18 : 6);
    const wob = (r() - 0.5) * (long ? 10 : 3);
    const top = base;
    const tipX = x - w / 2 + lean;
    const tipY = top + len;
    const neck = w * (0.45 + r() * 0.2);
    // Right edge going down, with a wobble halfway.
    d += ` C${(x - w * 0.15).toFixed(1)} ${(top + 2).toFixed(1)} ${(x - w * 0.5 + neck / 2 + wob).toFixed(1)} ${(top + len * 0.45).toFixed(1)} ${(tipX + neck / 2).toFixed(1)} ${(tipY - w * 0.8).toFixed(1)}`;
    // Heavy drop at the end.
    const bulb = w * (0.7 + r() * 0.35);
    d += ` C${(tipX + bulb * 1.25).toFixed(1)} ${(tipY - w * 0.2).toFixed(1)} ${(tipX + bulb).toFixed(1)} ${(tipY + bulb * 1.15).toFixed(1)} ${tipX.toFixed(1)} ${(tipY + bulb * 1.15).toFixed(1)}`;
    d += ` C${(tipX - bulb).toFixed(1)} ${(tipY + bulb * 1.15).toFixed(1)} ${(tipX - bulb * 1.25).toFixed(1)} ${(tipY - w * 0.2).toFixed(1)} ${(tipX - neck / 2).toFixed(1)} ${(tipY - w * 0.8).toFixed(1)}`;
    // Left edge back up into the band.
    const lx = x - w;
    d += ` C${(lx + w * 0.5 - neck / 2 + wob * 0.6).toFixed(1)} ${(top + len * 0.45).toFixed(1)} ${(lx + w * 0.15).toFixed(1)} ${(top + 2).toFixed(1)} ${(lx - w * 0.6).toFixed(1)} ${top.toFixed(1)}`;
    x = lx - w * 0.6;
    if (long && r() < 0.6) beads.push({ x: tipX, y: tipY + bulb * 0.6, rx: bulb * 0.55, ry: bulb * 0.75 });
  }
  d += ` L0 ${(6 + r() * 6).toFixed(1)} Z`;
  return { d, beads };
}

const NAV_BLOOD = organicBlood(20261031);

/**
 * Thick, glossy, wet blood running down from the bottom of the navbar. A
 * lighting filter gives it the shine of real liquid.
 */
export function BloodDrips({ className = "" }: { className?: string }) {
  const id = "hw-blood";
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${BLOOD_W} ${BLOOD_H}`}
      preserveAspectRatio="xMidYMin slice"
      className={`hw-only hw-blood pointer-events-none overflow-visible ${className}`}
    >
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5e0007" />
          <stop offset="18%" stopColor="#a8000b" />
          <stop offset="100%" stopColor="#7a0008" />
        </linearGradient>
        {/* Wet shine: light the shape as if it were a raised, glossy liquid. */}
        <filter id={`${id}-gloss`} x="-5%" y="-20%" width="110%" height="160%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2.4" result="blur" />
          <feSpecularLighting in="blur" surfaceScale="7" specularConstant="1.15" specularExponent="30" lightingColor="#ffe0e0" result="spec">
            <fePointLight x="-300" y="-400" z="300" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn" />
          <feDiffuseLighting in="blur" surfaceScale="4" diffuseConstant="0.95" lightingColor="#ffffff" result="diff">
            <feDistantLight azimuth="235" elevation="55" />
          </feDiffuseLighting>
          <feComposite in="SourceGraphic" in2="diff" operator="arithmetic" k1="1.1" k2="0" k3="0" k4="0" result="lit" />
          <feComposite in="lit" in2="SourceAlpha" operator="in" result="litIn" />
          <feComposite in="litIn" in2="specIn" operator="arithmetic" k1="0" k2="1" k3="0.8" k4="0" />
        </filter>
      </defs>
      <g filter={`url(#${id}-gloss)`}>
        <path className="hw-blood-run" d={NAV_BLOOD.d} fill={`url(#${id}-fill)`} />
        {NAV_BLOOD.beads.map((b, i) => (
          <ellipse
            key={i}
            className="hw-bead"
            style={{ "--drip-delay": `${(i % 4) * 1.3}s` } as CSSProperties}
            cx={b.x}
            cy={b.y}
            rx={b.rx}
            ry={b.ry}
            fill="#a8000b"
          />
        ))}
      </g>
    </svg>
  );
}

/** A spider hanging on its thread, slowly bobbing. */
export function HangingSpider({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`hw-only hw-spider pointer-events-none absolute ${className}`}>
      <div className="hw-spider-thread" />
      <svg viewBox="0 0 120 110" className="hw-spider-body">
        <defs>
          <radialGradient id="hw-spider-sheen" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#5a1a1e" />
            <stop offset="45%" stopColor="#1a0608" />
            <stop offset="100%" stopColor="#020101" />
          </radialGradient>
        </defs>
        <g fill="none" stroke="#070203" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M52 44 C38 30 22 26 8 34" />
          <path d="M50 50 C34 44 18 46 4 58" />
          <path d="M50 56 C36 60 22 70 12 88" />
          <path d="M53 61 C44 72 38 86 34 104" />
          <path d="M68 44 C82 30 98 26 112 34" />
          <path d="M70 50 C86 44 102 46 116 58" />
          <path d="M70 56 C84 60 98 70 108 88" />
          <path d="M67 61 C76 72 82 86 86 104" />
        </g>
        <ellipse cx="60" cy="38" rx="11" ry="10" fill="url(#hw-spider-sheen)" />
        <ellipse cx="60" cy="66" rx="17" ry="21" fill="url(#hw-spider-sheen)" />
        <path d="M56 58 L64 58 L60 66 L64 74 L56 74 L60 66 Z" fill="#b3000f" />
        <circle cx="56" cy="34" r="1.6" fill="#ff3b3b" />
        <circle cx="64" cy="34" r="1.6" fill="#ff3b3b" />
      </svg>
    </div>
  );
}

/** Glowing eyes watching from the dark; they blink now and then. */
export function LurkingEyes({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <div
      aria-hidden
      className={`hw-only hw-eyes pointer-events-none absolute ${className}`}
      style={{ "--eyes-delay": `${delay}s` } as CSSProperties}
    >
      <span />
      <span />
    </div>
  );
}

/** Between sections: glowing eyes watching from the dark. */
export function HorrorDivider({ eyes = "right" }: { eyes?: "left" | "right" }) {
  return (
    <div aria-hidden className="hw-only relative z-[2] h-0">
      <LurkingEyes
        className={eyes === "left" ? "top-24 left-[6%]" : "top-28 right-[7%]"}
        delay={eyes === "left" ? 1.5 : 4}
      />
    </div>
  );
}
