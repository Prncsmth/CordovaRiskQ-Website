# Halloween theme for the CORDOVA RISKQ website

Date: 2026-10-24 · Status: draft for approval

## Intent

The owner wants the CORDOVA RISKQ site (an Android APK download site for an
emergency app in Cordova, Cebu) to wear a realistic, scary Halloween costume
for October, modelled on what synkdancestudio.com is doing right now: a dark
blood-red and black look, webs, bats, fog, a glowing jack-o'-lantern, pop-ups,
and a jumpscare with a scream. "Literally realistic like that" is the bar: it
should look like photos and real objects, not cartoon clip-art.

Halloween is 2026-10-31, one week after this document.

## Goals

- The whole site turns dark and Halloween-themed while every existing section
  and all content stay (download, app guide, showcase, geofence/coverage map,
  responders, how it works, install guide, about, reviews, FAQ, header, footer).
- It is scary: a jumpscare and scary sounds are wanted (owner confirmed).
- Pop-ups like Synk's.
- The download button still works and stays easy to find.

## Non-goals

- No content or copy changes beyond Halloween flavour text.
- No changes to the APK, release config (`lib/release.ts`) or download logic.
- No new backend, analytics or tracking (the site is static and promises none).

## Anti-goals (failure even if it "works")

- Cartoonish or cheap-looking decorations.
- A scare that blocks someone from downloading the app. Every overlay must be
  dismissible with one click/tap or Esc.
- Using images the owner doesn't have the right to publish (see Assets).
- The Halloween look still showing in mid-November.

## Assets the owner provided

Saved in the session scratchpad `images/` folder; copy into
`public/halloween/` (convert to `.webp`).

| File  | What it is                                    | Size      | Use |
| ----- | --------------------------------------------- | --------- | --- |
| 1.png | White cobwebs on black, grungy texture        | 540×540   | Site-wide background texture, tiled/low opacity; corner webs |
| 2.png | Ghost woman, long hair, glowing yellow eyes   | 414×740   | Jumpscare figure |
| 3.png | Black carved pumpkin, **29flo.com watermark** | 554×554   | Reference only, do not ship |
| 4.png | Red-lit dead forest, portrait                 | 415×737   | Hero background |
| 5.png | Red carved pumpkin, **29flo.com watermark**   | 1254×1254 | Reference only, do not ship |

- The pumpkins are watermarked, so they can't be published. The owner chose to have
  the builder **recreate** the red glowing jack-o'-lantern (angry slanted
  eyes, skull-like nose holes, rows of jagged fangs, warm candle glow from
  inside, deep red ridged skin). Builder's call on technique: a detailed
  layered SVG with gradients, filters and an animated flicker is the expected
  route. It must read as a real object, not a flat icon.
- The images are low resolution. Hide this by design: the forest gets a dark
  vignette, a slight blur and a gradient fade into the page, and sits behind
  content on large screens (can mirror or extend with a dark gradient
  sideways). The ghost is shown with film grain, flicker and a red tint during
  a fast lunge, so softness reads as intentional.
- The cobweb, ghost and forest images come from the owner; their source is
  unknown (see Open items).

## Look

- Palette: near-black (`#0c0a0b`, `#1a0a0f`) backgrounds; blood reds
  (`#8a0a12`, `#c8102e` is already the brand red, `#d11f2a`); ember orange
  glow (`#ff6b35`, already the brand secondary) for candle light. Text
  off-white (`#f3e9e4`) and muted rose-grey. These are close to Synk's
  Halloween palette.
- Fonts stay the same (Sora / Inter / Archivo Black). Builder may add a
  horror display font for Halloween headings only if it stays readable.
- Cards and panels become dark, translucent, with thin red-tinted borders.
- The light-theme tokens in `app/globals.css` (`@theme`) are the place to
  switch; the theme should be a class (e.g. `html.halloween`) so it can be
  turned off cleanly. `viewport.themeColor` should go dark.
