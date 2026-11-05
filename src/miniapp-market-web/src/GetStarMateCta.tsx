import { ArrowRight, Download as DownloadSimple } from 'lucide-react';
import type { MessageKey } from './i18n';
import { STARMATE_DOWNLOAD_URL } from './links';

// A .bfminiapp package is useless without the desktop client, so the catalog
// and every listing keep one explicit path to the official download page.
export type GetStarMatePlacement = 'catalog' | 'listing';

export function GetStarMateCta({
  placement,
  t,
}: {
  placement: GetStarMatePlacement;
  t: (key: MessageKey) => string;
}) {
  return (
    <a
      className={`get-openbitfun get-openbitfun-${placement}`}
      href={STARMATE_DOWNLOAD_URL}
      target="_blank"
      rel="noreferrer"
    >
      <span className="get-openbitfun-icon">
        <DownloadSimple size={18} aria-hidden="true" />
      </span>
      <span className="get-openbitfun-copy">
        <strong>{t('getStarMateTitle')}</strong>
        <span>
          {t(placement === 'listing' ? 'getStarMateListingNote' : 'getStarMateCatalogNote')}
        </span>
        <span className="get-openbitfun-action">
          {t('getStarMateAction')}
          <ArrowRight size={18} aria-hidden="true" />
        </span>
      </span>
    </a>
  );
}
