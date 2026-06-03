import {
  BettingSbkModuleLoadedAction,
  MODULES__SBK_BETTING_LOADED,
  BettingExcModuleLoadedAction,
  MODULES__EXC_BETTING_LOADED,
} from "../../actions/modules";

type ActionTypes = BettingSbkModuleLoadedAction | BettingExcModuleLoadedAction;

const INITIAL_STATE = { sbkBetting: false, excBetting: false };

export default (currentState: undefined | typeof INITIAL_STATE, action: ActionTypes): typeof INITIAL_STATE => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case MODULES__SBK_BETTING_LOADED:
      return { ...state, sbkBetting: true };
    case MODULES__EXC_BETTING_LOADED:
      return { ...state, excBetting: true };
    default:
      return state;
  }
};
