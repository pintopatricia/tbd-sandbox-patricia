import i18next from "i18next";

const FAVOURITES_NOTIFICATIONS_LOCAL_STORAGE_ID = `favouritesNotifications_${i18next.language}`;

type FavouritesNotificationStorage = {
  unseenCount: number;
  addedGameIds: string[];
};

/**
 * Check if we're in a browser environment with localStorage available
 */
const isLocalStorageAvailable = (): boolean => {
  try {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  } catch {
    return false;
  }
};

const getLocalStorageItem = (): FavouritesNotificationStorage => {
  if (!isLocalStorageAvailable()) {
    return { unseenCount: 0, addedGameIds: [] };
  }

  try {
    const storage = window.localStorage.getItem(FAVOURITES_NOTIFICATIONS_LOCAL_STORAGE_ID);
    if (storage) {
      return JSON.parse(storage);
    }
  } catch (error) {
    console.warn("Failed to read from localStorage:", error);
  }

  return { unseenCount: 0, addedGameIds: [] };
};

const setLocalStorageItem = (content: FavouritesNotificationStorage): void => {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    window.localStorage.setItem(FAVOURITES_NOTIFICATIONS_LOCAL_STORAGE_ID, JSON.stringify(content));
  } catch (error) {
    console.warn("Failed to write to localStorage:", error);
  }
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
