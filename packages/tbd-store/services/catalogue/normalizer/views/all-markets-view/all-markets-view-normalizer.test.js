import normalizeAllMarketsViewFragmentIntoAllMarketsView from "./all-markets-view-normalizer";

const BFF_RESPONSE = {
  __typename: "AllMarketsView",
  urn: "ppb:tbd:view:allMarkets:1",
  url: "soccer/allMarkets:1",
  items: {
    edges: [
      {
        node: {
          __typename: "MarketViewLinkCard",
          urn: "ppb:tbd:card:marketViewLink:456",
        },
      },
      {
        node: {
          __typename: "MarketViewLinkCard",
          urn: "ppb:tbd:card:marketViewLink:123",
        },
      },
    ],
  },
  partialItems: {
    edges: [
      {
        node: {
          __typename: "MarketViewLinkCard",
          urn: "ppb:tbd:card:marketViewLink:456",
        },
      },
      {
        node: {
          __typename: "MarketViewLinkCard",
          urn: "ppb:tbd:card:marketViewLink:123",
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

describe("All markets view normalizer", () => {
  describe("normalizeAllMarketsViewFragmentIntoAllMarketsView", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeAllMarketsViewFragmentIntoAllMarketsView(BFF_RESPONSE);

      expect(data).toEqual({
        items: [
          {
            typename: "MarketViewLinkCard",
            urn: "ppb:tbd:card:marketViewLink:456",
          },
          {
            typename: "MarketViewLinkCard",
            urn: "ppb:tbd:card:marketViewLink:123",
          },
        ],
        typename: "AllMarketsView",
        url: "soccer/allMarkets:1",
        urn: "ppb:tbd:view:allMarkets:1",
      });
    });
  });
});
