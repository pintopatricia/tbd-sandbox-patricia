import { PlatformType, TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { createViewTypeSelector } from "@ppb/tbd-store/state/layout/layout-selectors";
import { buildInterfaceEvent, buildPromotionEvent } from "tagging-library";
import { LoyaltyPromoCardEvents } from "@ppb/tbd-components-promotions/components/LoyaltyPromoCard/viewmodel/events";
import { codecs } from "@ppb/tbd-urn-codecs";
import { getStore } from "@ppb/tbd-store/create-store";
import { EditorialPromoCardEvents } from "@ppb/tbd-components-promotions/components/EditorialPromoCard/viewmodel/events";
import { SelectionPromoCardEvents } from "@ppb/tbd-components-promotions/components/SelectionPromoCard/viewmodel/events";
import { getLayoutMetadata } from "@ppb/tbd-store/state/layout-snapshot";
import { getGameByURN } from "@ppb/tbd-store/state/entities/games/game-selectors";
import {
  getGameTileClickEvent,
  getPromotionClickEvent,
  getBannerClickEvent,
} from "@ppb/tbd-store/middlewares/tagging-resolvers";
import { createGetGamingSearchInputSelector } from "@ppb/tbd-store/state/layout/views/browse-view/browse-view-selectors";
import { BetOpportunityPromoCardEvents } from "@ppb/tbd-components-promotions/components/BetOpportunityPromoCard/viewmodel/events";
import { getPromotionCardTrackingParams } from "./Promotions.graphql";
import { getEventRegistry } from "eventemitter3-singleton";
import { getBannerEventPayload, PromoCardTapEvents } from "./util/banner/banner-util";
import { convertViewLink } from "./util/misc/misc-util";

const getViewTypeSelector = createViewTypeSelector();
const getGamingSearchInput = createGetGamingSearchInputSelector();

const extractGameId = (url: string): string | null => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.searchParams.get("gameId");
  } catch {
    return null;
  }
};

const getGameUrnFromViewLink = (viewUrl?: string): string | null => {
  if (!viewUrl) {
    return null;
  }

  const gameId = extractGameId(viewUrl);
  if (!gameId) {
    return null;
  }

  try {
    const codec = codecs.gaming.game.encode("uid", gameId);
    return codec.uid;
  } catch {
    return null;
  }
};

export const getLoyaltyPromotionOptInTapEvent = (
  action: LoyaltyPromoCardEvents["@@UI/LOYALTY_PROMO_CARD_OPT_IN_TAP"],
  sendEvent: (payload: any) => void,
) => {
  const { __typename, optInState, optInStateLabel, subTitle, title, promotionUrn } = action;

  const state = getStore().getState();
  const pageType = getViewTypeSelector(state);
  const id = codecs.loyaltyPromotion.decode(promotionUrn);

  const { horizontalPosition } = getLayoutMetadata(promotionUrn);

  const event = buildPromotionEvent({
    action: TaggingAction.ACCEPT_PROMOTION,
    elementText: title || "null",
    module: `${pageType} - ${__typename === "LoyaltyPromoCard" ? "banner" : "mini banner"}`,
    destinationUrl: "null",
    position: `${horizontalPosition}`,
    promotionId: id || "null",
    promotionName: subTitle || "null",
    promotionUserStatus: optInState,
    promotionState: optInStateLabel,
    promotionType: "opt in",
    progressBar: "null",
    tierLevel: "null",
  });

  sendEvent(event);
};

const getIsOptedInLabel = (isOptInSelected: boolean) => (isOptInSelected ? "post opt in" : "pre opt in");

export const getLoyaltyPromotionBottomSheetOpenEvent = (
  action: LoyaltyPromoCardEvents["@@UI/LOYALTY_PROMO_CARD_BOTTOM_SHEET_OPEN"],
  sendEvent: (payload: any) => void,
) => {
  const { isOptInSelected } = action;
  bannerClickResolver(action, sendEvent, TaggingAction.CLICKED_BANNER, ` - ${getIsOptedInLabel(isOptInSelected)}`);

  const { title } = action;

  const state = getStore().getState();
  const pageType = getViewTypeSelector(state);

  const event = buildInterfaceEvent({
    action: TaggingAction.OPENED,
    elementText: title,
    module: `${pageType} - banner details`,
  });

  sendEvent(event);
};

