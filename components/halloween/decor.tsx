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
const BLOOD_H = 200;

type LiveDrip = {
  stem: string;
  beads: { cx: number; cy: number; rx: number; ry: number }[];
  x: number;
  tipY: number;
  w: number;
  len: number;
  dur: number;
  delay: number;
};

/**
 * Real-looking spilled blood: an uneven splash along the top (thick pools and
 * thin smears), very thin drips that bead up as they run, heavy teardrop
 * tips, and fine spatter around it.
 */
function buildNavBlood(seed: number) {
  const r = rng(seed);

  // Where the drips hang; the splash is thicker (a pool) above each one.
  const dripXs: number[] = [];
  for (let x = 40 + r() * 60; x < BLOOD_W - 40; x += 70 + r() * 130) dripXs.push(x);
  const poolDepth = (x: number) =>
    dripXs.reduce((m, dx) => Math.max(m, 18 * Math.exp(-(((x - dx) / 34) ** 2))), 0);

  // Uneven lower edge of the splash.
  const pts: [number, number][] = [];
  for (let x = BLOOD_W; x >= 0; x -= 14) {
    const base = 3 + r() * 5 + (r() < 0.12 ? r() * 9 : 0);
    pts.push([x, base + poolDepth(x)]);
  }
  let band = `M0 -4 L${BLOOD_W} -4 L${BLOOD_W} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1];
    const [x, y] = pts[i];
    band += ` Q${px.toFixed(1)} ${py.toFixed(1)} ${((px + x) / 2).toFixed(1)} ${((py + y) / 2).toFixed(1)}`;
  }
  band += ` L0 ${pts[pts.length - 1][1].toFixed(1)} Z`;

  const drips: LiveDrip[] = dripXs.map((x) => {
    const top = poolDepth(x) - 2;
    const long = r() < 0.6;
    const w = long ? 2.6 + r() * 3 : 3.5 + r() * 3;
    const len = long ? 55 + r() * 110 : 14 + r() * 30;
    const curve = (r() - 0.5) * (long ? 12 : 4);
    const tipX = x + curve * 0.6;
    const tipY = top + len;
    const tear = w * (1.5 + r() * 0.6);
    // A thin stem flaring into the pool, then a long teardrop at the end.
    const stem =
      `M${(x - w * 2.2).toFixed(1)} ${(top - 3).toFixed(1)}` +
      ` C${(x - w * 0.6).toFixed(1)} ${top.toFixed(1)} ${(x - w / 2 + curve).toFixed(1)} ${(top + len * 0.5).toFixed(1)} ${(tipX - w * 0.42).toFixed(1)} ${tipY.toFixed(1)}` +
      ` L${(tipX + w * 0.42).toFixed(1)} ${tipY.toFixed(1)}` +
      ` C${(x + w / 2 + curve).toFixed(1)} ${(top + len * 0.5).toFixed(1)} ${(x + w * 0.6).toFixed(1)} ${top.toFixed(1)} ${(x + w * 2.2).toFixed(1)} ${(top - 3).toFixed(1)} Z`;
    // Beads where the blood gathers along long drips.
    const beads = long
      ? Array.from({ length: 1 + Math.floor(r() * 2) }, () => {
          const t = 0.35 + r() * 0.4;
          return { cx: x + curve * t * 0.8, cy: top + len * t, rx: w * 0.85, ry: w * 1.3 };
        })
      : [];
    return { stem, beads, x: tipX, tipY: tipY + tear * 0.5, w: tear, len, dur: 6 + r() * 7, delay: -r() * 12 };
  });

  // Fine spatter flung around the splash.
  const spatter = Array.from({ length: 46 }, () => ({
    cx: r() * BLOOD_W,
    cy: 6 + r() * 34,
    rr: 0.8 + r() ** 2 * 3.2,
  }));

  return { band, drips, spatter };
}

const NAV_BLOOD = buildNavBlood(20261031);

/** A drop of size t centred on the origin, pointed at the top where it hangs from the drip. */
function teardrop(t: number) {
  const f = (n: number) => (n * t).toFixed(2);
  return `M0 ${f(-1.7)} C${f(0.35)} ${f(-1.0)} ${f(1.0)} ${f(-0.4)} ${f(0.95)} ${f(0.25)} C${f(0.9)} ${f(0.95)} ${f(0.45)} ${f(1.15)} 0 ${f(1.15)} C${f(-0.45)} ${f(1.15)} ${f(-0.9)} ${f(0.95)} ${f(-0.95)} ${f(0.25)} C${f(-1.0)} ${f(-0.4)} ${f(-0.35)} ${f(-1.0)} 0 ${f(-1.7)} Z`;
}

/**
 * Spilled blood running from the bottom of the navbar. Each drip slowly
 * stretches, lets a drop go that falls down the screen, then fills again.
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
          <stop offset="0%" stopColor="#3d0002" />
          <stop offset="12%" stopColor="#6e0005" />
          <stop offset="45%" stopColor="#930009" />
          <stop offset="100%" stopColor="#7a0006" />
        </linearGradient>
        <radialGradient id={`${id}-drop`} cx="38%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#e86060" />
          <stop offset="20%" stopColor="#a8000b" />
          <stop offset="100%" stopColor="#4a0004" />
        </radialGradient>
        {/* Subtle wet shine, like real blood rather than paint. */}
        <filter id={`${id}-gloss`} x="-5%" y="-20%" width="110%" height="220%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.6" result="blur" />
          <feSpecularLighting in="blur" surfaceScale="5" specularConstant="0.85" specularExponent="38" lightingColor="#ffd6d6" result="spec">
            <fePointLight x="-300" y="-500" z="260" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn" />
          <feComposite in="SourceGraphic" in2="specIn" operator="arithmetic" k1="0" k2="1" k3="0.7" k4="0" />
        </filter>
      </defs>
      <g filter={`url(#${id}-gloss)`} fill={`url(#${id}-fill)`}>
        <path d={NAV_BLOOD.band} />
        {NAV_BLOOD.spatter.map((s, i) => (
          <circle key={`s${i}`} cx={s.cx} cy={s.cy} r={s.rr} />
        ))}
        {NAV_BLOOD.drips.map((dr, i) => (
          <g key={i} className="hw-run" style={{ "--dur": `${dr.dur}s`, "--delay": `${dr.delay}s` } as CSSProperties}>
            <path d={dr.stem} />
            {dr.beads.map((b, j) => (
              <ellipse key={j} cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry} />
            ))}
          </g>
        ))}
      </g>
      {/* The drop at the end of each drip: it rides down as the drip runs, then breaks off and falls. */}
      {NAV_BLOOD.drips.map((dr, i) => (
        <g key={i} transform={`translate(${dr.x.toFixed(1)} ${dr.tipY.toFixed(1)})`}>
          <path
            className="hw-tip"
            d={teardrop(dr.w)}
            fill={`url(#${id}-drop)`}
            style={{ "--dur": `${dr.dur}s`, "--delay": `${dr.delay}s`, "--len": `${(dr.len * 0.7).toFixed(1)}px` } as CSSProperties}
          />
        </g>
      ))}
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
