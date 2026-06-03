import { Dispatch, Middleware } from "redux";

import {
  BETTING__SBK_ADD_SELECTIONS,
  BettingSportsbookAddSelectionAction,
  MarketExchangeBetButtonClickAction,
  MarketSportsbookBetButtonClickAction,
  UI__MARKET_EXC_BET_BUTTON_CLICK,
  UI__MARKET_SBK_BET_BUTTON_CLICK,
} from "../actions/betting";
import { ApplicationState } from "../state";
import { createGetCountryLocalCurrencyCodeSelector } from "../state/entities/user-details/user-details-selectors";

type ActionTypes =
  | BettingSportsbookAddSelectionAction
  | MarketExchangeBetButtonClickAction
  | MarketSportsbookBetButtonClickAction;

export const ELIGIBLE_KEEP_ALIVE_ACTIONS: string[] = [
  BETTING__SBK_ADD_SELECTIONS,
  UI__MARKET_EXC_BET_BUTTON_CLICK,
  UI__MARKET_SBK_BET_BUTTON_CLICK,
];

/**
 * This middleware monitors actions indicating that a logged-in user is active and extends their session accordingly.
 * It addresses the issue of short session durations in Brazil, which often require users to log in frequently.
 * By implementing this measure, we aim to reduce the inconvenience caused by frequent logouts.
 */
export const keepAliveMiddleware =
  (keepAliveFn: () => void): Middleware<Record<string, never>, ApplicationState> =>
  ({ getState }) =>
  (next: Dispatch<ActionTypes>) =>
  (action: ActionTypes): ActionTypes => {
    if (ELIGIBLE_KEEP_ALIVE_ACTIONS.includes(action.type)) {
      const state = getState();
      const getUserDetails = createGetCountryLocalCurrencyCodeSelector();

      const { loggedIn } = getUserDetails(state);

      if (loggedIn) keepAliveFn();
    }

    return next(action);
  };
