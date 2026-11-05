/** Copy persisted OpenBitFun-era Web storage keys into the StarMate namespace. */
const KEY_NAMESPACES: ReadonlyArray<readonly [current: string, legacy: string]> = [
  ['starmate:', 'openbitfun:'],
  ['starmate.', 'openbitfun.'],
  ['starmate-', 'openbitfun-'],
];

export function migrateBrandStorage(storage: Storage): void {
  for (const [current, legacy] of KEY_NAMESPACES) {
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
        // Best effort; legacy keys stay readable.
      }
    }
  }
}

export function migrateMobileBrowserStorage(): void {
  try {
    migrateBrandStorage(window.localStorage);
    migrateBrandStorage(window.sessionStorage);
  } catch {
    // Storage can be blocked; callers keep their legacy fallbacks.
  }
}
