/**
 * Halloween season for the site. All times are Philippine time (UTC+8) and
 * compared as timestamps, so a visitor's own timezone never matters.
 * Update these dates to reuse the theme next year.
 */
export const HALLOWEEN = {
  start: new Date("2026-10-01T00:00:00+08:00"),
  end: new Date("2026-11-01T00:00:00+08:00"),
  night: new Date("2026-10-31T00:00:00+08:00"),
} as const;

export const HALLOWEEN_FLAGS = {
  gate: "hw:gate",
  countdownClosed: "hw:countdown-closed",
  jumpscareSeen: "hw:jumpscare-seen",
} as const;

export function isHalloweenSeason(now: Date): boolean {
  const t = now.getTime();
  return t >= HALLOWEEN.start.getTime() && t < HALLOWEEN.end.getTime();
}

export function getCountdown(now: Date) {
  const left = Math.max(0, HALLOWEEN.night.getTime() - now.getTime());
  const total = Math.floor(left / 1000);
  return {
    days: Math.floor(total / 86_400),
    hours: Math.floor((total % 86_400) / 3_600),
    minutes: Math.floor((total % 3_600) / 60),
    seconds: total % 60,
    arrived: left === 0,
  };
}

export function shouldJumpscare(s: {
  seen: boolean;
  reducedMotion: boolean;
  overlayOpen: boolean;
}): boolean {
  return !s.seen && !s.reducedMotion && !s.overlayOpen;
}

/** Reads a session flag; blocked or missing storage counts as "not set". */
export function readFlag(storage: Pick<Storage, "getItem"> | null, key: string): string | null {
  try {
    return storage ? storage.getItem(key) : null;
  } catch {
    return null;
  }
}

export function writeFlag(
  storage: Pick<Storage, "setItem"> | null,
  key: string,
  value: string,
): void {
  try {
    storage?.setItem(key, value);
  } catch {
    // Private mode or blocked storage: the flag just isn't remembered.
  }
}

// Also remembered in memory, so blocked storage can't make the scare repeat.
let jumpscareSeenThisPage = false;

export function hasSeenJumpscare(storage: Pick<Storage, "getItem"> | null): boolean {
  return jumpscareSeenThisPage || readFlag(storage, HALLOWEEN_FLAGS.jumpscareSeen) === "1";
}

export function markJumpscareSeen(storage: Pick<Storage, "setItem"> | null): void {
  jumpscareSeenThisPage = true;
  writeFlag(storage, HALLOWEEN_FLAGS.jumpscareSeen, "1");
}

/** Runs before paint so the page never flashes the wrong theme. */
export const HALLOWEEN_THEME_SCRIPT = `try{var n=Date.now(),c=document.documentElement.classList;if(n>=${HALLOWEEN.start.getTime()}&&n<${HALLOWEEN.end.getTime()})c.add("halloween");else c.remove("halloween")}catch(e){}`;
