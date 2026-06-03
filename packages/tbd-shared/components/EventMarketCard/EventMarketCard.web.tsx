import { FunctionComponent, useCallback, useEffect, MouseEvent, useId } from "react";
import { isBaseFixture } from "@ppb/tbd-store/state/entities/entities-selectors";
import useOnIntersect from "@ppb/the-wall-web/hooks/useOnIntersect";
import { MarketTemplate } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
import ConnectedMarket from "../Market";
import { Market } from "../Market/Market.web";
import { ComponentProps } from "./props";
import styles from "./EventMarketCard.web.css";
import FixtureHeader from "../FixtureHeader/FixtureHeader.web";
import ConnectedFixtureHeader from "../FixtureHeader";
import INTERSECTION_CONFIG from "../../config/cards-intersection";

export const EventMarketCard: FunctionComponent<ComponentProps> = ({
  fixture,
  fixtureURN,
  sporteventURN,
  stickyOnScroll,
  cardUrn,
  displayRunners,
  eventViewLink,
  runnerViewLinks,
  excMainMarketId,
  sbkMainMarketId,
  marketPromo,
  videoAvailable,
  tabLink,
  dispatchPushAction,
  dispatchClickCardAction,
  dispatchMainMarketsTransitionsSubscription,
  dispatchSportsbookMarketUpdatesSubscribe,
  dispatchSportsbookMarketUpdatesUnsubscribe,
  dispatchExchangeMarketUpdatesSubscribe,
  dispatchExchangeMarketUpdatesUnsubscribe,
}) => {
  const href = eventViewLink.viewUrl;
  const { isIntersecting, ref } = useOnIntersect<HTMLDivElement>(null, INTERSECTION_CONFIG.rootMargin);
  const id = useId();

  const onClick = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      dispatchClickCardAction(cardUrn, fixtureURN, sporteventURN, href);
      dispatchPushAction(eventViewLink);
    },
    [dispatchClickCardAction, cardUrn, fixtureURN, sporteventURN, href, dispatchPushAction, eventViewLink],
  );

  useEffect(() => {
    const { exchange, sportsbook } = displayRunners;
    const marketUrns = [...(exchange ? [exchange.market] : []), ...(sportsbook ? [sportsbook.market] : [])];

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
        mainMarket: { exchange: exchangeMainMarketUrn, sportsbook: sportsbookMainMarketUrn },
      } = fixture;
      const mainMarketUrns = [
        ...(exchangeMainMarketUrn ? [exchangeMainMarketUrn] : []),
        ...(sportsbookMainMarketUrn ? [sportsbookMainMarketUrn] : []),
      ];

      if (mainMarketUrns.length) {
        const withFixtureUpdates = true;
        dispatchMainMarketsTransitionsSubscription(cardUrn, mainMarketUrns, withFixtureUpdates);
      }

      if (excMainMarketId) {
        if (isIntersecting) {
          dispatchExchangeMarketUpdatesSubscribe(excMainMarketId);
        } else {
          dispatchExchangeMarketUpdatesUnsubscribe(excMainMarketId);
        }
      }
      if (sbkMainMarketId) {
        if (isIntersecting) {
          dispatchSportsbookMarketUpdatesSubscribe(sbkMainMarketId, id);
        } else {
          dispatchSportsbookMarketUpdatesUnsubscribe(sbkMainMarketId, id);
        }
      }
    }

    return () => {};
  }, [
    cardUrn,
    isIntersecting,
    dispatchExchangeMarketUpdatesSubscribe,
    dispatchExchangeMarketUpdatesUnsubscribe,
    dispatchMainMarketsTransitionsSubscription,
    dispatchSportsbookMarketUpdatesSubscribe,
    dispatchSportsbookMarketUpdatesUnsubscribe,
    displayRunners,
    excMainMarketId,
    fixture,
    sbkMainMarketId,
  ]);

  return (
    <div className={styles.eventMarketCard} ref={ref}>
      <a href={href} onClick={onClick} className={styles.fixtureContainer}>
        <ConnectedFixtureHeader
          component={FixtureHeader}
          fixture={fixture}
          sporteventURN={sporteventURN}
          displayRunners={displayRunners.sportsbook?.runners || displayRunners.exchange?.runners}
          viewMode={ScoreboardViewMode.DEFAULT}
          stickyOnScroll={stickyOnScroll}
          showBottomSeparator={false}
          videoAvailable={videoAvailable}
        />
      </a>
      <span className={styles.eventMarketCardContainer}>
        <ConnectedMarket
          cardUrn={cardUrn}
          displayRunners={displayRunners}
          eventViewLink={eventViewLink}
          runnerViewLinks={runnerViewLinks}
          component={Market}
          sporteventURN={sporteventURN}
          marketPromo={marketPromo}
          template={MarketTemplate.Inline}
          tabLink={tabLink}
          show90MinBlurb={false}
        />
      </span>
    </div>
  );
};

export default EventMarketCard;
