import {
  PageLoadSuccessAction,
  FetchCatalogueInProgressAction,
  FETCH_CATALOGUE_IN_PROGRESS,
  PAGE_LOAD_SUCCESS,
} from "../../actions/catalogue";
import { NetworkStatusUpdateAction, NETWORK_STATUS__UPDATE } from "../../actions/network-status";
import { NetworkStatusState } from "./NetworkStatusState.types";

type ActionTypes = NetworkStatusUpdateAction | PageLoadSuccessAction | FetchCatalogueInProgressAction;

const INITIAL_STATE: NetworkStatusState = {
  networkStatus: "ONLINE",
  isFetchCatalogueViewSuccess: true,
};

export default (currentState: undefined | NetworkStatusState, action: ActionTypes): NetworkStatusState => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case NETWORK_STATUS__UPDATE: {
      return {
        ...state,
        networkStatus: action.payload.networkStatus,
      };
    }

    case PAGE_LOAD_SUCCESS: {
      return {
        ...state,
        isFetchCatalogueViewSuccess: true,
      };
    }

    case FETCH_CATALOGUE_IN_PROGRESS: {
      return {
        ...state,
        isFetchCatalogueViewSuccess: false,
      };
    }

    default:
      return state;
  }
};
