import { FunctionComponent, memo, useCallback, useMemo, useRef } from "react";
import { View, ViewabilityConfigCallbackPairs } from "react-native";
import { ScrollableSwimlane } from "@ppb/the-wall-native";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { navigate } from "@ppb/tbd-router/native";
import { ViewAllLink } from "@ppb/tbd-store/state/layout/views/ViewAll.types";
import { useSelector } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { RaceStatus } from "@ppb/tbd-store/state/constants";
import ConnectedCard from "../Card";
import Card, { isCardImplemented } from "../Card/Card.native";
import { useNativeLazyLoading } from "../../hooks/useNativeLazyLoading.native";
import useCardGroupItems from "../../hooks/useCardGroupItems";
import { useRefreshComponent } from "../../hooks/useRefreshComponent.native";
import { useCardVisibility, CARD_VIEWABILITY_CONFIG } from "../../hooks/useCardVisibility.native";
import { FlatList, RenderItem, ViewabilityProps } from "../FlatList.native";
import { ComponentProps } from "./props";
import styles from "./RacingSwimlaneCardGroup.native.styles";

type ScrollableSwimlaneRenderFnProps = {
  title?: string;
  urns: PartialItem[];
  renderItem: RenderItem<PartialItem>;
  viewabilityProps: ViewabilityProps;
  viewAll?: ViewAllLink;
  onPress: () => void;
  getItemLayout?: (
    data: ArrayLike<PartialItem> | null | undefined,
    index: number,
  ) => { length: number; offset: number; index: number };
};

const ScrollableSwimlaneRenderFn: FunctionComponent<ScrollableSwimlaneRenderFnProps> = ({
  title,
  urns,
  viewabilityProps,
  viewAll,
  renderItem,
  onPress,
  getItemLayout,
}) => {
  const flatListRef = useRef<any>(null);
  const cardVisibilityConfig = useCardVisibility();

  const viewabilityConfigPair = useMemo<ViewabilityConfigCallbackPairs>(
    () => [cardVisibilityConfig, viewabilityProps],
    [cardVisibilityConfig, viewabilityProps],
  );

  const SNAP_TO_INTERVAL = styles.multipleCards.width + styles.multipleCards.marginRight;
  const DECELERATION_RATE = 0.98;

  const snapProps = {
    bounces: false,
    decelerationRate: DECELERATION_RATE,
    snapToInterval: SNAP_TO_INTERVAL,
  };

  return (
    <ScrollableSwimlane title={title} navLink={viewAll} onNavLinkPress={onPress}>
      <FlatList
        listRef={flatListRef}
        data={urns}
        renderItem={renderItem}
        horizontal
        contentContainerStyle={styles.scrollableContainer}
        viewabilityConfigCallbackPairs={viewabilityConfigPair}
        getItemLayout={getItemLayout}
        {...snapProps}
      />
    </ScrollableSwimlane>
  );
};

type MemoizedProps = ComponentProps & {
  items: PartialItem[];
  viewabilityProps: ViewabilityProps;
  onPress: () => void;
};

const MemoizedSwimlaneCardGroup: FunctionComponent<MemoizedProps> = memo(
  ({ title, items, viewAll, viewabilityProps, onPress, visible: isSwimlaneVisible }) => {
    const itemsCount = items.length;
    const style = useMemo(() => (itemsCount === 1 ? styles.singleCard : styles.multipleCards), [itemsCount]);

    const renderItem = useCallback<RenderItem<PartialItem>>(
      ({ item: { urn, typename, visible }, index }) => {
        const viewStyle = [style, itemsCount === index + 1 ? styles.lastItem : null];

        return (
          <View style={viewStyle}>
            <ConnectedCard urn={urn} component={Card} typename={typename} visible={isSwimlaneVisible && visible} />
          </View>
        );
      },
      [style, itemsCount, isSwimlaneVisible],
    );

    const getItemLayout = useCallback(
      (_: ArrayLike<PartialItem> | null | undefined, index: number) => {
        const fixedWidth = style.width + style.marginRight;
        return {
          length: fixedWidth,
          offset: fixedWidth * index,
          index,
        };
      },
      [style],
    );

    return (
      <ScrollableSwimlaneRenderFn
        title={title}
        urns={items}
        renderItem={renderItem}
        viewabilityProps={viewabilityProps}
        viewAll={viewAll}
        onPress={onPress}
        getItemLayout={getItemLayout}
      />
    );
  },
);

MemoizedSwimlaneCardGroup.displayName = "MemoizedSwimlaneCardGroup";

const RacingSwimlaneCardGroup: FunctionComponent<ComponentProps> = (props) => {
  const {
    title,
    items: partials,
    cardgroupURN,
    viewAll,
    dispatchFetchCards,
    dispatchViewAllTap,
    dispatchFetchCardsAction,
  } = props;

  // Pull the live race statuses from Redux to enable dynamic filtering of finished
  const races = useSelector((state: ApplicationState) => state.entities.races);
  const raceMarketCards = useSelector((state: ApplicationState) => state.layouts.cards.racemarkets);

  // Dynamically filter out finished races instantly
  const activePartials = useMemo(() => {
    return partials.filter((item) => {
      // Only apply this to Race Market Cards
      if (item.typename !== "RaceMarketCard") return true;

      const card = raceMarketCards?.[item.urn];
      if (!card?.race) return true;

      const currentStatus = races?.[card.race]?.details?.status;

      // Drop the card instantly if the fast poller says it's finished
      if (
        currentStatus === RaceStatus.RESULT ||
        currentStatus === RaceStatus.FINISHED ||
        currentStatus === RaceStatus.ABANDONED ||
        currentStatus === RaceStatus.WEIGHED_IN ||
        currentStatus === RaceStatus.RACE_VOID
      ) {
        return false;
      }

      return true;
    });
  }, [partials, races, raceMarketCards]);

  // Use the filtered array instead of the raw partials
  const items = useCardGroupItems(activePartials, isCardImplemented);

  const onPress = useCallback(() => {
    if (!viewAll) return;

    dispatchViewAllTap({
      title,
      viewAll,
      cardgroupURN,
    });
    navigate(viewAll.viewLink);
  }, [cardgroupURN, dispatchViewAllTap, title, viewAll]);

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

  useRefreshComponent({
    urn: cardgroupURN,
    refreshAction: () => {
      dispatchFetchCardsAction(cardgroupURN);
    },
    chefComponentName: "RacingSwimlaneCardGroup",
  });

  return <MemoizedSwimlaneCardGroup onPress={onPress} viewabilityProps={viewabilityProps} {...props} items={items} />;
};

export default RacingSwimlaneCardGroup;
