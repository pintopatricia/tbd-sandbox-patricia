import {
  DELETE_LAYOUT,
  DELETE_VIEW_ITEMS,
  DeleteLayoutAction,
  DeleteViewItems,
  FETCH_CATALOGUE_SUCCESS,
  FetchCatalogueSuccessAction,
} from "../../../../actions";
import { PebbleItemSelectionAction, UI__CLICK_PEBBLE_ITEM } from "../../../../actions/interface";
import { APOLLO_MIGRATED_CARDS } from "../../cards/Card.types";
import { PebbleCardGroups } from "../CardGroup.types";
import { isHydratedPebbleCardGroup } from "./pebble-cardgroups-selectors";

const typename = "PebbleCardGroup";
type ActionTypes = FetchCatalogueSuccessAction | DeleteLayoutAction | DeleteViewItems | PebbleItemSelectionAction;

export default (currentState: PebbleCardGroups | undefined, action: ActionTypes): PebbleCardGroups => {
  const state = currentState || {};

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const cardGroups = action.payload.data[typename] || [];

      return cardGroups.reduce<PebbleCardGroups>(
        (acc, cardGroup): PebbleCardGroups => ({
          ...acc,
          [cardGroup.urn]: {
            ...state[cardGroup.urn],
            ...cardGroup,
          },
        }),
        { ...state },
      );
    }

    case DELETE_VIEW_ITEMS: {
      const itemsUrnsToDelete = action.payload;

      return Object.keys(state).reduce((acc, cardGroupUrn): PebbleCardGroups => {
        const cardgroup = acc[cardGroupUrn];
        let items;

        if (isHydratedPebbleCardGroup(cardgroup)) {
          items = cardgroup.items.filter(
            ({ urn, typename: type }): boolean =>
              !itemsUrnsToDelete.includes(urn) || APOLLO_MIGRATED_CARDS.includes(type),
          );
        }

        return {
          ...acc,
          [cardGroupUrn]: {
            ...acc[cardGroupUrn],
            items,
          },
        };
      }, state);
    }

    case DELETE_LAYOUT: {
      return {};
    }

    case UI__CLICK_PEBBLE_ITEM: {
      const cardGroup = state[action.payload.cardGroupURN];

      return {
        ...state,
        [action.payload.cardGroupURN]: {
          ...cardGroup,
          selectedItemUrn: action.payload.pebbleURN,
        },
      };
    }

    default:
      return state;
  }
};
