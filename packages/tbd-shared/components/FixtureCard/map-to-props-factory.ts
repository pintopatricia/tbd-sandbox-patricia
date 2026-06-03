import { MapStateToPropsFactory } from "react-redux";
// Types
import URN from "@ppb/tbd-store/state/layout/URN";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { FixtureCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { BaseFixture } from "@ppb/tbd-store/state/entities/BaseFixture.types";
// Components
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
// Store
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import { UI__NAVIGATE_TO_EVENT_FROM_MARKET_SCOREBOARD } from "@ppb/tbd-store/actions/navigation";
import {
  SUBSCRIBE_MAIN_MARKET_TRANSITIONS,
  SubscribeMainMarketTransitions,
} from "@ppb/tbd-store/actions/market-transitions";
import { createSportEventByURNSelector } from "@ppb/tbd-store/state/entities/sport-events/sport-event-selectors";
import { getSportsbookMarket } from "@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors";
import { createExchangeMarketSelector } from "@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { isBaseFixture } from "@ppb/tbd-store/state/entities/entities-selectors";
import { Jurisdiction } from "@ppb/tbd-store/state/constants";
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
import { UserDetails } from "@ppb/tbd-store";
// Codecs
import { EntityType } from "@ppb/tbd-urn-codecs";
// Football Fixture
import { ContainerProps as FootballFixtureProps } from "../FootballFixture/map-to-props-factory";
import { Red7ScoreboardData } from "../Red7Scoreboard/types";

export type ContainerProps = {
  clickable?: boolean;
  visible?: boolean;
} & FootballFixtureProps;

export type CardProps = {
  fixture: URN | BaseFixture;
  sporteventURN: URN;
  viewMode: ScoreboardViewMode;
  stickyOnScroll: boolean | undefined;
  eventViewLink?: ViewLink;
  eventName: string;
  cardURN: URN;
  excMainMarketId?: string;
  sbkMainMarketId?: string;
  availableToSubscribe?: boolean;
  showBottomSeparator?: boolean;
  showEventDateBelow?: boolean;
  red7Scoreboard: Red7ScoreboardData;
  showHorizontalDuration?: boolean;
};

export type StateProps = CardProps | Record<string, never>;
export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getFixtureCardbyURN = createCardByURNSelector<FixtureCards, URN>();
  const getSportEventByURN = createSportEventByURNSelector();
  const getExchangeMarketByURN = createExchangeMarketSelector();

  // TODO: This should be removed when #735134 is picked.
  // This variable needs to be declared here to prevent the component from being rerendered when market graphs is open and then cloded.
  // Rerendering the component would restart the viz and/or video having an impact on user experience.
  let isRunnerView: boolean;
  /**
   * Map global state to component local state
   *
   * @param state The application state
   * @param urn The connected component input URN
   * @returns Component local state
   */
  return function mapStateToProps(state: ApplicationState, { urn, showBottomSeparator }: ContainerProps): StateProps {
    const fixtureCard = getFixtureCardbyURN(state.layouts.cards.fixtures, urn);

    const { currentView } = state.router;
    const isMarketView = currentView === EntityType.MarketView;
    const isPlayerView = currentView === EntityType.PlayerView;

    if (!fixtureCard) return {};

    const { fixture, sportevent, eventViewLink, availableToSubscribe, red7Scoreboard } = fixtureCard;

    let userDetails;
    try {
      userDetails = <UserDetails>getUserDetails(state);
    } catch (e) {
      console.error(e);
      return {};
    }

    // TODO: scoreboardViewMode, stickyOnScroll and viewMode should not be set here.
    // There is an US (#735134) to tackle this on BFF if possible or move this logic to a proper place.
    // Currently, this is added here to allow ConnectedFixtureCard to have the same API as the ConnectedCard.
    // marketgraphs view will be deprecated on BFF so we should use runner view instead.
    if (isRunnerView === undefined) {
      isRunnerView = state.layouts.views?.runner && Object.keys(state.layouts.views.runner).length > 0;
    }

    const isStatisticsView =
      state.layouts.views?.generic &&
      Object.keys(state.layouts.views.generic).some((genericViewUrn) =>
        genericViewUrn.includes(EntityType.StatisticsView),
      );
    const sportEvent = getSportEventByURN(state.entities.sportevents, sportevent);

    let excMainMarketId;
    let sbkMainMarketId;
    let scoreboardViewMode;
    let stickyOnScroll;

    //MyBets has an independent component to prevent layout breaking when navigating between views.
    if (isPlayerView) {
      scoreboardViewMode = ScoreboardViewMode.DEFAULT;
      showBottomSeparator = false;
      stickyOnScroll = false;
    } else {
      scoreboardViewMode = isMarketView || isRunnerView ? ScoreboardViewMode.SMALL : ScoreboardViewMode.DEFAULT;
      stickyOnScroll = !(isRunnerView || isStatisticsView);
    }

    if (isBaseFixture(fixture)) {
      const {
        mainMarket: { exchange, sportsbook },
      } = fixture;

      excMainMarketId = exchange && getExchangeMarketByURN(state.entities.exchangemarkets, exchange)?.marketId;
      sbkMainMarketId = sportsbook && getSportsbookMarket(state, sportsbook).marketId;
    }

    const showHorizontalDuration = state.entities.brandSettings?.HORIZONTAL_COUPON;

    return {
      fixture,
      sporteventURN: sportevent,
      viewMode: scoreboardViewMode,
      stickyOnScroll,
      eventViewLink: eventViewLink ?? undefined,
      eventName: sportEvent?.name ?? "",
      cardURN: urn,
      excMainMarketId,
      sbkMainMarketId,
      availableToSubscribe,
      showBottomSeparator,
      showEventDateBelow: userDetails.jurisdiction.jurisdiction === Jurisdiction.BRAZIL,
      red7Scoreboard,
      showHorizontalDuration,
    };
  };
};

const dispatchNavigateToEventFromMarketScoreboard = (
  viewLink: ViewLink,
  text: string,
): { payload: { text: string; url: string }; type: string } => ({
  type: UI__NAVIGATE_TO_EVENT_FROM_MARKET_SCOREBOARD,
  payload: { url: viewLink.viewUrl, text },
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
  dispatchNavigateToEventFromMarketScoreboard: typeof dispatchNavigateToEventFromMarketScoreboard;
  dispatchPushAction: typeof dispatchPushAction;
  dispatchMainMarketsTransitionsSubscription: typeof dispatchMainMarketsTransitionsSubscription;
  dispatchSportsbookMarketUpdatesSubscribe: typeof dispatchSportsbookMarketUpdatesSubscribe;
  dispatchSportsbookMarketUpdatesUnsubscribe: typeof dispatchSportsbookMarketUpdatesUnsubscribe;
  dispatchExchangeMarketUpdatesSubscribe: typeof dispatchExchangeMarketUpdatesSubscribe;
  dispatchExchangeMarketUpdatesUnsubscribe: typeof dispatchExchangeMarketUpdatesUnsubscribe;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchNavigateToEventFromMarketScoreboard,
  dispatchPushAction,
  dispatchMainMarketsTransitionsSubscription,
  dispatchSportsbookMarketUpdatesSubscribe,
  dispatchSportsbookMarketUpdatesUnsubscribe,
  dispatchExchangeMarketUpdatesSubscribe,
  dispatchExchangeMarketUpdatesUnsubscribe,
};
