import type { ComponentProps } from "react";

import URN from "@ppb/tbd-store/state/layout/URN";
import { DisplayRunners, EventMarketCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { MapStateToPropsFactory } from "react-redux";
import { createSelector } from "reselect";
import { PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
import { isSportsbookMarket } from "@ppb/tbd-store/helpers/markets";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import {
  getSportsbookMarket,
  createSportsbookMarketByURNSelector,
} from "@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors";
import { createIsBrandSettingEnabledSelector } from "@ppb/tbd-store/state/entities/brand-settings/brand-settings-selectors";
import { isBaseFixture } from "@ppb/tbd-store/state/entities/entities-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { SportsbookMarketStatus } from "@ppb/tbd-store";
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
  CouponPrimaryMarketPress,
  UI__NAVIGATE_TO_EVENT_FROM_COUPON_PRIMARY_MARKET,
} from "@ppb/tbd-store/actions/navigation";
import { type Icons, IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { EntityType } from "@ppb/tbd-urn-codecs";

import { getSelectionTypeIcon, SelectionTypeIconVariant } from "../../helpers/selection-type";
import type FixtureHeader from "../FixtureHeader";

const createIconsListSelector = () =>
  createSelector(
    [
      (marketType: string | undefined) => marketType,
      (_marketType: string | undefined, videoAvailable: boolean | undefined) => videoAvailable,
      (
        _marketType: string | undefined,
        _videoAvailable: boolean | undefined,
        isSuperSubEligible: boolean | undefined,
      ) => isSuperSubEligible,
      (
        _marketType: string | undefined,
        _videoAvailable: boolean | undefined,
        _isSuperSubEligible: boolean | undefined,
        showSelectionTypeIcon: boolean,
      ) => showSelectionTypeIcon,
    ],
    (marketType, videoAvailable, isSuperSubEligible, showSelectionTypeIcon): Icons[] => {
      const getSelectionTypeIconName = (isSuperSub = false) =>
        showSelectionTypeIcon
          ? getSelectionTypeIcon(marketType, isSuperSub, SelectionTypeIconVariant.COLORED)
          : undefined;
      const is90Min = marketType === "MATCH_ODDS_90";
      return [
        (is90Min && IconsList.NINETY_MINUTE_PAYOUT) || getSelectionTypeIconName(),
        isSuperSubEligible && getSelectionTypeIconName(isSuperSubEligible),
        videoAvailable && IconsList.LIVE_VIDEO,
      ].filter((icon): icon is Icons => !!icon);
    },
  );

type FixtureHeaderProps = ComponentProps<typeof FixtureHeader>;

export type ContainerProps = {
  urn: URN;
  couponCardGroupUrn: URN;
  visible?: boolean;
};

export type CardProps = {
  fixture: FixtureHeaderProps["fixture"];
  sporteventURN: FixtureHeaderProps["sporteventURN"];
  marketURN: FixtureHeaderProps["marketURN"];
  marketStatus?: SportsbookMarketStatus;
  eventViewLink?: ViewLink;
  isToShowStatsButton: boolean;
  sbkMainMarketId?: string;
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
  const getSportsbookMarketByURN = createSportsbookMarketByURNSelector();
  const isBrandSettingEnabled = createIsBrandSettingEnabledSelector();
  const getIconsList = createIconsListSelector();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const eventMarketCard = getEventMarketCardByURN(state.layouts.cards.eventmarkets, urn);

    if (!eventMarketCard) {
      return {};
    }

    const isToShowStatsButton = !!eventMarketCard.statsPebbleURN;

    const { fixture, eventViewLink, videoAvailable, isSuperSubEligible } = eventMarketCard;
    const displayRunners = eventMarketCard.displayRunners ?? ({} as DisplayRunners);
    const { sportsbook } = displayRunners;

    let sbkMainMarketId;

    if (isBaseFixture(fixture)) {
      const {
        mainMarket: { sportsbook: sportsbookMainMarket },
      } = fixture;

      sbkMainMarketId = sportsbookMainMarket && getSportsbookMarket(state, sportsbookMainMarket).marketId;
    }

    let marketURN: URN | undefined;

    if (sportsbook && isSportsbookMarket(sportsbook.market)) {
      marketURN = sportsbook.market;
    }

    const sportsbookMarket = sportsbook?.market
      ? getSportsbookMarketByURN(state.entities.sportsbookmarkets, sportsbook.market)
      : undefined;

    const iconsList = getIconsList(
      sportsbookMarket?.marketType,
      videoAvailable,
      isSuperSubEligible,
      isBrandSettingEnabled(state, "SHOW_SELECTION_TYPE_ICON"),
    );

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
      sbkMainMarketId,
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
  dispatchSportsbookMarketUpdatesSubscribe: typeof dispatchSportsbookMarketUpdatesSubscribe;
  dispatchSportsbookMarketUpdatesUnsubscribe: typeof dispatchSportsbookMarketUpdatesUnsubscribe;
  dispatchCouponPrimaryMarketPress: typeof dispatchCouponPrimaryMarketPress;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchRouterPushAction,
  dispatchMainMarketsTransitionsSubscription,
  dispatchSportsbookMarketUpdatesSubscribe,
  dispatchSportsbookMarketUpdatesUnsubscribe,
  dispatchCouponPrimaryMarketPress,
};
