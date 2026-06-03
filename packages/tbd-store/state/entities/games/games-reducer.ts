import { Games } from "../index";
import { FETCH_CATALOGUE_SUCCESS, FetchCatalogueSuccessAction } from "../../../actions/catalogue";
import { UPDATE_LAST_NUMBERS, UpdateLastNumbersAction } from "../../../actions/game-feeds";
import { reduceEntities } from "../create-entity-reducer";

type ActionTypes = FetchCatalogueSuccessAction | UpdateLastNumbersAction;

export default (currentState: undefined | Games, action: ActionTypes): Games => {
  const state = currentState || {};

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS:
      return reduceEntities(state, action.payload, "Game");
    case UPDATE_LAST_NUMBERS: // Fallthrough
      return {
        ...state,
        [action.payload.urn]: {
          ...state[action.payload.urn],
          feedData: {
            ...state[action.payload.urn].feedData,
            ...action.payload.data,
          },
        },
      };
    default:
      return state;
  }
};
