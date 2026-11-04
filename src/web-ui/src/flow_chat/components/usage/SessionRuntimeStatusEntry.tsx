import React from 'react';
import { useTranslation } from 'react-i18next';
import { Activity } from 'lucide-react';
import { OverflowText, Tooltip } from '@starmate/ui';
import './SessionRuntimeStatusEntry.scss';

interface SessionRuntimeStatusEntryProps {
  onOpen?: () => void;
}

export const SessionRuntimeStatusEntry: React.FC<SessionRuntimeStatusEntryProps> = ({
  onOpen,
}) => {
  if (!onOpen) {
    return null;
  }

  return <SessionRuntimeButton onOpen={onOpen} />;
};

function SessionRuntimeButton({
  onOpen,
}: {
  onOpen: () => void;
}) {
  const { t } = useTranslation('flow-chat');
  return (
    <Tooltip content={t('usage.runtime.tooltip')}>
      <button data-openbitfun-icon-slot="true" data-overflow-trigger data-openbitfun-component="session-runtime-status-entry" data-openbitfun-part="root"
        className="session-runtime-status-entry"
        type="button"
        onClick={onOpen}
        aria-label={t('usage.runtime.open')}
       data-starmate-icon-slot="true" data-starmate-component="session-runtime-status-entry" data-starmate-part="root" >
        <Activity size="var(--openbitfun-control-icon-size-sm)" data-openbitfun-component="session-runtime-status-entry" data-openbitfun-part="icon" aria-hidden  data-starmate-component="session-runtime-status-entry" data-starmate-part="icon" />
        <OverflowText data-openbitfun-component="session-runtime-status-entry" data-openbitfun-part="label" data-starmate-component="session-runtime-status-entry" data-starmate-part="label" >{t('usage.runtime.button')}</OverflowText>
      </button>
    </Tooltip>
  );
}

SessionRuntimeStatusEntry.displayName = 'SessionRuntimeStatusEntry';
