"use client";

import Image from "next/image";
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
        className="rail rail-fade -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6"
      >
        {features.map((feature, index) => {
          return (
            <li key={feature.title} className="w-[82%] shrink-0 snap-start sm:w-88">
              <Reveal delay={(index % 4) * 70} className="h-full">
                <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white transition duration-300 ease-out-soft hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-[0_16px_36px_-24px_rgba(23,24,26,0.4)]">
                  {/* Real app screenshot: the top of the phone peeks out of a tinted panel. */}
                  <div className="relative h-56 overflow-hidden bg-[linear-gradient(160deg,#fff7f5_0%,#fdecea_60%,#fbdad6_100%)]">
                    <span
                      aria-hidden
                      className="absolute top-4 right-4 z-10 rounded-full bg-white/85 px-2.5 py-1 font-mono text-xs text-muted backdrop-blur"
                    >
                      /{String(index + 1).padStart(2, "0")}
                    </span>
                    {feature.image.width > feature.image.height ? (
                      // Landscape crop of a screen: shown as a card rather than in a phone frame.
                      <div className="absolute top-12 right-5 left-5 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_18px_34px_-16px_rgba(23,24,26,0.45)] transition duration-500 ease-out-soft group-hover:-translate-y-2">
                        <Image
                          src={feature.image}
                          alt={`CORDOVA RISKQ app: ${feature.title}`}
                          sizes="320px"
                          className="block h-auto w-full"
                        />
                      </div>
                    ) : (
                      <div className="absolute top-7 left-1/2 w-[62%] -translate-x-1/2 overflow-hidden rounded-t-3xl border-[5px] border-b-0 border-ink bg-ink shadow-[0_18px_34px_-16px_rgba(23,24,26,0.5)] transition duration-500 ease-out-soft group-hover:-translate-y-2">
                        <Image
                          src={feature.image}
                          alt={`CORDOVA RISKQ app: ${feature.title}`}
                          sizes="220px"
                          className="block h-auto w-full rounded-t-[1.1rem]"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-wordmark text-lg leading-snug tracking-tight text-ink uppercase">
                      {feature.title}
                    </h3>
                    <p className="mt-3 flex-1 leading-relaxed text-muted">{feature.description}</p>
                  </div>
                </article>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
