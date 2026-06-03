import { PushAction, BottomBarPushAction } from "../../../actions/router";
import { DeleteLayoutAction } from "../../../actions/catalogue";
import {
  DeleteGamesFromSearchResults,
  FetchSearchResultsSuccessAction,
  SearchAzLinkClickAction,
  SearchClearResultsAction,
  SearchInputChangeAction,
  SearchInputChangeClearAction,
  SearchLinkClickAction,
  BrowseIconClickAction,
  UI__SEARCH_INPUT_CHANGE,
  UI__SEARCH_INPUT_CHANGE_CLEAR,
  UI__CLEAR_SEARCH_RESULTS,
  NETWORK__FETCH_SEARCH_RESULTS_SUCCESS,
} from "../../../actions/browse";
import { SearchBar } from "./SearchBar.types";

/** **********************
 *  Search Interface reducer *
 *********************** */
function buildInitialState(): SearchBar {
  return {
    results: [],
    search: {
      inputSearchTerm: "",
      result: {
        query: "",
        startIndex: 0,
        pageSize: 0,
        items: [],
      },
    },
  };
}

type ActionTypes =
  | BottomBarPushAction
  | BrowseIconClickAction
  | FetchSearchResultsSuccessAction
  | SearchClearResultsAction
  | PushAction
  | SearchInputChangeClearAction
  | SearchInputChangeAction
  | SearchLinkClickAction
  | SearchAzLinkClickAction
  | DeleteGamesFromSearchResults
  | DeleteLayoutAction;

const INITIAL_STATE = buildInitialState();

export default (currentState: undefined | SearchBar, action: ActionTypes): SearchBar => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case NETWORK__FETCH_SEARCH_RESULTS_SUCCESS:
      if (action.payload.urn) {
        return state;
      }

      return {
        ...state,
        search: { ...state.search, result: action.payload.results },
      };
    case UI__CLEAR_SEARCH_RESULTS:
      if (action.payload.urn) {
        return state;
      }

      return {
        ...state,
        search: INITIAL_STATE.search,
      };
    case UI__SEARCH_INPUT_CHANGE_CLEAR:
      if (action.payload.urn) {
        return state;
      }

      return {
        ...state,
        search: {
          ...INITIAL_STATE.search,
          inputSearchTerm: state.search.inputSearchTerm,
        },
      };
    case UI__SEARCH_INPUT_CHANGE:
      if (action.payload.urn) {
        return state;
      }

      return {
        ...state,

        search: { ...state.search, inputSearchTerm: action.payload.text },
      };

    default:
      return state;
  }
};
