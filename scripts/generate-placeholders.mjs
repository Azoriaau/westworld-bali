/**
 * Generates soft, on-palette placeholder images so the site renders before real photography arrives.
 * Existing files are never overwritten — delete a file and re-run `npm run placeholders` to regenerate it.
 */
import sharp from 'sharp';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../src/assets/images/', import.meta.url));

const P = { sand: '#E8DCC8', linen: '#FAF7F2', foam: '#A8C5BD', ocean: '#2F4F4F', drift: '#8B7B6B' };

const label = (w, h, text) => `
  <rect x="${w * 0.03}" y="${h - h * 0.03 - 44}" width="${text.length * 13 + 36}" height="44" rx="4" fill="#FAF7F2" fill-opacity="0.78"/>
  <text x="${w * 0.03 + 18}" y="${h - h * 0.03 - 15}" font-family="Consolas, Menlo, monospace" font-size="20" fill="#2F4F4F">${text}</text>`;

const range = (n) => Array.from({ length: n }, (_, i) => i);

const scenes = {
  beach: (w, h, s) => `
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#dfe9e6"/><stop offset="1" stop-color="${P.linen}"/></linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#sky)"/>
    <circle cx="${w * (0.25 + s * 0.5)}" cy="${h * 0.3}" r="${h * 0.07}" fill="#f6ead5"/>
    <rect y="${h * 0.52}" width="${w}" height="${h * 0.2}" fill="${P.foam}"/>
    <rect y="${h * 0.52}" width="${w}" height="${h * 0.04}" fill="#8fb3aa"/>
    <path d="M0 ${h * 0.7} Q ${w * 0.3} ${h * 0.66} ${w * 0.6} ${h * 0.71} T ${w} ${h * 0.69} V ${h} H 0 Z" fill="${P.sand}"/>
    <path d="M0 ${h * 0.72} Q ${w * 0.35} ${h * 0.69} ${w * 0.7} ${h * 0.73} T ${w} ${h * 0.71}" stroke="${P.linen}" stroke-width="6" fill="none" opacity=".8"/>`,
  sunset: (w, h, s) => `
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#c9b8a3"/><stop offset=".55" stop-color="#efd9bd"/><stop offset="1" stop-color="${P.sand}"/></linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#sky)"/>
    <circle cx="${w * (0.3 + s * 0.4)}" cy="${h * 0.55}" r="${h * 0.1}" fill="#f7e6cc"/>
    <rect y="${h * 0.58}" width="${w}" height="${h * 0.42}" fill="#7f9c95"/>
    <rect y="${h * 0.58}" width="${w}" height="${h * 0.42}" fill="${P.ocean}" opacity=".35"/>
    <path d="M${w * 0.08} ${h} C ${w * 0.1} ${h * 0.6}, ${w * 0.12} ${h * 0.4}, ${w * 0.16} ${h * 0.22}" stroke="#4d4a42" stroke-width="${w * 0.008}" fill="none"/>
    <g fill="#4d4a42" transform="translate(${w * 0.16} ${h * 0.22})">
      <path d="M0 0 q ${w * 0.08} ${-h * 0.05} ${w * 0.14} ${h * 0.03} q ${-w * 0.07} ${-h * 0.02} ${-w * 0.14} ${-h * 0.03}"/>
      <path d="M0 0 q ${-w * 0.07} ${-h * 0.06} ${-w * 0.13} ${h * 0.02} q ${w * 0.06} ${-h * 0.03} ${w * 0.13} ${-h * 0.02}"/>
      <path d="M0 0 q ${w * 0.02} ${-h * 0.1} ${w * 0.09} ${-h * 0.1} q ${-w * 0.05} ${h * 0.02} ${-w * 0.09} ${h * 0.1}"/></g>`,
  pool: (w, h, s) => `
    <rect width="${w}" height="${h}" fill="${P.linen}"/>
    <rect y="0" width="${w}" height="${h * 0.38}" fill="#e3ece9"/>
    <rect x="${w * 0.1}" y="${h * 0.16}" width="${w * 0.8}" height="${h * 0.22}" fill="#f1ebe1"/>
    <rect x="${w * (0.18 + s * 0.1)}" y="${h * 0.2}" width="${w * 0.12}" height="${h * 0.18}" fill="${P.foam}" opacity=".7"/>
    <rect x="${w * (0.5 + s * 0.1)}" y="${h * 0.2}" width="${w * 0.12}" height="${h * 0.18}" fill="${P.foam}" opacity=".7"/>
    <rect y="${h * 0.38}" width="${w}" height="${h * 0.62}" fill="${P.sand}"/>
    <rect x="${w * 0.08}" y="${h * 0.5}" width="${w * 0.84}" height="${h * 0.34}" rx="6" fill="${P.foam}"/>
    <rect x="${w * 0.08}" y="${h * 0.5}" width="${w * 0.84}" height="${h * 0.34}" rx="6" fill="#ffffff" opacity=".18"/>
    <path d="M${w * 0.12} ${h * 0.62} q ${w * 0.1} ${-h * 0.02} ${w * 0.2} 0 t ${w * 0.2} 0 t ${w * 0.2} 0" stroke="#ffffff" stroke-width="4" fill="none" opacity=".6"/>
    <path d="M${w * 0.2} ${h * 0.74} q ${w * 0.1} ${-h * 0.02} ${w * 0.2} 0 t ${w * 0.2} 0 t ${w * 0.2} 0" stroke="#ffffff" stroke-width="4" fill="none" opacity=".5"/>`,
  interior: (w, h, s) => `
    <rect width="${w}" height="${h}" fill="${P.linen}"/>
    <rect x="${w * (0.12 + s * 0.2)}" y="${h * 0.12}" width="${w * 0.4}" height="${h * 0.5}" fill="#dfe9e6"/>
    <rect x="${w * (0.12 + s * 0.2)}" y="${h * 0.12}" width="${w * 0.4}" height="${h * 0.5}" fill="none" stroke="${P.drift}" stroke-width="10"/>
    <line x1="${w * (0.32 + s * 0.2)}" y1="${h * 0.12}" x2="${w * (0.32 + s * 0.2)}" y2="${h * 0.62}" stroke="${P.drift}" stroke-width="6"/>
    <rect y="${h * 0.72}" width="${w}" height="${h * 0.28}" fill="#c9b49a"/>
    ${range(8).map((i) => `<line x1="0" y1="${h * 0.72 + i * h * 0.035}" x2="${w}" y2="${h * 0.72 + i * h * 0.035}" stroke="#b59f84" stroke-width="2"/>`).join('')}
    <rect x="${w * 0.55}" y="${h * 0.56}" width="${w * 0.36}" height="${h * 0.14}" rx="14" fill="${P.sand}"/>
    <rect x="${w * 0.55}" y="${h * 0.5}" width="${w * 0.36}" height="${h * 0.08}" rx="14" fill="#efe6d6"/>
    <circle cx="${w * 0.08}" cy="${h * 0.55}" r="${h * 0.09}" fill="${P.foam}" opacity=".65"/>
    <rect x="${w * 0.07}" y="${h * 0.6}" width="${w * 0.02}" height="${h * 0.12}" fill="${P.drift}"/>`,
  garden: (w, h, s) => `
    <rect width="${w}" height="${h}" fill="#e7eeea"/>
    <rect y="${h * 0.6}" width="${w}" height="${h * 0.4}" fill="#9bb5a4"/>
    ${range(7).map((i) => {
      const x = w * (0.05 + i * 0.15 + s * 0.03);
      const r = h * (0.12 + ((i * 7) % 5) * 0.02);
      return `<circle cx="${x}" cy="${h * 0.6}" r="${r}" fill="${i % 2 ? '#7f9f8c' : P.foam}" opacity=".9"/>`;
    }).join('')}
    <rect x="${w * 0.35}" y="${h * 0.35}" width="${w * 0.3}" height="${h * 0.3}" fill="${P.linen}"/>
    <polygon points="${w * 0.32},${h * 0.36} ${w * 0.5},${h * 0.22} ${w * 0.68},${h * 0.36}" fill="${P.drift}"/>
    <rect x="${w * 0.46}" y="${h * 0.48}" width="${w * 0.08}" height="${h * 0.17}" fill="${P.sand}"/>
    <path d="M0 ${h * 0.85} H ${w}" stroke="${P.sand}" stroke-width="${h * 0.06}"/>`,
  portrait: (w, h) => `
    <rect width="${w}" height="${h}" fill="${P.sand}"/>
    <circle cx="${w * 0.5}" cy="${h * 0.38}" r="${w * 0.16}" fill="${P.drift}" opacity=".55"/>
    <path d="M${w * 0.18} ${h} C ${w * 0.2} ${h * 0.65}, ${w * 0.8} ${h * 0.65}, ${w * 0.82} ${h} Z" fill="${P.drift}" opacity=".55"/>`,
  map: (w, h) => `
    <rect width="${w}" height="${h}" fill="#eef2ef"/>
    <path d="M${w * 0.62} 0 C ${w * 0.55} ${h * 0.3}, ${w * 0.7} ${h * 0.6}, ${w * 0.6} ${h} H ${w} V 0 Z" fill="${P.foam}"/>
    ${range(9).map((i) => `<path d="M0 ${h * (0.08 + i * 0.11)} L ${w * 0.6} ${h * (0.12 + i * 0.1)}" stroke="#ffffff" stroke-width="${i % 3 ? 5 : 12}"/>`).join('')}
    ${range(7).map((i) => `<path d="M${w * (0.06 + i * 0.09)} 0 L ${w * (0.04 + i * 0.085)} ${h}" stroke="#ffffff" stroke-width="${i % 2 ? 5 : 10}"/>`).join('')}
    <circle cx="${w * 0.42}" cy="${h * 0.46}" r="${h * 0.035}" fill="${P.ocean}"/>
    <circle cx="${w * 0.42}" cy="${h * 0.46}" r="${h * 0.012}" fill="${P.linen}"/>`,
  plan: (w, h, s) => {
    const x = w * 0.1, y = h * 0.1, W = w * 0.8, H = h * 0.75;
    const rooms = s < 0.34
      ? [[0, 0, 0.35, 0.5, 'BED 1'], [0, 0.5, 0.35, 0.5, 'BED 2'], [0.35, 0, 0.4, 0.6, 'LIVING / DINING'], [0.75, 0, 0.25, 0.35, 'KITCHEN'], [0.75, 0.35, 0.25, 0.25, 'BATH'], [0.35, 0.6, 0.65, 0.4, 'POOL DECK']]
      : s < 0.67
        ? [[0, 0, 0.3, 0.35, 'BED 1'], [0, 0.35, 0.3, 0.3, 'BED 2'], [0, 0.65, 0.3, 0.35, 'BED 3'], [0.3, 0, 0.45, 0.55, 'LIVING / DINING'], [0.75, 0, 0.25, 0.3, 'KITCHEN'], [0.75, 0.3, 0.25, 0.25, 'BATH'], [0.3, 0.55, 0.7, 0.45, 'POOL + GARDEN']]
        : [[0, 0, 0.25, 0.3, 'BED 1'], [0, 0.3, 0.25, 0.25, 'BED 2'], [0, 0.55, 0.25, 0.2, 'BATH'], [0, 0.75, 0.25, 0.25, 'BED 3'], [0.25, 0, 0.5, 0.5, 'LIVING / DINING'], [0.75, 0, 0.25, 0.3, 'KITCHEN'], [0.75, 0.3, 0.25, 0.2, 'BED 4'], [0.25, 0.5, 0.75, 0.5, 'POOL + GARDEN']];
    return `<rect width="${w}" height="${h}" fill="#ffffff"/>
      ${rooms.map(([rx, ry, rw, rh, n]) => `<rect x="${x + rx * W}" y="${y + ry * H}" width="${rw * W}" height="${rh * H}" fill="${n.startsWith('POOL') ? '#e6efec' : '#ffffff'}" stroke="${P.ocean}" stroke-width="6"/>
        <text x="${x + (rx + rw / 2) * W}" y="${y + (ry + rh / 2) * H}" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" letter-spacing="3" fill="${P.ocean}">${n}</text>`).join('')}
      <text x="${w / 2}" y="${h * 0.95}" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" letter-spacing="4" fill="${P.drift}">GROUND FLOOR — INDICATIVE ONLY</text>`;
  },
};

