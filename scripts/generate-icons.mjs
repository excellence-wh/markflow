// 用 Node 内置 zlib 生成纯色 PNG（PWA 图标）。运行：node scripts/generate-icons.mjs
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'public');

function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function makePng(size, [r, g, b, a]) {
  const rows = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    const off = y * (size * 4 + 1);
    rows[off] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const p = off + 1 + x * 4;
      rows[p] = r;
      rows[p + 1] = g;
      rows[p + 2] = b;
      rows[p + 3] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(rows)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

mkdirSync(outDir, { recursive: true });
// 品牌蓝 #2547eb
const color = [37, 71, 235, 255];
writeFileSync(join(outDir, 'pwa-192x192.png'), makePng(192, color));
writeFileSync(join(outDir, 'pwa-512x512.png'), makePng(512, color));
// apple-touch-icon (180x180)
writeFileSync(join(outDir, 'apple-touch-icon.png'), makePng(180, color));
console.log('Icons generated in', outDir);
