import { EventMarketCards } from "../Card.types";
import {
  FETCH_CATALOGUE_SUCCESS,
  FETCH_MAIN_MARKETS_UPDATES_SUCCESS,
  FETCH_RUNNERS_ORDER_UPDATES_SUCCESS,
  FetchCatalogueSuccessAction,
  FetchMainMarketsUpdatesSuccessAction,
  FetchRunnersOrderUpdatesSuccessAction,
  DELETE_LAYOUT,
  DeleteLayoutAction,
} from "../../../../actions/catalogue";

const INITIAL_STATE: EventMarketCards = {};

type ActionTypes =
  | FetchCatalogueSuccessAction
  | FetchRunnersOrderUpdatesSuccessAction
  | FetchMainMarketsUpdatesSuccessAction
  | DeleteLayoutAction;

export default (currentState: undefined | EventMarketCards, action: ActionTypes): EventMarketCards => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS:
      return (action.payload.data.EventMarketCard || []).reduce<EventMarketCards>(
        (acc, card) => {
          if (!card) return acc;
          // Keeping from the previous state
          const selectedMarketTab = state[card.urn]?.selectedMarketTab;

          return {
            ...acc,
            [card.urn]: {
              ...state[card.urn],
              ...card,
              selectedMarketTab,
            },
          };
        },
        { ...state },
      );
    case FETCH_RUNNERS_ORDER_UPDATES_SUCCESS: {
      const cards = action.payload.data.EventMarketCard || [];

      return cards.reduce<EventMarketCards>(
        (acc, entry) => {
          if (!entry) return acc;
          const { urn, displayRunners } = entry;
          const { sportsbook: payloadSbk, exchange: payloadExc } = displayRunners;
          const { sportsbook: stateSbk, exchange: stateExc } = acc[urn].displayRunners;

          if (!(payloadSbk || payloadExc)) return acc;
          const displayRunnerModel = { market: "", runners: [] };

          return {
            ...acc,
            [urn]: {
              ...acc[urn],
              displayRunners: {
                ...((stateSbk || payloadSbk) && { sportsbook: { ...displayRunnerModel, ...stateSbk, ...payloadSbk } }),
                ...((stateExc || payloadExc) && { exchange: { ...displayRunnerModel, ...stateExc, ...payloadExc } }),
              },
            },
          };
        },
        { ...state },
      );
    }
    case FETCH_MAIN_MARKETS_UPDATES_SUCCESS: {
      const cards = action.payload.data.EventMarketCard || [];

      return cards.reduce<EventMarketCards>(
        (acc, entry) => {
          if (!entry) return acc;
          const { urn } = entry;
          return {
            ...acc,
            [urn]: {
              ...acc[urn],
              ...entry,
            },
          };
        },
        { ...state },
      );
    }
    case DELETE_LAYOUT:
      return {};
    default:
      return state;
  }
};
