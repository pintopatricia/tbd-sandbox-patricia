import { ExchangeBetAvailability } from "../index";
import { ExchangeRunners } from "./ExchangeRunner.types";
import {
  FetchExchangeMarketUpdatesSuccessAction,
  SubscribeExchangeMarketUpdatesAction,
  UnsubscribeExchangeMarketUpdatesAction,
  FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS,
} from "../../../actions/exchange-markets";

type ActionTypes =
  | FetchExchangeMarketUpdatesSuccessAction
  | SubscribeExchangeMarketUpdatesAction
  | UnsubscribeExchangeMarketUpdatesAction;

// This constant represents depth of the market.
// Meaning that when market depth feature is active we would return 3 prices for each side.
const MARKET_DEPTH = 3;

/** ***************************
 *  Exchange runners reducer  *
 **************************** */
export default (currentState: undefined | ExchangeRunners, action: ActionTypes): ExchangeRunners => {
  const state = currentState || {};

  switch (action.type) {
    /**
     * Update market and runners with new odds, when still maintaining all that was
     * already existing props (e.g. selectionId)
     */
    case FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS: {
      return action.payload.runners.reduce(
        (acc, runner): ExchangeRunners => {
          // Back and Lay are manatory. if either Lay or Back are not provided by ERO, fallback to
          // an array with 3 entries with the corresponding market depth and no price. i.e. [{ marketDepth: 1 }, { marketDepth: 2 }, { marketDepth: 3 }]
          const prices: { back: ExchangeBetAvailability[]; lay: ExchangeBetAvailability[] } = {
            back: [],
            lay: [],
          };
          for (let i = 0; i < MARKET_DEPTH; i += 1) {
            prices.back[i] = { ...((runner.back && runner.back[i]) ?? []), marketDepth: i };
            prices.lay[i] = { ...((runner.lay && runner.lay[i]) ?? []), marketDepth: i };
          }

          return {
            ...acc,
            [runner.urn]: {
              ...state[runner.urn],
              ...runner,
              back: prices.back,
              lay: prices.lay,
            },
          };
        },
        { ...state },
      );
    }
    default:
      return state;
  }
};
