import {
  FETCH_CATALOGUE_SUCCESS,
  FetchCatalogueSuccessAction,
  DELETE_LAYOUT,
  DeleteLayoutAction,
} from "../../../actions/catalogue";
import { ViewZones } from "../cards/ViewZone.types";

const INITIAL_STATE: ViewZones = {};

type ActionTypes = FetchCatalogueSuccessAction | DeleteLayoutAction;

export default (currentState: undefined | ViewZones, action: ActionTypes): ViewZones => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const zones = action.payload.data.ViewZone || [];

      return zones.reduce<ViewZones>(
        (acc, viewzone) => ({
          ...acc,
          [viewzone.urn]: {
            ...state[viewzone.urn],
            ...viewzone,
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
