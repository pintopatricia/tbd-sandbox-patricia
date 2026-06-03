import Storage, { NativeStorageState } from "./storage.native";

const MAX_HISTORY = 5;
const MIN_TERM_LENGTH = 3;

const GAME_CARD_SEARCH_HISTORY_KEY = "gamingSearchHistory";
const SEARCH_BAR_SEARCH_HISTORY_KEY = "sportsSearchHistory";

type SearchHistoryKey = keyof NativeStorageState;

async function getSearchHistory(key: SearchHistoryKey): Promise<string[]> {
  const searchHistoryList = await Storage.getItem(key);
  return Array.isArray(searchHistoryList) ? searchHistoryList : [];
}

async function updateSearchHistory(searchTerm: string, key: SearchHistoryKey): Promise<void> {
  if (searchTerm.length < MIN_TERM_LENGTH) return;

  let searchHistory: string[] = await getSearchHistory(key);

  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  searchHistory = searchHistory.filter((term) => term.toLowerCase() !== lowerCaseSearchTerm);

  searchHistory.unshift(searchTerm);

  searchHistory = searchHistory.slice(0, MAX_HISTORY);

  await Storage.setItem(key, searchHistory);
}

// Gaming
export const getGamingSearchHistory = () => getSearchHistory(GAME_CARD_SEARCH_HISTORY_KEY);

export const updateGamingSearchHistory = (searchTerm: string) =>
  updateSearchHistory(searchTerm, GAME_CARD_SEARCH_HISTORY_KEY);

// Sports
export const getSportsSearchHistory = () => getSearchHistory(SEARCH_BAR_SEARCH_HISTORY_KEY);

export const updateSportsSearchHistory = (searchTerm: string) =>
  updateSearchHistory(searchTerm, SEARCH_BAR_SEARCH_HISTORY_KEY);
