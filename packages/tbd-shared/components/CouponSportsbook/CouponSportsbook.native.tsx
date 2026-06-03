import { memo, FunctionComponent, useCallback, useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { Product } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { isBaseFixture } from "@ppb/tbd-store/state/entities/entities-selectors";
import { navigate } from "@ppb/tbd-router/native";
import { SupportingContentIconName } from "@ppb/the-wall-icons";
import { SupportingContentButton } from "@ppb/the-wall-native";
import ConnectedSportsbookMarket from "../SportsbookMarket";
import SportsbookMarketComponent from "../SportsbookMarket/SportsbookMarket.native";
import { COUPON, FIXTURE_PRESSABLE, STATS_PRESSABLE } from "../Coupon/Coupon.native.selectors";
import styles from "../Coupon/Coupon.native.styles";
import { ComponentProps } from "./props";
import FixtureHeader from "../FixtureHeader/FixtureHeader.native";
import ConnectedFixtureHeader from "../FixtureHeader";
import StatsPebbleCardGroup from "../StatsPebbleCardGroup/view/StatsPebbleCardGroup.native";
import { emitStatsClickEvent } from "../Coupon/event-emitters";

const CouponSportsbook: FunctionComponent<ComponentProps> = ({
  urn,
  marketURN,
  sporteventURN,
  fixture,
  fixtureViewMode,
  eventViewLink,
  displayRunners,
  isToShowStatsButton,
  dispatchMainMarketsTransitionsSubscription,
  dispatchCouponPrimaryMarketPress,
  cardUrn,
  couponCardGroupUrn,
  videoAvailable,
  iconsList,
  statsPebbleURN,
  visible,
  showHorizontalDuration,
}) => {
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const statsButtonIcon = isStatsOpen
    ? SupportingContentIconName.MATCH_STATS_FILLED
    : SupportingContentIconName.MATCH_STATS;

  const onPress = useCallback(() => {
    if (!eventViewLink) {
      return;
    }

    dispatchCouponPrimaryMarketPress(couponCardGroupUrn, sporteventURN, eventViewLink.viewUrl);
    navigate(eventViewLink);
  }, [couponCardGroupUrn, dispatchCouponPrimaryMarketPress, eventViewLink, sporteventURN]);

  const onStatsPress = useCallback(() => {
    setIsStatsOpen((prev) => {
      const next = !prev;
      emitStatsClickEvent(next, statsPebbleURN);
      return next;
    });
  }, [statsPebbleURN]);

  useEffect(() => {
    const { sportsbook } = displayRunners;
    const marketUrns = sportsbook ? [sportsbook.market] : [];

    if (marketUrns.length) {
      dispatchMainMarketsTransitionsSubscription(cardUrn, marketUrns);
    }

    /**
     * If it's baseFixture, we'll subscribe the main-markets-monitor-saga with withFixtureUpdates = true to request
     * main markets inside fixture updates in order to have inplay status updates.
     *
     * As these main markets are not displayed and therefore won't be subscribed to the market updates sagas by the
     * sportsbookMarket and exchangeMarket components, we have to subscribe them in this useEffect
     */
    if (isBaseFixture(fixture)) {
      const {
        mainMarket: { sportsbook: sportsbookMainMarketUrn },
      } = fixture;
      const mainMarketUrns = sportsbookMainMarketUrn ? [sportsbookMainMarketUrn] : [];
      const withFixtureUpdates = true;

      if (mainMarketUrns.length) {
        dispatchMainMarketsTransitionsSubscription(cardUrn, mainMarketUrns, withFixtureUpdates);
      }
    }
  }, [cardUrn, dispatchMainMarketsTransitionsSubscription, displayRunners, fixture]);

  if (!marketURN) {
    return null;
  }

  return (
    <View {...getTestProps(COUPON, false)}>
      <View style={styles.couponEventScoreContainer}>
        {eventViewLink?.viewUrl && (
          <Pressable
            {...getTestProps(FIXTURE_PRESSABLE, false)}
            onPress={onPress}
            style={styles.fixtureHeaderContainer}
          >
            <ConnectedFixtureHeader
              component={FixtureHeader}
              cardURN={cardUrn}
              fixture={fixture}
              activeProduct={Product.Sportsbook}
              marketURN={marketURN || ""}
              displayRunners={displayRunners.sportsbook?.runners}
              sporteventURN={sporteventURN}
              viewMode={fixtureViewMode}
              stickyOnScroll={false}
              showBottomSeparator={false}
              videoAvailable={videoAvailable}
              iconsList={iconsList}
              showHorizontalDuration={showHorizontalDuration}
            />
          </Pressable>
        )}
        <View style={styles.betButtonsContainer}>
          {displayRunners.sportsbook && (
            <ConnectedSportsbookMarket
              component={SportsbookMarketComponent}
              urn={marketURN}
              cardUrn={urn}
              displayRunnersUrns={displayRunners.sportsbook.runners.map((runner) => runner.urn)}
              template={"COUPON"}
              visible={visible}
            />
          )}
          {isToShowStatsButton && (
            <View {...getTestProps(STATS_PRESSABLE, false)}>
              <SupportingContentButton
                icon={statsButtonIcon}
                isOpen={isStatsOpen}
                style={styles.couponSupportingContentButton}
                onPress={onStatsPress}
              />
            </View>
          )}
        </View>
      </View>
      {isStatsOpen && statsPebbleURN && (
        <View style={styles.statsContainer}>
          <StatsPebbleCardGroup urn={statsPebbleURN} />
        </View>
      )}
    </View>
  );
};

export default memo(CouponSportsbook);
