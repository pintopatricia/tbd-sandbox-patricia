import { SportsbookBetCards } from "../Card.types";
import {
  FetchCatalogueSuccessAction,
  FETCH_CATALOGUE_SUCCESS,
  DeleteLayoutAction,
  DELETE_LAYOUT,
} from "../../../../actions/catalogue";

/** ***********************************
 *    Sportsbook Bet Cards reducer    *
 ************************************ */

type ActionTypes = FetchCatalogueSuccessAction | DeleteLayoutAction;

export default (currentState: undefined | SportsbookBetCards, action: ActionTypes): SportsbookBetCards => {
  const state = currentState || {};

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const cards = action.payload.data.SportsbookBetCard || [];

      return cards.reduce<SportsbookBetCards>(
        (acc, bet) => ({
          ...acc,
          [bet.urn]: {
            ...bet,
          },
        }),
        { ...state },
      );
    }
    case DELETE_LAYOUT:
      return {};
    default:
      return state;
  }
};
