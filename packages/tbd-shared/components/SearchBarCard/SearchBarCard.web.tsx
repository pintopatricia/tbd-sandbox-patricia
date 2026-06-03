import { FC, useCallback, useContext, useMemo, useState } from "react";
import { SearchResultsList } from "@ppb/the-wall-web/components/rooms/SearchResultsList/SearchResultsList";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { SearchBar } from "@ppb/the-wall-web/components/walls/SearchBar/SearchBar";
import styles from "./SearchBarCard.web.css";
import { ComponentProps } from "./props";
import { ConfigContext } from "../Config/ConfigContext";
import {
  SEARCH_FILTER_EXPERIMENT_ENABLED_VARIANT,
  SEARCH_FILTER_EXPERIMENT_ID,
  SEARCH_HISTORY_EXPERIMENT_ENABLED_VARIANT,
  SEARCH_HISTORY_EXPERIMENT_ID,
  SHOW_ALL_SPORTS_FILTER_ID,
} from "./constants";
import { PebbleList } from "@ppb/the-wall-web";
import { useExperimentVariant } from "../../experimentation/hooks/useExperimentVariant";
import { SearchBarHistory } from "../SearchBarHistory/SearchBarHistory.web";
import { i18n } from "../../helpers/i18n";
import { getSportsSearchHistory, updateSportsSearchHistory } from "../../helpers/search-history-helper.web";
import { getSearchState, SearchBarState } from "../../helpers/search-bar-state";

