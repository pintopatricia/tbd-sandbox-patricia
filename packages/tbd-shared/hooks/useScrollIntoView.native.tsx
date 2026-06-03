import { useScrollOffsetContext } from "@ppb/the-wall-native/helpers/ScrollContext";
import { useDebounceCallback } from "@ppb/the-wall-native";

import { createContext, FunctionComponent, RefObject, useCallback, useContext, useMemo } from "react";

import * as React from "react";
import { FlatList, LayoutChangeEvent, NativeMethods, ScrollViewComponent, View } from "react-native";

type ScrollViewWithMethods = (View | ScrollViewComponent) & NativeMethods;

export const WrapperContext = createContext<{
  ref: React.RefObject<FlatList | null> | null;
  scrollableAreaHeight: number;
}>({ ref: null, scrollableAreaHeight: 0 });

export const ScrollIntoViewProvider: FunctionComponent<{
  wrappingRef: React.RefObject<FlatList | null>;
  children: React.ReactNode;
  scrollableAreaHeight: number;
}> = ({ wrappingRef, scrollableAreaHeight, children }) => {
  const value = useMemo(
    () => ({
      ref: wrappingRef,
      scrollableAreaHeight,
    }),
    [wrappingRef, scrollableAreaHeight],
  );
  return <WrapperContext.Provider value={value}>{children}</WrapperContext.Provider>;
};

type ScrollIntoViewHook = <T extends View | null>(
  ref: RefObject<T>,
  animated?: boolean,
) => (event: LayoutChangeEvent, forceToTop?: boolean) => void;

export const useScrollIntoView: ScrollIntoViewHook = (ref, animated = false) => {
  const wrapperContext = useContext(WrapperContext);
  const scrollPosition = useScrollOffsetContext();
  const scroller = useCallback(
    (forceToTop?: boolean): void => {
      if (!ref.current || !wrapperContext?.ref?.current) {
        return;
      }

      if (forceToTop) {
        wrapperContext.ref?.current?.scrollToOffset({ offset: 0, animated });
        return;
      }

      const nativeScrollRef = wrapperContext.ref.current?.getNativeScrollRef() as ScrollViewWithMethods;

      if (nativeScrollRef) {
        ref.current.measureLayout(
          nativeScrollRef,
          (__, top, ___, height) => {
            if (!wrapperContext?.ref?.current) {
              return;
            }

            const remainingSpace = wrapperContext.scrollableAreaHeight - height;
            const scrollPositionGuard = scrollPosition || 0;
            const isOutsideView = top < scrollPositionGuard || scrollPositionGuard <= top - remainingSpace;

            if (isOutsideView) {
              wrapperContext.ref.current.scrollToOffset({ offset: top - remainingSpace, animated });
            }
          },
          () => {},
        );
      }
    },
    [ref, scrollPosition, wrapperContext.ref, wrapperContext.scrollableAreaHeight, animated],
  );

  const debounceScroller = useDebounceCallback(scroller, 200);
  const persistedEventScroller = useCallback(
    (event: LayoutChangeEvent, forceToTop?: boolean) => {
      // Since this is debounced, it happens somewhere in the future when the event loop consumes the message
      // It means this needs to be persisted, since it's a SyntheticEvent it will null it right after usage.
      // React 17 and forward this shouldn't be needed.
      event.persist();

      if (forceToTop) {
        scroller(forceToTop);
      } else {
        debounceScroller();
      }
    },
    [debounceScroller, scroller],
  );

  return persistedEventScroller;
};
