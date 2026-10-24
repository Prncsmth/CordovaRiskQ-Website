// Converts the owner-provided Halloween images into small .webp files.
// Usage: node scripts/build-halloween-assets.mjs <folder with 1.png, 2.png, 4.png>
import { join } from "node:path";
import sharp from "sharp";

const src = process.argv[2];
if (!src) {
  console.error("Usage: node scripts/build-halloween-assets.mjs <source folder>");
  process.exit(1);
}

const map = { "1.png": "cobweb.webp", "2.png": "ghost.webp", "4.png": "forest.webp" };
for (const [from, to] of Object.entries(map)) {
  const out = join("public", "halloween", to);
  const info = await sharp(join(src, from)).webp({ quality: 82 }).toFile(out);
  console.log(`${out}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
}
