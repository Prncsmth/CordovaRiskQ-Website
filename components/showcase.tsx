"use client";

import Image from "next/image";
import { ChevronRight, Info } from "lucide-react";
import { useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { ShowcaseVideo } from "@/components/showcase-video";
import { cn } from "@/components/ui";
import { SHOWCASE as items, type ShowcaseItem } from "@/lib/content";

/** Accessible tabs (WAI-ARIA tabs pattern) showing one app feature at a time. */
export function Showcase() {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

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
  const Icon = item.icon;

  return (
    <div>
      <div
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
        <div key={item.id} className="panel-in grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:p-10">
          <div>
            <h3 className="font-wordmark text-2xl tracking-tight text-ink uppercase sm:text-3xl">{item.title}</h3>
            <p className="mt-3 max-w-xl leading-relaxed text-muted">{item.description}</p>

            <dl className="mt-6 grid grid-cols-2 gap-3">
              {item.facts.map((fact, index) => (
                <div
                  key={fact.label}
                  className="fact-in rounded-2xl border border-line-muted bg-surface p-4"
                  style={{ "--i": index } as CSSProperties}
                >
                  <dt className="font-mono text-[0.68rem] font-semibold tracking-wider text-faint uppercase">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>

            <p
              className="fact-in mt-5 flex gap-2.5 rounded-2xl border border-brand/15 bg-brand-tint p-4 text-sm leading-relaxed text-ink/85"
              style={{ "--i": item.facts.length } as CSSProperties}
            >
              <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
              {item.note}
            </p>
          </div>

          <ShowcaseVisual item={item} Icon={Icon} />
        </div>
      </div>
    </div>
  );
}

function ShowcaseVisual({ item, Icon }: { item: ShowcaseItem; Icon: ShowcaseItem["icon"] }) {
  const { media } = item;
  return (
    <div className="media-in relative flex flex-col items-center overflow-hidden rounded-2xl bg-[linear-gradient(160deg,#ffffff_0%,#fff7f5_45%,#fdecea_100%)] p-6 ring-1 ring-line sm:p-8">
      <svg aria-hidden viewBox="0 0 400 400" className="pointer-events-none absolute -top-24 -right-24 size-80" fill="none">
        <circle cx="200" cy="200" r="190" stroke="#c8102e" strokeOpacity="0.1" />
        <circle cx="200" cy="200" r="140" stroke="#c8102e" strokeOpacity="0.14" />
        <circle className="radius-pulse" cx="200" cy="200" r="150" stroke="#c8102e" strokeOpacity="0.3" />
      </svg>

      {media ? (
        <figure className="relative w-full max-w-62">
          {/* Real recording or screenshot from the app, framed like a phone. */}
          <div className="overflow-hidden rounded-[2.1rem] border-[7px] border-ink bg-ink shadow-[0_34px_60px_-30px_rgba(23,24,26,0.6)]">
            <div className="overflow-hidden rounded-[1.6rem] bg-white">
              {media.kind === "video" ? (
                <ShowcaseVideo
                  key={media.src}
                  src={media.src}
                  poster={media.poster}
                  width={media.width}
                  height={media.height}
                  label={`CORDOVA RISKQ app: ${media.caption}`}
                />
              ) : (
                <Image
                  src={media.image}
                  alt={`CORDOVA RISKQ app: ${media.caption}`}
                  sizes="248px"
                  className="block h-auto w-full"
                />
              )}
            </div>
          </div>
        </figure>
      ) : (
        <span className="relative flex size-16 items-center justify-center self-start rounded-2xl bg-[linear-gradient(145deg,#feeeec,#fbdad6)] text-brand shadow-sm">
          <Icon aria-hidden className="size-8" />
        </span>
      )}

      <div className="relative mt-6 w-full">
        <p className="font-mono text-[0.68rem] font-semibold tracking-wider text-faint uppercase">Find it in the app</p>
        <ol className="mt-3 flex flex-wrap items-center gap-1.5">
          {item.path.map((step, index) => (
            <li key={step} className="flex items-center gap-1.5">
              {index > 0 ? <ChevronRight aria-hidden className="size-4 text-faint" /> : null}
              <span className="rounded-lg border border-line bg-white px-2.5 py-1.5 text-sm font-semibold text-ink">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
