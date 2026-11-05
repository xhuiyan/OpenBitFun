import type { AppearanceSurfaceDescriptor } from '@/infrastructure/appearance';

/** Desktop-shell chrome owned by the product surface, not by @starmate/ui. */
export const windowControlsAppearanceDescriptor: AppearanceSurfaceDescriptor = {
  id: 'window-controls',
  parts: [{ id: 'root' }],
  states: [
    { id: 'disabled', selector: { kind: 'self', suffix: '[data-starmate-state~="disabled"]' } },
    { id: 'maximized', selector: { kind: 'self', suffix: '[data-starmate-state~="maximized"]' } },
  ],
};
