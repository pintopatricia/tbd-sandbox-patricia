import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import {
  SubscribeSportsbookMarketUpdatesAction,
  SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  UnsubscribeSportsbookMarketUpdatesAction,
  UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
} from "@ppb/tbd-store/actions/sportsbook-markets";
import { createOddByRunnerUrnSelector } from "@ppb/tbd-store/state/entities/popular-betting-opportunities/popular-betting-opportunities-selectors";
import { createSportsbookDisplayOddsPreferencesSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import { createFormatedOddForPopularBetBuilderSelectionOddVm } from "./popular-bet-builder-selection-odd-view-model";

export type ContainerProps = {
  cardUrn: string;
  isRacing: boolean;
  runnerUrn: string;
  marketId: string;
  visible?: boolean;
};

export type CardProps = {
  odd: string;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getSportsbookDisplayOddsPreferences = createSportsbookDisplayOddsPreferencesSelector();
  const getSelectionOdd = createOddByRunnerUrnSelector();
  const getFormatedSelectionOdd = createFormatedOddForPopularBetBuilderSelectionOddVm();

  return function mapStateToProps(state: ApplicationState, { runnerUrn }: ContainerProps): StateProps {
    const format = getSportsbookDisplayOddsPreferences(state.entities.preferences);
    const odd = getSelectionOdd(state, runnerUrn);

    if (!odd || !format) return {};

    const formatedOdd = getFormatedSelectionOdd({ odd, format });

    if (!formatedOdd) return {};

    return {
      odd: formatedOdd,
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
