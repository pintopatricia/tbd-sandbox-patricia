import {
  FETCH_CATALOGUE_SUCCESS,
  FetchCatalogueSuccessAction,
  DELETE_LAYOUT,
  DeleteLayoutAction,
} from "../../../../actions/catalogue";
import { SportRibbonCardGroups } from "../CardGroup.types";

const INITIAL_STATE: SportRibbonCardGroups = {};

type ActionTypes = FetchCatalogueSuccessAction | DeleteLayoutAction;

export default (currentState: undefined | SportRibbonCardGroups, action: ActionTypes): SportRibbonCardGroups => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const sportRibbonCardGroups = action.payload.data.SportRibbonCardGroup || [];

      return sportRibbonCardGroups.reduce<SportRibbonCardGroups>(
        (acc, group) => ({
          ...acc,
          [group.urn]: {
            ...state[group.urn],
            ...group,
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
