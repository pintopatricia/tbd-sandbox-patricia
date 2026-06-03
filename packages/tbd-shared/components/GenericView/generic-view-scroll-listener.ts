import { RefObject, useCallback, useRef } from "react";
import { DeviceEventEmitter, NativeScrollEvent, NativeSyntheticEvent } from "react-native";

export const SCROLL_UP_EVENT = "SCROLL_UP";
export const SCROLL_DOWN_EVENT = "SCROLL_DOWN";

export const SCROLL_THRESHOLD = 10;
export const DEBOUNCE_INTERVAL_MS = 300;

function genericViewScrollListener(
  lastScrollYRef: RefObject<number>,
  lastEmitTimeRef: RefObject<number>,
  e: NativeSyntheticEvent<NativeScrollEvent>,
) {
  const currentY = e.nativeEvent.contentOffset.y;

  const now = Date.now();
  if (now - lastEmitTimeRef.current > DEBOUNCE_INTERVAL_MS) {
    if (currentY < lastScrollYRef.current - SCROLL_THRESHOLD) {
      DeviceEventEmitter.emit(SCROLL_UP_EVENT);
      lastEmitTimeRef.current = now;
    } else if (currentY > lastScrollYRef.current + SCROLL_THRESHOLD) {
      DeviceEventEmitter.emit(SCROLL_DOWN_EVENT);
      lastEmitTimeRef.current = now;
    }
  }

  lastScrollYRef.current = currentY;
}

export const useGenericViewScrollListener = () => {
  const lastScrollYRef = useRef(0);
  const lastEmitTimeRef = useRef(0);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => genericViewScrollListener(lastScrollYRef, lastEmitTimeRef, e),
    [],
  );

  return {
    ref: lastScrollYRef,
    onScroll,
  };
};
