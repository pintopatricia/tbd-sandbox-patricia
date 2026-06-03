import { FunctionComponent, useCallback, useMemo } from "react";
import { View, StyleProp, ViewStyle, GestureResponderEvent } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { navigate } from "@ppb/tbd-router/native";
import { isRecentlyPlayedGroup } from "@ppb/tbd-store/helpers/recently-played-games";
import { CardGroupLayout } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { Text } from "@ppb/the-wall-native";
import ConnectedGameCard from "../GameCard";
import GameCard from "../GameCard/GameCard.native";
import GameCardPlaceholder from "../GameCard/GameCardPlaceholder.native";
import { useNativeLazyLoading } from "../../hooks/useNativeLazyLoading.native";
import { FlatList, RenderItem } from "../FlatList.native";
import { GamingCategoryLink } from "./snowflakes/GamingCategoryLink/GamingCategoryLink.native";
import styles from "./GamesCardGroup.native.styles";
import { ComponentProps } from "./props";
import selectors from "./GamesCardGroup.native.selectors";

/*
 * These values was chose quite experimental to provide a smooth as possible user experience
 * for the games list
 *
 */
const INITIAL_ELEMENTS_TO_RENDER = 5;
const MAX_RENDER_PER_BATCH = 2;

/**
 * Function component that wraps a scrollable  swimlane of games
 *
 * @param props The component props
 * @returns The react component
 */
const GamesCardGroup: FunctionComponent<ComponentProps> = ({
  title,
  layout,
  items,
  cardGroupUrn,
  totalItems,
  gamingCategoryLink,
  dispatchFetchCards,
  dispatchLaunchCategory,
  recentlyPlayedGames,
  isRecommendedCardGroup,
}) => {
  const isSegmentedCardGroup = layout === CardGroupLayout.CARD_LIST;
  const isRoundGameTile = layout === CardGroupLayout.GRID_FOUR_COLUMNS;
  const isOddNumberOfResults = totalItems % 2 !== 0;
  const gamesCardGroupItems = isRecentlyPlayedGroup(cardGroupUrn) ? recentlyPlayedGames : items;

  const getGameContainerStyle = useCallback(
    (index: number) => {
      const gameContainerStyle: StyleProp<ViewStyle> = [];
      if (!isSegmentedCardGroup) {
        if (layout === CardGroupLayout.GRID_TWO_COLUMNS) {
          // Two columns grid layout styles
          gameContainerStyle.push(styles.twoColumns);
          if (isOddNumberOfResults) {
            if (index === 0) {
              gameContainerStyle.push(styles.twoColumnsHeroTile);
            }
            if (index === 1) {
              return [styles.twoColumnsHiddenTile];
            }
          }
        } else {
          // Four Columns layout styles - Used on Recently played
          gameContainerStyle.push(styles.fourColumns);
        }
      } else {
        // Segmented layout styles - Used on MultiFunctional module [Browse Tab - Casino search]
        gameContainerStyle.push(styles.segmentedGameContainer);
      }
      return gameContainerStyle;
    },
    [isOddNumberOfResults, isSegmentedCardGroup, layout],
  );

  /**
   * Triggers fetch card when item is visible
   */
  const onViewableItemsChanged = useNativeLazyLoading(items, dispatchFetchCards);

  const renderItem = useCallback<RenderItem>(
    ({ index, item: { urn, visible } }) => (
      <View style={getGameContainerStyle(index)} {...getTestProps(selectors.GAMES_CARD_GROUP_GAME_CONTAINER, false)}>
        <ConnectedGameCard
          urn={urn}
          isRoundGameTile={isRoundGameTile}
          component={GameCard}
          placeholder={GameCardPlaceholder}
          visible={visible}
        />
      </View>
    ),
    [getGameContainerStyle, isRoundGameTile],
  );

  const handleCategoryOnPress = useCallback(
    (_: GestureResponderEvent, viewLink: ViewLink, categoryName: string, gamingZoneTitle: string) => {
      dispatchLaunchCategory(viewLink, categoryName, `${title} - ${gamingZoneTitle}`);
      navigate(viewLink);
    },
    [dispatchLaunchCategory, title],
  );

  const renderHeader = useMemo(
    () =>
      !!title && (
        <View {...getTestProps(selectors.GAMES_CARD_GROUP_HEADER, false)}>
          <Text
            style={!isSegmentedCardGroup ? styles.title : styles.segmentedTitle}
            {...getTestProps(selectors.GAMES_CARD_GROUP_HEADER_TEXT, false)}
          >
            {title}
          </Text>
        </View>
      ),
    [isSegmentedCardGroup, title],
  );

  const renderCategoryLink = useMemo(() => {
    const gamingCategoryStyle = [styles.segmentedGameContainer, styles.gamingCategoryLink];
    return (
      !!gamingCategoryLink &&
      !!title && (
        <View style={gamingCategoryStyle} {...getTestProps(selectors.GAMES_CARD_GROUP_CATEGORY_LINK, false)}>
          <GamingCategoryLink {...gamingCategoryLink} gamingZoneTitle={title} onClick={handleCategoryOnPress} />
        </View>
      )
    );
  }, [gamingCategoryLink, handleCategoryOnPress, title]);

  if (!items?.length) {
    return null;
  }

  const cardsContainer = !isSegmentedCardGroup ? [styles.gamesGrid] : [styles.segmentedGamesCardsContainers];

  let numColumns = layout === CardGroupLayout.GRID_FOUR_COLUMNS ? 4 : 2;
  numColumns = isSegmentedCardGroup ? 1 : numColumns;

  const itemsToRender =
    layout === CardGroupLayout.GRID_TWO_COLUMNS && isOddNumberOfResults
      ? [...gamesCardGroupItems.slice(0, 1), { urn: "", typename: "" }, ...gamesCardGroupItems.slice(1)]
      : gamesCardGroupItems;

  const columnsStylesProps = numColumns > 1 ? { columnWrapperStyle: styles.columns } : {};

  return (
    <View {...getTestProps(selectors.GAMES_CARD_GROUP, false)} style={styles.cardsGroupContainer}>
      {renderHeader}
      <View style={styles.segmentedAllCardsContainer}>
        <FlatList
          {...getTestProps(selectors.GAMES_CARD_GROUP_GRID, false)}
          data={itemsToRender}
          renderItem={renderItem}
          onViewableItemsChanged={onViewableItemsChanged}
          horizontal={isSegmentedCardGroup}
          style={cardsContainer}
          numColumns={numColumns}
          {...columnsStylesProps}
          ItemSeparatorComponent={isRecommendedCardGroup ? () => <View style={styles.itemSeparatorView} /> : null}
          initialNumToRender={INITIAL_ELEMENTS_TO_RENDER}
          maxToRenderPerBatch={MAX_RENDER_PER_BATCH}
        />
        {renderCategoryLink}
      </View>
    </View>
  );
};

export default GamesCardGroup;
