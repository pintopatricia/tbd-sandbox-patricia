import { createSelector } from "reselect";
import { ApplicationState } from "../../ApplicationState.types";
import { SearchBarState, SearchBarStateResult } from "./SearchBarState.types";
import URN from "../URN";
import { DEFAULT_MAX_SEARCH_RESULTS } from "../../../config/common-config";

export const getSearchBarInterfaceInputSearchTerm = (searchBar: SearchBarState, urn: string): string =>
  searchBar.search[urn]?.inputSearchTerm || "";

export const getSearchBarInterfaceSearchResult = (searchBar: SearchBarState, urn: string): SearchBarStateResult =>
  searchBar.search[urn]?.result;

export const createSearchBarStateInterfaceSelector = () =>
  createSelector(
    [
      (state: ApplicationState, urn: URN) => getSearchBarInterfaceSearchResult(state.layouts.searchBarState, urn),
      (state: ApplicationState, urn: URN) => getSearchBarInterfaceInputSearchTerm(state.layouts.searchBarState, urn),
    ],
    (searchState, inputSearchTerm) => {
      const { items = [], query, didYouMean } = searchState || {};

      return {
        query,
        didYouMean,
        formattedResults: items.slice(0, DEFAULT_MAX_SEARCH_RESULTS).map((result) => ({
          ...result,
        })),
        inputSearchTerm,
      };
    },
  );
