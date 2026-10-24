# Halloween Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the CORDOVA RISKQ site a realistic, scary Halloween skin (dark blood-red look, forest hero, recreated jack-o'-lantern, bats, fog, webs, gate and countdown pop-ups, jumpscare, synthesized sounds) that turns itself on 2026-10-01 and off 2026-11-01 (Asia/Manila).

**Architecture:** Pure, unit-tested date/decision helpers live in `lib/halloween.ts`. The theme is a class on `<html>` (`halloween`) set by a tiny inline script before paint; `app/halloween.css` restyles the existing components under `html.halloween` so the components themselves barely change. The interactive parts are client components under `components/halloween/`, mounted once from `app/page.tsx` and shown only while the class is present. Sound is one Web Audio engine in `lib/halloween-audio.ts`, shared through a React context.

**Tech Stack:** Next.js 16.4.3 App Router, React 19, Tailwind CSS v4, TypeScript, Vitest (node environment, no DOM), sharp (already installed) for image conversion, lucide-react icons.

**Spec:** `docs/superpowers/specs/2026-10-24-halloween-theme-design.md`

## Global Constraints

- Work on branch `feat/halloween-theme` in `../CordovaRiskQ-Website-next-upgrade` (it already contains the Next 16.4.3 upgrade).
- Read the relevant guide in `node_modules/next/dist/docs/` before writing Next code (AGENTS.md). In particular, check how to render an inline `<script>` in the root layout and what `cacheComponents: true` allows.
- Season: on from `2026-10-01T00:00:00+08:00` (inclusive) until `2026-11-01T00:00:00+08:00` (exclusive). Countdown target: `2026-10-31T00:00:00+08:00`; from then on it shows "Happy Halloween".
- Palette: `#0c0a0b`, `#1a0a0f` backgrounds; reds `#8a0a12`, `#c8102e`, `#d11f2a`; ember `#ff6b35`; text `#f3e9e4`.
- No audio files: all sound comes from the Web Audio API. Sound only starts after the visitor clicks "Enter" (with sound).
- Every overlay closes with one click/tap or Esc. Nothing covers the download button press.
- `prefers-reduced-motion: reduce` → no jumpscare, no shake, no bat flights.
- Do not ship `3.png` or `5.png` (watermarked). Do not touch `lib/release.ts` or download logic. No analytics.
- Must pass: `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`.
- Source images: `C:\Users\JANSSE~1.SAL\AppData\Local\Temp\claude\c--Users-Janssen-Q--Saludes-Desktop-CORDOVA-RISKQ-CordovaRiskQ-Website\a04dbfeb-8522-4390-94da-9c8948bd21f0\images\` (`1.png` cobweb, `2.png` ghost, `4.png` forest).
- Session storage keys (wrap every access in try/catch; treat failure as "not set"): `hw:gate` = `"sound" | "quiet"`, `hw:countdown-closed` = `"1"`, `hw:jumpscare-seen` = `"1"`.

## Review Focus

1. Visiting on 2026-11-01 00:00 Manila or later, including from a page built in October → normal light site, no overlays, no sound. (Test in Task 1 + Task 2.)
2. Visitor in a different timezone (e.g. UTC-8) on the evening of Oct 31 local → season and countdown follow Manila time, not local. (Test in Task 1.)
3. sessionStorage throws (private mode / blocked) → gate still shows and can be dismissed; the page never crashes. (Test in Task 1 via `readFlag`.)
4. Visitor uses only the keyboard or a screen reader → gate buttons get focus first, Esc closes overlays, decorations are `aria-hidden`, focus returns to the page. (Checked in Task 4 / Task 7 verification steps.)
5. Text contrast on dark panels: existing `text-muted`, `text-faint`, cards with `bg-white` stay readable after the theme flip. (Checked in Task 2 verification.)

---

### Task 1: Season and decision helpers

**Files:**
- Create: `lib/halloween.ts`
- Test: `lib/halloween.test.ts`

**Interfaces:**
- Produces:
  - `HALLOWEEN: { start: Date; end: Date; night: Date }` (values from Global Constraints)
  - `isHalloweenSeason(now: Date): boolean`
  - `getCountdown(now: Date): { days: number; hours: number; minutes: number; seconds: number; arrived: boolean }`
  - `shouldJumpscare(s: { seen: boolean; reducedMotion: boolean; overlayOpen: boolean }): boolean`
  - `readFlag(storage: Pick<Storage, "getItem"> | null, key: string): string | null` (null on throw)
  - `writeFlag(storage: Pick<Storage, "setItem"> | null, key: string, value: string): void` (swallows throws)
  - `HALLOWEEN_THEME_SCRIPT: string` — self-contained JS that adds class `halloween` to `document.documentElement` when in season and removes it otherwise; built from the `HALLOWEEN` timestamps (milliseconds), so dates live in one place.

- [ ] **Step 1: Write failing tests** in `lib/halloween.test.ts`:

```ts
const at = (iso: string) => new Date(iso);
it("is in season on Oct 1 00:00 Manila", () => expect(isHalloweenSeason(at("2026-10-01T00:00:00+08:00"))).toBe(true));
it("is out of season one ms before", () => expect(isHalloweenSeason(at("2026-09-30T23:59:59.999+08:00"))).toBe(false));
it("is out of season at Nov 1 00:00 Manila", () => expect(isHalloweenSeason(at("2026-11-01T00:00:00+08:00"))).toBe(false));
it("uses Manila time, not local: Oct 31 20:00 in UTC-8 is already Nov 1 in Manila", () =>
  expect(isHalloweenSeason(at("2026-10-31T20:00:00-08:00"))).toBe(false));
