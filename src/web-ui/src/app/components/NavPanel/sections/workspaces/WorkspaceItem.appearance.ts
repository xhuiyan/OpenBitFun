import type { AppearanceSurfaceDescriptor } from '@/infrastructure/appearance';

export const workspaceItemAppearanceDescriptor: AppearanceSurfaceDescriptor = {
  id: 'workspace-item',
  componentAttribute: 'data-starmate-product-component',
  parts: [
    { id: 'root' }, { id: 'card' }, { id: 'collapse' }, { id: 'icon' },
    { id: 'name' }, { id: 'label' }, { id: 'badge' }, { id: 'action' },
    { id: 'menu' }, { id: 'menuTrigger' },
    { id: 'sessions' }, { id: 'remoteStatus' },
    { id: 'indexIndicator' }, { id: 'indexPanel' },
  ],
  facets: [{ id: 'variant', attribute: 'data-starmate-variant', values: ['workspace', 'assistant'] }],
  states: [
    { id: 'active', selector: { kind: 'ancestorPart', part: 'root', suffix: '[data-starmate-state~="active"]' } },
    { id: 'dragging', selector: { kind: 'ancestorPart', part: 'root', suffix: '[data-starmate-state~="dragging"]' } },
    { id: 'collapsed', selector: { kind: 'ancestorPart', part: 'root', suffix: '[data-starmate-state~="collapsed"]' } },
    { id: 'remote', selector: { kind: 'ancestorPart', part: 'root', suffix: '[data-starmate-state~="remote"]' } },
    { id: 'open', selector: { kind: 'self', suffix: '[data-starmate-state~="open"]' } },
  ],
};
