import { GridCards } from "../Card.types";
import {
  FetchCatalogueSuccessAction,
  FETCH_CATALOGUE_SUCCESS,
  DeleteLayoutAction,
  DELETE_LAYOUT,
} from "../../../../actions/catalogue";

type ActionTypes = FetchCatalogueSuccessAction | DeleteLayoutAction;

export default (currentState: undefined | GridCards, action: ActionTypes): GridCards => {
  const state = currentState || {};

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const cards = action.payload.data.GridCard || [];

      return cards.reduce<GridCards>(
        (acc, card) => {
          const oldMarkets = acc[card.urn]?.markets || [];
          const oldMarketsIndex = oldMarkets.map((m) => m.urn);
          const newMarkets = card.markets.filter((m) => oldMarketsIndex.indexOf(m.urn) === -1);

          return {
            ...acc,
            [card.urn]: {
              ...acc[card.urn],
              ...card,
              markets: [...oldMarkets, ...newMarkets],
            },
          };
        },
        { ...state },
      );
    }
    case DELETE_LAYOUT:
      return {};
    default:
      return state;
  }
};
