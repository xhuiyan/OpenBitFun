import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { GetStarMateCta, type GetStarMatePlacement } from './GetStarMateCta';
import type { Translate } from './i18n';
import { STARMATE_DOWNLOAD_URL } from './links';

const t = ((key: string) => key) as Translate;

describe('GetStarMateCta', () => {
  it.each<GetStarMatePlacement>(['catalog', 'listing'])(
    'sends %s visitors to the official download page',
    (placement) => {
      const markup = renderToStaticMarkup(<GetStarMateCta placement={placement} t={t} />);

      expect(markup).toContain(`href="${STARMATE_DOWNLOAD_URL}"`);
      expect(markup).toContain('rel="noreferrer"');
      expect(markup).toContain('getStarMateTitle');
      expect(markup).toContain('getStarMateAction');
    },
  );

  it('explains the surface the visitor is actually looking at', () => {
    expect(renderToStaticMarkup(<GetStarMateCta placement="listing" t={t} />))
      .toContain('getStarMateListingNote');
    expect(renderToStaticMarkup(<GetStarMateCta placement="catalog" t={t} />))
      .toContain('getStarMateCatalogNote');
  });
});
