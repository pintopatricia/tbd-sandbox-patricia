import { FunctionComponent, useCallback, useState, useMemo, useEffect } from "react";
import { View } from "react-native";
import { INPUT_LENGTH_SEARCH_TRIGGER } from "@ppb/tbd-store/config/common-config";
import { PebbleList, SearchBar } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { SearchResultsList } from "@ppb/the-wall-native/components/SearchResultsList/SearchResultsList";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { navigate } from "@ppb/tbd-router/native";
import { ComponentProps } from "./props";
import ConnectedCard from "../Card";
import Card from "../Card/Card.native";
import styles from "./SportsBrowse.native.styles";
import {
  SPORTS_BROWSE,
  SPORTS_BROWSE_SEARCH_CONTAINER,
  SPORTS_BROWSE_SEARCH_BAR,
} from "./SportsBrowse.native.selectors";
import {
  SEARCH_FILTER_EXPERIMENT_ENABLED_VARIANT,
  SEARCH_FILTER_EXPERIMENT_ID,
  SEARCH_HISTORY_EXPERIMENT_ENABLED_VARIANT,
  SEARCH_HISTORY_EXPERIMENT_ID,
  SHOW_ALL_SPORTS_FILTER_ID,
} from "../SearchBarCard/constants";
import { SearchBarHistory } from "../SearchBarHistory/SearchBarHistory.native";
import { useExperimentVariant } from "../../experimentation/hooks/useExperimentVariant";
import { i18n } from "../../helpers/i18n";
import { getSearchState, SearchBarState } from "../../helpers/search-bar-state";
import { getSportsSearchHistory, updateSportsSearchHistory } from "../../helpers/search-history-helper.native";

