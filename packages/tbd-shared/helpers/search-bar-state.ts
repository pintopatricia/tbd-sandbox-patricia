import { INPUT_LENGTH_SEARCH_TRIGGER } from "@ppb/tbd-store/config/common-config";

export enum SearchBarState {
  IDLE = "IDLE",
  HISTORY = "HISTORY",
  RESULTS = "RESULTS",
}

export const getSearchState = (
  isFocused: boolean,
  inputSearchTerm: string,
  hasSearchHistory: boolean,
): SearchBarState => {
  const hasEnoughChars = inputSearchTerm.length >= INPUT_LENGTH_SEARCH_TRIGGER;

  if (isFocused) {
    return hasSearchHistory && !hasEnoughChars ? SearchBarState.HISTORY : SearchBarState.RESULTS;
  }

  return hasEnoughChars ? SearchBarState.RESULTS : SearchBarState.IDLE;
};
