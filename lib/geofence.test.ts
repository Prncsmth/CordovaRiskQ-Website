import { describe, expect, it } from "vitest";
import { CORDOVA_BARANGAYS, isInsideCordova, pointInRing } from "./geofence";

describe("isInsideCordova", () => {
  it("accepts every Cordova barangay", () => {
    for (const b of CORDOVA_BARANGAYS) expect(isInsideCordova(b.latitude, b.longitude), b.name).toBe(true);
  });

  it("rejects places outside Cordova", () => {
    expect(isInsideCordova(10.2966, 123.9019), "Cebu City").toBe(false);
    expect(isInsideCordova(10.3103, 123.9494), "Lapu-Lapu City proper").toBe(false);
    expect(isInsideCordova(14.5995, 120.9842), "Manila").toBe(false);
  });
});

describe("pointInRing", () => {
  const square = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ] as const;

  it("detects inside and outside points", () => {
    expect(pointInRing(0.5, 0.5, square)).toBe(true);
    expect(pointInRing(1.5, 0.5, square)).toBe(false);
  });
});
