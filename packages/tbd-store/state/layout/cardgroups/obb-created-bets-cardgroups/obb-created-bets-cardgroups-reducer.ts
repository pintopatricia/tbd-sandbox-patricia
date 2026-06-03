import {
  DeleteLayoutAction,
  FetchCatalogueSuccessAction,
  DELETE_LAYOUT,
  FETCH_CATALOGUE_SUCCESS,
  DELETE_VIEW_ITEMS,
  DeleteViewItems,
} from "../../../../actions";
import { ObbCreatedBetsCardGroups } from "../CardGroup.types";
import { APOLLO_MIGRATED_CARDS } from "../../cards/Card.types";

const INITIAL_STATE: ObbCreatedBetsCardGroups = {};

type ActionTypes = FetchCatalogueSuccessAction | DeleteLayoutAction | DeleteViewItems;

const deleteCardGroupItems = (
  state: ObbCreatedBetsCardGroups,
  cardGroupsUrns: string[],
  itemsUrnsToDelete: string[],
): ObbCreatedBetsCardGroups =>
  cardGroupsUrns.reduce(
    (acc, cardGroupUrn) => ({
      ...acc,
      [cardGroupUrn]: {
        ...acc[cardGroupUrn],
        items: acc[cardGroupUrn].items.filter(
          ({ urn, typename }) => !itemsUrnsToDelete.includes(urn) || APOLLO_MIGRATED_CARDS.includes(typename),
        ),
      },
    }),
    state,
  );

export default (currentState: undefined | ObbCreatedBetsCardGroups, action: ActionTypes): ObbCreatedBetsCardGroups => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const obbCreatedBetsCardGroups = action.payload.data.ObbCreatedBetsCardGroup;
      if (!obbCreatedBetsCardGroups) {
        return state;
      }

      return obbCreatedBetsCardGroups.reduce<ObbCreatedBetsCardGroups>(
        (acc, cardGroup) => {
          if (!cardGroup.items.length) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete acc[cardGroup.urn];

            return acc;
          }

          acc[cardGroup.urn] = cardGroup;

          return acc;
        },
        { ...state },
      );
    }

    case DELETE_VIEW_ITEMS: {
      const itemsUrnsToDelete = action.payload;

      return deleteCardGroupItems(state, Object.keys(state), itemsUrnsToDelete);
    }

    case DELETE_LAYOUT: {
      return {};
    }

    default:
      return state;
  }
};
