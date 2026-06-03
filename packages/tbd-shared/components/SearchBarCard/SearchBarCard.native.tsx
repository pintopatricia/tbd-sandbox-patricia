import { FC, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { navigate } from "@ppb/tbd-router/native";
import { Text, SearchBar, PebbleList } from "@ppb/the-wall-native";
import { SearchResultsList } from "@ppb/the-wall-native/components/SearchResultsList/SearchResultsList";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { ConfigContext } from "../Config/ConfigContext";
import styles from "./SearchBarCard.native.styles";
import { ComponentProps } from "./props";
import {
  SEARCH_FILTER_EXPERIMENT_ENABLED_VARIANT,
  SEARCH_FILTER_EXPERIMENT_ID,
  SEARCH_HISTORY_EXPERIMENT_ENABLED_VARIANT,
  SEARCH_HISTORY_EXPERIMENT_ID,
  SHOW_ALL_SPORTS_FILTER_ID,
} from "./constants";
import { useExperimentVariant } from "../../experimentation/hooks/useExperimentVariant";
import { SearchBarHistory } from "../SearchBarHistory/SearchBarHistory.native";
import { i18n } from "../../helpers/i18n";
import { getSportsSearchHistory, updateSportsSearchHistory } from "../../helpers/search-history-helper.native";
import { getSearchState, SearchBarState } from "../../helpers/search-bar-state";

const SearchBarCard: FC<ComponentProps> = ({
  urn,
  title,
  searchPlaceholder,
  cancel,
  inputSearchTerm,
  didYouMeanLabel,
  numberOfResultsLabel,
  noResultsLabel,
  searchHistoryLabel,
  searchResults = [],
  sportFilters = [],
  query,
  dispatchSearchInputChangeClearAction,
  dispatchSearchBarFocusAction,
  dispatchSearchInputChangeAction,
  dispatchSearchResultsLinkClick,
  dispatchSearchBarCancelAction,
  dispatchSportsFilterClickAction,
  dispatchHistoryClickAction,
}) => {
  const historyVariant = useExperimentVariant(SEARCH_HISTORY_EXPERIMENT_ID);
  const isSearchHistoryEnabled = historyVariant === SEARCH_HISTORY_EXPERIMENT_ENABLED_VARIANT;

  const filterVariant = useExperimentVariant(SEARCH_FILTER_EXPERIMENT_ID);
  const showSportsFilter = !!sportFilters.length && filterVariant === SEARCH_FILTER_EXPERIMENT_ENABLED_VARIANT;

  const [searchText, setSearchText] = useState(inputSearchTerm);
  const [selectedSportId, setSelectedSportId] = useState<string>(SHOW_ALL_SPORTS_FILTER_ID);
  const [isFocused, setIsFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const { isDesktopLayout } = useContext(ConfigContext);

  useEffect(() => {
    if (!isFocused) {
      requestAnimationFrame(() => {
        setSearchText(inputSearchTerm);
      });
    }
  }, [inputSearchTerm, isFocused]);

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

  const i18nLabels = useMemo(() => {
    const labels = {
      didYouMeanLabel,
      numberOfResultsLabel,
      noResultsLabel,
    };

    // If not filtering, return the default labels
    if (showAllResults) return labels;

    const filteredNumberOfResultsLabel = i18n({
      key: "I18N.SEARCH.RESULTS",
      interpolationValues: {
        numberOfResults: filteredSearchResults.length,
        searchTerm: query,
      },
    });

    return {
      ...labels,
      numberOfResultsLabel: filteredNumberOfResultsLabel,
    };
  }, [didYouMeanLabel, numberOfResultsLabel, noResultsLabel, showAllResults, filteredSearchResults.length, query]);

  const handleSelectSportFilter = useCallback(
    (sportId: string) => {
      setSelectedSportId(sportId);
      const selectedFilter = sportFilters.find((filter) => filter.id === sportId);
      if (selectedFilter) dispatchSportsFilterClickAction(selectedFilter.text, inputSearchTerm);
    },
    [dispatchSportsFilterClickAction, inputSearchTerm, sportFilters],
  );

  const handleInputChange = useCallback(
    (searchTerm: string) => {
      setSearchText(searchTerm);
      dispatchSearchInputChangeAction(searchTerm, urn);
      if (showAllResults) setSelectedSportId(SHOW_ALL_SPORTS_FILTER_ID);
    },
    [dispatchSearchInputChangeAction, showAllResults, urn],
  );

  const handleFocus = useCallback(
    (focusState: boolean) => {
      setIsFocused(focusState);
      if (focusState) loadHistory();
    },
    [loadHistory],
  );

  const handleOnCancel = useCallback(
    (text: string) => {
      setIsFocused(false);
      setSearchText("");
      dispatchSearchBarCancelAction(text, urn);
    },
    [dispatchSearchBarCancelAction, urn],
  );

  const handleOnClean = useCallback(
    (text: string) => {
      setSearchText("");
      dispatchSearchInputChangeClearAction(text, urn);
      loadHistory();
    },
    [dispatchSearchInputChangeClearAction, loadHistory, urn],
  );

  const handleInputClick = useCallback(() => {
    dispatchSearchBarFocusAction();
  }, [dispatchSearchBarFocusAction]);

  const onSearchResultClick = useCallback(
    (viewLink: ViewLink, index: number, name: string) => {
      dispatchSearchResultsLinkClick(query, viewLink, index, name, searchResults.length, isDesktopLayout);
      updateHistory(inputSearchTerm.trim());
      navigate(viewLink);
    },
    [dispatchSearchResultsLinkClick, updateHistory, query, isDesktopLayout, searchResults.length, inputSearchTerm],
  );

  const onHistoryClick = useCallback(
    (searchTerm: string) => {
      setSearchText(searchTerm);
      dispatchHistoryClickAction(searchTerm);
      dispatchSearchInputChangeAction(searchTerm, urn);
      updateHistory(searchTerm);
    },
    [dispatchHistoryClickAction, dispatchSearchInputChangeAction, updateHistory, urn],
  );

  return (
    <View style={styles.searchContainer}>
      <Text style={styles.title}>{title}</Text>
      <SearchBar
        placeholderLabel={searchPlaceholder}
        cancelLabel={cancel}
        inputSearchTerm={searchText}
        onCancel={handleOnCancel}
        onClean={handleOnClean}
        onChange={handleInputChange}
        onFocusChange={handleFocus}
        onInputClick={handleInputClick}
      />
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
          <SearchResultsList i18n={i18nLabels} results={filteredSearchResults} onResultClick={onSearchResultClick} />
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
  );
};

export default SearchBarCard;
