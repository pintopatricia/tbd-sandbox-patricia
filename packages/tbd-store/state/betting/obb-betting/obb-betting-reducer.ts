import {
  BETTING__OBB_PLACE_FAILED_UPDATE,
  BETTING__OBB_STATE_UPDATE,
  BettingObbClearAction,
  BettingObbPlaceFailedUpdateAction,
  BettingObbStateUpdateAction,
} from "../../../actions/betting";
import { ObbBettingState } from "./ObbBetting.types";

export const INITIAL_STATE: ObbBettingState = {
  potentialBets: {},
  legs: {},
  totalStake: null,
  totalPotentialReturns: null,
  maxPayoutLimits: { warning: null, error: null },
  validations: {
    betslip: [],
    potentialBets: {},
  },
  failures: {
    betslip: null,
    potentialBets: {},
    legs: {},
  },
};

type ActionTypes = BettingObbStateUpdateAction | BettingObbClearAction | BettingObbPlaceFailedUpdateAction;

/*
 * Sets the new obb betting state
 */
export default (currentState: undefined | ObbBettingState, action: ActionTypes): ObbBettingState => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case BETTING__OBB_PLACE_FAILED_UPDATE:
    case BETTING__OBB_STATE_UPDATE: {
      const { payload } = action;

      return payload.state;
    }

    default:
      return state;
  }
};
