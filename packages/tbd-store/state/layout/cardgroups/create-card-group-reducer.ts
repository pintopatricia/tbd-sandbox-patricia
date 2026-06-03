import {
  DeleteLayoutAction,
  FetchCatalogueSuccessAction,
  DELETE_LAYOUT,
  FETCH_CATALOGUE_SUCCESS,
  DELETE_VIEW_ITEMS,
  DeleteViewItems,
} from "../../../actions";
import { TransformedLayout } from "../../../services/catalogue/catalogue-types";
import { APOLLO_MIGRATED_CARDS } from "../cards/Card.types";
import { BasicCardGroup } from "./CardGroup.types";

type ActionTypes = FetchCatalogueSuccessAction | DeleteLayoutAction | DeleteViewItems;

/**
 * Factory function for every card group reducer that only reacts to the `FETCH_CATALOGUE_SUCCESS` action to write the card in the store
 *
 * @param typename - the name of the corresponding card group state slice
 * @returns
 */
export default function createCardGroupsReducer<CardGroupT extends BasicCardGroup>(
  typename: keyof TransformedLayout["data"],
) {
  type CardGroupsT = { [urn: string]: CardGroupT };

  // Type guard to guarantee that we're dealing with a layout card
  const isCardGroupTEntry = (entry: any): entry is CardGroupT[] =>
    !!(entry as CardGroupT[]) && entry.length && !entry.find((v: CardGroupT) => !v.urn || !v.items);

  const deleteCardGroupItems = (
    state: CardGroupsT,
    cardGroupsUrns: string[],
    itemsUrnsToDelete: string[],
    force: boolean,
  ): CardGroupsT =>
    cardGroupsUrns.reduce(
      (acc: CardGroupsT, cardGroupUrn) => ({
        ...acc,
        [cardGroupUrn]: {
          ...acc[cardGroupUrn],
          items: acc[cardGroupUrn].items.filter(
            ({ urn, typename: type }) =>
              !itemsUrnsToDelete.includes(urn) || (!force && APOLLO_MIGRATED_CARDS.includes(type)),
          ),
        },
      }),
      state,
    );

  return (currentState: undefined | CardGroupsT, action: ActionTypes): CardGroupsT => {
    const state = currentState || {};

    switch (action.type) {
      case FETCH_CATALOGUE_SUCCESS:
        {
          const cardGroups = action.payload.data[typename];

          if (isCardGroupTEntry(cardGroups)) {
            return cardGroups.reduce<CardGroupsT>(
              (acc, cardGroup) => ({
                ...acc,
                [cardGroup.urn]: {
                  ...state[cardGroup.urn],
                  ...cardGroup,
                },
              }),
              state,
            );
          }
        }
        return state;

      case DELETE_VIEW_ITEMS: {
        const itemsUrnsToDelete = action.payload;
        const { force = false } = action;

        return deleteCardGroupItems(state, Object.keys(state), itemsUrnsToDelete, force);
      }

      case DELETE_LAYOUT: {
        return {};
      }

      default:
        return state;
    }
  };
}
