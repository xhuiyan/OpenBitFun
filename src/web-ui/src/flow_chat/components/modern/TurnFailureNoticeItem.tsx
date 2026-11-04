import React, { useCallback, useId, useMemo, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { OverflowText, Tooltip, Icon } from '@starmate/ui';
import { useI18n } from '@/infrastructure/i18n';
import {
  getAiErrorPresentation,
  normalizeAiErrorDetail,
  type AiErrorDetail,
} from '@/shared/ai-errors/aiErrorPresenter';
import './TurnFailureNoticeItem.scss';

interface TurnFailureNoticeItemProps {
  error: string;
  errorDetail?: AiErrorDetail;
}

export const TurnFailureNoticeItem: React.FC<TurnFailureNoticeItemProps> = ({ error, errorDetail }) => {
  const { t } = useI18n(['flow-chat', 'errors']);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const detail = useMemo(
    () => normalizeAiErrorDetail(errorDetail ?? { rawMessage: error }, error),
    [error, errorDetail],
  );
  const presentation = useMemo(() => getAiErrorPresentation(detail), [detail]);
  const rawError = detail.rawMessage ?? error;
  const detailsId = useId();
  const facts = [
    { label: t('turnFailure.provider'), value: detail.provider },
    { label: t('turnFailure.errorCode'), value: detail.providerCode },
    { label: t('turnFailure.httpStatus'), value: detail.httpStatus?.toString() },
    { label: t('turnFailure.requestId'), value: detail.requestId },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value));

  const copyRawError = useCallback(async () => {
    if (!rawError) return;
    try {
      await navigator.clipboard.writeText(rawError);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access is best-effort and does not affect the visible diagnostic.
    }
  }, [rawError]);

  return (
    <section data-openbitfun-component="turn-failure-notice" data-openbitfun-part="root" data-openbitfun-state={[isOpen && 'open', copied && 'copied'].filter(Boolean).join(' ')}
      className={`turn-failure-notice turn-failure-notice--${presentation.severity}`}
      aria-label={t(presentation.titleKey)}
     data-starmate-component="turn-failure-notice" data-starmate-part="root" data-starmate-state={[isOpen && 'open', copied && 'copied'].filter(Boolean).join(' ')} >
      <div data-openbitfun-component="turn-failure-notice" data-openbitfun-part="icon" className="turn-failure-notice__icon" aria-hidden="true" data-starmate-component="turn-failure-notice" data-starmate-part="icon" >
        <Icon glyph={AlertCircle} size="md" />
      </div>
      <div data-openbitfun-component="turn-failure-notice" data-openbitfun-part="content" className="turn-failure-notice__content" data-starmate-component="turn-failure-notice" data-starmate-part="content" >
        <div data-openbitfun-component="turn-failure-notice" data-openbitfun-part="header" className="turn-failure-notice__header" data-starmate-component="turn-failure-notice" data-starmate-part="header" >
          <div data-openbitfun-component="turn-failure-notice" data-openbitfun-part="summary" className="turn-failure-notice__summary" data-starmate-component="turn-failure-notice" data-starmate-part="summary" >
            <div data-openbitfun-component="turn-failure-notice" data-openbitfun-part="title" className="turn-failure-notice__title" data-starmate-component="turn-failure-notice" data-starmate-part="title" >{t(presentation.titleKey)}</div>
            <div data-openbitfun-component="turn-failure-notice" data-openbitfun-part="message" className="turn-failure-notice__message" data-starmate-component="turn-failure-notice" data-starmate-part="message" ><OverflowText>{t(presentation.messageKey)}</OverflowText></div>
          </div>

          {(facts.length > 0 || rawError) && (
            <Tooltip
              content={t(isOpen ? 'turnFailure.hideDetails' : 'turnFailure.showDetails')}
              placement="top"
            >
              <button
                type="button"
                data-openbitfun-component="turn-failure-notice"
                data-openbitfun-part="toggle"
                className="turn-failure-notice__details-toggle"
                aria-expanded={isOpen}
                aria-controls={detailsId}
                aria-label={t(isOpen ? 'turnFailure.hideDetails' : 'turnFailure.showDetails')}
                onClick={() => setIsOpen(current => !current)}
               data-starmate-component="turn-failure-notice" data-starmate-part="toggle" >
                {isOpen ? <Icon name="chevron-down" size="sm" /> : <Icon name="chevron-right" size="sm" />}
              </button>
            </Tooltip>
          )}
        </div>

        {isOpen && (
          <div id={detailsId} data-openbitfun-component="turn-failure-notice" data-openbitfun-part="details" className="turn-failure-notice__details" data-starmate-component="turn-failure-notice" data-starmate-part="details" >
            {facts.length > 0 && (
              <dl data-openbitfun-component="turn-failure-notice" data-openbitfun-part="facts" className="turn-failure-notice__facts" data-starmate-component="turn-failure-notice" data-starmate-part="facts" >
                {facts.map(fact => (
                  <div key={fact.label} data-openbitfun-component="turn-failure-notice" data-openbitfun-part="fact" className="turn-failure-notice__fact" data-starmate-component="turn-failure-notice" data-starmate-part="fact" >
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {rawError && (
              <div data-openbitfun-component="turn-failure-notice" data-openbitfun-part="rawError" className="turn-failure-notice__raw-error" data-starmate-component="turn-failure-notice" data-starmate-part="rawError" >
                <div data-openbitfun-component="turn-failure-notice" data-openbitfun-part="rawHeader" className="turn-failure-notice__raw-error-header" data-starmate-component="turn-failure-notice" data-starmate-part="rawHeader" >
                  <span>{t('turnFailure.providerError')}</span>
                  <Tooltip content={copied ? t('turnFailure.copied') : t('turnFailure.copy')} placement="top">
                    <button
                      type="button"
                      data-openbitfun-component="turn-failure-notice"
                      data-openbitfun-part="copy"
                      className="turn-failure-notice__copy"
                      onClick={() => void copyRawError()}
                      aria-label={t('turnFailure.copy')}
                     data-starmate-component="turn-failure-notice" data-starmate-part="copy" >
                      {copied ? <Icon name="check-line" size="sm" /> : <Icon name="duplicate" size="sm" />}
                    </button>
                  </Tooltip>
                </div>
                <pre data-openbitfun-component="turn-failure-notice" data-openbitfun-part="code" data-starmate-component="turn-failure-notice" data-starmate-part="code" >{rawError}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
