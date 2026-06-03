import { Receipt } from "../../../entities";
import {
  NETWORK__CASHOUT_TAKE_FAILURE,
  TakeCashoutSuccessAction,
  TakeCashoutFailureAction,
} from "../../../../actions/cashout";

import { UI__RECEIPT_CLOSE, ReceiptCloseAction } from "../../../../actions/receipt";

import {
  UI__MARKET_EXC_BET_BUTTON_CLICK,
  UI__MARKET_SBK_BET_BUTTON_CLICK,
  MarketExchangeBetButtonClickAction,
  MarketSportsbookBetButtonClickAction,
} from "../../../../actions/betting";

import { UPDATE_PREFERENCE_FAILURE, UpdatePreferenceFailureAction } from "../../../../actions/catalogue";
import {
  MyBetsCancelAllExchangeBetFailureAction,
  MyBetsCancelExchangeBetFailureAction,
  NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_FAILURE,
  NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BETS_FAILURE,
} from "../../../../actions/my-bets";
import { FetchAppContextSuccessAction, NETWORK__FETCH_APP_CONTEXT_SUCCESS } from "../../../../actions/app-context";

type ActionTypes =
  | TakeCashoutSuccessAction
  | TakeCashoutFailureAction
  | ReceiptCloseAction
  | MarketExchangeBetButtonClickAction
  | MarketSportsbookBetButtonClickAction
  | UpdatePreferenceFailureAction
  | MyBetsCancelAllExchangeBetFailureAction
  | MyBetsCancelExchangeBetFailureAction
  | FetchAppContextSuccessAction;

export default (currentState: undefined | Receipt, action: ActionTypes): Receipt => {
  const state = currentState || null;

  switch (action.type) {
    case NETWORK__CASHOUT_TAKE_FAILURE:
    case NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BETS_FAILURE:
    case NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_FAILURE:
      return action.payload.receipt;
    case UI__RECEIPT_CLOSE:
    case UI__MARKET_EXC_BET_BUTTON_CLICK:
    case UI__MARKET_SBK_BET_BUTTON_CLICK:
    case NETWORK__FETCH_APP_CONTEXT_SUCCESS:
      return null;
    case UPDATE_PREFERENCE_FAILURE:
      return action.payload;
    default:
      return state;
  }
};
