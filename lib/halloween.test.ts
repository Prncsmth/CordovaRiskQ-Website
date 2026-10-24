import { describe, expect, it } from "vitest";
import {
  HALLOWEEN_THEME_SCRIPT,
  getCountdown,
  isHalloweenSeason,
  readFlag,
  shouldJumpscare,
  writeFlag,
} from "./halloween";

const at = (iso: string) => new Date(iso);

describe("isHalloweenSeason", () => {
  it("is in season on Oct 1 00:00 Manila", () =>
    expect(isHalloweenSeason(at("2026-10-01T00:00:00+08:00"))).toBe(true));
  it("is out of season one ms before", () =>
    expect(isHalloweenSeason(at("2026-09-30T23:59:59.999+08:00"))).toBe(false));
  it("is out of season at Nov 1 00:00 Manila", () =>
    expect(isHalloweenSeason(at("2026-11-01T00:00:00+08:00"))).toBe(false));
  it("uses Manila time, not local: Oct 31 20:00 in UTC-8 is already Nov 1 in Manila", () =>
    expect(isHalloweenSeason(at("2026-10-31T20:00:00-08:00"))).toBe(false));
});

describe("getCountdown", () => {
  it("counts down to Oct 31 Manila", () =>
    expect(getCountdown(at("2026-10-24T20:30:15+08:00"))).toEqual({
      days: 6,
      hours: 3,
      minutes: 29,
      seconds: 45,
      arrived: false,
    }));
  it("arrives at Oct 31 00:00 Manila", () =>
    expect(getCountdown(at("2026-10-31T00:00:00+08:00"))).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      arrived: true,
    }));
});

describe("shouldJumpscare", () => {
  it("fires only when unseen, motion allowed and no overlay is open", () => {
    expect(shouldJumpscare({ seen: false, reducedMotion: false, overlayOpen: false })).toBe(true);
    expect(shouldJumpscare({ seen: true, reducedMotion: false, overlayOpen: false })).toBe(false);
    expect(shouldJumpscare({ seen: false, reducedMotion: true, overlayOpen: false })).toBe(false);
    expect(shouldJumpscare({ seen: false, reducedMotion: false, overlayOpen: true })).toBe(false);
  });
});

describe("session flags", () => {
  it("readFlag returns null when storage throws", () =>
    expect(
      readFlag(
        {
          getItem: () => {
            throw new Error("blocked");
          },
        },
        "hw:gate",
      ),
    ).toBeNull());
  it("readFlag returns null without storage", () => expect(readFlag(null, "hw:gate")).toBeNull());
  it("writeFlag swallows throws", () =>
    expect(() =>
      writeFlag(
        {
          setItem: () => {
            throw new Error("blocked");
          },
        },
        "hw:gate",
        "quiet",
      ),
    ).not.toThrow());
});

describe("HALLOWEEN_THEME_SCRIPT", () => {
  const run = (iso: string) => {
    const classes = new Set<string>(["halloween"]);
    const document = {
      documentElement: {
        classList: {
          add: (c: string) => classes.add(c),
          remove: (c: string) => classes.delete(c),
        },
      },
    };
    const RealDate = Date;
    const FakeDate = class extends RealDate {
      constructor() {
        super(iso);
      }
      static now() {
        return new RealDate(iso).getTime();
      }
    };
    new Function("document", "Date", HALLOWEEN_THEME_SCRIPT)(document, FakeDate);
    return classes.has("halloween");
  };

  it("keeps the class in season", () => expect(run("2026-10-24T12:00:00+08:00")).toBe(true));
  it("removes the class after Halloween", () => expect(run("2026-11-02T12:00:00+08:00")).toBe(false));
});

describe("jumpscare memory", () => {
  it("remembers the jumpscare for this page even when storage is blocked", async () => {
    const { hasSeenJumpscare, markJumpscareSeen } = await import("./halloween");
    const blocked = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };
    expect(hasSeenJumpscare(blocked)).toBe(false);
    markJumpscareSeen(blocked);
    expect(hasSeenJumpscare(blocked)).toBe(true);
  });
});
