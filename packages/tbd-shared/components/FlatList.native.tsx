import {
  INITIAL_NUM_TO_RENDER,
  MAX_TO_RENDER_PER_BATCH,
  REMOVE_CLIPPED_SUBVIEWS,
  UPDATE_CELLS_BATCHING_PERIOD,
  WINDOW_SIZE,
} from "@ppb/the-wall-native/helpers/flatlist-props";
import { useCallback, useState, useEffect, useRef } from "react";
import * as React from "react";
import {
  FlatList as ReactNativeFlatlist,
  FlatListProps as ReactNativeFlatListProps,
  ViewToken,
  ListRenderItem,
  ViewabilityConfigCallbackPairs,
} from "react-native";

type ViewableItemsChanged = {
  viewableItems: ViewToken[];
  changed: ViewToken[];
};

export type OnViewableItemsChanged = ({ changed, viewableItems }: ViewableItemsChanged) => void;

export type ViewabilityProps = {
  viewabilityConfig: {
    minimumViewTime?: number;
    itemVisiblePercentThreshold?: number;
    waitForInteraction?: boolean;
  };

  onViewableItemsChanged: OnViewableItemsChanged;
};

const DEFAULT_VIEWABILITY_CONFIG: ViewabilityProps["viewabilityConfig"] = {
  minimumViewTime: 0,
  itemVisiblePercentThreshold: 0,
  waitForInteraction: false,
};

type FlatListItem = {
  urn: string;
  visible: boolean;
};

export type RenderItem<T = FlatListItem> = ListRenderItem<T & FlatListItem>;

type FlatListWhiteListProps<T> = Pick<
  ReactNativeFlatListProps<T>,
  | "bounces"
  | "contentContainerStyle"
  | "data"
  | "decelerationRate"
  | "getItemLayout"
  | "horizontal"
  | "initialNumToRender"
  | "ItemSeparatorComponent"
  | "keyboardDismissMode"
  | "keyboardShouldPersistTaps"
  | "ListHeaderComponent"
  | "ListHeaderComponentStyle"
  | "maxToRenderPerBatch"
  | "numColumns"
  | "onLayout"
  | "onMomentumScrollEnd"
  | "onEndReached"
  | "onEndReachedThreshold"
  | "onScroll"
  | "onScrollEndDrag"
  | "onScrollToIndexFailed"
  | "onViewableItemsChanged"
  | "pagingEnabled"
  | "refreshControl"
  | "removeClippedSubviews"
  | "scrollEnabled"
  | "scrollEventThrottle"
  | "showsHorizontalScrollIndicator"
  | "showsVerticalScrollIndicator"
  | "snapToInterval"
  | "stickyHeaderIndices"
  | "style"
  | "updateCellsBatchingPeriod"
  | "viewabilityConfig"
  | "viewabilityConfigCallbackPairs"
  | "windowSize"
  | "columnWrapperStyle"
>;

export type FlatListProps<T extends { urn: string }> = FlatListWhiteListProps<T> & {
  accessible?: boolean;
  accessibilityLabel?: string;
  testID?: string;
  data: ArrayLike<T> | null | undefined;
  renderItem: ListRenderItem<T & FlatListItem> | null | undefined;
  keyExtractor?: ((item: T, index: number) => string) | undefined;

  /**
   * Reference that will be passed to the react native original FlatList. Why not use forwardRef normal ref? If we do
   * creating a Generic function component would not be possible.
   */
  listRef?: React.RefObject<ReactNativeFlatlist | null> | undefined;
};

/**
 * Optimized version of the flatlist for the TBD busecase. It accepts an array of props (urn, typename and visible)
 * but changes the visible props if an item is visible within the viewport.
 *
 * It also memoize the rendered component on each renderItem so this change only re-renders the components that
 * actually change.
 *
 * @param props All the same props as the original React Native Flatlist
 * @returns Flatlist
 */

export function FlatList<T extends { urn: string; visible?: boolean }>({
  data,
  initialNumToRender = INITIAL_NUM_TO_RENDER,
  keyExtractor,
  keyboardShouldPersistTaps = "handled",
  listRef,
  maxToRenderPerBatch = MAX_TO_RENDER_PER_BATCH,
  onViewableItemsChanged,
  removeClippedSubviews = REMOVE_CLIPPED_SUBVIEWS,
  renderItem,
  showsHorizontalScrollIndicator = false,
  showsVerticalScrollIndicator = false,
  updateCellsBatchingPeriod = UPDATE_CELLS_BATCHING_PERIOD,
  viewabilityConfig,
  viewabilityConfigCallbackPairs,
  windowSize = WINDOW_SIZE,
  ...props
}: FlatListProps<T>) {
  // Initializing with data directly (lazy initializer) instead of [] avoids a race condition where
  // VirtualizedList's fill-rate check runs before onLayout fires (visibleLength = 0), causing the
  // list to stall at initialNumToRender until a scroll event forces a metrics refresh.
  const [list, setList] = useState(() =>
    Array.from(data || []).map((item) => ({ ...item, visible: item?.visible ?? false })),
  );
  const didMountRef = useRef(false);

  useEffect(() => {
    // Skip on mount — the lazy initializer above already produced the correct list. Running this
    // would replace it with an equivalent-but-new array reference and trigger a redundant render.
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    setList((oldList) => {
      const oldVisibility = new Map(oldList.map((item) => [item.urn, item.visible]));
      return Array.from(data || []).map((item) => ({
        ...item,
        visible: oldVisibility.get(item.urn) ?? item?.visible ?? false,
      }));
    });
  }, [data]);

  const onViewableItemsChangedWrapper = useCallback<OnViewableItemsChanged>(
    (updates) => {
      const record: Record<string, boolean> = {};

      updates.viewableItems.forEach((item) => {
        if (item.item.urn) {
          record[item.item.urn] = item.isViewable;
        }
      });

      setList((oldList) => {
        let hasChanges = false;
        const newList = oldList.map((oldItem) => {
          const newVisible = record[oldItem.urn] ?? false;
          if (oldItem.visible === newVisible) {
            return oldItem;
          }
          hasChanges = true;
          return { ...oldItem, visible: newVisible };
        });
        return hasChanges ? newList : oldList;
      });

      onViewableItemsChanged?.(updates);
    },
    [onViewableItemsChanged],
  );

  // eslint-disable-next-line react-hooks/refs -- Changes on the fly of the viewability config, pairs or callback throw an error, hence the useRef
  const viewabilityConfigCallbackPairsEnhanced = useRef<ViewabilityConfigCallbackPairs>([
    ...(viewabilityConfigCallbackPairs || []),
    {
      onViewableItemsChanged: onViewableItemsChangedWrapper,
      viewabilityConfig: viewabilityConfig || DEFAULT_VIEWABILITY_CONFIG,
    },
  ]).current;

  const keyExtractorWrapper = useCallback(
    (item: T, index: number) => {
      if (keyExtractor) {
        return keyExtractor(item, index);
      }

      return `${item.urn}`;
    },
    [keyExtractor],
  );

  return (
    <ReactNativeFlatlist
      {...props}
      data={list}
      initialNumToRender={initialNumToRender}
      keyExtractor={keyExtractorWrapper}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      maxToRenderPerBatch={maxToRenderPerBatch}
      ref={listRef}
      removeClippedSubviews={removeClippedSubviews}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      updateCellsBatchingPeriod={updateCellsBatchingPeriod}
      viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairsEnhanced}
      windowSize={windowSize}
    />
  );
}
