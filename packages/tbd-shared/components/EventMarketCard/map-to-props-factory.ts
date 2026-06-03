import { MapStateToPropsFactory } from "react-redux";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { BaseFixture } from "@ppb/tbd-store/state/entities/BaseFixture.types";
import {
  DisplayRunners,
  EventMarketCards,
  MarketBlurbPromotion,
  RunnerViewLinks,
  TabLink,
} from "@ppb/tbd-store/state/layout/cards/Card.types";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import {
  SUBSCRIBE_MAIN_MARKET_TRANSITIONS,
  SubscribeMainMarketTransitions,
} from "@ppb/tbd-store/actions/market-transitions";
import {
  SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  SubscribeSportsbookMarketUpdatesAction,
  UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  UnsubscribeSportsbookMarketUpdatesAction,
} from "@ppb/tbd-store/actions/sportsbook-markets";
import {
  SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
  SubscribeExchangeMarketUpdatesAction,
  UNSUBSCRIBE_EXCHANGE_MARKET_UPDATES,
  UnsubscribeExchangeMarketUpdatesAction,
} from "@ppb/tbd-store/actions/exchange-markets";
import { getSportsbookMarket } from "@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors";
import { createExchangeMarketSelector } from "@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors";
import { isBaseFixture } from "@ppb/tbd-store/state/entities/entities-selectors";
import { NavigateToEventFromSport, UI__NAVIGATE_TO_EVENT_FROM_SPORT } from "@ppb/tbd-store/actions/navigation";

export type CardProps = {
  fixture: URN | BaseFixture;
  fixtureURN: URN;
  sporteventURN: URN;
  eventViewLink: ViewLink;
  runnerViewLinks: RunnerViewLinks;
  stickyOnScroll: boolean;
  excMainMarketId?: string;
  sbkMainMarketId?: string;
  cardUrn: URN;
  displayRunners: DisplayRunners;
  marketPromo?: MarketBlurbPromotion;
  videoAvailable: boolean;
  tabLink?: TabLink;
};

export type StateProps = CardProps | Record<string, never>;

export type ContainerProps = { urn: URN; visible: boolean };

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getEventMarketCardByURN = createCardByURNSelector<EventMarketCards, URN>();
  const getExchangeMarketByURN = createExchangeMarketSelector();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const eventMarketCard = getEventMarketCardByURN(state.layouts.cards.eventmarkets, urn);
    if (!eventMarketCard) {
      return {};
    }

    const {
      eventViewLink,
      runnerViewLinks,
      displayRunners,
      fixture,
      sportevent,
      marketPromo,
      videoAvailable,
      tabLink,
    } = eventMarketCard;

    const fixtureURN = isBaseFixture(fixture) ? fixture.urn : fixture;

    let excMainMarketId;
    let sbkMainMarketId;

    if (isBaseFixture(fixture)) {
      const {
        mainMarket: { exchange, sportsbook },
      } = fixture;

      excMainMarketId = exchange && getExchangeMarketByURN(state.entities.exchangemarkets, exchange)?.marketId;
      sbkMainMarketId = sportsbook && getSportsbookMarket(state, sportsbook).marketId;
    }

    return {
      fixture,
      fixtureURN,
      sporteventURN: sportevent,
      stickyOnScroll: false,
      cardUrn: urn,
      displayRunners,
      eventViewLink,
      runnerViewLinks,
      excMainMarketId,
      sbkMainMarketId,
      marketPromo,
      videoAvailable,
      tabLink,
    };
  };
};

const dispatchClickCardAction = (
  cardUrn: URN,
  fixtureURN: URN,
  sportEventURN: URN,
  href: string,
): NavigateToEventFromSport => ({
  type: UI__NAVIGATE_TO_EVENT_FROM_SPORT,
  payload: {
    cardUrn,
    href,
    fixtureURN,
    sportEventURN,
    type: "primary swimlane",
  },
});

const dispatchPushAction = (viewLink: ViewLink): PushAction => ({
  type: PUSH,
  payload: viewLink,
});

const dispatchMainMarketsTransitionsSubscription = (
  cardURN: URN,
  marketURNs: URN[],
  withFixtureUpdates?: boolean,
): SubscribeMainMarketTransitions => ({
  type: SUBSCRIBE_MAIN_MARKET_TRANSITIONS,
  payload: {
    cardURN,
    marketURNs,
    withFixtureUpdates,
  },
});

const dispatchSportsbookMarketUpdatesSubscribe = (
  marketId: string,
  subscriberId: string,
): SubscribeSportsbookMarketUpdatesAction => ({
  type: SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  payload: {
    marketId,
    subscriberId,
  },
});

const dispatchSportsbookMarketUpdatesUnsubscribe = (
  marketId: string,
  subscriberId: string,
): UnsubscribeSportsbookMarketUpdatesAction => ({
  type: UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  payload: {
    marketId,
    subscriberId,
  },
});

const dispatchExchangeMarketUpdatesSubscribe = (marketId: string): SubscribeExchangeMarketUpdatesAction => ({
  type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
  payload: { marketId },
});

const dispatchExchangeMarketUpdatesUnsubscribe = (marketId: string): UnsubscribeExchangeMarketUpdatesAction => ({
  type: UNSUBSCRIBE_EXCHANGE_MARKET_UPDATES,
  payload: {
    marketId,
  },
});

export type DispatchProps = {
  dispatchClickCardAction: typeof dispatchClickCardAction;
  dispatchPushAction: typeof dispatchPushAction;
  dispatchMainMarketsTransitionsSubscription: typeof dispatchMainMarketsTransitionsSubscription;
  dispatchSportsbookMarketUpdatesSubscribe: typeof dispatchSportsbookMarketUpdatesSubscribe;
  dispatchSportsbookMarketUpdatesUnsubscribe: typeof dispatchSportsbookMarketUpdatesUnsubscribe;
  dispatchExchangeMarketUpdatesSubscribe: typeof dispatchExchangeMarketUpdatesSubscribe;
  dispatchExchangeMarketUpdatesUnsubscribe: typeof dispatchExchangeMarketUpdatesUnsubscribe;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchClickCardAction,
  dispatchPushAction,
  dispatchMainMarketsTransitionsSubscription,
  dispatchSportsbookMarketUpdatesSubscribe,
  dispatchSportsbookMarketUpdatesUnsubscribe,
  dispatchExchangeMarketUpdatesSubscribe,
  dispatchExchangeMarketUpdatesUnsubscribe,
};
