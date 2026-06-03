import { createSelector } from "reselect";
import { ApplicationState } from "../../ApplicationState.types";
import URN from "../URN";
import { GamingSearch, GamingSearchResultItem } from "./GamingSearch.types";

export const getGamingSearchInputTerm = (gamingSearchBar: GamingSearch, urn: string): string =>
  gamingSearchBar[urn]?.inputSearchTerm || "";

export const getGamingSearchInterfaceResult = (gamingSearchBar: GamingSearch, urn: string): GamingSearchResultItem[] =>
  gamingSearchBar[urn]?.result || [];

export const getGamingSearchRetrieved = (gamingSearchBar: GamingSearch, urn: string): boolean =>
  gamingSearchBar[urn]?.gamesRetrieved || false;

export const getGamingSearchTotalCount = (gamingSearchBar: GamingSearch, urn: string): number =>
  gamingSearchBar[urn]?.totalCount || 0;

export const getGamingSearchHasNextPage = (gamingSearchBar: GamingSearch, urn: string): boolean =>
  gamingSearchBar[urn]?.hasNextPage || false;

export const getGamingSearchIsLoadingMore = (gamingSearchBar: GamingSearch, urn: string): boolean =>
  gamingSearchBar[urn]?.isLoadingMore || false;

export const getGamingSearchGamePositionByURN = (gamingSearchBar: GamingSearch, urn: string, gameUrn: string): number =>
  gamingSearchBar[urn]?.result.findIndex((game) => game.urn === gameUrn) ?? -1;

export const createGamingSearchInterfaceSelector = () =>
  createSelector(
    [
      (state: ApplicationState, urn: URN) => getGamingSearchInterfaceResult(state.layouts.gamingSearch, urn),
      (state: ApplicationState, urn: URN) => getGamingSearchInputTerm(state.layouts.gamingSearch, urn),
      (state: ApplicationState, urn: URN) => getGamingSearchRetrieved(state.layouts.gamingSearch, urn),
      (state: ApplicationState, urn: URN) => getGamingSearchTotalCount(state.layouts.gamingSearch, urn),
      (state: ApplicationState, urn: URN) => getGamingSearchHasNextPage(state.layouts.gamingSearch, urn),
      (state: ApplicationState, urn: URN) => getGamingSearchIsLoadingMore(state.layouts.gamingSearch, urn),
    ],
    (results, inputSearchTerm, gamesRetrieved, totalCount, hasNextPage, isLoadingMore) => ({
      results,
      inputSearchTerm,
      gamesRetrieved,
      totalCount,
      hasNextPage,
      isLoadingMore,
    }),
  );
