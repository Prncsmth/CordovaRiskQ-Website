"use client";

import { useSyncExternalStore } from "react";
import { getHalloweenAudio } from "@/lib/halloween-audio";
import { HALLOWEEN_FLAGS, readFlag, writeFlag } from "@/lib/halloween";

// A tiny shared store, so the header button, the pumpkin, the gate and the
// jumpscare all agree on whether sound is on without a wrapping provider.
let enabled = false;
const listeners = new Set<() => void>();

function storage(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function setEnabled(on: boolean) {
  enabled = on;
  writeFlag(storage(), HALLOWEEN_FLAGS.gate, on ? "sound" : "quiet");
  const audio = getHalloweenAudio();
  if (audio) {
    if (on) {
      void audio.unlock();
      audio.setMuted(false);
      audio.startAmbient();
    } else {
      audio.stopAmbient();
    }
  }
  listeners.forEach((l) => l());
}

/** Whether the visitor chose sound earlier in this session (still needs a click to start). */
export function savedSoundChoice(): string | null {
  return readFlag(storage(), HALLOWEEN_FLAGS.gate);
}

export function useHalloweenSound() {
  const on = useSyncExternalStore(
    subscribe,
    () => enabled,
    () => false,
  );
  return {
    enabled: on,
    setEnabled,
    scream: () => {
      if (enabled) getHalloweenAudio()?.scream();
    },
    sting: () => {
      if (enabled) getHalloweenAudio()?.sting();
    },
  };
}

/** Plays the jumpscare scream if sound is on. Stable, so effects can call it freely. */
export function playScream() {
  if (enabled) getHalloweenAudio()?.scream();
}

/**
 * The click pop-up sound: a deep boom, a scream and a hiss together. The click
 * itself lets the browser play sound, so this also turns the lullaby back on
 * after a reload, unless the visitor chose to enter quietly.
 */
export function playPopScare() {
  if (savedSoundChoice() === "quiet") return;
  if (!enabled) setEnabled(true);
  const audio = getHalloweenAudio();
  if (!audio) return;
  void audio.unlock();
  audio.sting();
  audio.scream();
  audio.hiss();
}

export type ScareSound = "scream" | "moan" | "sting" | "hiss";

/** Plays one of the click-scare sounds, if the visitor has sound on. */
export function playScareSound(kind: ScareSound) {
  if (!enabled) return;
  const audio = getHalloweenAudio();
  if (!audio) return;
  void audio.unlock();
  audio[kind]();
}
