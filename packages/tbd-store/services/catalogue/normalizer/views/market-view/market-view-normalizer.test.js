import normalizeMarketViewFragmentIntoMarketView from "./market-view-normalizer";

const BFF_RESPONSE = {
  __typename: "MarketView",
  urn: "ppb:tbd:view:market:1",
  url: "soccer/r-1",
  mainMarket: {
    __typename: "ExchangeMarket",
    urn: "ppb:excMarket:123",
  },
  canonicalUrl: "exchange/plus/football/market/1",
  items: {
    edges: [
      {
        node: {
          __typename: "FixtureCard",
          urn: "ppb:tbd:card:fixture:123",
        },
        theme: "THEME",
      },
      {
        node: {
          __typename: "MarketExtendedCard",
          urn: "ppb:tbd:card:marketExtended:123",
        },
        theme: "THEME",
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

describe("Market view normalizer", () => {
  describe("normalizeMarketViewFragmentIntoMarketView", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeMarketViewFragmentIntoMarketView(BFF_RESPONSE);

      expect(data).toEqual({
        items: [
          {
            typename: "FixtureCard",
            urn: "ppb:tbd:card:fixture:123",
            theme: "THEME",
          },
          {
            typename: "MarketExtendedCard",
            urn: "ppb:tbd:card:marketExtended:123",
            theme: "THEME",
          },
        ],
        typename: "MarketView",
        url: "soccer/r-1",
        urn: "ppb:tbd:view:market:1",
        mainMarket: "ppb:excMarket:123",
        canonicalUrl: "exchange/plus/football/market/1",
      });
    });
  });
});
