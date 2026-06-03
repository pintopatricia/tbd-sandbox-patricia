import { FunctionComponent, useCallback, useState } from "react";
import classnames from "classnames";
import { PebbleListItem } from "@ppb/the-wall-common/types";
import { Divider, PebbleList, Styled } from "@ppb/the-wall-web";
import { SearchBar } from "@ppb/the-wall-web/components/walls/SearchBar/SearchBar";
import styles from "./GamingSearchContainer.web.css";
import { GamingSearchContainerProps } from "./GamingSearchContainer.types";
import { getGamingSearchHistory } from "../../../../helpers/search-history-helper.web";

function canShowResults(numberOfResults: number, inputSearchTerm: string): boolean {
  return numberOfResults > 0 && inputSearchTerm.length > 2;
}

export const GamingSearchContainer: FunctionComponent<GamingSearchContainerProps> = ({
  containers,
  translations,
  inputSearchTerm = "",
  numberOfResults,
  isGamingZone,
  onCancel,
  onChange,
  onFocusSearchBar,
  onSearchHistoryPebbleClick,
  cleanResults,
  shouldHandleOnBlur,
  shouldDisplaySearchHistory,
}) => {
  const resultsAvailability = canShowResults(numberOfResults, inputSearchTerm);
  const [showResults, setShowResults] = useState(resultsAvailability);

  const handleFocusChange = useCallback(
    (focus: boolean) => {
      setShowResults(focus || !!inputSearchTerm);
    },
    [inputSearchTerm, setShowResults],
  );

  const handleCancel = useCallback(
    (searchText: string) => {
      onCancel(searchText);
    },
    [onCancel],
  );

  const handleChange = useCallback(
    (searchText: string) => {
      setShowResults(true);
      onChange(searchText);
    },
    [onChange],
  );

  const handleClean = useCallback(
    (searchText: string) => {
      cleanResults(searchText);
    },
    [cleanResults],
  );

  const handlePebbleClick = useCallback(
    (searchText: string) => {
      setShowResults(true);
      onChange(searchText);
      onSearchHistoryPebbleClick?.(searchText);
    },
    [onChange, onSearchHistoryPebbleClick],
  );

  const handleInputClick = useCallback(() => {
    onFocusSearchBar();
  }, [onFocusSearchBar]);

  const containerClasses = classnames(styles.container, {
    [styles.gaming]: isGamingZone,
  });

  const searchBarClasses = classnames({
    [styles.searchBar]: !isGamingZone,
    [styles.searchBarGaming]: isGamingZone,
  });

  const searchResultsContainerClasses = classnames({
    [styles.searchResultsContainer]: !isGamingZone,
    [styles.searchResultsGamingContainer]: isGamingZone,
  });

  const noResultsLabelClasses = classnames({
    [styles.noResultsLabel]: !isGamingZone,
    [styles.noResultsLabelGaming]: isGamingZone,
  });

  const outOfIdeasLabelClasses = classnames({
    [styles.outOfIdeasLabel]: !isGamingZone,
    [styles.outOfIdeasLabelGaming]: isGamingZone,
  });

  const shouldShowOutOfIdeas =
    !isGamingZone &&
    (inputSearchTerm.length === 0 || // initial view
      (inputSearchTerm.length > 0 && numberOfResults === 0)); // typing AND there are no results

  const shouldDisplayOutOfIdeasLabel = shouldShowOutOfIdeas && !translations.i18n.noResultsLabel;
  const searchHistory: PebbleListItem[] = getGamingSearchHistory().map((item, index) => ({
    text: item,
    id: index.toString(),
    limitNoOfCharacters: true,
  }));

  return (
    <div className={containerClasses}>
      <div className={searchBarClasses}>
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
          isGamingZone={isGamingZone}
          persistCancelButton={!containers.default}
          autofocus={true}
        />
      </div>
      {!showResults && containers.default && <div className={styles.defaultContainer}>{containers.default}</div>}
      {shouldDisplaySearchHistory && searchHistory.length > 0 && (
        <div className={styles.searchHistoryContainer}>
          <p className={styles.searchHistoryLabel}> {translations.i18n.searchHistoryLabel}</p>
          <div className={styles.searchHistoryPebblesContainer}>
            <PebbleList
              isDesktopLayout
              items={searchHistory}
              defaultSelectedPebble=""
              onPebbleClick={(event: string) => handlePebbleClick(searchHistory[parseInt(event, 10)].text)}
            />
          </div>
          <Divider />
        </div>
      )}
      {resultsAvailability && numberOfResults > 0 && (
        <div className={searchResultsContainerClasses}>
          {translations.i18n.numberOfResultsLabel && (
            <p className={`typography-h120 ${styles.numberOfResultsLabel}`}>
              <Styled
                translation={translations.i18n.numberOfResultsLabel}
                styles={{ highlighted: "typography-h180" }}
              />
            </p>
          )}
          {containers.searchResults}
        </div>
      )}
      {numberOfResults === 0 && (showResults || isGamingZone) && (
        <>
          {translations.i18n.noResultsLabel && (
            <p className={`typography-h120 ${noResultsLabelClasses}`}>{translations.i18n.noResultsLabel}</p>
          )}
          <div className={styles.recommendedGamesWrapper}>
            {(shouldDisplayOutOfIdeasLabel || isGamingZone) && translations.i18n.outOfIdeasLabel && (
              <p className={`typography-h120 ${outOfIdeasLabelClasses}`}>{translations.i18n.outOfIdeasLabel}</p>
            )}
            <div className={styles.recommendedGamesContainer}>{containers.recommendedGames}</div>
          </div>
        </>
      )}
    </div>
  );
};
