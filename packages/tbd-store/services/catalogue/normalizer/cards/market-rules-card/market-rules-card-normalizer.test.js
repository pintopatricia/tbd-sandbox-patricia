import victim from "./market-rules-card-normalizer";

const BFF_RESPONSE = {
  __typename: "MarketRulesCard",
  urn: "ppb:tbd:card:marketRules:1.195702271",
  rules: {
    marketName: "Match Odds",
    wallet: "UK wallet",
    clarifications: null,
    marketBaseRate: 5,
    discountAllowed: false,
    eventStartTime: "2022-03-16T20:15:00.000Z",
    marketBettingType: "WIN_ONLY_MARKET",
    numberOfWinners: 1,
    displayMode: "BLANK_INAPP",
    sections: [
      {
        name: "MARKET_INFORMATION",
        content: "CONTENT",
      },
    ],
    footer: "FOOTER",
  },
};

describe("MarketRulesCard normalizer", () => {
  describe("normalizeMarketRulesCardFragmentIntoMarketRulesCard", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = victim(BFF_RESPONSE);
      const { __typename, ...marketRulesData } = BFF_RESPONSE;

      expect(data).toEqual({
        typename: __typename,
        ...marketRulesData,
      });
    });
  });
});
