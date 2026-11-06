/**
 * Frontend-only surface visibility for the current release profile.
 *
 * Ids listed here are withheld from the interface: their sections stop
 * rendering and their navigation, settings and global-search entries
 * disappear. Nothing below the interface is removed, so Tauri commands, host
 * capabilities, persisted settings and scene routing keep working. Restoring a
 * surface means deleting its id from this list and flipping the record of the
 * release decision in the matching contract test (the hide has no other code);
 * generated catalogs, locale files, appearance parts and persisted user data
 * stay untouched, so nothing needs regeneration or migration.
 *
 * This describes a release decision, not user configuration, a permission or a
 * platform capability. Do not persist it, do not read it from user config, and
 * do not gate data isolation, migration or remote scenarios on it.
 */
import type { SettingsDestination, SettingsPageId, SettingsSectionId } from '@/app/scenes/settings/settingsTypes';

export type UiSurfaceId =
  /** Home page device strip. The device directory and remote control stay active. */
  | 'personal-overview.devices'
  /** Home page desktop-card list. Desktop-card windows, API and settings stay active. */
  | 'personal-overview.desktopCards';

const HIDDEN_UI_SURFACES: ReadonlySet<UiSurfaceId> = new Set<UiSurfaceId>([
  'personal-overview.devices',
  'personal-overview.desktopCards',
]);

/** Whether the current release profile exposes a UI surface. */
export function isUiSurfaceVisible(id: UiSurfaceId): boolean {
  return !HIDDEN_UI_SURFACES.has(id);
}

/**
 * Settings pages withheld from the release profile. Page components and their
 * manifests stay registered because cross-surface links and embedded owners
 * (for example the ecosystem-compatibility scene) still render them.
 */
const HIDDEN_SETTINGS_PAGES: ReadonlySet<SettingsPageId> = new Set<SettingsPageId>([
  'tools.external-import',
  'tools.external-agents',
  'tools.automation',
]);

/** Whether Settings navigation and search expose a page. */
export function isSettingsPageVisible(id: SettingsPageId): boolean {
  return !HIDDEN_SETTINGS_PAGES.has(id);
}

/**
 * Settings sections withheld from the release profile. The owning page keeps
 * its other sections; the hidden section's anchors, search rows and search
 * phrases disappear from navigation.
 */
const HIDDEN_SETTINGS_SECTIONS: ReadonlySet<`${SettingsPageId}:${SettingsSectionId}`> =
  new Set<`${SettingsPageId}:${SettingsSectionId}`>([
    'application.pet:desktop-cards',
  ]);

/** Whether a Settings page section is rendered and searchable. */
export function isSettingsSectionVisible(pageId: SettingsPageId, sectionId: SettingsSectionId): boolean {
  return !HIDDEN_SETTINGS_SECTIONS.has(`${pageId}:${sectionId}`);
}

/**
 * Whether a Settings destination stays reachable from an entry point such as
 * global search, a capability card or a deep link. Capability execution is not
 * gated here; only the visible entry point is.
 */
export function isSettingsDestinationVisible(destination: SettingsDestination): boolean {
  return isSettingsPageVisible(destination.pageId)
    && (!destination.sectionId || isSettingsSectionVisible(destination.pageId, destination.sectionId));
}
