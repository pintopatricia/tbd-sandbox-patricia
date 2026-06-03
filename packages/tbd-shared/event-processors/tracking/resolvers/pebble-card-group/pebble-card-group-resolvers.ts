import { buildInterfaceEvent } from "tagging-library";
import { PebbleCardGroupEvents } from "../../../../components/PebbleCardGroup/events";

export function pebbleCardGroupCollapseToggleTrackingResolver(
  payload: PebbleCardGroupEvents["@@UI/PEBBLE_CARD_GROUP_COLLAPSE_TOGGLE"],
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
