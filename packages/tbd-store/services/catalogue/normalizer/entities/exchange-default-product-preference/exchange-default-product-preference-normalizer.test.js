import { ExchangeDefaultProduct } from "../../../../../clients/catalogue/catalogue-response-types";
import normalizeExchangeDefaultProductPreferenceFragmentIntoExchangeDefaultProductPreference from "./exchange-default-product-preference-normalizer";

const BFF_RESPONSE = {
  __typename: "ExchangeDefaultProductPreference",
  urn: "ppb:tbd:preference:exchangeDefaultProduct:ExchangeDefaultProduct",
  exchangeDefaultProductOptions: [
    ExchangeDefaultProduct.Ems,
    ExchangeDefaultProduct.Neme,
    ExchangeDefaultProduct.Unassigned,
  ],
  selectedExchangeDefaultProduct: ExchangeDefaultProduct.Neme,
};

describe("ExchangeDefaultProduct normalizer", () => {
  describe("normalizeExchangeDefaultProductPreferenceFragmentIntoExchangeDefaultProductPreference", () => {
    it("should correctly transform and return the data object", () => {
      const { data } =
        normalizeExchangeDefaultProductPreferenceFragmentIntoExchangeDefaultProductPreference(BFF_RESPONSE);

      expect(data).toEqual({
        urn: "ppb:tbd:preference:exchangeDefaultProduct:ExchangeDefaultProduct",
        exchangeDefaultProductOptions: [
          ExchangeDefaultProduct.Ems,
          ExchangeDefaultProduct.Neme,
          ExchangeDefaultProduct.Unassigned,
        ],
        selectedExchangeDefaultProduct: ExchangeDefaultProduct.Neme,
        typename: "ExchangeDefaultProductPreference",
      });
    });
  });
});
