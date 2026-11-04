import { execFileSync } from 'node:child_process';
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { COMPOSER_ICON, readMacosFallback } from './macos-icon-assets.mjs';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, '..');
const SOURCE_DIR = path.join(ROOT_DIR, 'assets', 'brand', 'source');
const SOURCE_SVG = path.join(ROOT_DIR, 'design-system/packages/ui/src/brand/assets/starmate-mark.svg');
const SOURCE_APP_MARK = path.join(ROOT_DIR, 'design-system/packages/ui/src/brand/assets/starmate-app-mark.png');
// The application icon is authored artwork, not a composition of the in-product
// logo. The delivered master already carries the graphite tile, its rounded
// silhouette, the silver ribbon shading, and transparent outer corners. Do not
// rebuild it from a mark, and do not trace it back into a "vector" source.
const SOURCE_APP_ICON = path.join(SOURCE_DIR, 'starmate-app-icon-1024.png');
const SOURCE_MARKS = {
  dark: path.join(SOURCE_DIR, 'starmate-mark-dark.png'),
  light: path.join(SOURCE_DIR, 'starmate-mark-light.png'),
};

const BRAND_SIZE = 512;
const APP_ICON_SIZE = 1024;
// Opaque field used where the platform cannot keep the tile's transparent
// corners: the iOS App Store icon is flattened, and the macOS legacy ICNS
// export covers the transparent margin with the Icon Composer fill.
const APP_ICON_FILL = { r: 17, g: 18, b: 21 };
// The adaptive launcher foreground is the ribbon alone. Its luminance separates
// cleanly from the uniform graphite tile (tile ~18, ribbon ~140-250).
const LAUNCHER_MARK_LUMINANCE = { transparent: 60, opaque: 120 };
// Fraction of the 108 dp adaptive canvas covered by the ribbon silhouette. The
// launcher safe circle is 66 dp, so the mark stays inside the platform mask.
const ANDROID_FOREGROUND_SCALE = 0.6;

const ANDROID_DENSITIES = {
  mdpi: { icon: 48, adaptive: 108 },
  hdpi: { icon: 72, adaptive: 162 },
  xhdpi: { icon: 96, adaptive: 216 },
  xxhdpi: { icon: 144, adaptive: 324 },
  xxxhdpi: { icon: 192, adaptive: 432 },
};

const DESKTOP_HICOLOR_SIZES = [16, 32, 48, 64, 96, 128, 256, 512];
const EXPORT_SIZES = [16, 24, 32, 48, 64, 96, 128, 192, 256, 512, 1024, 2048];

