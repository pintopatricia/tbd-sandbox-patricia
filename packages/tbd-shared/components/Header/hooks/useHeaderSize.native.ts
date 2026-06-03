import { useCallback, useEffect, useState } from "react";
import { DeviceEventEmitter, LayoutChangeEvent } from "react-native";

export type HeaderSizePayload = {
  width: number;
  height: number;
} | null;

export const HEADER__SIZE_REQUESTED = `HEADER/SIZE_REQUESTED`;
export const HEADER__SIZE_CHANGED = `HEADER/SIZE_CHANGED`;

export const useHeaderSize = () => {
  const [headerSize, setHeaderSize] = useState<HeaderSizePayload | null>(null);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(HEADER__SIZE_CHANGED, (size: HeaderSizePayload) =>
      setHeaderSize(size),
    );

    DeviceEventEmitter.emit(HEADER__SIZE_REQUESTED);
    return () => {
      subscription.remove();
    };
  }, []);

  return headerSize;
};

// proxy function to enforce emitted payload since DeviceEventEmitter.emit is not a generic function
const emitHeaderSizeChanged = (payload: HeaderSizePayload) => {
  DeviceEventEmitter.emit(HEADER__SIZE_CHANGED, payload);
};

export const useHeaderSizeEmitter = () => {
  const [size, setSize] = useState<HeaderSizePayload | null>(null);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  }, []);

  useEffect(() => {
    emitHeaderSizeChanged(size);
    const subscription = DeviceEventEmitter.addListener(HEADER__SIZE_REQUESTED, () => emitHeaderSizeChanged(size));

    return () => subscription.remove();
  }, [size]);

  return onLayout;
};
