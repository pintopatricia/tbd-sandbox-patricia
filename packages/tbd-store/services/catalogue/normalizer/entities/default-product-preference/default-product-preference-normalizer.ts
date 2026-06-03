import { DefaultProductOption, DefaultProductPreference } from "../../../../../state/entities";
import {
  DefaultProduct,
  DefaultProductPreferenceFragment,
} from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const defaultProductToDefaultProductOptionMap: Record<DefaultProduct, DefaultProductOption> = {
  [DefaultProduct.LastViewed]: DefaultProductOption.lastViewed,
  [DefaultProduct.Sportsbook]: DefaultProductOption.sportsbook,
  [DefaultProduct.Exchange]: DefaultProductOption.exchange,
};

const normalizeDefaultProductPreferenceFragmentIntoDefaultProductPreference = (
  defaultProductPreference: DefaultProductPreferenceFragment,
): TransformedFragment<DefaultProductPreference> => {
  const { __typename, urn, selectedDefaultProduct, defaultProductOptions } = defaultProductPreference;

  return {
    data: {
      typename: __typename,
      urn,
      defaultProductOptions: defaultProductOptions.map(
        (defaultProduct) => defaultProductToDefaultProductOptionMap[defaultProduct],
      ),
      selectedDefaultProduct: defaultProductToDefaultProductOptionMap[selectedDefaultProduct],
    },
  };
};

export default normalizeDefaultProductPreferenceFragmentIntoDefaultProductPreference;
