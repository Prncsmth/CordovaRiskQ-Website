/**
 * Checks that the APK at APK_RELEASE.downloadUrl matches the configured file
 * size and SHA-256. A site path ("/file.apk") is read from public/; an HTTPS
 * URL is downloaded.
 *
 *   npm run verify-apk
 *   npm run verify-apk -- https://example.org/cordova-riskq-v1.0.0.apk
 *
 * This proves the link serves the exact file. Installing it on a real Android
 * device is still a manual step.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { APK_RELEASE, isLocalApkPath } from "../lib/release.ts";

function fail(message: string): never {
  console.error(`✗ ${message}`);
  process.exit(1);
}

async function digest(url: string): Promise<{ bytes: number; sha256: string }> {
  const hash = createHash("sha256");

  if (isLocalApkPath(url)) {
    const file = join(process.cwd(), "public", url.slice(1));
    console.log(`Reading ${file}`);
    if (!existsSync(file)) fail(`${file} does not exist.`);
    const data = readFileSync(file);
    return { bytes: data.length, sha256: hash.update(data).digest("hex") };
  }

  if (!url.startsWith("https://")) fail(`URL must use HTTPS: ${url}`);
  console.log(`Fetching ${url}`);
  let bytes = 0;
  try {
    const response = await fetch(url, { redirect: "follow" });
    if (!response.ok || !response.body) fail(`HTTP ${response.status} ${response.statusText}`);
    console.log(`  final URL : ${response.url}`);
    const reader = response.body.getReader();
    for (let chunk = await reader.read(); !chunk.done; chunk = await reader.read()) {
      hash.update(chunk.value);
      bytes += chunk.value.length;
    }
  } catch (error) {
    const cause = error instanceof Error && error.cause instanceof Error ? ` (${error.cause.message})` : "";
    fail(`Download failed: ${error instanceof Error ? error.message : String(error)}${cause}. Try again.`);
  }
  return { bytes, sha256: hash.digest("hex") };
}

const url = process.argv[2] ?? APK_RELEASE.downloadUrl;
if (!url) fail("No URL. Set APK_RELEASE.downloadUrl or pass the URL as an argument.");

const { bytes, sha256 } = await digest(url);
console.log(`  size      : ${bytes} bytes`);
console.log(`  sha256    : ${sha256}`);

let ok = true;
if (APK_RELEASE.fileSizeBytes !== null && bytes !== APK_RELEASE.fileSizeBytes) {
  console.error(`✗ size mismatch: expected ${APK_RELEASE.fileSizeBytes}`);
  ok = false;
}
if (APK_RELEASE.sha256 !== null && sha256 !== APK_RELEASE.sha256.toLowerCase()) {
  console.error(`✗ sha256 mismatch: expected ${APK_RELEASE.sha256}`);
  ok = false;
}
if (!ok) process.exit(1);

console.log("✓ The download link serves the configured APK.");
