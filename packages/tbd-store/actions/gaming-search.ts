import URN from "../state/layout/URN";
import { GamingSearchResultItem } from "../state/layout/gaming-search/GamingSearch.types";

export const UI__GAMING__SEARCH_INPUT_CHANGE = "UI__GAMIN__SEARCH_INPUT_CHANGE";
export const UI__GAMING__SEARCH_BAR_INPUT_FOCUS = "UI__GAMING__SEARCH_BAR_INPUT_FOCUS";
export const UI__GAMING__SEARCH_INPUT_CHANGE_CLEAR = "UI__GAMING__SEARCH_INPUT_CHANGE_CLEAR";
export const NETWORK__FETCH_GAMING_SEARCH_RESULTS_SUCCESS = "NETWORK__FETCH_GAMING_SEARCH_RESULTS_SUCCESS";
export const NETWORK__APPEND_GAMING_SEARCH_RESULTS = "NETWORK__APPEND_GAMING_SEARCH_RESULTS";
export const UI__GAMING__FETCH_MORE_SEARCH_RESULTS = "UI__GAMING__FETCH_MORE_SEARCH_RESULTS";
export const NETWORK__FETCH_MORE_GAMING_SEARCH_RESULTS_REQUEST = "NETWORK__FETCH_MORE_GAMING_SEARCH_RESULTS_REQUEST";
export const UI__SEARCH_BAR_LINK_CLICK = "UI__SEARCH_BAR_LINK_CLICK";
export const UI__SEARCH_LINK_CLICK = "UI__SEARCH_LINK_CLICK";
export const UI__GAMING__SEARCH_CANCEL_CLICK = "UI__GAMING__SEARCH_CANCEL_CLICK";
export const UI__GAMING__SEARCH_HISTORY_PEBBLE_CLICK = "UI__GAMING__SEARCH_HISTORY_PEBBLE_CLICK";
export const UI__GAMING__CLEAR_SEARCH_RESULTS = "UI__GAMING__CLEAR_SEARCH_RESULTS";

export type GamingSearchInputChangeAction = {
  type: typeof UI__GAMING__SEARCH_INPUT_CHANGE;
  payload: {
    urn: URN;
    text: string;
  };
};

export type GamingSearchBarInputFocusAction = {
  type: typeof UI__GAMING__SEARCH_BAR_INPUT_FOCUS;
};

export type GamingSearchInputChangeClearAction = {
  type: typeof UI__GAMING__SEARCH_INPUT_CHANGE_CLEAR;
  payload: {
    urn: URN;
  };
};

export type GamingSearchCancelAction = {
  type: typeof UI__GAMING__SEARCH_CANCEL_CLICK;
  payload: {
    urn: URN;
    text: string;
  };
};

export type GamingSearchHistoryPebbleAction = {
  type: typeof UI__GAMING__SEARCH_HISTORY_PEBBLE_CLICK;
  payload: {
    text: string;
  };
};

export type GamingSearchResultsClearAction = {
  type: typeof UI__GAMING__CLEAR_SEARCH_RESULTS;
  payload: {
    urn: URN;
    text: string;
  };
};

export type FetchGamingSearchResultsSuccessAction = {
  type: typeof NETWORK__FETCH_GAMING_SEARCH_RESULTS_SUCCESS;
  payload: {
    urn: URN;
    gamingSearchResults: GamingSearchResultItem[];
    inputSearchTerm: string;
    hasNextPage: boolean;
    endCursor: string | null;
    totalCount: number;
  };
};

export type AppendGamingSearchResultsAction = {
  type: typeof NETWORK__APPEND_GAMING_SEARCH_RESULTS;
  payload: {
    urn: URN;
    gamingSearchResults: GamingSearchResultItem[];
    hasNextPage: boolean;
    endCursor: string | null;
  };
};

export type FetchMoreGamingSearchResultsAction = {
  type: typeof UI__GAMING__FETCH_MORE_SEARCH_RESULTS;
  payload: {
    urn: URN;
  };
};

export type FetchMoreGamingSearchResultsRequestAction = {
  type: typeof NETWORK__FETCH_MORE_GAMING_SEARCH_RESULTS_REQUEST;
  payload: {
    urn: URN;
  };
};
