import { ExchangeMarkets } from "./ExchangeMarket.types";
import {
  FETCH_CATALOGUE_SUCCESS,
  FETCH_MAIN_MARKETS_UPDATES_SUCCESS,
  FetchCatalogueSuccessAction,
  FetchMainMarketsUpdatesSuccessAction,
} from "../../../actions/catalogue";
import {
  FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS,
  FetchExchangeMarketUpdatesSuccessAction,
} from "../../../actions/exchange-markets";

type Actions =
  | FetchCatalogueSuccessAction
  | FetchExchangeMarketUpdatesSuccessAction
  | FetchMainMarketsUpdatesSuccessAction;

/** ***************************
 *  Exchange markets reducer  *
 **************************** */
export default (currentState: undefined | ExchangeMarkets, action: Actions): ExchangeMarkets => {
  const state = currentState || {};

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS:
    case FETCH_MAIN_MARKETS_UPDATES_SUCCESS: {
      const markets = action.payload.data.ExchangeMarket || [];

      return markets.reduce<ExchangeMarkets>(
        (acc, market) => ({
          ...acc,
          [market.urn]: {
            ...acc[market.urn],
            ...market,
          },
        }),
        { ...state },
      );
    }
    case FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS:
      return action.payload.markets.reduce<ExchangeMarkets>(
        (acc, market) => {
          if (market.urn === undefined) {
            throw new Error("Market URN is required");
          }

          return {
            ...acc,
            [market.urn]: {
              ...state[market.urn],
              ...market,
            },
          };
        },
        { ...state },
      );
    default:
      return state;
  }
};
