import { Middleware } from "redux";
import { ApplicationState } from "../state/ApplicationState.types";
import { FetchCatalogueAuthFailureAction, FETCH_CATALOGUE_AUTH_FAILURE } from "../actions/catalogue";
import { FetchUserWalletsAuthFailureAction, FETCH_USER_WALLETS_AUTH_FAILURE } from "../actions/user-wallets";
import {
  SportsbookCombinationsUpdateAuthFailureAction,
  PlaceSportsbookBetAuthFailureAction,
  PlaceExchangeBetAuthFailureAction,
  FetchExchangeByMarketAuthFailure,
  CancelExchangeBetAuthFailureAction,
  ImplyExchangeBetAuthFailureAction,
  NETWORK__PLACE_EXC_BET_AUTH_FAILURE,
  NETWORK__PLACE_SBK_BET_AUTH_FAILURE,
  NETWORK__SBK_COMBINATIONS_UPDATE_AUTH_FAILURE,
  NETWORK__CANCEL_EXC_BET_AUTH_FAILURE,
  NETWORK__IMPLY_EXC_BET_AUTH_FAILURE,
  NETWORK__EXC_BY_MARKET_AUTH_FAILURE,
} from "../actions/betslip";
import { InvalidSessionAction, NETWORK__INVALID_SESSION } from "../actions/app-context";
import {
  FetchSportsbookQuotesAuthFailureAction,
  NETWORK__CASHOUT_TAKE_AUTH_FAILURE_SBK,
  NETWORK__FETCH_SBK_QUOTES_AUTH_FAILURE,
  TakeCashoutAuthFailureSbkAction,
} from "../actions/cashout";

export type AuthFailureCallback = () => void;

type ActionTypes =
  | FetchCatalogueAuthFailureAction
  | FetchUserWalletsAuthFailureAction
  | PlaceExchangeBetAuthFailureAction
  | SportsbookCombinationsUpdateAuthFailureAction
  | PlaceSportsbookBetAuthFailureAction
  | CancelExchangeBetAuthFailureAction
  | FetchExchangeByMarketAuthFailure
  | ImplyExchangeBetAuthFailureAction
  | FetchSportsbookQuotesAuthFailureAction
  | TakeCashoutAuthFailureSbkAction;

export const authenticationFailureMiddleware =
  (callbackFn: AuthFailureCallback): Middleware<Record<string, never>, ApplicationState> =>
  ({ dispatch }) =>
  (next) =>
  (action: ActionTypes) => {
    switch (action.type) {
      case FETCH_CATALOGUE_AUTH_FAILURE:
      case FETCH_USER_WALLETS_AUTH_FAILURE:
      case NETWORK__PLACE_EXC_BET_AUTH_FAILURE:
      case NETWORK__PLACE_SBK_BET_AUTH_FAILURE:
      case NETWORK__SBK_COMBINATIONS_UPDATE_AUTH_FAILURE:
      case NETWORK__CANCEL_EXC_BET_AUTH_FAILURE:
      case NETWORK__IMPLY_EXC_BET_AUTH_FAILURE:
      case NETWORK__EXC_BY_MARKET_AUTH_FAILURE:
      case NETWORK__FETCH_SBK_QUOTES_AUTH_FAILURE:
      case NETWORK__CASHOUT_TAKE_AUTH_FAILURE_SBK:
        dispatch<InvalidSessionAction>({
          type: NETWORK__INVALID_SESSION,
        });
        callbackFn();
        break;
      default:
        break;
    }

    return next(action);
  };
