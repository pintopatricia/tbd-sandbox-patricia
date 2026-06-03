import { Dispatch } from "redux";
import { RateMyAppSessionState, RatingState } from "../state/rating/Rating.types";

export const RATING__RATE_MY_APP_TRIGGERED = "RATING/RATE_MY_APP_TRIGGERED";
export const RATING__UPDATE_BETS = "RATING/UPDATE_BETS";
export const RATING__UPDATE_SESSION = "RATING/UPDATE_SESSION";
export const RATING__RESET = "RATING/RESET";

export type RateMyAppTriggeredAction = {
  type: typeof RATING__RATE_MY_APP_TRIGGERED;
};

export type RatingUpdateBetsAction = {
  type: typeof RATING__UPDATE_BETS;
  payload: {
    numberOfBets: number;
  };
};

export type RatingUpdateSessionAction = {
  type: typeof RATING__UPDATE_SESSION;
  payload: {
    session: RateMyAppSessionState;
  };
};

export type RatingResetAction = {
  type: typeof RATING__RESET;
  payload: RatingState;
};

export function dispatchRateMyAppTriggeredAction(dispatch: Dispatch<RateMyAppTriggeredAction>): void {
  dispatch({
    type: RATING__RATE_MY_APP_TRIGGERED,
  });
}

export function dispatchRatingUpdateSessionAction(
  dispatch: Dispatch<RatingUpdateSessionAction>,
  session: RateMyAppSessionState,
): void {
  dispatch({
    type: RATING__UPDATE_SESSION,
    payload: {
      session,
    },
  });
}

export function dispatchRatingUpdateBetsAction(dispatch: Dispatch<RatingUpdateBetsAction>, numberOfBets: number): void {
  dispatch({
    type: RATING__UPDATE_BETS,
    payload: {
      numberOfBets,
    },
  });
}

export function dispatchRatingResetAction(
  dispatch: Dispatch<RatingResetAction>,
  lastRatingDate: Date,
  ratingCount: number,
): void {
  dispatch({
    type: RATING__RESET,
    payload: {
      lastRatingDate,
      rateMyAppTriggered: false,
      numberOfBets: 0,
      ratingCount: ratingCount + 1,
      session: {
        numberOfSessions: 0,
        lastSessionDate: lastRatingDate,
      },
    },
  });
}