// [file, width, height, scene, variation 0..1]
const images = [
  ['home/hero.jpg', 2400, 1400, 'beach', 0.6],
  ['home/intro.jpg', 1400, 1750, 'interior', 0.1],
  ['home/lifestyle.jpg', 1600, 1100, 'pool', 0.4],
  ['location/seminyak-beach.jpg', 1800, 1100, 'sunset', 0.4],
  ['location/cafes.jpg', 1400, 1050, 'interior', 0.5],
  ['location/rice-fields.jpg', 1400, 1050, 'garden', 0.3],
  ['location/map-preview.jpg', 1600, 900, 'map', 0],
  ['about/frank-portrait.jpg', 1200, 1500, 'portrait', 0],
  ['about/development.jpg', 1800, 1100, 'garden', 0.7],
  ['about/materials.jpg', 1400, 1400, 'interior', 0.9],
];
const villas = { 'villa-pasir': 0.1, 'villa-laut': 0.5, 'villa-angin': 0.9 };
for (const [slug, s] of Object.entries(villas)) {
  images.push(
    [`villas/${slug}/hero.jpg`, 2000, 1333, s < 0.3 ? 'pool' : s < 0.7 ? 'beach' : 'garden', s],
    [`villas/${slug}/gallery-01.jpg`, 1600, 1067, 'interior', s],
    [`villas/${slug}/gallery-02.jpg`, 1600, 1067, 'pool', 1 - s],
    [`villas/${slug}/gallery-03.jpg`, 1200, 1500, 'interior', 1 - s],
    [`villas/${slug}/gallery-04.jpg`, 1600, 1067, 'garden', s],
    [`villas/${slug}/gallery-05.jpg`, 1600, 1067, 'sunset', s],
    [`villas/${slug}/floor-plan.png`, 1600, 1100, 'plan', s],
  );
}
const kinds = ['beach', 'interior', 'pool', 'garden', 'sunset'];
const sizes = [[1600, 1067], [1200, 1500], [1600, 1067], [1400, 1400], [1200, 1600], [1600, 1000]];
for (let i = 1; i <= 12; i++) {
  const [w, h] = sizes[i % sizes.length];
  images.push([`gallery/project-${String(i).padStart(2, '0')}.jpg`, w, h, kinds[i % kinds.length], (i * 0.37) % 1]);
}

let made = 0;
for (const [file, w, h, kind, s] of images) {
  const out = join(root, file);
  if (existsSync(out)) continue;
  mkdirSync(dirname(out), { recursive: true });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${scenes[kind](w, h, s)}${label(w, h, file)}</svg>`;
  const img = sharp(Buffer.from(svg));
  await (file.endsWith('.png') ? img.png({ compressionLevel: 9 }) : img.jpeg({ quality: 82, mozjpeg: true })).toFile(out);
  made++;
}
console.log(`Placeholders: ${made} created, ${images.length - made} already present.`);
