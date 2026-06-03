import i18next from "i18next";

const FAVOURITES_NOTIFICATIONS_LOCAL_STORAGE_ID = `favouritesNotifications_${i18next.language}`;

type FavouritesNotificationStorage = {
  unseenCount: number;
  addedGameIds: string[];
};

const getLocalStorageItem = (): FavouritesNotificationStorage => {
  const storage = window?.localStorage?.getItem(FAVOURITES_NOTIFICATIONS_LOCAL_STORAGE_ID);

  if (storage) {
    return JSON.parse(storage);
  }

  return { unseenCount: 0, addedGameIds: [] };
};

const setLocalStorageItem = (content: FavouritesNotificationStorage): void => {
  window?.localStorage?.setItem(FAVOURITES_NOTIFICATIONS_LOCAL_STORAGE_ID, JSON.stringify(content));
};

/**
 * Increment the notification count when a game is added to favourites
 */
export const incrementFavouritesNotification = (gameId: string): void => {
  const { unseenCount, addedGameIds } = getLocalStorageItem();

  // Only increment if this game wasn't already in the unseen list
  if (!addedGameIds.includes(gameId)) {
    setLocalStorageItem({
      unseenCount: unseenCount + 1,
      addedGameIds: [...addedGameIds, gameId],
    });
  }
};

/**
 * Decrement the notification count when a game is removed from favourites
 */
export const decrementFavouritesNotification = (gameId: string): void => {
  const { unseenCount, addedGameIds } = getLocalStorageItem();

  if (addedGameIds.includes(gameId)) {
    setLocalStorageItem({
      unseenCount: Math.max(0, unseenCount - 1),
      addedGameIds: addedGameIds.filter((id) => id !== gameId),
    });
  }
};

/**
 * Get the current notification count for favourites
 */
export const getFavouritesNotificationCount = (): number => {
  const { unseenCount } = getLocalStorageItem();
  return unseenCount;
};

/**
 * Clear all notifications when user visits the favourites tab
 */
export const clearFavouritesNotifications = (): void => {
  setLocalStorageItem({ unseenCount: 0, addedGameIds: [] });
};
