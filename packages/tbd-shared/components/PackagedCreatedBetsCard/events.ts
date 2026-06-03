type PackagedCreatedBetsCollapseTogglePayload = {
  pageType: string | null;
  pebbleCardGroupTitle: string | undefined;
  tabName: string | undefined;
  isExpanded: boolean;
};

type PackagedCreatedBetsShowMoreShowLessClickPayload = {
  pageType: string | null;
  pebbleCardGroupTitle: string | undefined;
  tabName: string | undefined;
};

type Events = {
  "@@UI/PACKAGED_CREATED_BETS_COLLAPSE_TOGGLE": PackagedCreatedBetsCollapseTogglePayload;
  "@@UI/PACKAGED_CREATED_BETS_SHOW_MORE_CLICK": PackagedCreatedBetsShowMoreShowLessClickPayload;
  "@@UI/PACKAGED_CREATED_BETS_SHOW_LESS_CLICK": PackagedCreatedBetsShowMoreShowLessClickPayload;
};

export type { Events as PackagedCreatedBetCardEvents };