export const getLoyaltyPromotionBottomSheetCloseEvent = (
  action: LoyaltyPromoCardEvents["@@UI/LOYALTY_PROMO_CARD_BOTTOM_SHEET_CLOSE"],
  sendEvent: (payload: any) => void,
) => {
  const { title } = action;
  const state = getStore().getState();
  const pageType = getViewTypeSelector(state);

  const event = buildInterfaceEvent({
    action: TaggingAction.CLOSED,
    elementText: title,
    module: `${pageType} - banner details`,
  });

  sendEvent(event);
};

export const bannerClickResolver = (
  action: PromoCardTapEvents,
  sendEvent: (payload: any) => void,
  taggingAction: TaggingAction,
  titleConcat?: string,
) => {
  const store = getStore();
  const state = store.getState();
  const payload = getBannerEventPayload(action, taggingAction);

  if (!payload) return;

  const bannerEvent = getBannerClickEvent(payload, state, titleConcat);

  sendEvent(bannerEvent);
};

export const loyaltyPromoCardTapResolver = (
  action: LoyaltyPromoCardEvents["@@UI/LOYALTY_PROMO_CARD_TAP"],
  sendEvent: (payload: any) => void,
) => {
  const { emit } = getEventRegistry();

  const { isOptInSelected } = action;
  bannerClickResolver(action, sendEvent, TaggingAction.CLICKED_BANNER, ` - ${getIsOptedInLabel(isOptInSelected)}`);

  emit("@@UI/LOYALTY_PROMO_CARD_TAP_NAV", action);
};

export const loyaltyPromoCardCTATapResolver = (
  action: LoyaltyPromoCardEvents["@@UI/LOYALTY_PROMO_CARD_CTA_TAP"],
  sendEvent: (payload: any) => void,
) => {
  const { emit } = getEventRegistry();

  bannerClickResolver(action, sendEvent, TaggingAction.CLICKED_BANNER_CTA, ` - ${getIsOptedInLabel(true)}`);

  emit("@@UI/LOYALTY_PROMO_CARD_CTA_TAP_NAV", action);
};

export const editorialPromoCardTapResolver = (
  action: EditorialPromoCardEvents["@@UI/EDITORIAL_PROMO_CARD_PROMO_TAP"],
  sendEvent: (payload: any) => void,
) => {
  const { emit } = getEventRegistry();

  bannerClickResolver(action, sendEvent, TaggingAction.CLICKED_BANNER);

  emit("@@UI/EDITORIAL_PROMO_CARD_PROMO_TAP_NAV", action);
};

export const editorialPromoCardTermsAndConditionsTapResolver = (
  action: EditorialPromoCardEvents["@@UI/EDITORIAL_PROMO_CARD_TERMS_AND_CONDITIONS_TAP"],
  sendEvent: (payload: any) => void,
) => {
  const { emit } = getEventRegistry();

  bannerClickResolver(action, sendEvent, TaggingAction.CLICKED_BANNER_TERMS_AND_CONDITIONS);
  gameTileClickEventResolver(action, sendEvent);
  promotionTermsAndConditionsResolver(action, sendEvent);

  emit("@@UI/EDITORIAL_PROMO_CARD_TERMS_AND_CONDITIONS_TAP_NAV", action);
};

export const betOpportunityPromoCardTapResolver = (
  action: BetOpportunityPromoCardEvents["@@UI/BET_OPPORTUNITY_PROMO_CARD_PROMO_TAP"],
  sendEvent: (payload: any) => void,
) => {
  const { emit } = getEventRegistry();

  bannerClickResolver(action, sendEvent, TaggingAction.CLICKED_BANNER);

  emit("@@UI/BET_OPPORTUNITY_PROMO_CARD_PROMO_TAP_NAV", action);
};

