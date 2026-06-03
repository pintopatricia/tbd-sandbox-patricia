import { init } from "@ppb/betslip-core";
import {
  BETTING__SBK_STATE_UPDATE,
  BETTING__SBK_PLACE_FAILED_UPDATE,
  BettingSportsbookStateUpdateAction,
  BettingSportsbookPlaceFailedUpdateAction,
} from "../../../actions/betting";
import { SportsbookBettingState } from "./SportsbookBetting.types";

const INITIAL_STATE: SportsbookBettingState = init();

type ActionTypes = BettingSportsbookStateUpdateAction | BettingSportsbookPlaceFailedUpdateAction;

/*
 * Sets the new betting state
 */
export default (currentState: undefined | SportsbookBettingState, action: ActionTypes): SportsbookBettingState => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case BETTING__SBK_PLACE_FAILED_UPDATE:
    case BETTING__SBK_STATE_UPDATE: {
      const { payload } = action;

      return payload.state;
    }
    default:
      return state;
  }
};
