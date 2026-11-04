import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import sharp from 'sharp';
import { canonicalizeIcns } from './icns-container.mjs';

const GENERATED_ICNS_FILES = [
  'src/apps/desktop/icons/starmate-app-icon.icns',
  'OpenBitFun-Installer/src-tauri/icons/starmate-app-icon.icns',
];

const HARMONY_MEDIA_DIRS = [
  'src/apps/mobile/harmonyos/AppScope/resources/base/media',
  'src/apps/mobile/harmonyos/entry/src/main/resources/base/media',
];

test('design-system brand masters and packaged icons agree with native projections', () => {
  const componentAssets = 'design-system/packages/ui/src/brand/assets';
  for (const master of ['starmate-mark.svg', 'starmate-app-mark.png']) {
    assert.deepEqual(readFileSync(`${componentAssets}/${master}`), readFileSync(`assets/brand/source/${master}`));
  }
  for (const size of [16, 32, 128, 256, 512]) {
    const name = `starmate-app-icon-${size}.png`;
    assert.deepEqual(readFileSync(`${componentAssets}/${name}`), readFileSync(`assets/brand/exports/${name}`));
  }
});

function createChunk(type, payload) {
  const chunk = Buffer.alloc(8 + payload.length);
  chunk.write(type, 0, 4, 'ascii');
  chunk.writeUInt32BE(chunk.length, 4);
  payload.copy(chunk, 8);
  return chunk;
}

function createIcns(chunks) {
  const length = 8 + chunks.reduce((total, chunk) => total + chunk.length, 0);
  const header = Buffer.alloc(8);
  header.write('icns', 0, 4, 'ascii');
  header.writeUInt32BE(length, 4);
  return Buffer.concat([header, ...chunks], length);
}

test('ICNS canonicalization is independent of Tauri chunk order', () => {
  const chunks = [
    createChunk('ic10', Buffer.from('large')),
    createChunk('ic07', Buffer.from('small')),
    createChunk('s8mk', Buffer.from('mask')),
  ];
  const forward = canonicalizeIcns(createIcns(chunks));
  const reverse = canonicalizeIcns(createIcns([...chunks].reverse()));

  assert.deepEqual(forward, reverse);
  assert.deepEqual(canonicalizeIcns(forward), forward);
});

test('generated macOS icons use the canonical ICNS layout', () => {
  const [desktop, installer] = GENERATED_ICNS_FILES.map(filePath => readFileSync(filePath));

  assert.ok(desktop.equals(canonicalizeIcns(desktop)), 'desktop ICNS is not canonical');
  assert.ok(installer.equals(canonicalizeIcns(installer)), 'installer ICNS is not canonical');
  assert.ok(desktop.equals(installer), 'desktop and installer ICNS files differ');
  assert.deepEqual(desktop, readFileSync('assets/brand/exports/starmate-app-icon.icns'));
});

test('macOS ICNS PNG representations preserve a visible body and transparent Dock margins', async () => {
  const icns = readFileSync(GENERATED_ICNS_FILES[0]);
  let checked = 0;
  for (let offset = 8; offset < icns.length;) {
    const length = icns.readUInt32BE(offset + 4);
    const payload = icns.subarray(offset + 8, offset + length);
    offset += length;
    if (!payload.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'))) continue;
    const { data, info } = await sharp(payload).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const size = info.width;
    assert.equal(info.height, size);
    // Catch both full-bleed and double-padded exports without baking a drawing
    // constant into the test. The native decoder test also covers 16 px ARGB.
    const middle = Math.floor(size / 2);
    let first = -1;
    let last = -1;
    for (let x = 0; x < size; x++) {
      if (data[(middle * size + x) * 4 + 3] >= 128) {
        if (first < 0) first = x;
        last = x;
      }
      assert.equal(data[x * 4 + 3], 0, 'top edge');
      assert.equal(data[((size - 1) * size + x) * 4 + 3], 0, 'bottom edge');
    }
    assert.ok(first >= size * 0.07 && first <= size * 0.14, `visible body: ${size}, ${first}`);
    assert.ok(Math.abs(first - (size - 1 - last)) <= 1, 'centered body');
    // A filled body would make the legacy Dock icon a hard square. The legacy
    // ICNS must keep the authored rounded silhouette with transparent corners.
    let bodyLeft = size;
    let bodyTop = size;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (data[(y * size + x) * 4 + 3] < 128) continue;
        if (x < bodyLeft) bodyLeft = x;
        if (y < bodyTop) bodyTop = y;
      }
    }
    assert.ok(
      data[(bodyTop * size + bodyLeft) * 4 + 3] < 128,
      'legacy body corners must stay rounded, not filled square',
    );
    checked++;
  }
  assert.equal(checked, 8);
});

