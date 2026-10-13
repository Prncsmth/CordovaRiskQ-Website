import { CircleAlert, Clock, PhoneCall, ShieldCheck } from "lucide-react";
import { DownloadButton } from "@/components/download-button";
import { Logo } from "@/components/ui";
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
    { label: "Platform", value: "Android (APK)" },
  ];

  return (
    <section id="download" aria-labelledby="download-heading" className="border-y border-line bg-surface py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-[0_1px_2px_rgba(23,24,26,0.04)]">
          <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
            <div>
              <Logo />
              <h2 id="download-heading" className="mt-6 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Download the Android app
              </h2>

              <p className="mt-4 flex items-center gap-2" id="download-status">
                {release.available ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-success-bg px-3 py-1 text-sm font-semibold text-success">
                    <ShieldCheck aria-hidden className="size-4" />
                    Available
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-bg px-3 py-1 text-sm font-semibold text-warning">
                    <Clock aria-hidden className="size-4" />
                    APK not yet available
                  </span>
                )}
              </p>

              <p className="mt-4 max-w-xl leading-relaxed text-muted">
                {release.available
                  ? "Download the official APK below, then follow the installation guide to set it up on your Android phone."
                  : "The download will be enabled here once the official build is released and its download link has been verified. No other website is an official source for the app."}
              </p>

              <div className="mt-8">
                <DownloadButton describedBy="download-status" className="w-full sm:w-auto" />
              </div>

              {release.available && release.sha256 ? (
                <div className="mt-6">
                  <p className="text-sm font-medium text-ink">SHA-256 checksum</p>
                  <code className="mt-1 block rounded-lg bg-surface px-3 py-2 font-mono text-xs break-all text-muted">
                    {release.sha256}
                  </code>
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-6">
              <dl className="divide-y divide-line-muted rounded-2xl border border-line">
                {details.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-4 px-5 py-4">
                    <dt className="text-sm text-muted">{item.label}</dt>
                    <dd className="text-right text-sm font-semibold text-ink">{item.value}</dd>
                  </div>
                ))}
              </dl>

              {release.available && release.releaseNotes.length > 0 ? (
                <div>
                  <h3 className="text-sm font-semibold text-ink">What&apos;s in this release</h3>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted">
                    {release.releaseNotes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <aside
          aria-label="Emergency notice"
          className="mt-6 flex gap-4 rounded-2xl border border-brand/20 bg-brand-tint p-5 sm:p-6"
        >
          <PhoneCall aria-hidden className="mt-0.5 size-5 shrink-0 text-brand" />
          <p className="text-sm leading-relaxed text-ink">
            <strong className="font-semibold">In a life-threatening emergency, call your local emergency hotline directly.</strong>{" "}
            CORDOVA RISKQ helps coordinate assistance but does not replace emergency calls, and SOS
            alerts and reports need an internet connection to reach responders.
          </p>
        </aside>

        {!release.available ? (
          <p className="mt-4 flex items-start gap-2 text-sm text-muted">
            <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
            Be cautious of APK files offered elsewhere that claim to be CORDOVA RISKQ.
          </p>
        ) : null}
      </div>
    </section>
  );
}
