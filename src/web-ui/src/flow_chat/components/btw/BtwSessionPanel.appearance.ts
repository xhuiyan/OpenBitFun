import type { AppearanceSurfaceDescriptor } from '@/infrastructure/appearance';

export const btwSessionPanelAppearanceDescriptor: AppearanceSurfaceDescriptor = {
  id: 'btw-session-panel',
  parts: [
    { id: 'root' },
    { id: 'header' },
    { id: 'headerMain' },
    { id: 'title' },
    { id: 'meta' },
    { id: 'actions' },
    { id: 'body' },
    { id: 'empty' },
    { id: 'scrollToBottom' },
    { id: 'minimized' },
    { id: 'actionBar' },
  ],
  facets: [
    { id: 'view', attribute: 'data-starmate-view', values: ['empty', 'session'] },
  ],
  states: [
    { id: 'hasActionBar', selector: { kind: 'self', suffix: '[data-starmate-state~="hasActionBar"]' } },
    { id: 'minimized', selector: { kind: 'self', suffix: '[data-starmate-state~="minimized"]' } },
    { id: 'hidden', selector: { kind: 'self', suffix: '[data-starmate-state~="hidden"]' } },
  ],
};
