import { TransformedFragment } from "../../Normalizer.types";
import { ConfirmCashoutPreferenceFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { ConfirmCashoutPreferenceData } from "../../../../../state";

const normalizeConfirmCashoutPreferenceFragmentIntoConfirmCashoutPreference = ({
  __typename,
  urn,
  shouldConfirmCashout,
}: ConfirmCashoutPreferenceFragment): TransformedFragment<ConfirmCashoutPreferenceData> => ({
  data: {
    typename: __typename,
    urn,
    shouldConfirmCashout,
  },
});

export default normalizeConfirmCashoutPreferenceFragmentIntoConfirmCashoutPreference;
