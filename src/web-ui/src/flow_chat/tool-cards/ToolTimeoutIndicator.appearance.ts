import type { AppearanceSurfaceDescriptor } from '@/infrastructure/appearance';

export const toolTimeoutIndicatorAppearanceDescriptor: AppearanceSurfaceDescriptor = {
  id: 'tool-timeout-indicator',
  parts: [
    { id: 'root' }, { id: 'duration' }, { id: 'elapsed' }, { id: 'timeout' },
    { id: 'controls' }, { id: 'toggle' }, { id: 'popover' }, { id: 'option' },
  ],
  facets: [{ id: 'mode', attribute: 'data-starmate-mode', values: ['completed', 'live'] }],
  states: [
    { id: 'warning', selector: { kind: 'self', suffix: '[data-starmate-state~="warning"]' } },
    { id: 'disabled', selector: { kind: 'self', suffix: '[data-starmate-state~="disabled"]' } },
    { id: 'open', selector: { kind: 'self', suffix: '[data-starmate-state~="open"]' } },
  ],
};
