import i18next from "i18next";

import type { NewReleaseStorage } from "@ppb/tbd-store";

const NEW_RELEASES_LOCAL_STORAGE_ID = `newestReleases_${i18next.language}`;

const getLocalStorageItem = (): NewReleaseStorage => {
  const newReleasesLocalStorage = window?.localStorage?.getItem(NEW_RELEASES_LOCAL_STORAGE_ID);

  if (newReleasesLocalStorage) {
    return JSON.parse(newReleasesLocalStorage);
  }

  return { new: [], seen: [] };
};

const setLocalStorageItem = (content: NewReleaseStorage): NewReleaseStorage => {
  window?.localStorage?.setItem(NEW_RELEASES_LOCAL_STORAGE_ID, JSON.stringify(content));

  return content;
};

export const initNewReleases = (latestGames: string[]): NewReleaseStorage => {
  if (latestGames.length === 0) {
    return setLocalStorageItem({ new: [], seen: [] });
  }

  const { new: newGames, seen: seenGames } = getLocalStorageItem();

  const notIncludedGames = latestGames.filter((game) => !newGames.includes(game) && !seenGames.includes(game));

  return setLocalStorageItem({
    new: [...newGames.filter((game) => latestGames.includes(game)), ...notIncludedGames],
    seen: seenGames.filter((game) => latestGames.includes(game)),
  });
};

export const getStoredNewestReleasedGames = (): string[] => {
  const { new: newGames, seen: seenGames } = getLocalStorageItem();

  return [...newGames, ...seenGames];
};

export const updateSeenGames = (uid: string): void => {
  const { new: newGames, seen: seenGames } = getLocalStorageItem();

  if (newGames.includes(uid)) {
    setLocalStorageItem({
      new: newGames.filter((gameUid) => gameUid !== uid),
      seen: [...seenGames, uid],
    });
  }
};
