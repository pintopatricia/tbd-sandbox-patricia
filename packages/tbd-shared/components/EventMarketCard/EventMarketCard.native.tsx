import { FunctionComponent, useCallback, useEffect, memo, useId } from "react";
import { Pressable, View } from "react-native";
import { ShadowedView } from "react-native-fast-shadow";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
import { isBaseFixture } from "@ppb/tbd-store/state/entities/entities-selectors";
import { MarketTemplate } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { navigate } from "@ppb/tbd-router/native";
import ConnectedMarket from "../Market";
import { Market } from "../Market/Market.native";
import {
  EVENT_MARKET_CARD,
  EVENT_MARKET_CARD_HEADER,
  EVENT_MARKET_CARD_SHADOW,
  EVENT_MARKET_CARD_CONTAINER,
} from "./EventMarketCard.native.selectors";
import styles from "./EventMarketCard.native.styles";
import { ComponentProps } from "./props";
import FixtureHeader from "../FixtureHeader/FixtureHeader.native";
import ConnectedFixtureHeader from "../FixtureHeader";

type MemoizedProps = ComponentProps & {
  onPress: () => void;
};

const MemoizedEventMarketCard: FunctionComponent<MemoizedProps> = memo(
  ({
    fixture,
    sporteventURN,
    cardUrn,
    displayRunners,
    eventViewLink,
    runnerViewLinks,
    marketPromo,
    stickyOnScroll,
    videoAvailable,
    onPress,
    visible,
    tabLink,
  }) => (
    <ShadowedView {...getTestProps(EVENT_MARKET_CARD_SHADOW, false)} style={styles.dropShadow}>
      <View {...getTestProps(EVENT_MARKET_CARD, false)} style={styles.eventMarketCard}>
        <Pressable {...getTestProps(EVENT_MARKET_CARD_HEADER, false)} onPress={onPress} style={styles.header}>
          <ConnectedFixtureHeader
            component={FixtureHeader}
            cardURN={cardUrn}
            fixture={fixture}
            displayRunners={displayRunners.sportsbook?.runners || displayRunners.exchange?.runners}
            sporteventURN={sporteventURN}
            viewMode={ScoreboardViewMode.DEFAULT}
            stickyOnScroll={stickyOnScroll}
            videoAvailable={videoAvailable}
            showBottomSeparator={false}
          />
        </Pressable>
        <View {...getTestProps(EVENT_MARKET_CARD_CONTAINER, false)} style={styles.container}>
          <ConnectedMarket
            cardUrn={cardUrn}
            displayRunners={displayRunners}
            eventViewLink={eventViewLink}
            runnerViewLinks={runnerViewLinks}
            component={Market}
            marketPromo={marketPromo}
            template={MarketTemplate.Inline}
            sporteventURN={sporteventURN}
            show90MinBlurb={false}
            visible={visible}
            tabLink={tabLink}
          />
        </View>
      </View>
    </ShadowedView>
  ),
);
MemoizedEventMarketCard.displayName = "MemoizedEventMarketCard";

const EventMarketCard: FunctionComponent<ComponentProps> = (props) => {
  const {
    fixture,
    fixtureURN,
    sporteventURN,
    cardUrn,
    displayRunners,
    eventViewLink,
    dispatchClickCardAction,
    excMainMarketId,
    sbkMainMarketId,
    visible,
    dispatchMainMarketsTransitionsSubscription,
    dispatchSportsbookMarketUpdatesSubscribe,
    dispatchSportsbookMarketUpdatesUnsubscribe,
    dispatchExchangeMarketUpdatesSubscribe,
    dispatchExchangeMarketUpdatesUnsubscribe,
  } = props;
  const href = eventViewLink?.viewUrl;

  const onPress = useCallback((): void => {
    dispatchClickCardAction(cardUrn, fixtureURN, sporteventURN, href);
    navigate(eventViewLink);
  }, [cardUrn, dispatchClickCardAction, eventViewLink, fixtureURN, href, sporteventURN]);
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
      const withFixtureUpdates = true;

      if (mainMarketUrns.length) {
        dispatchMainMarketsTransitionsSubscription(cardUrn, mainMarketUrns, withFixtureUpdates);
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
    cardUrn,
    dispatchMainMarketsTransitionsSubscription,
    displayRunners,
    dispatchSportsbookMarketUpdatesUnsubscribe,
    dispatchExchangeMarketUpdatesUnsubscribe,
    fixture,
    excMainMarketId,
    sbkMainMarketId,
    dispatchExchangeMarketUpdatesSubscribe,
    dispatchSportsbookMarketUpdatesSubscribe,
    visible,
  ]);

  return <MemoizedEventMarketCard onPress={onPress} {...props} />;
};

export default EventMarketCard;