const LEGACY_APPLICATION_ASSETS = [
  'src/apps/desktop/icons/Logo-ICON.png',
  'src/apps/desktop/icons/icon.png',
  'src/apps/desktop/icons/icon.ico',
  'src/apps/desktop/icons/icon.icns',
  'src/apps/desktop/icons/openbitfun-tray-template.png',
  'src/apps/desktop/icons/Square30x30Logo.png',
  'src/apps/desktop/icons/Square44x44Logo.png',
  'src/apps/desktop/icons/Square71x71Logo.png',
  'src/apps/desktop/icons/Square89x89Logo.png',
  'src/apps/desktop/icons/Square107x107Logo.png',
  'src/apps/desktop/icons/Square142x142Logo.png',
  'src/apps/desktop/icons/Square150x150Logo.png',
  'src/apps/desktop/icons/Square284x284Logo.png',
  'src/apps/desktop/icons/Square310x310Logo.png',
  'src/apps/desktop/icons/StoreLogo.png',
  'src/web-ui/public/Logo-ICON.png',
  'src/web-ui/public/Logo-ICON-128.png',
  'src/web-ui/public/OpenBitFun-Logo.png',
  'src/mobile-web/src/assets/Logo-ICON.png',
  'OpenBitFun-Installer/src/Logo-ICON.png',
  'OpenBitFun-Installer/src-tauri/icons/icon.png',
  'OpenBitFun-Installer/src-tauri/icons/icon.ico',
  'OpenBitFun-Installer/src-tauri/icons/icon.icns',
  'src/apps/mobile/harmonyos/AppScope/resources/base/media/openbitfun_icon.png',
  'src/apps/mobile/harmonyos/AppScope/resources/base/media/starmate-app-icon.png',
  'src/apps/mobile/harmonyos/AppScope/resources/base/media/background.png',
  'src/apps/mobile/harmonyos/AppScope/resources/base/media/foreground.png',
  'src/apps/mobile/harmonyos/AppScope/resources/base/media/layered_image.json',
  'src/apps/mobile/harmonyos/entry/src/main/resources/base/media/openbitfun_icon.png',
  'src/apps/mobile/harmonyos/entry/src/main/resources/base/media/starmate-app-icon.png',
  'src/apps/mobile/harmonyos/entry/src/main/resources/base/media/openbitfun-start-window.png',
  'src/apps/mobile/harmonyos/entry/src/main/resources/base/media/background.png',
  'src/apps/mobile/harmonyos/entry/src/main/resources/base/media/foreground.png',
  'src/apps/mobile/harmonyos/entry/src/main/resources/base/media/layered_image.json',
  'src/apps/mobile/harmonyos/entry/src/main/resources/base/media/startIcon.png',
  'src/apps/mobile/ios/OpenBitFun/Resources.xcassets/AppIcon.appiconset/openbitfun_icon.png',
  'src/apps/mobile/ios/OpenBitFun/Resources.xcassets/StarMateLogo.imageset',
  'src/apps/relay-server/static/assets/Logo-ICON-BOaKcXgO.png',
];

const outputPath = (...segments) => path.join(ROOT_DIR, ...segments);

async function writePng(filePath, buffer) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, buffer);
}

function createReusableWebMark(svg) {
  const reusableMark = svg.replaceAll('stroke="black"', 'stroke="currentColor"');
  if (!reusableMark.includes('stroke="currentColor"')) {
    throw new Error('StarMate mark source is missing its canonical inherited-color strokes');
  }
  return reusableMark;
}

async function renderMark(svg, size, tone, opticalSize = size) {
  // At favicon sizes, fifteen subpixel strokes disappear. Keep the same
  // silhouette with fewer filaments. The opaque outer rim must survive
  // antialiasing independently of the decorative interior strokes.
  const indices = opticalSize <= 24 ? [0, 7, 14]
    : opticalSize <= 48 ? [0, 3, 7, 11, 14]
      : opticalSize <= 96 ? [0, 2, 4, 7, 10, 12, 14] : null;
  let index = 0;
  const reusableMark = createReusableWebMark(svg);
  const artwork = indices ? reusableMark.replace(/<path\b[^>]*\/>/g, element => {
    const contour = index++;
    if (!indices.includes(contour)) return '';
    const outer = contour === 14;
    const inner = contour === 0;
    const width = Math.max(outer ? 3.2 : inner ? 1.2 : 0.7,
      (outer ? 1.35 : inner ? 0.85 : 0.65) * 256 / opticalSize);
    return element.replace(/ (?:stroke-width|opacity)="[^"]*"/g, '')
      .replace('/>', ` stroke-width="${width}" opacity="${outer ? 1 : inner ? 0.9 : 0.75}"/>`);
  }) : reusableMark;
  return sharp(Buffer.from(artwork.replaceAll('currentColor', tone)), { density: 144 })
    .resize(size, size)
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
}

async function resizePng(input, size) {
  return sharp(input)
    .resize({ width: size, height: size, fit: 'contain', kernel: 'lanczos3' })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
}

async function readApplicationIcon() {
  const icon = await readFile(SOURCE_APP_ICON);
  const metadata = await sharp(icon).metadata();
  if (metadata.width !== APP_ICON_SIZE || metadata.height !== APP_ICON_SIZE || !metadata.hasAlpha) {
    throw new Error(
      `Application icon master must be a ${APP_ICON_SIZE}px RGBA PNG: ${SOURCE_APP_ICON}`,
    );
  }
  return icon;
}

