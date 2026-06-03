import emitEvent from "../../event-broker/event-emitter";

export const emitCollapseToggleEvent = (
  isExpanded: boolean,
  pageType: string | null,
  pebbleCardGroupTitle: string | undefined,
  tabName: string | undefined,
) => {
  emitEvent("@@UI/PACKAGED_CREATED_BETS_COLLAPSE_TOGGLE", {
    isExpanded,
    pageType,
    pebbleCardGroupTitle,
    tabName,
  });
};

export const emitShowMoreClickEvent = (
  pageType: string | null,
  pebbleCardGroupTitle: string | undefined,
  tabName: string | undefined,
) => {
  emitEvent("@@UI/PACKAGED_CREATED_BETS_SHOW_MORE_CLICK", {
    pageType,
    pebbleCardGroupTitle,
    tabName,
  });
};

export const emitShowLessClickEvent = (
  pageType: string | null,
  pebbleCardGroupTitle: string | undefined,
  tabName: string | undefined,
) => {
  emitEvent("@@UI/PACKAGED_CREATED_BETS_SHOW_LESS_CLICK", {
    pageType,
    pebbleCardGroupTitle,
    tabName,
  });
};
