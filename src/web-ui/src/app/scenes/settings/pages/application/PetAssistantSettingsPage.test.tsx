/** @vitest-environment jsdom */
import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../shared/SettingsPage', () => ({
  SettingsPage: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('./RealtimeVoiceSettingsSection', () => ({ default: () => <div data-testid="voice-call-section" /> }));
vi.mock('./PetSettingsSection', () => ({ default: () => <div data-testid="pet-section" /> }));
vi.mock('./DesktopCardsSettingsSection', () => ({ default: () => <div data-testid="desktop-cards-section" /> }));

import PetAssistantSettingsPage from './PetAssistantSettingsPage';

describe('Pet & assistant settings page', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it('withholds the desktop-card section that the minimal release hides', async () => {
    await act(async () => { root.render(<PetAssistantSettingsPage isActive />); });
    expect(container.querySelector('[data-testid="desktop-cards-section"]')).toBeNull();
    expect(container.querySelector('[data-testid="voice-call-section"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="pet-section"]')).not.toBeNull();
  });
});
