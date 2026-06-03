import { FunctionComponent, memo, useEffect, useState, useId } from "react";
import { Pressable, View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { isBaseFixture } from "@ppb/tbd-store/state/entities/entities-selectors";
import { navigate } from "@ppb/tbd-router/native";

import FixtureHeader from "../FixtureHeader/FixtureHeader.native";
import ConnectedFixtureHeader from "../FixtureHeader";
import Red7Scoreboard from "../Red7Scoreboard/Red7Scoreboard.native";

import { ComponentProps } from "./props";
import selectors from "./FixtureCard.native.selectors";

const MemoizedFixtureCard: FunctionComponent<ComponentProps> = memo(
  ({
    dispatchNavigateToEventFromMarketScoreboard,
    eventViewLink,
    eventName,
    cardURN,
    availableToSubscribe,
    fixture,
    sporteventURN,
    viewMode,
    stickyOnScroll,
    showBottomSeparator,
    showEventDateBelow,
    showHorizontalDuration,
  }) => {
    const onPress = (): void => {
      if (eventViewLink) {
        dispatchNavigateToEventFromMarketScoreboard(eventViewLink, eventName);
        navigate(eventViewLink);
      }
    };

    return (
      <View key={`${fixture}-${viewMode}`}>
        <Pressable {...getTestProps(selectors.FIXTURE_CARD, false)} onPress={onPress}>
          <ConnectedFixtureHeader
            fixture={fixture}
            cardURN={cardURN}
            sporteventURN={sporteventURN}
            viewMode={viewMode}
            stickyOnScroll={stickyOnScroll}
            availableToSubscribe={availableToSubscribe}
            showBottomSeparator={showBottomSeparator}
            showEventDateBelow={showEventDateBelow}
            showHorizontalDuration={showHorizontalDuration}
            component={FixtureHeader}
          />
        </Pressable>
      </View>
    );
  },
);
MemoizedFixtureCard.displayName = "MemoizedFixtureCard";

const FixtureCard: FunctionComponent<ComponentProps> = (props) => {
  const {
    cardURN,
    excMainMarketId,
    sbkMainMarketId,
    dispatchMainMarketsTransitionsSubscription,
    dispatchSportsbookMarketUpdatesSubscribe,
    dispatchSportsbookMarketUpdatesUnsubscribe,
    dispatchExchangeMarketUpdatesSubscribe,
    dispatchExchangeMarketUpdatesUnsubscribe,
    fixture,
    visible,
    red7Scoreboard,
  } = props;

  const [showRed7Scoreboard, setShowRed7Scoreboard] = useState<boolean>(!!red7Scoreboard?.fullURL);
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
    if (isBaseFixture(fixture)) {
      const {
        mainMarket: { exchange: exchangeMainMarketUrn, sportsbook: sportsbookMainMarketUrn },
      } = fixture;
      const mainMarketUrns = [
        ...(exchangeMainMarketUrn ? [exchangeMainMarketUrn] : []),
        ...(sportsbookMainMarketUrn ? [sportsbookMainMarketUrn] : []),
      ];
      const withFixtureUpdates = true;

      if (mainMarketUrns.length) {
        dispatchMainMarketsTransitionsSubscription(cardURN, mainMarketUrns, withFixtureUpdates);
      }

      if (excMainMarketId) {
        if (visible) {
          dispatchExchangeMarketUpdatesSubscribe(excMainMarketId);
        } else {
          dispatchExchangeMarketUpdatesUnsubscribe(excMainMarketId);
        }
      }
      if (sbkMainMarketId) {
        if (visible) {
          dispatchSportsbookMarketUpdatesSubscribe(sbkMainMarketId, id);
        } else {
          dispatchSportsbookMarketUpdatesUnsubscribe(sbkMainMarketId, id);
        }
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
    fixture,
    sbkMainMarketId,
    visible,
  ]);
  return showRed7Scoreboard ? (
    <Red7Scoreboard red7Scoreboard={red7Scoreboard} setShowRed7Scoreboard={setShowRed7Scoreboard} />
  ) : (
    <MemoizedFixtureCard {...props} />
  );
};

export default FixtureCard;
