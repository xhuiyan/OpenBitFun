/** Persisted appearance ids from the OpenBitFun era that still exist on disk. */
const LEGACY_BUILTIN_SUFFIXES = new Set([
  'light',
  'dark',
  'monochrome',
  'slate',
  'midnight',
  'china-style',
  'china-night',
  'cyber',
  'tokyo-night',
  'ink-night',
]);

export const LEGACY_APPEARANCE_ID_PREFIX = 'openbitfun-';
export const CURRENT_APPEARANCE_ID_PREFIX = 'starmate-';

/** Map a persisted builtin appearance id to its rebranded id; custom ids pass through. */
export function normalizeAppearanceId<T extends string>(id: T | string): T | string {
  if (typeof id !== 'string' || !id.startsWith(LEGACY_APPEARANCE_ID_PREFIX)) return id;
  const suffix = id.slice(LEGACY_APPEARANCE_ID_PREFIX.length);
  return LEGACY_BUILTIN_SUFFIXES.has(suffix) ? `${CURRENT_APPEARANCE_ID_PREFIX}${suffix}` : id;
}
