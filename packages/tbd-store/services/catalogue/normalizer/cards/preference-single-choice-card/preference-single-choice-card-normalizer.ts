import { PreferenceSingleChoiceCard } from "../../../../../state/layout/cards/Card.types";
import {
  PreferenceLayout,
  PreferenceSingleChoiceCardFragment,
} from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizePreferenceSingleChoiceCardFragmentIntoPreferenceSingleChoiceCard = (
  preferenceSingleChoiceCard: PreferenceSingleChoiceCardFragment,
): TransformedFragment<PreferenceSingleChoiceCard> => {
  const { __typename, urn, title, description, preference, cardLayout } = preferenceSingleChoiceCard;

  return {
    data: {
      urn,
      title,
      description,
      typename: __typename,
      preferenceURN: preference.urn,
      layout: cardLayout || PreferenceLayout.Radio,
    },
  };
};

export default normalizePreferenceSingleChoiceCardFragmentIntoPreferenceSingleChoiceCard;
