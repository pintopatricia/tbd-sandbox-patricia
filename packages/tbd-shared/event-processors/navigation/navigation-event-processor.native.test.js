import { navigate } from "@ppb/tbd-router/native/router";
import { getEndpoint } from "../../config/endpoints";
import subscribeEvent from "../../event-broker/event-subscriber";
import { promotionOnTapProcessor } from "./resolvers/promotion-resolver.native";
import { gamingPrizeMachineNavigateProcessor } from "./resolvers/gaming-prize-machine-resolver.native";
import { quicklinksGridItemOnTapProcessor } from "./resolvers/quicklinks-grid-resolver.native";
import register from "./navigation-event-processor.native";

jest.mock("@ppb/tbd-router/native/router", () => ({
  navigate: jest.fn(),
  NativeEntityTypes: {
    Home: "ppb:tbd:view:generic:home",
  },
}));

jest.mock("../../event-broker/event-subscriber", () => jest.fn());

jest.mock("./resolvers/promotion-resolver.native", () => ({
  promotionOnTapProcessor: jest.fn(),
}));

jest.mock("./resolvers/gaming-prize-machine-resolver.native", () => ({
  gamingPrizeMachinePlayProcessor: jest.fn(),
  gamingPrizeMachineNavigateProcessor: jest.fn(),
}));

jest.mock("./resolvers/quicklinks-grid-resolver.native", () => ({
  quicklinksGridItemOnTapProcessor: jest.fn(),
}));

jest.mock("../../config/endpoints", () => ({
  getEndpoint: jest.fn(),
}));

describe("navigation-event-processor.native", () => {
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
        callback({ viewLink: { viewUrn: "test", viewUrl: "test", viewDisplayMode: null } });

        expect(subscribeEvent).toHaveBeenCalledWith(eventName, expect.any(Function));
        expect(navigate).toHaveBeenCalledWith({ viewDisplayMode: null, viewUrn: "test", viewUrl: "test" });
      });
    });

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

        callback({ viewLink: { viewUrn: "test", viewUrl: "test", viewDisplayMode: null } });

        expect(promotionOnTapProcessor).toHaveBeenCalledWith({
          viewLink: { viewDisplayMode: null, viewUrn: "test", viewUrl: "test" },
        });
      });
    });

    describe.each([
      "@@UI/PRIZE_MACHINE_TCs_LINK_CLICK_NAV",
      "@@UI/PRIZE_MACHINE_POST_PLAY_CLICK_NAV",
      "@@UI/PRIZE_MACHINE_PLAY_BTN_CLICK_NAV",
    ])("for gaming prize machine direct navigation events", (eventName) => {
      it(`should subscribe to ${eventName} and call gamingPrizeMachineNavigateProcessor`, () => {
        register();

        const callback = subscribeEvent.mock.calls.find((call) => call[0] === eventName)[1];

        const payload = { urn: "test-urn", viewLink: { viewUrn: "test", viewUrl: "test", viewDisplayMode: null } };
        callback(payload);

        expect(subscribeEvent).toHaveBeenCalledWith(eventName, expect.any(Function));
        expect(gamingPrizeMachineNavigateProcessor).toHaveBeenCalledWith(payload);
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

    describe("for promotions hub navigation events", () => {
      it("should build promo URL from PROMOS endpoint for @@UI/PROMOTIONS_HUB_CARD_TAP", () => {
        getEndpoint.mockReturnValue("https://promos.skybet.com.nxt.ppbdev.com");
        register();

        const callback = subscribeEvent.mock.calls.find((call) => call[0] === "@@UI/PROMOTIONS_HUB_CARD_TAP")[1];

        callback({
          promoCode: "DEMO1RANK",
          action: {
            viewUrn: "ppb:tbd:view:external:external",
            viewUrl: "https://old.url",
            viewDisplayMode: "BLANK_WEBVIEW",
          },
        });

        expect(navigate).toHaveBeenCalledWith({
          viewUrn: "ppb:tbd:view:external:external",
          viewUrl: "https://promos.skybet.com.nxt.ppbdev.com/promotion?promoCode=DEMO1RANK",
          viewDisplayMode: "BLANK_WEBVIEW",
        });
      });

      it("should fallback to original action for @@UI/PROMOTIONS_HUB_CARD_TAP when endpoint lookup fails", () => {
        getEndpoint.mockImplementation(() => {
          throw new Error("missing endpoint");
        });
        register();

        const callback = subscribeEvent.mock.calls.find((call) => call[0] === "@@UI/PROMOTIONS_HUB_CARD_TAP")[1];
        const action = {
          viewUrn: "ppb:tbd:view:external:external",
          viewUrl: "https://old.url",
          viewDisplayMode: "BLANK_WEBVIEW",
        };

        callback({ promoCode: "DEMO1RANK", action });

        expect(navigate).toHaveBeenCalledWith(action);
      });

      it("should navigate with payload action for @@UI/PROMOTIONS_HUB_CARD_CTA_TAP", () => {
        register();

        const callback = subscribeEvent.mock.calls.find((call) => call[0] === "@@UI/PROMOTIONS_HUB_CARD_CTA_TAP")[1];
        const action = {
          viewUrn: "ppb:tbd:view:external:external",
          viewUrl: "https://cta.url",
          viewDisplayMode: "BLANK_WEBVIEW",
        };

        callback({ action });

        expect(navigate).toHaveBeenCalledWith(action);
      });

      it("should navigate to home for @@UI/PROMOTIONS_HUB_CARD_GROUP_BACK_TO_HOMEPAGE_TAP", () => {
        register();

        const callback = subscribeEvent.mock.calls.find(
          (call) => call[0] === "@@UI/PROMOTIONS_HUB_CARD_GROUP_BACK_TO_HOMEPAGE_TAP",
        )[1];
        callback();

        expect(navigate).toHaveBeenCalledWith({ viewUrn: "ppb:tbd:view:generic:home" });
      });
    });
  });
});
