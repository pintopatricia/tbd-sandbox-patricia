import { FunctionComponent, useCallback, useMemo, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { SearchBar, Overlay } from "@ppb/the-wall-web";
import classnames from "classnames";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { INPUT_LENGTH_SEARCH_TRIGGER } from "@ppb/tbd-store/config/common-config";
import { GamingSearchResultItem } from "@ppb/tbd-store/state/layout/gaming-search/GamingSearch.types";
import { GamingSearchContainer } from "./snowflakes/GamingSearchContainer/GamingSearchContainer.web";
import { GameTileContainer } from "../GamesCardGroup/snowflakes/GameTileContainer/GameTileContainer.web";
import { GameTileContainerLayout } from "../GamesCardGroup/snowflakes/GameTileContainer/GameTileContainerLayout.types";
import { ComponentProps } from "./props";
import styles from "./GamingSearchZone.web.css";
import ConnectedGameCard from "../GameCard";
import GameCard from "../GameCard/GameCard.web";
import GameCardPlaceholder from "../GameCard/GameCardPlaceholder.web";
import SwimlaneCardGroupPlaceholder from "../SwimlaneCardGroup/SwimlaneCardGroupPlaceholder.web";
import GamingCardGroup from "../GamingCardGroup/GamingCardGroup.web";
import ConnectedGamingCardGroup from "../GamingCardGroup";
import { useInfiniteScroll } from "../../hooks";
import { useScrollForSearchBar } from "../../hooks/useScrollForSearchBar.web";

const LOADING_PLACEHOLDER_COUNT = 10;

function renderContainers(
  containers: { recommendedGames: PartialItem },
  results: GamingSearchResultItem[],
  numberOfResults: number,
  ref: any,
  isLoadingMore: boolean,
): any {
  return {
    recommendedGames: containers.recommendedGames?.urn && (
      <ConnectedGamingCardGroup
        component={GamingCardGroup}
        urn={containers.recommendedGames?.urn}
        isTitleHidden={true}
        placeholder={SwimlaneCardGroupPlaceholder}
      />
    ),
    searchResults:
      results.length > 0 ? (
        <div ref={ref} className={classnames(styles.resultsContainer)}>
          {results.map((result: GamingSearchResultItem, index: number) => {
            const isFirstOddElement = numberOfResults % 2 === 1 && index === 0;
            return (
              <div
                className={classnames(styles.gameContainer, { [styles.rectangleResult]: isFirstOddElement })}
                key={`${result}-${index}`}
              >
                <GameTileContainer
                  layout={isFirstOddElement ? GameTileContainerLayout.RECTANGLE : GameTileContainerLayout.SQUARE}
                >
                  <ConnectedGameCard
                    component={GameCard}
                    urn={result.urn}
                    isRoundGameTile={false}
                    placeholder={GameCardPlaceholder}
                  />
                </GameTileContainer>
              </div>
            );
          })}
          {isLoadingMore &&
            Array.from({ length: LOADING_PLACEHOLDER_COUNT }).map((_, i) => (
              <div className={classnames(styles.gameContainer)} key={`placeholder-${i}`}>
                <GameTileContainer layout={GameTileContainerLayout.SQUARE}>
                  <GameCardPlaceholder />
                </GameTileContainer>
              </div>
            ))}
        </div>
      ) : null,
  };
}

const GamingSearchZone: FunctionComponent<ComponentProps> = ({
  urn,
  recommendedGames,
  inputSearchTerm,
  numberOfResults,
  shouldHandleOnBlur,
  searchPlaceholder,
  cancel,
  outOfIdeasLabel,
  noResultsLabel,
  numberOfResultsLabel,
  results,
  pinGamingSearch,
  isLoadingMore,
  dispatchGamingSearchInputChangeAction,
  dispatchGamingSearchInputChangeClearAction,
  dispatchGamingSearchBarFocusAction,
  dispatchGamingSearchCancelAction,
  dispatchPebbleSearchHistoryClickAction,
  dispatchGamingSearchClearResultsAction,
  dispatchFetchMoreGamingSearchResults,
  shouldDisplaySearchHistory,
  searchHistoryLabel,
  scrollForSearchBar,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const isSearchBarVisible = useScrollForSearchBar(!!scrollForSearchBar);
  const isLargeScreen = window.innerWidth > 900;

  const fetchMoreSearchResults = useCallback((): void => {
    if (!isLoadingMore) {
      dispatchFetchMoreGamingSearchResults(urn);
    }
  }, [dispatchFetchMoreGamingSearchResults, urn, isLoadingMore]);

  const { scrollViewRef } = useInfiniteScroll<HTMLDivElement>(fetchMoreSearchResults);

  const translations = useMemo(
    () => ({
      i18n: {
        searchPlaceholder,
        cancel,
        outOfIdeasLabel,
        noResultsLabel,
        numberOfResultsLabel,
        searchHistoryLabel,
      },
    }),
    [cancel, noResultsLabel, numberOfResultsLabel, outOfIdeasLabel, searchPlaceholder, searchHistoryLabel],
  );

  useEffect(() => {
    if (isFocused) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      if (isFocused) {
        document.body.style.overflow = "unset";
      }
    };
  }, [isFocused]);

  const onFocusSearchBar = useCallback(
    () => dispatchGamingSearchBarFocusAction(),
    [dispatchGamingSearchBarFocusAction],
  );

  const onFocusSearchBarHomepage = useCallback(() => {
    setIsFocused((prevState) => !prevState);
  }, []);

  const onSearchHistoryPebbleClick = useCallback(
    (text: string) => {
      dispatchPebbleSearchHistoryClickAction(text);
    },
    [dispatchPebbleSearchHistoryClickAction],
  );

  const handleInputChange = useCallback(
    (text: string) => {
      dispatchGamingSearchInputChangeAction(text, urn);
      if (text.length < INPUT_LENGTH_SEARCH_TRIGGER) {
        dispatchGamingSearchInputChangeClearAction(urn);
      }
    },
    [dispatchGamingSearchInputChangeAction, urn, dispatchGamingSearchInputChangeClearAction],
  );

  const onCleanResults = useCallback(
    (text: string) => {
      dispatchGamingSearchClearResultsAction(text, urn);
    },
    [dispatchGamingSearchClearResultsAction, urn],
  );

  const onCancel = useCallback(
    (text: string) => {
      setIsFocused((prevState) => !prevState);
      dispatchGamingSearchCancelAction(text, urn);
    },
    [dispatchGamingSearchCancelAction, urn],
  );
  const overlayClass = isLargeScreen ? styles.overlayGamingDesktop : styles.overlayGaming;
  const pinGamingSearchClass = pinGamingSearch ? styles.pinGamingSearch : "";

  const searchBar = (
    <div
      className={classnames(pinGamingSearchClass, {
        [styles.searchBarVisible]: isSearchBarVisible,
        [styles.searchBarHidden]: !isSearchBarVisible,
      })}
    >
      <SearchBar
        placeholderLabel={translations.i18n.searchPlaceholder}
        cancelLabel={translations.i18n.cancel}
        onCancel={() => {}}
        onChange={() => {}}
        onClean={() => {}}
        onFocusChange={onFocusSearchBarHomepage}
        onInputClick={() => {}}
        inputSearchTerm={inputSearchTerm}
        shouldHandleOnBlur={shouldHandleOnBlur}
        isGamingZone={true}
      />
    </div>
  );

  const portalTarget = document.getElementById("search-bar-portal");

  const renderSearchBar = () =>
    portalTarget && pinGamingSearch ? ReactDOM.createPortal(searchBar, portalTarget) : searchBar;

  const renderGamingSearchContainer = () => (
    <Overlay className={overlayClass}>
      <GamingSearchContainer
        containers={renderContainers({ recommendedGames }, results, numberOfResults, scrollViewRef, isLoadingMore)}
        numberOfResults={numberOfResults}
        inputSearchTerm={inputSearchTerm}
        translations={translations}
        onCancel={onCancel}
        onChange={handleInputChange}
        onFocusSearchBar={onFocusSearchBar}
        onSearchHistoryPebbleClick={onSearchHistoryPebbleClick}
        cleanResults={onCleanResults}
        shouldHandleOnBlur={shouldHandleOnBlur}
        isGamingZone={true}
        shouldDisplaySearchHistory={shouldDisplaySearchHistory}
      />
    </Overlay>
  );

  return !isFocused ? renderSearchBar() : renderGamingSearchContainer();
};

export default GamingSearchZone;