export const betOpportunityPromoCardTermsAndConditionsTapResolver = (
  action: BetOpportunityPromoCardEvents["@@UI/BET_OPPORTUNITY_PROMO_CARD_TERMS_AND_CONDITIONS_TAP"],
  sendEvent: (payload: any) => void,
) => {
  const { emit } = getEventRegistry();

  bannerClickResolver(action, sendEvent, TaggingAction.CLICKED_BANNER_TERMS_AND_CONDITIONS);
  promotionTermsAndConditionsResolver(action, sendEvent);

  emit("@@UI/BET_OPPORTUNITY_PROMO_CARD_TERMS_AND_CONDITIONS_TAP_NAV", action);
};

export const selectionPromoCardTapResolver = (
  action: SelectionPromoCardEvents["@@UI/SELECTION_PROMO_CARD_PROMO_TAP"],
  sendEvent: (payload: any) => void,
) => {
  const { emit } = getEventRegistry();

  bannerClickResolver(action, sendEvent, TaggingAction.CLICKED_BANNER);

  emit("@@UI/SELECTION_PROMO_CARD_PROMO_TAP_BANNER_TAGGING_FINISHED", action);
};

export const gameTileClickEventResolver = (
  action: EditorialPromoCardEvents["@@UI/EDITORIAL_PROMO_CARD_PROMO_TAP"],
  sendEvent: (payload: any) => void,
) => {
  const state = getStore().getState();
  const { urn, viewLink } = action;
  const { viewUrl } = viewLink;

  const gameUrn = getGameUrnFromViewLink(viewUrl);
  if (!gameUrn) {
    return;
  }

  // FIXME: We are querying game state without actually fetching that data.
  const metadata = getLayoutMetadata(urn);
  const game = getGameByURN(state.entities.games, gameUrn);
  const inputSearchTerm = getGamingSearchInput(state);

  let label = "";
  let zoneTitle = "";

  const viewZoneTitle = metadata?.viewZoneTitle ?? "";
  const gameName = game?.name ?? "";
  const gameProvider = game?.provider.name ?? "";
  const launchId = game?.launchId ?? "";
  const gamePosition = metadata?.horizontalPosition;
  const verticalPosition = metadata?.verticalPosition;
  const horizontalPosition = metadata?.horizontalPosition;

  if (inputSearchTerm) {
    zoneTitle = "search results";
    label = `search text - ${inputSearchTerm}`;
  } else if (viewZoneTitle) {
    zoneTitle = `${viewZoneTitle} - ${metadata.cardGroupTitle}`;
  } else if (metadata.cardGroupTitle) {
    zoneTitle = metadata.cardGroupTitle;
  }

  const event = getGameTileClickEvent(
    zoneTitle,
    label,
    gameName,
    viewUrl,
    gameProvider,
    launchId,
    gamePosition,
    verticalPosition,
    horizontalPosition,
    horizontalPosition,
    window ? PlatformType.Web : PlatformType.Native,
  );

  sendEvent(event);
};

type Actions =
  | EditorialPromoCardEvents["@@UI/EDITORIAL_PROMO_CARD_TERMS_AND_CONDITIONS_TAP"]
  | BetOpportunityPromoCardEvents["@@UI/BET_OPPORTUNITY_PROMO_CARD_TERMS_AND_CONDITIONS_TAP"];

export const promotionTermsAndConditionsResolver = (action: Actions, sendEvent: (payload: any) => void) => {
  const { viewLink, urn } = action;
  const { title } = getPromotionCardTrackingParams(urn) || {};

  if (!title) {
    return;
  }

  const store = getStore();
  const state = store.getState();
  const payload = {
    viewLink: convertViewLink(viewLink),
    title,
    promotionUrn: urn,
    taggingAction: TaggingAction.CLICKED_BANNER_TERMS_AND_CONDITIONS,
  };

  const event = getPromotionClickEvent(payload, state, TaggingAction.CLICKED_BANNER_TERMS_AND_CONDITIONS);

  sendEvent(event);
};
