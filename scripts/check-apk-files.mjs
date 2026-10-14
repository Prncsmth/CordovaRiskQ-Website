/**
 * Runs before every build (npm "prebuild"). Fails the build if an APK in
 * public/ is not a real APK — most often a Git LFS pointer file left behind
 * when the host cloned the repo without Git LFS. Shipping that would give
 * users "There was a problem parsing the package" on install.
 *
 * Plain JavaScript on purpose, so it runs on any Node version a host uses.
 */
import { openSync, readSync, closeSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "public");
const apks = readdirSync(dir).filter((name) => name.toLowerCase().endsWith(".apk"));
let failed = false;

for (const name of apks) {
  const file = join(dir, name);
  const { size } = statSync(file);
  const head = Buffer.alloc(64);
  const fd = openSync(file, "r");
  readSync(fd, head, 0, head.length, 0);
  closeSync(fd);

  if (head.toString("utf8").startsWith("version https://git-lfs")) {
    console.error(
      `✗ public/${name} is a Git LFS pointer, not the APK. Enable Git LFS on the host (Vercel: Project Settings › Git › Git LFS) and redeploy.`,
    );
    failed = true;
  } else if (head[0] !== 0x50 || head[1] !== 0x4b) {
    // APKs are ZIP archives, which always start with "PK".
    console.error(`✗ public/${name} is not a valid APK (ZIP) file.`);
    failed = true;
  } else {
    console.log(`✓ public/${name} looks like a real APK (${(size / 1024 / 1024).toFixed(1)} MB).`);
  }
}

if (failed) process.exit(1);
