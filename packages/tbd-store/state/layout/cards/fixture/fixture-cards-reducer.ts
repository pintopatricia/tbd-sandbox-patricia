import { FixtureCards } from "../Card.types";
import {
  FETCH_CATALOGUE_SUCCESS,
  FetchCatalogueSuccessAction,
  FetchMainMarketsUpdatesSuccessAction,
  FetchRunnersOrderUpdatesSuccessAction,
  FETCH_MAIN_MARKETS_UPDATES_SUCCESS,
  DeleteLayoutAction,
  DELETE_LAYOUT,
} from "../../../../actions/catalogue";

const INITIAL_STATE: FixtureCards = {};

type ActionTypes =
  | FetchCatalogueSuccessAction
  | FetchRunnersOrderUpdatesSuccessAction
  | FetchMainMarketsUpdatesSuccessAction
  | DeleteLayoutAction;

export default (currentState: undefined | FixtureCards, action: ActionTypes): FixtureCards => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const cards = action.payload.data.FixtureCard;
      if (!cards) {
        return state;
      }

      return cards.reduce<FixtureCards>(
        (acc, card) => ({
          ...acc,
          [card.urn]: {
            ...state[card.urn],
            ...card,
          },
        }),
        { ...state },
      );
    }
    case FETCH_MAIN_MARKETS_UPDATES_SUCCESS: {
      const cards = action.payload.data.FixtureCard || [];
      return cards.reduce<FixtureCards>(
        (acc, entry) => ({
          ...acc,
          [entry.urn]: {
            ...acc[entry.urn],
            ...entry,
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
