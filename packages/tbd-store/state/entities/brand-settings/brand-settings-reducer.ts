import { BrandSettings } from "./BrandSettings.types";

import { FetchAppContextSuccessAction, NETWORK__FETCH_APP_CONTEXT_SUCCESS } from "../../../actions/app-context";

type ActionTypes = FetchAppContextSuccessAction;

const INITIAL_STATE = {};

export default (currentState: BrandSettings | null | undefined, action: ActionTypes): BrandSettings => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case NETWORK__FETCH_APP_CONTEXT_SUCCESS: {
      const { brandSettings } = action.payload.initialState?.entities || {};

      return brandSettings ?? state;
    }
    default:
      return state;
  }
};
