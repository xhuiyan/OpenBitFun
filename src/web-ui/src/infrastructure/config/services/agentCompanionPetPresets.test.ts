import { describe, expect, it } from 'vitest';
import {
  EXPOSED_COMPANION_PET_PRESET_IDS,
  isCompanionPetPresetExposed,
  resolveExposedCompanionPet,
} from './agentCompanionPetPresets';
import type { AgentCompanionPetSelection } from './AIExperienceConfigService';

const preset = (
  id: string,
  displayName: string,
  source: AgentCompanionPetSelection['source'] = 'preset',
): AgentCompanionPetSelection => ({
  id,
  displayName,
  source,
  packagePath: `/agent-companion-pets/${id}`,
  spritesheetPath: `/agent-companion-pets/${id}/spritesheet.webp`,
  spritesheetMimeType: 'image/webp',
});

const bitblob = preset('bitblob', 'BitBlob');

describe('release companion pet presets', () => {
  it('exposes BitBlob and 咕咕嘎嘎 only', () => {
    expect([...EXPOSED_COMPANION_PET_PRESET_IDS]).toEqual(['bitblob', 'gugugaga']);
    expect(isCompanionPetPresetExposed('bitblob')).toBe(true);
    expect(isCompanionPetPresetExposed('gugugaga')).toBe(true);
    expect(isCompanionPetPresetExposed('usagi')).toBe(false);
    expect(isCompanionPetPresetExposed('openbitfun-girl')).toBe(false);
  });

  it('resolves a withheld preset to the exposed default and keeps exposed or user pets', () => {
    expect(resolveExposedCompanionPet(preset('usagi', 'Usagi'), bitblob)).toBe(bitblob);
    expect(resolveExposedCompanionPet(preset('capy', 'Capy'), bitblob)).toBe(bitblob);
    expect(resolveExposedCompanionPet(preset('gugugaga', '咕咕嘎嘎'), bitblob))
      .toMatchObject({ id: 'gugugaga' });
    const userPet = preset('my-cat', 'My cat', 'user');
    expect(resolveExposedCompanionPet(userPet, bitblob)).toBe(userPet);
  });
});
