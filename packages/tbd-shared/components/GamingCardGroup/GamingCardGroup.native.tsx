import type { JSX } from "react";
import { FunctionComponent, useCallback, useContext, useEffect } from "react";
import { View } from "react-native";
import { Portal } from "@gorhom/portal";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { ScrollableSwimlane } from "@ppb/the-wall-native";
import URN from "@ppb/tbd-store/state/layout/URN";
import { GameCardTileSize, GamingCardGroupType } from "@ppb/tbd-store/state/constants";
import { navigate } from "@ppb/tbd-router/native";
import { ViewAllLink } from "@ppb/tbd-store/state/layout/views/ViewAll.types";
import { CardGroupLayout } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { ViewItemTheme } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import ConnectedCard from "../Card";
import Card from "../Card/Card.native";
import ConnectedGamesCardGroup from "../GamesCardGroup";
import ConnectedGameCard from "../GameCard";
import GameCard from "../GameCard/GameCard.native";
import GameCardPlaceholder from "../GameCard/GameCardPlaceholder.native";
import GamesCardGroup from "../GamesCardGroup/GamesCardGroup.native";
import styles from "./GamingCardGroup.native.styles";
import { ComponentProps } from "./props";
import { useNativeLazyLoading } from "../../hooks/useNativeLazyLoading.native";
import { FlatList, RenderItem } from "../FlatList.native";
import ConnectedGamingRibbonCard from "../GamingRibbonCard";
import GamingRibbonCard from "../GamingRibbonCard/GamingRibbonCard.native";
import GamingContext from "../GamingPage/GamingContext";

function renderGrid(urn: string, isRecommended: boolean | undefined): JSX.Element {
  return <ConnectedGamesCardGroup urn={urn} component={GamesCardGroup} isRecommendedCardGroup={isRecommended} />;
}

const VIEW_AREA_COVERAGE_PERCENT_THRESHOLD = 1;
const SNAP_TO_INTERVAL = styles.cardGroupItem.width;
const SNAP_TO_INTERVAL_PROMOTION = styles.promotion.width;

function renderGamingWidget(items: PartialItem[], isBetslipContainerDisplayed: boolean): JSX.Element {
  const gamingWidgetStyle = [
    styles.gameTileWidgetPositioning,
    isBetslipContainerDisplayed && styles.gameTileWidgetPositioningAfterBetslipOpen,
  ];

  return (
    <Portal hostName="game-widget">
      <View style={gamingWidgetStyle} pointerEvents="box-none">
        {items.slice(0, 1).map(({ urn }, index) => (
          <View key={`${urn}-${index}`} pointerEvents="auto">
            <ConnectedGameCard
              urn={urn}
              isGameWidget={true}
              component={GameCard}
              placeholder={GameCardPlaceholder}
              visible={true}
            />
          </View>
        ))}
      </View>
    </Portal>
  );
}

function renderScrollableSwimlane(
  cardgroupURN: URN,
  title: string,
  urns: PartialItem[],
  snap: boolean,
  renderItem: RenderItem<PartialItem>,
  onViewableItemsChanged: ReturnType<typeof useNativeLazyLoading>,
  viewAll: ViewAllLink | undefined,
  onPress: () => void,
): JSX.Element {
  // Just need an typename to check if it's a PromotionCard
  const { typename } = urns[0];

  const snapToInterval = ["PromotionCard"].includes(typename) ? SNAP_TO_INTERVAL_PROMOTION : SNAP_TO_INTERVAL;

  const snapProps = snap
    ? {
        pagingEnabled: false,
        bounces: false,
        decelerationRate: 0.98,
        snapToInterval,
      }
    : {};

  return (
    <ScrollableSwimlane onNavLinkPress={onPress} navLink={viewAll} title={title}>
      <FlatList
        data={urns}
        renderItem={renderItem}
        contentContainerStyle={styles.scrollableContainer}
        viewabilityConfig={{ itemVisiblePercentThreshold: VIEW_AREA_COVERAGE_PERCENT_THRESHOLD }}
        onViewableItemsChanged={onViewableItemsChanged}
        {...snapProps}
        horizontal
      />
    </ScrollableSwimlane>
  );
}

function renderRecentlyPlayed(
  title: string,
  items: PartialItem[],
  onViewableItemsChanged: ReturnType<typeof useNativeLazyLoading>,
  renderRecentlyPlayedItem: RenderItem<PartialItem>,
): JSX.Element {
  return (
    <ScrollableSwimlane title={title}>
      <FlatList
        data={items}
        renderItem={renderRecentlyPlayedItem}
        onViewableItemsChanged={onViewableItemsChanged}
        contentContainerStyle={styles.recentlyPlayedItemContainer}
        horizontal
      />
    </ScrollableSwimlane>
  );
}
function renderGamingRibbonCardGroup(
  items: PartialItem[],
  onViewableItemsChanged: ReturnType<typeof useNativeLazyLoading>,
  renderRibbonCardItem: RenderItem<PartialItem>,
  isGamesRibbonHighlighted: boolean,
): JSX.Element {
  return (
    <ScrollableSwimlane isHighlighted={isGamesRibbonHighlighted}>
      <View style={styles.ribbonCardContainer}>
        <FlatList
          data={items}
          onViewableItemsChanged={onViewableItemsChanged}
          renderItem={renderRibbonCardItem}
          contentContainerStyle={styles.ribbonCard}
          horizontal
        />
      </View>
    </ScrollableSwimlane>
  );
}

