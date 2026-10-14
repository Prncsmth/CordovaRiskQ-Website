import { Download } from "lucide-react";
import { MobileNav } from "@/components/mobile-nav";
import { Logo } from "@/components/ui";
import { NAV_LINKS, SITE } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-white/85 backdrop-blur supports-backdrop-filter:bg-white/70">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
      >
        Skip to content
      </a>
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" aria-label={`${SITE.name} home`} className="shrink-0 rounded-lg">
          <Logo priority />
        </a>

        {/* Floating pill navigation (desktop). */}
        <nav aria-label="Primary" className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
          <ul className="flex w-max items-center gap-0.5 rounded-full border border-line bg-white/90 p-1 shadow-[0_1px_2px_rgba(23,24,26,0.05)]">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block rounded-full px-2.5 py-1.5 font-mono text-[0.7rem] font-semibold tracking-wider whitespace-nowrap text-muted uppercase transition-colors hover:bg-brand-tint hover:text-brand xl:px-4 xl:text-[0.72rem]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Always usable: jumps to the download panel. */}
          <a
            href="#download"
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-brand px-4 font-mono max-[359px]:w-10 max-[359px]:px-0 text-[0.72rem] font-semibold tracking-wider whitespace-nowrap text-white uppercase transition duration-200 ease-out-soft hover:-translate-y-px hover:bg-brand-dark hover:shadow-[0_6px_16px_-6px_rgba(156,12,36,0.5)] active:translate-y-0 active:scale-[0.97]"
          >
            <Download aria-hidden className="size-4" />
            {/* Icon only on the narrowest phones so the menu button still fits. */}
            <span className="max-[359px]:sr-only">
              Download<span className="hidden sm:inline"> app</span>
            </span>
          </a>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