- The hero phone screenshots and the map stay as they are (they show the real
  app).

## Decorations

- Cobweb corners (from 1.png) on the hero and a couple of section edges.
- Bats: several small realistic bat silhouettes flapping across the screen
  now and then (SVG, wing-flap + flight path).
- Fog: slow drifting fog along the bottom of the hero and sections.
- Red jack-o'-lantern in the hero, in front of the forest, flickering.
- Subtle embers/particles are optional (builder's call).

## Pop-ups

1. **"Enter if you dare" gate** (on first load, once per browser session):
   a dark full-screen overlay with the glowing pumpkin, a line like
   "CORDOVA RISKQ · Halloween" and two buttons: "Enter" (with sound) and
   "Enter quietly" (sound off). The click unlocks audio, because browsers
   block sound until the visitor interacts. This is the builder's/designer's
   call (not something the owner asked for by name) and it doubles as a Synk-style pop-up.
2. **Countdown pop-up**: a small floating card (bottom corner) counting
   down days/hours/minutes/seconds to 2026-10-31 midnight Philippine time
   (Asia/Manila), closable, remembered for the session. On Oct 31 it says
   "Happy Halloween".
3. **Jumpscare**: see below.

## Jumpscare

- When: once per browser session, a few seconds after the visitor scrolls
  past the hero (not while the gate is open, never on top of the download
  section's button press). Builder may tune the delay.
- What: the ghost woman (2.png) rushes from small to filling the screen in
  about half a second, with a red flash, screen shake, grain and flicker,
  then fades away on her own after about 1.5 seconds. Click, tap or Esc
  dismisses her at once.
- Sound: a synthesized scream with a burst of noise (Web Audio, no audio
  files). It plays only if the visitor chose "Enter" with sound.
- People with "reduce motion" turned on in their device settings don't get
  the jumpscare, the shake or the bat flights. Fog and the static look stay.

## Scary sounds

All generated in the browser with the Web Audio API (no audio files, so there's
nothing to license and no extra download):

- Ambient loop: low wind/drone with occasional distant creaks or whispers.
  Starts only after "Enter" with sound.
- Jumpscare scream.
- Optional small stings (e.g. a low hit when the pumpkin is clicked).
- A sound on/off toggle in the header (speaker icon), always visible, and the
  choice is remembered for the session.

## Timing (seasonal switch)

- Halloween is on from 2026-10-01 through 2026-11-01 (Asia/Manila), and the
  normal site returns on 2026-11-02 without anyone changing code. The check runs in the
  browser so a static build still switches on time; the server-rendered page
  should default to the Halloween look during the window to avoid a flash of
  the light theme (builder decides the exact mechanism, e.g. a tiny inline
  script setting the class before paint).
- A single constant (e.g. `lib/halloween.ts`) holds the dates so it can be
  reused next year.

## Constraints

- Next.js 16.4 App Router, React 19, Tailwind v4, TypeScript. Read
  `node_modules/next/dist/docs/` before writing Next code (see AGENTS.md).
- A Next.js 16.4.0 → 16.4.3 security upgrade sits on branch
  `chore/next-16.4.3`, not yet merged. Build the theme on top of it (or
  after it's merged into `main`).
- Must keep passing `npm run typecheck`, `npm run lint`, `npm test`,
  `npm run build`.
- Mobile first: most visitors are on Android phones. Keep it smooth on
  mid-range phones (CSS transforms/opacity for animation, lazy-load
  decorations, keep image weight small).
- Keep existing accessibility: skip link, focus outlines, decorative layers
  `aria-hidden`, readable contrast on dark backgrounds.

## Left to the builder

Exact animation timings, bat count and paths, fog technique, pumpkin SVG
construction, sound synthesis details, component structure, how the theme
class is applied, and Halloween flavour copy.

## Open items for the owner

- Where did the cobweb, ghost and forest images come from, and is it OK to
  publish them? The plan assumes yes.
