import { Fragment, FunctionComponent, useCallback } from "react";
import { View, Pressable } from "react-native";
import { ActionLink, Divider, Text } from "@ppb/the-wall-native";
import { ActionLinkTypography, ScoreboardViewMode, ViewLink } from "@ppb/the-wall-common/types";
import { navigate } from "@ppb/tbd-router";
import { MatchStatSelection } from "../MatchStatSelectionCard/snowflakes/MatchStatSelection/MatchStatSelection.native";
import ConnectedFixtureHeader from "../FixtureHeader";
import FixtureHeader from "../FixtureHeader/FixtureHeader.native";
import ConnectedObbBetButton from "../ObbBetButton";
import ObbBetButton from "../ObbBetButton/ObbBetButton.native";
import styles from "./ObbCreatedBetsCard.native.styles";
import { ComponentProps } from "./ObbCreatedBetsCard.props";

const ObbCreatedBetsCard: FunctionComponent<ComponentProps> = ({
  urn,
  fixtureUrn,
  eventUrn,
  eventName,
  footerViewLink,
  footerLabel,
  eventViewLink,
  bettingOpportunities,
  isEventInPlay,
  fullWidth,
  position,
  cardIndex,
  dispatchInactiveObbBetButtonClick,
  dispatchLinkClick,
}) => {
  const handleLinkClick = useCallback(
    (viewLink: ViewLink, label?: string) => {
      if (isEventInPlay) {
        dispatchInactiveObbBetButtonClick();
        return;
      }

      dispatchLinkClick(viewLink, urn, label, eventName, cardIndex);

      navigate(viewLink);
    },
    [cardIndex, dispatchInactiveObbBetButtonClick, dispatchLinkClick, eventName, isEventInPlay, urn],
  );

  return (
    <View style={[styles.card, fullWidth && styles.fullWidthCard]}>
      <Pressable style={styles.header} onPress={() => handleLinkClick(eventViewLink, eventName)}>
        <ConnectedFixtureHeader
          fixture={fixtureUrn}
          sporteventURN={eventUrn}
          viewMode={ScoreboardViewMode.SMALL}
          showBottomSeparator={false}
          showEventDateBelow={true}
          showHorizontalDuration={false}
          component={FixtureHeader}
        />
      </Pressable>

      {bettingOpportunities.map((opportunity, index) => (
        <Fragment key={opportunity.legId}>
          <MatchStatSelection
            title={[
              <Text style={styles.namesTextTitle} key={opportunity.legId}>
                {opportunity.title}
              </Text>,
            ]}
            subtitle={opportunity.subtitle}
            stats={opportunity.statsLabel}
          >
            <ConnectedObbBetButton
              cardUrn={urn}
              eventName={eventName}
              legId={opportunity.legId}
              showSecondaryLabel={false}
              onClick={isEventInPlay ? () => dispatchInactiveObbBetButtonClick(opportunity.legTemplateId) : undefined}
              status={isEventInPlay ? "closed" : undefined}
              position={position}
              component={ObbBetButton}
            />
          </MatchStatSelection>
          {index < bettingOpportunities.length - 1 && <Divider />}
        </Fragment>
      ))}

      <Divider />
      <View style={styles.seeAllContainer}>
        <ActionLink
          onClick={() => handleLinkClick(footerViewLink, footerLabel)}
          disabled={isEventInPlay}
          text={footerLabel}
          typography={ActionLinkTypography.Regular}
          noPadding
        />
      </View>
    </View>
  );
};

export default ObbCreatedBetsCard;
