import { INPUT_LENGTH_SEARCH_TRIGGER } from "@ppb/tbd-store/config/common-config";
import { SearchBar } from "@ppb/the-wall-native/components/SearchBar/SearchBar";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { FunctionComponent, useCallback, useState, useMemo } from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { Text, withStyle } from "@ppb/the-wall-native";
import { spacings } from "@ppb/the-wall-common/base-theme";
import { GameSearchResultItem } from "@ppb/tbd-store/state/layout/views/browse-view/BrowseInterface.types";
import ConnectedGamingCardGroup from "../GamingCardGroup";
import GamingCardGroup from "../GamingCardGroup/GamingCardGroup.native";
import SwimlaneCardGroupPlaceholder from "../SwimlaneCardGroup/SwimlaneCardGroupPlaceholder.native";
import ConnectedGameCard from "../GameCard";
import GameCard from "../GameCard/GameCard.native";
import GameCardPlaceholder from "../GameCard/GameCardPlaceholder.native";
import ConnectedDefaultGamingBrowse from "./DefaultGamingBrowse";
import DefaultGamingBrowse from "./DefaultGamingBrowse/DefaultGamingBrowse.native";
import selectors from "./GamingBrowse.native.selectors";
import styles from "./GamingBrowse.native.styles";
import { ComponentProps } from "./props";
import { FlatList, RenderItem } from "../FlatList.native";

function canShowResults(numberOfResults: number, inputSearchTerm: string): boolean {
  return numberOfResults > 0 && inputSearchTerm.length > 2;
}

// lazy polling constants
const INITIAL_NUM_TO_RENDER = 12;
const MAX_TO_RENDER_PER_BATCH = 4;
const END_REACHED_THRESHOLD = 0.1;

const SEARCH_RESULTS_NUMBER_OF_COLUMNS = 2;

