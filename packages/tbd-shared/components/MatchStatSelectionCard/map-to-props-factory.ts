import { MapStateToPropsFactory } from "react-redux";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { MatchStatSelectionCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
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

export type CardTitleProps = {
  playerNames: string[];
  combiner: string;
};

export type CardProps = {
  isMarketClosed: boolean;
  marketId: string;
  runnerUrn: URN;
  marketUrn: URN;
  incidentType: string | null;
  title: CardTitleProps;
  subtitle: string;
  statsDescription: string | null;
  urn: URN;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getMatchStatSelectionCard = createCardByURNSelector<MatchStatSelectionCards, URN>();
  const getSportsbookMarketByURN = createSportsbookMarketByURNSelector();
  const getSportsbookRunnerStatusSelector = createSportsbookRunnerStatusSelector();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const matchStatSelectionCard = getMatchStatSelectionCard(state.layouts.cards.matchstatselections, urn);

    if (!matchStatSelectionCard) {
      return {};
    }

    const market = getSportsbookMarketByURN(state.entities.sportsbookmarkets, matchStatSelectionCard.market);

    if (!market) {
      return {};
    }

    const { marketId, urn: marketUrn, status } = market;

    const runnerUrn = matchStatSelectionCard.runner;

    const runnerStatus = getSportsbookRunnerStatusSelector(state.entities.sportsbookrunners, runnerUrn);

    return {
      isMarketClosed: status === "CLOSED" || runnerStatus === "REMOVED",
      marketId,
      runnerUrn,
      marketUrn,
      title: matchStatSelectionCard.matchStatTitle ?? { playerNames: [], combiner: "" },
      subtitle: matchStatSelectionCard.matchStatSubtitle,
      statsDescription: matchStatSelectionCard.statsDescription ?? null,
      incidentType: matchStatSelectionCard.incidentType ?? null,
      urn,
    };
  };
};

const dispatchMarketUpdatesSubscribe = (
  marketId: string,
  visible?: boolean,
): SubscribeSportsbookMarketUpdatesAction | UnsubscribeSportsbookMarketUpdatesAction => ({
  type: visible ? SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES : UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  payload: { marketId, subscriberId: "matchStatsSelectionCard" },
});

const dispatchMarketUpdatesUnsubscribe = (marketId: string): UnsubscribeSportsbookMarketUpdatesAction => ({
  type: UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  payload: {
    marketId,
    subscriberId: "matchStatsSelectionCard",
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
