import type { AppearanceSurfaceDescriptor } from '@/infrastructure/appearance';

export const marketAccountControlsAppearanceDescriptor: AppearanceSurfaceDescriptor = {
  id: 'market-account-controls',
  parts: [
    { id: 'root' },
    { id: 'identityTrigger' },
    { id: 'profile' },
    { id: 'login' },
    { id: 'waiting' },
    { id: 'error' },
    { id: 'actions' },
  ],
  states: [
    { id: 'loading', selector: { kind: 'self', suffix: '[data-starmate-state~="loading"]' } },
    { id: 'signedOut', selector: { kind: 'self', suffix: '[data-starmate-state~="signed-out"]' } },
    { id: 'signedIn', selector: { kind: 'self', suffix: '[data-starmate-state~="signed-in"]' } },
    { id: 'authorizing', selector: { kind: 'self', suffix: '[data-starmate-state~="authorizing"]' } },
  ],
};
