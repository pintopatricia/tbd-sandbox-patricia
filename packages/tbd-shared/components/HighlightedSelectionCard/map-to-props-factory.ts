import { MapStateToPropsFactory } from "react-redux";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { HighlightedSelectionCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import {
  SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  SubscribeSportsbookMarketUpdatesAction,
  UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  UnsubscribeSportsbookMarketUpdatesAction,
} from "@ppb/tbd-store/actions/sportsbook-markets";
import { createSportsbookMarketByURNSelector } from "@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors";
import { createSportsbookRunnerStatusSelector } from "@ppb/tbd-store/state/entities/sportsbook-runners/sportsbook-runner-selectors";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";

export type ContainerProps = {
  urn: URN;
  visible?: boolean;
};

export type CardProps = {
  isMarketClosed: boolean;
  marketId: string;
  runnerUrn: URN;
  marketUrn: URN;
  betButtondisplayPreviousOdd: boolean;
  title: string;
  urn: URN;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getHighlightedSelectionCard = createCardByURNSelector<HighlightedSelectionCards, URN>();
  const getSportsbookMarketByURN = createSportsbookMarketByURNSelector();
  const getSportsbookRunnerStatusSelector = createSportsbookRunnerStatusSelector();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const highlightedSelectionCard = getHighlightedSelectionCard(state.layouts.cards.highlightedselections, urn);

    if (!highlightedSelectionCard) {
      return {};
    }

    const market = getSportsbookMarketByURN(state.entities.sportsbookmarkets, highlightedSelectionCard.market);

    if (!market) {
      return {};
    }

    const { marketId, urn: marketUrn, status } = market;

    const runnerUrn = highlightedSelectionCard.runner;

    const runnerStatus = getSportsbookRunnerStatusSelector(state.entities.sportsbookrunners, runnerUrn);

    return {
      isMarketClosed: status === "CLOSED" || runnerStatus === "REMOVED",
      marketId,
      runnerUrn,
      marketUrn,
      betButtondisplayPreviousOdd: highlightedSelectionCard.displayPreviousOdd,
      title: highlightedSelectionCard.title,
      urn,
    };
  };
};

const dispatchMarketUpdatesSubscribe = (
  marketId: string,
  subscriberId: string,
  visible?: boolean,
): SubscribeSportsbookMarketUpdatesAction | UnsubscribeSportsbookMarketUpdatesAction => ({
  type: visible ? SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES : UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  payload: { marketId, subscriberId },
});

const dispatchMarketUpdatesUnsubscribe = (marketId: string, subscriberId: string): UnsubscribeSportsbookMarketUpdatesAction => ({
  type: UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  payload: {
    marketId,
    subscriberId,
  },
});

export type DispatchProps = {
  dispatchMarketUpdatesSubscribe: typeof dispatchMarketUpdatesSubscribe;
  dispatchMarketUpdatesUnsubscribe: typeof dispatchMarketUpdatesUnsubscribe;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchMarketUpdatesSubscribe,
  dispatchMarketUpdatesUnsubscribe,
};
