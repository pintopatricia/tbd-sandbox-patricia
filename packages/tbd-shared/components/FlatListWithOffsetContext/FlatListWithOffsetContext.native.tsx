import { useCallback } from "react";
import * as React from "react";
import { NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { useUpdateScrollOffsetContext, useUpdateScrollIdleContext } from "@ppb/the-wall-native/helpers/ScrollContext";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { useScrollToTop } from "@ppb/tbd-router/native";
import { PartialItem } from "@ppb/tbd-store";
import { FLATLIST_USE_SCROLLER_NATIVE_FLATLIST } from "./FlatListWithOffsetContext.native.selectors";
import { FlatList, FlatListProps } from "../FlatList.native";

export const FlatListWithOffsetContext: React.FC<FlatListProps<PartialItem>> = (props) => {
  const setOffset = useUpdateScrollOffsetContext();
  const setIsScrollIdle = useUpdateScrollIdleContext();
  const { onScroll } = props;

  useScrollToTop(props.listRef);

  const onScrollCall = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { nativeEvent } = event;
      setOffset(nativeEvent.contentOffset.y);
      setIsScrollIdle(false);
      onScroll?.(event); // forward to parent
    },
    [setOffset, setIsScrollIdle, onScroll],
  );

  const { onMomentumScrollEnd, onScrollEndDrag } = props;

  const handleMomentumScrollEnd = useCallback(
    (ev: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (onMomentumScrollEnd) {
        onMomentumScrollEnd(ev);
      }
      setIsScrollIdle(true);
    },
    [setIsScrollIdle, onMomentumScrollEnd],
  );

  const handleScrollEndDrag = useCallback(
    (ev: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (onScrollEndDrag) {
        onScrollEndDrag(ev);
      }
      setIsScrollIdle(true);
    },
    [setIsScrollIdle, onScrollEndDrag],
  );

  return (
    <FlatList
      {...props}
      scrollEventThrottle={32}
      onScroll={onScrollCall}
      onMomentumScrollEnd={handleMomentumScrollEnd}
      onScrollEndDrag={handleScrollEndDrag}
      {...getTestProps(FLATLIST_USE_SCROLLER_NATIVE_FLATLIST, false)}
    />
  );
};
