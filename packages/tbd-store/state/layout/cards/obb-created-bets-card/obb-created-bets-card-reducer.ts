import { FETCH_CATALOGUE_SUCCESS, FetchCatalogueSuccessAction } from "../../../../actions/catalogue";

import { buildObbCreatedBetsCard } from "./helpers/obb-created-bets-card-builder";
import { ObbCreatedBetsCards } from "./ObbCreatedBetsCard.types";

type ActionTypes = FetchCatalogueSuccessAction;

export default (currentState: undefined | ObbCreatedBetsCards, action: ActionTypes): ObbCreatedBetsCards => {
  const state = currentState || {};

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const obbCreatedBetsCards = action.payload.data.ObbCreatedBetsCard;
      if (!obbCreatedBetsCards) {
        return state;
      }

      return obbCreatedBetsCards.reduce(
        (acc, obbCreatedBetsCard): ObbCreatedBetsCards => {
          acc[obbCreatedBetsCard.urn] = buildObbCreatedBetsCard(obbCreatedBetsCard);
          return acc;
        },
        { ...state },
      );
    }

    default:
      return state;
  }
};
