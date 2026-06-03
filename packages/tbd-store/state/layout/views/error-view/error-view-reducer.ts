import { ErrorViewAddAction, ERROR_VIEW__ADD } from "../../../../actions/error";
import { ErrorViews } from "../View.types";

type ActionTypes = ErrorViewAddAction;

const INITIAL_STATE: ErrorViews = {};

export default (currentState: undefined | ErrorViews, action: ActionTypes): ErrorViews => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case ERROR_VIEW__ADD: {
      const { payload } = action;

      if (!payload.urn) {
        return state;
      }

      return {
        ...state,
        [payload.urn]: {
          ...state[payload.urn],
          ...payload,
        },
      };
    }

    default:
      return state;
  }
};
