type PebbleCardGroupCollapseTogglePayload = {
  pageType: string | null;
  pebbleCardGroupTitle: string | undefined;
  tabName: string | undefined;
  isExpanded: boolean;
};

type Events = {
  "@@UI/PEBBLE_CARD_GROUP_COLLAPSE_TOGGLE": PebbleCardGroupCollapseTogglePayload;
};

export type { Events as PebbleCardGroupEvents };
