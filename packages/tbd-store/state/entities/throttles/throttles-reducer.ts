import { ThrottlesState } from "./Throttles.types";
import { FetchAppContextSuccessAction, NETWORK__FETCH_APP_CONTEXT_SUCCESS } from "../../../actions/app-context";
import {
  SET_THROTTLES,
  SetThrottlesAction,
  RESET_THROTTLES,
  ResetThrottlesAction,
} from "../../../actions/settings-page";

export default (
  currentState: undefined | ThrottlesState,
  action: FetchAppContextSuccessAction | SetThrottlesAction | ResetThrottlesAction,
): ThrottlesState => {
  const state = currentState || {};

  switch (action.type) {
    case NETWORK__FETCH_APP_CONTEXT_SUCCESS: {
      const { throttles } = action.payload.initialState?.entities || {};
      if (throttles) {
        const newThrottles = Object.keys(throttles).reduce((mergedThrottles, throttleId) => {
          const currentThrottle = state[throttleId];
          const newThrottle = throttles[throttleId];

          if (currentThrottle?.isOverriden) {
            return mergedThrottles;
          }

          return {
            ...mergedThrottles,
            [throttleId]: newThrottle,
          };
        }, {});

        return {
          ...state,
          ...newThrottles,
        };
      }

      return state;
    }
    case SET_THROTTLES: {
      return { ...currentState, ...action.payload.value };
    }
    case RESET_THROTTLES: {
      return {};
    }

    default:
      return state;
  }
};
