import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { buildInterfaceEvent, buildNavigationEvent, buildPromotionEvent } from "tagging-library";
import {
  promotionsHubCardTapResolver,
  promotionsHubCardCTATapResolver,
  promotionsHubCardOptInTapResolver,
  promotionsHubCardGroupLoadedResolver,
  promotionsHubCardGroupPebbleListDisplayedResolver,
  promotionsHubCardGroupPebbleListClickResolver,
} from "./promotions-hub-resolvers";

jest.mock("tagging-library", () => ({
  buildInterfaceEvent: jest.fn((payload) => ({ ...payload, type: "interface" })),
  buildNavigationEvent: jest.fn((payload) => ({ ...payload, type: "navigation" })),
  buildPromotionEvent: jest.fn((payload) => ({ ...payload, type: "promotion" })),
}));

const sendEvent = jest.fn();

describe("promotions-hub-resolvers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("promotionsHubCardTapResolver", () => {
    it("should build and send navigation event with card details", () => {
      const payload = {
        urn: "promo-123",
        title: "Summer Promo",
        promoCode: "SUMMER_2025",
        action: {
          viewUrl: "https://example.com/summer",
          viewUrn: "ppb:tbd:view:promo:summer",
        },
      };

      promotionsHubCardTapResolver(payload, sendEvent);

      expect(buildNavigationEvent).toHaveBeenCalledWith({
        action: TaggingAction.NAVIGATED_TO,
        destinationUrl: "https://example.com/summer",
        elementText: "Summer Promo",
        eventContext: "null",
        gameFilter: "null",
        gameId: "null",
        gameName: "null",
        gameProvider: "null",
        module: "promotions hub - all - SUMMER_2025",
        moduleDisplayOrder: "null",
        position: "null",
        swimlaneType: "null",
      });

      expect(sendEvent).toHaveBeenCalled();
    });

    it("should handle missing viewUrl and fallback to 'null'", () => {
      const payload = {
        urn: "promo-123",
        title: "Summer Promo",
        promoCode: "SUMMER_2025",
      };

      promotionsHubCardTapResolver(payload as any, sendEvent);

      expect(buildNavigationEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          destinationUrl: "null",
          elementText: "Summer Promo",
        }),
      );
    });
  });

  describe("promotionsHubCardCTATapResolver", () => {
    it("should build and send navigation event for CTA tap", () => {
      const payload = {
        urn: "promo-456",
        promoCode: "CTA_PROMO",
        action: {
          viewUrl: "https://example.com/cta",
        },
      };

      promotionsHubCardCTATapResolver(payload as any, sendEvent);

      expect(buildNavigationEvent).toHaveBeenCalledWith({
        action: TaggingAction.NAVIGATED_TO,
        destinationUrl: "https://example.com/cta",
        elementText: "opt in",
        eventContext: "null",
        gameFilter: "null",
        gameId: "null",
        gameName: "null",
        gameProvider: "null",
        module: "promotions hub - all - CTA_PROMO - promo cta",
        moduleDisplayOrder: "null",
        position: "null",
        swimlaneType: "null",
      });

      expect(sendEvent).toHaveBeenCalled();
    });

    it("should fallback to null destination URL when not provided", () => {
      const payload = {
        urn: "promo-456",
        promoCode: "CTA_PROMO",
      };

      promotionsHubCardCTATapResolver(payload as any, sendEvent);

      expect(buildNavigationEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          destinationUrl: "null",
          module: "promotions hub - all - CTA_PROMO - promo cta",
        }),
      );
    });
  });

  describe("promotionsHubCardOptInTapResolver", () => {
    it("should build and send promotion event for opt-in", () => {
      const payload = {
        _typename: "PromoCard",
        promotionUrn: "promo-urn-789",
        promoCode: "OPT_IN_PROMO",
        title: "Win Big Promo",
        subTitle: "Double your winnings",
        optInState: "ONGOING",
        status: "OPTED_OUT",
      };

      promotionsHubCardOptInTapResolver(payload as any, sendEvent);

      expect(buildPromotionEvent).toHaveBeenCalledWith({
        action: TaggingAction.ACCEPT_PROMOTION,
        elementText: "opt in",
        module: "promotions hub - all - OPT_IN_PROMO - promo cta",
        destinationUrl: "null",
        position: "null",
        promotionId: "OPT_IN_PROMO",
        promotionType: "null",
        promotionName: "Win Big Promo",
        promotionUserStatus: "OPTED_OUT",
        promotionState: "ONGOING",
        progressBar: "null",
        tierLevel: "null",
      });

      expect(sendEvent).toHaveBeenCalled();
    });

    it("should handle null status with fallback", () => {
      const payload = {
        _typename: "PromoCard",
        promotionUrn: "promo-urn-789",
        promoCode: "OPT_IN_PROMO",
        title: "Win Big Promo",
        subTitle: "Double your winnings",
        optInState: "ONGOING",
        status: null,
      };

      promotionsHubCardOptInTapResolver(payload as any, sendEvent);

      expect(buildPromotionEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          promotionUserStatus: "null",
        }),
      );
    });
  });

  describe("promotionsHubCardGroupLoadedResolver", () => {
    it("should build and send interface event for card group loaded", () => {
      const payload = {
        urn: "card-group-1",
      };

      promotionsHubCardGroupLoadedResolver(payload, sendEvent);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.DISPLAYED,
        elementText: "promotions hub",
        eventContext: "null",
        gameFilter: "null",
        module: "promotions hub",
        swimlaneType: "null",
      });

      expect(sendEvent).toHaveBeenCalled();
    });
  });

  describe("promotionsHubCardGroupPebbleListDisplayedResolver", () => {
    it("should build and send interface event with pebble filter details", () => {
      const payload = {
        urn: "pebbles-1",
        filters: [
          { filterName: "Featured", filterCount: 5 },
          { filterName: "New", filterCount: 3 },
          { filterName: "Expiring Soon", filterCount: 2 },
        ],
      };

      promotionsHubCardGroupPebbleListDisplayedResolver(payload, sendEvent);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.DISPLAYED,
        elementText: "pebble - Featured(5), New(3), Expiring Soon(2)",
        eventContext: "null",
        gameFilter: "null",
        module: "promotions hub",
        swimlaneType: "null",
      });

      expect(sendEvent).toHaveBeenCalled();
    });

    it("should handle single filter", () => {
      const payload = {
        urn: "pebbles-1",
        filters: [{ filterName: "All", filterCount: 10 }],
      };

      promotionsHubCardGroupPebbleListDisplayedResolver(payload, sendEvent);

      expect(buildInterfaceEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          elementText: "pebble - All(10)",
        }),
      );
    });

    it("should handle empty filters array", () => {
      const payload = {
        urn: "pebbles-1",
        filters: [],
      };

      promotionsHubCardGroupPebbleListDisplayedResolver(payload, sendEvent);

      expect(buildInterfaceEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          elementText: "pebble - ",
        }),
      );
    });
  });

  describe("promotionsHubCardGroupPebbleListClickResolver", () => {
    it("should build and send interface event for pebble click", () => {
      const payload = {
        urn: "pebble-click-1",
        pebbleUrn: "pebble-urn-123",
        filterName: "Featured Promotions",
      };

      promotionsHubCardGroupPebbleListClickResolver(payload, sendEvent);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "pebble - Featured Promotions",
        eventContext: "null",
        gameFilter: "null",
        module: "promotions hub",
        swimlaneType: "null",
      });

      expect(sendEvent).toHaveBeenCalled();
    });

    it("should lowercase filter name in module text", () => {
      const payload = {
        urn: "pebble-click-1",
        pebbleUrn: "pebble-urn-123",
        filterName: "EXPIRING_SOON",
      };

      promotionsHubCardGroupPebbleListClickResolver(payload, sendEvent);

      expect(buildInterfaceEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          elementText: "pebble - EXPIRING_SOON",
        }),
      );
    });
  });
});