// @TODO TBD-EVO revisit this as a part of TBD Evo to move it to the state rather than the component
// to prevent regex injection in the search term
function sanitizeSearchTerm(searchTerm: string): string {
  return searchTerm.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function updateNameWithBoldParts(fullString: string, substring: string): string {
  const sanitizedTerm = sanitizeSearchTerm(substring);
  if (sanitizedTerm === "") return fullString;

  const regex = new RegExp(sanitizedTerm, "gi");

  return fullString.replace(regex, (match) => `<b>${match}</b>`);
}

const SearchBarCard: FC<ComponentProps> = ({
  urn,
  title,
  searchPlaceholder,
  searchResults = [],
  sportFilters = [],
  inputSearchTerm = "",
  dispatchSearchInputChangeAction,
  dispatchSearchBarFocusAction,
  dispatchSearchInputChangeClearAction,
  dispatchSearchBarCancelAction,
  dispatchSearchResultsLinkClick,
  dispatchPushAction,
  dispatchSportsFilterClickAction,
  dispatchHistoryClickAction,
  query,
  shouldHandleOnBlur,
  cancel,
  didYouMeanLabel,
  numberOfResultsLabel,
  noResultsLabel,
  searchHistoryLabel,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { isDesktopLayout } = useContext(ConfigContext);
  const [selectedSportId, setSelectedSportId] = useState<string>(SHOW_ALL_SPORTS_FILTER_ID);

  const historyVariant = useExperimentVariant(SEARCH_HISTORY_EXPERIMENT_ID);
  const isSearchHistoryEnabled = historyVariant === SEARCH_HISTORY_EXPERIMENT_ENABLED_VARIANT;
  const [searchHistory, setSearchHistory] = useState<string[]>(() =>
    isSearchHistoryEnabled ? getSportsSearchHistory() : [],
  );

  const filterVariant = useExperimentVariant(SEARCH_FILTER_EXPERIMENT_ID);
  const showSportsFilter = !!sportFilters.length && filterVariant === SEARCH_FILTER_EXPERIMENT_ENABLED_VARIANT;
  const effectiveSelectedSportId = useMemo(
    () => (sportFilters.some(({ id }) => id === selectedSportId) ? selectedSportId : SHOW_ALL_SPORTS_FILTER_ID),
    [selectedSportId, sportFilters],
  );

  const showAllResults = effectiveSelectedSportId === SHOW_ALL_SPORTS_FILTER_ID;

  const filteredSearchResults = useMemo(
    () =>
      showAllResults
        ? searchResults
        : searchResults.filter((result) => result.sportId?.toString() === effectiveSelectedSportId),
    [effectiveSelectedSportId, searchResults, showAllResults],
  );

  const searchFormattedResults = useMemo(
    () =>
      filteredSearchResults.map((result) => ({
        ...result,
        name: updateNameWithBoldParts(result.name, query),
      })),
    [filteredSearchResults, query],
  );

  const handleSelectSportFilter = useCallback(
    (sportId: string) => {
      setSelectedSportId(sportId);
      const sportName = sportFilters.find((filter) => filter.id === sportId)?.text;
      if (sportName) dispatchSportsFilterClickAction(sportName, inputSearchTerm);
    },
    [dispatchSportsFilterClickAction, inputSearchTerm, sportFilters],
  );

  const viewState = useMemo(
    () => getSearchState(isFocused, inputSearchTerm, searchHistory.length > 0),
    [isFocused, inputSearchTerm, searchHistory.length],
  );

  const updateHistory = useCallback(
    (term: string) => {
      if (!isSearchHistoryEnabled) return;

      updateSportsSearchHistory(term);
      setSearchHistory(getSportsSearchHistory());
    },
    [isSearchHistoryEnabled],
  );

  const handleInputChange = useCallback(
    (searchTerm: string) => {
      dispatchSearchInputChangeAction(searchTerm, urn);
      if (showAllResults) setSelectedSportId(SHOW_ALL_SPORTS_FILTER_ID);
    },
    [dispatchSearchInputChangeAction, showAllResults, urn],
  );

  const handleFocus = useCallback((focusState: boolean) => setIsFocused(focusState), []);

  const handleInputClick = useCallback(() => {
    dispatchSearchBarFocusAction();
  }, [dispatchSearchBarFocusAction]);

  const handleOnCancel = useCallback(
    (text: string) => {
      setIsFocused(false);
      dispatchSearchBarCancelAction(text, urn);
    },
    [dispatchSearchBarCancelAction, urn],
  );

  const handleOnClean = useCallback(
    (text: string) => {
      dispatchSearchInputChangeClearAction(text, urn);
    },
    [dispatchSearchInputChangeClearAction, urn],
  );

  const onSearchResultClick = useCallback(
    (viewLink: ViewLink, index: number, name: string) => {
      dispatchSearchResultsLinkClick(query, viewLink, index, name, searchResults.length, isDesktopLayout);
      dispatchPushAction(viewLink);
      updateHistory(inputSearchTerm.trim());
    },
    [
      dispatchSearchResultsLinkClick,
      dispatchPushAction,
      updateHistory,
      query,
      isDesktopLayout,
      searchResults.length,
      inputSearchTerm,
    ],
  );
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

  const onHistoryClick = useCallback(
    (searchTerm: string) => {
      dispatchHistoryClickAction(searchTerm);
      dispatchSearchInputChangeAction(searchTerm, urn);
      updateHistory(searchTerm);
    },
    [dispatchHistoryClickAction, dispatchSearchInputChangeAction, updateHistory, urn],
  );

  const onHistoryContainerPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Prevent blur on pointer down so the history item click can be processed
    // before the search history disappears.
    e.preventDefault();
  }, []);

  return (
    <div className={`${styles.searchBarCardContainer}`}>
      <h2 className={`${styles.searchTitle} typography-h380`}>{title}</h2>
      <div>
        <SearchBar
          isDesktop={isDesktopLayout}
          cancelLabel={cancel}
          placeholderLabel={searchPlaceholder}
          onClean={handleOnClean}
          onChange={handleInputChange}
          onFocusChange={handleFocus}
          onCancel={handleOnCancel}
          shouldHandleOnBlur={shouldHandleOnBlur}
          inputSearchTerm={inputSearchTerm}
          onInputClick={handleInputClick}
        />

        {viewState === SearchBarState.RESULTS && (
          <>
            {showSportsFilter && (
          <div className={styles.filtersContainer}>
            <PebbleList
              items={sportFilters}
              defaultSelectedPebble={SHOW_ALL_SPORTS_FILTER_ID}
              onPebbleClick={handleSelectSportFilter}
              selectedPebble={sportFilters.length === 1 ? sportFilters[0].id : effectiveSelectedSportId}
                />
              </div>
            )}
            <SearchResultsList i18n={i18nLabels} results={searchFormattedResults} onResultClick={onSearchResultClick} />
          </>
        )}
        {viewState === SearchBarState.HISTORY && (
          <div onPointerDown={onHistoryContainerPointerDown} role="presentation">
            <SearchBarHistory
              historyLabel={searchHistoryLabel}
              onHistoryClick={onHistoryClick}
              searchHistory={searchHistory}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBarCard;
