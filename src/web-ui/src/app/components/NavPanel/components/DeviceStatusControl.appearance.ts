import type { AppearanceSurfaceDescriptor } from '@/infrastructure/appearance';

export const deviceOverviewAppearanceDescriptor: AppearanceSurfaceDescriptor = {
  id: 'device-overview',
  componentAttribute: 'data-starmate-product-component',
  parts: [{ id: 'root', propertyProfile: 'overlay', visualRole: 'popup' }],
  facets: [
    { id: 'placement', attribute: 'data-starmate-placement', values: ['top', 'bottom'] },
  ],
  states: [
    { id: 'local', selector: { kind: 'self', suffix: '[data-starmate-state~="local"]' } },
    { id: 'connected', selector: { kind: 'self', suffix: '[data-starmate-state~="connected"]' } },
  ],
};
