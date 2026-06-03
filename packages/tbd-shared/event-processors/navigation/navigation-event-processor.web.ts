import { getStore } from "@ppb/tbd-store/create-store";
import { PUSH, TAB_ROUTE_UPDATE, EXTERNAL_PUSH_BLANK, GENERIC_PUSH } from "@ppb/tbd-store/actions/router";
import subscribeEvent from "../../event-broker/event-subscriber";
import { promotionOnTapProcessor } from "./resolvers/promotion-resolver.web";
import { gamingPrizeMachineOnTapProcessor } from "./resolvers/gaming-prize-machine-resolver.web";
import { quicklinksGridItemOnTapProcessor } from "./resolvers/quicklinks-grid-resolver.web";
import { PromotionsHubEvents } from "../../components/PromotionsHub/events";

const HOME_VIEW_LINK = {
  viewUrn: "ppb:tbd:view:generic:home",
  viewUrl: "",
};

const register = () => {
  const store = getStore();

  // Default navigation events
  const defaultNavigationEvents = [
    "@@UI/GENERIC_SWITCHER_CLOSE",
    "@@UI/RACE_SWITCHER_CLOSE",
    "@@UI/STATS_PLAYERS_SEASON_STATS_PLAYER_CLICK",
  ] as const;

  defaultNavigationEvents.forEach((event) => {
    subscribeEvent(event, (payload) => {
      store.dispatch({
        type: PUSH,
        payload: payload.viewLink,
      });
    });
  });

  const breadcrumbNavigationEvents = ["@@UI/BREADCRUMBS_CARD_BREADCRUMB_TAP_NAV"] as const;

  breadcrumbNavigationEvents.forEach((event) => {
    subscribeEvent(event, (payload) => {
      store.dispatch({
        type: PUSH,
        payload: payload.viewLink,
      });
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
  const prizeMachineNavigationEvents = [
    "@@UI/PRIZE_MACHINE_PLAY_BTN_CLICK_NAV",
    "@@UI/PRIZE_MACHINE_TCs_LINK_CLICK_NAV",
    "@@UI/PRIZE_MACHINE_POST_PLAY_CLICK_NAV",
  ] as const;

  prizeMachineNavigationEvents.forEach((event) => {
    subscribeEvent(event, (payload) => {
      gamingPrizeMachineOnTapProcessor(payload);
    });
  });

  const quicklinksGridNavigationEvents = ["@@UI/QUICKLINKS_GRID_ITEM_CARD_TAP"] as const;

  quicklinksGridNavigationEvents.forEach((event) => {
    subscribeEvent(event, (payload) => {
      quicklinksGridItemOnTapProcessor(payload);
    });
  });

  subscribeEvent("@@UI/RACE_MEETING_VIEW_RACE_SELECTED", (payload) => {
    store.dispatch({
      type: TAB_ROUTE_UPDATE,
      payload: { viewLink: payload.viewLink },
    });
  });

  subscribeEvent("@@UI/RACE_MEETING_VIEW_SIBLING_SELECTED", (payload) => {
    store.dispatch({
      type: TAB_ROUTE_UPDATE,
      payload: { viewLink: payload.viewLink },
    });
  });

  // Promotions Hub navigation events
  subscribeEvent("@@UI/PROMOTIONS_HUB_CARD_TAP", (payload: PromotionsHubEvents["@@UI/PROMOTIONS_HUB_CARD_TAP"]) => {
    if (!payload.action) {
      return;
    }

    let action = payload.action;
    const promosBaseUrl = window.__TBD_ENVIRONMENT__?.ENDPOINTS?.PROMOS;

    if (promosBaseUrl) {
      const viewUrl = `${promosBaseUrl.replace(/\/$/, "")}/promotion?promoCode=${encodeURIComponent(
        payload.promoCode,
      )}`;
      action = {
        ...payload.action,
        viewUrl,
      };
    }

    store.dispatch({ type: EXTERNAL_PUSH_BLANK, payload: action });
  });

  subscribeEvent("@@UI/PROMOTIONS_HUB_CARD_CTA_TAP", (payload) => {
    if (payload.action) {
      store.dispatch({ type: GENERIC_PUSH, payload: payload.action });
    }
  });

  subscribeEvent("@@UI/PROMOTIONS_HUB_CARD_GROUP_BACK_TO_HOMEPAGE_TAP", () => {
    store.dispatch({
      type: PUSH,
      payload: HOME_VIEW_LINK,
    });
  });
};

export default register;
