"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Stagger offset in milliseconds. Keep small (≤ 240ms). */
  delay?: number;
  className?: string;
}

/**
 * Fades content up once when it scrolls into view. Content is visible by
 * default (no JavaScript, slow networks); only elements still off screen when
 * this mounts are hidden and then revealed. Styles and reduced-motion
 * handling live in globals.css.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Already on screen when scripts load: leave it visible rather than
    // hiding it in front of the user.
    const rect = el.getBoundingClientRect();
    const onScreen =
      rect.top < window.innerHeight && rect.bottom > 0 && rect.left < window.innerWidth && rect.right > 0;
    if (onScreen || !("IntersectionObserver" in window)) {
      el.dataset.visible = "";
      return;
    }

    // Off screen: hide it now (nobody can see that happen) and play the
    // reveal once it scrolls into view.
    el.dataset.armed = "";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.dataset.visible = "";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
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
