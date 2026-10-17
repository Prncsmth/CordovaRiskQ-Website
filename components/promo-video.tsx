"use client";

import { Play } from "lucide-react";
import { useRef, useState } from "react";

const SRC = "/brand/video/cordova-riskq-promo.mp4";
const POSTER = "/brand/video/cordova-riskq-promo-poster.jpg";

/**
 * The CORDOVA RISKQ promo video (with voiceover). It never autoplays: the
 * poster shows a large play button, and the first tap starts it with sound
 * and the browser's normal controls.
 */
export function PromoVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const start = () => {
    setStarted(true);
    videoRef.current?.play().catch(() => {});
  };

  return (
    <figure className="relative mx-auto max-w-5xl">
      <div className="relative aspect-video overflow-hidden rounded-3xl bg-ink shadow-[0_40px_80px_-40px_rgba(200,16,46,0.55)] ring-1 ring-ink/10">
        <video
          ref={videoRef}
          src={SRC}
          poster={POSTER}
          controls={started}
          playsInline
          preload="none"
          aria-label="CORDOVA RISKQ promo video"
          className="size-full object-cover"
        />
        {started ? null : (
          <button
            type="button"
            onClick={start}
            className="group absolute inset-0 flex items-center justify-center bg-ink/20 transition-colors duration-300 hover:bg-ink/10"
          >
            <span className="relative flex size-16 items-center justify-center rounded-full bg-brand text-white shadow-[0_12px_30px_-8px_rgba(200,16,46,0.8)] transition-transform duration-300 ease-out-soft group-hover:scale-110 sm:size-24">
              <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-brand/40" />
              <Play aria-hidden className="relative size-7 translate-x-0.5 fill-white sm:size-10" />
            </span>
            <span className="absolute bottom-2.5 left-2.5 rounded-full bg-ink/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur sm:bottom-6 sm:left-6 sm:px-3 sm:py-1.5 sm:text-sm">
              Watch the video · 3:43
            </span>
            <span className="sr-only">Play the CORDOVA RISKQ video</span>
          </button>
        )}
      </div>
    </figure>
  );
}
