import { PreferenceSingleChoiceCards } from "../Card.types";
import { FetchCatalogueSuccessAction, FETCH_CATALOGUE_SUCCESS } from "../../../../actions/catalogue";

export default (
  currentState: undefined | PreferenceSingleChoiceCards,
  action: FetchCatalogueSuccessAction,
): PreferenceSingleChoiceCards => {
  const state = currentState || {};

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const cards = action.payload.data.PreferenceSingleChoiceCard || [];

      return cards.reduce<PreferenceSingleChoiceCards>(
        (acc, preferencesinglechoice) => ({
          ...acc,
          [preferencesinglechoice.urn]: {
            ...preferencesinglechoice,
          },
        }),
        { ...state },
      );
    }
    default:
      return state;
  }
};
