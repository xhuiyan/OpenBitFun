import React from 'react';
import { PageHeader } from '@starmate/ui';
import { formatStandaloneUiText } from './standaloneUiCopy';
import './ConfigPageHeader.scss';

export interface ConfigPageHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  extra?: React.ReactNode;
  className?: string;
}

export const ConfigPageHeader: React.FC<ConfigPageHeaderProps> = ({
  title,
  subtitle,
  icon: _icon,
  extra,
  className = '',
  ...props
}) => {
  return (
    <div className={`openbitfun-config-page-header ${className}`} data-openbitfun-component="config" data-openbitfun-part="pageHeader" data-starmate-part="pageHeader" data-starmate-component="config" {...props}   >
      <div className="openbitfun-config-page-header__inner" data-openbitfun-component="config" data-openbitfun-part="pageHeaderInner" data-starmate-component="config" data-starmate-part="pageHeaderInner" >
        <div className="openbitfun-config-page-header__left">
          <div className="openbitfun-config-page-header__info" data-openbitfun-component="config" data-openbitfun-part="pageHeaderInfo" data-starmate-component="config" data-starmate-part="pageHeaderInfo" >
            <PageHeader
              level={2}
              size="md"
              title={(
                <span
                  className="openbitfun-config-page-header__title"
                  data-openbitfun-component="config"
                  data-openbitfun-part="pageHeaderTitle"
                 data-starmate-component="config" data-starmate-part="pageHeaderTitle" >
                  {title}
                </span>
              )}
              description={subtitle ? (
                <span className="openbitfun-config-page-header__subtitle" data-openbitfun-component="config" data-openbitfun-part="pageHeaderSubtitle" data-starmate-component="config" data-starmate-part="pageHeaderSubtitle" >{formatStandaloneUiText(subtitle)}</span>
              ) : undefined}
            />
          </div>
        </div>
        {extra && (
          <div className="openbitfun-config-page-header__extra" data-openbitfun-component="config" data-openbitfun-part="pageHeaderExtra" data-starmate-component="config" data-starmate-part="pageHeaderExtra" >
            {extra}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigPageHeader;
