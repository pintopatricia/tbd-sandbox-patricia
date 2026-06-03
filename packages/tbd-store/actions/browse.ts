import URN from "../state/layout/URN";
import { SearchResult } from "../state/layout/views/browse-view/BrowseInterface.types";

export const UI__BROWSE_ICON_CLICK = "UI__BROWSE_ICON_CLICK";
export const UI__SEARCH_TAB_CLICK = "UI__SEARCH_TAB_CLICK";
export const UI__SEARCH_LINK_CLICK = "UI__SEARCH_LINK_CLICK";
export const UI__SEARCH_BAR_LINK_CLICK = "UI__SEARCH_BAR_LINK_CLICK";
export const UI__SEARCH_INPUT_CHANGE = "UI__SEARCH_INPUT_CHANGE";
export const UI__SEARCH_INPUT_CHANGE_CLEAR = "UI__SEARCH_INPUT_CHANGE_CLEAR";
export const NETWORK__FETCH_SEARCH_RESULTS_SUCCESS = "NETWORK__FETCH_SEARCH_RESULTS_SUCCESS";
export const UI__CLEAR_SEARCH_RESULTS = "UI__CLEAR_SEARCH_RESULTS";
export const UI__SEARCH_AZ_LINK_CLICK = "UI__SEARCH_AZ_LINK_CLICK";
export const UI__SEARCH_BAR_FOCUS = "UI__SEARCH_BAR_FOCUS";
export const UI__SEARCH_CANCEL_CLICK = "UI__SEARCH_CANCEL_CLICK";
export const UI__FETCH_MORE_SEARCH_RESULTS = "UI__FETCH_MORE_SEARCH_RESULTS";
export const UI__DELETE_ITEMS_FROM_SEARCH_RESULTS = "UI__DELETE_ITEMS_FROM_SEARCH_RESULTS";
export const UI__SPORTS_FILTER_CLICK = "UI__SPORTS_FILTER_CLICK";
export const UI__SEARCH_HISTORY_CLICK = "UI__SEARCH_HISTORY_CLICK";

export type BrowseIconClickAction = {
  type: typeof UI__BROWSE_ICON_CLICK;
  payload: boolean;
};

export type SearchTabClickAction = {
  type: typeof UI__SEARCH_TAB_CLICK;
  payload: string;
};

export type SearchAzLinkClickAction = {
  type: typeof UI__SEARCH_AZ_LINK_CLICK;
  payload: {
    text: string;
    url: string;
    title?: string;
  };
};

export type SearchLinkClickAction = {
  type: typeof UI__SEARCH_LINK_CLICK | typeof UI__SEARCH_BAR_LINK_CLICK;
  payload: {
    text: string;
    url: string;
    order: number;
    name: string;
    numberOfResults: number;
  };
};

export type SearchInputChangeAction = {
  type: typeof UI__SEARCH_INPUT_CHANGE;
  payload: {
    urn?: URN;
    text: string;
  };
};

export type SearchInputChangeClearAction = {
  type: typeof UI__SEARCH_INPUT_CHANGE_CLEAR;
  payload: {
    urn?: URN;
  };
};

export type FetchSearchResultsSuccessAction = {
  type: typeof NETWORK__FETCH_SEARCH_RESULTS_SUCCESS;
  payload: {
    urn?: URN;
    results: SearchResult;
  };
};

export type SearchClearResultsAction = {
  type: typeof UI__CLEAR_SEARCH_RESULTS;
  payload: {
    urn?: URN;
    text: string;
  };
};

export type SearchBarFocusAction = {
  type: typeof UI__SEARCH_BAR_FOCUS;
};

export type SearchCancelAction = {
  type: typeof UI__SEARCH_CANCEL_CLICK;
  payload: {
    urn: URN;
    text: string;
  };
};

export type DispatchMoreSearchResults = {
  type: typeof UI__FETCH_MORE_SEARCH_RESULTS;
  payload: {
    urn: URN;
  };
};

export type DeleteGamesFromSearchResults = {
  type: typeof UI__DELETE_ITEMS_FROM_SEARCH_RESULTS;
  payload: {
    itemsUrnsToDelete: URN[];
    urn?: URN;
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
