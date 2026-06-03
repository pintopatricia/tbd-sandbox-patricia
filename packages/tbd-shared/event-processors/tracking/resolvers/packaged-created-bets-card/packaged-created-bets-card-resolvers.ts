import { buildInterfaceEvent } from "tagging-library";
import { PackagedCreatedBetCardEvents } from "../../../../components/PackagedCreatedBetsCard/events";

export function packagedCreatedBetsCollapseToggleTrackingResolver(
  payload: PackagedCreatedBetCardEvents["@@UI/PACKAGED_CREATED_BETS_COLLAPSE_TOGGLE"],
  sendEvent: (payload: any) => void,
) {
  const { isExpanded, pageType, pebbleCardGroupTitle, tabName } = payload;

  const event = buildInterfaceEvent({
    action: "clicked",
    elementText: isExpanded ? "open" : "close",
    module: `${pageType} - ${pebbleCardGroupTitle} - ${tabName}`,
  });

  sendEvent(event);
}

export function packagedCreatedBetsShowMoreTrackingResolver(
  payload: PackagedCreatedBetCardEvents["@@UI/PACKAGED_CREATED_BETS_SHOW_MORE_CLICK"],
  sendEvent: (payload: any) => void,
) {
  const { pageType, pebbleCardGroupTitle, tabName } = payload;

  const event = buildInterfaceEvent({
    action: "clicked",
    elementText: "show more",
    module: `${pageType} - ${pebbleCardGroupTitle} - ${tabName}`,
  });

  sendEvent(event);
}

export function packagedCreatedBetsShowLessTrackingResolver(
  payload: PackagedCreatedBetCardEvents["@@UI/PACKAGED_CREATED_BETS_SHOW_LESS_CLICK"],
  sendEvent: (payload: any) => void,
) {
  const { pageType, pebbleCardGroupTitle, tabName } = payload;

  const event = buildInterfaceEvent({
    action: "clicked",
    elementText: "show less",
    module: `${pageType} - ${pebbleCardGroupTitle} - ${tabName}`,
  });

  sendEvent(event);
}
