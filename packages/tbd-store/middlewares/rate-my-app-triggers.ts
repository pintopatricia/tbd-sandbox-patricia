import { Middleware } from "redux";
import { ApplicationState } from "../state/ApplicationState.types";
import { RatingModule } from "../modules/RatingModule.types";
import {
  NETWORK__PLACE_EXC_BET_SUCCESS,
  NETWORK__PLACE_SBK_BET_SUCCESS,
  PlaceSportsbookBetSuccessAction,
  PlaceExchangeBetSuccessAction,
} from "../actions/betslip";
import { NETWORK__CASHOUT_TAKE_SUCCESS, TakeCashoutSuccessAction } from "../actions/cashout";
import {
  dispatchRateMyAppTriggeredAction,
  dispatchRatingUpdateSessionAction,
  dispatchRatingUpdateBetsAction,
} from "../actions/rating";
import { FetchCatalogueSuccessAction, FETCH_CATALOGUE_SUCCESS } from "../actions/catalogue";

type ActionTypes =
  | PlaceSportsbookBetSuccessAction
  | PlaceExchangeBetSuccessAction
  | TakeCashoutSuccessAction
  | FetchCatalogueSuccessAction;

export const rateMyAppMiddleware =
  (ratingModule: RatingModule): Middleware<{}, ApplicationState> =>
  ({ dispatch, getState }) =>
  (next) =>
  (action: ActionTypes) => {
    const result = next(action);

    const state = getState();
    const {
      rating,
      entities: { throttles },
    } = state;

    const isRateMyAppActive = throttles.RATE_MY_APP?.isActive;

    if (!isRateMyAppActive) {
      return false;
    }

    switch (action.type) {
      case NETWORK__CASHOUT_TAKE_SUCCESS: {
        if (action.payload.errorCode === "SUCCESS") {
          const canRate = ratingModule.checkRatingRequirements(state);

          if (canRate) {
            dispatchRateMyAppTriggeredAction(dispatch);
          }
        }
        break;
      }

      case NETWORK__PLACE_EXC_BET_SUCCESS:
      case NETWORK__PLACE_SBK_BET_SUCCESS: {
        dispatchRatingUpdateBetsAction(dispatch, (rating.numberOfBets || 0) + 1);

        const canRate = ratingModule.checkRatingRequirements(state, true);

        if (canRate) {
          dispatchRateMyAppTriggeredAction(dispatch);
        }

        break;
      }

      case FETCH_CATALOGUE_SUCCESS: {
        const session = ratingModule.handleSession(rating.session);
        dispatchRatingUpdateSessionAction(dispatch, session);

        break;
      }

      default:
        break;
    }

    return result;
  };
