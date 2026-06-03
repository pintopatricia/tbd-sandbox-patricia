import { UserProductsPreference } from "../../../../../state/entities";
import { UserProductsPreferenceFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeUserProductsPreferenceFragmentIntoUserProductsPreference = (
  userProductsPreference: UserProductsPreferenceFragment,
): TransformedFragment<UserProductsPreference> => {
  const { __typename, urn, productOptions, selectedProduct } = userProductsPreference;

  return {
    data: {
      urn,
      productOptions,
      selectedProduct,
      typename: __typename,
    },
  };
};

export default normalizeUserProductsPreferenceFragmentIntoUserProductsPreference;
