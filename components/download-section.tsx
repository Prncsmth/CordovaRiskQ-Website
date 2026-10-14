import { ArrowRight, Clock, PhoneCall, ShieldCheck, Smartphone } from "lucide-react";
import { DownloadButton } from "@/components/download-button";
import { DownloadQr } from "@/components/download-qr";
import { Reveal } from "@/components/reveal";
import { Eyebrow, Logo } from "@/components/ui";
import { release } from "@/lib/release";

const NOT_PUBLISHED = "Not yet published";

export function DownloadSection() {
  const details = [
    { label: "Version", value: release.available ? release.version : NOT_PUBLISHED },
    { label: "Release date", value: release.available ? release.releaseDateLabel : NOT_PUBLISHED },
    {
      label: "File size",
      value: release.available ? (release.fileSizeLabel ?? "Shown by your browser") : NOT_PUBLISHED,
    },
    {
      label: "Requires",
      value: release.available && release.minAndroid ? `Android ${release.minAndroid} or newer` : "Android",
    },
  ];

  return (
    <section
      id="download"
      aria-labelledby="download-heading"
      className="relative isolate overflow-hidden bg-[radial-gradient(90%_60%_at_50%_0%,#fdecea_0%,#ffffff_70%)] py-20 sm:py-28"
    >
      <div aria-hidden className="bg-dots absolute inset-0 -z-10 opacity-70" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal className="text-center">
          <Eyebrow>Download</Eyebrow>
          <h2
            id="download-heading"
            className="mt-4 font-wordmark text-4xl leading-[1.02] tracking-tight text-balance text-ink uppercase sm:text-6xl"
          >
            Get CORDOVA RISKQ.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted">
            The official CORDOVA RISKQ Android app. Install it before you need it.
          </p>
        </Reveal>

        <Reveal delay={100} className="mt-10 overflow-hidden rounded-3xl border border-line bg-white shadow-[0_30px_60px_-40px_rgba(23,24,26,0.35)]">
          <div className="flex flex-col gap-4 border-b border-line-muted p-6 sm:flex-row sm:items-start sm:justify-between sm:p-8">
            <div>
              <Logo />
              <p className="mt-3 flex items-center gap-2 text-sm text-muted">
                <Smartphone aria-hidden className="size-4" />
                For Android phones
              </p>
            </div>
            <p id="download-status">
              {release.available ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success-bg px-3 py-1 font-mono text-xs font-semibold tracking-wide text-success uppercase">
                  <ShieldCheck aria-hidden className="size-4" />
                  Latest release · v{release.version}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-bg px-3 py-1 font-mono text-xs font-semibold tracking-wide text-warning uppercase">
                  <Clock aria-hidden className="size-4" />
                  APK not yet available
                </span>
              )}
            </p>
          </div>

          <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[1.15fr_1fr]">
            <div>
              <p className="leading-relaxed text-muted">
                {release.available
                  ? "Download the official APK, then follow the installation guide to set it up on your Android phone."
                  : "The download will be enabled here once the official build is released and its download link has been verified. No other website is an official source for the app."}
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <DownloadButton describedBy="download-status" className="w-full" />
                <a
                  href="#install"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-brand-tint"
                >
                  How to install the APK
                  <ArrowRight aria-hidden className="size-4" />
                </a>
              </div>

              {release.available && release.releaseNotes.length > 0 ? (
                <div className="mt-6">
                  <h3 className="font-mono text-xs font-semibold tracking-wider text-ink uppercase">What&apos;s in this release</h3>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted">
                    {release.releaseNotes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-4">
              {release.available ? <DownloadQr href={release.downloadUrl} /> : null}

              <dl className="divide-y divide-line-muted rounded-2xl border border-line">
                {details.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-4 px-5 py-3.5">
                    <dt className="font-mono text-xs tracking-wide text-muted uppercase">{item.label}</dt>
                    <dd className="text-right text-sm font-semibold text-ink">{item.value}</dd>
                  </div>
                ))}
              </dl>

              {release.available && release.sha256 ? (
                <div>
                  <p className="font-mono text-xs font-semibold tracking-wide text-ink uppercase">SHA-256 checksum</p>
                  <code className="mt-1.5 block rounded-xl bg-surface px-3 py-2 font-mono text-[0.7rem] leading-relaxed break-all text-muted">
                    {release.sha256}
                  </code>
                </div>
              ) : null}
            </div>
          </div>
        </Reveal>

        <Reveal delay={180} className="mt-6">
          <aside
            aria-label="Emergency notice"
            className="flex gap-4 rounded-2xl border border-brand/20 bg-brand-tint p-5 sm:p-6"
          >
            <PhoneCall aria-hidden className="mt-0.5 size-5 shrink-0 text-brand" />
            <p className="text-sm leading-relaxed text-ink">
              <strong className="font-semibold">In a life-threatening emergency, call your local emergency hotline directly.</strong>{" "}
              CORDOVA RISKQ helps coordinate assistance but does not replace emergency calls, and SOS
              alerts and reports need an internet connection to reach responders.
            </p>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}
