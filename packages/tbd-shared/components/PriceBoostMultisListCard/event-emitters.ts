import emitEvent from "../../event-broker/event-emitter";

export const emitCollapseToggleEvent = (
  isExpanded: boolean,
  pageType: string | null,
  zoneName: string | undefined,
  tabName: string | undefined,
) => {
  emitEvent("@@UI/PRICE_BOOST_MULTIS_LIST_COLLAPSE_TOGGLE", {
    isExpanded,
    pageType,
    zoneName,
    tabName,
  });
};

export const emitShowMoreShowLessClickEvent = (
  isOpen: boolean,
  pageType: string | null,
  zoneName: string | undefined,
  tabName: string | undefined,
) => {
  emitEvent("@@UI/PRICE_BOOST_MULTIS_LIST_SHOW_MORE_SHOW_LESS_CLICK", {
    isOpen,
    pageType,
    zoneName,
    tabName,
  });
};
