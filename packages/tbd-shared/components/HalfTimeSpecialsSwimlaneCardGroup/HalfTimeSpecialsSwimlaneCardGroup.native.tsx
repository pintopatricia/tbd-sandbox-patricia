import { FunctionComponent, memo, useCallback, useMemo, useRef } from "react";
import * as React from "react";
import { StyleProp, StyleSheet, View, ViewabilityConfigCallbackPairs, ViewStyle } from "react-native";
import { ScrollableSwimlane, TBDImage, Text } from "@ppb/the-wall-native";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { DisplayMode } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { tokens } from "@ppb/the-wall-common/base-theme";
import LinearView from "@ppb/the-wall-native/helpers/LinearView";
import ConnectedCard from "../Card";
import Card, { isCardImplemented } from "../Card/Card.native";
import { ComponentProps } from "./props";
import { useNativeLazyLoading } from "../../hooks/useNativeLazyLoading.native";
import styles from "./HalfTimeSpecialsSwimlaneCardGroup.native.styles";
import useCardGroupItems from "../../hooks/useCardGroupItems";
import { FlatList, RenderItem, ViewabilityProps } from "../FlatList.native";
import { useCardVisibility, CARD_VIEWABILITY_CONFIG } from "../../hooks/useCardVisibility.native";
import AnimatedIcon from "./snowflakes/AnimatedIcon/AnimatedIcon.native";

type ScrollableHalfTimeSpecialsSwimlaneRenderFnProps = {
  title: string;
  subtitle?: string;
  urns: PartialItem[];
  snap: boolean;
  renderItem: RenderItem<PartialItem>;
  viewabilityProps: ViewabilityProps;
  getItemLayout?: (
    data: ArrayLike<PartialItem> | null | undefined,
    index: number,
  ) => { length: number; offset: number; index: number };
  onCardHidden: () => void;
  scrollIntoIndex?: number;
  hasSportViewLinkCards?: boolean;
  icon: React.ReactNode | undefined;
  isDecorated?: boolean;
  isIconSupportingTitle?: boolean;
  isHighlighted: boolean;
};

const SNAP_TO_INTERVAL =
  styles.swimlaneCardGroupItemMultipleCard.width + styles.swimlaneCardGroupItemMultipleCard.marginRight;

function getCardStyle(
  typename: string,
  hasSportViewLinkCards: boolean,
  displayMode: DisplayMode,
  itemsCount: number,
): StyleProp<ViewStyle> {
  const navigationCardStyles =
    ["EventViewLinkCard", "MarketViewLinkCard", "GamingLinkCard", "RaceViewLinkCard"].includes(typename) &&
    styles.navigation;

  const isOneCardSwimlane = ["SCROLLABLE", "SNAP"].includes(displayMode) && itemsCount === 1;

  return [
    styles.swimlaneCardGroupItem,
    isOneCardSwimlane && styles.swimlaneCardGroupItemSingleCard,
    !isOneCardSwimlane && styles.swimlaneCardGroupItemMultipleCard,
    navigationCardStyles,
    ["CompetitionViewLinkCard"].includes(typename) && styles.competitionViewLink,
    ["GameCard"].includes(typename) && styles.gameCard,
    ["GamingLinkCard"].includes(typename) && styles.gamingLink,
    ["SportViewLinkCard"].includes(typename) && styles.sportViewLink,
    ["GenericViewLinkCard"].includes(typename) && !hasSportViewLinkCards && styles.genericViewLink,
    ["GenericViewLinkCard"].includes(typename) && hasSportViewLinkCards && styles.sportViewLink,
    ["RaceByTimeRangeCard"].includes(typename) && styles.raceTimeQuicklink,
    ["BetOpportunityPromoCard", "EditorialPromoCard", "SelectionPromoCard", "LoyaltyPromoCard"].includes(typename) &&
      styles.promoCard,
  ];
}

const ScrollableHalfTimeSpecialsSwimlaneRenderFn: FunctionComponent<
  ScrollableHalfTimeSpecialsSwimlaneRenderFnProps
