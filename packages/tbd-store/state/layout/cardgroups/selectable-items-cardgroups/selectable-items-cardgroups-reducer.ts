import {
  FETCH_CATALOGUE_SUCCESS,
  FetchCatalogueSuccessAction,
  DELETE_LAYOUT,
  DeleteLayoutAction,
  FETCH_FILTERED_SELECTABLE_ITEMS,
  FetchFilteredSelectableItemsAction,
} from "../../../../actions/catalogue";
import { SelectableItemsCardGroups } from "../CardGroup.types";

const INITIAL_STATE: SelectableItemsCardGroups = {};

type ActionTypes = FetchCatalogueSuccessAction | DeleteLayoutAction | FetchFilteredSelectableItemsAction;

export default (
  currentState: undefined | SelectableItemsCardGroups,
  action: ActionTypes,
): SelectableItemsCardGroups => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const selectableItemsCardGroups = action.payload.data.SelectableItemsCardGroup || [];

      return selectableItemsCardGroups.reduce<SelectableItemsCardGroups>(
        (acc, selectableItemCardGroup) => ({
          ...acc,
          [selectableItemCardGroup.urn]: {
            ...state[selectableItemCardGroup.urn],
            ...selectableItemCardGroup,
            ...(selectableItemCardGroup.filter && {
              filter: {
                ...state[selectableItemCardGroup.urn]?.filter,
                ...selectableItemCardGroup.filter,
              },
            }),
          },
        }),
        { ...state },
      );
    }
    case FETCH_FILTERED_SELECTABLE_ITEMS: {
      const selectableItem = state[action.payload.urn];

      if (!selectableItem.filter) {
        return state;
      }

      return {
        ...state,
        [action.payload.urn]: {
          ...selectableItem,
          filter: {
            ...selectableItem.filter,
            selectedOption: action.payload.filterBy.country,
          },
        },
      };
    }
    case DELETE_LAYOUT:
      return {};
    default:
      return state;
  }
};
