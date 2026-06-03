import {
  ImplyExchangeBetSuccessAction,
  NETWORK__IMPLY_EXC_BET_SUCCESS,
  ImplyExchangeBetFailureAction,
  NETWORK__IMPLY_EXC_BET_FAILURE,
} from "../../../actions/betslip";
import { ExchangeBettingBonus } from "./ExchangeBettingBonus.types";

/**
 * Action types
 */
type ActionTypes = ImplyExchangeBetSuccessAction | ImplyExchangeBetFailureAction;

/** **********************
 *  Exchange Imply Report state reducer  *
 *********************** */

export default (currentState: undefined | ExchangeBettingBonus, action: ActionTypes): ExchangeBettingBonus => {
  const state = currentState || {};

  switch (action.type) {
    /**
     * Update imply data
     */
    case NETWORK__IMPLY_EXC_BET_SUCCESS: {
      return {
        ...action.payload,
      };
    }
    /**
     * Remove imply data on failure
     */
    case NETWORK__IMPLY_EXC_BET_FAILURE: {
      return {};
    }
    default:
      return state;
  }
};