> = ({
  title,
  subtitle,
  urns,
  snap,
  viewabilityProps,
  scrollIntoIndex,
  isHighlighted,
  renderItem,
  onCardHidden,
  getItemLayout,
}) => {
  const flatListRef = useRef<any>(null);

  // if scrollIntoIndex is defined, we wan't to set additional props to provide to FlatList so we can have
  // an automatic scroll to the given index.
  const scrollIntoIndexProps = useMemo(() => {
    const SCROLL_INTO_OFFSET = 30;
    const maxRetries = 3;
    let numRetries = 0;

    const scrollInto = (): void => {
      if (scrollIntoIndex && urns.length) {
        flatListRef?.current?.scrollToIndex({
          index: scrollIntoIndex < urns.length ? scrollIntoIndex : urns.length - 1,
          viewPosition: 0,
          viewOffset: SCROLL_INTO_OFFSET,
        });
      }
    };

    return {
      onLayout(): void {
        scrollInto();
      },
      onScrollToIndexFailed() {
        // retry mechanism for when the `Flatlist.scrollIntoIndex` fails
        // (for some unknown reason, "onLayout" callback may be called before the flatlist items are
        // actually rendered and this causes the `scrollIntoIndex` to fail). this retry mechanism has a maximum of 3 attempts
        setTimeout(() => {
          if (numRetries < maxRetries) {
            scrollInto();
            numRetries += 1;
          }
        }, 100);
      },
      initialNumToRender: urns.length, // in this case, we want to render all items at once, so we can scroll to the given index
    };
  }, [scrollIntoIndex, urns.length]);

  const hiddenCardConfig = useCardVisibility(onCardHidden);

  const viewabilityConfigPair = useMemo<ViewabilityConfigCallbackPairs>(
    () => [hiddenCardConfig, viewabilityProps],
    [hiddenCardConfig, viewabilityProps],
  );

  const snapProps = snap
    ? {
        pagingEnabled: false,
        bounces: false,
        decelerationRate: 0.98,
        snapToInterval: SNAP_TO_INTERVAL,
      }
    : {};

  const background = isHighlighted
    ? tokens.HalfTimePulseCardBackgroundHighlightedColour
    : tokens.HalfTimePulseCardBackgroundColour;

  return (
    <LinearView background={background} style={[styles.container, isHighlighted && styles.highlightedContainer]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <View>
            <AnimatedIcon />
          </View>
        </View>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <ScrollableSwimlane>
        <FlatList
          listRef={flatListRef}
          data={urns}
          renderItem={renderItem}
          horizontal
          viewabilityConfigCallbackPairs={viewabilityConfigPair}
          getItemLayout={getItemLayout}
          {...snapProps}
          {...scrollIntoIndexProps}
        />
      </ScrollableSwimlane>
    </LinearView>
  );
};

type MemoizedProps = ComponentProps & {
  items: PartialItem[];
  viewabilityProps: ViewabilityProps;
};

const MemoizedHalfTimeSpecialsSwimlaneCardGroup: FunctionComponent<MemoizedProps> = memo(
  ({
    title,
    subtitle,
    items,
    displayMode,
    currentRunner,
    currentSide,
    dispatchClearBetting,
    scrollIntoIndex,
    viewabilityProps,
    icon,
    visible: isSwimlaneVisible,
    isHighlighted,
  }) => {
    const itemsCount = items.length;
    const [anyItem] = items;
    const anyTypename = anyItem?.typename;
    const hasSportViewLinkCards = items.some(({ typename }) => typename === "SportViewLinkCard");
    const style = useMemo(
      () => (anyTypename ? getCardStyle(anyTypename, hasSportViewLinkCards, displayMode, itemsCount) : []),
      [anyTypename, hasSportViewLinkCards, displayMode, itemsCount],
    );
    const finalStyle = StyleSheet.flatten(style);
    const fixedWidth = finalStyle?.width && (finalStyle.width as number) > 0 ? (finalStyle.width as number) : undefined;

    const renderItem = useCallback<RenderItem<PartialItem>>(
      ({ item: { urn, typename, visible }, index }) => {
        const viewStyle = [
          finalStyle,
          index === 0 ? styles.firstCard : null,
          itemsCount === index + 1 ? styles.lastCard : null,
          !hasSportViewLinkCards && itemsCount === index + 1 ? styles.swimlaneCardGroupLastItem : null,
        ];

        return (
          <View style={viewStyle}>
            <ConnectedCard urn={urn} component={Card} typename={typename} visible={isSwimlaneVisible && visible} />
          </View>
        );
      },
      [finalStyle, hasSportViewLinkCards, itemsCount, isSwimlaneVisible],
    );

    // This callback will not be passed in case there is no fixedWidth
    const getItemLayout = useCallback(
      (_: ArrayLike<PartialItem> | null | undefined, index: number) => {
        const castFixedWidth = fixedWidth as number;

        return {
          length: castFixedWidth,
          offset: castFixedWidth * index,
          index,
        };
      },
      [fixedWidth],
    );

    const clearPotentialBet = useCallback(() => {
      if (currentRunner && currentSide) {
        dispatchClearBetting(currentRunner, currentSide);
      }
    }, [currentRunner, currentSide, dispatchClearBetting]);

    // Empty swimlane
    if (!items.length) {
      return null;
    }

    if (displayMode === "SWIPEABLE") {
      return null;
    }
    const img = icon?.vector && <TBDImage width={20} height={20} source={icon?.vector} />;

    return (
      <ScrollableHalfTimeSpecialsSwimlaneRenderFn
        title={title}
        urns={items}
        snap={displayMode === "SNAP"}
        renderItem={renderItem}
        viewabilityProps={viewabilityProps}
        getItemLayout={fixedWidth ? getItemLayout : undefined}
        onCardHidden={clearPotentialBet}
        scrollIntoIndex={scrollIntoIndex}
        hasSportViewLinkCards={hasSportViewLinkCards}
        icon={img}
        subtitle={subtitle}
        isHighlighted={isHighlighted}
      />
    );
  },
);

MemoizedHalfTimeSpecialsSwimlaneCardGroup.displayName = "MemoizedHalfTimeSpecialsSwimlaneCardGroup";

const HalfTimeSpecialsSwimlaneCardGroup: FunctionComponent<ComponentProps> = (props) => {
  const { items: partials, dispatchFetchCards } = props;

  const items = useCardGroupItems(partials, isCardImplemented);

  /**
   * Triggers fetch card when item is visible
   */
  const onViewableItemsChanged = useNativeLazyLoading(items, dispatchFetchCards);

  const viewabilityProps = useMemo(
    () => ({
      viewabilityConfig: CARD_VIEWABILITY_CONFIG,
      onViewableItemsChanged: onViewableItemsChanged,
    }),
    [onViewableItemsChanged],
  );

  return <MemoizedHalfTimeSpecialsSwimlaneCardGroup viewabilityProps={viewabilityProps} {...props} />;
};

export default HalfTimeSpecialsSwimlaneCardGroup;
