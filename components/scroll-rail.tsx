"use client";

import { Children, cloneElement, isValidElement, useEffect, useRef, type ReactElement, type ReactNode } from "react";

interface ScrollRailProps {
  label: string;
  /** The rail's <li> items. */
  children: ReactNode;
  /** Scroll speed in pixels per second. */
  speed?: number;
}

/**
 * Full-width, always-moving loop of cards. It never stops and cannot be
 * clicked, dragged or swiped — it only plays. The items are rendered twice;
 * when the first copy has scrolled fully out of view the rail jumps back by
 * exactly one copy's width, which looks seamless.
 */
export function ScrollRail({ label, children, speed = 40 }: ScrollRailProps) {
  const railRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    let visible = false;
    let frame = 0;
    let last = 0;
    let position = rail.scrollLeft;

    const loopWidth = () => {
      const first = rail.querySelector<HTMLElement>("li");
      const firstCopy = rail.querySelector<HTMLElement>("li[data-duplicate]");
      return first && firstCopy ? firstCopy.offsetLeft - first.offsetLeft : 0;
    };

    const tick = (now: number) => {
      const dt = last ? Math.min(now - last, 64) : 0;
      last = now;
      // Off-screen rails and background tabs skip work; nobody sees them there.
      if (visible && !document.hidden) {
        position += (speed * dt) / 1000;
        const width = loopWidth();
        if (width > 0 && position >= width) position -= width;
        rail.scrollLeft = Math.round(position);
      }
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
    });
    observer.observe(rail);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [speed]);

  // Second copy for the seamless loop: hidden from assistive tech.
  const duplicates = Children.map(children, (child, index) =>
    isValidElement(child)
      ? cloneElement(child as ReactElement<Record<string, unknown>>, {
          key: `duplicate-${index}`,
          "aria-hidden": true,
          "data-duplicate": "",
          inert: true,
        })
      : null,
  );

  return (
    // Breaks out of the page container so the cards run edge to edge.
    <ul
      ref={railRef}
      aria-label={label}
      className="rail rail-fade pointer-events-none relative left-1/2 flex w-screen -translate-x-1/2 gap-4 overflow-hidden px-4 pb-2 select-none"
    >
      {children}
      {duplicates}
    </ul>
  );
}
