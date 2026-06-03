import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import {
  UI__SEARCH_INPUT_CHANGE,
  UI__SEARCH_INPUT_CHANGE_CLEAR,
  UI__CLEAR_SEARCH_RESULTS,
  UI__SEARCH_CANCEL_CLICK,
  UI__SEARCH_BAR_FOCUS,
  SearchClearResultsAction,
  SearchInputChangeClearAction,
  SearchInputChangeAction,
  SearchCancelAction,
  SearchBarFocusAction,
  DispatchMoreSearchResults,
  UI__FETCH_MORE_SEARCH_RESULTS,
} from "@ppb/tbd-store/actions/browse";
import { INPUT_LENGTH_SEARCH_TRIGGER } from "@ppb/tbd-store/config/common-config";
import URN from "@ppb/tbd-store/state/layout/URN";
import {
  createGamingBrowseInterfaceSearchSelector,
  createFullCardsForSearch,
} from "@ppb/tbd-store/state/layout/views/browse-view/browse-view-selectors";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { SearchResultItem } from "@ppb/tbd-store/state/layout/views/browse-view/Browse.types";
import { i18n } from "../../helpers/i18n";

export type ContainerProps = {
  urn: URN;
};

export type StateProps = {
  query: string;
  numberOfResults: number;
  inputSearchTerm: string;
  searchPlaceholder: string;
  cancel: string;
  outOfIdeasLabel?: string;
  noResultsLabel?: string;
  numberOfResultsLabel?: string;
  results: SearchResultItem[];
  defaultContainers: PartialItem;
  recommendedGames: PartialItem;
  shouldHandleOnBlur: boolean;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getBrowseInterfaceSearch = createGamingBrowseInterfaceSearchSelector();
  return (state: ApplicationState, { urn }: ContainerProps): StateProps => {
    const { query, inputSearchTerm } = getBrowseInterfaceSearch(state, urn);

    const searchTerm = query;
    const getFullCardsForSearch = createFullCardsForSearch();
    const items = getFullCardsForSearch(state, urn);

    let numberOfResultsLabel;
    let noResultsLabel;
    const outOfIdeasLabel = i18n({ key: "I18N.SEARCH.OUT_OF_IDEAS" });
    if (query.length >= INPUT_LENGTH_SEARCH_TRIGGER) {
      numberOfResultsLabel = i18n({
        key: "I18N.SEARCH.RESULTS",
        interpolationValues: { numberOfResults: items.length.toString(), searchTerm },
      });

      if (!items.length) {
        noResultsLabel = i18n({ key: "I18N.SEARCH.NO_RESULTS", interpolationValues: { query: searchTerm } });
      }
    }

    return {
      results: items || [],
      numberOfResults: items.length,
      query: searchTerm,
      inputSearchTerm,
      searchPlaceholder: i18n({ key: "I18N.SEARCH.GAMING_INPUT_PLACEHOLDER" }),
      cancel: i18n({ key: "I18N.SEARCH.CANCEL" }),
      outOfIdeasLabel,
      numberOfResultsLabel,
      noResultsLabel,
      defaultContainers: state.layouts.views.browse[urn]?.items[0], // temporary
      recommendedGames: state.layouts.views.browse[urn]?.items[1], // temporary
      shouldHandleOnBlur: false,
    };
  };
};

const dispatchSearchInputChangeAction = (text: string, urn: string): SearchInputChangeAction => ({
  type: UI__SEARCH_INPUT_CHANGE,
  payload: { text, urn },
});

const dispatchSearchInputChangeClearAction = (urn: string): SearchInputChangeClearAction => ({
  type: UI__SEARCH_INPUT_CHANGE_CLEAR,
  payload: { urn },
});

const dispatchSearchClearResultsAction = (text: string, urn: string): SearchClearResultsAction => ({
  type: UI__CLEAR_SEARCH_RESULTS,
  payload: { text, urn },
});

const dispatchSearchCancelAction = (text: string, urn: string): SearchCancelAction => ({
  type: UI__SEARCH_CANCEL_CLICK,
  payload: { text, urn },
});

const dispatchSearchBarFocusAction = (): SearchBarFocusAction => ({
  type: UI__SEARCH_BAR_FOCUS,
});

const dispatchFetchMoreSearchResults = (urn: string): DispatchMoreSearchResults => ({
  type: UI__FETCH_MORE_SEARCH_RESULTS,
  payload: { urn },
});

export type DispatchProps = {
  dispatchSearchInputChangeAction: typeof dispatchSearchInputChangeAction;
  dispatchSearchInputChangeClearAction: typeof dispatchSearchInputChangeClearAction;
  dispatchSearchClearResultsAction: typeof dispatchSearchClearResultsAction;
  dispatchSearchCancelAction: typeof dispatchSearchCancelAction;
  dispatchSearchBarFocusAction: typeof dispatchSearchBarFocusAction;
  dispatchFetchMoreSearchResults: typeof dispatchFetchMoreSearchResults;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchSearchInputChangeAction,
  dispatchSearchInputChangeClearAction,
  dispatchSearchClearResultsAction,
  dispatchSearchCancelAction,
  dispatchSearchBarFocusAction,
  dispatchFetchMoreSearchResults,
};
