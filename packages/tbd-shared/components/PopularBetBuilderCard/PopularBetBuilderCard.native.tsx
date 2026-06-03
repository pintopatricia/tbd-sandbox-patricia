import { useCallback, useMemo } from "react";
import * as React from "react";
import { View, Pressable } from "react-native";
import { ScoreboardViewMode, CardTheme } from "@ppb/the-wall-common/types";
import { DefaultHorseSilkSvg, SecondaryButton, Divider, Text, Card } from "@ppb/the-wall-native";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { ValueIconName } from "@ppb/the-wall-icons";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { navigate } from "@ppb/tbd-router/native";
import { BubbleItem } from "./snowflakes/BubbleItem/BubbleItem.native";
import FixtureHeader from "../FixtureHeader/FixtureHeader.native";
import ConnectedFixtureHeader from "../FixtureHeader";
import ConnectedBettingOpportunityBetButton from "../BettingOpportunityBetButton";
import BettingOpportunityBetButton from "../BettingOpportunityBetButton/BettingOpportunityBetButton.native";
import ConnectedPopularBetBuilderSelectionOdd from "./PopularBetBuilderSelectionOdd";
import PopularBetBuilderSelectionOdd from "./PopularBetBuilderSelectionOdd/PopularBetBuilderSelectionOdd.native";
import { ComponentProps } from "./props";
import styles from "./PopularBetBuilderCard.native.styles";
import {
  POPULAR_BET_BUILDER_FIXTURE_HEADER,
  POPULAR_BET_BUILDER,
  SELECTIONS_CONTAINER,
  POPULAR_BET_BUILDER_MARKET_TITLE,
  POPULAR_BET_BUILDER_CARD_TITLE,
} from "./PopularBetBuilderCard.native.selectors";
import { TimesBacked } from "../TimesBacked/TimesBacked.native";

const PopularBetBuilderCard: React.FC<ComponentProps> = ({
  bettingOpportunityType,
  showWasPrice,
  fixture,
  timesBackedLabel,
  selections,
  items,
  bettingOpportunityUrn,
  cardUrn,
  viewLink,
  sportevent,
  isRacing,
  marketTitle,
  cardTitle,
  dispatchNavigateToEvent,
  dispatchNavigateToEventBetBuilderTab,
  tabViewLink,
  buildYourOwn,
  buildYourOwnBtnLabel,
  visible,
}) => {
  const isSameEvent = !!(viewLink && fixture && sportevent);
  const canJumpBetBuilderTab = !!(viewLink && fixture && sportevent && tabViewLink);
  const isBoostedBets = bettingOpportunityType === "BOOSTED_BETS";

  const onClickHandler = useCallback(() => {
    if (isSameEvent) {
      dispatchNavigateToEvent(cardUrn, viewLink.viewUrl, selections[0].marketUrn);
      navigate(viewLink);
    }
  }, [cardUrn, dispatchNavigateToEvent, isSameEvent, selections, viewLink]);

  const onBetBuilderButtonClickHandler = useCallback(() => {
    if (canJumpBetBuilderTab) {
      dispatchNavigateToEventBetBuilderTab(cardUrn, tabViewLink.viewUrl, selections[0].marketUrn);
      navigate(tabViewLink);
    }
  }, [cardUrn, dispatchNavigateToEventBetBuilderTab, selections, tabViewLink, canJumpBetBuilderTab]);

  const renderHeader = useMemo(() => {
    const headerStyles = [styles.header, fixture ? styles.headerFixture : null];

    if (isSameEvent) {
      return (
        <View style={headerStyles}>
          <Pressable
            style={styles.fixtureHeader}
            {...getTestProps(POPULAR_BET_BUILDER_FIXTURE_HEADER, false)}
            onPress={onClickHandler}
          >
            <ConnectedFixtureHeader
              component={FixtureHeader}
              cardURN={cardUrn}
              fixture={fixture}
              sporteventURN={sportevent}
              showBottomSeparator={false}
              viewMode={ScoreboardViewMode.SMALL}
            />
          </Pressable>
        </View>
      );
    }

    if (cardTitle) {
      return (
        <View style={styles.header}>
          {isBoostedBets && (
            <View style={styles.boostedIconContainer}>
              <View style={styles.boostedIcon}>
                <GenericIcon
                  name={ValueIconName.PRICE_BOOST}
                  color={tokens.PopularBetBuilderCardHeaderBoostIconColour}
                />
              </View>
            </View>
          )}
          <Text {...getTestProps(POPULAR_BET_BUILDER_CARD_TITLE, false)} style={styles.cardTitle}>
            {cardTitle}
          </Text>
        </View>
      );
    }

    if (timesBackedLabel) {
      return (
        <View style={styles.header}>
          <TimesBacked
            label={timesBackedLabel}
            icon={ValueIconName.POPULAR_BET_BUILDER}
            iconColor={tokens.TimesBackedIconColour}
          />
        </View>
      );
    }

    return null;
  }, [isSameEvent, cardTitle, timesBackedLabel, onClickHandler, cardUrn, fixture, sportevent, isBoostedBets]);

  return (
    <Card showShadow fullWidthContent theme={CardTheme.TRANSPARENT}>
      <View {...getTestProps(POPULAR_BET_BUILDER, false)} style={styles.container}>
        {renderHeader && (
          <>
            {renderHeader}
            <Divider />
          </>
        )}
        <View style={styles.content}>
          {isSameEvent && timesBackedLabel && (
            <TimesBacked
              label={timesBackedLabel}
              icon={ValueIconName.POPULAR_BET_BUILDER}
              iconColor={tokens.TimesBackedIconColour}
            />
          )}

          {marketTitle && (
            <Text {...getTestProps(POPULAR_BET_BUILDER_MARKET_TITLE, false)} style={styles.marketTitle}>
              {marketTitle}
            </Text>
          )}
          <View {...getTestProps(SELECTIONS_CONTAINER, false)}>
            {items.map((item, index) => (
              <BubbleItem
                key={index}
                title={item.title}
                titleIcon={item.titleIcon}
                titleIconFallback={item.titleIcon ? DefaultHorseSilkSvg : undefined}
                description={item.description}
                subDescription={item.subDescription}
                isLast={index === items.length - 1}
              >
                {item.selectionTypeIcon ? (
                  <View style={styles.selectionTypeIcon}>
                    <GenericIcon name={item.selectionTypeIcon} />
                  </View>
                ) : null}

                {!isBoostedBets && item.marketId && item.runnerUrn ? (
                  <ConnectedPopularBetBuilderSelectionOdd
                    component={PopularBetBuilderSelectionOdd}
                    cardUrn={cardUrn}
                    isRacing={isRacing}
                    marketId={item.marketId}
                    runnerUrn={item.runnerUrn}
                    visible={visible}
                  />
                ) : null}
              </BubbleItem>
            ))}
          </View>
          {!!buildYourOwn && !!sportevent && (
            <SecondaryButton label={buildYourOwnBtnLabel} onTap={onBetBuilderButtonClickHandler} />
          )}
          <ConnectedBettingOpportunityBetButton
            component={BettingOpportunityBetButton}
            showWasPrice={showWasPrice}
            cardUrn={cardUrn}
            bettingOpportunityUrn={bettingOpportunityUrn}
            visible={visible}
          />
        </View>
      </View>
    </Card>
  );
};

export default PopularBetBuilderCard;
