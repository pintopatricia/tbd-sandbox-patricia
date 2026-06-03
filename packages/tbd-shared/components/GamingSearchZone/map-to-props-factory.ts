import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import {
  FetchMoreGamingSearchResultsAction,
  GamingSearchBarInputFocusAction,
  GamingSearchCancelAction,
  GamingSearchHistoryPebbleAction,
  GamingSearchInputChangeAction,
  GamingSearchInputChangeClearAction,
  GamingSearchResultsClearAction,
  UI__GAMING__CLEAR_SEARCH_RESULTS,
  UI__GAMING__FETCH_MORE_SEARCH_RESULTS,
  UI__GAMING__SEARCH_BAR_INPUT_FOCUS,
  UI__GAMING__SEARCH_CANCEL_CLICK,
  UI__GAMING__SEARCH_HISTORY_PEBBLE_CLICK,
  UI__GAMING__SEARCH_INPUT_CHANGE,
  UI__GAMING__SEARCH_INPUT_CHANGE_CLEAR,
} from "@ppb/tbd-store/actions/gaming-search";
import URN from "@ppb/tbd-store/state/layout/URN";
import { createGetThrottleSelector } from "@ppb/tbd-store";

import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import { GamingCardGroups } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { createGamingSearchInterfaceSelector } from "@ppb/tbd-store/state/layout/gaming-search/gaming-search-selectors";
import { GamingSearchResultItem } from "@ppb/tbd-store/state/layout/gaming-search/GamingSearch.types";
import { INPUT_LENGTH_SEARCH_TRIGGER } from "@ppb/tbd-store/config/common-config";
import { i18n } from "../../helpers/i18n";

export type ContainerProps = {
  urn: URN;
};

export type StateProps = {
  numberOfResults: number;
  totalCount: number;
  isLoadingMore: boolean;
  inputSearchTerm: string;
  searchPlaceholder: string;
  cancel: string;
  outOfIdeasLabel?: string;
  noResultsLabel?: string;
  numberOfResultsLabel?: string;
  results: GamingSearchResultItem[];
  recommendedGames: PartialItem;
  shouldHandleOnBlur: boolean;
  isRefreshing: boolean;
  pinGamingSearch?: boolean;
  shouldDisplaySearchHistory?: boolean;
  searchHistoryLabel?: string;
  scrollForSearchBar?: boolean;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getGamingSearchInterface = createGamingSearchInterfaceSelector();
  const getRecommendedSearchGamesByURN = createCardGroupByURNSelector<GamingCardGroups, URN>();
  const getThrottle = createGetThrottleSelector();

  return (state: ApplicationState, { urn }: ContainerProps): StateProps => {
    const recommendedCardGroup = getRecommendedSearchGamesByURN(
      state.layouts.cardgroups.gamingcardgroups,
      state.layouts.searchzones[urn].items[1].urn,
    ) as PartialItem;
    const pinGamingSearch = !!getThrottle(state.entities.throttles, "PIN_GAMING_SEARCH")?.isActive;
    const scrollForSearchBar = !!getThrottle(state.entities.throttles, "SCROLL_FOR_SEARCH_BAR")?.isActive;
    const shouldDisplaySearchHistory = getThrottle(state.entities.throttles, "DISPLAY_SEARCH_HISTORY")?.isActive;
    const { results, inputSearchTerm, gamesRetrieved, totalCount, isLoadingMore } = getGamingSearchInterface(
      state,
      urn,
    );
    const { isRefreshing } = state.router;

    let numberOfResultsLabel;
    let noResultsLabel;
    const outOfIdeasLabel = i18n({ key: "I18N.SEARCH.GAMING.OUT_OF_IDEAS" });

    const isInputLongEnough = inputSearchTerm.length >= INPUT_LENGTH_SEARCH_TRIGGER;

    if (gamesRetrieved && isInputLongEnough) {
      if (results.length > 0) {
        const searchTerm = inputSearchTerm;
        numberOfResultsLabel = i18n({
          key: "I18N.SEARCH.GAMING.RESULTS",
          interpolationValues: {
            numberOfResults: totalCount.toString(),
            searchTerm,
          },
        });
      } else {
        noResultsLabel = i18n({
          key: "I18N.SEARCH.GAMING.NO_RESULTS",
          interpolationValues: { query: inputSearchTerm },
        });
      }
    }

    return {
      results,
      numberOfResults: results.length,
      totalCount,
      isLoadingMore,
      inputSearchTerm,
      searchPlaceholder: i18n({ key: "I18N.SEARCH.GAMING_INPUT_PLACEHOLDER" }),
      cancel: i18n({ key: "I18N.SEARCH.CANCEL" }),
      numberOfResultsLabel,
      noResultsLabel,
      outOfIdeasLabel,
      recommendedGames: recommendedCardGroup,
      shouldHandleOnBlur: false,
      isRefreshing,
      pinGamingSearch,
      shouldDisplaySearchHistory,
      searchHistoryLabel: i18n({ key: "I18N.SEARCH.HISTORY.LABEL" }),
      scrollForSearchBar,
    };
  };
};

