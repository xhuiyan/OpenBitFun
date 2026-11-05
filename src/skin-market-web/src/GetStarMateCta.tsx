import { ArrowRight, Download as DownloadSimple } from 'lucide-react';
import type { Translate } from './i18n';
import { STARMATE_DOWNLOAD_URL } from './links';

// An appearance package only applies inside the desktop client, so the catalog
// and every listing carry the same visible route to the official download page.
export type GetStarMatePlacement = 'catalog' | 'listing';

export function GetStarMateCta({
  placement,
  t,
}: {
  placement: GetStarMatePlacement;
  t: Translate;
}) {
  return (
    <a
      className={`get-openbitfun get-openbitfun--${placement}`}
      href={STARMATE_DOWNLOAD_URL}
      target="_blank"
      rel="noreferrer"
    >
      <span className="get-openbitfun__icon">
        <DownloadSimple size={20} aria-hidden="true" />
      </span>
      <span className="get-openbitfun__copy">
        <strong>{t('getStarMateTitle')}</strong>
        <span>
          {t(placement === 'listing' ? 'getStarMateListingNote' : 'getStarMateCatalogNote')}
        </span>
        <span className="get-openbitfun__action">
          {t('getStarMateAction')}
          <ArrowRight size={17} aria-hidden="true" />
        </span>
      </span>
    </a>
  );
}
