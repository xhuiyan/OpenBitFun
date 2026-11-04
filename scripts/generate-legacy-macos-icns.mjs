import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { canonicalizeIcns } from './icns-container.mjs';
import { COMPOSER_ICON, ICNS_OUTPUTS, MACOS_ICON_DIR, ROOT, macosSourceDigest, sha256 } from './macos-icon-assets.mjs';

// Raster fallback for the committed legacy ICNS, used when Icon Composer 1.2 is
// not installed (for example on a release machine that only ships the app icon).
// It renders the same Icon Composer foreground layer as Apple's `ictool` export —
// the rounded tile silhouette on transparency, without the document fill — onto
// the authored legacy canvas, then lets Apple's iconutil encode the container.
// Keeping the fill out is what keeps rounded Dock corners on macOS versions that
// show the legacy ICNS directly; the modern catalog gets the fill and the system
// enclosure mask instead. `generate:macos-icons` remains the authoritative
// renderer whenever Icon Composer is available and rewrites this manifest without
// the legacyExportRenderer marker.
if (process.platform !== 'darwin') {
  throw new Error('Exporting the legacy macOS ICNS requires macOS and Apple iconutil.');
}

const canvas = JSON.parse(await readFile(join(MACOS_ICON_DIR, 'legacy-canvas.json'), 'utf8'));
const mark = await readFile(join(COMPOSER_ICON, 'Assets/Mark.png'));
const previousManifestPath = join(MACOS_ICON_DIR, 'generated.json');
const previousManifest = JSON.parse(await readFile(previousManifestPath, 'utf8'));
const { canvasSize, artworkBounds } = canvas;

function bodyFor(pixels) {
  const left = Math.round(pixels * artworkBounds.x / canvasSize);
  const top = Math.round(pixels * artworkBounds.y / canvasSize);
  const width = pixels - left - Math.round(pixels * (canvasSize - artworkBounds.x - artworkBounds.width) / canvasSize);
  const height = pixels - top - Math.round(pixels * (canvasSize - artworkBounds.y - artworkBounds.height) / canvasSize);
  return { left, top, width, height };
}

const temp = await mkdtemp(join(tmpdir(), 'starmate-legacy-icns-'));
try {
  const iconset = join(temp, 'starmate.iconset');
  await mkdir(iconset);
  for (const points of [16, 32, 128, 256, 512]) {
    for (const scale of [1, 2]) {
      const pixels = points * scale;
      const { left, top, width, height } = bodyFor(pixels);
      const artwork = await sharp(mark)
        .resize(width, height, { fit: 'fill', kernel: 'lanczos3' })
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toBuffer();
      await sharp({
        create: { width: pixels, height: pixels, channels: 4, background: '#00000000' },
      })
        .composite([{ input: artwork, left, top }])
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toFile(join(iconset, `icon_${points}x${points}${scale === 2 ? '@2x' : ''}.png`));
    }
  }

  const output = join(temp, 'starmate.icns');
  execFileSync('/usr/bin/iconutil', ['--convert', 'icns', '--output', output, iconset], {
    cwd: ROOT,
    stdio: 'ignore',
  });
  const icns = canonicalizeIcns(await readFile(output));
  for (const relative of ICNS_OUTPUTS) await writeFile(join(ROOT, relative), icns);
  await writeFile(previousManifestPath, `${JSON.stringify({
    iconComposerVersion: previousManifest.iconComposerVersion,
    iconComposerBuild: previousManifest.iconComposerBuild,
    legacyExportRenderer: 'sharp+iconutil',
    sourceSha256: macosSourceDigest(),
    icnsSha256: sha256(icns),
  }, null, 2)}\n`);
  console.log('Exported legacy macOS ICNS from the Icon Composer foreground artwork.');
} finally {
  await rm(temp, { recursive: true, force: true });
}
