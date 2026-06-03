import { getStore } from "@ppb/tbd-store/create-store";
import subscribeEvent from "../../event-broker/event-subscriber";
import { promotionOnTapProcessor } from "./resolvers/promotion-resolver.web";
import { gamingPrizeMachineOnTapProcessor } from "./resolvers/gaming-prize-machine-resolver.web";
import { quicklinksGridItemOnTapProcessor } from "./resolvers/quicklinks-grid-resolver.web";
import register from "./navigation-event-processor.web";

jest.mock("@ppb/tbd-store/create-store", () => {
  const dispatch = jest.fn();

  return {
    getStore: jest.fn(() => ({
      dispatch,
    })),
  };
});

jest.mock("../../event-broker/event-subscriber", () => jest.fn());

jest.mock("./resolvers/promotion-resolver.web", () => ({
  promotionOnTapProcessor: jest.fn(),
}));

jest.mock("./resolvers/gaming-prize-machine-resolver.web", () => ({
  gamingPrizeMachineOnTapProcessor: jest.fn(),
}));

jest.mock("./resolvers/quicklinks-grid-resolver.web", () => ({
  quicklinksGridItemOnTapProcessor: jest.fn(),
}));

describe("navigation-event-processor.web", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    describe.each([
      "@@UI/GENERIC_SWITCHER_CLOSE",
      "@@UI/RACE_SWITCHER_CLOSE",
      "@@UI/STATS_PLAYERS_SEASON_STATS_PLAYER_CLICK",
    ])("for standard navigation events", (eventName) => {
      it(`should subscribe to ${eventName} event`, () => {
        register();

        const callback = subscribeEvent.mock.calls.find((call) => call[0] === eventName)[1];
        callback({ viewLink: { viewUrn: "test", viewUrl: "test" } });

        expect(subscribeEvent).toHaveBeenCalledWith(eventName, expect.any(Function));
        expect(getStore().dispatch).toHaveBeenCalledWith({
          type: "Router/push",
          payload: { viewUrn: "test", viewUrl: "test" },
        });
      });
    });

    describe.each(["@@UI/BREADCRUMBS_CARD_BREADCRUMB_TAP_NAV"])(
      "for breadcrumbs card navigation events",
      (eventName) => {
        it(`should subscribe to ${eventName} event`, () => {
          register();

          const callback = subscribeEvent.mock.calls.find((call) => call[0] === eventName)[1];
          callback({ viewLink: { viewUrn: "test", viewUrl: "test" } });

          expect(subscribeEvent).toHaveBeenCalledWith(eventName, expect.any(Function));
          expect(getStore().dispatch).toHaveBeenCalledWith({
            type: "Router/push",
            payload: { viewUrn: "test", viewUrl: "test" },
          });
        });
      },
    );

    describe.each([
      "@@UI/LOYALTY_PROMO_CARD_TAP_NAV",
      "@@UI/LOYALTY_PROMO_CARD_CTA_TAP_NAV",
      "@@UI/EDITORIAL_PROMO_CARD_PROMO_TAP_NAV",
      "@@UI/BET_OPPORTUNITY_PROMO_CARD_PROMO_TAP_NAV",
      "@@UI/EDITORIAL_PROMO_CARD_TERMS_AND_CONDITIONS_TAP_NAV",
      "@@UI/BET_OPPORTUNITY_PROMO_CARD_TERMS_AND_CONDITIONS_TAP_NAV",
      "@@UI/SELECTION_PROMO_CARD_PROMO_TAP_NAV",
      "@@UI/SELF_EXCLUSION_CARD_SAFER_GAMBLING_TAP",
      "@@UI/SELF_EXCLUSION_CARD_CONTACT_TAP",
    ])("for standard navigation events", (eventName) => {
      it(`should subscribe to ${eventName} event`, () => {
        register();

        const callback = subscribeEvent.mock.calls.find((call) => call[0] === eventName)[1];

        callback({ viewLink: { viewUrn: "test", viewUrl: "test" } });

        expect(promotionOnTapProcessor).toHaveBeenCalledWith({ viewLink: { viewUrn: "test", viewUrl: "test" } });
      });
    });

    describe.each([
      "@@UI/PRIZE_MACHINE_PLAY_BTN_CLICK_NAV",
      "@@UI/PRIZE_MACHINE_TCs_LINK_CLICK_NAV",
      "@@UI/PRIZE_MACHINE_POST_PLAY_CLICK_NAV",
    ])("for gaming prize machine navigation events", (eventName) => {
      it(`should subscribe to ${eventName} and call gamingPrizeMachineOnTapProcessor`, () => {
        register();

        const callback = subscribeEvent.mock.calls.find((call) => call[0] === eventName)[1];

        const payload = { urn: "test-urn", viewLink: { viewUrn: "test", viewUrl: "test", viewDisplayMode: null } };
        callback(payload);

        expect(subscribeEvent).toHaveBeenCalledWith(eventName, expect.any(Function));
        expect(gamingPrizeMachineOnTapProcessor).toHaveBeenCalledWith(payload);
      });
    });

    describe.each(["@@UI/QUICKLINKS_GRID_ITEM_CARD_TAP"])("for quicklinks grid navigation events", (eventName) => {
      it(`should subscribe to ${eventName} and call quicklinksGridItemOnTapProcessor`, () => {
        register();

        const callback = subscribeEvent.mock.calls.find((call) => call[0] === eventName)[1];

        const payload = { urn: "test-urn", viewLink: { viewUrn: "test", viewUrl: "test", viewDisplayMode: null } };
        callback(payload);

        expect(subscribeEvent).toHaveBeenCalledWith(eventName, expect.any(Function));
        expect(quicklinksGridItemOnTapProcessor).toHaveBeenCalledWith(payload);
      });
    });

    describe("for race meeting view race selected event", () => {
      it("should subscribe to @@UI/RACE_MEETING_VIEW_RACE_SELECTED and dispatch TAB_ROUTE_UPDATE with viewLink", () => {
        register();

        const callback = subscribeEvent.mock.calls.find(
          (call) => call[0] === "@@UI/RACE_MEETING_VIEW_RACE_SELECTED",
        )[1];

        const viewLink = { viewUrn: "ppb:tbd:view:race:123", viewUrl: "/horse-racing/race-123" };
        callback({ urn: "ppb:tbd:view:raceMeetingView:456", viewLink });

        expect(subscribeEvent).toHaveBeenCalledWith("@@UI/RACE_MEETING_VIEW_RACE_SELECTED", expect.any(Function));
        expect(getStore().dispatch).toHaveBeenCalledWith({
          type: "Router/tabRouteUpdate",
          payload: { viewLink },
        });
      });
    });

    describe("for promotions hub navigation events", () => {
      beforeEach(() => {
        window.__TBD_ENVIRONMENT__ = {
          ENDPOINTS: {
            PROMOS: "https://promos.skybet.com.nxt.ppbdev.com",
          },
        };
      });

      it("should rewrite URL using PROMOS endpoint for @@UI/PROMOTIONS_HUB_CARD_TAP", () => {
        register();

        const callback = subscribeEvent.mock.calls.find((call) => call[0] === "@@UI/PROMOTIONS_HUB_CARD_TAP")[1];
        callback({
          promoCode: "DEMO1RANK",
          action: {
            viewUrn: "ppb:tbd:view:external:external",
            viewUrl: "https://old.url",
            viewDisplayMode: null,
          },
        });

        expect(getStore().dispatch).toHaveBeenCalledWith({
          type: "ROUTER/EXTERNAL_PUSH_BLANK",
          payload: {
            viewUrn: "ppb:tbd:view:external:external",
            viewUrl: "https://promos.skybet.com.nxt.ppbdev.com/promotion?promoCode=DEMO1RANK",
            viewDisplayMode: null,
          },
        });
      });

      it("should fallback to original action for @@UI/PROMOTIONS_HUB_CARD_TAP when endpoint is missing", () => {
        window.__TBD_ENVIRONMENT__ = { ENDPOINTS: {} };
        register();

        const callback = subscribeEvent.mock.calls.find((call) => call[0] === "@@UI/PROMOTIONS_HUB_CARD_TAP")[1];
        const action = {
          viewUrn: "ppb:tbd:view:external:external",
          viewUrl: "https://old.url",
          viewDisplayMode: null,
        };
        callback({ promoCode: "DEMO1RANK", action });

        expect(getStore().dispatch).toHaveBeenCalledWith({
          type: "ROUTER/EXTERNAL_PUSH_BLANK",
          payload: action,
        });
      });

      it("should dispatch generic push for @@UI/PROMOTIONS_HUB_CARD_CTA_TAP", () => {
        register();

        const callback = subscribeEvent.mock.calls.find((call) => call[0] === "@@UI/PROMOTIONS_HUB_CARD_CTA_TAP")[1];
        const action = {
          viewUrn: "ppb:tbd:view:external:external",
          viewUrl: "https://cta.url",
          viewDisplayMode: null,
        };
        callback({ action });

        expect(getStore().dispatch).toHaveBeenCalledWith({
          type: "ROUTER/GENERIC_PUSH",
          payload: action,
        });
      });

      it("should dispatch home push for @@UI/PROMOTIONS_HUB_CARD_GROUP_BACK_TO_HOMEPAGE_TAP", () => {
        register();

        const callback = subscribeEvent.mock.calls.find(
          (call) => call[0] === "@@UI/PROMOTIONS_HUB_CARD_GROUP_BACK_TO_HOMEPAGE_TAP",
        )[1];
        callback();

        expect(getStore().dispatch).toHaveBeenCalledWith({
          type: "Router/push",
          payload: {
            viewUrn: "ppb:tbd:view:generic:home",
            viewUrl: "",
          },
        });
      });
    });
  });
});
