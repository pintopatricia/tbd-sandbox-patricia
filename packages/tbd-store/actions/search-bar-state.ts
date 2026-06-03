import URN from "../state/layout/URN";
import { SearchBarStateResult } from "../state/layout/search-bar-state/SearchBarState.types";

export const UI__SEARCH_BAR_INPUT_CHANGE = "UI__SEARCH_BAR_INPUT_CHANGE";
export const UI__SEARCH_BAR_INPUT_FOCUS = "UI__SEARCH_BAR_INPUT_FOCUS";
export const UI__SEARCH_BAR_INPUT_CHANGE_CLEAR = "UI__SEARCH_BAR_INPUT_CHANGE_CLEAR";
export const NETWORK__FETCH_SEARCH_BAR_RESULTS_SUCCESS = "NETWORK__FETCH_SEARCH_BAR_RESULTS_SUCCESS";
export const UI__SEARCH_BAR_RESULTS_CLEAR = "UI__SEARCH_BAR_RESULTS_CLEAR";
export const UI__SEARCH_BAR_LINK_CLICK = "UI__SEARCH_BAR_LINK_CLICK";
export const UI__SEARCH_LINK_CLICK = "UI__SEARCH_LINK_CLICK";
export const UI__SEARCH_BAR_CANCEL_CLICK = "UI__SEARCH_BAR_CANCEL_CLICK";
export const UI__SPORTS_FILTER_CLICK = "UI__SPORTS_FILTER_CLICK";
export const UI__SEARCH_HISTORY_CLICK = "UI__SEARCH_HISTORY_CLICK";

export type SearchBarInputChangeAction = {
  type: typeof UI__SEARCH_BAR_INPUT_CHANGE;
  payload: {
    urn: URN;
    text: string;
  };
};

export type SearchBarResultsLinkClickAction = {
  type: typeof UI__SEARCH_BAR_LINK_CLICK | typeof UI__SEARCH_LINK_CLICK;
  payload: {
    text: string;
    url: string;
    order: number;
    name: string;
    numberOfResults: number;
  };
};

export type SearchBarInputFocusAction = {
  type: typeof UI__SEARCH_BAR_INPUT_FOCUS;
};

export type SearchBarInputChangeClearAction = {
  type: typeof UI__SEARCH_BAR_INPUT_CHANGE_CLEAR;
  payload: {
    urn: URN;
    text: string;
  };
};

export type SearchBarCancelAction = {
  type: typeof UI__SEARCH_BAR_CANCEL_CLICK;
  payload: {
    urn: URN;
    text: string;
  };
};

export type SearchBarResultsClearAction = {
  type: typeof UI__SEARCH_BAR_RESULTS_CLEAR;
  payload: {
    urn: URN;
    text: string;
  };
};

export type FetchSearchBarResultsSuccessAction = {
  type: typeof NETWORK__FETCH_SEARCH_BAR_RESULTS_SUCCESS;
  payload: {
    urn: URN;
    results: SearchBarStateResult;
  };
};

export type SportsFilterClickAction = {
  type: typeof UI__SPORTS_FILTER_CLICK;
  payload: {
    sportFilter: string;
    searchTerm: string;
  };
};

export type SearchHistoryClickAction = {
  type: typeof UI__SEARCH_HISTORY_CLICK;
  payload: {
    text: string;
  };
};