it("counts down to Oct 31 Manila", () =>
  expect(getCountdown(at("2026-10-24T20:30:15+08:00"))).toEqual({ days: 6, hours: 3, minutes: 29, seconds: 45, arrived: false }));
it("arrives at Oct 31 00:00 Manila", () =>
  expect(getCountdown(at("2026-10-31T00:00:00+08:00"))).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0, arrived: true }));
it("jumpscare only when unseen, motion ok, no overlay", () => {
  expect(shouldJumpscare({ seen: false, reducedMotion: false, overlayOpen: false })).toBe(true);
  expect(shouldJumpscare({ seen: true, reducedMotion: false, overlayOpen: false })).toBe(false);
  expect(shouldJumpscare({ seen: false, reducedMotion: true, overlayOpen: false })).toBe(false);
  expect(shouldJumpscare({ seen: false, reducedMotion: false, overlayOpen: true })).toBe(false);
});
it("readFlag returns null when storage throws", () =>
  expect(readFlag({ getItem: () => { throw new Error("blocked"); } }, "hw:gate")).toBeNull());
it("writeFlag swallows throws", () =>
  expect(() => writeFlag({ setItem: () => { throw new Error("blocked"); } }, "hw:gate", "quiet")).not.toThrow());
it("theme script toggles the class by date", () => {
  const run = (iso: string) => {
    const classes = new Set<string>(["halloween"]);
    const document = { documentElement: { classList: {
      add: (c: string) => classes.add(c), remove: (c: string) => classes.delete(c) } } };
    const RealDate = Date;
    const FakeDate = class extends RealDate { constructor() { super(iso); } static now() { return new RealDate(iso).getTime(); } };
    new Function("document", "Date", HALLOWEEN_THEME_SCRIPT)(document, FakeDate);
    return classes.has("halloween");
  };
  expect(run("2026-10-24T12:00:00+08:00")).toBe(true);
  expect(run("2026-11-02T12:00:00+08:00")).toBe(false);
});
```

- [ ] **Step 2: Run** `npx vitest run lib/halloween.test.ts` → FAIL (module not found).
- [ ] **Step 3: Implement** `lib/halloween.ts`. Compare timestamps (`getTime()`), which makes it timezone-proof. The script uses `Date.now()` and wraps in try/catch.
- [ ] **Step 4: Run** `npx vitest run lib/halloween.test.ts` → all PASS; `npm test` → all pass.
- [ ] **Step 5: Commit** `feat(halloween): season, countdown and flag helpers`.

---

### Task 2: Dark theme switch, assets and site-wide look

**Files:**
- Create: `app/halloween.css`, `scripts/build-halloween-assets.mjs`, `public/halloween/forest.webp`, `public/halloween/ghost.webp`, `public/halloween/cobweb.webp`
- Modify: `app/layout.tsx` (import css, inline script, `className` includes `halloween` when `isHalloweenSeason(new Date())` at render, `suppressHydrationWarning` on `<html>`), `app/globals.css` only if a token must move

**Interfaces:**
- Consumes: `HALLOWEEN_THEME_SCRIPT`, `isHalloweenSeason` (Task 1)
- Produces: class `html.halloween`; CSS custom properties `--hw-bg: #0c0a0b`, `--hw-bg-2: #1a0a0f`, `--hw-panel: rgb(26 10 15 / 0.72)`, `--hw-red: #d11f2a`, `--hw-blood: #8a0a12`, `--hw-ember: #ff6b35`, `--hw-text: #f3e9e4`; assets at `/halloween/forest.webp`, `/halloween/ghost.webp`, `/halloween/cobweb.webp`.

