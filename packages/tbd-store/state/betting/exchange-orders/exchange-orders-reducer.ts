import { FetchExchangeOpenBetsSuccessAction, FETCH_EXC_OPEN_BETS_SUCCESS } from "../../../actions/exchange-open-bets";
import { ExchangeMarketsPosition } from "./ExchangeOrder.types";

type Actions = FetchExchangeOpenBetsSuccessAction;

/** ***************************
 *  Exchange orders reducer  *
 **************************** */
export default (currentState: undefined | ExchangeMarketsPosition, action: Actions): ExchangeMarketsPosition => {
  const state = currentState || {};

  switch (action.type) {
    case FETCH_EXC_OPEN_BETS_SUCCESS:
      return {
        ...state,
        ...action.payload.markets,
      };
    default:
      return state;
  }
};
