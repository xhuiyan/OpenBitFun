import type { AppearanceSurfaceDescriptor } from '@/infrastructure/appearance';

export const editorToolAppearanceDescriptor: AppearanceSurfaceDescriptor = {
  id: 'editor-tool',
  parts: [
    { id: 'root' },
    { id: 'content' },
    { id: 'loading' },
    { id: 'error' },
    { id: 'saving' },
    { id: 'readOnlyCodeBlock' },
    { id: 'meditorEditArea' },
  ],
  states: [
    { id: 'loading', selector: { kind: 'self', suffix: '[data-starmate-state~="loading"]' } },
    { id: 'error', selector: { kind: 'self', suffix: '[data-starmate-state~="error"]' } },
    { id: 'largeFile', selector: { kind: 'self', suffix: '[data-starmate-state~="large-file"]' } },
    { id: 'fullscreen', selector: { kind: 'self', suffix: '[data-starmate-state~="fullscreen"]' } },
  ],
};
