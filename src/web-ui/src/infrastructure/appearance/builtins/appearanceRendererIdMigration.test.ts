import { describe, expect, it } from 'vitest';
import {
  normalizeLegacyRendererIds,
  normalizeRendererId,
} from './appearanceRendererIdMigration';

describe('appearance renderer id migration', () => {
  it('maps the legacy canvas renderer id', () => {
    expect(normalizeRendererId('openbitfun-canvas')).toBe('starmate-canvas');
    expect(normalizeRendererId('theme-tokens')).toBe('theme-tokens');
  });

  it('moves legacy canvas renderer settings onto the rebranded id', () => {
    const manifest = normalizeLegacyRendererIds({
      id: 'user-package',
      renderers: {
        'openbitfun-canvas': { version: 1, settings: { bg: '#fff' } },
        'theme-tokens': { version: 1, settings: { tokens: {} } },
      },
    });
    expect(manifest.renderers).toEqual({
      'starmate-canvas': { version: 1, settings: { bg: '#fff' } },
      'theme-tokens': { version: 1, settings: { tokens: {} } },
    });
  });

  it('keeps an explicit rebranded canvas renderer when both ids exist', () => {
    const manifest = normalizeLegacyRendererIds({
      id: 'user-package',
      renderers: {
        'openbitfun-canvas': { version: 1, settings: { bg: '#fff' } },
        'starmate-canvas': { version: 1, settings: { bg: '#000' } },
      },
    });
    expect(manifest.renderers).toEqual({
      'starmate-canvas': { version: 1, settings: { bg: '#000' } },
    });
  });
});
