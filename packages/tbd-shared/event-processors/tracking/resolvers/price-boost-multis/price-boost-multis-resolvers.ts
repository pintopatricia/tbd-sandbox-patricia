import { buildInterfaceEvent } from "tagging-library";
import { PriceBoostMultisListCardEvents } from "../../../../components/PriceBoostMultisListCard/events";

export function priceBoostMultisCollapseToggleTrackingResolver(
  payload: PriceBoostMultisListCardEvents["@@UI/PRICE_BOOST_MULTIS_LIST_COLLAPSE_TOGGLE"],
  sendEvent: (payload: any) => void,
) {
  const { isExpanded, pageType, zoneName, tabName } = payload;

  const event = buildInterfaceEvent({
    action: "clicked",
    elementText: isExpanded ? "open" : "close",
    module: `${pageType} - ${zoneName} - ${tabName}`,
  });

  sendEvent(event);
}

export function priceBoostMultisShowMoreShowLessTrackingResolver(
  payload: PriceBoostMultisListCardEvents["@@UI/PRICE_BOOST_MULTIS_LIST_SHOW_MORE_SHOW_LESS_CLICK"],
  sendEvent: (payload: any) => void,
) {
  const { pageType, zoneName, tabName, isOpen } = payload;

  const event = buildInterfaceEvent({
    action: "clicked",
    elementText: isOpen ? "show more" : "show less",
    module: `${pageType} - ${zoneName} - ${tabName}`,
  });

  sendEvent(event);
}
