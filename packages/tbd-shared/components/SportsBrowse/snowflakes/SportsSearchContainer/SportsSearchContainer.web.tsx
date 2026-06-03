import { FunctionComponent, useCallback, useMemo, useState } from "react";
import {
  SearchResultsListOnResultClick,
  SearchBarOnCancelCallback,
  SearchBarOnChangeCallback,
  SearchBarOnFocusCallback,
  PebbleListItem,
} from "@ppb/the-wall-common/types";
import { SearchBar } from "@ppb/the-wall-web/components/walls/SearchBar/SearchBar";
import { SearchResultsList } from "@ppb/the-wall-web/components/rooms/SearchResultsList/SearchResultsList";
import styles from "./SportsSearchContainer.web.css";
import { PebbleList } from "@ppb/the-wall-web";
import { SearchResultsListResult } from "../../map-to-props-factory";
import { useExperimentVariant } from "../../../../experimentation/hooks/useExperimentVariant";
import {
  SEARCH_FILTER_EXPERIMENT_ENABLED_VARIANT,
  SEARCH_FILTER_EXPERIMENT_ID,
  SHOW_ALL_SPORTS_FILTER_ID,
} from "../../../SearchBarCard/constants";
import { i18n } from "../../../../helpers/i18n";

export type SportsSearchContaineri18n = {
  i18n: {
    searchPlaceholder: string;
    cancel: string;
    didYouMeanLabel?: string;
    numberOfResultsLabel?: string;
    noResultsLabel?: string;
  };
};

export type SportsSearchContainerProps = {
  translations: SportsSearchContaineri18n;
  inputSearchTerm: string;
  searchResults: SearchResultsListResult[];
  showSearchResults: boolean;
  onResultClick: SearchResultsListOnResultClick;
  onCancel: SearchBarOnCancelCallback;
  onChange: SearchBarOnChangeCallback;
  onFocusSearchBar: SearchBarOnFocusCallback;
  cleanResults: (text: string) => void;
  onFilterResults: (text: string) => void;
  shouldHandleOnBlur: boolean;
  sportFilters?: PebbleListItem[];
  onInputFocus: (focus: boolean) => void;
  isDesktop?: boolean;
};

export const SportsSearchContainer: FunctionComponent<SportsSearchContainerProps> = ({
  translations,
  inputSearchTerm = "",
  searchResults = [],
  sportFilters = [],
  showSearchResults,
  onResultClick,
  onCancel,
  onChange,
  onFocusSearchBar,
  onFilterResults,
  cleanResults,
  shouldHandleOnBlur,
  onInputFocus,
  isDesktop,
}) => {
  const [selectedSportId, setSelectedSportId] = useState<string>(SHOW_ALL_SPORTS_FILTER_ID);
  const experimentVariant = useExperimentVariant(SEARCH_FILTER_EXPERIMENT_ID);
  const showSportsFilter = !!sportFilters.length && experimentVariant === SEARCH_FILTER_EXPERIMENT_ENABLED_VARIANT;
  const effectiveSelectedSportId = useMemo(
    () => (sportFilters.some(({ id }) => id === selectedSportId) ? selectedSportId : SHOW_ALL_SPORTS_FILTER_ID),
    [selectedSportId, sportFilters],
  );

  const showAllResults = effectiveSelectedSportId === SHOW_ALL_SPORTS_FILTER_ID;

  const filteredSearchResults = useMemo(() => {
    if (showAllResults) return searchResults;

    return searchResults.filter((result) => result.sportId?.toString() === effectiveSelectedSportId);
  }, [effectiveSelectedSportId, searchResults, showAllResults]);

  const filteredTranslations = useMemo(() => {
    if (showAllResults) {
      return translations.i18n;
    }

    return {
      ...translations.i18n,
      numberOfResultsLabel: i18n({
        key: "I18N.SEARCH.RESULTS",
        interpolationValues: {
          numberOfResults: filteredSearchResults.length,
          searchTerm: inputSearchTerm,
        },
      }),
    };
  }, [filteredSearchResults.length, inputSearchTerm, showAllResults, translations.i18n]);

  const handleSelectSportFilter = useCallback(
    (sportId: string) => {
      setSelectedSportId(sportId);
      const sportName = sportFilters.find((filter) => filter.id === sportId)?.text;
      if (sportName) onFilterResults(sportName);
    },
    [onFilterResults, sportFilters],
  );

  const handleFocusChange = useCallback((focus: boolean) => onInputFocus(focus), [onInputFocus]);

  const handleCancel = useCallback((searchText: string) => onCancel(searchText), [onCancel]);

  const handleChange = useCallback(
    (searchText: string) => {
      onChange(searchText);
      if (showAllResults) {
        setSelectedSportId(SHOW_ALL_SPORTS_FILTER_ID);
      }
    },
    [onChange, showAllResults],
  );

  const handleClean = useCallback((searchText: string) => cleanResults(searchText), [cleanResults]);

  const handleInputClick = useCallback(() => onFocusSearchBar(), [onFocusSearchBar]);
  return (
    <>
      <div className={styles.searchBar}>
        <SearchBar
          placeholderLabel={translations.i18n.searchPlaceholder}
          cancelLabel={translations.i18n.cancel}
          onCancel={handleCancel}
          onChange={handleChange}
          onClean={handleClean}
          onFocusChange={handleFocusChange}
          onInputClick={handleInputClick}
          inputSearchTerm={inputSearchTerm}
          shouldHandleOnBlur={shouldHandleOnBlur}
          isDesktop={isDesktop}
        />
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
      </div>
      {showSearchResults && (
        <SearchResultsList i18n={filteredTranslations} results={filteredSearchResults} onResultClick={onResultClick} />
      )}
    </>
  );
};
