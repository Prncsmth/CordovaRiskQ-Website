"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Stagger offset in milliseconds. Keep small (≤ 240ms). */
  delay?: number;
  className?: string;
}

/**
 * Fades content in every time it scrolls into view, scrolling down or back
 * up: it hides again once it has left the screen, so the next pass replays
 * the fade. Content is visible by default (no JavaScript, slow networks);
 * only elements still off screen when this mounts start hidden. Styles live
 * in globals.css.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const onScreen =
      rect.top < window.innerHeight && rect.bottom > 0 && rect.left < window.innerWidth && rect.right > 0;
    if (!("IntersectionObserver" in window)) {
      el.dataset.visible = "";
      return;
    }
    // Already on screen when scripts load: show it rather than hiding it in
    // front of the user. Off screen: it starts hidden (nobody can see that).
    if (onScreen) el.dataset.visible = "";

    el.dataset.armed = "";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.12) {
          el.dataset.visible = "";
        } else if (!entry.isIntersecting) {
          // Fully off screen: reset, so it fades in again on the next pass.
          delete el.dataset.visible;
        }
      },
      { threshold: [0, 0.12] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal=""
      className={className}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
