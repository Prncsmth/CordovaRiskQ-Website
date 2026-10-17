"use client";

import { Reveal } from "@/components/reveal";
import { PhoneFrame } from "@/components/showcase";
import { ClipSteps, ShowcaseVideo, useClipSteps } from "@/components/showcase-video";
import { RESPONDER_CLIPS, type ResponderClip } from "@/lib/content";

export function ResponderClips() {
  return (
    <ul className="grid gap-5 md:grid-cols-3">
      {RESPONDER_CLIPS.map((item, index) => (
        <li key={item.id}>
          <Reveal delay={index * 90} className="h-full">
            <ResponderCard item={item} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

function ResponderCard({ item }: { item: ResponderClip }) {
  const { videoRef, active, onTime, seek } = useClipSteps(item.steps);
  return (
    <article className="flex h-full flex-col rounded-3xl border border-line bg-white p-5">
      <div className="rounded-2xl bg-[linear-gradient(160deg,#ffffff_0%,#fff7f5_45%,#fdecea_100%)] p-5 ring-1 ring-line">
        <PhoneFrame className="mx-auto w-full max-w-44 sm:max-w-52">
          <ShowcaseVideo clip={item.clip} label={`Responder app: ${item.title}`} videoRef={videoRef} onTime={onTime} />
        </PhoneFrame>
      </div>
      <h3 className="mt-5 font-display text-lg font-bold tracking-tight text-ink">{item.title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted">{item.summary}</p>
      <ClipSteps steps={item.steps} active={active} onSelect={seek} compact className="mt-4" />
    </article>
  );
}
