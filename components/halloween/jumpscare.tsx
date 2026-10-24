"use client";

import { useEffect, useState } from "react";
import { useHalloweenSound } from "@/components/halloween/sound-context";
import { HALLOWEEN_FLAGS, readFlag, shouldJumpscare, writeFlag } from "@/lib/halloween";

const DELAY_MS = 2500;
const GHOST = "/halloween/ghost.webp";

function storage(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function inView(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight && r.bottom > 0;
}

/**
 * The ghost lunges at the screen once per session, a moment after the
 * visitor scrolls past the hero. Never while the download panel is on screen.
 */
export function Jumpscare({ overlayOpen }: { overlayOpen: boolean }) {
  const { scream } = useHalloweenSound();
  const [playing, setPlaying] = useState(false);

  // Load the image early so she doesn't pop in late.
  useEffect(() => {
    if (!overlayOpen) new Image().src = GHOST;
  }, [overlayOpen]);

  useEffect(() => {
    if (overlayOpen) return;
    const hero = document.getElementById("top");
    if (!hero) return;
    let timer = 0;
    const observer = new IntersectionObserver(([entry]) => {
      window.clearTimeout(timer);
      if (entry.isIntersecting) return;
      timer = window.setTimeout(() => {
        const ok = shouldJumpscare({
          seen: readFlag(storage(), HALLOWEEN_FLAGS.jumpscareSeen) === "1",
          reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
          overlayOpen,
        });
        // If the download panel is on screen, wait for the next time the hero leaves view.
        if (!ok || inView("download")) return;
        writeFlag(storage(), HALLOWEEN_FLAGS.jumpscareSeen, "1");
        setPlaying(true);
        scream();
        observer.disconnect();
      }, DELAY_MS);
    });
    observer.observe(hero);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [overlayOpen, scream]);

  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPlaying(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playing]);

  if (!playing) return null;

  return (
    <div
      aria-hidden
      className="hw-scare fixed inset-0 z-[100] cursor-pointer overflow-hidden bg-black"
      onClick={() => setPlaying(false)}
      onAnimationEnd={(e) => e.target === e.currentTarget && setPlaying(false)}
    >
      <div className="hw-scare-shake absolute inset-0 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element -- must show instantly from the preloaded cache */}
        <img src={GHOST} alt="" className="hw-scare-fig h-full w-full object-cover sm:h-[95vh] sm:w-auto sm:object-contain" />
      </div>
      <div className="hw-scare-flash absolute inset-0" />
      <div className="hw-scare-grain absolute inset-0" />
    </div>
  );
}
