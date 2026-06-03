import { UserProducts } from "../../../../../clients/catalogue/catalogue-response-types";
import normalizeUserProductsPreferenceFragmentIntoUserProductsPreference from "./user-products-preference-normalizer";

const BFF_RESPONSE = {
  __typename: "UserProductsPreference",
  urn: "ppb:tbd:preference:userProducts:UserProducts",
  productOptions: [UserProducts.Sportsbook, UserProducts.Exchange, UserProducts.Games],
  selectedProduct: [UserProducts.Exchange, UserProducts.Games],
};

describe("UserProducts normalizer", () => {
  describe("normalizeUserProductsPreferenceFragmentIntoUserProductsPreference", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeUserProductsPreferenceFragmentIntoUserProductsPreference(BFF_RESPONSE);

      expect(data).toEqual({
        urn: "ppb:tbd:preference:userProducts:UserProducts",
        productOptions: [UserProducts.Sportsbook, UserProducts.Exchange, UserProducts.Games],
        selectedProduct: [UserProducts.Exchange, UserProducts.Games],
        typename: "UserProductsPreference",
      });
    });
  });
});
