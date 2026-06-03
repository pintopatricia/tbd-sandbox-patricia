import { useEffect } from "react";
import { DeviceEventEmitter } from "react-native";
import { SCROLL_UP_EVENT, SCROLL_DOWN_EVENT } from "../../../../GenericView/generic-view-scroll-listener";

export const useScrollHandler = (isExpanded: boolean, onScrollUp: () => void, onScrollDown: () => void) => {
  useEffect(() => {
    const scrollUpSubscription = DeviceEventEmitter.addListener(SCROLL_UP_EVENT, () => {
      if (!isExpanded) {
        onScrollUp();
      }
    });

    return scrollUpSubscription.remove;
  }, [isExpanded, onScrollUp]);

  useEffect(() => {
    const scrollDownSubscription = DeviceEventEmitter.addListener(SCROLL_DOWN_EVENT, () => {
      if (isExpanded) {
        onScrollDown();
      }
    });

    return scrollDownSubscription.remove;
  }, [isExpanded, onScrollDown]);
};
