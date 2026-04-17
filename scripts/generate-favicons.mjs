import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, '../public');
const svgPath = resolve(publicDir, 'favicon.svg');

const svg = readFileSync(svgPath);

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
];

for (const { name, size } of sizes) {
  await sharp(svg, { density: 300 })
    .resize(size, size)
    .png()
    .toFile(resolve(publicDir, name));
  console.log(`Generated ${name} (${size}x${size})`);
}

// Generate .ico from 32x32 PNG (simple ICO: just a PNG wrapped in ICO header)
const png32 = readFileSync(resolve(publicDir, 'favicon-32x32.png'));
const png16 = readFileSync(resolve(publicDir, 'favicon-16x16.png'));

function createIco(images) {
  const count = images.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dirSize = dirEntrySize * count;
  let offset = headerSize + dirSize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);      // reserved
  header.writeUInt16LE(1, 2);      // ICO type
  header.writeUInt16LE(count, 4);  // image count

  const entries = [];
  const dataBuffers = [];

  for (const { buf, size } of images) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(size < 256 ? size : 0, 0);   // width
    entry.writeUInt8(size < 256 ? size : 0, 1);   // height
    entry.writeUInt8(0, 2);                         // color palette
    entry.writeUInt8(0, 3);                         // reserved
    entry.writeUInt16LE(1, 4);                      // color planes
    entry.writeUInt16LE(32, 6);                     // bits per pixel
    entry.writeUInt32LE(buf.length, 8);             // data size
    entry.writeUInt32LE(offset, 12);                // data offset
    entries.push(entry);
    dataBuffers.push(buf);
    offset += buf.length;
  }

  return Buffer.concat([header, ...entries, ...dataBuffers]);
}

const ico = createIco([
  { buf: png16, size: 16 },
  { buf: png32, size: 32 },
]);
writeFileSync(resolve(publicDir, 'favicon.ico'), ico);
console.log('Generated favicon.ico (16+32)');

// Generate site.webmanifest
const manifest = {
  name: 'oazo合同会社',
  short_name: 'oazo',
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
  ],
  theme_color: '#4a9e5c',
  background_color: '#fdf6ee',
  display: 'standalone',
};
writeFileSync(resolve(publicDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2));
console.log('Generated site.webmanifest');

console.log('\nAll favicons generated successfully!');
