import { AppContextDetailsState } from "../index";
import {
  NETWORK__FETCH_APP_CONTEXT_TERRITORY_BLOCKING,
  FetchAppContextTerritoryBlockingAction,
  NETWORK__FETCH_APP_CONTEXT_FAILURE,
  FetchAppContextFailureAction,
  FetchAppContextSuccessAction,
  NETWORK__FETCH_APP_CONTEXT_SUCCESS,
  NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE,
  FetchAppContextAuthFailureAction,
} from "../../../actions/app-context";

type ActionTypes =
  | FetchAppContextTerritoryBlockingAction
  | FetchAppContextFailureAction
  | FetchAppContextSuccessAction
  | FetchAppContextAuthFailureAction;

const INITIAL_STATE = { isBlockedTerritory: false, failed: false };

export default (currentState: undefined | AppContextDetailsState, action: ActionTypes): AppContextDetailsState => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case NETWORK__FETCH_APP_CONTEXT_TERRITORY_BLOCKING: {
      const { isBlockedTerritory } = action.payload.details;

      return {
        ...state,
        isBlockedTerritory,
      };
    }
    case NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE: {
      return {
        ...state,
        failed: true,
      };
    }
    case NETWORK__FETCH_APP_CONTEXT_FAILURE: {
      return {
        ...state,
        failed: true,
      };
    }
    case NETWORK__FETCH_APP_CONTEXT_SUCCESS: {
      return {
        ...state,
        failed: false,
      };
    }
    default:
      return state;
  }
};
