import { lazy, Fragment, FunctionComponent, MouseEvent, useCallback, useEffect, useState } from "react";
import { Product } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { isBaseFixture } from "@ppb/tbd-store/state/entities/entities-selectors";
import useOnIntersect from "@ppb/the-wall-web/hooks/useOnIntersect";
import { SupportingContentIconName } from "@ppb/the-wall-icons";
import { SupportingContentButton } from "@ppb/the-wall-web";
import styles from "../Coupon/Coupon.web.css";
import { ComponentProps } from "./props";
import { withInlineBetslip } from "../Betslip/withInlineBetslip/withInlineBetslip.web";
import FixtureHeader from "../FixtureHeader/FixtureHeader.web";
import ConnectedFixtureHeader from "../FixtureHeader";
import StatsPebbleCardGroup from "../StatsPebbleCardGroup/view/StatsPebbleCardGroup.web";
import INTERSECTION_CONFIG from "../../config/cards-intersection";
import { emitStatsClickEvent } from "../Coupon/event-emitters";

const ConnectedExchangeMarket = lazy(() => import(/* webpackChunkName: "ExchangeMarket" */ "../ExchangeMarket"));
const ExchangeMarket = lazy(
  () => import(/* webpackChunkName: "ExchangeMarket" */ "../ExchangeMarket/ExchangeMarket.web"),
);

const CouponExchange: FunctionComponent<ComponentProps> = ({
  urn,
  marketURN,
  fixture,
  sporteventURN,
  fixtureViewMode,
  eventViewLink,
  displayRunners,
  excMainMarketId,
  isToShowStatsButton,
  dispatchMainMarketsTransitionsSubscription,
  dispatchExchangeMarketUpdatesSubscribe,
  dispatchExchangeMarketUpdatesUnsubscribe,
  dispatchCouponPrimaryMarketPress,
  cardUrn,
  dispatchRouterPushAction,
  renderBetslip,
  couponCardGroupUrn,
  videoAvailable,
  iconsList,
  statsPebbleURN,
  showHorizontalDuration,
}) => {
  const { isIntersecting, ref } = useOnIntersect<HTMLDivElement>(null, INTERSECTION_CONFIG.rootMargin);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [statsButtonIcon, setStatsButtonIcon] = useState(SupportingContentIconName.MATCH_STATS);

  const onClick = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();

      if (!eventViewLink) {
        return;
      }

      dispatchCouponPrimaryMarketPress(couponCardGroupUrn, sporteventURN, eventViewLink.viewUrl);
      dispatchRouterPushAction(eventViewLink);
    },
    [eventViewLink, dispatchCouponPrimaryMarketPress, couponCardGroupUrn, sporteventURN, dispatchRouterPushAction],
  );

  const onStatsClick = useCallback(async () => {
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

      if (excMainMarketId) {
        if (isIntersecting) {
          dispatchExchangeMarketUpdatesSubscribe(excMainMarketId);
        } else {
          dispatchExchangeMarketUpdatesUnsubscribe(excMainMarketId);
        }
      }
    }

    return () => {
      if (isBaseFixture(fixture) && excMainMarketId && isIntersecting) {
        dispatchExchangeMarketUpdatesUnsubscribe(excMainMarketId);
      }
    };
  }, [
    cardUrn,
    isIntersecting,
    dispatchExchangeMarketUpdatesSubscribe,
    dispatchExchangeMarketUpdatesUnsubscribe,
    dispatchMainMarketsTransitionsSubscription,
    displayRunners,
    excMainMarketId,
    fixture,
  ]);

  if (!marketURN) {
    return null;
  }

  return (
    <div className={styles.couponContainer} ref={ref}>
      <div className={styles.couponEventScoreContainer}>
        {eventViewLink?.viewUrl && (
          <a href={eventViewLink.viewUrl} onClick={onClick} className={styles.fixtureHeaderContainer}>
            <ConnectedFixtureHeader
              component={FixtureHeader}
              fixture={fixture}
              displayRunners={displayRunners.exchange?.runners}
              activeProduct={Product.Exchange}
              marketURN={marketURN}
              sporteventURN={sporteventURN}
              viewMode={fixtureViewMode}
              stickyOnScroll={false}
              showBottomSeparator={false}
              videoAvailable={videoAvailable}
              iconsList={iconsList}
              showHorizontalDuration={showHorizontalDuration}
            />
          </a>
        )}
        <div className={styles.betButtonsContainer}>
          {displayRunners.exchange && (
            <ConnectedExchangeMarket
              component={ExchangeMarket}
              urn={marketURN}
              cardUrn={urn}
              inline
              displayRunnersUrns={displayRunners.exchange.runners.map((runner) => runner.urn)}
            />
          )}
          {isToShowStatsButton && (
            <div className={styles.statsButtonContainer}>
              <SupportingContentButton
                icon={statsButtonIcon}
                isOpen={isStatsOpen}
                className={styles.couponSupportingContentButton}
                onPress={onStatsClick}
              />
            </div>
          )}
        </div>
      </div>
      {isStatsOpen && statsPebbleURN && (
        <div className={styles.statsContainer}>
          <StatsPebbleCardGroup urn={statsPebbleURN} />
        </div>
      )}
      {displayRunners.exchange &&
        renderBetslip &&
        [...new Set(displayRunners.exchange.runners.map((r) => r.urn))].map((runnerUrn) => (
          <Fragment key={runnerUrn}>{renderBetslip(runnerUrn)}</Fragment>
        ))}
    </div>
  );
};

export default withInlineBetslip(CouponExchange);