test('desktop and installer retain independent Windows/Linux icons alongside the macOS fallback', () => {
  for (const configPath of ['src/apps/desktop/tauri.conf.json', 'OpenBitFun-Installer/src-tauri/tauri.conf.json']) {
    const { bundle } = JSON.parse(readFileSync(configPath, 'utf8'));
    assert.equal(bundle.icon.find(icon => icon.endsWith('.icns')), 'icons/starmate-app-icon.icns');
    assert.equal(bundle.icon.find(icon => icon.endsWith('.png')), 'icons/starmate-app-icon.png');
    assert.equal(bundle.icon.find(icon => icon.endsWith('.ico')), 'icons/starmate-app-icon.ico');
  }
  for (const iconDir of ['src/apps/desktop/icons', 'OpenBitFun-Installer/src-tauri/icons']) {
    assert.deepEqual(readFileSync(`${iconDir}/starmate-app-icon.png`),
      readFileSync('assets/brand/exports/starmate-app-icon-1024.png'));
  }
  for (const size of [16, 32, 48, 64, 96, 128, 256, 512]) {
    assert.deepEqual(readFileSync(`src/apps/desktop/icons/hicolor/${size}x${size}/apps/starmate-desktop.png`),
      readFileSync(`assets/brand/exports/starmate-app-icon-${size}.png`));
  }
});

test('application icons preserve the delivered raster artwork independently from the startup Logo', async () => {
  const artwork = 'assets/brand/source/starmate-app-icon-1024.png';
  const applicationIcon = readFileSync(artwork);
  const startupMark = readFileSync('assets/brand/source/starmate-mark-light.png');

  assert.equal(
    createHash('sha256').update(applicationIcon).digest('hex'),
    '1a3b9211ed91c9b27914814a71916167a8b7e8edec7f871be05d533d792035a9',
  );
  assert.notDeepEqual(applicationIcon, startupMark);

  const metadata = await sharp(applicationIcon).metadata();
  assert.equal(metadata.width, 1024);
  assert.equal(metadata.height, 1024);
  assert.equal(metadata.hasAlpha, true);

  // The packaged icon is the authored pixels resized, not a re-composition of
  // the in-product mark on a generated background.
  const { data } = await sharp('assets/brand/exports/starmate-app-icon-512.png')
    .raw().toBuffer({ resolveWithObject: true });
  const expected = await sharp(applicationIcon)
    .resize({ width: 512, height: 512, fit: 'contain', kernel: 'lanczos3' })
    .raw()
    .toBuffer();
  assert.deepEqual(data, expected);
  // The Icon Composer foreground is the tile silhouette trimmed to the icon
  // grid, so the modern catalog and the legacy ICNS export show the same tile.
  const composerMark = readFileSync('assets/brand/macos/starmate.icon/Assets/Mark.png');
  assert.notDeepEqual(composerMark, applicationIcon);
  const composerMetadata = await sharp(composerMark).metadata();
  assert.equal(composerMetadata.width, 1024);
  assert.equal(composerMetadata.height, 1024);
  assert.equal(composerMetadata.hasAlpha, true);
  const composerRaw = await sharp(composerMark).ensureAlpha()
    .raw().toBuffer({ resolveWithObject: true });
  const at = (x, y) => composerRaw.data[(y * 1024 + x) * 4 + 3];
  assert.equal(at(0, 512), 255, 'the tile must fill the Composer canvas edge to edge');
  assert.equal(at(0, 0), 0, 'the tile corners must stay transparent for the enclosure mask');
});

