import { FunctionComponent, useMemo, useCallback, useEffect } from "react";
import { View } from "react-native";
import { INPUT_LENGTH_SEARCH_TRIGGER } from "@ppb/tbd-store/config/common-config";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { GamingSearchResultItem } from "@ppb/tbd-store/state/layout/gaming-search/GamingSearch.types";
import { ComponentProps } from "./props";
import ConnectedGamingCardGroup from "../GamingCardGroup";
import GamingCardGroup from "../GamingCardGroup/GamingCardGroup.native";
import ConnectedGameCard from "../GameCard";
import GameCard from "../GameCard/GameCard.native";
import GameCardPlaceholder from "../GameCard/GameCardPlaceholder.native";
import { DefaultPlaceholder } from "../CardGroup/CardGroupPlaceholders.native";
import styles from "./GamingSearchZone.native.styles";
import { FlatList, RenderItem } from "../FlatList.native";
import { GamingSearchContainer } from "./snowflakes/GamingSearchContainer/GamingSearchContainer.native";

const columnsStylesProps = { columnWrapperStyle: styles.columnsStyle };

function renderContainers(
  containers: { recommendedGames: PartialItem },
  results: GamingSearchResultItem[],
  renderItem: RenderItem<GamingSearchResultItem>,
): any {
  return {
    recommendedGames: containers.recommendedGames?.urn && (
      <ConnectedGamingCardGroup
        component={GamingCardGroup}
        urn={containers.recommendedGames?.urn}
        isTitleHidden={true}
        isRecommendedCardGroup={true}
        placeholder={DefaultPlaceholder}
      />
    ),
    searchResults:
      results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={renderItem}
          numColumns={2}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          style={styles.gamesGrid}
          {...columnsStylesProps}
        />
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
  isRefreshing,
  pinGamingSearch,
  dispatchGamingSearchInputChangeAction,
  dispatchGamingSearchInputChangeClearAction,
  dispatchGamingSearchBarFocusAction,
  dispatchGamingSearchCancelAction,
  dispatchGamingSearchClearResultsAction,
  dispatchPebbleSearchHistoryClickAction,
  shouldDisplaySearchHistory,
  searchHistoryLabel,
}) => {
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

  const emptyItem: GamingSearchResultItem = { urn: "", type: "GAMING_SEARCH_RESULT_ITEM" };
  const formatedResults =
    numberOfResults % 2 === 0 ? results : [...results.slice(0, 1), emptyItem, ...results.slice(1)];

  const handleInputChange = useCallback(
    (text: string) => {
      dispatchGamingSearchInputChangeAction(text, urn);
      if (text.length < INPUT_LENGTH_SEARCH_TRIGGER) {
        dispatchGamingSearchInputChangeClearAction(urn);
      }
    },
    [dispatchGamingSearchInputChangeAction, urn, dispatchGamingSearchInputChangeClearAction],
  );

  const onSearchHistoryPebbleClick = useCallback(
    (text: string) => {
      dispatchPebbleSearchHistoryClickAction(text);
    },
    [dispatchPebbleSearchHistoryClickAction],
  );

  const onFocusSearchBar = useCallback(() => {
    dispatchGamingSearchBarFocusAction();
  }, [dispatchGamingSearchBarFocusAction]);

  const onCancel = useCallback(
    (text: string) => dispatchGamingSearchCancelAction(text, urn),
    [dispatchGamingSearchCancelAction, urn],
  );
  const onCleanResults = useCallback(
    (text: string) => dispatchGamingSearchClearResultsAction(text, urn),
    [dispatchGamingSearchClearResultsAction, urn],
  );

  const renderItem = useCallback<RenderItem<GamingSearchResultItem>>(
    ({ item: { urn: gameUrn, visible }, index }) => {
      const isFirstOddElement = numberOfResults % 2 === 1 && index === 0;
      return (
        <View style={isFirstOddElement ? styles.twoColumnsHeroTile : styles.twoColumnTile}>
          <ConnectedGameCard
            component={GameCard}
            urn={gameUrn}
            isRoundGameTile={false}
            placeholder={GameCardPlaceholder}
            visible={visible}
          />
        </View>
      );
    },
    [numberOfResults],
  );

  useEffect(() => {
    if (isRefreshing) {
      dispatchGamingSearchCancelAction("", urn);
    }
  }, [isRefreshing]);

  return (
    <GamingSearchContainer
      containers={renderContainers({ recommendedGames }, formatedResults, renderItem)}
      translations={translations}
      inputSearchTerm={inputSearchTerm}
      numberOfResults={numberOfResults}
      onCancel={onCancel}
      onChange={handleInputChange}
      onFocusSearchBar={onFocusSearchBar}
      cleanResults={onCleanResults}
      shouldHandleOnBlur={shouldHandleOnBlur}
      onSearchHistoryPebbleClick={onSearchHistoryPebbleClick}
      shouldDisplaySearchHistory={shouldDisplaySearchHistory}
      pinGamingSearch={pinGamingSearch}
    />
  );
};

export default GamingSearchZone;
