import {
  FETCH_CATALOGUE_SUCCESS,
  FetchCatalogueSuccessAction,
  DELETE_LAYOUT,
  DeleteLayoutAction,
} from "../../../../actions/catalogue";
import { VirtualCardGroups } from "../CardGroup.types";

const INITIAL_STATE: VirtualCardGroups = {};

type ActionTypes = FetchCatalogueSuccessAction | DeleteLayoutAction;

export default (currentState: undefined | VirtualCardGroups, action: ActionTypes): VirtualCardGroups => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const virtualCardGroups = action.payload.data.VirtualCardGroup || [];

      return virtualCardGroups.reduce<VirtualCardGroups>(
        (acc, group) => ({
          ...acc,
          [group.urn]: {
            ...state[group.urn],
            ...group,
            items: state[group.urn]?.items ? state[group.urn].items : group.items,
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
