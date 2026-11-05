import type { AppearanceSurfaceDescriptor } from '@/infrastructure/appearance';

export const acpPermissionActionsAppearanceDescriptor: AppearanceSurfaceDescriptor = {
  id: 'acp-permission-actions',
  parts: [{ id: 'root' }, { id: 'action' }],
  facets: [
    { id: 'presentation', attribute: 'data-starmate-presentation', values: ['icon', 'text'] },
    { id: 'decision', attribute: 'data-starmate-decision', values: ['allow', 'reject'] },
  ],
  states: [{ id: 'disabled', selector: { kind: 'self', suffix: ':disabled' } }],
};
