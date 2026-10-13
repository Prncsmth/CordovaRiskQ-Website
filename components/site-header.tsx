import { Download } from "lucide-react";
import { MobileNav } from "@/components/mobile-nav";
import { Logo } from "@/components/ui";
import { NAV_LINKS, SITE } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/90 backdrop-blur supports-backdrop-filter:bg-white/75">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
      >
        Skip to content
      </a>
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" aria-label={`${SITE.name} home`} className="shrink-0 rounded-lg">
          <Logo priority compact />
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Always usable: jumps to the download panel, which shows the current availability. */}
          <a
            href="#download"
            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand px-3 text-sm font-semibold whitespace-nowrap text-white transition duration-200 ease-out-soft hover:-translate-y-px hover:bg-brand-dark active:translate-y-0 active:scale-[0.98] sm:px-4"
          >
            <Download aria-hidden className="size-4" />
            <span>
              Download<span className="hidden sm:inline"> APK</span>
            </span>
          </a>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
