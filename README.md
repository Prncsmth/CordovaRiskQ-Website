# CORDOVA RISKQ — APK download website

Public landing and download site for the CORDOVA RISKQ Android app, a
geolocation-based emergency and assistance coordination system for Cordova, Cebu.

Next.js (App Router) · TypeScript · Tailwind CSS v4. Static, no backend calls,
no analytics, no tracking.

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
```

| Command             | Purpose                                   |
| ------------------- | ----------------------------------------- |
| `npm run lint`      | ESLint                                    |
| `npm run typecheck` | Generate route types, then `tsc --noEmit` |
| `npm test`          | Vitest unit tests (release config)        |
| `npm run build`     | Production build                          |
| `npm start`         | Serve the production build                |

## Publishing an APK release

All release details live in **`lib/release.ts`** (`APK_RELEASE`). Until it is
filled in, the site shows "APK not yet available" and every download button is
disabled.

The current release (v1.0.0) is served by this site itself from
`public/cordova-riskq-v1.0.0.apk`, so `downloadUrl` is the site path
`/cordova-riskq-v1.0.0.apk`. Do not use the expo.dev artifact link: EAS
artifacts expire. For a new build:

1. Put the new APK in `public/` (e.g. `public/cordova-riskq-v1.1.0.apk`) and
   delete the old one, or upload it to a permanent public HTTPS host.
2. In `lib/release.ts` set `downloadUrl` (site path or HTTPS URL), `version`,
   `releaseDate` (YYYY-MM-DD), `fileSizeBytes`, `releaseNotes` and `sha256`.
3. Run `npm run verify-apk`. It downloads the URL and checks the size and
   SHA-256 match the config.
4. Install the APK from that URL on a real Android phone.
5. Set `status: "available"` and `urlVerified: true`, then run
   `npm test && npm run build`. An incomplete or invalid "available" release
   fails the build, so a broken download button cannot ship.

Never enter placeholder or guessed values.

## Configuration

| Variable   | Where              | Purpose                                                                       |
| ---------- | ------------------ | ----------------------------------------------------------------------------- |
| `SITE_URL` | hosting env (server) | Public origin, e.g. `https://example.org`. Used for canonical URL, Open Graph, robots and sitemap. Defaults to `http://localhost:3000`. |

There are no secrets. Do not add `NEXT_PUBLIC_` variables containing private
values, and do not connect this site to admin or privileged APIs.

## Deployment

Any Node.js host that supports Next.js works (e.g. Vercel, or `next start`
behind a reverse proxy).

1. Set `SITE_URL` to the production origin.
2. Build command `npm run build`, start command `npm start` (Node 20.9+).
3. After deploying, open the site on an Android phone and check the download
   panel shows the expected state.

## Adding app screenshots

The Showcase section shows each feature's in-app path until real screenshots
are added. To add one, save a real phone screenshot as e.g.
`public/screenshots/sos.png` and set `screenshot: "/screenshots/sos.png"` on
that item in `SHOWCASE` (`lib/content.ts`). Only use genuine screenshots of the
current app — never mock-ups.

## Content sources

- Logo: `riskq.png` from the mobile app (`CordovaRiskQ-Frontend/assets/images`),
  resized into `public/brand/` and `app/icon.png` / `app/apple-icon.png`.
- Colors and fonts (Sora, Archivo Black): the mobile app's `theme/`.
- Feature, FAQ and privacy copy: the app's onboarding intro, tour, in-app FAQ
  and Terms screens (`lib/content.ts`). Keep it in sync with the app.
