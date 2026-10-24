import { useId } from "react";

type Pt = [number, number];

// Quadratic Bézier point; used to place the fangs along the mouth's edges.
function qPoint(p0: Pt, p1: Pt, p2: Pt, t: number): Pt {
  const u = 1 - t;
  return [u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]];
}

const MOUTH_TOP: [Pt, Pt, Pt] = [[92, 238], [200, 300], [308, 238]];
const MOUTH_BOTTOM: [Pt, Pt, Pt] = [[92, 238], [200, 392], [308, 238]];
const MOUTH = "M92 238 Q200 300 308 238 Q200 392 92 238 Z";

/** Jagged fangs hanging from one edge of the mouth. dir 1 = down, -1 = up. */
function fangs(curve: [Pt, Pt, Pt], count: number, dir: 1 | -1, offset: number) {
  const out: string[] = [];
  const step = 1 / count;
  for (let i = 0; i < count; i++) {
    const t = step * (i + offset);
    if (t <= 0.03 || t >= 0.97) continue;
    const a = qPoint(...curve, Math.max(0, t - step * 0.48));
    const b = qPoint(...curve, Math.min(1, t + step * 0.48));
    const c = qPoint(...curve, t);
    // Longer fangs toward the middle, with a little irregularity.
    const mid = 1 - Math.abs(t - 0.5) * 1.6;
    const len = (16 + 26 * mid) * (i % 2 ? 0.82 : 1);
    const lean = (t - 0.5) * 10;
    const tip: Pt = [c[0] + lean, c[1] + dir * len];
    const bulge = dir * len * 0.35;
    out.push(
      `M${a[0].toFixed(1)} ${(a[1] - dir * 4).toFixed(1)}` +
        ` Q${(a[0] + 2).toFixed(1)} ${(a[1] + bulge).toFixed(1)} ${tip[0].toFixed(1)} ${tip[1].toFixed(1)}` +
        ` Q${(b[0] - 2).toFixed(1)} ${(b[1] + bulge).toFixed(1)} ${b[0].toFixed(1)} ${(b[1] - dir * 4).toFixed(1)} Z`,
    );
  }
  return out;
}

const TOP_FANGS = fangs(MOUTH_TOP, 9, 1, 0.5);
const BOTTOM_FANGS = fangs(MOUTH_BOTTOM, 8, -1, 0.5);

const EYE_L = "M112 146 C130 150 168 166 184 182 C180 204 160 214 142 210 C120 204 108 182 112 146 Z";
const EYE_R = "M288 146 C270 150 232 166 216 182 C220 204 240 214 258 210 C280 204 292 182 288 146 Z";

// Lobes, back to front, give the ridged pumpkin body.
const LOBES: { cx: number; rx: number; ry: number; cy: number }[] = [
  { cx: 92, cy: 228, rx: 76, ry: 128 },
  { cx: 308, cy: 228, rx: 76, ry: 128 },
  { cx: 140, cy: 222, rx: 92, ry: 142 },
  { cx: 260, cy: 222, rx: 92, ry: 142 },
  { cx: 200, cy: 218, rx: 96, ry: 150 },
];

/**
 * A carved, blood-red jack-o'-lantern lit from inside. Pure SVG so it stays
 * sharp at any size and needs no image file.
 */
