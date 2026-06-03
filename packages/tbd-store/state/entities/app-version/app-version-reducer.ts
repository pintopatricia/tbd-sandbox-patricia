import { AppVersion } from "./AppVersion.types";
import { FetchAppContextSuccessAction, NETWORK__FETCH_APP_CONTEXT_SUCCESS } from "../../../actions/app-context";
import { FetchAppVersionSuccessAction, NETWORK__FETCH_APP_VERSION_SUCCESS } from "../../../actions/app-version";

type ActionTypes = FetchAppContextSuccessAction | FetchAppVersionSuccessAction;

export default (currentState: undefined | AppVersion, action: ActionTypes): AppVersion => {
  const state = currentState || null;

  switch (action.type) {
    case NETWORK__FETCH_APP_CONTEXT_SUCCESS: {
      const appversion = action.payload.initialState?.entities.appversion;

      if (appversion) {
        return {
          ...state,
          ...appversion,
        };
      }

      return state;
    }
    case NETWORK__FETCH_APP_VERSION_SUCCESS: {
      const appversion = action.payload;

      if (appversion) {
        return {
          ...state,
          ...appversion,
        };
      }

      return state;
    }
    default:
      return state;
  }
};
