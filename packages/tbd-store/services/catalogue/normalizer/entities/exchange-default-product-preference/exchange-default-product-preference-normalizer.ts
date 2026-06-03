import { ExchangeDefaultProductPreference } from "../../../../../state/entities";
import { ExchangeDefaultProductPreferenceFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeExchangeDefaultProductPreferenceFragmentIntoExchangeDefaultProductPreference = (
  exchangeDefaultProductPreference: ExchangeDefaultProductPreferenceFragment,
): TransformedFragment<ExchangeDefaultProductPreference> => {
  const { __typename, urn, selectedExchangeDefaultProduct, exchangeDefaultProductOptions } =
    exchangeDefaultProductPreference;

  return {
    data: {
      urn,
      exchangeDefaultProductOptions,
      selectedExchangeDefaultProduct,
      typename: __typename,
    },
  };
};

export default normalizeExchangeDefaultProductPreferenceFragmentIntoExchangeDefaultProductPreference;
