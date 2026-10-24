"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { ClickScares } from "@/components/halloween/click-scares";
import { Countdown } from "@/components/halloween/countdown";
import { Gate } from "@/components/halloween/gate";
import { Jumpscare } from "@/components/halloween/jumpscare";
import { savedSoundChoice } from "@/components/halloween/sound-context";
import { HALLOWEEN } from "@/lib/halloween";

const noop = () => () => {};

/** Mounts the Halloween pop-ups, only while the site wears the Halloween look. */
export function HalloweenLayer() {
  const active = useSyncExternalStore(
    noop,
    () => document.documentElement.classList.contains("halloween"),
    () => false,
  );
  // Only shown once per browser session.
  const [gateOpen, setGateOpen] = useState(() => typeof window !== "undefined" && savedSoundChoice() === null);

  useEffect(() => {
    if (!active) return;
    const meta = document.querySelector('meta[name="theme-color"]');
    const prev = meta?.getAttribute("content");
    meta?.setAttribute("content", "#0c0a0b");
    return () => {
      if (prev) meta?.setAttribute("content", prev);
    };
  }, [active]);

  // A tab left open overnight switches back to the official design at the end
  // of the season (reloading clears the theme, pop-ups and sound in one go).
  useEffect(() => {
    if (!active) return;
    const ms = HALLOWEEN.end.getTime() - Date.now();
    if (ms <= 0 || ms > 2_000_000_000) return; // beyond what setTimeout can wait
    const id = window.setTimeout(() => window.location.reload(), ms + 1000);
    return () => window.clearTimeout(id);
  }, [active]);

  if (!active) return null;

  return (
    <>
      {gateOpen && <Gate onClose={() => setGateOpen(false)} />}
      <Countdown hidden={gateOpen} />
      <Jumpscare overlayOpen={gateOpen} />
      <ClickScares disabled={gateOpen} />
    </>
  );
}
