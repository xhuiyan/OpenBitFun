# StarMate application brand assets

`source/starmate-mark.svg` is the transparent vector master for the current
fine-line Logo used by startup and in-product brand surfaces. Its fifteen rounded
hexagonal contours match the About dialog's static geometry. Motion and moving
highlights are intentionally absent from static files. The SVG uses
`currentColor`, with a light default for dark backgrounds.

The generator also maintains the existing transparent PNG paths:

- `starmate-mark-dark.png` is the dark mark for light surfaces.
- `starmate-mark-light.png` is the light mark for dark surfaces.

`source/starmate-app-icon-1024.png` is the delivered raster master for the
application icon family: a graphite tile (#111215) with a silver ribbon mark and
transparent outer corners. It is delivered artwork, not a composition of the
in-product logo — do not rebuild the tile from `starmate-app-mark.png`, and do not
trace the raster back into a "vector" master. Application, window, taskbar, Dock,
browser, installer, and mobile launcher icons all resize this one file.
`source/starmate-app-mark.png` remains the transparent solid mark used by the
opt-in `StarMateSolidMark` artwork and by the macOS menu-bar template regeneration;
it is intentionally independent, so regenerating either family cannot replace the
other. The iOS App Store icon flattens the tile onto the same graphite field
because iOS applies its own corner mask.

`exports/` contains the SVG, ICO, ICNS, and PNGs at 16, 24, 32, 48, 64, 96,
128, 192, 256, 512, 1024, and 2048 px. Each PNG size includes a dark transparent
mark, a light transparent mark, and the application icon. Fine-line mark exports
are rendered directly from the SVG with size-specific optical treatments at
small sizes. Application icons are resized from the delivered application
artwork. Windows ICO frames and Linux icons use the matching size-specific
application exports. macOS owns a separate native resource pipeline described
below.

Android adaptive icons keep the launcher field and the mark separate. The field
color (`res/values/ic_launcher_background.xml`) matches the tile graphite, and
`ic_launcher_foreground.png` / `ic_launcher_monochrome.png` contain only the
ribbon: the generator recovers it from the authored tile by luminance and
un-premultiplies it from the graphite field, so no hand-drawn or traced copy of
the mark is added. Both layers are projected at 60 % of the 108 dp canvas to stay
inside the launcher safe circle.

## macOS icons

`macos/starmate.icon` is the Icon Composer document for macOS 26 and newer,
including macOS 27. Its fill is the opaque graphite tile field and its foreground
layer is the delivered tile trimmed to the icon grid and scaled to the full
Composer canvas, so the modern catalog and the legacy fallback cannot drift to
different tile geometry. It has no baked outer mask,
shadow, or Dock padding; macOS applies the enclosure and appearance treatment
through `Assets.car`. The source uses Icon Composer 1.2 features supported by
Xcode 26.2; it does not require an Xcode 27-only document. No language or
region-specific icon variants are needed.

The committed ICNS is the static dev and older-macOS fallback. When Icon Composer
is available it is rendered from that document by Apple's `ictool`, on the
separate authored `macos/legacy-canvas.json` layout, and encoded with Apple's
`iconutil`. That legacy layout has an 824 px body on a 1024 px transparent canvas.
This is our legacy artwork geometry, **not a universal Apple padding requirement**.
The export keeps the tile's rounded silhouette on transparency; it does not bake
the Composer fill, because macOS versions that draw the legacy ICNS directly
(including Tauri dev's `NSApplication.applicationIconImage`) do not apply the
modern enclosure mask — a filled body would appear as a hard square in the Dock.
It never alters the modern Composer source. Ten 1x/2x representations cover
16–1024 px. There is no runtime OS-version scaling and no modification of ICNS
chunks by the shared brand generator; canonicalization only orders the native
chunks.

When Icon Composer is not installed, `generate:legacy-macos-icns` renders the same
foreground layer (rounded tile on transparency, no fill) onto the same legacy
canvas and encodes it with `iconutil`. The manifest then records
`legacyExportRenderer`; running `generate:macos-icons` later replaces it with the
authoritative Icon Composer export. Both paths write the same three ICNS copies
and must be committed together with the manifest.

Tauri CLI is pinned to **2.11.4** in both workspace apps. The macOS config overlay
adds `.icon` alongside ICNS; base and Windows/Linux icon selections stay intact.
Tauri dev reads ICNS through `NSApplication.applicationIconImage`. Bundled builds
use `CFBundleIconName` with `Assets.car`, plus `CFBundleIconFile` for the legacy
resource. `tauri.dev.conf.json` and the generated release config inherit the
platform icon list instead of overwriting it. The minimum application OS version
is unchanged; compiling the modern catalog for 26 does not raise that minimum.

Normal installs, dev builds, and non-Apple builds use the committed ICNS and need
no Icon Composer installation. After changing the application icon master,
Composer document, or legacy layout, regenerate on macOS:

```bash
# 1. Project the new tile into the Composer foreground layer.
node scripts/generate-brand-assets.mjs --macos-source-only
# 2. Re-export the committed legacy ICNS. Use Icon Composer 1.2 when installed:
#    ICON_COMPOSER_APP can point to an alternate location for Icon Composer.app.
pnpm run generate:macos-icons
#    Otherwise use the documented raster fallback:
pnpm run generate:legacy-macos-icns
# 3. Regenerate every shared projection.
pnpm run generate-brand-assets
```

The native export manifest records the renderer (when it was Icon Composer) and
source/output hashes. Normal asset generation refuses stale native exports instead
of silently shipping a mismatched dev icon.

Packaging requires **full Xcode 26 or newer**, with `actool` and `assetutil`
selected by `DEVELOPER_DIR` or `xcode-select`. Command Line Tools alone are not
enough. Stable/beta and nightly macOS runners select **Xcode 26.2** on both Intel
and Apple Silicon. The pre-bundle check fails when modern tools are unavailable;
the build wrapper verifies the resulting catalog, both Info.plist icon keys,
and the exact fallback bytes before reporting success. No signed bundle is
modified by verification.

```bash
node --test scripts/generate-brand-assets.test.mjs scripts/macos-icon-bundle.test.mjs scripts/desktop-tauri-build.test.mjs
# Full Xcode: exercise actual Tauri + actool packaging in a disposable fixture.
STARMATE_TEST_MACOS_BUNDLE=1 node --test scripts/macos-icon-bundle.test.mjs
# Inspect an existing bundle without launching it.
node scripts/macos-icon-bundle.mjs verify /path/to/StarMate.app
```

These checks validate resources, native decoding, and package metadata. They do
not establish visual Dock equivalence on every supported OS or display. Remote
workspace, remote control, Peer Device Mode, and detached dispatch are not
exercised by these local packaging checks; their protocols and host logic are
unchanged.

References: [Apple app icon guidance](https://developer.apple.com/design/human-interface-guidelines/app-icons),
[Icon Composer](https://developer.apple.com/documentation/xcode/creating-your-app-icon-using-icon-composer),
[NSApplication.applicationIconImage](https://developer.apple.com/documentation/appkit/nsapplication/applicationiconimage),
and [Tauri 2.11.4 macOS icon bundler](https://github.com/tauri-apps/tauri/blob/tauri-cli-v2.11.4/crates/tauri-bundler/src/bundle/macos/icon.rs).

Browser entry points select explicit 16/32 px favicons. The system tray reuses
the macOS template derived from the solid mark on macOS and the configured
application icon elsewhere. The in-product fine-line Logo (splash, Welcome,
About, update surfaces) is a separate vector family and is not replaced by the
application tile.

Run `pnpm run generate-brand-assets` after changing the application icon master
or either mark master. The generator owns the shared desktop, data-tools, web,
installer, Android, iOS, and HarmonyOS projections. Native macOS exports have the
separate owner described above.

Verify generated dimensions, small-size ribbon legibility, Android adaptive
layers, favicon references, platform selection, and icon containers with
`node --test scripts/generate-brand-assets.test.mjs`. macOS export and native
bundling checks also run `scripts/macos-icon-bundle.test.mjs`.

Verification emails use the silver application tile on its graphite field,
generated at `src/miniapp-market-web/public/assets/starmate-email-app-icon.png`.
The market build publishes this stable anonymous image path for email clients; it
contains no recipient or verification data and does not require authentication.

The previous email mark URL remains available for already-sent messages.
