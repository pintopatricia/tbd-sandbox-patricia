import normalizeMarketViewLinkCardFragmentIntoMarketViewLinkCard from "./market-view-link-normalizer";

const BFF_RESPONSE = {
  __typename: "MarketViewLinkCard",
  urn: "ppb:tbd:card:marketViewLink:924.238454488",
  viewLink: {
    viewUrn: "ppb:tbd:view:market:924.238454488",
    viewUrl: "football/uefa-europa-league/uefa-europa-league/winner-20202021/mwe-924.238454488",
  },
  market: {
    __typename: "SportsbookMarket",
    name: "Winner 2020/2021",
    urn: "ppb:sbkMarket:924.238454488",
  },
  badge: "CUP",
};

describe("MarketViewLink normalizer", () => {
  describe("normalizeMarketViewLinkCardFragmentIntoMarketViewLinkCard", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeMarketViewLinkCardFragmentIntoMarketViewLinkCard(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "MarketViewLinkCard",
        urn: "ppb:tbd:card:marketViewLink:924.238454488",
        viewLink: {
          viewUrn: "ppb:tbd:view:market:924.238454488",
          viewUrl: "football/uefa-europa-league/uefa-europa-league/winner-20202021/mwe-924.238454488",
        },
        marketName: "Winner 2020/2021",
        badge: "CUP",
      });
    });
  });
});
