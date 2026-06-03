import {
  FETCH_CATALOGUE_SUCCESS,
  FetchCatalogueSuccessAction,
  DELETE_LAYOUT,
  DeleteLayoutAction,
} from "../../../actions/catalogue";
import { SearchZones } from "../cards/SearchZone.types";

const INITIAL_STATE: SearchZones = {};

type ActionTypes = FetchCatalogueSuccessAction | DeleteLayoutAction;

export default (currentState: undefined | SearchZones, action: ActionTypes): SearchZones => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const zones = action.payload.data.SearchZone || [];

      return zones.reduce<SearchZones>(
        (acc, searchzone) => ({
          ...acc,
          [searchzone.urn]: {
            ...state[searchzone.urn],
            ...searchzone,
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
