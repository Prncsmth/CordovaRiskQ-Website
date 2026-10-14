import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  APK_RELEASE,
  formatFileSize,
  isLocalApkPath,
  resolveRelease,
  type ApkReleaseConfig,
} from "./release";

const VERIFIED: ApkReleaseConfig = {
  status: "available",
  downloadUrl: "https://downloads.example.org/cordova-riskq-1.0.0.apk",
  urlVerified: true,
  version: "1.0.0",
  releaseDate: "2026-10-01",
  fileSizeBytes: 52_428_800,
  releaseNotes: ["First public release."],
  sha256: null,
  minAndroid: "7.0",
};

describe("APK_RELEASE", () => {
  it("is a valid release", () => {
    expect(() => resolveRelease(APK_RELEASE)).not.toThrow();
  });

  it.runIf(isLocalApkPath(APK_RELEASE.downloadUrl))(
    "points at an APK in public/ that matches the configured size and checksum",
    () => {
      const file = join(process.cwd(), "public", APK_RELEASE.downloadUrl!.slice(1));
      expect(existsSync(file), `${file} is missing`).toBe(true);
      const data = readFileSync(file);
      if (APK_RELEASE.fileSizeBytes !== null) expect(data.length).toBe(APK_RELEASE.fileSizeBytes);
      if (APK_RELEASE.sha256 !== null) {
        expect(createHash("sha256").update(data).digest("hex")).toBe(APK_RELEASE.sha256.toLowerCase());
      }
    },
  );
});

describe("resolveRelease", () => {
  it("is unavailable when the status is unavailable, even if a URL is filled in", () => {
    const result = resolveRelease({ ...VERIFIED, status: "unavailable" });
    expect(result.available).toBe(false);
  });

  it("enables the download for a complete, verified release", () => {
    const result = resolveRelease(VERIFIED);
    expect(result).toMatchObject({
      available: true,
      downloadUrl: VERIFIED.downloadUrl,
      version: "1.0.0",
      fileSizeLabel: "50 MB",
      releaseDateLabel: "October 1, 2026",
    });
  });

  it("accepts an APK served by this site from public/", () => {
    const result = resolveRelease({ ...VERIFIED, downloadUrl: "/cordova-riskq-v1.0.0.apk" });
    expect(result.available && result.downloadUrl).toBe("/cordova-riskq-v1.0.0.apk");
  });

  it.each(["//evil.example/app.apk", "/downloads/app.apk", "/app.zip", "/../app.apk"])(
    "rejects an unsafe or non-APK site path (%s)",
    (downloadUrl) => {
      expect(() => resolveRelease({ ...VERIFIED, downloadUrl })).toThrow();
    },
  );

  it("refuses to publish a URL nobody has verified", () => {
    expect(() => resolveRelease({ ...VERIFIED, urlVerified: false })).toThrow(
      /urlVerified/,
    );
  });

  it.each([
    ["missing URL", { downloadUrl: null }],
    ["non-HTTPS URL", { downloadUrl: "http://downloads.example.org/app.apk" }],
    ["malformed URL", { downloadUrl: "not a url" }],
    ["missing version", { version: "  " }],
    ["invalid date", { releaseDate: "2026-13-45" }],
    ["non-ISO date", { releaseDate: "Oct 1 2026" }],
    ["non-positive size", { fileSizeBytes: 0 }],
    ["malformed checksum", { sha256: "abc123" }],
  ] as const)("throws on a misconfigured release (%s)", (_label, patch) => {
    expect(() => resolveRelease({ ...VERIFIED, ...patch })).toThrow();
  });

  it("allows file size and checksum to be omitted", () => {
    const result = resolveRelease({ ...VERIFIED, fileSizeBytes: null });
    expect(result.available && result.fileSizeLabel).toBeNull();
  });

  it("normalises a valid SHA-256 checksum to lowercase", () => {
    const sha = "A".repeat(64);
    const result = resolveRelease({ ...VERIFIED, sha256: sha });
    expect(result.available && result.sha256).toBe("a".repeat(64));
  });
});

describe("formatFileSize", () => {
  it("formats bytes as megabytes with at most one decimal", () => {
    expect(formatFileSize(52_428_800)).toBe("50 MB");
    expect(formatFileSize(48_653_926)).toBe("46.4 MB");
    expect(formatFileSize(512_000)).toBe("0.5 MB");
  });
});
