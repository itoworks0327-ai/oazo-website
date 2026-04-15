import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SVG = resolve(__dirname, 'og-image.svg');
const OUT = resolve(__dirname, '..', 'public', 'og-image.png');

const svgBuffer = await readFile(SVG);
const pngBuffer = await sharp(svgBuffer, { density: 300 })
  .resize(1200, 630)
  .png({ quality: 90, compressionLevel: 9 })
  .toBuffer();

await writeFile(OUT, pngBuffer);
console.log(`✓ og-image.png generated at ${OUT} (${pngBuffer.length} bytes)`);
