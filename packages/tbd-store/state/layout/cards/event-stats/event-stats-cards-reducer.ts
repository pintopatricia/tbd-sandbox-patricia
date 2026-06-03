import { EventStatsCards } from "../Card.types";
import {
  FETCH_CATALOGUE_SUCCESS,
  FetchCatalogueSuccessAction,
  DELETE_LAYOUT,
  DeleteLayoutAction,
} from "../../../../actions/catalogue";

const INITIAL_STATE: EventStatsCards = {};

type ActionTypes = FetchCatalogueSuccessAction | DeleteLayoutAction;

export default (currentState: undefined | EventStatsCards, action: ActionTypes): EventStatsCards => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const cards = action.payload.data.EventStatsCard || [];

      return cards.reduce<EventStatsCards>(
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
    case DELETE_LAYOUT:
      return {};
    default:
      return state;
  }
};
