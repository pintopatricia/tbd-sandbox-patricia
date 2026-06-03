import { FunctionComponent, useCallback, useMemo, useState } from "react";
import { INPUT_LENGTH_SEARCH_TRIGGER } from "@ppb/tbd-store/config/common-config";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { SportsSearchContainer } from "./snowflakes/SportsSearchContainer/SportsSearchContainer.web";
import { ComponentProps } from "./props";
import ConnectedCard from "../Card";
import Card from "../Card/Card.web";
import { SEARCH_HISTORY_EXPERIMENT_ENABLED_VARIANT, SEARCH_HISTORY_EXPERIMENT_ID } from "../SearchBarCard/constants";
import styles from "./SportsBrowse.web.css";
import { useExperimentVariant } from "../../experimentation/hooks/useExperimentVariant";
import { getSportsSearchHistory, updateSportsSearchHistory } from "../../helpers/search-history-helper.web";
import { getSearchState, SearchBarState } from "../../helpers/search-bar-state";
import { SearchBarHistory } from "../SearchBarHistory/SearchBarHistory.web";

// to prevent regex injection in the search term
function sanitizeSearchTerm(searchTerm: string): string {
  return searchTerm.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function updateNameWithBoldParts(fullString: string, substring: string): string {
  try {
    const regex = new RegExp(sanitizeSearchTerm(substring), "gi");
    return fullString.replace(regex, (match) => `<b>${match}</b>`);
  } catch {
    return fullString;
  }
}

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
  shouldHandleOnBlur,
  isDesktop = false,
  dispatchPushAction,
  dispatchSearchInputChangeAction,
  dispatchSearchInputChangeClearAction,
  dispatchSearchClearResultsAction,
  dispatchSearchLinkClick,
  dispatchSearchCancelAction,
  dispatchSearchBarFocusAction,
  dispatchSportsFilterClickAction,
  dispatchHistoryClickAction,
}) => {
  const historyVariant = useExperimentVariant(SEARCH_HISTORY_EXPERIMENT_ID);
  const isSearchHistoryEnabled = historyVariant === SEARCH_HISTORY_EXPERIMENT_ENABLED_VARIANT;

  const searchFormattedResults = useMemo(
    () =>
      searchResults.map((result) => ({
        ...result,
        name: updateNameWithBoldParts(result.name, query),
      })),
    [searchResults, query],
  );

  const translations = useMemo(
    () => ({
      i18n: {
        searchPlaceholder,
        cancel,
        didYouMeanLabel,
        numberOfResultsLabel,
        noResultsLabel,
      },
    }),
    [cancel, didYouMeanLabel, noResultsLabel, numberOfResultsLabel, searchPlaceholder],
  );

  const [inputFocused, onInputFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(() =>
    isSearchHistoryEnabled ? getSportsSearchHistory() : [],
  );

  const searchState = useMemo(
    () => getSearchState(inputFocused, inputSearchTerm, searchHistory.length > 0),
    [inputFocused, inputSearchTerm, searchHistory.length],
  );

  const updateHistory = useCallback(
    (term: string) => {
      if (!isSearchHistoryEnabled) return;

      updateSportsSearchHistory(term);
      setSearchHistory(getSportsSearchHistory());
    },
    [isSearchHistoryEnabled],
  );

  const onSearchChange = useCallback(
    (text: string) => {
      dispatchSearchInputChangeAction(text, urn);
      if (text.length < INPUT_LENGTH_SEARCH_TRIGGER) {
        dispatchSearchInputChangeClearAction(urn);
      }
    },
    [dispatchSearchInputChangeAction, dispatchSearchInputChangeClearAction, urn],
  );

  const onCleanResults = useCallback(
    (text: string) => {
      dispatchSearchClearResultsAction(text, urn);
    },
    [dispatchSearchClearResultsAction, urn],
  );

  const onResultClick = useCallback(
    (viewLink: ViewLink, index: number, name: string) => {
      dispatchSearchLinkClick(query, viewLink, index, name, searchResults.length, isDesktop);
      dispatchPushAction(viewLink);
      updateHistory(inputSearchTerm.trim());
    },
    [
      dispatchSearchLinkClick,
      dispatchPushAction,
      updateHistory,
      query,
      isDesktop,
      searchResults.length,
      inputSearchTerm,
    ],
  );

  const onCancel = useCallback(
    (text: string) => {
      if (urn) {
        dispatchSearchCancelAction(text, urn);
      }
    },
    [dispatchSearchCancelAction, urn],
  );

  const onFilterResults = useCallback(
    (sportId: string) => {
      dispatchSportsFilterClickAction(sportId, inputSearchTerm);
    },
    [dispatchSportsFilterClickAction, inputSearchTerm],
  );

  const onFocusSearchBar = useCallback(() => {
    onInputFocused(true);
    dispatchSearchBarFocusAction();
  }, [dispatchSearchBarFocusAction]);

  const onHistoryClick = useCallback(
    (searchTerm: string) => {
      dispatchHistoryClickAction(searchTerm);
      dispatchSearchInputChangeAction(searchTerm, urn);
      updateHistory(searchTerm);
    },
    [dispatchSearchInputChangeAction, dispatchHistoryClickAction, updateHistory, urn],
  );

  const onHistoryContainerPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Prevent blur on pointer down so the history item click can be processed
    // before the search history disappears.
    e.preventDefault();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <SportsSearchContainer
          inputSearchTerm={inputSearchTerm}
          translations={translations}
          searchResults={searchFormattedResults}
          showSearchResults={searchState === SearchBarState.RESULTS}
          sportFilters={sportFilters}
          onResultClick={onResultClick}
          onCancel={onCancel}
          onChange={onSearchChange}
          onFocusSearchBar={onFocusSearchBar}
          onFilterResults={onFilterResults}
          cleanResults={onCleanResults}
          shouldHandleOnBlur={shouldHandleOnBlur}
          onInputFocus={onInputFocused}
          isDesktop={isDesktop}
        />
        {searchState === SearchBarState.HISTORY && (
          <div onPointerDown={onHistoryContainerPointerDown} role="presentation">
            <SearchBarHistory
              historyLabel={searchHistoryLabel}
              onHistoryClick={onHistoryClick}
              searchHistory={searchHistory}
            />
          </div>
        )}
      </div>

      {searchState === SearchBarState.IDLE &&
        items?.map(({ urn: cardUrn, typename }, index) => (
          <ConnectedCard key={`${cardUrn}-${index}`} urn={cardUrn} component={Card} typename={typename} />
        ))}
    </div>
  );
};

export default SportsBrowse;
