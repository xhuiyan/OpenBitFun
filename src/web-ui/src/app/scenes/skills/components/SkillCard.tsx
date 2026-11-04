import React from 'react';
import { Icon, IconButton, OverflowText } from '@starmate/ui';
import { useI18n } from '@/infrastructure/i18n/hooks/useI18n';
import './SkillCard.scss';

interface SkillCardAction {
  icon: React.ReactNode;
  label: string;
  title?: string;
  loading?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

interface SkillCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  name: string;
  description?: string;
  ariaLabel?: string;
  iconKind?: 'skill' | 'market';
  level?: 'user' | 'project';
  shadowed?: boolean;
  builtin?: boolean;
  globallyDisabled?: boolean;
  action?: SkillCardAction;
  onOpenDetails: () => void;
}

const SkillCard: React.FC<SkillCardProps> = ({
  name, description, ariaLabel, iconKind = 'skill', level, shadowed, builtin, globallyDisabled,
  action, onOpenDetails, className, ...rootProps
}) => {
  const { t } = useI18n('scenes/skills');
  return (
    <div
      {...rootProps}
      className={['skills-card', shadowed && 'is-shadowed', globallyDisabled && 'is-globally-disabled', className].filter(Boolean).join(' ')}
      role="listitem"
      data-openbitfun-component="skill-card"
      data-openbitfun-part="root"
      data-openbitfun-variant={iconKind}
      data-openbitfun-level={level}
      data-openbitfun-state={[shadowed && 'shadowed', builtin && 'builtin'].filter(Boolean).join(' ') || undefined}
      data-overflow-trigger
     data-starmate-component="skill-card" data-starmate-part="root" data-starmate-variant={iconKind} data-starmate-level={level} data-starmate-state={[shadowed && 'shadowed', builtin && 'builtin'].filter(Boolean).join(' ') || undefined} >
      <div className="skills-card__top" data-openbitfun-component="skill-card" data-openbitfun-part="header" data-starmate-component="skill-card" data-starmate-part="header" >
        <button
          type="button"
          className="skills-card__open"
          aria-label={ariaLabel ?? name}
          onClick={onOpenDetails}
          data-openbitfun-component="skill-card"
          data-openbitfun-part="open"
         data-starmate-component="skill-card" data-starmate-part="open" />
        <div className="skills-card__icon" aria-hidden="true" data-openbitfun-component="skill-card" data-openbitfun-part="icon" data-starmate-component="skill-card" data-starmate-part="icon" >
          <Icon name="book-open" size="sm" />
        </div>
        <div className="skills-card__info" data-openbitfun-component="skill-card" data-openbitfun-part="body" data-starmate-component="skill-card" data-starmate-part="body" >
          <div className="skills-card__title-row" data-openbitfun-component="skill-card" data-openbitfun-part="titleRow" data-starmate-component="skill-card" data-starmate-part="titleRow" >
            <span className="skills-card__name" data-testid="skill-list-item-title" data-openbitfun-component="skill-card" data-openbitfun-part="name" data-starmate-component="skill-card" data-starmate-part="name" >
              <OverflowText behavior="marquee" title="">{name}</OverflowText>
            </span>
          </div>
          <OverflowText title="" className="skills-card__desc" data-testid="skill-list-item-description" data-openbitfun-component="skill-card" data-openbitfun-part="description" data-starmate-component="skill-card" data-starmate-part="description" >
            {description?.trim() || t('market.item.noDescription')}
          </OverflowText>
        </div>
      </div>
      <div className="skills-card__actions" data-openbitfun-component="skill-card" data-openbitfun-part="actions" data-starmate-component="skill-card" data-starmate-part="actions" >
        <IconButton
          size="sm"
          variant="quiet"
          tabIndex={action ? undefined : -1}
          onClick={action?.onClick ?? onOpenDetails}
          aria-label={action?.label ?? t('list.item.detail')}
          title={action?.title ?? action?.label ?? t('list.item.detail')}
          disabled={action?.disabled}
          loading={action?.loading}
          icon={action?.icon ?? <Icon name="arrow-right" size="sm" />}
          data-testid={action ? 'skills-card-action' : undefined}
          data-skill-action={action ? 'download' : undefined}
          data-openbitfun-component="skill-card"
          data-openbitfun-part="action"
         data-starmate-component="skill-card" data-starmate-part="action" />
      </div>
    </div>
  );
};

export default SkillCard;
