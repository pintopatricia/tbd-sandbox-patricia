import { FunctionComponent, MouseEvent, useCallback, useEffect, useState, useId } from "react";
import classnames from "classnames";

import { isBaseFixture } from "@ppb/tbd-store/state/entities/entities-selectors";

import ConnectedFixtureHeader from "../FixtureHeader";
import FixtureHeader from "../FixtureHeader/FixtureHeader.web";

import { ComponentProps } from "./props";
import styles from "./FixtureCard.web.css";
import Red7Scoreboard from "../Red7Scoreboard/Red7Scoreboard.web";

const FixtureCard: FunctionComponent<ComponentProps> = ({
  dispatchNavigateToEventFromMarketScoreboard,
  dispatchPushAction,
  eventViewLink,
  eventName,
  cardURN,
  excMainMarketId,
  sbkMainMarketId,
  dispatchMainMarketsTransitionsSubscription,
  dispatchSportsbookMarketUpdatesSubscribe,
  dispatchSportsbookMarketUpdatesUnsubscribe,
  dispatchExchangeMarketUpdatesSubscribe,
  dispatchExchangeMarketUpdatesUnsubscribe,
  red7Scoreboard,
  ...props
}) => {
  const isDisabledLink = !eventViewLink;
  const [showRed7Scoreboard, setShowRed7Scoreboard] = useState<boolean>(!!red7Scoreboard?.fullURL);

  const linkStyle = classnames(styles.fixtureCard, { [styles.disabledLink]: isDisabledLink });
  const href = eventViewLink?.viewUrl;
  const onClick = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();

      if (!isDisabledLink) {
        dispatchNavigateToEventFromMarketScoreboard(eventViewLink, eventName);
        dispatchPushAction(eventViewLink);
      }
    },
    [isDisabledLink, dispatchNavigateToEventFromMarketScoreboard, eventViewLink, eventName, dispatchPushAction],
  );

  const id = useId();
  useEffect(() => {
    if (excMainMarketId && sbkMainMarketId) {
      return () => {
        dispatchSportsbookMarketUpdatesUnsubscribe(sbkMainMarketId, id);
        dispatchExchangeMarketUpdatesUnsubscribe(excMainMarketId);
      };
    }
    if (excMainMarketId) {
      return () => {
        dispatchExchangeMarketUpdatesUnsubscribe(excMainMarketId);
      };
    }

    if (sbkMainMarketId) {
      return () => {
        dispatchSportsbookMarketUpdatesUnsubscribe(sbkMainMarketId, id);
      };
    }

    return () => {};
  }, [
    dispatchExchangeMarketUpdatesUnsubscribe,
    dispatchSportsbookMarketUpdatesUnsubscribe,
    excMainMarketId,
    sbkMainMarketId,
  ]);

  useEffect(() => {
    /**
     * If it's baseFixture, we'll subscribe the main-markets-monitor-saga with withFixtureUpdates = true to request
     * main markets inside fixture updates in order to have inplay status updates.
     *
     * As these main markets are not displayed and therefore won't be subscribed to the market updates sagas by the
     * sportsbookMarket and exchangeMarket components, we have to subscribe them in this useEffect
     */
    if (isBaseFixture(props.fixture)) {
      const {
        mainMarket: { exchange: exchangeMainMarketUrn, sportsbook: sportsbookMainMarketUrn },
      } = props.fixture;
      const mainMarketUrns = [
        ...(exchangeMainMarketUrn ? [exchangeMainMarketUrn] : []),
        ...(sportsbookMainMarketUrn ? [sportsbookMainMarketUrn] : []),
      ];
      const withFixtureUpdates = true;

      if (mainMarketUrns.length) {
        dispatchMainMarketsTransitionsSubscription(cardURN, mainMarketUrns, withFixtureUpdates);
      }

      if (excMainMarketId) {
        dispatchExchangeMarketUpdatesSubscribe(excMainMarketId);
      }
      if (sbkMainMarketId) {
        dispatchSportsbookMarketUpdatesSubscribe(sbkMainMarketId, id);
      }
    }
  }, [
    cardURN,
    dispatchExchangeMarketUpdatesSubscribe,
    dispatchExchangeMarketUpdatesUnsubscribe,
    dispatchMainMarketsTransitionsSubscription,
    dispatchSportsbookMarketUpdatesSubscribe,
    dispatchSportsbookMarketUpdatesUnsubscribe,
    excMainMarketId,
    props.fixture,
    sbkMainMarketId,
  ]);

  return showRed7Scoreboard ? (
    <Red7Scoreboard red7Scoreboard={red7Scoreboard} setShowRed7Scoreboard={setShowRed7Scoreboard} />
  ) : (
    <a href={href} onClick={onClick} className={linkStyle}>
      <ConnectedFixtureHeader
        fixture={props.fixture}
        sporteventURN={props.sporteventURN}
        viewMode={props.viewMode}
        stickyOnScroll={props.stickyOnScroll}
        showBottomSeparator={props.showBottomSeparator}
        showEventDateBelow={props.showEventDateBelow}
        showHorizontalDuration={props.showHorizontalDuration}
        component={FixtureHeader}
      />
    </a>
  );
};

export default FixtureCard;
