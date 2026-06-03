import { VirtualEvents } from "./VirtualEvent.types";
import {
  FetchCatalogueSuccessAction,
  FETCH_CATALOGUE_SUCCESS,
  SportsbookMarketsSuccessAction,
  NETWORK__SBK_MARKETS_SUCCESS,
} from "../../../actions/catalogue";
import { reduceEntities } from "../create-entity-reducer";

type ActionTypes = SportsbookMarketsSuccessAction | FetchCatalogueSuccessAction;

export default (currentState: undefined | VirtualEvents, action: ActionTypes): VirtualEvents => {
  const state = currentState || {};

  switch (action.type) {
    case NETWORK__SBK_MARKETS_SUCCESS:
    case FETCH_CATALOGUE_SUCCESS: {
      return reduceEntities(state, action.payload, "VirtualEvent");
    }
    default:
      return state;
  }
};
