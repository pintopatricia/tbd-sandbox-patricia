import { VirtualMarkets } from "./VirtualMarket.types";
import {
  FetchCatalogueSuccessAction,
  FETCH_CATALOGUE_SUCCESS,
  SportsbookMarketsSuccessAction,
  NETWORK__SBK_MARKETS_SUCCESS,
} from "../../../actions/catalogue";
import { reduceEntities } from "../create-entity-reducer";

type ActionTypes = FetchCatalogueSuccessAction | SportsbookMarketsSuccessAction;

export default (currentState: undefined | VirtualMarkets, action: ActionTypes): VirtualMarkets => {
  const state = currentState || {};

  switch (action.type) {
    case NETWORK__SBK_MARKETS_SUCCESS:
    case FETCH_CATALOGUE_SUCCESS: {
      return reduceEntities(state, action.payload, "VirtualMarket");
    }
    default:
      return state;
  }
};