async function createComposerForeground(applicationIcon) {
  // The Composer canvas is the icon grid square, not the delivered PNG's outer
  // margin. Trim the tile to its rounded silhouette and scale that to the full
  // canvas so macOS applies its own enclosure mask to the tile itself. Keeping
  // the margin here would shrink the Dock artwork and make the legacy ICNS
  // export inconsistent with the modern catalog.
  const { data, info } = await sharp(applicationIcon)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let minX = info.width;
  let minY = info.height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * info.channels + 3] < 128) continue;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }
  if (maxX < 0) throw new Error('Application icon master has no opaque tile silhouette.');
  const side = Math.min(info.width, info.height, Math.max(maxX - minX + 1, maxY - minY + 1));
  const left = Math.max(0, Math.min(info.width - side, Math.round(minX - (side - (maxX - minX + 1)) / 2)));
  const top = Math.max(0, Math.min(info.height - side, Math.round(minY - (side - (maxY - minY + 1)) / 2)));
  return sharp(applicationIcon)
    .extract({ left, top, width: side, height: side })
    .resize(APP_ICON_SIZE, APP_ICON_SIZE, { kernel: 'lanczos3' })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
}

async function createAdaptiveForeground(applicationIcon, size) {
  // Recover the ribbon from the authored tile. The tile field is a uniform dark
  // graphite, so luminance gives the mark's coverage without drawing or tracing
  // new geometry. Observed pixels are a blend of ribbon and graphite, so the
  // ribbon colour is un-premultiplied back out before it is placed over the
  // launcher field; that keeps a dark tile edge from bleeding into the artwork.
  const { data, info } = await sharp(applicationIcon)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const channels = info.channels;
  const field = [APP_ICON_FILL.r, APP_ICON_FILL.g, APP_ICON_FILL.b];
  const mark = Buffer.alloc(data.length);
  const { transparent, opaque } = LAUNCHER_MARK_LUMINANCE;
  let minX = info.width;
  let minY = info.height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const index = (y * info.width + x) * channels;
      const luminance = 0.2126 * data[index] + 0.7152 * data[index + 1] + 0.0722 * data[index + 2];
      const coverage = Math.max(0, Math.min(1, (luminance - transparent) / (opaque - transparent)));
      const alpha = Math.round(coverage * data[index + 3]);
      mark[index + 3] = alpha;
      if (coverage > 0) {
        for (let channel = 0; channel < 3; channel++) {
          mark[index + channel] = Math.max(0, Math.min(255,
            Math.round(field[channel] + (data[index + channel] - field[channel]) / coverage)));
        }
      } else {
        mark[index] = field[0];
        mark[index + 1] = field[1];
        mark[index + 2] = field[2];
      }
      if (alpha >= 8) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (maxX < 0) throw new Error('Application icon has no visible ribbon to project onto launchers.');
  // Crop a square around the ribbon so the resized artwork needs no padding.
  const ribbonWidth = maxX - minX + 1;
  const ribbonHeight = maxY - minY + 1;
  const side = Math.min(info.width, info.height, Math.max(ribbonWidth, ribbonHeight));
  const cropLeft = Math.max(0, Math.min(info.width - side, Math.round(minX - (side - ribbonWidth) / 2)));
  const cropTop = Math.max(0, Math.min(info.height - side, Math.round(minY - (side - ribbonHeight) / 2)));
  const artwork = await sharp(mark, {
    raw: { width: info.width, height: info.height, channels },
  })
    .extract({ left: cropLeft, top: cropTop, width: side, height: side })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
  const artworkSize = Math.round(size * ANDROID_FOREGROUND_SCALE);
  const resized = await resizePng(artwork, artworkSize);

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    },
  })
    .composite([{
      input: resized,
      left: Math.floor((size - artworkSize) / 2),
      top: Math.floor((size - artworkSize) / 2),
    }])
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
}

