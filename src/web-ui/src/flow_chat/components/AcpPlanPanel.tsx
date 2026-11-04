import { Icon } from '@starmate/ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CircleDashed } from 'lucide-react';

import type { AcpPlanEntry } from '@/infrastructure/api/service-api/ACPClientAPI';
import './AcpPlanPanel.scss';

export interface AcpPlanPanelProps {
  entries: AcpPlanEntry[];
}

function statusIcon(status: string): React.ReactNode {
  switch (status) {
    case 'completed':
      return <Icon name="check-line" size="sm" className="openbitfun-acp-plan__icon openbitfun-acp-plan__icon--done" />;
    case 'in_progress':
      return (
        <Icon name="progress-25" size="sm" className="openbitfun-acp-plan__icon openbitfun-acp-plan__icon--active" />
      );
    default:
      return (
        <Icon glyph={CircleDashed} size="sm" className="openbitfun-acp-plan__icon openbitfun-acp-plan__icon--pending" />
      );
  }
}

export const AcpPlanPanel: React.FC<AcpPlanPanelProps> = ({ entries }) => {
  const { t } = useTranslation('flow-chat');
  if (entries.length === 0) return null;

  const done = entries.filter((entry) => entry.status === 'completed').length;

  return (
    <div data-openbitfun-component="acp-plan-panel" data-openbitfun-part="root" className="openbitfun-acp-plan" data-testid="acp-plan-panel" data-starmate-component="acp-plan-panel" data-starmate-part="root" >
      <div data-openbitfun-component="acp-plan-panel" data-openbitfun-part="header" className="openbitfun-acp-plan__header" data-starmate-component="acp-plan-panel" data-starmate-part="header" >
        <span data-openbitfun-component="acp-plan-panel" data-openbitfun-part="title" className="openbitfun-acp-plan__title" data-starmate-component="acp-plan-panel" data-starmate-part="title" >{t('chatInput.acpPlan.title')}</span>
        <span data-openbitfun-component="acp-plan-panel" data-openbitfun-part="progress" className="openbitfun-acp-plan__progress" data-starmate-component="acp-plan-panel" data-starmate-part="progress" >
          {done}/{entries.length}
        </span>
      </div>
      <ul data-openbitfun-component="acp-plan-panel" data-openbitfun-part="list" className="openbitfun-acp-plan__list" data-starmate-component="acp-plan-panel" data-starmate-part="list" >
        {entries.map((entry, index) => (
          <li
            key={`${index}-${entry.content}`}
            data-openbitfun-component="acp-plan-panel"
            data-openbitfun-part="item"
            data-openbitfun-status={entry.status}
            className={`openbitfun-acp-plan__item openbitfun-acp-plan__item--${entry.status}`}
           data-starmate-component="acp-plan-panel" data-starmate-part="item" data-starmate-status={entry.status} >
            {statusIcon(entry.status)}
            <span data-openbitfun-component="acp-plan-panel" data-openbitfun-part="content" className="openbitfun-acp-plan__content" data-starmate-component="acp-plan-panel" data-starmate-part="content" >{entry.content}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

AcpPlanPanel.displayName = 'AcpPlanPanel';
