import { BasicCard } from "./Card.types";
import {
  DeleteLayoutAction,
  FetchCatalogueSuccessAction,
  DELETE_LAYOUT,
  FETCH_CATALOGUE_SUCCESS,
} from "../../../actions/catalogue";
import { TransformedLayout } from "../../../services/catalogue/catalogue-types";

type ActionTypes = FetchCatalogueSuccessAction | DeleteLayoutAction;

/**
 * Factory function for every card reducer that only reacts to the `FETCH_CATALOGUE_SUCCESS` action to write the card in the store
 *
 * @param sliceName - the name of the corresponding cards state slice
 * @returns
 */
export default function createCardsReducer<CardT extends BasicCard>(typename: keyof TransformedLayout["data"]): any {
  type CardsT = { [urn: string]: CardT };

  // Type guard to guarantee that we're dealing with a layout card
  function isCardTEntry(entry: any): entry is CardT[] {
    return !!(entry as CardT[]) && entry.length && !entry.find((v: CardT) => !v.urn);
  }

  return (currentState: undefined | CardsT, action: ActionTypes): CardsT => {
    const state = currentState || {};

    switch (action.type) {
      case FETCH_CATALOGUE_SUCCESS:
        {
          const cards = action.payload.data[typename];

          if (isCardTEntry(cards)) {
            return cards.reduce<CardsT>(
              (acc, card) => ({
                ...acc,
                [card.urn]: {
                  ...state[card.urn],
                  ...card,
                },
              }),
              state,
            );
          }
        }
        return state;

      case DELETE_LAYOUT: {
        return {};
      }

      default:
        return state;
    }
  };
}
