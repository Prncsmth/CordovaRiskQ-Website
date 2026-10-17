"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { cn } from "@/components/ui";
import type { Clip, ClipStep } from "@/lib/content";

interface ShowcaseVideoProps {
  clip: Clip;
  label: string;
  /** Pass a ref to control the video from outside (e.g. seeking from a step list). */
  videoRef?: RefObject<HTMLVideoElement | null>;
  onTime?: (seconds: number) => void;
  /** Called when the recording finishes. When set, the video plays once instead of looping. */
  onEnded?: () => void;
}

/**
 * Muted screen recording that autoplays while visible (it plays even with
 * reduced motion on, so the tour always runs); a button lets anyone pause it.
 */
export function ShowcaseVideo({ clip, label, videoRef: externalRef, onTime, onEnded }: ShowcaseVideoProps) {
  const internalRef = useRef<HTMLVideoElement>(null);
  const videoRef = externalRef ?? internalRef;
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !userPaused) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.35 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [userPaused, videoRef]);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      setUserPaused(false);
      video.play().catch(() => {});
    } else {
      setUserPaused(true);
      video.pause();
    }
  };

  return (
    <div className="relative">
      <video
        ref={videoRef}
        src={clip.src}
        poster={clip.poster}
        width={clip.width}
        height={clip.height}
        muted
        loop={!onEnded}
        playsInline
        preload="metadata"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={onEnded}
        onTimeUpdate={onTime ? (event) => onTime(event.currentTarget.currentTime) : undefined}
        className="block h-auto w-full bg-surface"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute right-3 bottom-3 inline-flex size-10 items-center justify-center rounded-full bg-ink/75 text-white backdrop-blur transition duration-200 ease-out-soft hover:bg-ink active:scale-95"
      >
        {playing ? <Pause aria-hidden className="size-4" /> : <Play aria-hidden className="size-4 translate-x-px" />}
      </button>
    </div>
  );
}

/** Index of the step the video is currently showing. */
export function activeStepIndex(steps: readonly ClipStep[], time: number): number {
  let index = 0;
  steps.forEach((step, i) => {
    if (time >= step.at) index = i;
  });
  return index;
}

/** Wires a ShowcaseVideo to a ClipSteps list: tracks the active step and seeks on click. */
export function useClipSteps(steps: readonly ClipStep[]) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(0);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const onTime = (seconds: number) => {
    setTime(seconds);
    setActive(activeStepIndex(steps, seconds));
    const total = videoRef.current?.duration;
    if (total && Number.isFinite(total)) setDuration(total);
  };
  const seek = (step: ClipStep) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = step.at;
    setTime(step.at);
    setActive(activeStepIndex(steps, step.at));
    video.play().catch(() => {});
  };
  return { videoRef, active, time, duration, onTime, seek };
}

interface ClipStepsProps {
  steps: readonly ClipStep[];
  active: number;
  onSelect: (step: ClipStep) => void;
  className?: string;
  compact?: boolean;
}

/** Numbered steps synced to a recording. Clicking a step jumps the video there. */
export function ClipSteps({ steps, active, onSelect, className, compact }: ClipStepsProps) {
  return (
    <ol className={cn(compact ? "flex flex-wrap gap-1.5" : "space-y-2", className)}>
      {steps.map((step, index) => {
        const current = index === active;
        return (
          <li key={step.at} className={compact ? undefined : "fact-in"} style={{ "--i": index } as CSSProperties}>
            <button
              type="button"
              onClick={() => onSelect(step)}
              aria-current={current ? "step" : undefined}
              className={cn(
                "flex w-full items-center gap-3 text-left transition duration-200 ease-out-soft",
                compact
                  ? "rounded-full border px-2.5 py-1 font-mono text-[0.68rem] font-semibold tracking-wide uppercase"
                  : "rounded-2xl border p-3 text-sm font-semibold",
                current
                  ? "border-brand/40 bg-brand-tint text-ink"
                  : "border-line-muted bg-surface text-muted hover:border-line hover:text-ink",
              )}
            >
              {compact ? null : (
                <span
                  aria-hidden
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-lg font-mono text-xs",
                    current ? "bg-brand text-white" : "bg-white text-faint ring-1 ring-line",
                  )}
                >
                  {index + 1}
                </span>
              )}
              {step.label}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
