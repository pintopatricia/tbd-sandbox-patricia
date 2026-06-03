import {
  RateMyAppTriggeredAction,
  RatingUpdateBetsAction,
  RatingUpdateSessionAction,
  RatingResetAction,
  RATING__RATE_MY_APP_TRIGGERED,
  RATING__UPDATE_BETS,
  RATING__UPDATE_SESSION,
  RATING__RESET,
} from "../../actions/rating";
import { RatingState } from "./Rating.types";

type RateMyAppActions =
  | RateMyAppTriggeredAction
  | RatingUpdateBetsAction
  | RatingUpdateSessionAction
  | RatingResetAction;

const INITIAL_STATE = { rateMyAppTriggered: false, lastRatingDate: undefined, ratingCount: 0 };

export default (currentState: undefined | RatingState, action: RateMyAppActions): RatingState => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case RATING__RATE_MY_APP_TRIGGERED: {
      return {
        ...state,
        rateMyAppTriggered: true,
      };
    }

    case RATING__UPDATE_SESSION: {
      const { payload } = action;

      return {
        ...state,
        ...payload,
      };
    }

    case RATING__UPDATE_BETS: {
      const { payload } = action;

      return {
        ...state,
        ...payload,
      };
    }

    case RATING__RESET: {
      const { payload } = action;

      return {
        ...payload,
      };
    }

    default:
      return state;
  }
};
