import { ExchangeMarketBets } from "./ExchangeMarketBet.types";

import { FETCH_CATALOGUE_SUCCESS, FetchCatalogueSuccessAction } from "../../../actions/catalogue";

type ActionTypes = FetchCatalogueSuccessAction;

/** ********************************
 *  Exchange Markets Bets reducer  *
 ********************************* */

export default (currentState: undefined | ExchangeMarketBets, action: ActionTypes): ExchangeMarketBets => {
  const state = currentState || {};

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const bets = action.payload.data.MarketBet || [];

      return bets.reduce(
        (acc, bet) => ({
          ...acc,
          [bet.urn]: bet,
        }),
        { ...state },
      );
    }
    default:
      return state;
  }
};