test('iOS App Store icon is a 1024 pixel RGB image without alpha', async () => {
  const metadata = await sharp('src/apps/mobile/ios/OpenBitFun/Resources.xcassets/AppIcon.appiconset/starmate-app-icon.png').metadata();
  assert.equal(metadata.width, 1024);
  assert.equal(metadata.height, 1024);
  assert.equal(metadata.hasAlpha, false);
  assert.equal(metadata.channels, 3);
});

test('brand exports provide decodable transparent PNGs at every advertised size', async () => {
  const sizes = [16, 24, 32, 48, 64, 96, 128, 192, 256, 512, 1024, 2048];
  for (const size of sizes) {
    for (const treatment of ['mark-dark', 'mark-light', 'app-icon']) {
      const image = sharp(`assets/brand/exports/starmate-${treatment}-${size}.png`);
      const metadata = await image.metadata();
      assert.equal(metadata.width, size);
      assert.equal(metadata.height, size);
      assert.equal(metadata.hasAlpha, true);
      const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
      // Tiny rounded-square icons can have partial edge coverage in the corner.
      assert.ok(data[info.channels - 1] <= 16, 'corner must remain transparent apart from antialiasing');
    }
  }
  assert.deepEqual(
    readFileSync('assets/brand/exports/starmate-mark.svg'),
    readFileSync('assets/brand/source/starmate-mark.svg'),
  );
});

test('Web UI exposes the canonical mark as a reusable currentColor vector asset', () => {
  const source = readFileSync('assets/brand/source/starmate-mark.svg', 'utf8');
  const webAsset = readFileSync('src/web-ui/public/brand/starmate-mark.svg', 'utf8');

  assert.equal(webAsset, source.replaceAll('stroke="black"', 'stroke="currentColor"'));
  assert.equal(webAsset.match(/<path\b/g)?.length, 15);
  assert.match(webAsset, /stroke="currentColor"/);
  assert.doesNotMatch(webAsset, /#[0-9a-f]{3,8}\b/i);
});

test('Windows ICO frames contain the size-specific app PNGs', async () => {
  const ico = readFileSync('src/apps/desktop/icons/starmate-app-icon.ico');
  assert.equal(ico.readUInt16LE(0), 0);
  assert.equal(ico.readUInt16LE(2), 1);
  const sizes = [];
  for (let index = 0; index < ico.readUInt16LE(4); index++) {
    const entry = 6 + index * 16;
    const size = ico[entry] || 256;
    const length = ico.readUInt32LE(entry + 8);
    const offset = ico.readUInt32LE(entry + 12);
    assert.ok(offset + length <= ico.length);
    const frame = ico.subarray(offset, offset + length);
    assert.deepEqual(frame, readFileSync(`assets/brand/exports/starmate-app-icon-${size}.png`));
    const metadata = await sharp(frame).metadata();
    assert.equal(metadata.width, size);
    assert.equal(metadata.height, size);
    sizes.push(size);
  }
  assert.deepEqual(sizes.sort((a, b) => a - b), [16, 24, 32, 48, 64, 256]);
  assert.deepEqual(ico, readFileSync('OpenBitFun-Installer/src-tauri/icons/starmate-app-icon.ico'));
});

test('data-tools packaging uses the same application artwork as the desktop app', () => {
  for (const file of ['starmate-app-icon.png', 'starmate-app-icon.ico', 'starmate-app-icon.icns']) {
    assert.deepEqual(
      readFileSync(`src/apps/data-tools/icons/${file}`),
      readFileSync(`src/apps/desktop/icons/${file}`),
    );
  }
});

test('small icons keep the silver ribbon legible from every direction', async () => {
  for (const size of [16, 24, 32, 48, 64]) {
    const { data, info } = await sharp(`assets/brand/exports/starmate-app-icon-${size}.png`)
      .raw().toBuffer({ resolveWithObject: true });
    const peak = Array(12).fill(0);
    const brightPixels = Array(12).fill(0);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = (x + 0.5) / size - 0.5;
        const dy = (y + 0.5) / size - 0.5;
        if (Math.hypot(dx, dy) > 0.5) continue;
        const sector = Math.floor((Math.atan2(dy, dx) + Math.PI) * 12 / (2 * Math.PI)) % 12;
        const luminance = data[(y * size + x) * info.channels];
        peak[sector] = Math.max(peak[sector], luminance);
        if (luminance >= 150) brightPixels[sector] += 1;
      }
    }
    // The 3D ribbon has shaded sides, so the contract is legibility from every
    // direction, not a uniformly bright ring: each sector needs visible silver.
    const minimumPixels = size === 16 ? 2 : size === 24 ? 5 : 8;
    assert.ok(peak.every(value => value >= 180), `${size}px ribbon has a dim sector: ${peak}`);
    assert.ok(
      brightPixels.every(value => value >= minimumPixels),
      `${size}px ribbon is missing from a sector: ${brightPixels}`,
    );
  }
});

