import emitEvent from "../../event-broker/event-emitter";

export const emitCollapseToggleEvent = (
  isExpanded: boolean,
  pageType: string | null,
  pebbleCardGroupTitle: string | undefined,
  tabName: string | undefined,
) => {
  emitEvent("@@UI/PEBBLE_CARD_GROUP_COLLAPSE_TOGGLE", {
    isExpanded,
    pageType,
    pebbleCardGroupTitle,
    tabName,
  });
};
