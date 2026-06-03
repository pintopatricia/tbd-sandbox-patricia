import { LastViewedProductOption, LastViewedProductPreference } from "../../../../../state/entities";
import {
  LastViewedProduct,
  LastViewedProductPreferenceFragment,
} from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const lastViewedProductToLastViewedProductOptionMap: Record<LastViewedProduct, LastViewedProductOption> = {
  [LastViewedProduct.Sportsbook]: LastViewedProductOption.sportsbook,
  [LastViewedProduct.Exchange]: LastViewedProductOption.exchange,
};

const normalizeLastViewedProductPreferenceFragmentIntoLastViewedProductPreference = (
  lastViewedProductPreference: LastViewedProductPreferenceFragment,
): TransformedFragment<LastViewedProductPreference> => {
  const { __typename, urn, selectedLastViewedProduct, lastViewedProductOptions } = lastViewedProductPreference;

  return {
    data: {
      typename: __typename,
      urn,
      lastViewedProductOptions: lastViewedProductOptions.map(
        (lastViewedProduct) => lastViewedProductToLastViewedProductOptionMap[lastViewedProduct],
      ),
      selectedLastViewedProduct: lastViewedProductToLastViewedProductOptionMap[selectedLastViewedProduct],
    },
  };
};

export default normalizeLastViewedProductPreferenceFragmentIntoLastViewedProductPreference;
