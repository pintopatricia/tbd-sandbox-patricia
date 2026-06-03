import { Fragment, FunctionComponent, useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import { Product } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { isBaseFixture } from "@ppb/tbd-store/state/entities/entities-selectors";
import { navigate } from "@ppb/tbd-router/native";
import { SupportingContentIconName } from "@ppb/the-wall-icons";
import { SupportingContentButton } from "@ppb/the-wall-native";
import ConnectedExchangeMarket from "../ExchangeMarket";
import ExchangeMarketComponent from "../ExchangeMarket/ExchangeMarket.native";
import { COUPON, FIXTURE_PRESSABLE, STATS_PRESSABLE } from "../Coupon/Coupon.native.selectors";
import styles from "../Coupon/Coupon.native.styles";
import { ComponentProps } from "./props";
import { withInlineBetslip } from "../Betslip/withInlineBetslip/withInlineBetslip.native";
import FixtureHeader from "../FixtureHeader/FixtureHeader.native";
import ConnectedFixtureHeader from "../FixtureHeader";
import StatsPebbleCardGroup from "../StatsPebbleCardGroup/view/StatsPebbleCardGroup.native";
import { emitStatsClickEvent } from "../Coupon/event-emitters";

const CouponExchange: FunctionComponent<ComponentProps> = ({
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
  renderBetslip,
  couponCardGroupUrn,
  videoAvailable,
  iconsList,
  statsPebbleURN,
  visible,
  showHorizontalDuration,
}) => {
  "use no memo";

  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [statsButtonIcon, setStatsButtonIcon] = useState(SupportingContentIconName.MATCH_STATS);

  const onPress = useCallback(() => {
    if (!eventViewLink) {
      return;
    }

    dispatchCouponPrimaryMarketPress(couponCardGroupUrn, sporteventURN, eventViewLink.viewUrl);
    navigate(eventViewLink);
  }, [couponCardGroupUrn, dispatchCouponPrimaryMarketPress, eventViewLink, sporteventURN]);

  const onStatsPress = useCallback(() => {
    const newIsStatsOpen = !isStatsOpen;

    setStatsButtonIcon(
      newIsStatsOpen ? SupportingContentIconName.MATCH_STATS_FILLED : SupportingContentIconName.MATCH_STATS,
    );
    setIsStatsOpen(newIsStatsOpen);
    emitStatsClickEvent(newIsStatsOpen, statsPebbleURN);
  }, [isStatsOpen, statsPebbleURN]);

  useEffect(() => {
    const { exchange } = displayRunners;
    const marketUrns = exchange ? [exchange.market] : [];

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
        mainMarket: { exchange: exchangeMainMarketUrn },
      } = fixture;
      const mainMarketUrns = exchangeMainMarketUrn ? [exchangeMainMarketUrn] : [];
      const withFixtureUpdates = true;

      if (mainMarketUrns.length) {
        dispatchMainMarketsTransitionsSubscription(cardUrn, mainMarketUrns, withFixtureUpdates);
      }
    }
  }, [cardUrn, dispatchMainMarketsTransitionsSubscription, displayRunners, fixture]);

  const fixtureHeader = useMemo(
    () => (
      <ConnectedFixtureHeader
        component={FixtureHeader}
        cardURN={cardUrn}
        fixture={fixture}
        activeProduct={Product.Exchange}
        marketURN={marketURN || ""}
        displayRunners={displayRunners.exchange?.runners}
        sporteventURN={sporteventURN}
        viewMode={fixtureViewMode}
        stickyOnScroll={false}
        showBottomSeparator={false}
        videoAvailable={videoAvailable}
        iconsList={iconsList}
        showHorizontalDuration={showHorizontalDuration}
      />
    ),
    [
      fixture,
      fixtureViewMode,
      sporteventURN,
      videoAvailable,
      cardUrn,
      iconsList,
      marketURN,
      displayRunners.exchange?.runners,
      showHorizontalDuration,
    ],
  );

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
            {fixtureHeader}
          </Pressable>
        )}
        <View style={styles.betButtonsContainer}>
          {displayRunners.exchange && (
            <ConnectedExchangeMarket
              component={ExchangeMarketComponent}
              urn={marketURN}
              cardUrn={urn}
              inline
              displayRunnersUrns={displayRunners.exchange.runners.map((runner) => runner.urn)}
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
      {displayRunners.exchange &&
        renderBetslip &&
        Array.from(new Set(displayRunners.exchange.runners.map((r) => r.urn))).map((runnerUrn) => (
          <Fragment key={runnerUrn}>{renderBetslip(runnerUrn)}</Fragment>
        ))}
    </View>
  );
};

export default withInlineBetslip(CouponExchange);