- [ ] **Step 1: Asset script.** `scripts/build-halloween-assets.mjs <srcDir>` converts `1.png → cobweb.webp`, `2.png → ghost.webp`, `4.png → forest.webp` with sharp (quality 82, no upscaling). Run it with the source dir from Global Constraints. Expected: three files in `public/halloween/`, each < 120 KB.
- [ ] **Step 2: Theme CSS.** In `app/halloween.css`, everything is scoped under `html.halloween`:
  - Override the Tailwind tokens: `--color-ink: var(--hw-text)`; `--color-muted: #c9b4b0`; `--color-faint: #9c8682`; `--color-line: rgb(209 31 42 / 0.22)`; `--color-line-muted: rgb(209 31 42 / 0.12)`; `--color-surface: var(--hw-bg-2)`; `--color-brand-tint: rgb(209 31 42 / 0.14)`; `--color-brand-light: rgb(209 31 42 / 0.25)`; `--color-tide-tint`, `--color-success-bg`, `--color-warning-bg` → dark translucent equivalents.
  - `body`: background `var(--hw-bg)` with the cobweb image tiled at low opacity (pseudo-element, `position: fixed`, `opacity ≈ 0.12`, `pointer-events: none`).
  - Restyle literal light utilities used by the components: `[class*="bg-white"]` → `var(--hw-panel)`, and the hero's radial-gradient section `#top` → transparent (Task 3 paints it). Keep `text-white` on red buttons.
  - Add a red glow to `.bg-brand` buttons (`box-shadow 0 0 24px rgb(209 31 42 / .45)`).
  - `::selection` dark red; `color-scheme: dark`.
- [ ] **Step 3: Layout.** Per the Next docs, render `<script dangerouslySetInnerHTML={{ __html: HALLOWEEN_THEME_SCRIPT }} />` as the first child of `<head>` (or the documented equivalent), and set `viewport.themeColor` to `#0c0a0b` when `isHalloweenSeason(new Date())`.
- [ ] **Step 4: Verify.** Run `npm run build` → success. Run `npm run dev`, open http://localhost:3000, and scroll every section. Every heading, paragraph, card, the FAQ, reviews, footer and mobile menu should be readable (Review Focus 5). Temporarily change the end date to the past and confirm the light site returns, then revert.
- [ ] **Step 5: Commit** `feat(halloween): dark theme switch and assets`.

---

### Task 3: Hero scene and decorations

