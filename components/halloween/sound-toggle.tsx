"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useHalloweenSound } from "@/components/halloween/sound-context";

/** Header button to turn the Halloween sounds on or off. */
export function SoundToggle() {
  const { enabled, setEnabled } = useHalloweenSound();
  return (
    <button
      type="button"
      aria-pressed={enabled}
      aria-label="Halloween sounds"
      title={enabled ? "Sound on" : "Sound off"}
      onClick={() => setEnabled(!enabled)}
      className="hw-only inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-line text-ink transition hover:bg-brand-tint hover:text-brand active:scale-95"
    >
      {enabled ? <Volume2 aria-hidden className="size-5" /> : <VolumeX aria-hidden className="size-5" />}
    </button>
  );
}