const StyledGamingCardGroupPlaceholder = withStyle(SwimlaneCardGroupPlaceholder, {
  marginBottom: spacings["spacing-2"],
});

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
  const resultsAvailability = canShowResults(numberOfResults, inputSearchTerm);
  const [showResults, setShowResults] = useState(resultsAvailability);
  const [searchText, setSearchText] = useState(inputSearchTerm);

  const isOddNumberOfResults = numberOfResults % 2 !== 0;

  const onCancel = useCallback(
    (text: string) => {
      setSearchText("");
      dispatchSearchCancelAction(text, urn);
    },
    [dispatchSearchCancelAction, urn],
  );
  const fetchMoreSearchResults = useCallback((): void => {
    dispatchFetchMoreSearchResults(urn);
  }, [dispatchFetchMoreSearchResults, urn]);

  const onSearchChange = useCallback(
    (text: string) => {
      setSearchText(text);
      dispatchSearchInputChangeAction(text, urn);
      if (text.length < INPUT_LENGTH_SEARCH_TRIGGER) {
        dispatchSearchInputChangeClearAction(urn);
      }
    },
    [dispatchSearchInputChangeAction, dispatchSearchInputChangeClearAction, urn],
  );

  const onCleanResults = useCallback(
    (text: string) => {
      setSearchText("");
      dispatchSearchClearResultsAction(text, urn);
    },
    [dispatchSearchClearResultsAction, urn],
  );

  const handleFocusChange = useCallback(
    (focus: boolean) => {
      setShowResults(focus || !!inputSearchTerm);
    },
    [inputSearchTerm, setShowResults],
  );

  const onFocusSearchBar = useCallback(() => dispatchSearchBarFocusAction(), [dispatchSearchBarFocusAction]);

  const getGameContainerStyle = useCallback(
    (index: number) => {
      const gameContainerStyle: StyleProp<ViewStyle> = [];
      gameContainerStyle.push(styles.gameContainer, styles.twoColumns);
      if (isOddNumberOfResults) {
        if (index === 0) {
          return [styles.twoColumnsHiddenTile];
        }
        if (index === 1) {
          gameContainerStyle.push(styles.twoColumnsHeroTile);
        }
      } else if (index === 1) {
        gameContainerStyle.push(styles.twoColumnsNoSpacing);
      }

      if (index > 1 && index % 2 !== 0) {
        gameContainerStyle.push(styles.twoColumnsNoSpacing);
      }
      return gameContainerStyle;
    },
    [isOddNumberOfResults],
  );

  const renderItem = useCallback<RenderItem>(
    ({ index, item }) => {
      // When the numberOfResults is odd the an empty item is added to the results array in order to fix the column
      // layout but it should be hidden to make the first real item look like a hero tile.
      const hideFirstItem = isOddNumberOfResults && index === 0;
      return (
        <View style={getGameContainerStyle(index)} {...getTestProps(selectors.RESULT_ITEM, false)}>
          {!hideFirstItem && (
            <ConnectedGameCard
              urn={item.urn}
              component={GameCard}
              placeholder={GameCardPlaceholder}
              visible={item.visible}
            />
          )}
        </View>
      );
    },
    [isOddNumberOfResults, getGameContainerStyle],
  );

  const showOutOfIdeasLabel = useMemo(
    () => !!(numberOfResults === 0 && showResults && outOfIdeasLabel && !noResultsLabel),
    [noResultsLabel, numberOfResults, outOfIdeasLabel, showResults],
  );

  const showNoResultsLabel = numberOfResults === 0 && !!noResultsLabel;
  const showRecommendedGames = recommendedGames?.urn && (showOutOfIdeasLabel || showNoResultsLabel);
  const resultsToRender = useMemo(() => {
    const emptyResult: GameSearchResultItem = {
      name: "",
      type: "GAME_SEARCH_RESULT_ITEM",
      urn: "",
    };

    return isOddNumberOfResults ? [emptyResult, ...results] : results;
  }, [isOddNumberOfResults, results]);

  return (
    <View style={styles.gamingBrowseContainer} {...getTestProps(selectors.GAMING_BROWSE, false)}>
      <View style={styles.searchContainer}>
        <SearchBar
          placeholderLabel={searchPlaceholder}
          cancelLabel={cancel}
          onCancel={onCancel}
          onChange={onSearchChange}
          onClean={onCleanResults}
          onFocusChange={handleFocusChange}
          onInputClick={onFocusSearchBar}
          inputSearchTerm={searchText}
          shouldHandleOnBlur={shouldHandleOnBlur}
        />
      </View>

      {!showResults && (
        <ConnectedDefaultGamingBrowse
          component={DefaultGamingBrowse}
          typename={defaultContainers?.typename}
          urn={defaultContainers?.urn}
        />
      )}
      {resultsAvailability && (
        <View {...getTestProps(selectors.GAMING_BROWSE_SEARCH_CONTAINER, false)}>
          {!!numberOfResultsLabel && (
            <Text style={styles.text} {...getTestProps(selectors.NUMBER_OF_RESULTS_LABEL, false)}>
              {numberOfResultsLabel}
            </Text>
          )}
          <FlatList
            {...getTestProps(selectors.GAMING_BROWSE_SEARCH_RESULTS, false)}
            data={resultsToRender}
            renderItem={renderItem}
            onEndReached={fetchMoreSearchResults}
            onEndReachedThreshold={END_REACHED_THRESHOLD}
            horizontal={false}
            numColumns={SEARCH_RESULTS_NUMBER_OF_COLUMNS}
            initialNumToRender={INITIAL_NUM_TO_RENDER}
            maxToRenderPerBatch={MAX_TO_RENDER_PER_BATCH}
          />
        </View>
      )}
      {showOutOfIdeasLabel && (
        <Text style={styles.text} {...getTestProps(selectors.OUT_OF_IDEAS_LABEL, false)}>
          {outOfIdeasLabel}
        </Text>
      )}
      {showNoResultsLabel && (
        <Text style={styles.text} {...getTestProps(selectors.NO_RESULTS_LABEL, false)}>
          {noResultsLabel}
        </Text>
      )}
      {showRecommendedGames && (
        <View {...getTestProps(selectors.RECOMMENDED_GAMES_CONTAINER, false)}>
          <ConnectedGamingCardGroup
            component={GamingCardGroup}
            urn={recommendedGames?.urn}
            isTitleHidden={true}
            placeholder={StyledGamingCardGroupPlaceholder}
          />
        </View>
      )}
    </View>
  );
};
export default GamingBrowse;
