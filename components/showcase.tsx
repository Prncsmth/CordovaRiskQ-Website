"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ShowcaseVideo, useClipSteps } from "@/components/showcase-video";
import { cn } from "@/components/ui";
import { SHOWCASE as items, type ShowcaseItem } from "@/lib/content";

/**
 * Accessible tabs (WAI-ARIA tabs pattern) showing one app feature at a time.
 * Each recording plays once, then the next tab opens on its own, so the whole
 * tour plays through without any clicks.
 */
export function Showcase() {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const tablistRef = useRef<HTMLDivElement>(null);

  // Keep the active tab in view in the horizontally scrolling tab row (phones),
  // without scrolling the page itself.
  useEffect(() => {
    const list = tablistRef.current;
    const tab = tabRefs.current[active];
    if (!list || !tab) return;
    list.scrollTo({ left: tab.offsetLeft - list.clientWidth / 2 + tab.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  const next = () => setActive((index) => (index + 1) % items.length);

  const select = (index: number) => {
    const next = (index + items.length) % items.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, () => void> = {
      ArrowRight: () => select(active + 1),
      ArrowLeft: () => select(active - 1),
      Home: () => select(0),
      End: () => select(items.length - 1),
    };
    const action = keys[event.key];
    if (action) {
      event.preventDefault();
      action();
    }
  };

  const item = items[active];

  return (
    <div>
      <div
        ref={tablistRef}
        role="tablist"
        aria-label="App features"
        className="rail -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {items.map((tab, index) => {
          const TabIcon = tab.icon;
          const selected = index === active;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              id={`${baseId}-tab-${tab.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={onKeyDown}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs font-semibold tracking-wide uppercase transition duration-200 ease-out-soft",
                selected
                  ? "border-brand bg-brand text-white shadow-[0_6px_16px_-8px_rgba(200,16,46,0.6)]"
                  : "border-line bg-white text-muted hover:border-faint hover:text-ink",
              )}
            >
              <TabIcon aria-hidden className="size-4" />
              {tab.tab}
            </button>
          );
        })}
      </div>

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${item.id}`}
        tabIndex={0}
        className="mt-6 overflow-hidden rounded-3xl border border-line bg-white"
      >
        {/* Keyed so the video and step state reset when the tab changes. */}
        <ShowcasePanel key={item.id} item={item} onEnded={next} />
      </div>
    </div>
  );
}

function ShowcasePanel({ item, onEnded }: { item: ShowcaseItem; onEnded: () => void }) {
  const { videoRef, active, time, duration, onTime } = useClipSteps(item.steps);
  const step = item.steps[active];
  const Icon = item.icon;

  return (
    <div className="panel-in grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-12 lg:p-12">
      <div className="flex flex-col">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-brand text-white shadow-[0_8px_18px_-8px_rgba(200,16,46,0.6)]">
          <Icon aria-hidden className="size-6" />
        </span>
        <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">{item.title}</h3>
        <p className="mt-2 max-w-md leading-relaxed text-muted">{item.summary}</p>

        {/* The explanation follows the video: the current step slides in, and
            the bar shows how far through each step the recording is. */}
        <div className="mt-8" aria-live="polite">
          <StepProgress steps={item.steps} time={time} duration={duration} />
          <div key={active} className="step-caption mt-5 flex items-start gap-4">
            <span className="font-display text-5xl leading-none font-bold text-brand tabular-nums">
              {String(active + 1).padStart(2, "0")}
            </span>
            <p className="pt-1 font-display text-xl leading-snug font-semibold text-ink sm:text-2xl">{step.label}</p>
          </div>
        </div>
      </div>

      <div className="media-in relative flex items-center justify-center overflow-hidden rounded-2xl bg-[linear-gradient(160deg,#ffffff_0%,#fff7f5_45%,#fdecea_100%)] p-6 ring-1 ring-line sm:p-8">
        <svg aria-hidden viewBox="0 0 400 400" className="pointer-events-none absolute -top-24 -right-24 size-80" fill="none">
          <circle cx="200" cy="200" r="190" stroke="#c8102e" strokeOpacity="0.1" />
          <circle cx="200" cy="200" r="140" stroke="#c8102e" strokeOpacity="0.14" />
          <circle className="radius-pulse" cx="200" cy="200" r="150" stroke="#c8102e" strokeOpacity="0.3" />
        </svg>
        <PhoneFrame className="relative w-full max-w-62">
          <ShowcaseVideo
            clip={item.clip}
            label={`CORDOVA RISKQ app: ${item.title}`}
            videoRef={videoRef}
            onTime={onTime}
            onEnded={onEnded}
          />
        </PhoneFrame>
      </div>
    </div>
  );
}

/** Frames a real recording like a phone. */
export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <figure className={className}>
      <div className="overflow-hidden rounded-[2.1rem] border-[7px] border-ink bg-ink shadow-[0_34px_60px_-30px_rgba(23,24,26,0.6)]">
        <div className="overflow-hidden rounded-[1.6rem] bg-white">{children}</div>
      </div>
    </figure>
  );
}

/** One segment per step; the current one fills as the recording plays. */
function StepProgress({ steps, time, duration }: { steps: ShowcaseItem["steps"]; time: number; duration: number }) {
  return (
    <ol className="flex gap-1.5" aria-label="Video progress">
      {steps.map((step, index) => {
        const end = steps[index + 1]?.at ?? duration;
        const span = end - step.at;
        const fill = span > 0 ? Math.min(Math.max((time - step.at) / span, 0), 1) : time >= step.at ? 1 : 0;
        return (
          <li key={step.at} className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
            <span
              className="block h-full origin-left rounded-full bg-brand transition-transform duration-300 ease-linear"
              style={{ transform: `scaleX(${fill})` }}
            />
          </li>
        );
      })}
    </ol>
  );
}
