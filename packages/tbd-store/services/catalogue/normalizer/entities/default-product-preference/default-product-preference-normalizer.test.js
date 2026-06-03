import normalizeDefaultProductPreferenceFragmentIntoDefaultProductPreference from "./default-product-preference-normalizer";

const BFF_RESPONSE = {
  __typename: "DefaultProductPreference",
  urn: "ppb:tbd:preference:defaultProduct",
  defaultProductOptions: ["EXCHANGE", "LAST_VIEWED", "SPORTSBOOK"],
  selectedDefaultProduct: "SPORTSBOOK",
};

describe("default product preference normalizer", () => {
  describe("normalizeDefaultProductPreferenceFragmentIntoDefaultProductPreference", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeDefaultProductPreferenceFragmentIntoDefaultProductPreference(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "DefaultProductPreference",
        urn: "ppb:tbd:preference:defaultProduct",
        defaultProductOptions: ["exchange", "last_viewed", "sportsbook"],
        selectedDefaultProduct: "sportsbook",
      });
    });
  });
});
