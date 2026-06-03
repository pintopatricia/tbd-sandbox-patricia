import { useState, useCallback } from "react";
import { DeviceEventEmitter } from "react-native";

export const useEmitOnce = (eventName: string) => {
  const [hasEmmitted, setHasEmitted] = useState(false);
  const emit = useCallback(
    (...args: any[]) => {
      if (!hasEmmitted) {
        DeviceEventEmitter.emit(eventName, ...args);
        setHasEmitted(true);
      }
    },
    [eventName, hasEmmitted, setHasEmitted],
  );

  return { hasEmmitted, emit };
};
