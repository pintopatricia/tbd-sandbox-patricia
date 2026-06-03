import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { getBannerEventPayload } from "./banner-util";
import { getPromotionCardTrackingParams } from "../../Promotions.graphql";
import { MOCK_ACTION, MOCK_EVENT_PAYLOAD } from "../../promotions-resolver.test";

jest.mock("@ppb/tbd-shared/event-processors/tracking/processors/promotions/Promotions.graphql", () => ({
  getPromotionCardTrackingParams: jest.fn(() => ({
    title: "Promotion Title",
  })),
}));

describe("banner-util", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getBannerEventPayload", () => {
    it("should return the correct payload", () => {
      const bannerPayload = getBannerEventPayload(MOCK_ACTION, TaggingAction.CLICKED_BANNER);

      expect(getPromotionCardTrackingParams).toHaveBeenCalledWith("ppb:tbd:card:selectionPromo:cms/aPnonhIAACMA8SNy");

      expect(bannerPayload).toStrictEqual(MOCK_EVENT_PAYLOAD);
    });
  });
});
