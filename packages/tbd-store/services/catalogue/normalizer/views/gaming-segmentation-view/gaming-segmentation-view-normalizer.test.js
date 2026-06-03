import normalizeGamingSegmentationViewFragmentIntoGamingSegmentationView from "./gaming-segmentation-view-normalizer";

const BFF_RESPONSE = {
  __typename: "GamingSegmentationView",
  urn: "ppb:tbd:view:gamingSegmentation:1",
  url: "gaming/slots/gamingSegmentation:1",
  items: {
    edges: [
      {
        node: {
          __typename: "GameCard",
          urn: "ppb:tbd:card:game:1",
        },
      },
    ],
  },
  partialItems: {
    edges: [
      {
        node: {
          __typename: "GameCard",
          urn: "ppb:tbd:card:game:1",
        },
      },
    ],
  },
  bottomBar: {
    tiles: [],
  },
  regulatoryData: {
    sections: [],
  },
};

describe("Gaming segmentation view normalizer", () => {
  describe("normalizeGamingSegmentationViewFragmentIntoGamingSegmentationView", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeGamingSegmentationViewFragmentIntoGamingSegmentationView(BFF_RESPONSE);

      expect(data).toEqual({
        items: [
          {
            typename: "GameCard",
            urn: "ppb:tbd:card:game:1",
          },
        ],
        typename: "GamingSegmentationView",
        urn: "ppb:tbd:view:gamingSegmentation:1",
        url: "gaming/slots/gamingSegmentation:1",
      });
    });
  });
  describe("and edges has no valid nodes", () => {
    const { data } = normalizeGamingSegmentationViewFragmentIntoGamingSegmentationView({
      ...BFF_RESPONSE,
      items: { edges: [null, null] },
      partialItems: { edges: [null] },
    });

    it("should correctly transform and return the data object with an empty array of items", () => {
      expect(data).toEqual({
        items: [],
        typename: "GamingSegmentationView",
        url: "gaming/slots/gamingSegmentation:1",
        urn: "ppb:tbd:view:gamingSegmentation:1",
      });
    });
  });
});
