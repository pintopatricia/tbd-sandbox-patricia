import { FunctionComponent, useEffect } from "react";
import { View, ViewStyle } from "react-native";
import { Divider } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { navigationRef } from "@ppb/tbd-router";

import { ComponentProps } from "./props";
import ConnectedCard from "../Card";
import Card from "../Card/Card.native";

import styles from "./SportsbookBetLegCardGroup.native.styles";
import { SBK_BET_LEG_CARD_GROUP, SBK_BET_LEG_CARD_GROUP_CARDS } from "./SportsbookBetLegCardGroup.native.selectors";
import StatsSupportingContentButtonsCardGroup from "../StatsSupportingContentButtonsCardGroup/view/StatsSupportingContentButtonsCardGroup.native";
import ConnectedFixtureCard from "../FixtureCard";
import MyBetsFixtureCard from "../FixtureCard/MyBetsFixture/MyBetsFixtureCard.native";
import FixtureCardPlaceholder from "../FixtureCard/FixtureCardPlaceholder.native";

const BET_LEG_CARD_TYPENAME = "BetLegCard";
const CARDS_WITHOUT_MARGIN = ["RaceDetailsCard"];
const STATS_BUTTONS_CARD_TYPENAME = "StatsSupportingContentButtonsCardGroup";

const SportsbookBetLegCardGroup: FunctionComponent<ComponentProps> = ({
  cards,
  isSettled,
  isMutationEligible,
  betURN,
  visible,
  statsSupportingContentButtonsUrn,
  dispatchSubscribeBlhResult,
  dispatchUnsubscribeBlhResult,
  dispatchSubscribeBmeResult,
  dispatchUnsubscribeBmeResult,
}) => {
  const navigationIsFocused = navigationRef.current ? navigationRef.current?.isFocused() : false;

  useEffect(() => {
    if (navigationIsFocused && !isSettled && betURN) {
      dispatchSubscribeBlhResult(betURN);
      if (isMutationEligible) dispatchSubscribeBmeResult(betURN);
    }

    return () => {
      if (!isSettled && betURN) {
        dispatchUnsubscribeBlhResult(betURN);
        if (isMutationEligible) dispatchUnsubscribeBmeResult(betURN);
      }
    };
  }, [
    navigationIsFocused,
    isSettled,
    dispatchSubscribeBlhResult,
    dispatchUnsubscribeBlhResult,
    dispatchSubscribeBmeResult,
    dispatchUnsubscribeBmeResult,
    betURN,
  ]);

  const getCardStyle = (typename: string): ViewStyle[] | undefined =>
    typename !== BET_LEG_CARD_TYPENAME
      ? [styles.supportingContentCard, !CARDS_WITHOUT_MARGIN.includes(typename) ? styles.supportingContentCardBox : {}]
      : undefined;

  const getCardContainerStyle = (typename: string) => {
    if (typename === STATS_BUTTONS_CARD_TYPENAME) return undefined;

    if (statsSupportingContentButtonsUrn) {
      return [styles.supportingContentCardStatsContainer, styles.supportingContentCardContainer];
    }

    return typename !== BET_LEG_CARD_TYPENAME ? [styles.supportingContentCardContainer] : undefined;
  };
  const lastCardIndex = cards.length - 2;

  return (
    <View style={styles.container} {...getTestProps(SBK_BET_LEG_CARD_GROUP, false)}>
      {cards?.map(({ urn, typename }, index) => (
        <View key={urn} style={getCardContainerStyle(typename)}>
          {typename !== STATS_BUTTONS_CARD_TYPENAME && (
            <View style={getCardStyle(typename)} {...getTestProps(SBK_BET_LEG_CARD_GROUP_CARDS, false)}>
              {/* 
              Using a different fixture component to avoid layouts shifting in all 
              views/screens with fixtures (native) as well as drop all unnecessary 
              data fetching for My Bets.
              */}
              {typename === "FixtureCard" ? (
                <ConnectedFixtureCard
                  urn={urn}
                  component={MyBetsFixtureCard}
                  placeholder={FixtureCardPlaceholder}
                  iconsList={undefined}
                />
              ) : (
                <ConnectedCard urn={urn} component={Card} typename={typename} visible={visible} />
              )}
            </View>
          )}
          {typename === STATS_BUTTONS_CARD_TYPENAME && <StatsSupportingContentButtonsCardGroup urn={urn} />}
          {typename === BET_LEG_CARD_TYPENAME && index !== lastCardIndex && !statsSupportingContentButtonsUrn && (
            <View style={styles.dividerContainer}>
              <Divider />
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

export default SportsbookBetLegCardGroup;
