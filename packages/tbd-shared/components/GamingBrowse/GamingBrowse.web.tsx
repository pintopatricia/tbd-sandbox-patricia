import { FunctionComponent, useCallback, useMemo } from "react";
import { INPUT_LENGTH_SEARCH_TRIGGER } from "@ppb/tbd-store/config/common-config";
import classnames from "classnames";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { SearchResultItem } from "@ppb/tbd-store/state/layout/views/browse-view/Browse.types";
import { GameTileContainerLayout } from "../GamesCardGroup/snowflakes/GameTileContainer/GameTileContainerLayout.types";
import { GamingSearchContainer } from "../GamingSearchZone/snowflakes/GamingSearchContainer/GamingSearchContainer.web";
import { GameTileContainer } from "../GamesCardGroup/snowflakes/GameTileContainer/GameTileContainer.web";
import { ComponentProps } from "./props";
import styles from "./GamingBrowse.web.css";
import ConnectedGameCard from "../GameCard";
import GameCard from "../GameCard/GameCard.web";
import ConnectedDefaultGamingBrowse from "./DefaultGamingBrowse";
import DefaultGamingBrowse from "./DefaultGamingBrowse/DefaultGamingBrowse.web";
import { useInfiniteScroll } from "../../hooks";
import GameCardPlaceholder from "../GameCard/GameCardPlaceholder.web";
import SwimlaneCardGroupPlaceholder from "../SwimlaneCardGroup/SwimlaneCardGroupPlaceholder.web";
import GamingCardGroup from "../GamingCardGroup/GamingCardGroup.web";
import ConnectedGamingCardGroup from "../GamingCardGroup";

function renderContainers(
  containers: { default: PartialItem; recommendedGames: PartialItem },
  results: SearchResultItem[],
  numberOfResults: number,
  ref: any,
): any {
  const containersMock = {
    default: (
      <ConnectedDefaultGamingBrowse
        component={DefaultGamingBrowse}
        typename={containers.default?.typename}
        urn={containers.default?.urn}
      />
    ),
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
          {results.map((result: SearchResultItem, index: number) => {
            const isFirstOddElement = numberOfResults % 2 === 1 && index === 0;
            return (
              <div
                className={(styles.gameContainer, isFirstOddElement ? styles.rectangleResult : "")}
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
        </div>
      ) : null,
  };

  return containersMock;
}

const GamingBrowse: FunctionComponent<ComponentProps> = ({
  urn,
  defaultContainers,
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
  dispatchSearchInputChangeAction,
  dispatchSearchInputChangeClearAction,
  dispatchSearchClearResultsAction,
  dispatchSearchCancelAction,
  dispatchSearchBarFocusAction,
  dispatchFetchMoreSearchResults,
}) => {
  const translations = useMemo(
    () => ({
      i18n: {
        searchPlaceholder,
        cancel,
        outOfIdeasLabel,
        noResultsLabel,
        numberOfResultsLabel,
      },
    }),
    [cancel, noResultsLabel, numberOfResultsLabel, outOfIdeasLabel, searchPlaceholder],
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
  const fetchMoreSearchResults = useCallback((): void => {
    dispatchFetchMoreSearchResults(urn);
  }, [dispatchFetchMoreSearchResults, urn]);

  const onCleanResults = useCallback(
    (text: string) => dispatchSearchClearResultsAction(text, urn),
    [dispatchSearchClearResultsAction, urn],
  );

  const onCancel = useCallback(
    (text: string) => dispatchSearchCancelAction(text, urn),
    [dispatchSearchCancelAction, urn],
  );

  const onFocusSearchBar = useCallback(() => dispatchSearchBarFocusAction(), [dispatchSearchBarFocusAction]);
  const { scrollViewRef } = useInfiniteScroll<HTMLDivElement>(fetchMoreSearchResults);

  return (
    <div className={styles.container}>
      <GamingSearchContainer
        containers={renderContainers(
          { default: defaultContainers, recommendedGames },
          results,
          numberOfResults,
          scrollViewRef,
        )}
        numberOfResults={numberOfResults}
        inputSearchTerm={inputSearchTerm}
        translations={translations}
        onCancel={onCancel}
        onChange={onSearchChange}
        onFocusSearchBar={onFocusSearchBar}
        cleanResults={onCleanResults}
        shouldHandleOnBlur={shouldHandleOnBlur}
        isGamingZone={false}
      />
    </div>
  );
};

export default GamingBrowse;