const dispatchGamingSearchInputChangeAction = (text: string, urn: string): GamingSearchInputChangeAction => ({
  type: UI__GAMING__SEARCH_INPUT_CHANGE,
  payload: { text, urn },
});

const dispatchGamingSearchInputChangeClearAction = (urn: string): GamingSearchInputChangeClearAction => ({
  type: UI__GAMING__SEARCH_INPUT_CHANGE_CLEAR,
  payload: { urn },
});

const dispatchGamingSearchClearResultsAction = (text: string, urn: string): GamingSearchResultsClearAction => ({
  type: UI__GAMING__CLEAR_SEARCH_RESULTS,
  payload: { text, urn },
});

const dispatchGamingSearchCancelAction = (text: string, urn: string): GamingSearchCancelAction => ({
  type: UI__GAMING__SEARCH_CANCEL_CLICK,
  payload: { text, urn },
});

const dispatchPebbleSearchHistoryClickAction = (text: string): GamingSearchHistoryPebbleAction => ({
  type: UI__GAMING__SEARCH_HISTORY_PEBBLE_CLICK,
  payload: { text },
});

const dispatchGamingSearchBarFocusAction = (): GamingSearchBarInputFocusAction => ({
  type: UI__GAMING__SEARCH_BAR_INPUT_FOCUS,
});

const dispatchFetchMoreGamingSearchResults = (urn: string): FetchMoreGamingSearchResultsAction => ({
  type: UI__GAMING__FETCH_MORE_SEARCH_RESULTS,
  payload: { urn },
});

export type DispatchProps = {
  dispatchGamingSearchInputChangeAction: typeof dispatchGamingSearchInputChangeAction;
  dispatchGamingSearchInputChangeClearAction: typeof dispatchGamingSearchInputChangeClearAction;
  dispatchGamingSearchClearResultsAction: typeof dispatchGamingSearchClearResultsAction;
  dispatchGamingSearchCancelAction: typeof dispatchGamingSearchCancelAction;
  dispatchPebbleSearchHistoryClickAction: typeof dispatchPebbleSearchHistoryClickAction;
  dispatchGamingSearchBarFocusAction: typeof dispatchGamingSearchBarFocusAction;
  dispatchFetchMoreGamingSearchResults: typeof dispatchFetchMoreGamingSearchResults;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchGamingSearchInputChangeAction,
  dispatchGamingSearchInputChangeClearAction,
  dispatchGamingSearchClearResultsAction,
  dispatchGamingSearchCancelAction,
  dispatchPebbleSearchHistoryClickAction,
  dispatchGamingSearchBarFocusAction,
  dispatchFetchMoreGamingSearchResults,
};
