import { getCriticalChunksAssets } from "./preload-critical-chunks";

describe("PreloadCriticalChunks", () => {
  beforeEach(jest.clearAllMocks);

  describe("getCriticalChunksAssets", () => {
    describe("when has not got View", () => {
      it("should return empty objects and array", () => {
        expect(getCriticalChunksAssets({})).toEqual({
          criticalChunksJs: [],
          criticalChunksCss: [],
          criticalImages: [],
        });
      });
    });

    describe("when there is a card with backgroundImage", () => {
      it("should extract the critical images", () => {
        const mock = {
          PromotionCard: [
            { backgroundImage: [{ url: "PromotionCard.png" }, { url: "PromotionCard2.png" }] },
            { backgroundImage: [{ url: "PromotionCard3.png" }] },
          ],
        };

        expect(getCriticalChunksAssets(mock).criticalImages).toEqual([
          "PromotionCard.png",
          "PromotionCard2.png",
          "PromotionCard3.png",
        ]);
      });
    });

    describe("when there is a card with image", () => {
      it("should extract the critical image", () => {
        const mock = {
          EditorialPromoCard: [
            { image: { url: "EditorialPromoCard.png" } },
            { image: { url: "EditorialPromoCard3.png" } },
          ],
        };

        expect(getCriticalChunksAssets(mock).criticalImages).toEqual([
          "EditorialPromoCard.png",
          "EditorialPromoCard3.png",
        ]);
      });
    });

    describe("when there is a card with promoImage", () => {
      it("should extract the critical promoImage", () => {
        const mock = {
          LoyaltyPromotion: [
            { promoImage: { url: "LoyaltyPromotion.png" } },
            { promoImage: { url: "LoyaltyPromotion3.png" } },
          ],
        };

        expect(getCriticalChunksAssets(mock).criticalImages).toEqual(["LoyaltyPromotion.png", "LoyaltyPromotion3.png"]);
      });
    });

    describe("when there is a card with selections", () => {
      it("should extract the critical image", () => {
        const mock = {
          PopularBettingOportuntity: [
            { selections: [{ silkUrl: "SilkUrl.png" }, { silkUrl: "SilkUrl2.png" }] },
            { selections: [{ silkUrl: "SilkUrl3.png" }] },
          ],
        };

        expect(getCriticalChunksAssets(mock).criticalImages).toEqual(["SilkUrl.png", "SilkUrl2.png", "SilkUrl3.png"]);
      });
    });

    describe("when has a View", () => {
      it("should return chunks for normalized cards only", () => {
        const mock = {
          EventView: [
            {
              urn: "ppb:tbd:view:event:123",
              typename: "EventView",
              items: [
                { urn: "ppb:tbd:card:promotion:123", typename: "PromotionCard" },
                { urn: "ppb:tbd:card:fixture:123", typename: "FixtureCard" },
              ],
            },
          ],
          CardGroup: [{ urn: "ppb:tbd:cardgroup:123", typename: "CardGroup" }],
          MarketCard: [{ urn: "ppb:tbd:card:market:123", typename: "MarketCard" }],
        };

        expect(getCriticalChunksAssets(mock)).toEqual({
          criticalChunksJs: ["EventView.js", "CardGroup.js", "MarketCard.js"],
          criticalChunksCss: ["EventView.css", "CardGroup.css", "MarketCard.css"],
          criticalImages: [],
        });
      });
    });
  });
});
