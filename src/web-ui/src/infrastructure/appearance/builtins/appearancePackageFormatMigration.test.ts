import { describe, expect, it } from 'vitest';
import {
  isSupportedAppearanceSchema,
  normalizeLegacyAppearanceSchema,
} from './appearancePackageFormatMigration';
import { APPEARANCE_SCHEMA, LEGACY_APPEARANCE_SCHEMA } from '../types';

describe('appearance package format migration', () => {
  it('normalizes the legacy schema to the rebranded one', () => {
    expect(normalizeLegacyAppearanceSchema({ schema: LEGACY_APPEARANCE_SCHEMA, id: 'pkg' }))
      .toEqual({ schema: APPEARANCE_SCHEMA, id: 'pkg' });
  });

  it('keeps the canonical schema untouched', () => {
    const manifest = { schema: APPEARANCE_SCHEMA, id: 'pkg' };
    expect(normalizeLegacyAppearanceSchema(manifest)).toBe(manifest);
    expect(isSupportedAppearanceSchema(APPEARANCE_SCHEMA)).toBe(true);
    expect(isSupportedAppearanceSchema(LEGACY_APPEARANCE_SCHEMA)).toBe(true);
    expect(isSupportedAppearanceSchema('other.appearance')).toBe(false);
  });
});
