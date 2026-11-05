import type { AppearanceSurfaceDescriptor } from '@/infrastructure/appearance';

export const userMessageEditComposerAppearanceDescriptor: AppearanceSurfaceDescriptor = {
  id: 'user-message-edit-composer',
  componentAttribute: 'data-starmate-product-component',
  parts: [{ id: 'root' }, { id: 'input' }, { id: 'actions' }, { id: 'action' }],
  facets: [
    { id: 'mode', attribute: 'data-starmate-mode', values: ['rich', 'plain'] },
    { id: 'action', attribute: 'data-starmate-action', values: ['cancel', 'submit'] },
  ],
  states: [
    { id: 'submitting', selector: { kind: 'ancestorPart', part: 'root', suffix: '[data-starmate-state~="submitting"]' } },
  ],
};
