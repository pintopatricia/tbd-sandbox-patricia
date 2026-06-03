type PriceBoostMultisCollapseTogglePayload = {
  pageType: string | null;
  zoneName: string | undefined;
  tabName: string | undefined;
  isExpanded: boolean;
};

type PriceBoostMultisShowMoreShowMoreLessClickPayload = {
  isOpen: boolean;
  pageType: string | null;
  zoneName: string | undefined;
  tabName: string | undefined;
};

type Events = {
  "@@UI/PRICE_BOOST_MULTIS_LIST_COLLAPSE_TOGGLE": PriceBoostMultisCollapseTogglePayload;
  "@@UI/PRICE_BOOST_MULTIS_LIST_SHOW_MORE_SHOW_LESS_CLICK": PriceBoostMultisShowMoreShowMoreLessClickPayload;
};

export type { Events as PriceBoostMultisListCardEvents };
