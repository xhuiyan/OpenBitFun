/**
 * Migrate persisted Web storage keys from the OpenBitFun era.
 *
 * Legacy keys are copied (not removed) so a downgrade still finds its
 * settings, while the current build always reads and writes the StarMate
 * namespace.
 */
const KEY_NAMESPACES: ReadonlyArray<readonly [current: string, legacy: string]> = [
  ['starmate:', 'openbitfun:'],
  ['starmate.', 'openbitfun.'],
  ['starmate-', 'openbitfun-'],
];

export function migrateBrandStorage(storage: Storage, legacyPrefixes = KEY_NAMESPACES): void {
  for (const [current, legacy] of legacyPrefixes) {
    const legacyKeys: string[] = [];
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (key?.startsWith(legacy)) legacyKeys.push(key);
    }
    for (const legacyKey of legacyKeys) {
      const currentKey = `${current}${legacyKey.slice(legacy.length)}`;
      if (storage.getItem(currentKey) !== null) continue;
      const value = storage.getItem(legacyKey);
      if (value === null) continue;
      try {
        storage.setItem(currentKey, value);
      } catch {
        // Storage can be full or blocked; legacy keys stay readable.
      }
    }
  }
}