**Files:**
- Create: `components/halloween/jack-o-lantern.tsx`, `components/halloween/bats.tsx`, `components/halloween/fog.tsx`, `components/halloween/cobweb-corner.tsx`, `components/halloween/hero-scene.tsx`
- Modify: `components/hero.tsx` (render `<HalloweenHeroScene />` as the hero's background layer), `app/halloween.css` (keyframes)

**Interfaces:**
- Produces: `JackOLantern(props: { className?: string; onClick?: () => void }): JSX.Element` (reused by Task 4); `HalloweenHeroScene(): JSX.Element`; `Bats(): JSX.Element`; `Fog(props: { className?: string }): JSX.Element`; `CobwebCorner(props: { corner: "tl" | "tr" | "bl" | "br" }): JSX.Element`. All render only under `html.halloween` (hide with CSS `html:not(.halloween) .hw-only { display: none }`) and are `aria-hidden` except the pumpkin button.

- [ ] **Step 1: Hero scene.** Forest image (`next/image`, `fill`, `object-cover`, `priority`) with blur(1.5px), a radial vignette to `#0c0a0b`, and a bottom gradient fade into the page. On ≥ lg it sits behind the content.
- [ ] **Step 2: Jack-o'-lantern.** Inline SVG, about 260px wide in the hero (smaller on phones), placed beside or behind the headline without covering the download button. It needs: ridged deep-red body (radial + linear gradients, 5–7 rib paths with darker grooves), a curled stem, angry slanted eyes, two skull-like nostril holes, an upper and lower row of jagged fangs, a candle glow inside (radial gradient `#fff3c4 → #ff6b35 → transparent`, `feGaussianBlur` bloom), and a flicker animation on glow opacity (irregular keyframes, about 2.4s). Compare it against `5.png` for realism. Clicking it plays the sting from Task 4 (prop only here).
- [ ] **Step 3: Bats, fog, webs.** Bats: 5–7 SVG bat silhouettes with a wing-flap keyframe (~0.18s) flying across on staggered paths (12–20s, with gaps). Fog: two layered blurred gradient bands drifting in opposite directions along the bottom of the hero. Webs: `cobweb.webp` cropped into the hero's top corners (`mix-blend-mode: screen`). Reduced motion: hide the bats and stop the fog drift.
- [ ] **Step 4: Verify.** Dev server at 360px, 768px and 1440px: the headline, rotating text and download button are fully visible and clickable; nothing scrolls sideways; the pumpkin flickers. `npm run lint` passes.
- [ ] **Step 5: Commit** `feat(halloween): hero forest, jack-o'-lantern, bats, fog, webs`.

---

### Task 4: Sound engine, gate pop-up and sound toggle

**Files:**
- Create: `lib/halloween-audio.ts`, `components/halloween/sound-context.tsx`, `components/halloween/gate.tsx`, `components/halloween/sound-toggle.tsx`, `components/halloween/halloween-layer.tsx`
- Modify: `app/page.tsx` (render `<HalloweenLayer />` once, inside `<main>` or after the footer), `components/site-header.tsx` (add `<SoundToggle />` before the download link), `components/halloween/hero-scene.tsx` (pumpkin `onClick` → `sting()`)

**Interfaces:**
- Consumes: `readFlag`, `writeFlag` (Task 1); `JackOLantern` (Task 3)
- Produces:
  - `lib/halloween-audio.ts`: `class HalloweenAudio { unlock(): Promise<void>; startAmbient(): void; stopAmbient(): void; scream(): void; sting(): void; setMuted(m: boolean): void }`, plus `getHalloweenAudio(): HalloweenAudio | null` (null when there's no `AudioContext`, i.e. on the server).
  - `sound-context.tsx`: `HalloweenSoundProvider`, `useHalloweenSound(): { enabled: boolean; setEnabled(v: boolean): void; scream(): void; sting(): void }`.
  - `halloween-layer.tsx`: `HalloweenLayer()` client component. It renders nothing unless `document.documentElement.classList.contains("halloween")`, wraps the children in `HalloweenSoundProvider`, and renders `Gate`, then `Countdown` (Task 5) and `Jumpscare` (Task 6). It exposes `overlayOpen` (gate open) to the children via props.
- [ ] **Step 1: Audio engine.** Ambient: filtered brown noise as wind with a slow LFO on the filter cutoff, plus a low detuned drone (~55 Hz), plus a random creak (short resonant filtered noise burst) every 8–20s; master gain ≈ 0.18. Scream: about 1.1s of two detuned sawtooths sweeping 900 → 1600 → 700 Hz with vibrato, plus a noise burst, through a compressor; peak gain ≈ 0.6. Sting: a low hit (sine 60 Hz with a fast pitch drop) plus a short noise. `setMuted` ramps the master gain over 0.25s.
- [ ] **Step 2: Gate.** Show it when `readFlag(sessionStorage, "hw:gate")` is null. It's a full-screen overlay (`role="dialog"`, `aria-modal`, `aria-labelledby`) on `#0c0a0b` with fog, the `JackOLantern`, the "CORDOVA RISKQ" wordmark, the heading "Enter if you dare", the line "Halloween in Cordova · Turn your sound on", and two buttons: **Enter** (primary red, autofocus) and **Enter quietly**. Enter → `unlock()`, `startAmbient()`, `writeFlag(…,"sound")`. Quietly → `writeFlag(…,"quiet")`. Esc acts as "Enter quietly". Lock page scroll while it's open and restore focus to `#main` on close. Fade out over 0.6s.
- [ ] **Step 3: Sound toggle.** A speaker icon button (lucide `Volume2` / `VolumeX`), 40px round, `aria-pressed`, `aria-label="Halloween sounds"`, visible only under `html.halloween`. Toggling writes `hw:gate` (`"sound"`/`"quiet"`) and starts or stops the ambient sound (unlocking on first use).
- [ ] **Step 4: Verify.** Dev server: with a fresh session the gate appears. Tab reaches Enter first, and Enter starts the wind. After a reload in the same tab there's no gate and the sound stays off until the toggle is pressed (browsers need a click). With sessionStorage blocked (DevTools → Application → block storage, or the Safari private window equivalent) the gate still shows and closes. `npm run typecheck && npm run lint` pass.
- [ ] **Step 5: Commit** `feat(halloween): synthesized sounds, enter gate, sound toggle`.

---

### Task 5: Countdown pop-up

**Files:**
- Create: `components/halloween/countdown.tsx`
- Modify: `components/halloween/halloween-layer.tsx` (render it)

**Interfaces:**
- Consumes: `getCountdown`, `readFlag`, `writeFlag` (Task 1)
- Produces: `Countdown(props: { hidden: boolean }): JSX.Element | null`

- [ ] **Step 1: Build it.** A floating card, bottom-right (bottom-center on phones, above the safe area, max-width 320px), that slides in 1.5s after the gate closes (`hidden` false). It's dark glass with a red border and glow. The title is "Halloween in", with four boxes (Days, Hrs, Min, Sec) ticking every second; render the numbers only after mount to avoid a hydration mismatch. When `arrived` is true it shows "Happy Halloween 🎃". A close button (`aria-label="Close countdown"`) sets `hw:countdown-closed`. It uses `aria-live="off"` so the ticking isn't read aloud. It must not cover the mobile download button: on phones place it above the footer area, or collapse it to a small pill after 6s (implementer's choice).
- [ ] **Step 2: Verify.** Dev server: numbers match `getCountdown` for the current time; closing it keeps it closed after a reload in the same tab; at 360px it doesn't block the header Download button or the download section button.
- [ ] **Step 3: Commit** `feat(halloween): countdown pop-up`.

---

### Task 6: Jumpscare

**Files:**
- Create: `components/halloween/jumpscare.tsx`
- Modify: `components/halloween/halloween-layer.tsx` (render it), `app/halloween.css` (keyframes)

**Interfaces:**
- Consumes: `shouldJumpscare`, `readFlag`, `writeFlag` (Task 1); `useHalloweenSound().scream`, `.enabled` (Task 4)
- Produces: `Jumpscare(props: { overlayOpen: boolean }): JSX.Element | null`

- [ ] **Step 1: Trigger.** An `IntersectionObserver` watches `#top`. Once the hero has fully left the viewport, wait 2.5s. Then fire if `shouldJumpscare({ seen: readFlag(...)==="1", reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches, overlayOpen })` is true and the download section (`#download`) is not currently in view. If it is in view, retry on the next time the hero leaves the viewport. Write `hw:jumpscare-seen` the moment it fires.
- [ ] **Step 2: The scare.** A full-screen fixed overlay (`aria-hidden`, z above everything), black, with `ghost.webp` centered, `object-fit: cover` on phones and about 95vh tall on desktop. Animation (~1.6s total): scale 0.25 → 1.15 in 0.45s with a slight rotate, a red flash frame, screen shake (overlay translate ±12px over 0.4s), an SVG film-grain overlay, a flicker of opacity, then a fade out. Call `scream()` at the start only if `enabled`. A click, tap or Esc ends it immediately. Preload the image when the gate closes so it doesn't pop in late.
- [ ] **Step 3: Verify.** Dev server, fresh session, Enter with sound: scroll past the hero, and within about 3s the ghost lunges with a scream and then disappears. A reload doesn't trigger it again. With reduced motion enabled (DevTools → Rendering → emulate) it never fires. Esc dismisses it.
- [ ] **Step 4: Commit** `feat(halloween): jumpscare`.

---

### Task 7: Final verification

- [ ] **Step 1:** `npm run typecheck && npm run lint && npm test && npm run build` → all pass.
- [ ] **Step 2:** Production preview (`npm start`) at 360px and 1440px. Walk through gate → ambient sound → scroll → jumpscare → countdown → download button still downloads → keyboard-only pass (Tab order, Esc on every overlay, visible focus rings in red).
- [ ] **Step 3:** Out-of-season check: temporarily set the system or test clock to 2026-11-01 (or flip the end date), reload → normal light site, no overlays, no sound toggle. Revert.
- [ ] **Step 4:** Commit any fixes: `fix(halloween): polish from final pass`.
