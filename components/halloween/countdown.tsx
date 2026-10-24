"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { HALLOWEEN_FLAGS, getCountdown, readFlag, writeFlag } from "@/lib/halloween";

function storage(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Floating countdown to Halloween night. Only rendered on the client. */
export function Countdown({ hidden }: { hidden: boolean }) {
  const [now, setNow] = useState(() => Date.now());
  const [closed, setClosed] = useState(() => readFlag(storage(), HALLOWEEN_FLAGS.countdownClosed) === "1");

  useEffect(() => {
    if (hidden || closed) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [hidden, closed]);

  if (hidden || closed) return null;

  const c = getCountdown(new Date(now));
  const close = () => {
    writeFlag(storage(), HALLOWEEN_FLAGS.countdownClosed, "1");
    setClosed(true);
  };
  const units: [number, string][] = [
    [c.days, "Days"],
    [c.hours, "Hrs"],
    [c.minutes, "Min"],
    [c.seconds, "Sec"],
  ];

  return (
    <aside
      aria-label="Countdown to Halloween"
      className="hw-countdown fixed bottom-3 left-1/2 z-[60] w-[min(calc(100%-1.5rem),20rem)] -translate-x-1/2 rounded-2xl border border-[#d11f2a]/40 bg-[#1a0a0f]/90 p-3 text-[#f3e9e4] shadow-[0_0_40px_rgb(209_31_42/0.35)] backdrop-blur-md sm:bottom-5 sm:left-5 sm:translate-x-0 sm:p-4"
    >
      <button
        type="button"
        onClick={close}
        aria-label="Close countdown"
        className="absolute top-2 right-2 inline-flex size-7 items-center justify-center rounded-full text-[#c9b4b0] transition hover:bg-white/10 hover:text-white"
      >
        <X aria-hidden className="size-4" />
      </button>
      {c.arrived ? (
        <p className="py-2 pr-6 text-center font-wordmark text-lg uppercase">Happy Halloween 🎃</p>
      ) : (
        <>
          <p className="pr-6 font-mono text-[0.68rem] font-semibold tracking-[0.2em] text-[#ff5a6a] uppercase">
            🎃 Halloween in
          </p>
          <div aria-live="off" className="mt-2 grid grid-cols-4 gap-1.5">
            {units.map(([v, label]) => (
              <div key={label} className="rounded-lg border border-[#d11f2a]/25 bg-black/40 py-1.5 text-center">
                <div className="font-wordmark text-xl tabular-nums sm:text-2xl">{pad(v)}</div>
                <div className="text-[0.6rem] tracking-wider text-[#9c8682] uppercase">{label}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </aside>
  );
}
