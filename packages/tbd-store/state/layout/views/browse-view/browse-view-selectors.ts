import { createSelector } from "reselect";

import { EntityType } from "@ppb/tbd-urn-codecs";
import { Cards } from "../../cards/Card.types";
import { ApplicationState } from "../../../ApplicationState.types";
import { createFindCardbyURNSelector } from "../../cards/cards-selectors";
import { BrowseViews } from "../View.types";
import { SearchResult } from "./BrowseInterface.types";
import { PebbleListItem, SearchResultItem } from "./Browse.types";
import { SearchBar } from "../../search-bar/SearchBar.types";
import URN from "../../URN";
import { SearchBarStateResultItem } from "../../search-bar-state/SearchBarState.types";
import i18next from "i18next";

export const getBrowseInterfaceOpenState = (state: ApplicationState, urn: URN): boolean =>
  state.layouts.views.browse[urn].isOpen;

export const getBrowseInterfaceInputSearchTerm = (browseViews: BrowseViews, urn: URN): string =>
  browseViews[urn].search.inputSearchTerm;

export const getBrowseInterfaceSearchResult = (browseViews: BrowseViews, urn: URN): SearchResult =>
  browseViews[urn].search.result;

export const getSearchBarInterfaceInputSearchTerm = (searchBar: SearchBar): string => searchBar.search.inputSearchTerm;

export const getSearchBarInterfaceSearchResult = (searchBar: SearchBar): SearchResult => searchBar.search.result;

export const createSearchBarInterfaceSelector = () =>
  createSelector(
    [
      (state: ApplicationState) => getSearchBarInterfaceSearchResult(state.layouts.searchBar),
      (state: ApplicationState) => getSearchBarInterfaceInputSearchTerm(state.layouts.searchBar),
    ],
    (searchState, inputSearchTerm) => {
      const { items, query, didYouMean } = searchState;
      const MAX_RESULTS = 12;

      return {
        query,
        didYouMean,
        formattedResults: items.slice(0, MAX_RESULTS).map((result) => ({
          ...result,
        })),
        inputSearchTerm,
      };
    },
  );

/**
 * Selector for Search Interface
 * createBrowseInterfaceSearchSelector
 */
export const createBrowseInterfaceSearchSelector = () =>
  createSelector(
    [
      (state: ApplicationState, urn: URN) => getBrowseInterfaceSearchResult(state.layouts.views.browse, urn),
      (state: ApplicationState, urn: URN) => getBrowseInterfaceInputSearchTerm(state.layouts.views.browse, urn),
    ],
    (searchState, inputSearchTerm) => {
      const { items, query, didYouMean } = searchState;
      return {
        query,
        didYouMean,
        formattedResults: items.map((result) => ({
          ...result,
        })),
        inputSearchTerm,
      };
    },
  );

/**
 * Selector for Search Gaming Interface
 * createGamingBrowseInterfaceSearchSelector
 */
export const createGamingBrowseInterfaceSearchSelector = () =>
  createSelector(
    [
      (state: ApplicationState, urn: URN) => getBrowseInterfaceSearchResult(state.layouts.views.browse, urn),
      (state: ApplicationState, urn: URN) => getBrowseInterfaceInputSearchTerm(state.layouts.views.browse, urn),
    ],
    (searchState, inputSearchTerm) => {
      const { query } = searchState;

      return {
        query,
        inputSearchTerm,
      };
    },
  );

export const createFullCardsForSearch = () => {
  const getCardbyURN = createFindCardbyURNSelector();

  return createSelector(
    [
      (state: ApplicationState, urn: URN) => getBrowseInterfaceSearchResult(state.layouts.views.browse, urn),
      (state: ApplicationState): Cards => state.layouts.cards,
    ],
    (searchState, cards): SearchResultItem[] => {
      const { items } = searchState;

      if (!items) return [];
      const firstPartialItemIndex = items.findIndex((card: SearchResultItem) => !getCardbyURN(cards, card.urn));

      return firstPartialItemIndex > 0 ? items.slice(0, firstPartialItemIndex) : items;
    },
  );
};

export const createPartialCardsBySearchCardGroupSelector = () => {
  const getCardByURN = createFindCardbyURNSelector();

  return createSelector(
    [
      (state: ApplicationState, urn: URN) => getBrowseInterfaceSearchResult(state.layouts.views.browse, urn),
      (state: ApplicationState): Cards => state.layouts.cards,
      (_: ApplicationState, __: URN, limitOfPartials: number): number => limitOfPartials,
    ],
    (searchState, cards, limitOfPartials?): SearchResultItem[] => {
      const { items } = searchState;

      const filteredUrns = items
        ? items.filter((cardUrn: SearchResultItem) => getCardByURN(cards, cardUrn.urn) === null)
        : [];

      return filteredUrns.slice(0, limitOfPartials || filteredUrns.length).map((cardUrn: any) => cardUrn.urn);
    },
  );
};

export const createGetGamingSearchInputSelector = () =>
  createSelector(
    [
      (state: ApplicationState) => state.router.currentView,
      (state: ApplicationState) => state.layouts.views.browse["ppb:tbd:view:browse:gaming"],
    ],
    (currentView, browse): string | null => {
      const hasResults = browse.search.result.items.length > 0;

      if (!hasResults && currentView === EntityType.BrowseView) {
        return null;
      }

      return browse.search.inputSearchTerm;
    },
  );

export const createSportFiltersSelector = () =>
  createSelector(
    [(res: { formattedResults: (SearchBarStateResultItem & SearchResultItem)[] }) => res.formattedResults],
    (results) => {
      const sportMap = new Set();
      const items = results.reduce<PebbleListItem[]>((acc, { sportId: id, sportName: text }) => {
        if (id && text && !sportMap.has(id)) {
          sportMap.add(id);
          acc.push({ id: id.toString(), text });
        }
        return acc;
      }, []);

      if (items.length > 1) {
        items.unshift({
          id: "ALL",
          text: i18next.t("I18N.OBB.FILTERTAGS.ALL"),
        });
      }
      return items;
    },
  );
