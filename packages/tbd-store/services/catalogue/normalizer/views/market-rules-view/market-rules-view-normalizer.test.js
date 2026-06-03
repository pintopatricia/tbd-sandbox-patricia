import normalizeMarketRulesViewFragmentIntoMarketRulesView from "./market-rules-view-normalizer";

const BFF_RESPONSE = {
  __typename: "MarketRulesView",
  title: "TITLE",
  urn: "ppb:tbd:view:marketRules:1.234",
  url: "",
  items: {
    edges: [
      {
        node: {
          __typename: "MarketRulesCard",
          urn: "ppb:tbd:card:marketRules:1.234",
          otherData: "otherData",
        },
      },
    ],
  },
};

describe("MarketRulesView normalizer", () => {
  describe("normalizeMarketRulesViewFragmentIntoMarketRulesView", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeMarketRulesViewFragmentIntoMarketRulesView(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "MarketRulesView",
        title: "TITLE",
        urn: "ppb:tbd:view:marketRules:1.234",
        url: "",
        items: [
          {
            typename: "MarketRulesCard",
            urn: "ppb:tbd:card:marketRules:1.234",
          },
        ],
      });
    });
  });
});
