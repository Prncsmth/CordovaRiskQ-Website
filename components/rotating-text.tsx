"use client";

import { useEffect, useState } from "react";

interface RotatingTextProps {
  phrases: readonly string[];
  intervalMs?: number;
  className?: string;
}

/**
 * Cycles through short phrases. Purely visual: screen readers get the full
 * list once, and users who prefer reduced motion see the first phrase only.
 */
export function RotatingText({ phrases, intervalMs = 2600, className }: RotatingTextProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches || phrases.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % phrases.length), intervalMs);
    return () => window.clearInterval(id);
  }, [phrases.length, intervalMs]);

  return (
    <span className={className}>
      <span className="sr-only">{phrases.join(" ")}</span>
      <span aria-hidden key={index} className="rotate-in inline-block">
        {phrases[index]}
      </span>
    </span>
  );
}
