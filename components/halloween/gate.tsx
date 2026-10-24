"use client";

import { useEffect, useRef, useState } from "react";
import { Fog } from "@/components/halloween/decor";
import { JackOLantern } from "@/components/halloween/jack-o-lantern";
import { useHalloweenSound } from "@/components/halloween/sound-context";

/**
 * "Enter if you dare" pop-up shown once per browser session. Its click is
 * what lets the browser play sound.
 */
export function Gate({ onClose }: { onClose: () => void }) {
  const { setEnabled } = useHalloweenSound();
  const [leaving, setLeaving] = useState(false);
  const enterRef = useRef<HTMLButtonElement>(null);

  const close = (withSound: boolean) => {
    if (leaving) return;
    setEnabled(withSound);
    setLeaving(true);
    window.setTimeout(() => {
      onClose();
      document.getElementById("main")?.focus({ preventScroll: true });
    }, 600);
  };

  useEffect(() => {
    enterRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(false);
      // Keep keyboard focus inside the pop-up.
      if (e.key === "Tab") {
        const buttons = document.querySelectorAll<HTMLButtonElement>(".hw-gate button");
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="hw-gate-title"
      aria-describedby="hw-gate-desc"
      className={`hw-gate fixed inset-0 z-[90] flex items-center justify-center overflow-hidden bg-[#0c0a0b] px-4 ${leaving ? "hw-gate-out" : ""}`}
    >
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_45%,rgb(209_31_42/0.28),transparent_70%)]" />
      <div aria-hidden className="hw-web hw-web-tl absolute" />
      <div aria-hidden className="hw-web hw-web-br absolute" />
      <Fog className="!h-72" />

      <div className="relative flex max-w-md flex-col items-center text-center">
        <JackOLantern className="hw-pumpkin w-44 sm:w-56" />
        <p className="mt-4 font-wordmark text-sm tracking-[0.3em] text-[#ff5a6a] uppercase">Cordova RiskQ</p>
        <h2 id="hw-gate-title" className="hw-gate-title mt-2 font-wordmark text-4xl text-[#f3e9e4] uppercase sm:text-5xl">
          Enter if you dare
        </h2>
        <p id="hw-gate-desc" className="mt-3 text-sm text-[#c9b4b0] sm:text-base">
          Halloween in Cordova · Turn your sound on
        </p>
        <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <button
            ref={enterRef}
            type="button"
            onClick={() => close(true)}
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#c8102e] px-8 font-semibold text-white shadow-[0_0_30px_rgb(209_31_42/0.6)] transition hover:bg-[#d11f2a] active:scale-95"
          >
            Enter
          </button>
          <button
            type="button"
            onClick={() => close(false)}
            className="inline-flex h-12 items-center justify-center rounded-full border border-[#d11f2a]/40 px-8 font-semibold text-[#f3e9e4] transition hover:bg-[#d11f2a]/15 active:scale-95"
          >
            Enter quietly
          </button>
        </div>
      </div>
    </div>
  );
}
