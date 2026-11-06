import { describe, expect, it } from 'vitest';
import { builtinAppearancePalettes } from './palettes';
import {
  EXPOSED_BUILTIN_APPEARANCE_IDS,
  EXPOSED_DARK_APPEARANCE_ID,
  EXPOSED_INK_APPEARANCE_ID,
  EXPOSED_LIGHT_APPEARANCE_ID,
  EXPOSED_SLATE_APPEARANCE_ID,
  isBuiltinAppearanceExposed,
  resolveExposedAppearanceId,
} from './exposedAppearances';

describe('release appearance profile', () => {
  it('exposes 浅色 / 暗色 together with 墨韵 / 石板灰', () => {
    expect([...EXPOSED_BUILTIN_APPEARANCE_IDS]).toEqual([
      EXPOSED_LIGHT_APPEARANCE_ID,
      EXPOSED_DARK_APPEARANCE_ID,
      EXPOSED_INK_APPEARANCE_ID,
      EXPOSED_SLATE_APPEARANCE_ID,
    ]);
    expect(builtinAppearancePalettes.find(palette => palette.id === EXPOSED_LIGHT_APPEARANCE_ID)?.type)
      .toBe('light');
    expect(builtinAppearancePalettes.find(palette => palette.id === EXPOSED_INK_APPEARANCE_ID)?.type)
      .toBe('light');
    expect(builtinAppearancePalettes.find(palette => palette.id === EXPOSED_DARK_APPEARANCE_ID)?.type)
      .toBe('dark');
    expect(builtinAppearancePalettes.find(palette => palette.id === EXPOSED_SLATE_APPEARANCE_ID)?.type)
      .toBe('dark');
    expect(builtinAppearancePalettes
      .filter(palette => isBuiltinAppearanceExposed(palette.id))
      .map(palette => palette.id)
      .sort()).toEqual([...EXPOSED_BUILTIN_APPEARANCE_IDS].sort());
  });

  it('resolves withheld built-in appearances to the generic exposed palette of the same mode', () => {
    expect(resolveExposedAppearanceId('starmate-monochrome')).toBe(EXPOSED_LIGHT_APPEARANCE_ID);
    expect(resolveExposedAppearanceId('starmate-midnight')).toBe(EXPOSED_DARK_APPEARANCE_ID);
    expect(resolveExposedAppearanceId('starmate-tokyo-night')).toBe(EXPOSED_DARK_APPEARANCE_ID);
    expect(resolveExposedAppearanceId('starmate-cyber')).toBe(EXPOSED_DARK_APPEARANCE_ID);
  });

  it('keeps exposed, imported and unknown ids unchanged', () => {
    for (const id of EXPOSED_BUILTIN_APPEARANCE_IDS) {
      expect(resolveExposedAppearanceId(id)).toBe(id);
    }
    expect(resolveExposedAppearanceId('market.my-skin')).toBe('market.my-skin');
    expect(resolveExposedAppearanceId('system')).toBe('system');
  });
});
