import { BalanceCards } from "../Card.types";
import { FetchCatalogueSuccessAction, FETCH_CATALOGUE_SUCCESS } from "../../../../actions/catalogue";

/** **********************
 *  Balance reducer  *
 *********************** */

type ActionTypes = FetchCatalogueSuccessAction;

export default (currentState: undefined | BalanceCards, action: ActionTypes): BalanceCards => {
  const state = currentState || {};

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const cards = action.payload.data.BalanceCard;

      if (!cards) {
        return state;
      }

      return cards.reduce<BalanceCards>(
        (acc, balance) => ({
          ...acc,
          [balance.urn]: {
            ...state[balance.urn],
            ...balance,
          },
        }),
        { ...state },
      );
    }
    default:
      return state;
  }
};
