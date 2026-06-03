import { GamingSearch } from "./GamingSearch.types";
import {
  AppendGamingSearchResultsAction,
  FetchGamingSearchResultsSuccessAction,
  FetchMoreGamingSearchResultsRequestAction,
  NETWORK__APPEND_GAMING_SEARCH_RESULTS,
  NETWORK__FETCH_GAMING_SEARCH_RESULTS_SUCCESS,
  NETWORK__FETCH_MORE_GAMING_SEARCH_RESULTS_REQUEST,
  GamingSearchInputChangeAction,
  UI__GAMING__SEARCH_INPUT_CHANGE,
  UI__GAMING__SEARCH_CANCEL_CLICK,
  UI__GAMING__CLEAR_SEARCH_RESULTS,
  GamingSearchResultsClearAction,
  GamingSearchCancelAction,
  UI__GAMING__SEARCH_INPUT_CHANGE_CLEAR,
  GamingSearchInputChangeClearAction,
} from "../../../actions/gaming-search";
import { BOTTOM_BAR_PUSH, BottomBarPushAction, PushAction } from "../../../actions";

const INITIAL_STATE: GamingSearch = {
  defaultURN: {
    inputSearchTerm: "",
    result: [],
    gamesRetrieved: false,
    hasNextPage: false,
    endCursor: null,
    totalCount: 0,
    isLoadingMore: false,
  },
};

type ActionTypes =
  | FetchGamingSearchResultsSuccessAction
  | AppendGamingSearchResultsAction
  | FetchMoreGamingSearchResultsRequestAction
  | GamingSearchInputChangeAction
  | GamingSearchResultsClearAction
  | GamingSearchCancelAction
  | PushAction
  | BottomBarPushAction
  | GamingSearchInputChangeClearAction;

export default (currentState: undefined | GamingSearch, action: ActionTypes): GamingSearch => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case UI__GAMING__CLEAR_SEARCH_RESULTS:
    case UI__GAMING__SEARCH_CANCEL_CLICK:
      if (!action.payload.urn) {
        return state;
      }
      return {
        ...state,
        [action.payload.urn]: {
          ...INITIAL_STATE.defaultURN,
        },
      };
    case NETWORK__FETCH_GAMING_SEARCH_RESULTS_SUCCESS: {
      const currentSearchTerm = state[action.payload.urn]?.inputSearchTerm || "";
      const shouldUpdateSearchTerm = !currentSearchTerm || currentSearchTerm === action.payload.inputSearchTerm;

      return {
        ...state,
        [action.payload.urn]: {
          inputSearchTerm: shouldUpdateSearchTerm ? action.payload.inputSearchTerm : currentSearchTerm,
          result: [...action.payload.gamingSearchResults],
          gamesRetrieved: true,
          hasNextPage: action.payload.hasNextPage,
          endCursor: action.payload.endCursor,
          totalCount: action.payload.totalCount,
          isLoadingMore: false,
        },
      };
    }
    case NETWORK__FETCH_MORE_GAMING_SEARCH_RESULTS_REQUEST:
      return {
        ...state,
        [action.payload.urn]: {
          ...state[action.payload.urn],
          isLoadingMore: true,
        },
      };
    case NETWORK__APPEND_GAMING_SEARCH_RESULTS:
      return {
        ...state,
        [action.payload.urn]: {
          ...state[action.payload.urn],
          result: [...(state[action.payload.urn]?.result || []), ...action.payload.gamingSearchResults],
          hasNextPage: action.payload.hasNextPage,
          endCursor: action.payload.endCursor,
          isLoadingMore: false,
        },
      };
    case UI__GAMING__SEARCH_INPUT_CHANGE:
      return {
        ...state,
        [action.payload.urn || "defaultURN"]: {
          ...state[action.payload.urn || "defaultURN"],
          inputSearchTerm: action.payload.text,
        },
      };
    case UI__GAMING__SEARCH_INPUT_CHANGE_CLEAR:
      if (!action.payload.urn) {
        return state;
      }

      return {
        ...state,
        [action.payload.urn]: {
          inputSearchTerm: state[action.payload.urn]?.inputSearchTerm || "",
          result: [],
          gamesRetrieved: false,
          hasNextPage: false,
          endCursor: null,
          totalCount: 0,
          isLoadingMore: false,
        },
      };
    case BOTTOM_BAR_PUSH: {
      return {
        ...INITIAL_STATE,
      };
    }
    default:
      return state;
  }
};