test('Android adaptive layers derive from the delivered graphite tile', async () => {
  const { data, info } = await sharp('assets/brand/source/starmate-app-icon-1024.png')
    .raw().toBuffer({ resolveWithObject: true });
  // Sample the tile field inside the rounded silhouette, away from the ribbon.
  const field = [...data.subarray((64 * info.width + 512) * info.channels, (64 * info.width + 512) * info.channels + 3)];
  assert.deepEqual(field, [17, 18, 21]);

  const colorXml = readFileSync('src/apps/mobile/android/app/src/main/res/values/ic_launcher_background.xml', 'utf8');
  assert.match(colorXml, /<color name="ic_launcher_background">#111215<\/color>/);

  for (const density of ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi']) {
    const foregroundPath = `src/apps/mobile/android/app/src/main/res/mipmap-${density}/ic_launcher_foreground.png`;
    const foreground = await sharp(foregroundPath).raw().toBuffer({ resolveWithObject: true });
    const channels = foreground.info.channels;
    const corner = foreground.data.subarray(0, channels);
    assert.equal(corner[channels - 1], 0, `${density} adaptive field must be transparent`);
    assert.deepEqual(
      readFileSync(`src/apps/mobile/android/app/src/main/res/mipmap-${density}/ic_launcher_monochrome.png`),
      readFileSync(foregroundPath),
    );
  }
});

test('desktop tray uses a macOS template and the application icon on other platforms', () => {
  const source = readFileSync('src/apps/desktop/src/tray.rs', 'utf8');
  assert.match(source, /#\[cfg\(target_os = "macos"\)\]\s*let icon = macos_tray_icon\(\)\?/);
  assert.match(source, /#\[cfg\(not\(target_os = "macos"\)\)\]\s*let icon = app\s*\.default_window_icon\(\)/);
  assert.doesNotMatch(source, /starmate-tray-template/);
  assert.match(source, /\.icon_as_template\(cfg!\(target_os = "macos"\)\)/);
  // The unread badge is gone, so the mark is built once and never swapped:
  // nothing may re-apply the icon or write a numeric tray title afterwards.
  assert.doesNotMatch(source, /set_icon_with_as_template|set_title/);
});

test('browser entry points reference generated application favicons', () => {
  for (const [htmlPath, assetDir] of [
    ['src/web-ui/index.html', 'src/web-ui/public/brand'],
    ['src/mobile-web/index.html', 'src/mobile-web/public/brand'],
    ['src/apps/relay-server/static/index.html', 'src/apps/relay-server/static/brand'],
    ['OpenBitFun-Installer/index.html', 'OpenBitFun-Installer/src/assets'],
  ]) {
    const html = readFileSync(htmlPath, 'utf8');
    for (const size of [16, 32]) {
      assert.ok(html.includes(`sizes="${size}x${size}"`));
      const name = `starmate-app-icon-${size}.png`;
      assert.ok(html.includes(name));
      assert.deepEqual(readFileSync(`${assetDir}/${name}`), readFileSync(`assets/brand/exports/${name}`));
    }
  }
});

test('HarmonyOS generated media use valid resource identifiers', () => {
  for (const directory of HARMONY_MEDIA_DIRS) {
    for (const fileName of readdirSync(directory)) {
      const resourceName = fileName.replace(/\.[^.]+$/, '');
      assert.match(
        resourceName,
        /^[a-zA-Z0-9_]+$/,
        `${directory}/${fileName} is not a valid HarmonyOS resource name`,
      );
    }
  }

  const appConfig = readFileSync('src/apps/mobile/harmonyos/AppScope/app.json5', 'utf8');
  const moduleConfig = readFileSync('src/apps/mobile/harmonyos/entry/src/main/module.json5', 'utf8');
  assert.match(appConfig, /\$media:starmate_app_icon/);
  assert.match(moduleConfig, /\$media:starmate_app_icon/);
  assert.match(moduleConfig, /\$media:starmate_start_window/);
});

test('ICNS canonicalization rejects malformed containers', () => {
  assert.throws(
    () => canonicalizeIcns(Buffer.from('not-an-icns')),
    /Invalid ICNS header/,
  );

  const truncated = createIcns([createChunk('ic07', Buffer.from('small'))]).subarray(0, -1);
  assert.throws(() => canonicalizeIcns(truncated), /Invalid ICNS length/);
});

test('browser, launcher-preview, and email slots ship the 512 px export', () => {
  const projected512 = readFileSync('assets/brand/exports/starmate-app-icon-512.png');
  for (const file of [
    'src/web-ui/public/brand/starmate-app-icon.png',
    'src/mobile-web/public/brand/starmate-app-icon.png',
    'src/apps/relay-server/static/brand/starmate-app-icon.png',
    'OpenBitFun-Installer/src/assets/starmate-app-icon.png',
    'src/miniapp-market-web/public/assets/starmate-email-app-icon.png',
    'src/crates/services/miniapp-market-service/src/email/app-icon.png',
  ]) {
    assert.deepEqual(readFileSync(file), projected512, `${file} must not ship the 1024 px bundle master`);
  }
  // The MiniApp market ships app-icon favicons instead of hand-copied artwork.
  for (const size of [16, 32]) {
    assert.deepEqual(
      readFileSync(`src/miniapp-market-web/public/assets/starmate-favicon-${size}.png`),
      readFileSync(`assets/brand/exports/starmate-app-icon-${size}.png`),
    );
  }
});

test('verification email reuses the current mark and the OpenBitFun reference palette', () => {
  const emailMark = readFileSync('src/miniapp-market-web/public/assets/starmate-email-app-icon.png');
  assert.deepEqual(emailMark, readFileSync('src/web-ui/public/brand/starmate-app-icon.png'));
  assert.deepEqual(emailMark, readFileSync('src/crates/services/miniapp-market-service/src/email/app-icon.png'));
  const html = readFileSync('src/crates/services/miniapp-market-service/src/email/sign-in.html', 'utf8');
  const tokens = JSON.parse(readFileSync('design-system/packages/theme-openbitfun/src/reference.tokens.json', 'utf8'));
  const palette = new Set([...Object.values(tokens.ref.color.neutral), ...Object.values(tokens.ref.color.cyan)]
    .map(token => token?.$value).filter(Boolean));
  for (const [color] of html.matchAll(/#[0-9a-f]{6}\b/g)) assert.ok(palette.has(color), `Email color ${color} must come from the existing neutral/cyan palette`);
  assert.match(html, /src="cid:starmate-app-icon"/);
  assert.doesNotMatch(html, /<script|<form|data:image|\?[^\s]*\{\{code\}\}/i);
});
