import { useCallback, useState } from "react";
import { AlertProps } from "@ppb/the-wall-common/types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { isNotification } from "../components/Betslip/betslip-mapper";

export enum NotificationKeys {
  Place = "place",
  Price = "price",
  Size = "size",
  Market = "market",
}

type NotificationsState = {
  [notificationKey in NotificationKeys]?: AlertProps;
};

/**
 * Given an array of keys, return an object with keys provided and values
 * set to undefined.
 *
 * createObjectFromKeys('k1', 'k2') === Object.fromEntries([['k1'], ['k2]])
 */
const createObjectFromKeys = (keys: string[]): { [key: string]: undefined } =>
  keys.reduce((o, key) => ({ ...o, [key]: undefined }), {});

export const useNotifications = (
  marketErrorNotification?: AlertProps,
  placeErrorNotification?: AlertProps,
  runner?: URN,
): {
  addNotifications: (notification: NotificationsState) => void;
  clearNotifications: (...keysToRemove: NotificationKeys[]) => void;
  notifications: AlertProps[];
} => {
  const [notificationsMap, setNotificationsMap] = useState<NotificationsState>({
    market: marketErrorNotification,
    ...(runner && { place: placeErrorNotification }),
  });

  /**
   * Clears all notifications if no key is provided or
   * for just the keys provided.
   */
  const clearNotifications = useCallback(
    (...keysToRemove: NotificationKeys[]) => {
      if (!keysToRemove.length) {
        setNotificationsMap({});
      }
      setNotificationsMap((prevState) => ({
        ...prevState,
        ...createObjectFromKeys(keysToRemove),
      }));
    },
    [setNotificationsMap],
  );

  const addNotifications = useCallback(
    (notification: NotificationsState) => {
      setNotificationsMap((prevState) => ({ ...prevState, ...notification }));
    },
    [setNotificationsMap],
  );

  const [prevPlaceError, setPrevPlaceError] = useState(placeErrorNotification);
  const [prevRunner, setPrevRunner] = useState(runner);
  if (prevPlaceError !== placeErrorNotification || prevRunner !== runner) {
    setPrevPlaceError(placeErrorNotification);
    setPrevRunner(runner);
    if (runner) {
      addNotifications({ place: placeErrorNotification });
    } else if (prevRunner && !runner) {
      clearNotifications();
    }
  }

  const [prevMarketError, setPrevMarketError] = useState(marketErrorNotification);
  if (prevMarketError !== marketErrorNotification) {
    setPrevMarketError(marketErrorNotification);
    if (marketErrorNotification) {
      clearNotifications(NotificationKeys.Price, NotificationKeys.Size);
      addNotifications({ market: marketErrorNotification });
    } else {
      clearNotifications(NotificationKeys.Market);
    }
  }

  const notifications: AlertProps[] = Object.values(notificationsMap).filter((n): n is AlertProps => isNotification(n));

  return { addNotifications, clearNotifications, notifications };
};
