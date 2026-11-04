import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const CODE_CHANGE_TOKENS = [
  '--openbitfun-color-code-change-added',
  '--openbitfun-color-code-change-removed',
] as const;

const PRIMARY_CODE_CHANGE_SURFACES = [
  '../../flow_chat/components/modern/SessionFilesBadge.scss',
  '../../flow_chat/components/modern/SessionFileModificationsBar.scss',
  '../../flow_chat/components/usage/SessionUsageReportCard.scss',
  '../../flow_chat/tool-cards/SnapshotFullscreenDiffViewer.css',
  '../../tools/editor/components/DiffEditor.scss',
  '../../tools/git/components/BranchQuickSwitch.scss',
  '../../tools/git/components/GitDiffView/GitDiffView.scss',
  '../../tools/starmate-canvas/runtime/sdk/data-display.tsx',
  '../../tools/starmate-canvas/runtime/canvasRuntimeInstaller.ts',
  '../../tools/starmate-canvas/runtime/styles/canvas-runtime.scss',
  '../../app/components/panels/review-platform/ReviewPlatformPanel.scss',
] as const;

describe('code-change color integration', () => {
  it('uses the shared addition and removal semantics across product surfaces', () => {
    for (const relativePath of PRIMARY_CODE_CHANGE_SURFACES) {
      const source = readFileSync(new URL(relativePath, import.meta.url), 'utf8');

      for (const token of CODE_CHANGE_TOKENS) {
        // TSX inline style lookups keep the canonical prefix for now; migrated
        // stylesheets use the --starmate-* compatibility alias.
        const suffix = token.replace(/^--openbitfun-/, '');
        const pattern = new RegExp(`--(?:openbitfun|starmate)-${suffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
        expect(source, `${relativePath} should consume ${token}`).toMatch(pattern);
      }
    }
  });

  it('keeps diff renderers independent from the appearance-specific Git palette', () => {
    for (const relativePath of [
      '../../flow_chat/components/InlineDiffPreview.scss',
      '../../tools/editor/components/DiffEditor.scss',
      '../../tools/git/components/GitDiffView/GitDiffView.scss',
    ]) {
      const source = readFileSync(new URL(relativePath, import.meta.url), 'utf8');

      expect(source).not.toMatch(/--(?:openbitfun|starmate)-domain-git-(?:added|deleted|staged)/);
    }
  });

  it('uses dedicated diff colors for the inline code viewer', () => {
    const source = readFileSync(new URL('../../flow_chat/components/InlineDiffPreview.scss', import.meta.url), 'utf8');
    expect(source).toContain('--starmate-color-code-diff-added-marker');
    expect(source).toContain('--starmate-color-code-diff-removed-marker');
  });
});
