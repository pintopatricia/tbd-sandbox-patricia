import {
  SearchBarOnCancelCallback,
  SearchBarOnChangeCallback,
  SearchBarOnFocusCallback,
  SearchBarOnCleanCallback,
} from "@ppb/the-wall-common/types";

import type { JSX } from "react";

type GamingSearchContaineri18n = {
  i18n: {
    searchPlaceholder: string;
    cancel: string;
    outOfIdeasLabel?: string;
    noResultsLabel?: string;
    numberOfResultsLabel?: string;
    searchPlaceholderActive?: string;
    searchHistoryLabel?: string;
  };
};

type GamingContainers = {
  default: JSX.Element;
  recommendedGames: JSX.Element;
  searchResults: JSX.Element;
};

export type GamingSearchContainerProps = {
  containers: GamingContainers;
  translations: GamingSearchContaineri18n;
  numberOfResults: number;
  onCancel: SearchBarOnCancelCallback;
  onChange: SearchBarOnChangeCallback;
  onFocusSearchBar: SearchBarOnFocusCallback;
  onSearchHistoryPebbleClick?: SearchBarOnChangeCallback;
  cleanResults: SearchBarOnCleanCallback;
  shouldHandleOnBlur: boolean;
  inputSearchTerm?: string;
  isGamingZone?: boolean;
  shouldDisplaySearchHistory?: boolean;
  pinGamingSearch?: boolean;
};
