import type { AppearancePalette } from './AppearancePalette';
import { builtinAppearancePalettes } from './palettes';

/**
 * Release profile: built-in appearances exposed by the Appearance picker and by
 * system-appearance resolution. The other built-in palettes stay registered,
 * because persisted selections, imported packages and generated contracts keep
 * reading them; only visibility and selection resolve through this allowlist.
 *
 * Kept appearances: Light / Dark (the generic defaults that also represent system
 * light/dark) plus Ink Charm / Slate.
 *
 * Restoring a withheld appearance means extending this list (and flipping the
 * matching release-profile test); no palette, locale or generated artifact has
 * to be restored.
 */
export const EXPOSED_LIGHT_APPEARANCE_ID = 'starmate-light';
export const EXPOSED_DARK_APPEARANCE_ID = 'starmate-dark';
/** Ink Charm (light) and Slate (dark) stay available next to the generic pair. */
export const EXPOSED_INK_APPEARANCE_ID = 'starmate-china-style';
export const EXPOSED_SLATE_APPEARANCE_ID = 'starmate-slate';
export const EXPOSED_BUILTIN_APPEARANCE_IDS: readonly string[] = Object.freeze([
  EXPOSED_LIGHT_APPEARANCE_ID,
  EXPOSED_DARK_APPEARANCE_ID,
  EXPOSED_INK_APPEARANCE_ID,
  EXPOSED_SLATE_APPEARANCE_ID,
]);

const exposedIds = new Set(EXPOSED_BUILTIN_APPEARANCE_IDS);

/** Whether the Appearance picker exposes this built-in appearance. */
export function isBuiltinAppearanceExposed(id: string): boolean {
  return exposedIds.has(id);
}

/**
 * Resolve a withheld built-in appearance to the exposed palette of the same
 * color mode, so a persisted or programmatic selection never leaves the product
 * on an appearance the release profile does not expose. Imported packages and
 * unknown ids keep their identity; the selection layer decides whether they
 * actually resolve.
 */
export function resolveExposedAppearanceId(id: string): string {
  if (exposedIds.has(id)) return id;
  const palette: AppearancePalette | undefined = builtinAppearancePalettes
    .find(candidate => candidate.id === id);
  if (!palette) return id;
  return palette.type === 'light' ? EXPOSED_LIGHT_APPEARANCE_ID : EXPOSED_DARK_APPEARANCE_ID;
}
