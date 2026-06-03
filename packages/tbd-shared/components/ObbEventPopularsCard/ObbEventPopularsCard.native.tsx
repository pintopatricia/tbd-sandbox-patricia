import React, { FunctionComponent, useCallback, useEffect, useState } from "react";
import { View } from "react-native";

import { Card, ScrollableSwimlane, StatusLabel, Divider, ShowMore, Text } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { StatusLabelSizeType, StatusLabelType } from "@ppb/the-wall-common/types";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { ValueIconName } from "@ppb/the-wall-icons";

import { TimesBacked } from "../TimesBacked/TimesBacked.native";
import { MatchStatSelection } from "../MatchStatSelectionCard/snowflakes/MatchStatSelection/MatchStatSelection.native";
import ConnectedObbBetButton from "../ObbBetButton";
import ObbBetButton from "../ObbBetButton/ObbBetButton.native";

import { ComponentProps } from "./ObbEventPopularsCard.props";
import styles from "./ObbEventPopularsCard.native.styles";
import { CARD_CONTAINER } from "./ObbEventPopularsCard.native.selectors";
import { i18n } from "../../helpers/i18n";

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
          <View style={styles.statusLabelWrapper}>
            <View style={styles.statusLabelAbsolute}>
              <StatusLabel
                text={badgeText}
                statusLabelSize={StatusLabelSizeType.SMALL}
                statusLabelType={StatusLabelType.COMPLIMENTARY}
              />
            </View>
          </View>
        )
      }
      iconPosition="after"
    >
      <View style={styles.scrollContent} {...getTestProps(CARD_CONTAINER, false)}>
        <Card fullWidthContent>
          {visibleBettingOpportunities.map((popularBettingOpportunity, index) => (
            <React.Fragment key={popularBettingOpportunity.legId}>
              {showPopularEvidence && !!popularBettingOpportunity.timesBackedLabel && (
                <View style={styles.timesBackedContainer}>
                  <TimesBacked
                    label={popularBettingOpportunity.timesBackedLabel}
                    icon={ValueIconName.POPULAR_BET_BUILDER}
                    iconColor={tokens.TimesBackedIconColour}
                  />
                </View>
              )}
              <MatchStatSelection
                title={[
                  <Text style={styles.title} key={popularBettingOpportunity.legId}>
                    {popularBettingOpportunity.title}
                  </Text>,
                ]}
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
              {index < visibleBettingOpportunities.length - 1 && <Divider />}
            </React.Fragment>
          ))}
          {hasMoreItemsToDisplay && (
            <View style={styles.showMoreContainer}>
              <ShowMore
                text={expanded ? i18n({ key: "I18N.SHOW_LESS" }) : i18n({ key: "I18N.SHOW_MORE" })}
                hasBorderTop={true}
                opened={expanded}
                onClick={onClickShowMore}
              />
            </View>
          )}
        </Card>
      </View>
    </ScrollableSwimlane>
  );
};

export default ObbEventPopularsCard;
