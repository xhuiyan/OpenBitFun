/** Renderer ids persisted inside imported Appearance packages before the rebrand. */
export const LEGACY_CANVAS_RENDERER_ID = 'openbitfun-canvas';
export const CANVAS_RENDERER_ID = 'starmate-canvas';

export function normalizeRendererId(id: string): string {
  return id === LEGACY_CANVAS_RENDERER_ID ? CANVAS_RENDERER_ID : id;
}

/** Move the legacy canvas renderer settings onto the rebranded id. */
export function normalizeLegacyRendererIds<T extends { renderers?: Record<string, unknown> }>(
  manifest: T,
): T {
  const renderers = manifest?.renderers;
  if (!renderers || typeof renderers !== 'object' || !(LEGACY_CANVAS_RENDERER_ID in renderers)) {
    return manifest;
  }
  const next: Record<string, unknown> = { ...renderers };
  if (!(CANVAS_RENDERER_ID in next)) next[CANVAS_RENDERER_ID] = next[LEGACY_CANVAS_RENDERER_ID];
  delete next[LEGACY_CANVAS_RENDERER_ID];
  return { ...manifest, renderers: next } as T;
}
