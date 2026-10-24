"use client";

import { useEffect, useRef, useState } from "react";
import { playPopScare } from "@/components/halloween/sound-context";

const LIFETIME_MS = 1100;

/**
 * Every click or tap pops up the ghost for about a second, with a scream.
 * It never takes the click itself, so the button underneath still works.
 */
export function ClickScares({ disabled }: { disabled: boolean }) {
  const [id, setId] = useState<number | null>(null);
  const nextId = useRef(0);

  useEffect(() => {
    // Not while the "Enter if you dare" pop-up is still open.
    if (disabled) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer = 0;
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      playPopScare();
      if (reduced.matches) return;
      setId(nextId.current++);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setId(null), LIFETIME_MS);
    };
    document.addEventListener("pointerdown", onDown, { capture: true, passive: true });
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("pointerdown", onDown, { capture: true });
    };
  }, [disabled]);

  if (id === null) return null;

  return (
    <div aria-hidden key={id} className="hw-pop pointer-events-none fixed inset-0 z-[95] flex items-center justify-center">
      <div className="hw-pop-box hw-pop-figure">
        <div className="hw-pop-grain" />
      </div>
    </div>
  );
}
