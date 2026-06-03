import { navigate, NativeEntityTypes } from "@ppb/tbd-router/native/router";
import { getEndpoint } from "../../config/endpoints";
import subscribeEvent from "../../event-broker/event-subscriber";
import { promotionOnTapProcessor } from "./resolvers/promotion-resolver.native";
import { gamingPrizeMachineNavigateProcessor } from "./resolvers/gaming-prize-machine-resolver.native";
import { quicklinksGridItemOnTapProcessor } from "./resolvers/quicklinks-grid-resolver.native";
import { XSellBarEvents } from "../../components/Header/events";
import { PromotionsHubEvents } from "../../components/PromotionsHub/events";
import { DisplayMode } from "@ppb/the-wall-common/types/ViewLink.types";
import { externalViewCodec } from "@ppb/tbd-urn-codecs";

const HOME_VIEW_LINK = {
  viewUrn: NativeEntityTypes.Home,
};

const register = () => {
  const defaultNavigationEvents = [
    "@@UI/GENERIC_SWITCHER_CLOSE",
    "@@UI/RACE_SWITCHER_CLOSE",
    "@@UI/STATS_PLAYERS_SEASON_STATS_PLAYER_CLICK",
  ] as const;

  defaultNavigationEvents.forEach((event) => {
    subscribeEvent(event, (payload) => {
      navigate(payload.viewLink);
    });
  });

  // Promotion navigation events
  const promotionNavigationEvents = [
    "@@UI/LOYALTY_PROMO_CARD_TAP_NAV",
    "@@UI/LOYALTY_PROMO_CARD_CTA_TAP_NAV",
    "@@UI/EDITORIAL_PROMO_CARD_PROMO_TAP_NAV",
    "@@UI/BET_OPPORTUNITY_PROMO_CARD_PROMO_TAP_NAV",
    "@@UI/EDITORIAL_PROMO_CARD_TERMS_AND_CONDITIONS_TAP_NAV",
    "@@UI/BET_OPPORTUNITY_PROMO_CARD_TERMS_AND_CONDITIONS_TAP_NAV",
    "@@UI/SELECTION_PROMO_CARD_PROMO_TAP_NAV",
    "@@UI/SELF_EXCLUSION_CARD_SAFER_GAMBLING_TAP",
    "@@UI/SELF_EXCLUSION_CARD_CONTACT_TAP",
  ] as const;

  promotionNavigationEvents.forEach((event) => {
    subscribeEvent(event, (payload) => {
      promotionOnTapProcessor(payload);
    });
  });

  // Gaming Prize Machine navigation events
  const prizeMachineDirectNavEvents = [
    "@@UI/PRIZE_MACHINE_PLAY_BTN_CLICK_NAV",
    "@@UI/PRIZE_MACHINE_TCs_LINK_CLICK_NAV",
    "@@UI/PRIZE_MACHINE_POST_PLAY_CLICK_NAV",
  ] as const;

  prizeMachineDirectNavEvents.forEach((event) => {
    subscribeEvent(event, (payload) => {
      gamingPrizeMachineNavigateProcessor(payload);
    });
  });

  subscribeEvent("UI__NAVIGATE_XSELL_NATIVE_LINK", (payload: XSellBarEvents["UI__NAVIGATE_XSELL_NATIVE_LINK"]) => {
    navigate(payload);
  });

  const quicklinksGridNavigationEvents = ["@@UI/QUICKLINKS_GRID_ITEM_CARD_TAP"] as const;

  quicklinksGridNavigationEvents.forEach((event) => {
    subscribeEvent(event, (payload) => {
      quicklinksGridItemOnTapProcessor(payload);
    });
  });

  subscribeEvent("@@UI/PROMOTIONS_HUB_CARD_TAP", (payload: PromotionsHubEvents["@@UI/PROMOTIONS_HUB_CARD_TAP"]) => {
    if (!payload.action) {
      return;
    }

    let action = payload.action;

    try {
      const promosBaseUrl = getEndpoint("PROMOS");
      const viewUrl = `${promosBaseUrl.replace(/\/$/, "")}/promotion?promoCode=${encodeURIComponent(
        payload.promoCode,
      )}`;

      // This is a workaround to handle external view redirects. This will be coming from BFF in the future.
      action = {
        viewDisplayMode: DisplayMode.BlankWebview,
        viewUrl,
        viewUrn: externalViewCodec.encode().uid,
      };
    } catch {
      // Fallback to the original action URL when endpoint config is unavailable.
    }

    navigate(action);
  });

  subscribeEvent("@@UI/PROMOTIONS_HUB_CARD_CTA_TAP", (payload) => {
    if (payload.action) {
      navigate(payload.action);
    }
  });

  subscribeEvent("@@UI/PROMOTIONS_HUB_CARD_GROUP_BACK_TO_HOMEPAGE_TAP", () => {
    navigate(HOME_VIEW_LINK);
  });
};

export default register;
