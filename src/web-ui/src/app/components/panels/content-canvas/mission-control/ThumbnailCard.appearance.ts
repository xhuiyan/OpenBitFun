import type { AppearanceSurfaceDescriptor } from '@/infrastructure/appearance';
export const canvasThumbnailAppearanceDescriptor: AppearanceSurfaceDescriptor = {
  id: 'canvas-thumbnail',
  parts: [
    { id: 'root' }, { id: 'header' }, { id: 'icon' }, { id: 'title' },
    { id: 'actions' }, { id: 'action' }, { id: 'preview' }, { id: 'code' },
    { id: 'placeholder' }, { id: 'groupBadge' },
  ],
  facets: [{ id: 'group', attribute: 'data-starmate-group', values: ['primary', 'secondary', 'tertiary'] }],
  states: [
    { id: 'active', selector: { kind: 'self', suffix: '[data-starmate-state~="active"]' } },
    { id: 'dirty', selector: { kind: 'self', suffix: '[data-starmate-state~="dirty"]' } },
    { id: 'deleted', selector: { kind: 'self', suffix: '[data-starmate-state~="deleted"]' } },
    { id: 'pinned', selector: { kind: 'self', suffix: '[data-starmate-state~="pinned"]' } },
    { id: 'preview', selector: { kind: 'self', suffix: '[data-starmate-state~="preview"]' } },
  ],
};
