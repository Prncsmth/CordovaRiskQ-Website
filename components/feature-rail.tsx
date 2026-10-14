"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/reveal";
import { FEATURES as features } from "@/lib/content";

/** Horizontally scrolling, numbered feature cards with previous/next controls. */
export function FeatureRail() {
  const railRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    setAtStart(rail.scrollLeft <= 4);
    setAtEnd(rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4);
  }, []);

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

  const scrollByCard = (direction: 1 | -1) => {
    const rail = railRef.current;
    const card = rail?.querySelector("li");
    if (!rail || !card) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.scrollBy({ left: direction * (card.clientWidth + 16), behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div>
      <div className="mb-5 flex justify-end gap-2">
        {([-1, 1] as const).map((direction) => {
          const disabled = direction === -1 ? atStart : atEnd;
          const Arrow = direction === -1 ? ArrowLeft : ArrowRight;
          return (
            <button
              key={direction}
              type="button"
              onClick={() => scrollByCard(direction)}
              disabled={disabled}
              aria-label={direction === -1 ? "Previous features" : "Next features"}
              className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-white text-ink transition duration-200 ease-out-soft hover:border-faint hover:bg-surface active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
            >
              <Arrow aria-hidden className="size-5" />
            </button>
          );
        })}
      </div>

      <ul
        ref={railRef}
        aria-label="Features"
        className="rail -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6"
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <li key={feature.title} className="w-[82%] shrink-0 snap-start sm:w-[22rem]">
              <Reveal delay={(index % 4) * 70} className="h-full">
                <article className="group flex h-full flex-col rounded-3xl border border-line bg-white p-6 transition duration-300 ease-out-soft hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-[0_16px_36px_-24px_rgba(23,24,26,0.4)]">
                  <div className="flex items-start justify-between">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-tint text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                      <Icon aria-hidden className="size-6" />
                    </span>
                    <span aria-hidden className="font-mono text-sm text-faint">
                      /{String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-6 font-wordmark text-lg leading-snug tracking-tight text-ink uppercase">
                    {feature.title}
                  </h3>
                  <p className="mt-3 flex-1 leading-relaxed text-muted">{feature.description}</p>
                </article>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