export function JackOLantern({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const u = (name: string) => `url(#${id}-${name})`;

  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden>
      <defs>
        <radialGradient id={`${id}-lobe`} cx="42%" cy="34%" r="70%">
          <stop offset="0%" stopColor="#d4313a" />
          <stop offset="38%" stopColor="#a3121e" />
          <stop offset="78%" stopColor="#5e0710" />
          <stop offset="100%" stopColor="#2a0207" />
        </radialGradient>
        <linearGradient id={`${id}-flesh`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b51c26" />
          <stop offset="100%" stopColor="#6e0a12" />
        </linearGradient>
        <radialGradient id={`${id}-fire`} cx="50%" cy="60%" r="65%">
          <stop offset="0%" stopColor="#fffbe0" />
          <stop offset="30%" stopColor="#ffd56b" />
          <stop offset="62%" stopColor="#ff8a2a" />
          <stop offset="100%" stopColor="#c2410c" />
        </radialGradient>
        <radialGradient id={`${id}-spill`} cx="50%" cy="62%" r="50%">
          <stop offset="0%" stopColor="#ff9a3c" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ff6b35" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-halo`} cx="50%" cy="55%" r="50%">
          <stop offset="0%" stopColor="#ff5a1f" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#d11f2a" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#d11f2a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-stem`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3a0a08" />
          <stop offset="50%" stopColor="#8a2a14" />
          <stop offset="100%" stopColor="#2a0606" />
        </linearGradient>
        {/* Fibrous, slightly rough skin. */}
        <filter id={`${id}-skin`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9 0.06" numOctaves="3" seed="7" result="n" />
          <feColorMatrix in="n" type="saturate" values="0" result="g" />
          <feComponentTransfer in="g" result="g2">
            <feFuncA type="table" tableValues="0 0.55" />
          </feComponentTransfer>
          <feComposite in="g2" in2="SourceGraphic" operator="in" result="tex" />
          <feBlend in="SourceGraphic" in2="tex" mode="multiply" />
        </filter>
        <filter id={`${id}-bloom`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <clipPath id={`${id}-body`}>
          {LOBES.map((l, i) => (
            <ellipse key={i} cx={l.cx} cy={l.cy} rx={l.rx} ry={l.ry} />
          ))}
        </clipPath>
      </defs>

      {/* Candle light thrown around the pumpkin. */}
      <circle className="hw-flicker" cx="200" cy="230" r="200" fill={u("halo")} />
      <ellipse cx="200" cy="372" rx="150" ry="16" fill="#000" opacity="0.6" />

      {/* Stem */}
      <path
        d="M188 92 C184 70 186 46 204 30 C214 22 230 22 236 30 C226 30 214 36 210 50 C204 66 206 80 212 94 Z"
        fill={u("stem")}
      />

      {/* Body */}
      <g filter={u("skin")}>
        {LOBES.map((l, i) => (
          <ellipse key={i} cx={l.cx} cy={l.cy} rx={l.rx} ry={l.ry} fill={u("lobe")} />
        ))}
      </g>
      {/* Deep grooves between the lobes */}
      <g clipPath={u("body")} fill="none" stroke="#1a0104" strokeLinecap="round" opacity="0.75">
        <path d="M122 92 C92 160 92 300 124 362" strokeWidth="5" />
        <path d="M278 92 C308 160 308 300 276 362" strokeWidth="5" />
        <path d="M168 76 C150 150 150 300 168 370" strokeWidth="3.5" />
        <path d="M232 76 C250 150 250 300 232 370" strokeWidth="3.5" />
      </g>

      {/* Light spilling over the carved face from inside */}
      <ellipse className="hw-flicker" cx="200" cy="250" rx="150" ry="120" fill={u("spill")} clipPath={u("body")} />

      {/* Carved openings: dark rim first (wall thickness), then the fire. */}
      <g transform="translate(0 -5)" fill="#1c0205">
        <path d={EYE_L} />
        <path d={EYE_R} />
        <path d={MOUTH} />
      </g>
      <g fill={u("fire")}>
        <path d={EYE_L} />
        <path d={EYE_R} />
        <path d={MOUTH} />
      </g>
      <g className="hw-flicker" fill="#ffb347" filter={u("bloom")} opacity="0.9">
        <path d={EYE_L} />
        <path d={EYE_R} />
        <path d={MOUTH} />
      </g>

      {/* Fangs, carved from the flesh, with a lit edge */}
      <g fill={u("flesh")} stroke="#ffb347" strokeOpacity="0.45" strokeWidth="1.2" filter={u("skin")}>
        {TOP_FANGS.map((d, i) => (
          <path key={`t${i}`} d={d} />
        ))}
        {BOTTOM_FANGS.map((d, i) => (
          <path key={`b${i}`} d={d} />
        ))}
      </g>

      {/* Heavy brow over the eyes */}
      <path
        d="M100 140 C140 132 176 150 200 176 C224 150 260 132 300 140 C276 128 236 128 200 160 C164 128 124 128 100 140 Z"
        fill={u("flesh")}
        opacity="0.95"
      />

      {/* Skull-like nose: two dark holes with a faint glow inside */}
      <g>
        <ellipse cx="188" cy="226" rx="8" ry="12" transform="rotate(18 188 226)" fill="#140103" />
        <ellipse cx="212" cy="226" rx="8" ry="12" transform="rotate(-18 212 226)" fill="#140103" />
        <ellipse className="hw-flicker" cx="189" cy="230" rx="3.5" ry="5" fill="#ff8a2a" opacity="0.55" />
        <ellipse className="hw-flicker" cx="211" cy="230" rx="3.5" ry="5" fill="#ff8a2a" opacity="0.55" />
      </g>

      {/* Glossy highlight on the top-left of the shell */}
      <ellipse cx="150" cy="120" rx="34" ry="14" transform="rotate(-24 150 120)" fill="#ffd0c8" opacity="0.12" />
    </svg>
  );
}