async function createIosStoreIcon(applicationIcon) {
  // App Store icons must be opaque; iOS applies its own corner mask, so the
  // tile's transparent margin is flattened onto the same graphite field the
  // Icon Composer document uses for macOS.
  return sharp(applicationIcon)
    .flatten({ background: APP_ICON_FILL })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
}

async function generateWindowsIcon(applicationIcon, renderIcon) {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'starmate-tauri-icons-'));
  const inputPath = path.join(tempDir, 'starmate-app-icon.png');
  const tauriCliPath = path.join(ROOT_DIR, 'node_modules', '@tauri-apps', 'cli', 'tauri.js');
  try {
    await writeFile(inputPath, applicationIcon);
    execFileSync(
      process.execPath,
      [tauriCliPath, 'icon', inputPath, '--output', tempDir],
      { cwd: ROOT_DIR, stdio: 'ignore', windowsHide: true },
    );

    // Keep Tauri's directory metadata, but rasterize each Windows size from
    // the canonical application artwork so the container matches the exports.
    const icoTemplate = await readFile(path.join(tempDir, 'icon.ico'));
    const frameCount = icoTemplate.readUInt16LE(4);
    const icoDirectory = Buffer.from(icoTemplate.subarray(0, 6 + frameCount * 16));
    const icoFrames = [];
    let icoOffset = icoDirectory.length;
    for (let index = 0; index < frameCount; index++) {
      const entry = 6 + index * 16;
      const size = icoDirectory[entry] || 256;
      const png = await renderIcon(size);
      icoDirectory.writeUInt32LE(png.length, entry + 8);
      icoDirectory.writeUInt32LE(icoOffset, entry + 12);
      icoFrames.push(png);
      icoOffset += png.length;
    }

    return Buffer.concat([icoDirectory, ...icoFrames]);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

async function removeLegacyApplicationAssets() {
  await Promise.all(
    LEGACY_APPLICATION_ASSETS.map(relativePath =>
      rm(outputPath(...relativePath.split('/')), { recursive: true, force: true })),
  );
}

async function generateBrandAssets() {
  // The delivered application icon is final artwork. The macOS Icon Composer
  // document consumes the tile silhouette (trimmed to the icon grid) on the
  // graphite fill declared in icon.json; every other projection resizes the
  // master and keeps its authored outer margin.
  const applicationIcon = await readApplicationIcon();
  await writePng(path.join(COMPOSER_ICON, 'Assets/Mark.png'), await createComposerForeground(applicationIcon));
  if (process.argv.includes('--macos-source-only')) return;
  const macosFallback = readMacosFallback();
  const svg = await readFile(SOURCE_SVG, 'utf8');
  const [darkMark, lightMark] = await Promise.all([
    renderMark(svg, BRAND_SIZE, '#202020'),
    renderMark(svg, BRAND_SIZE, '#e8e8e8'),
  ]);
  await writePng(SOURCE_MARKS.dark, darkMark);
  await writePng(SOURCE_MARKS.light, lightMark);
  const darkMarkSmall = await renderMark(svg, 128, '#202020');
  const lightMarkSmall = await renderMark(svg, 128, '#e8e8e8');
  const iconCache = new Map([
    [APP_ICON_SIZE, Promise.resolve(applicationIcon)],
  ]);
  const renderIcon = size => {
    if (!iconCache.has(size)) {
      iconCache.set(size, resizePng(applicationIcon, size));
    }
    return iconCache.get(size);
  };
  const windowsIcon = await generateWindowsIcon(applicationIcon, renderIcon);
  // Browser tabs, apple-touch previews, installer UI, and the verification email
  // embed are unsized raster targets, so they ship the 512 px export instead of
  // the 1024 px bundle icon; the master stays only where the platform needs it.
  const webIcon = await renderIcon(BRAND_SIZE);

  const exportDir = outputPath('assets', 'brand', 'exports');
  await mkdir(exportDir, { recursive: true });
  await copyFile(SOURCE_SVG, path.join(exportDir, 'starmate-mark.svg'));
  const legacySourceDir = outputPath('assets', 'brand', 'source');
  await mkdir(legacySourceDir, { recursive: true });
  await copyFile(SOURCE_SVG, path.join(legacySourceDir, 'starmate-mark.svg'));
  await copyFile(SOURCE_APP_MARK, path.join(legacySourceDir, 'starmate-app-mark.png'));
  const componentAssetDir = outputPath('design-system', 'packages', 'ui', 'src', 'brand', 'assets');
  await mkdir(componentAssetDir, { recursive: true });
  for (const size of [16, 32, 128, 256, 512]) {
    await writePng(path.join(componentAssetDir, `starmate-app-icon-${size}.png`), await renderIcon(size));
  }
  for (const size of EXPORT_SIZES) {
    const dark = await renderMark(svg, size, '#202020');
    const light = await renderMark(svg, size, '#e8e8e8');
    await writePng(path.join(exportDir, `starmate-mark-dark-${size}.png`), dark);
    await writePng(path.join(exportDir, `starmate-mark-light-${size}.png`), light);
    await writePng(
      path.join(exportDir, `starmate-app-icon-${size}.png`),
      await renderIcon(size),
    );
  }
  await writeFile(path.join(exportDir, 'starmate-app-icon.ico'), windowsIcon);
  await writeFile(path.join(exportDir, 'starmate-app-icon.icns'), macosFallback);

  const marketAssetDir = outputPath('src', 'miniapp-market-web', 'public', 'assets');
  await writePng(path.join(marketAssetDir, 'starmate-email-mark.png'), darkMarkSmall);
  await writePng(path.join(marketAssetDir, 'starmate-email-app-icon.png'), webIcon);
  await writePng(path.join(marketAssetDir, 'starmate-favicon-16.png'), await renderIcon(16));
  await writePng(path.join(marketAssetDir, 'starmate-favicon-32.png'), await renderIcon(32));

  await writePng(outputPath('src', 'crates', 'services', 'miniapp-market-service', 'src', 'email', 'app-icon.png'), webIcon);

  const webBrandDir = outputPath('src', 'web-ui', 'public', 'brand');
  await writePng(path.join(webBrandDir, 'starmate-mark-dark.png'), darkMark);
  await writePng(path.join(webBrandDir, 'starmate-mark-light.png'), lightMark);
  await writePng(path.join(webBrandDir, 'starmate-mark-dark-128.png'), darkMarkSmall);
  await writePng(path.join(webBrandDir, 'starmate-mark-light-128.png'), lightMarkSmall);
  await writePng(path.join(webBrandDir, 'starmate-app-icon.png'), webIcon);
  await writeFile(path.join(webBrandDir, 'starmate-mark.svg'), createReusableWebMark(svg), 'utf8');

  const desktopIconDir = outputPath('src', 'apps', 'desktop', 'icons');
  await writePng(path.join(desktopIconDir, 'starmate-app-icon.png'), applicationIcon);
  await writePng(path.join(desktopIconDir, 'starmate-app-icon.ico'), windowsIcon);
  await writePng(path.join(desktopIconDir, 'starmate-app-icon.icns'), macosFallback);
  for (const size of DESKTOP_HICOLOR_SIZES) {
    const icon = await renderIcon(size);
    await writePng(
      outputPath('src', 'apps', 'desktop', 'icons', 'hicolor', `${size}x${size}`, 'apps', 'starmate-desktop.png'),
      icon,
    );
  }

  const dataToolsIconDir = outputPath('src', 'apps', 'data-tools', 'icons');
  await writePng(path.join(dataToolsIconDir, 'starmate-app-icon.png'), applicationIcon);
  await writePng(path.join(dataToolsIconDir, 'starmate-app-icon.ico'), windowsIcon);
  await writePng(path.join(dataToolsIconDir, 'starmate-app-icon.icns'), macosFallback);

  const mobileWebAssetDir = outputPath('src', 'mobile-web', 'src', 'assets');
  await writePng(path.join(mobileWebAssetDir, 'starmate-mark-dark.png'), darkMark);
  await writePng(path.join(mobileWebAssetDir, 'starmate-mark-light.png'), lightMark);
  await writePng(
    outputPath('src', 'mobile-web', 'public', 'brand', 'starmate-app-icon.png'),
    webIcon,
  );
  await writePng(
    outputPath('src', 'apps', 'relay-server', 'static', 'brand', 'starmate-app-icon.png'),
    webIcon,
  );

  const installerBrandDir = outputPath('OpenBitFun-Installer', 'src', 'assets');
  await writePng(path.join(installerBrandDir, 'starmate-mark-dark.png'), darkMark);
  await writePng(path.join(installerBrandDir, 'starmate-mark-light.png'), lightMark);
  await writePng(path.join(installerBrandDir, 'starmate-app-icon.png'), webIcon);
  const installerIconDir = outputPath('OpenBitFun-Installer', 'src-tauri', 'icons');
  await writePng(path.join(installerIconDir, 'starmate-app-icon.png'), applicationIcon);
  await writePng(path.join(installerIconDir, 'starmate-app-icon.ico'), windowsIcon);
  await writePng(path.join(installerIconDir, 'starmate-app-icon.icns'), macosFallback);

  for (const directory of [webBrandDir, installerBrandDir,
    outputPath('src', 'mobile-web', 'public', 'brand'),
    outputPath('src', 'apps', 'relay-server', 'static', 'brand')]) {
    for (const size of [16, 32]) {
      await writePng(path.join(directory, `starmate-app-icon-${size}.png`), await renderIcon(size));
    }
  }

  for (const [density, sizes] of Object.entries(ANDROID_DENSITIES)) {
    const legacyIcon = await renderIcon(sizes.icon);
    const adaptiveForeground = await createAdaptiveForeground(applicationIcon, sizes.adaptive);
    const androidDir = outputPath('src', 'apps', 'mobile', 'android', 'app', 'src', 'main', 'res', `mipmap-${density}`);
    await writePng(path.join(androidDir, 'ic_launcher.png'), legacyIcon);
    await writePng(path.join(androidDir, 'ic_launcher_round.png'), legacyIcon);
    await writePng(path.join(androidDir, 'ic_launcher_foreground.png'), adaptiveForeground);
    await writePng(path.join(androidDir, 'ic_launcher_monochrome.png'), adaptiveForeground);
  }

  await writePng(
    outputPath('src', 'apps', 'mobile', 'ios', 'OpenBitFun', 'Resources.xcassets', 'AppIcon.appiconset', 'starmate-app-icon.png'),
    await createIosStoreIcon(applicationIcon),
  );
  await writePng(
    outputPath('src', 'apps', 'mobile', 'ios', 'OpenBitFun', 'Resources.xcassets', 'StarMateMark.imageset', 'starmate-mark-light.png'),
    lightMark,
  );

  await writePng(
    outputPath('src', 'apps', 'mobile', 'harmonyos', 'AppScope', 'resources', 'base', 'media', 'starmate_app_icon.png'),
    applicationIcon,
  );
  await writePng(
    outputPath('src', 'apps', 'mobile', 'harmonyos', 'entry', 'src', 'main', 'resources', 'base', 'media', 'starmate_app_icon.png'),
    applicationIcon,
  );
  await writePng(
    outputPath('src', 'apps', 'mobile', 'harmonyos', 'entry', 'src', 'main', 'resources', 'base', 'media', 'starmate_start_window.png'),
    await resizePng(lightMark, 144),
  );

  await removeLegacyApplicationAssets();

  console.log('Generated StarMate application brand assets.');
}

await generateBrandAssets();
