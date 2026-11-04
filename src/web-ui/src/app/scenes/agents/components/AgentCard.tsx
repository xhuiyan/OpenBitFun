import React from 'react';
import { CardBody, CardFooter, CardHeader, Icon, OverflowText } from '@starmate/ui';
import { useTranslation } from 'react-i18next';
import type { AgentWithCapabilities } from '../agentsStore';
import { getAgentDescription } from '../utils';
import AgentCatalogCard, { AgentCatalogMetrics } from './AgentCatalogCard';
import './AgentCatalogCard.scss';

interface AgentCardProps {
  agent: AgentWithCapabilities;
  toolCount?: number;
  skillCount?: number;
  subagentCount?: number;
  disabledReason?: string;
  onOpenDetails: (agent: AgentWithCapabilities) => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, disabledReason, onOpenDetails, ...metrics }) => {
  const { t } = useTranslation('scenes/agents');

  return (
    <AgentCatalogCard
      agent={agent}
      onOpenDetails={onOpenDetails}
      data-openbitfun-product-component="agent-card"
      data-openbitfun-product-part="root"
     data-starmate-product-component="agent-card" data-starmate-product-part="root" >
      <CardHeader
        align="center"
        className="agent-catalog-card__header"
        data-openbitfun-product-component="agent-card"
        data-openbitfun-product-part="header"
        title={(
          <div className="agent-catalog-card__title" data-openbitfun-product-component="agent-card" data-openbitfun-product-part="headerInfo" data-starmate-product-component="agent-card" data-starmate-product-part="headerInfo" >
            <div className="agent-catalog-card__title-row" data-openbitfun-product-component="agent-card" data-openbitfun-product-part="titleRow" data-starmate-product-component="agent-card" data-starmate-product-part="titleRow" >
              <OverflowText className="agent-catalog-card__name" data-openbitfun-product-component="agent-card" data-openbitfun-product-part="name" data-testid="agent-list-item-title" data-starmate-product-component="agent-card" data-starmate-product-part="name" >
                {agent.name}
              </OverflowText>
              {agent.agentKind === 'subagent' && (
                <span className="agent-catalog-card__identity" data-openbitfun-product-component="agent-card" data-openbitfun-product-part="badges" data-starmate-product-component="agent-card" data-starmate-product-part="badges" >
                  {t('agentCard.badges.subagent')}
                </span>
              )}
            </div>
          </div>
        )}
       data-starmate-product-component="agent-card" data-starmate-product-part="header" />
      <CardBody data-openbitfun-product-component="agent-card" data-openbitfun-product-part="body" data-starmate-product-component="agent-card" data-starmate-product-part="body" >
        <OverflowText as="p" lines={2} className="agent-catalog-card__description" data-openbitfun-product-component="agent-card" data-openbitfun-product-part="description" data-testid="agent-list-item-description" data-starmate-product-component="agent-card" data-starmate-product-part="description" >
          {getAgentDescription(t, agent)}
        </OverflowText>
      </CardBody>
      <CardFooter align={disabledReason ? 'between' : 'start'} className="agent-catalog-card__footer" data-openbitfun-product-component="agent-card" data-openbitfun-product-part="footer" data-starmate-product-component="agent-card" data-starmate-product-part="footer" >
        <AgentCatalogMetrics {...metrics} agent={agent} data-openbitfun-product-component="agent-card" data-openbitfun-product-part="meta"  data-starmate-product-component="agent-card" data-starmate-product-part="meta" />
        {disabledReason && (
          <span className="agent-catalog-card__status" data-openbitfun-state="disabled" title={disabledReason} data-starmate-state="disabled" >
            <Icon className="agent-catalog-card__status-icon" name="unselected" size="2xs" />
            <OverflowText>{disabledReason}</OverflowText>
          </span>
        )}
      </CardFooter>
    </AgentCatalogCard>
  );
};

export default AgentCard;
