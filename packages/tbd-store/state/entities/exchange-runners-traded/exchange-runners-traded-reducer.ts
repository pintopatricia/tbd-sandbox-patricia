import { ExchangeRunnersTraded } from "./ExchangeRunnerTraded.types";
import {
  UnsubscribeExchangeMarketUpdatesAction,
  FETCH_MARKET_GRAPH_SUCCESS,
  FetchMarketGraphSuccessAction,
} from "../../../actions/exchange-markets";

import { FetchCatalogueSuccessAction, FETCH_CATALOGUE_SUCCESS } from "../../../actions/catalogue";

type ActionTypes = FetchMarketGraphSuccessAction | UnsubscribeExchangeMarketUpdatesAction | FetchCatalogueSuccessAction;

/**
 * Exchange runners traded reducer
 */
export default (currentState: undefined | ExchangeRunnersTraded, action: ActionTypes): ExchangeRunnersTraded => {
  const state = currentState || {};

  switch (action.type) {
    case FETCH_MARKET_GRAPH_SUCCESS: {
      return {
        ...state,
        [action.payload.urn]: {
          ...state[action.payload.urn],
          ...action.payload,
        },
      };
    }
    case FETCH_CATALOGUE_SUCCESS: {
      const entities = action.payload.data.RunnerMarketGraph || [];

      return entities.reduce<ExchangeRunnersTraded>(
        (acc, runner) => ({
          ...acc,
          [runner.urn]: {
            ...state[runner.urn],
            ...runner,
          },
        }),
        { ...state },
      );
    }
    default:
      return state;
  }
};
