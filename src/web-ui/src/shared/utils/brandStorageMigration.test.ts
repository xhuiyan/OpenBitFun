import { describe, expect, it } from 'vitest';
import { migrateBrandStorage } from './brandStorageMigration';

function memoryStorage(initial: Record<string, string>): Storage {
  const values = new Map(Object.entries(initial));
  return {
    get length() { return values.size; },
    clear: () => values.clear(),
    getItem: (key: string) => values.get(key) ?? null,
    key: (index: number) => [...values.keys()][index] ?? null,
    removeItem: (key: string) => { values.delete(key); },
    setItem: (key: string, value: string) => { values.set(key, value); },
  } as Storage;
}

describe('migrateBrandStorage', () => {
  it('copies every legacy namespace to the StarMate namespace', () => {
    const storage = memoryStorage({
      'openbitfun:leftPanelWidth': '360',
      'openbitfun.model-selection.pool.v1:x': 'a',
      'openbitfun-app-state': '{}',
      'starmate:leftPanelWidth': '400',
    });
    migrateBrandStorage(storage);
    expect(storage.getItem('starmate:leftPanelWidth')).toBe('400');
    expect(storage.getItem('starmate:leftPanelWidth')).toBe('400');
    expect(storage.getItem('starmate.model-selection.pool.v1:x')).toBe('a');
    expect(storage.getItem('starmate-app-state')).toBe('{}');
    expect(storage.getItem('openbitfun:leftPanelWidth')).toBe('360');
  });

  it('is idempotent and ignores unrelated keys', () => {
    const storage = memoryStorage({ 'other:key': '1' });
    migrateBrandStorage(storage);
    migrateBrandStorage(storage);
    expect(storage.getItem('other:key')).toBe('1');
    expect(storage.length).toBe(1);
  });
});
