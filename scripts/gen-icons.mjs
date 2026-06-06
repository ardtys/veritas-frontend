/**
 * Generates the Veritas brand icons from public/logo-veritas.png.
 *
 * Output:
 *   public/logo-mark.png   256  white tile, used by the <LogoMark> component
 *   app/icon.png           512  modern favicon (Next file convention)
 *   app/apple-icon.png     180  iOS home-screen icon
 *   app/favicon.ico        16/32/48 multi-size .ico (PNG-compressed entries)
 *
 * Run: node scripts/gen-icons.mjs
 */
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(root, 'public', 'logo-veritas.png');
const BG = { r: 255, g: 255, b: 255, alpha: 1 }; // white tile, theme-safe

/** Scan raw pixels for the tight bounding box of the (non-white) mark. */
async function markBox() {
  const { data, info } = await sharp(SRC)
    .flatten({ background: '#ffffff' })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      // "ink" = any channel meaningfully darker than white
      if (data[i] < 245 || data[i + 1] < 245 || data[i + 2] < 245) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

const BOX = await markBox();
console.log('mark bbox:', JSON.stringify(BOX));

/** Crop to the mark, then center it on a padded white square. */
async function tile(size, padRatio = 0.14) {
  const inner = Math.round(size * (1 - padRatio * 2));
  const mark = await sharp(SRC)
    .flatten({ background: '#ffffff' })
    .extract(BOX)
    .resize(inner, inner, { fit: 'contain', background: BG })
    .toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: BG } })
    .composite([{ input: mark, gravity: 'center' }])
    .png()
    .toBuffer();
}

/** Assemble a real .ico containing PNG entries (supported by all modern browsers). */
function buildIco(pngs /* [{size, buf}] */) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(pngs.length, 4); // count

  const entries = Buffer.alloc(16 * pngs.length);
  let offset = 6 + entries.length;
  pngs.forEach((p, i) => {
    const e = i * 16;
    entries.writeUInt8(p.size >= 256 ? 0 : p.size, e + 0); // width
    entries.writeUInt8(p.size >= 256 ? 0 : p.size, e + 1); // height
    entries.writeUInt8(0, e + 2); // palette
    entries.writeUInt8(0, e + 3); // reserved
    entries.writeUInt16LE(1, e + 4); // color planes
    entries.writeUInt16LE(32, e + 6); // bits per pixel
    entries.writeUInt32LE(p.buf.length, e + 8); // size of image data
    entries.writeUInt32LE(offset, e + 12); // offset
    offset += p.buf.length;
  });

  return Buffer.concat([header, entries, ...pngs.map((p) => p.buf)]);
}

const [mark256, icon512, apple180, ico16, ico32, ico48] = await Promise.all([
  tile(256),
  tile(512),
  tile(180, 0.1),
  tile(16, 0.06),
  tile(32, 0.08),
  tile(48, 0.1),
]);

await writeFile(join(root, 'public', 'logo-mark.png'), mark256);
await writeFile(join(root, 'app', 'icon.png'), icon512);
await writeFile(join(root, 'app', 'apple-icon.png'), apple180);
await writeFile(
  join(root, 'app', 'favicon.ico'),
  buildIco([
    { size: 16, buf: ico16 },
    { size: 32, buf: ico32 },
    { size: 48, buf: ico48 },
  ]),
);

console.log('✓ Generated logo-mark.png, icon.png, apple-icon.png, favicon.ico');
