/**
 * Single source of truth for the public APK release.
 *
 * HOW TO PUBLISH A RELEASE
 * 1. Upload the signed APK to its permanent HTTPS location.
 * 2. Download it from that URL on a real Android device and confirm it installs.
 * 3. Fill in every field below with the real values from that build and set
 *    `status: "available"` and `urlVerified: true`.
 * 4. Run `npm test` and `npm run build` — a misconfigured release fails the
 *    build instead of shipping a broken download button.
 *
 * Never put placeholder or guessed values here. While `status` is
 * "unavailable" the site shows "APK not yet available" and the download
 * action stays disabled.
 */

export type ReleaseStatus = "unavailable" | "available";

export interface ApkReleaseConfig {
  status: ReleaseStatus;
  /**
   * Where the APK is downloaded from: either a path to a file in `public/`
   * served by this site (e.g. "/cordova-riskq-v1.0.0.apk"), or a real,
   * permanent HTTPS URL.
   */
  downloadUrl: string | null;
  /** Set to true only after the URL above was downloaded and installed on a device. */
  urlVerified: boolean;
  /** versionName of the build, e.g. "1.0.0". */
  version: string | null;
  /** Publication date as an ISO calendar date (YYYY-MM-DD). */
  releaseDate: string | null;
  /** Exact size of the APK file in bytes. Optional. */
  fileSizeBytes: number | null;
  /** Short, user-facing release notes. */
  releaseNotes: readonly string[];
  /** SHA-256 checksum of the APK, as 64 hex characters. Optional. */
  sha256: string | null;
  /** Oldest Android version the APK installs on (from its minSdkVersion), e.g. "7.0". */
  minAndroid: string | null;
}

// EAS build e3873d57-79f0-42cf-b32e-603305edc9ef (preview profile,
// com.cordovariskq.app, versionName 1.0.0, versionCode 1), byte-identical to
// the EAS artifact. The file is served by this site from public/; the
// filename carries the release date so a new build never reuses a URL a
// browser or CDN may have cached. lib/release.test.ts checks the file matches
// fileSizeBytes and sha256, and `npm run verify-apk` re-checks it.
export const APK_RELEASE: ApkReleaseConfig = {
  status: "available",
  downloadUrl: "/cordova-riskq-v1.0.0-2026-10-14.apk",
  urlVerified: true,
  version: "1.0.0",
  releaseDate: "2026-10-14",
  fileSizeBytes: 116_202_140,
  // From the build's commit: "Critical alert card no longer renders a stray white box".
  releaseNotes: ["Fixed the Critical announcement alert card showing a stray white box."],
  sha256: "33cb01820c87d71a78d84b02c9219e8dd66f4fb444325e3677d4f49b488f8ddd",
  // minSdkVersion 24, read from the APK's manifest.
  minAndroid: "7.0",
};

export type ResolvedRelease =
  | { available: false }
  | {
      available: true;
      downloadUrl: string;
      version: string;
      releaseDate: string;
      releaseDateLabel: string;
      fileSizeLabel: string | null;
      releaseNotes: readonly string[];
      sha256: string | null;
      minAndroid: string | null;
    };

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const SHA256 = /^[0-9a-f]{64}$/i;

function fail(message: string): never {
  throw new Error(`[APK_RELEASE] ${message}`);
}

export function formatFileSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return `${Number(mb.toFixed(1))} MB`;
}

function formatReleaseDate(isoDate: string): string {
  if (!ISO_DATE.test(isoDate)) fail(`releaseDate must be YYYY-MM-DD, got "${isoDate}".`);
  const date = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== isoDate) {
    fail(`releaseDate "${isoDate}" is not a real calendar date.`);
  }
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** True for a path served by this site from `public/`, e.g. "/cordova-riskq-v1.0.0.apk". */
export function isLocalApkPath(downloadUrl: string | null): boolean {
  return !!downloadUrl && downloadUrl.startsWith("/") && !downloadUrl.startsWith("//");
}

function resolveDownloadUrl(downloadUrl: string | null): string {
  if (downloadUrl && isLocalApkPath(downloadUrl)) {
    if (!/^\/[\w.-]+\.apk$/.test(downloadUrl)) {
      fail(`downloadUrl "${downloadUrl}" must be a file directly in public/ ending in .apk.`);
    }
    return downloadUrl;
  }

  let url: URL;
  try {
    url = new URL(downloadUrl ?? "");
  } catch {
    fail(`downloadUrl "${downloadUrl}" is not a valid URL or site path.`);
  }
  if (url.protocol !== "https:") fail("downloadUrl must use HTTPS.");
  return url.toString();
}

/**
 * Turns the raw config into what the UI renders. An "available" release with
 * missing or invalid details throws, so it can never reach production.
 */
export function resolveRelease(config: ApkReleaseConfig): ResolvedRelease {
  if (config.status !== "available") return { available: false };

  if (!config.urlVerified) {
    fail('status is "available" but urlVerified is false. Verify the APK URL on a device first.');
  }

  const downloadUrl = resolveDownloadUrl(config.downloadUrl);

  const version = config.version?.trim();
  if (!version) fail("version is required for an available release.");

  if (!config.releaseDate) fail("releaseDate is required for an available release.");
  const releaseDateLabel = formatReleaseDate(config.releaseDate);

  if (config.fileSizeBytes !== null && !(config.fileSizeBytes > 0)) {
    fail("fileSizeBytes must be a positive number or null.");
  }

  if (config.sha256 !== null && !SHA256.test(config.sha256)) {
    fail("sha256 must be 64 hexadecimal characters or null.");
  }

  return {
    available: true,
    downloadUrl,
    version,
    releaseDate: config.releaseDate,
    releaseDateLabel,
    fileSizeLabel: config.fileSizeBytes === null ? null : formatFileSize(config.fileSizeBytes),
    releaseNotes: config.releaseNotes,
    sha256: config.sha256?.toLowerCase() ?? null,
    minAndroid: config.minAndroid,
  };
}

/** The release as the site renders it. Evaluated at build time. */
export const release = resolveRelease(APK_RELEASE);
