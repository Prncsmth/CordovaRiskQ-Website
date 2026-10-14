"use client";

import { QrCode } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

interface DownloadQrProps {
  /** APK URL: absolute, or a site path such as "/cordova-riskq-v1.0.0.apk". */
  href: string;
}

/**
 * QR code that downloads the APK when scanned with an Android phone.
 * Built in the browser from the page's own origin, so it always points at
 * wherever the site is actually deployed.
 */
export function DownloadQr({ href }: DownloadQrProps) {
  const [svg, setSvg] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const absolute = new URL(href, window.location.origin).toString();
    let cancelled = false;
    QRCode.toString(absolute, {
      type: "svg",
      errorCorrectionLevel: "M",
      margin: 0,
      color: { dark: "#17181a", light: "#ffffff" },
    })
      .then((markup) => {
        if (cancelled) return;
        setSvg(markup);
        setUrl(absolute);
      })
      .catch(() => {
        // Leave the placeholder; the download button still works.
      });
    return () => {
      cancelled = true;
    };
  }, [href]);

  return (
    <figure className="flex w-full min-w-0 flex-col items-center gap-4 rounded-2xl border border-line bg-surface p-4 text-center sm:flex-row sm:text-left">
      <div className="relative size-36 shrink-0 rounded-xl border border-line bg-white p-2.5 sm:size-40">
        {svg ? (
          <div
            role="img"
            aria-label="QR code to download the CORDOVA RISKQ APK"
            className="size-full [&>svg]:size-full [&_path]:[shape-rendering:crispEdges]"
            // Markup generated locally by the qrcode library from our own URL.
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          <div aria-hidden className="flex size-full items-center justify-center text-faint">
            <QrCode className="size-8" />
          </div>
        )}
      </div>
      <figcaption className="w-full min-w-0 sm:flex-1">
        <p className="font-mono text-xs font-semibold tracking-wider text-ink uppercase">Scan to download</p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          On a computer? Scan this with your Android phone&apos;s camera to download the APK directly.
        </p>
        {url ? <p className="mt-1.5 truncate font-mono text-[0.68rem] text-faint">{url}</p> : null}
      </figcaption>
    </figure>
  );
}
