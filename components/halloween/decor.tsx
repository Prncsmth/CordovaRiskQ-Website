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
