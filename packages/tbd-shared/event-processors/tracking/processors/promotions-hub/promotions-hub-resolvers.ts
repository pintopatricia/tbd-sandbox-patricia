import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import {
  buildInterfaceEvent,
  InterfaceEvent,
  buildNavigationEvent,
  NavigationEvent,
  buildPromotionEvent,
  PromotionEvent,
} from "tagging-library";
import { PromotionsHubEvents } from "../../../../components/PromotionsHub/events";

let selectedPromotionsHubFilterName = "all";

export function promotionsHubCardTapResolver(
  payload: PromotionsHubEvents["@@UI/PROMOTIONS_HUB_CARD_TAP"],
  sendEvent: (payload: NavigationEvent) => void,
) {
  const event = buildNavigationEvent({
    action: TaggingAction.NAVIGATED_TO,
    destinationUrl: payload.action?.viewUrl ?? "null",
    elementText: payload.title,
    eventContext: "null",
    gameFilter: "null",
    gameId: "null",
    gameName: "null",
    gameProvider: "null",
    module: `promotions hub - ${selectedPromotionsHubFilterName} - ${payload.promoCode}`,
    moduleDisplayOrder: "null",
    position: "null",
    swimlaneType: "null",
  });

  sendEvent(event);
}

export function promotionsHubCardCTATapResolver(
  payload: PromotionsHubEvents["@@UI/PROMOTIONS_HUB_CARD_CTA_TAP"],
  sendEvent: (payload: NavigationEvent) => void,
) {
  const event = buildNavigationEvent({
    action: TaggingAction.NAVIGATED_TO,
    destinationUrl: payload.action?.viewUrl ?? "null",
    elementText: "opt in",
    eventContext: "null",
    gameFilter: "null",
    gameId: "null",
    gameName: "null",
    gameProvider: "null",
    module: `promotions hub - ${selectedPromotionsHubFilterName} - ${payload.promoCode} - promo cta`,
    moduleDisplayOrder: "null",
    position: "null",
    swimlaneType: "null",
  });

  sendEvent(event);
}

export function promotionsHubCardOptInTapResolver(
  payload: PromotionsHubEvents["@@UI/PROMOTIONS_HUB_CARD_OPT_IN_TAP"],
  sendEvent: (payload: PromotionEvent) => void,
) {
  const event = buildPromotionEvent({
    action: TaggingAction.ACCEPT_PROMOTION,
    elementText: "opt in",
    module: `promotions hub - ${selectedPromotionsHubFilterName} - ${payload.promoCode} - promo cta`,
    destinationUrl: "null",
    position: "null",
    promotionId: payload.promoCode,
    promotionType: "null",
    promotionName: payload.title,
    promotionUserStatus: payload.status ?? "null",
    promotionState: payload.optInState,
    progressBar: "null",
    tierLevel: "null",
  });

  sendEvent(event);
}

export function promotionsHubCardGroupLoadedResolver(
  _payload: PromotionsHubEvents["@@UI/PROMOTIONS_HUB_CARD_GROUP_LOADED"],
  sendEvent: (payload: InterfaceEvent) => void,
) {
  selectedPromotionsHubFilterName = "all";

  const event = buildInterfaceEvent({
    action: TaggingAction.DISPLAYED,
    elementText: "promotions hub",
    eventContext: "null",
    gameFilter: "null",
    module: "promotions hub",
    swimlaneType: "null",
  });

  sendEvent(event);
}

export function promotionsHubCardGroupPebbleListDisplayedResolver(
  payload: PromotionsHubEvents["@@UI/PROMOTIONS_HUB_CARD_GROUP_PEBBLE_LIST_DISPLAYED"],
  sendEvent: (payload: InterfaceEvent) => void,
) {
  const pebbleText = `pebble - ${payload.filters
    .map(({ filterName, filterCount }) => `${filterName}(${filterCount})`)
    .join(", ")}`;

  const event = buildInterfaceEvent({
    action: TaggingAction.DISPLAYED,
    elementText: pebbleText,
    eventContext: "null",
    gameFilter: "null",
    module: "promotions hub",
    swimlaneType: "null",
  });

  sendEvent(event);
}

export function promotionsHubCardGroupPebbleListClickResolver(
  payload: PromotionsHubEvents["@@UI/PROMOTIONS_HUB_CARD_GROUP_PEBBLE_CLICK"],
  sendEvent: (payload: InterfaceEvent) => void,
) {
  selectedPromotionsHubFilterName = payload.filterName.toLowerCase();

  const event = buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: `pebble - ${payload.filterName}`,
    eventContext: "null",
    gameFilter: "null",
    module: "promotions hub",
    swimlaneType: "null",
  });

  sendEvent(event);
}
