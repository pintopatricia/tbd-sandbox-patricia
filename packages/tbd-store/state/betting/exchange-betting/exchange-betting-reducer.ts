import { BETTING__EXC_STATE_UPDATE, BettingExchangeStateUpdatedAction } from "../../../actions/betting";
import { ExchangeBettingState } from "./ExchangeBetting.types";

type ActionTypes = BettingExchangeStateUpdatedAction;

const INITIAL_STATE: ExchangeBettingState = {};

const exchangeBettingStateReducer = (
  currentState: undefined | ExchangeBettingState,
  action: ActionTypes,
): ExchangeBettingState => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case BETTING__EXC_STATE_UPDATE: {
      const { payload } = action;

      return payload.state;
    }
    default:
      return state;
  }
};

export default exchangeBettingStateReducer;
