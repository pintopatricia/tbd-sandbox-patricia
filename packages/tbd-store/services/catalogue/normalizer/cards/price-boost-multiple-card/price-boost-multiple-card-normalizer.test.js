import priceBoostMultiCardNormalizer from "./price-boost-multiple-card-normalizer";

const BFF_RESPONSE = {
  urn: "ppb:tbd:card:popularbetbuilder:1",
  __typename: "PriceBoostMultiCard",
  popularbettingopportunity: { __typename: "BettingOpportunity", urn: "ppb:bo:12345" },
  showWasPrice: true,
  pbmTitle: {
    __typename: "DisplayNameTitle",
    name: "Price Boost Multis",
  },
};

describe("PriceBoostMultiCard normalizer", () => {
  describe("normalizePriceBoostMultiCardFragmentIntoPriceBoostMultiCard", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = priceBoostMultiCardNormalizer(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "PriceBoostMultiCard",
        urn: "ppb:tbd:card:popularbetbuilder:1",
        showWasPrice: true,
        title: "Price Boost Multis",
        popularbettingopportunity: "ppb:bo:12345",
      });
    });
  });
});
