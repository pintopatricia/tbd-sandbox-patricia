import i18next from "i18next";

export const HISTORY_KEYS = {
  GAMING: `recentSearches_${i18next.language}`,
  SPORTS: "sportsSearchHistory",
} as const;

export type SearchHistoryKey = (typeof HISTORY_KEYS)[keyof typeof HISTORY_KEYS];

const MAX_HISTORY = 5;
const MIN_TERM_LENGTH = 3;

function getSearchHistory(key: SearchHistoryKey): string[] {
  const stored = localStorage.getItem(key);
  if (!stored) return [];

  const parsed = JSON.parse(stored);
  return Array.isArray(parsed) ? parsed : [];
}

export function updateSearchHistory(searchTerm: string, key: SearchHistoryKey): void {
  if (searchTerm.length < MIN_TERM_LENGTH) return;

  let history: string[] = getSearchHistory(key);

  // Remove duplicate if it exists
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  history = history.filter((term) => term.toLowerCase() !== lowerCaseSearchTerm);

  // Add new term to beginning
  history.unshift(searchTerm);

  // Keep only the last 5 entries
  history = history.slice(0, MAX_HISTORY);

  localStorage.setItem(key, JSON.stringify(history));
}

// Gaming
export const getGamingSearchHistory = () => getSearchHistory(HISTORY_KEYS.GAMING);

export const updateGamingSearchHistory = (searchTerm: string) => updateSearchHistory(searchTerm, HISTORY_KEYS.GAMING);

// Sports
export const getSportsSearchHistory = () => getSearchHistory(HISTORY_KEYS.SPORTS);

export const updateSportsSearchHistory = (searchTerm: string) => updateSearchHistory(searchTerm, HISTORY_KEYS.SPORTS);
