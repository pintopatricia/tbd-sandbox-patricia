import { Middleware } from "redux";

import {
  BETTING__SBK_ADD_SELECTION_TAGGING,
  BettingSportsbookAddSelectionTaggingAction,
  MarketExchangeBetButtonClickAction,
  MarketSportsbookBetButtonClickAction,
  UI__MARKET_EXC_BET_BUTTON_CLICK,
  UI__MARKET_SBK_BET_BUTTON_CLICK,
} from "../actions/betting";
import { getUniqueId } from "../helpers/betting";
import { ApplicationState } from "../state";

type ActionTypes =
  | BettingSportsbookAddSelectionTaggingAction
  | MarketSportsbookBetButtonClickAction
  | MarketExchangeBetButtonClickAction;

export const criticalTaggingMiddleware: Middleware<Record<string, never>, ApplicationState> =
  ({ getState }) =>
  (next) =>
  (action: ActionTypes) => {
    let updatedAction;

    switch (action.type) {
      case BETTING__SBK_ADD_SELECTION_TAGGING:
      case UI__MARKET_SBK_BET_BUTTON_CLICK: // This case can be deleted when legacy-tagging is removed
      case UI__MARKET_EXC_BET_BUTTON_CLICK: {
        if (action.payload.uniqueId) break;

        // adding gtm bet identifier to bet if not provided
        updatedAction = {
          ...action,
          payload: {
            ...action.payload,
            uniqueId: getUniqueId(getState()),
          },
        };
        break;
      }
      default:
        break;
    }

    return next(updatedAction || action);
  };
