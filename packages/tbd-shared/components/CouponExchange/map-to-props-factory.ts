import type { ComponentProps } from "react";

import URN from "@ppb/tbd-store/state/layout/URN";
import { DisplayRunners, EventMarketCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { MapStateToPropsFactory } from "react-redux";
import { createSelector } from "reselect";
import { PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
import { isExchangeMarket } from "@ppb/tbd-store/helpers/markets";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { createExchangeMarketSelector } from "@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors";
import { isBaseFixture } from "@ppb/tbd-store/state/entities/entities-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { ExchangeMarketStatus } from "@ppb/tbd-store/state/entities/exchange-markets/ExchangeMarket.types";
import {
  SUBSCRIBE_MAIN_MARKET_TRANSITIONS,
  SubscribeMainMarketTransitions,
} from "@ppb/tbd-store/actions/market-transitions";
import {
  SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
  SubscribeExchangeMarketUpdatesAction,
  UNSUBSCRIBE_EXCHANGE_MARKET_UPDATES,
  UnsubscribeExchangeMarketUpdatesAction,
} from "@ppb/tbd-store/actions/exchange-markets";
import {
  CouponPrimaryMarketPress,
  UI__NAVIGATE_TO_EVENT_FROM_COUPON_PRIMARY_MARKET,
} from "@ppb/tbd-store/actions/navigation";
import { IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { EntityType } from "@ppb/tbd-urn-codecs";

import type FixtureHeader from "../FixtureHeader";

type FixtureHeaderProps = ComponentProps<typeof FixtureHeader>;

const createIconsListSelector = () =>
  createSelector([(videoAvailable: boolean) => videoAvailable], (videoAvailable): (typeof IconsList.LIVE_VIDEO)[] =>
    videoAvailable ? [IconsList.LIVE_VIDEO] : [],
  );

export type ContainerProps = {
  urn: URN;
  couponCardGroupUrn: URN;
  visible?: boolean;
};

export type CardProps = {
  fixture: FixtureHeaderProps["fixture"];
  sporteventURN: FixtureHeaderProps["sporteventURN"];
  marketURN: FixtureHeaderProps["marketURN"];
  marketStatus?: ExchangeMarketStatus;
  eventViewLink?: ViewLink;
  isToShowStatsButton: boolean;
  excMainMarketId?: string;
  cardUrn: URN;
  fixtureViewMode: FixtureHeaderProps["viewMode"];
  displayRunners: DisplayRunners;
  videoAvailable: FixtureHeaderProps["videoAvailable"];
  iconsList: FixtureHeaderProps["iconsList"];
  statsPebbleURN?: URN;
  showHorizontalDuration?: boolean;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getEventMarketCardByURN = createCardByURNSelector<EventMarketCards, URN>();
  const getExchangeMarketByURN = createExchangeMarketSelector();
  const getIconsList = createIconsListSelector();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const eventMarketCard = getEventMarketCardByURN(state.layouts.cards.eventmarkets, urn);

    if (!eventMarketCard) {
      return {};
    }

    const isToShowStatsButton = !!eventMarketCard.statsPebbleURN;

    const { fixture, eventViewLink, videoAvailable } = eventMarketCard;
    const displayRunners = eventMarketCard.displayRunners ?? ({} as DisplayRunners);
    const { exchange } = displayRunners;

    let excMainMarketId;

    if (isBaseFixture(fixture)) {
      const {
        mainMarket: { exchange: exchangeMainMarket },
      } = fixture;

      excMainMarketId =
        exchangeMainMarket && getExchangeMarketByURN(state.entities.exchangemarkets, exchangeMainMarket)?.marketId;
    }

    let marketURN: URN | undefined;

    if (exchange && isExchangeMarket(exchange.market)) {
      marketURN = exchange.market;
    }

    const iconsList = getIconsList(!!videoAvailable);

    const { currentView } = state.router;
    const isMybetsView = currentView === EntityType.MyBetsView;

    const showHorizontalDuration = !!state.entities.brandSettings?.HORIZONTAL_COUPON && !isMybetsView;

    return {
      fixture,
      sporteventURN: eventMarketCard.sportevent,
      marketURN,
      cardUrn: urn,
      displayRunners,
      isToShowStatsButton,
      excMainMarketId,
      eventViewLink,
      fixtureViewMode: ScoreboardViewMode.COUPON,
      videoAvailable,
      iconsList,
      statsPebbleURN: eventMarketCard?.statsPebbleURN,
      showHorizontalDuration,
    };
  };
};

const dispatchRouterPushAction = (viewLink: ViewLink): PushAction => ({
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

const dispatchExchangeMarketUpdatesSubscribe = (marketId: string): SubscribeExchangeMarketUpdatesAction => ({
  type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
  payload: {
    marketId,
  },
});

const dispatchExchangeMarketUpdatesUnsubscribe = (marketId: string): UnsubscribeExchangeMarketUpdatesAction => ({
  type: UNSUBSCRIBE_EXCHANGE_MARKET_UPDATES,
  payload: {
    marketId,
  },
});

const dispatchCouponPrimaryMarketPress = (
  couponCardGroupUrn: URN,
  sporteventURN: URN,
  href: string,
): CouponPrimaryMarketPress => ({
  type: UI__NAVIGATE_TO_EVENT_FROM_COUPON_PRIMARY_MARKET,
  payload: {
    couponCardGroupUrn,
    sporteventURN,
    href,
  },
});

export type DispatchProps = {
  dispatchRouterPushAction: typeof dispatchRouterPushAction;
  dispatchMainMarketsTransitionsSubscription: typeof dispatchMainMarketsTransitionsSubscription;
  dispatchExchangeMarketUpdatesSubscribe: typeof dispatchExchangeMarketUpdatesSubscribe;
  dispatchExchangeMarketUpdatesUnsubscribe: typeof dispatchExchangeMarketUpdatesUnsubscribe;
  dispatchCouponPrimaryMarketPress: typeof dispatchCouponPrimaryMarketPress;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchRouterPushAction,
  dispatchMainMarketsTransitionsSubscription,
  dispatchExchangeMarketUpdatesSubscribe,
  dispatchExchangeMarketUpdatesUnsubscribe,
  dispatchCouponPrimaryMarketPress,
};
