import Image from "next/image";
import { Lightbulb } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { ScrollRail } from "@/components/scroll-rail";
import { Section, cn } from "@/components/ui";
import { GUIDE, type GuidePanel, type GuideTone } from "@/lib/content";

const TONES: Record<GuideTone, { panel: string; label: string; body: string; tip: string }> = {
  red: {
    panel: "bg-[linear-gradient(165deg,#d4183a_0%,#c8102e_45%,#9c0c24_100%)] text-white",
    label: "text-white/75",
    body: "text-white/85",
    tip: "bg-white text-brand",
  },
  light: {
    panel: "bg-[linear-gradient(165deg,#ffffff_0%,#fff7f5_50%,#fdecea_100%)] text-ink ring-1 ring-line ring-inset",
    label: "text-brand",
    body: "text-muted",
    tip: "bg-brand text-white",
  },
  dark: {
    panel: "bg-[linear-gradient(165deg,#2a1216_0%,#1c1012_60%,#17181a_100%)] text-white",
    label: "text-[#ff8fa0]",
    body: "text-white/75",
    tip: "bg-brand text-white",
  },
  tide: {
    panel: "bg-[linear-gradient(165deg,#13909c_0%,#0e7b86_50%,#0a5d66_100%)] text-white",
    label: "text-white/75",
    body: "text-white/85",
    tip: "bg-white text-tide",
  },
};

export function AppGuideSection() {
  return (
    <Section
      id="guide"
      eyebrow="App guide"
      title="How to use CORDOVA RISKQ."
      intro="A quick tour of the screens you'll use most — what each one is for and how to use it."
    >
      <Reveal>
        <ScrollRail label="App guide" auto>
          {GUIDE.map((panel, index) => (
            <li key={panel.id} className="w-[82%] shrink-0 snap-start sm:w-[19.5rem]">
              <GuideCard panel={panel} index={index} />
            </li>
          ))}
        </ScrollRail>
      </Reveal>
    </Section>
  );
}

function GuideCard({ panel, index }: { panel: GuidePanel; index: number }) {
  const tone = TONES[panel.tone];
  const [front, back] = panel.shots;

  return (
    <article
      className={cn(
        "relative flex h-[38rem] flex-col overflow-hidden rounded-[1.75rem] p-6 transition duration-300 ease-out-soft hover:-translate-y-1",
        tone.panel,
      )}
    >
      <p className={cn("font-mono text-[0.7rem] font-semibold tracking-[0.16em] uppercase", tone.label)}>
        {String(index + 1).padStart(2, "0")} · {panel.label}
      </p>
      <h3 className="mt-3 font-wordmark text-[clamp(1.35rem,7.4vw,1.7rem)] leading-[1.02] tracking-tight text-balance uppercase">
        {panel.title}
      </h3>
      <p className={cn("mt-3 text-sm leading-relaxed", tone.body)}>{panel.description}</p>
      <p
        className={cn(
          "mt-4 inline-flex items-start gap-1.5 self-start rounded-xl px-3 py-2 text-xs leading-snug font-semibold shadow-sm",
          tone.tip,
        )}
      >
        <Lightbulb aria-hidden className="mt-px size-3.5 shrink-0" />
        {panel.tip}
      </p>

      {/* Screenshots sit at the bottom and run off the edge, store-listing style. */}
      <div className="relative mt-auto h-[19rem]">
        {back ? (
          <Phone
            shot={back}
            className="absolute top-6 -right-6 w-[58%] rotate-[7deg] opacity-95"
          />
        ) : null}
        <Phone
          shot={front}
          className={cn("absolute top-0 w-[62%]", back ? "-left-1 -rotate-[4deg]" : "left-1/2 -translate-x-1/2")}
        />
      </div>
    </article>
  );
}

function Phone({ shot, className }: { shot: GuidePanel["shots"][number]; className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[1.6rem] border-[5px] border-ink bg-ink shadow-[0_24px_40px_-18px_rgba(0,0,0,0.55)]",
        className,
      )}
    >
      <Image src={shot.image} alt={shot.alt} sizes="200px" className="block h-auto w-full rounded-[1.25rem]" />
    </div>
  );
}
