import { Logo } from "@/components/ui";
import { NAV_LINKS, SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Emergency assistance and coordination for {SITE.locality}.
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm sm:grid-cols-3">
              {[{ href: "#download", label: "Download" }, ...NAV_LINKS].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-muted transition-colors hover:text-brand">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line-muted pt-6 text-xs leading-relaxed text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {SITE.name}. All rights reserved.</p>
          <p>The Terms of Use and Privacy Policy are presented in the app when you create an account.</p>
        </div>
      </div>
    </footer>
  );
}
