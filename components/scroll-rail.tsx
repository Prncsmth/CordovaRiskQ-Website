"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/components/ui";

interface ScrollRailProps {
  label: string;
  /** The rail's <li> items. */
  children: ReactNode;
  /**
   * Keep the rail gently moving in a seamless loop. It pauses on hover, focus,
   * touch, button use and when off-screen, and never runs for users who
   * prefer reduced motion.
   */
  auto?: boolean;
  /** Auto-scroll speed in pixels per second. */
  speed?: number;
}

const RESUME_AFTER_MS = 2500;

/** Horizontally scrolling list with previous/next buttons and optional auto-scroll. */
export function ScrollRail({ label, children, auto = false, speed = 32 }: ScrollRailProps) {
  const railRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const pauseUntil = useRef(0);
  const hovering = useRef(false);

  const update = useCallback(() => {
    const rail = railRef.current;
    if (!rail || auto) return;
    setAtStart(rail.scrollLeft <= 4);
    setAtEnd(rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4);
  }, [auto]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    update();
    rail.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      rail.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  // Event timestamps share performance.now()'s clock, which the animation loop uses.
  const pauseForAWhile = (event: { timeStamp: number }) => {
    pauseUntil.current = event.timeStamp + RESUME_AFTER_MS;
  };

  // Continuous auto-scroll. The items are rendered twice; when the first copy
  // has scrolled fully out of view we jump back by exactly one copy's width,
  // which looks seamless.
  useEffect(() => {
    const rail = railRef.current;
    if (!auto || !rail) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
      const paused = hovering.current || now < pauseUntil.current || document.hidden || !visible;
      if (paused) {
        position = rail.scrollLeft; // follow any manual scrolling
      } else {
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
  }, [auto, speed]);

  const scrollByItem = (direction: 1 | -1, event: { timeStamp: number }) => {
    const rail = railRef.current;
    const item = rail?.querySelector("li");
    if (!rail || !item) return;
    pauseForAWhile(event);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.scrollBy({ left: direction * (item.clientWidth + 16), behavior: reduce ? "auto" : "smooth" });
  };

  // Second copy for the seamless loop: hidden from assistive tech and the tab order.
  const duplicates = auto
    ? Children.map(children, (child, index) =>
        isValidElement(child)
          ? cloneElement(child as ReactElement<Record<string, unknown>>, {
              key: `duplicate-${index}`,
              "aria-hidden": true,
              "data-duplicate": "",
              inert: true,
            })
          : null,
      )
    : null;

  return (
    <div>
      <div className="mb-5 flex justify-end gap-2">
        {([-1, 1] as const).map((direction) => {
          const Arrow = direction === -1 ? ArrowLeft : ArrowRight;
          return (
            <button
              key={direction}
              type="button"
              onClick={(event) => scrollByItem(direction, event)}
              disabled={auto ? false : direction === -1 ? atStart : atEnd}
              aria-label={direction === -1 ? `Previous: ${label}` : `Next: ${label}`}
              className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-white text-ink transition duration-200 ease-out-soft hover:border-faint hover:bg-surface active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
            >
              <Arrow aria-hidden className="size-5" />
            </button>
          );
        })}
      </div>
      <ul
        ref={railRef}
        aria-label={label}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") hovering.current = true;
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") hovering.current = false;
        }}
        onPointerDown={pauseForAWhile}
        onTouchMove={pauseForAWhile}
        onWheel={pauseForAWhile}
        onFocus={() => (hovering.current = true)}
        onBlur={() => (hovering.current = false)}
        className={cn(
          "rail rail-fade -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6",
          // Snap points fight the continuous motion, so only snap when static.
          !auto && "snap-x snap-mandatory scroll-px-4 sm:scroll-px-6",
        )}
      >
        {children}
        {duplicates}
      </ul>
    </div>
  );
}
