export const SITE = {
  name: "CORDOVA RISKQ",
  shortName: "RiskQ",
  title: "CORDOVA RISKQ — Emergency Assistance. Better Coordination.",
  description:
    "Download the CORDOVA RISKQ Android app: a geolocation-based emergency and assistance coordination system for Cordova, Cebu. Send an SOS, report incidents with a pinned location, and find evacuation centers.",
  locality: "Cordova, Cebu",
} as const;

/**
 * Public site origin, used for canonical URLs, Open Graph and the sitemap.
 * Server-only (no NEXT_PUBLIC_ prefix) — it is read in metadata files, never
 * in client components. Set SITE_URL in the hosting environment.
 */
export function getSiteUrl(): URL {
  const raw = process.env.SITE_URL;
  if (raw) {
    try {
      return new URL(raw);
    } catch {
      throw new Error(`SITE_URL "${raw}" is not a valid absolute URL.`);
    }
  }
  return new URL("http://localhost:3000");
}

export const NAV_LINKS = [
  { href: "#top", label: "Overview" },
  { href: "#guide", label: "Guide" },
  { href: "#showcase", label: "Showcase" },
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#about", label: "About" },
  { href: "#faq", label: "FAQ" },
] as const;

export const FOOTER_LINKS = [
  { href: "#download", label: "Download" },
  { href: "#guide", label: "App guide" },
  { href: "#showcase", label: "Showcase" },
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#install", label: "Install guide" },
  { href: "#about", label: "About" },
  { href: "#faq", label: "FAQ" },
] as const;
