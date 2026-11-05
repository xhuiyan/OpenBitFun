import type { AppearanceSurfaceDescriptor } from '@/infrastructure/appearance';

export const realtimeVoiceCallAppearanceDescriptor: AppearanceSurfaceDescriptor = {
  id: 'realtime-voice-call',
  componentAttribute: 'data-starmate-product-component',
  parts: [
    { id: 'root' },
  ],
  facets: [
    {
      id: 'phase',
      attribute: 'data-starmate-phase',
      values: ['connecting', 'live', 'ending', 'error'],
    },
  ],
  states: [
    { id: 'idle', selector: { kind: 'self', suffix: '[data-starmate-state~="idle"]' } },
    { id: 'connecting', selector: { kind: 'self', suffix: '[data-starmate-state~="connecting"]' } },
    { id: 'live', selector: { kind: 'self', suffix: '[data-starmate-state~="live"]' } },
    { id: 'ending', selector: { kind: 'self', suffix: '[data-starmate-state~="ending"]' } },
    { id: 'error', selector: { kind: 'self', suffix: '[data-starmate-state~="error"]' } },
    { id: 'starting', selector: { kind: 'self', suffix: '[data-starmate-state~="starting"]' } },
    { id: 'working', selector: { kind: 'self', suffix: '[data-starmate-state~="working"]' } },
    { id: 'usingTools', selector: { kind: 'self', suffix: '[data-starmate-state~="using-tools"]' } },
    { id: 'waitingApproval', selector: { kind: 'self', suffix: '[data-starmate-state~="waiting-approval"]' } },
    { id: 'needsInput', selector: { kind: 'self', suffix: '[data-starmate-state~="needs-input"]' } },
    { id: 'finishing', selector: { kind: 'self', suffix: '[data-starmate-state~="finishing"]' } },
    { id: 'stopping', selector: { kind: 'self', suffix: '[data-starmate-state~="stopping"]' } },
  ],
};