const CardGroup: FunctionComponent<ComponentProps> = ({
  title,
  items,
  cardgroupURN,
  displayMode,
  defaultLayout,
  isSegmented,
  viewAll,
  gameTileSize,
  type,
  dispatchFetchCards,
  dispatchViewAllTap,
  isGamesRibbonHighlighted,
  isRecommendedCardGroup,
  decoration,
  isBetslipContainerDisplayed,
  isXmallGameTile,
}) => {
  const onPress = useCallback(() => {
    if (!viewAll) return;

    dispatchViewAllTap(title, viewAll, cardgroupURN);
    navigate(viewAll.viewLink);
  }, [cardgroupURN, dispatchViewAllTap, title, viewAll]);
  const { setRecentlyPlayedUrn } = useContext(GamingContext);

  const renderItem = useCallback<RenderItem<PartialItem>>(
    ({ item: { urn, typename, visible } }) => {
      const navigationCardStyles = [
        "EventViewLinkCard",
        "MarketViewLinkCard",
        "RaceViewLinkCard",
        "GamingLinkCard",
      ].includes(typename)
        ? styles.navigation
        : [];

      const highlightedSelectionCardStyle =
        ["HighlightedSelectionCard"].includes(typename) && styles.highlightedSelection;

      const sportViewLinkCardStyle = ["SportViewLinkCard"].includes(typename) && styles.sportViewLink;

      const genericViewLinkCardStyle = ["GenericViewLinkCard"].includes(typename) && styles.genericViewLink;

      const promotionCardStyle = ["PromotionCard"].includes(typename) && styles.promotion;

      const raceTimeQuicklinkStyle = typename === "RaceByTimeRangeCard" && styles.raceTimeQuicklink;

      const supportingContentCardStyle =
        ["MatchStatsCard", "MatchTimelineCard", "TeamLineupCard", "TeamFormCard", "HeadToHeadCard"].includes(
          typename,
        ) && styles.supportingContent;

      const isGameCard = typename === "GameCard";
      const xmallGameTileStyle = isGameCard && isXmallGameTile && styles.xmallGameTile;

      return (
        <View
          style={[
            styles.cardGroupItem,
            navigationCardStyles,
            isGameCard &&
              !isXmallGameTile &&
              (gameTileSize === GameCardTileSize.MEDIUM || gameTileSize === GameCardTileSize.LARGE || !gameTileSize) &&
              styles.gameCardMedium,
            isGameCard && !isXmallGameTile && gameTileSize === GameCardTileSize.SMALL && styles.gameCardSmall,
            ["GamingLinkCard"].includes(typename) && styles.gamingLink,
            ["CompetitionViewLinkCard"].includes(typename) && styles.circle,
            highlightedSelectionCardStyle,
            promotionCardStyle,
            sportViewLinkCardStyle,
            genericViewLinkCardStyle,
            raceTimeQuicklinkStyle,
            supportingContentCardStyle,
            xmallGameTileStyle,
          ]}
        >
          <ConnectedCard
            urn={urn}
            component={Card}
            typename={typename}
            theme={isXmallGameTile ? ViewItemTheme.GamingSmallTiles : undefined}
            visible={visible}
          />
        </View>
      );
    },
    [gameTileSize, isXmallGameTile],
  );

  const renderRibbonCardItem = useCallback<RenderItem<PartialItem>>(
    ({ item: { urn } }) => <ConnectedGamingRibbonCard urn={urn} component={GamingRibbonCard} />,
    [],
  );

  const renderRecentlyPlayedItem = useCallback<RenderItem<PartialItem>>(
    ({ item: { urn, visible } }) => (
      <View style={styles.recentlyPlayedContainer}>
        <ConnectedGameCard
          urn={urn}
          isRoundGameTile={true}
          component={GameCard}
          placeholder={GameCardPlaceholder}
          visible={visible}
        />
      </View>
    ),
    [],
  );

  useEffect(() => {
    if (type === GamingCardGroupType.RECENTLY_PLAYED) {
      setRecentlyPlayedUrn(cardgroupURN);
    }
  }, []);

  /**
   * Triggers fetch card when item is visible
   */
  const onViewableItemsChanged = useNativeLazyLoading(items, dispatchFetchCards);

  // Empty swimlane
  if (!items.length) {
    return null;
  }

  // Gaming widget is rendered at page level via context, not here
  if (decoration === "BF Gaming iconwidget") {
    return renderGamingWidget(items, isBetslipContainerDisplayed);
  }

  if (type === GamingCardGroupType.CATEGORIES) {
    return renderGamingRibbonCardGroup(items, onViewableItemsChanged, renderRibbonCardItem, isGamesRibbonHighlighted);
  }
  if (type === GamingCardGroupType.RECENTLY_PLAYED) {
    return renderRecentlyPlayed(title, items, onViewableItemsChanged, renderRecentlyPlayedItem);
  }

  // Gaming layouts - render the grid layout (GamesCardGroup component)
  if (
    (isSegmented && defaultLayout === CardGroupLayout.CARD_LIST) ||
    defaultLayout === CardGroupLayout.GRID_TWO_COLUMNS ||
    defaultLayout === CardGroupLayout.GRID_FOUR_COLUMNS
  ) {
    return renderGrid(cardgroupURN, isRecommendedCardGroup);
  }

  // Scroll swimlane (and custom snap mode to handle promotions)
  if (displayMode === "SCROLLABLE" || displayMode === "SNAP") {
    const snap = displayMode === "SNAP";
    return renderScrollableSwimlane(
      cardgroupURN,
      title,
      items,
      snap,
      renderItem,
      onViewableItemsChanged,
      viewAll,
      onPress,
    );
  }

  return null;
};

export default CardGroup;
