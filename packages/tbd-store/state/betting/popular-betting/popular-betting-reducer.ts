import { NETWORK__PLACE_SBK_BET_SUCCESS, PlaceSportsbookBetSuccessAction } from "../../../actions/betslip";
import {
  BETTING__SBK_ADD_SELECTIONS,
  BETTING__SBK_CLEAR_ACTION,
  BettingSportsbookAddSelectionAction,
  BettingSportsbookClearAction,
} from "../../../actions/betting";
import { PopularBettingState } from "./PopularBetting.types";

const INITIAL_STATE: PopularBettingState = {};

type ActionTypes = BettingSportsbookAddSelectionAction | PlaceSportsbookBetSuccessAction | BettingSportsbookClearAction;

export default (currentState: undefined | PopularBettingState, action: ActionTypes): PopularBettingState => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case BETTING__SBK_ADD_SELECTIONS: {
      const {
        payload: { selections, bettingOpportunityId, bettingOpportunityType },
      } = action;

      if (!bettingOpportunityId) {
        return state;
      }

      return {
        ...state,
        [bettingOpportunityId]: {
          selections,
          bettingOpportunityType,
          bettingOpportunityId,
        },
      };
    }
    case BETTING__SBK_CLEAR_ACTION:
    case NETWORK__PLACE_SBK_BET_SUCCESS:
      return INITIAL_STATE;

    default:
      return state;
  }
};
