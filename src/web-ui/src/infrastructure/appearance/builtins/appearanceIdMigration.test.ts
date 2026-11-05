import { describe, expect, it } from 'vitest';
import { getBuiltinAppearance } from './catalog';
import { normalizeAppearanceId } from './appearanceIdMigration';

describe('appearance id migration', () => {
  it.each([
    ['openbitfun-light', 'starmate-light'],
    ['openbitfun-dark', 'starmate-dark'],
    ['openbitfun-tokyo-night', 'starmate-tokyo-night'],
    ['openbitfun-china-style', 'starmate-china-style'],
  ])('maps persisted %s to %s', (legacy, current) => {
    expect(normalizeAppearanceId(legacy)).toBe(current);
  });

  it('leaves custom package ids unchanged', () => {
    expect(normalizeAppearanceId('my-openbitfun-theme')).toBe('my-openbitfun-theme');
    expect(normalizeAppearanceId('starmate-light')).toBe('starmate-light');
  });

  it('resolves builtin packages through legacy ids', () => {
    expect(getBuiltinAppearance('openbitfun-light')?.id).toBe('starmate-light');
  });
});
