import { lazy, memo, FunctionComponent, MouseEvent, useCallback, useEffect, useId, useState } from "react";
import { Product } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { isBaseFixture } from "@ppb/tbd-store/state/entities/entities-selectors";
import useOnIntersect from "@ppb/the-wall-web/hooks/useOnIntersect";
import { SupportingContentIconName } from "@ppb/the-wall-icons";
import { SupportingContentButton } from "@ppb/the-wall-web";
import styles from "../Coupon/Coupon.web.css";
import { ComponentProps } from "./props";
import FixtureHeader from "../FixtureHeader/FixtureHeader.web";
import ConnectedFixtureHeader from "../FixtureHeader";
import StatsPebbleCardGroup from "../StatsPebbleCardGroup/view/StatsPebbleCardGroup.web";
import INTERSECTION_CONFIG from "../../config/cards-intersection";
import { emitStatsClickEvent } from "../Coupon/event-emitters";

const ConnectedSportsbookMarket = lazy(() => import(/* webpackChunkName: "SportsbookMarket" */ "../SportsbookMarket"));
const SportsbookMarket = lazy(
  () => import(/* webpackChunkName: "SportsbookMarket" */ "../SportsbookMarket/SportsbookMarket.web"),
);

const CouponSportsbook: FunctionComponent<ComponentProps> = ({
  urn,
  marketURN,
  fixture,
  sporteventURN,
  fixtureViewMode,
  eventViewLink,
  displayRunners,
  isToShowStatsButton,
  sbkMainMarketId,
  dispatchMainMarketsTransitionsSubscription,
  dispatchSportsbookMarketUpdatesSubscribe,
  dispatchSportsbookMarketUpdatesUnsubscribe,
  dispatchCouponPrimaryMarketPress,
  cardUrn,
  dispatchRouterPushAction,
  couponCardGroupUrn,
  videoAvailable,
  iconsList,
  statsPebbleURN,
  showHorizontalDuration,
}) => {
  const id = useId();
  const { isIntersecting, ref } = useOnIntersect<HTMLDivElement>(null, INTERSECTION_CONFIG.rootMargin);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const statsButtonIcon = isStatsOpen
    ? SupportingContentIconName.MATCH_STATS_FILLED
    : SupportingContentIconName.MATCH_STATS;

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

  const onStatsClick = useCallback(() => {
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

      if (sbkMainMarketId) {
        if (isIntersecting) {
          dispatchSportsbookMarketUpdatesSubscribe(sbkMainMarketId, id);
        } else {
          dispatchSportsbookMarketUpdatesUnsubscribe(sbkMainMarketId, id);
        }
      }
    }

    return () => {
      if (isBaseFixture(fixture) && sbkMainMarketId && isIntersecting) {
        dispatchSportsbookMarketUpdatesUnsubscribe(sbkMainMarketId, id);
      }
    };
  }, [
    cardUrn,
    isIntersecting,
    dispatchMainMarketsTransitionsSubscription,
    dispatchSportsbookMarketUpdatesSubscribe,
    dispatchSportsbookMarketUpdatesUnsubscribe,
    displayRunners,
    fixture,
    sbkMainMarketId,
    id,
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
              displayRunners={displayRunners.sportsbook?.runners}
              activeProduct={Product.Sportsbook}
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
          {displayRunners.sportsbook && (
            <ConnectedSportsbookMarket
              component={SportsbookMarket}
              urn={marketURN}
              cardUrn={urn}
              template={"COUPON"}
              displayRunnersUrns={displayRunners.sportsbook.runners.map((runner) => runner.urn)}
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
    </div>
  );
};

export default memo(CouponSportsbook);
