import { getLoyaltyPromotionOptInTapEvent, getLoyaltyPromotionCTATapEvent } from "./promotions";

jest.mock("../../state/layout/views/event-view/event-view-selectors");
jest.mock("../../state/layout/layout-selectors");

describe("Promotions GTM resolvers", () => {
  describe("getLoyaltyPromotionOptInTapEvent", () => {
    it("should return the correct event payload for typename LoyaltyPromoCard", () => {
      expect(
        getLoyaltyPromotionOptInTapEvent(
          "home",
          "CHECKMATE1",
          "Checkmate Title",
          "Checkmate Description",
          "LoyaltyPromoCard",
        ),
      ).toEqual({
        event: "ga_event",
        category: "promotions",
        action: "clicked to opt in",
        label: "Checkmate Description",
        cd3: "home - banner",
        cd81: "CHECKMATE1",
        cd87: "Checkmate Title",
      });
    });

    it("should return the correct event payload for typename MiniPromoBannerCard", () => {
      expect(
        getLoyaltyPromotionOptInTapEvent(
          "home",
          "CHECKMATE1",
          "Checkmate Title",
          "Checkmate Description",
          "MiniPromoBannerCard",
        ),
      ).toEqual({
        event: "ga_event",
        category: "promotions",
        action: "clicked to opt in",
        label: "Checkmate Description",
        cd3: "home - mini banner",
        cd81: "CHECKMATE1",
        cd87: "Checkmate Title",
      });
    });
  });

  describe("getLoyaltyPromotionCTATapEvent", () => {
    it("should return the correct event payload for typename LoyaltyPromoCard", () => {
      expect(
        getLoyaltyPromotionCTATapEvent(
          "home",
          "Checkmate Title",
          "Opted In",
          "http://checkmate.url",
          "LoyaltyPromoCard",
        ),
      ).toEqual({
        event: "ga_event",
        category: "promotions",
        action: "clicked banner - opted in - bet here",
        label: "Checkmate Title",
        cd3: "home - banner",
        cd34: "http://checkmate.url",
      });
    });

    it("should return the correct event payload for typename MiniPromoBannerCard", () => {
      expect(
        getLoyaltyPromotionCTATapEvent(
          "home",
          "Checkmate Title",
          "Opted In",
          "http://checkmate.url",
          "MiniPromoBannerCard",
        ),
      ).toEqual({
        event: "ga_event",
        category: "promotions",
        action: "clicked banner - opted in - arrow",
        label: "Checkmate Title",
        cd3: "home - mini banner",
        cd34: "http://checkmate.url",
      });
    });
  });
});
