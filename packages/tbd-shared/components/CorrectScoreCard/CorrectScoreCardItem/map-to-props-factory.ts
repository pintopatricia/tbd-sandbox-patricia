import { createSelector, ParametricSelector } from "reselect";
import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import {
  SubscribeSportsbookMarketUpdatesAction,
  SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  UnsubscribeSportsbookMarketUpdatesAction,
  UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
} from "@ppb/tbd-store/actions/sportsbook-markets";
import { createSportsbookMarketByURNSelector } from "@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors";
import { SportsbookMarket } from "@ppb/tbd-store/state/entities/sportsbook-markets/SportsbookMarket.types";
import { MarketRunner } from "@ppb/tbd-store/state/entities/Market.types";

export type ContainerProps = {
  marketUrn: URN;
  runnerUrn: URN;
  cardUrn: URN;
  visible?: boolean;
};

export type CardProps = {
  marketUrn: URN;
  runnerUrn: URN;
  marketId: string;
};

export const createSportsbookMarketRunnerBySelectionIdSelector = (): ParametricSelector<
  SportsbookMarket,
  number,
  MarketRunner | undefined
> =>
  createSelector(
    [
      (sportsbookmarket: SportsbookMarket, selectionId: number) =>
        sportsbookmarket.runners.find((r) => r.selectionId === selectionId),
    ],
    (runner) => runner,
  );

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getSportsbookMarketByURN = createSportsbookMarketByURNSelector();

  return function mapStateToProps(state: ApplicationState, { marketUrn, runnerUrn }: ContainerProps): StateProps {
    const market = getSportsbookMarketByURN(state.entities.sportsbookmarkets, marketUrn);

    if (!market) {
      return {};
    }

    return {
      marketUrn,
      marketId: market.marketId,
      runnerUrn,
    };
  };
};

const dispatchSportsbookMarketUpdatesSubscribe = (marketId: string, subscriberId: string): SubscribeSportsbookMarketUpdatesAction => ({
  type: SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  payload: {
    marketId,
    subscriberId,
  },
});

const dispatchSportsbookMarketUpdatesUnsubscribe = (marketId: string, subscriberId: string): UnsubscribeSportsbookMarketUpdatesAction => ({
  type: UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  payload: {
    marketId,
    subscriberId,
  },
});

export type DispatchProps = {
  dispatchSportsbookMarketUpdatesSubscribe: typeof dispatchSportsbookMarketUpdatesSubscribe;
  dispatchSportsbookMarketUpdatesUnsubscribe: typeof dispatchSportsbookMarketUpdatesUnsubscribe;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchSportsbookMarketUpdatesSubscribe,
  dispatchSportsbookMarketUpdatesUnsubscribe,
};
