"use client";

import { JackOLantern } from "@/components/halloween/jack-o-lantern";
import { useHalloweenSound } from "@/components/halloween/sound-context";

/** The hero's glowing pumpkin. Clicking it gives a deep "boom" when sound is on. */
export function PumpkinButton({ className = "" }: { className?: string }) {
  const { sting } = useHalloweenSound();
  return (
    <button
      type="button"
      onClick={sting}
      aria-label="Jack-o'-lantern"
      tabIndex={-1}
      className={`hw-pumpkin cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 ${className}`}
    >
      <JackOLantern className="h-auto w-full" />
    </button>
  );
}
