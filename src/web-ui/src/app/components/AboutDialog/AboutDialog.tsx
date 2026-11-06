/**
 * About dialog component.
 * Shows product identity plus version and build metadata. Source-repository
 * facts (commit, branch, license, repository invitation) are intentionally not
 * part of this surface for distributions that do not ship an open-source tree.
 */

import {
  FieldGroup,
  FieldRow,
  StatusPill,
  Dialog,
  DialogBody,
  DialogClose,
  DialogTitle,
} from '@starmate/ui';
import React, { useEffect, useState } from 'react';
import { useI18n } from '@/infrastructure/i18n';
import {
  formatBuildDate,
  formatDisplayedVersion,
  getVersionInfo,
} from '@/shared/utils/version';
import { createLogger } from '@/shared/utils/logger';
import { systemAPI } from '@/infrastructure/api';
import { isTauriRuntime } from '@/infrastructure/update/tauriEnv';
import { StarMateBrandMotion } from '@starmate/ui/brand';
import './AboutDialog.scss';

const log = createLogger('AboutDialog');

interface AboutDialogProps {
  /** Whether visible */
  isOpen: boolean;
  /** Close callback */
  onClose: () => void;
}

export const AboutDialog: React.FC<AboutDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useI18n('common');
  const [nativeVersion, setNativeVersion] = useState<string | null>(null);

  const version = getVersionInfo();
  const nativeRuntime = isTauriRuntime();
  const displayedVersion = formatDisplayedVersion(
    version,
    nativeVersion,
    nativeRuntime,
    import.meta.env.DEV,
  );

  let releaseLabel = t('about.stableBuild');
  if (displayedVersion.endsWith('-dev')) {
    releaseLabel = t('about.developmentBuild');
  } else if (version.releaseChannel === 'beta') {
    releaseLabel = t('about.betaBuild');
  } else if (version.releaseChannel === 'nightly') {
    releaseLabel = t('about.nightlyBuild');
  }

  useEffect(() => {
    if (!isOpen || !nativeRuntime) return;
    let active = true;
    void systemAPI.getLocalAppVersion()
      .then(currentVersion => {
        if (active) setNativeVersion(currentVersion);
      })
      .catch(error => {
        log.warn('Failed to read the local version; using generated version metadata', error);
      });
    return () => {
      active = false;
    };
  }, [isOpen, nativeRuntime]);

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}
        size="xl"
        className="openbitfun-about-dialog"
        aria-label={t('about.dialogTitle')}
        data-testid="about-dialog-modal"
      >
        <DialogClose className="openbitfun-about-dialog__close" />
        <DialogBody className="openbitfun-about-dialog__modal-content" inset="none">
          <div
            className="openbitfun-about-dialog__content"
            data-openbitfun-component="about-dialog"
            data-openbitfun-part="root"
            data-starmate-component="about-dialog" data-starmate-part="root">
            <div className="openbitfun-about-dialog__body">
              <div
                className="openbitfun-about-dialog__brand"
                data-openbitfun-component="about-dialog"
                data-openbitfun-part="hero"
                aria-hidden="true"
                data-starmate-component="about-dialog" data-starmate-part="hero">
                <div className="openbitfun-about-dialog__artwork">
                  <StarMateBrandMotion className="openbitfun-about-dialog__brand-mark" active={isOpen} />
                </div>
                <p className="openbitfun-about-dialog__brand-statement">
                  {t('about.brandStatement')}
                </p>
              </div>

              <section
                className="openbitfun-about-dialog__metadata"
                data-openbitfun-component="about-dialog"
                data-openbitfun-part="content"
                aria-label={t('about.details')}
                data-starmate-component="about-dialog" data-starmate-part="content">
                <header className="openbitfun-about-dialog__brand-copy">
                  <DialogTitle
                    className="openbitfun-about-dialog__title"
                    data-openbitfun-component="about-dialog"
                    data-openbitfun-part="title"
                    data-starmate-component="about-dialog" data-starmate-part="title">
                    {version.name}
                  </DialogTitle>
                  <p className="openbitfun-about-dialog__tagline">{t('about.tagline')}</p>
                </header>

                <FieldGroup className="openbitfun-about-dialog__details" appearance="plain" dividers={false}>
                  <FieldRow padding="none">
                    <dl className="openbitfun-about-dialog__info-row" data-openbitfun-component="about-dialog" data-openbitfun-part="infoRow" data-starmate-component="about-dialog" data-starmate-part="infoRow">
                      <dt className="openbitfun-about-dialog__info-label" data-openbitfun-component="about-dialog" data-openbitfun-part="infoLabel" data-starmate-component="about-dialog" data-starmate-part="infoLabel">
                        <span>{t('about.versionLabel')}</span>
                      </dt>
                      <dd className="openbitfun-about-dialog__info-value-group">
                        <span
                          className="openbitfun-about-dialog__info-value"
                          data-openbitfun-component="about-dialog"
                          data-openbitfun-part="infoValue"
                          data-testid="about-version-value"
                          data-starmate-component="about-dialog" data-starmate-part="infoValue">
                          {displayedVersion}
                        </span>
                        <span
                          className="openbitfun-about-dialog__channel-badge"
                          data-openbitfun-component="about-dialog"
                          data-openbitfun-part="channelBadge"
                          data-starmate-component="about-dialog" data-starmate-part="channelBadge">
                          <StatusPill tone="neutral">{releaseLabel}</StatusPill>
                        </span>
                      </dd>
                    </dl>
                  </FieldRow>

                  <FieldRow padding="none">
                    <dl className="openbitfun-about-dialog__info-row" data-openbitfun-component="about-dialog" data-openbitfun-part="infoRow" data-starmate-component="about-dialog" data-starmate-part="infoRow">
                      <dt className="openbitfun-about-dialog__info-label" data-openbitfun-component="about-dialog" data-openbitfun-part="infoLabel" data-starmate-component="about-dialog" data-starmate-part="infoLabel">
                        <span>{t('about.buildDate')}</span>
                      </dt>
                      <dd className="openbitfun-about-dialog__info-value-group">
                        <span className="openbitfun-about-dialog__info-value" data-openbitfun-component="about-dialog" data-openbitfun-part="infoValue" data-starmate-component="about-dialog" data-starmate-part="infoValue">
                          {formatBuildDate(version.buildDate)}
                        </span>
                      </dd>
                    </dl>
                  </FieldRow>
                </FieldGroup>

              </section>
            </div>

            <footer
              className="openbitfun-about-dialog__footer"
              data-openbitfun-component="about-dialog"
              data-openbitfun-part="footer"
              data-starmate-component="about-dialog" data-starmate-part="footer">
              <p
                className="openbitfun-about-dialog__copyright"
                data-openbitfun-component="about-dialog"
                data-openbitfun-part="copyright"
                data-starmate-component="about-dialog" data-starmate-part="copyright">
                {t('about.copyright')}
              </p>
            </footer>
          </div>
        </DialogBody>
      </Dialog>

    </>
  );
};

export default AboutDialog;