const SportsBrowse: FunctionComponent<ComponentProps> = ({
  urn,
  items,
  searchResults,
  query,
  inputSearchTerm,
  searchPlaceholder,
  sportFilters = [],
  cancel,
  didYouMeanLabel,
  numberOfResultsLabel,
  noResultsLabel,
  searchHistoryLabel,
  dispatchSearchInputChangeAction,
  dispatchSearchInputChangeClearAction,
  dispatchSearchClearResultsAction,
  dispatchSportsFilterClickAction,
  dispatchSearchLinkClick,
  dispatchSearchCancelAction,
  dispatchSearchBarFocusAction,
  dispatchHistoryClickAction,
}) => {
  const historyVariant = useExperimentVariant(SEARCH_HISTORY_EXPERIMENT_ID);
  const isSearchHistoryEnabled = historyVariant === SEARCH_HISTORY_EXPERIMENT_ENABLED_VARIANT;

  const filterVariant = useExperimentVariant(SEARCH_FILTER_EXPERIMENT_ID);
  const showSportsFilter = !!sportFilters.length && filterVariant === SEARCH_FILTER_EXPERIMENT_ENABLED_VARIANT;

  const [searchText, setSearchText] = useState(inputSearchTerm);
  const [isFocused, setIsFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedSportId, setSelectedSportId] = useState<string>(SHOW_ALL_SPORTS_FILTER_ID);

  const effectiveSelectedSportId = useMemo(
    () => (sportFilters.some(({ id }) => id === selectedSportId) ? selectedSportId : SHOW_ALL_SPORTS_FILTER_ID),
    [selectedSportId, sportFilters],
  );

  const showAllResults = effectiveSelectedSportId === SHOW_ALL_SPORTS_FILTER_ID;

  const loadHistory = useCallback(async () => {
    if (!isSearchHistoryEnabled) return;
    const data = await getSportsSearchHistory();
    setSearchHistory(data);
  }, [isSearchHistoryEnabled]);

  useEffect(() => {
    if (!isFocused) {
      requestAnimationFrame(() => {
        setSearchText(inputSearchTerm);
      });
    }
  }, [inputSearchTerm, isFocused]);

  const updateHistory = useCallback(
    async (term: string) => {
      if (!isSearchHistoryEnabled) return;
      await updateSportsSearchHistory(term);
    },
    [isSearchHistoryEnabled],
  );

  const viewState = useMemo(
    () => getSearchState(isFocused, inputSearchTerm, searchHistory.length > 0),
    [isFocused, inputSearchTerm, searchHistory.length],
  );

  const filteredSearchResults = useMemo(() => {
    if (showAllResults) return searchResults;

    return searchResults.filter((result) => {
      return result.sportId?.toString() === effectiveSelectedSportId;
    });
  }, [effectiveSelectedSportId, searchResults, showAllResults]);

  const searchResultsI18n = useMemo(() => {
    const baseLabels = {
      didYouMeanLabel,
      numberOfResultsLabel,
      noResultsLabel,
    };

    if (showAllResults) return baseLabels;

    return {
      ...baseLabels,
      numberOfResultsLabel: i18n({
        key: "I18N.SEARCH.RESULTS",
        interpolationValues: {
          numberOfResults: filteredSearchResults.length,
          searchTerm: query,
        },
      }),
    };
  }, [didYouMeanLabel, filteredSearchResults.length, noResultsLabel, numberOfResultsLabel, query, showAllResults]);

  const handleSelectSportFilter = useCallback(
    (sportId: string) => {
      setSelectedSportId(sportId);
      const selectedFilter = sportFilters.find((filter) => filter.id === sportId);
      if (selectedFilter) dispatchSportsFilterClickAction(selectedFilter.text, inputSearchTerm);
    },
    [dispatchSportsFilterClickAction, inputSearchTerm, sportFilters],
  );

  const onSearchFocus = useCallback(
    (focusState: boolean) => {
      setIsFocused(focusState);
      if (focusState) loadHistory();
    },
    [loadHistory],
  );

  const onSearchChange = useCallback(
    (text: string) => {
      setSearchText(text);
      dispatchSearchInputChangeAction(text, urn);
      if (text.length < INPUT_LENGTH_SEARCH_TRIGGER) {
        dispatchSearchInputChangeClearAction(urn);
      }
      if (showAllResults) setSelectedSportId(SHOW_ALL_SPORTS_FILTER_ID);
    },
    [dispatchSearchInputChangeAction, dispatchSearchInputChangeClearAction, showAllResults, urn],
  );

  const onCleanResults = useCallback(
    (text: string) => {
      setSearchText("");
      dispatchSearchClearResultsAction(text, urn);
      loadHistory();
    },
    [dispatchSearchClearResultsAction, loadHistory, urn],
  );

  const onResultPress = useCallback(
    (viewLink: ViewLink, index: number, name: string) => {
      dispatchSearchLinkClick(query, viewLink, index, name, searchResults.length);
      updateHistory(inputSearchTerm.trim());
      navigate(viewLink);
    },
    [dispatchSearchLinkClick, updateHistory, query, searchResults.length, inputSearchTerm],
  );

  const onCancel = useCallback(
    (text: string) => {
      setSearchText("");
      if (urn) {
        dispatchSearchCancelAction(text, urn);
      }
    },
    [dispatchSearchCancelAction, urn],
  );

  const onFocusSearchBar = useCallback(() => {
    setIsFocused(true);
    dispatchSearchBarFocusAction();
  }, [dispatchSearchBarFocusAction]);

  const onHistoryClick = useCallback(
    (searchTerm: string) => {
      setSearchText(searchTerm);
      dispatchHistoryClickAction(searchTerm);
      dispatchSearchInputChangeAction(searchTerm, urn);
      updateHistory(searchTerm);
    },
    [dispatchSearchInputChangeAction, dispatchHistoryClickAction, updateHistory, urn],
  );

  return (
    <View {...getTestProps(SPORTS_BROWSE, false)}>
      <View style={styles.searchContainer} {...getTestProps(SPORTS_BROWSE_SEARCH_CONTAINER, false)}>
        <View {...getTestProps(SPORTS_BROWSE_SEARCH_BAR, false)}>
          <SearchBar
            placeholderLabel={searchPlaceholder}
            cancelLabel={cancel}
            inputSearchTerm={searchText}
            onCancel={onCancel}
            onClean={onCleanResults}
            onChange={onSearchChange}
            onFocusChange={onSearchFocus}
            onInputClick={onFocusSearchBar}
          />
        </View>

        {viewState === SearchBarState.RESULTS && (
          <>
            {showSportsFilter && (
              <View style={styles.filtersContainer}>
                <PebbleList
                  items={sportFilters}
                  defaultSelectedPebble={SHOW_ALL_SPORTS_FILTER_ID}
                  onPebblePress={handleSelectSportFilter}
                  selectedPebble={sportFilters.length === 1 ? sportFilters[0].id : effectiveSelectedSportId}
                />
              </View>
            )}
            <SearchResultsList i18n={searchResultsI18n} results={filteredSearchResults} onResultClick={onResultPress} />
          </>
        )}
        {viewState === SearchBarState.HISTORY && (
          <SearchBarHistory
            historyLabel={searchHistoryLabel}
            onHistoryClick={onHistoryClick}
            searchHistory={searchHistory}
          />
        )}
      </View>
      {viewState === SearchBarState.IDLE &&
        items?.map(({ urn: cardUrn, typename }) => (
          <ConnectedCard key={cardUrn} urn={cardUrn} component={Card} typename={typename} visible={true} />
        ))}
    </View>
  );
};

export default SportsBrowse;
