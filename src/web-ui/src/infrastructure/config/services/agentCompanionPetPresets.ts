import type { AgentCompanionPetSelection } from './AIExperienceConfigService';

/**
 * Release profile: built-in companion pet presets exposed in the product.
 *
 * The other presets keep shipping (their assets, sprite layouts and host
 * loading paths stay intact); they are only withheld from the pet picker. A
 * persisted selection naming a withheld preset renders the exposed default but
 * keeps its stored value, so restoring a preset restores the user's choice.
 *
 * Restoring a preset means adding its id back here (and flipping the matching
 * release-profile test); no asset, locale or config migration is required.
 */
export const EXPOSED_COMPANION_PET_PRESET_IDS: readonly string[] = Object.freeze([
  'bitblob',
  'gugugaga',
]);

const exposedPresetIds = new Set(EXPOSED_COMPANION_PET_PRESET_IDS);

/** Whether a built-in pet preset is offered by the product UI. */
export function isCompanionPetPresetExposed(presetId: string): boolean {
  return exposedPresetIds.has(presetId);
}

/**
 * Resolve a persisted selection to a renderable pet. Withheld presets fall back
 * to the exposed default; user-imported packages keep their identity.
 */
export function resolveExposedCompanionPet(
  pet: AgentCompanionPetSelection,
  fallback: AgentCompanionPetSelection,
): AgentCompanionPetSelection {
  return pet.source === 'preset' && !isCompanionPetPresetExposed(pet.id) ? fallback : pet;
}
