import {
  APPEARANCE_SCHEMA,
  LEGACY_APPEARANCE_SCHEMA,
  type AppearancePackage,
} from '../types';

/** Accept packages authored before the rebrand and re-stamp them with the canonical schema. */
export function normalizeLegacyAppearanceSchema<T extends { schema?: string }>(manifest: T): T {
  if (manifest?.schema !== LEGACY_APPEARANCE_SCHEMA) return manifest;
  return { ...manifest, schema: APPEARANCE_SCHEMA } as T;
}

export function isSupportedAppearanceSchema(schema: unknown): schema is typeof APPEARANCE_SCHEMA {
  return schema === APPEARANCE_SCHEMA || schema === LEGACY_APPEARANCE_SCHEMA;
}

export type { AppearancePackage };
