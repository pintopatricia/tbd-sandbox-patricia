import { FunctionComponent, memo, useCallback, useMemo, useRef } from "react";
import { View, ViewabilityConfigCallbackPairs, FlatList as ReactNativeFlatlist } from "react-native";
import { ScrollableSwimlane } from "@ppb/the-wall-native";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import ConnectedCard from "../Card";
import Card, { isCardImplemented } from "../Card/Card.native";
import { useNativeLazyLoading } from "../../hooks/useNativeLazyLoading.native";
import useCardGroupItems from "../../hooks/useCardGroupItems";
import { useRefreshComponent } from "../../hooks/useRefreshComponent.native";
import { useCardVisibility, CARD_VIEWABILITY_CONFIG } from "../../hooks/useCardVisibility.native";
import { FlatList, RenderItem, ViewabilityProps } from "../FlatList.native";
import { ComponentProps } from "./props";
import styles from "./PopularSwimlaneCardGroup.native.styles";

const DECELERATION_RATE = 0.98;

type ScrollableSwimlaneRenderFnProps = {
  title?: string;
  urns: PartialItem[];
  renderItem: RenderItem<PartialItem>;
  viewabilityProps: ViewabilityProps;
  getItemLayout?: (
    data: ArrayLike<PartialItem> | null | undefined,
    index: number,
  ) => { length: number; offset: number; index: number };
};

const ScrollableSwimlaneRenderFn: FunctionComponent<ScrollableSwimlaneRenderFnProps> = ({
  title,
  urns,
  viewabilityProps,
  renderItem,
  getItemLayout,
}) => {
  const flatListRef = useRef<ReactNativeFlatlist<PartialItem> | null>(null);
  const cardVisibilityConfig = useCardVisibility();

  const viewabilityConfigPair = useMemo<ViewabilityConfigCallbackPairs>(
    () => [cardVisibilityConfig, viewabilityProps],
    [cardVisibilityConfig, viewabilityProps],
  );

  const snapToInterval = styles.multipleCards.width + styles.multipleCards.marginRight;

  const snapProps = useMemo(
    () => ({
      bounces: false,
      decelerationRate: DECELERATION_RATE,
      snapToInterval,
    }),
    [snapToInterval],
  );

  return (
    <ScrollableSwimlane title={title}>
      <FlatList
        listRef={flatListRef}
        data={urns}
        renderItem={renderItem}
        horizontal
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
};

const MemoizedSwimlaneCardGroup: FunctionComponent<MemoizedProps> = memo(
  ({ title, items, viewabilityProps, visible: isSwimlaneVisible }) => {
    const itemsCount = items.length;
    const style = useMemo(() => (itemsCount === 1 ? styles.singleCard : styles.multipleCards), [itemsCount]);
    const fixedWidth = style.width || 0;

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
      (_: ArrayLike<PartialItem> | null | undefined, index: number) => ({
        length: fixedWidth,
        offset: fixedWidth * index,
        index,
      }),
      [fixedWidth],
    );

    return (
      <ScrollableSwimlaneRenderFn
        title={title}
        urns={items}
        renderItem={renderItem}
        viewabilityProps={viewabilityProps}
        getItemLayout={fixedWidth ? getItemLayout : undefined}
      />
    );
  },
);

MemoizedSwimlaneCardGroup.displayName = "MemoizedSwimlaneCardGroup";

const PopularSwimlaneCardGroup: FunctionComponent<ComponentProps> = (props) => {
  const { items: partials, cardgroupURN: urn, dispatchFetchCards, dispatchFetchCardsAction } = props;

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

  const refreshAction = useCallback(() => {
    dispatchFetchCardsAction(urn);
  }, [urn, dispatchFetchCardsAction]);

  useRefreshComponent({
    urn,
    refreshAction,
    chefComponentName: "PopularSwimlaneCardGroup",
  });

  return <MemoizedSwimlaneCardGroup viewabilityProps={viewabilityProps} {...props} />;
};

export default PopularSwimlaneCardGroup;
