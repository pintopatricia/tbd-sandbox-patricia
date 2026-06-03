import { FETCH_CATALOGUE_SUCCESS, type FetchCatalogueSuccessAction } from "../../../actions";
import {
  UI__FAVOURITE_MARKETS_TOGGLE_FAVOURITE,
  type FavouriteMarketsToggleFavouriteAction,
} from "../../../actions/favourite-markets";
import { reduceEntities } from "../create-entity-reducer";

import type { FavouriteMarketsStates } from "./FavouriteMarketsState.types";

type ActionTypes = FetchCatalogueSuccessAction | FavouriteMarketsToggleFavouriteAction;

export default (currentState: undefined | FavouriteMarketsStates, action: ActionTypes): FavouriteMarketsStates => {
  const state = currentState || {};

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS:
      return reduceEntities(state, action.payload, "FavouriteMarketsState");
    case UI__FAVOURITE_MARKETS_TOGGLE_FAVOURITE: {
      if (state[action.payload.favouriteMarketsURN])
        return {
          ...state,
          [action.payload.favouriteMarketsURN]: {
            ...state[action.payload.favouriteMarketsURN],
            isFavourite: action.payload.isFavourite,
          },
        };

      return state;
    }
    default:
      return state;
  }
};
