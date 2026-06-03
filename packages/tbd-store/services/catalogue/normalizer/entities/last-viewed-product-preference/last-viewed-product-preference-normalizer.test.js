import normalizeLastViewedProductPreferenceFragmentIntoLastViewedProductPreference from "./last-viewed-product-preference-normalizer";

const BFF_RESPONSE = {
  __typename: "LastViewedProductPreference",
  urn: "ppb:tbd:preference:lastViewedProduct",
  lastViewedProductOptions: ["EXCHANGE", "SPORTSBOOK"],
  selectedLastViewedProduct: "SPORTSBOOK",
};

describe("last viewed product preference normalizer", () => {
  describe("normalizeLastViewedProductPreferenceFragmentIntoLastViewedProductPreference", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeLastViewedProductPreferenceFragmentIntoLastViewedProductPreference(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "LastViewedProductPreference",
        urn: "ppb:tbd:preference:lastViewedProduct",
        lastViewedProductOptions: ["exchange", "sportsbook"],
        selectedLastViewedProduct: "sportsbook",
      });
    });
  });
});
