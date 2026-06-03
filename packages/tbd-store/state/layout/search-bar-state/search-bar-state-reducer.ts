import {
  FetchSearchBarResultsSuccessAction,
  NETWORK__FETCH_SEARCH_BAR_RESULTS_SUCCESS,
  SearchBarInputChangeAction,
  SearchBarInputChangeClearAction,
  SearchBarResultsClearAction,
  UI__SEARCH_BAR_INPUT_CHANGE,
  UI__SEARCH_BAR_INPUT_CHANGE_CLEAR,
  UI__SEARCH_BAR_RESULTS_CLEAR,
} from "../../../actions/search-bar-state";
import { SearchBarState } from "./SearchBarState.types";

function buildInitialState(): SearchBarState {
  return {
    search: {
      defaultURN: {
        inputSearchTerm: "",
        result: {
          query: "",
          startIndex: 0,
          pageSize: 0,
          items: [],
        },
      },
    },
  };
}

type ActionTypes =
  | SearchBarInputChangeAction
  | FetchSearchBarResultsSuccessAction
  | SearchBarInputChangeClearAction
  | SearchBarResultsClearAction;

const INITIAL_STATE = buildInitialState();

export default (currentState: undefined | SearchBarState, action: ActionTypes): SearchBarState => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case NETWORK__FETCH_SEARCH_BAR_RESULTS_SUCCESS:
      return {
        ...state,
        search: {
          [action.payload.urn]: {
            inputSearchTerm: state.search[action.payload.urn].inputSearchTerm,
            result: { ...action.payload.results },
          },
        },
      };
    case UI__SEARCH_BAR_INPUT_CHANGE:
      return {
        ...state,
        search: {
          [action.payload.urn]: {
            inputSearchTerm: action.payload.text,
            result: state.search[action.payload.urn]?.result,
          },
        },
      };
    case UI__SEARCH_BAR_INPUT_CHANGE_CLEAR:
      return {
        ...state,
        search: {
          ...INITIAL_STATE.search,
        },
      };
    case UI__SEARCH_BAR_RESULTS_CLEAR:
      return {
        ...state,
        search: {
          [action.payload.urn]: {
            inputSearchTerm: action.payload.text,
            result: {
              ...INITIAL_STATE.search.defaultURN.result,
            },
          },
        },
      };

    default:
      return state;
  }
};
