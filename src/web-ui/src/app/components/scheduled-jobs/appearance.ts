import type { AppearanceSurfaceDescriptor } from '@/infrastructure/appearance';

export const scheduledJobsViewAppearanceDescriptor: AppearanceSurfaceDescriptor = {
  id: 'scheduled-jobs-view',
  parts: [
    { id: 'root' },
    { id: 'header' },
    { id: 'target' },
    { id: 'empty' },
    { id: 'list' },
    { id: 'job' },
    { id: 'jobBody' },
    { id: 'jobActions' },
    { id: 'jobMeta' },
    { id: 'error' },
    { id: 'editor' },
    { id: 'form' },
    { id: 'warning' },
    { id: 'field' },
    { id: 'fieldMeta' },
    { id: 'fieldControl' },
    { id: 'toggle' },
    { id: 'formActions' },
  ],
  facets: [
    { id: 'target', attribute: 'data-starmate-target', values: ['session', 'workspace'] },
    { id: 'schedule', attribute: 'data-starmate-schedule', values: ['at', 'every', 'cron'] },
  ],
  states: [
    { id: 'expanded', selector: { kind: 'self', suffix: '[data-starmate-state~="expanded"]' } },
    { id: 'loading', selector: { kind: 'self', suffix: '[data-starmate-state~="loading"]' } },
  ],
};
