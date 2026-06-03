import { PreferenceSingleChoice } from "../../../../../state/entities";
import { PreferenceSingleChoiceFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizePreferenceSingleChoiceFragmentIntoPreferenceSingleChoice = (
  preferenceSingleChoice: PreferenceSingleChoiceFragment,
): TransformedFragment<PreferenceSingleChoice> => {
  const { __typename, urn, preferenceKey, preferenceValues, selectedValueIndex } = preferenceSingleChoice;

  return {
    data: {
      urn,
      preferenceKey,
      preferenceValues,
      selectedValueIndex,
      typename: __typename,
    },
  };
};

export default normalizePreferenceSingleChoiceFragmentIntoPreferenceSingleChoice;
