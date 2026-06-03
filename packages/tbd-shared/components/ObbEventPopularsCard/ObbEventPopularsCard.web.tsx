import React, { FunctionComponent, useCallback, useContext, useEffect, useState } from "react";

import { Card, ScrollableSwimlane, StatusLabel, Divider, ShowMore } from "@ppb/the-wall-web";

import { ConfigContext } from "../Config/ConfigContext";
import { MatchStatSelection } from "../MatchStatSelectionCard/snowflakes/MatchStatSelection/MatchStatSelection.web";
import ConnectedObbBetButton from "../ObbBetButton";
import ObbBetButton from "../ObbBetButton/ObbBetButton.web";
import { i18n } from "../../helpers/i18n";

import { ComponentProps } from "./ObbEventPopularsCard.props";
import styles from "./ObbEventPopularsCard.web.css";
import { StatusLabelSizeType, StatusLabelType } from "@ppb/the-wall-common/types";
import { ValueIconName } from "@ppb/the-wall-icons";
import { TimesBacked } from "../TimesBacked/TimesBacked.web";

const ObbEventPopularsCard: FunctionComponent<ComponentProps> = ({
  urn,
  title,
  badgeText,
  showPopularEvidence,
  showStats,
  eventName,
  initialNumberOfVisibleBettingOpportunities,
  popularBettingOpportunities,
  hasEventStarted,
  dispatchDeleteObbEventPopularsCard,
  dispatchObbEventPopularsCardToggleShowMore,
}) => {
  const { isDesktopLayout } = useContext(ConfigContext);
  const [expanded, setExpanded] = useState(false);

  const hasMoreItemsToDisplay = initialNumberOfVisibleBettingOpportunities < popularBettingOpportunities.length;

  const visibleBettingOpportunities = expanded
    ? popularBettingOpportunities
    : popularBettingOpportunities.slice(0, initialNumberOfVisibleBettingOpportunities);

  useEffect(() => {
    if (hasEventStarted) {
      dispatchDeleteObbEventPopularsCard();
    }
  }, [dispatchDeleteObbEventPopularsCard, hasEventStarted]);

  const onClickShowMore = useCallback(() => {
    const nextExpanded = !expanded;
    setExpanded(nextExpanded);

    dispatchObbEventPopularsCardToggleShowMore(urn, eventName, nextExpanded);
  }, [expanded, dispatchObbEventPopularsCardToggleShowMore, urn, eventName]);

  return (
    <ScrollableSwimlane
      title={title}
      icon={
        !!badgeText && (
          <StatusLabel
            text={badgeText}
            statusLabelSize={StatusLabelSizeType.SMALL}
            statusLabelType={StatusLabelType.COMPLIMENTARY}
          />
        )
      }
      iconPosition={"after"}
      isDesktopLayout={isDesktopLayout}
    >
      <div className={styles.cardContainer}>
        <Card fullWidthContent>
          {visibleBettingOpportunities.map((popularBettingOpportunity, index) => (
            <React.Fragment key={popularBettingOpportunity.legId}>
              {showPopularEvidence && !!popularBettingOpportunity.timesBackedLabel && (
                <div className={styles.timesBackedContainer}>
                  <TimesBacked
                    label={popularBettingOpportunity.timesBackedLabel}
                    icon={ValueIconName.POPULAR_BET_BUILDER}
                    iconColor="var(--times-backed-icon-colour)"
                  />
                </div>
              )}
              <div>
                <MatchStatSelection
                  title={[<span key={popularBettingOpportunity.legId}>{popularBettingOpportunity.title}</span>]}
                  subtitle={popularBettingOpportunity.subtitle}
                  stats={showStats ? popularBettingOpportunity.stats : null}
                >
                  <ConnectedObbBetButton
                    cardUrn={urn}
                    eventName={eventName}
                    legId={popularBettingOpportunity.legId}
                    showSecondaryLabel={false}
                    metadataOverride={{ card: "popular card" }}
                    component={ObbBetButton}
                  />
                </MatchStatSelection>
              </div>
              {index < visibleBettingOpportunities.length - 1 && <Divider />}
            </React.Fragment>
          ))}
          {hasMoreItemsToDisplay && (
            <div className={styles.showMoreContainer}>
              <ShowMore
                text={expanded ? i18n({ key: "I18N.SHOW_LESS" }) : i18n({ key: "I18N.SHOW_MORE" })}
                hasBorderTop={true}
                opened={expanded}
                onClick={onClickShowMore}
              />
            </div>
          )}
        </Card>
      </div>
    </ScrollableSwimlane>
  );
};

export default ObbEventPopularsCard;
