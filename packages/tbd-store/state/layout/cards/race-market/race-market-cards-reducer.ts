import { RaceMarketCards } from "../Card.types";
import {
  FETCH_CATALOGUE_SUCCESS,
  FETCH_RUNNERS_ORDER_UPDATES_SUCCESS,
  FetchCatalogueSuccessAction,
  FetchRunnersOrderUpdatesSuccessAction,
  DELETE_LAYOUT,
  DeleteLayoutAction,
} from "../../../../actions/catalogue";
import { PushAction } from "../../../../actions/router";

const INITIAL_STATE: RaceMarketCards = {};

type ActionTypes =
  | FetchCatalogueSuccessAction
  | PushAction
  | FetchRunnersOrderUpdatesSuccessAction
  | DeleteLayoutAction;

export default (currentState: undefined | RaceMarketCards, action: ActionTypes): RaceMarketCards => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const racemarkets = action.payload.data.RaceMarketCard || [];

      return racemarkets.reduce<RaceMarketCards>(
        (acc, racemarket) => {
          // Keeping from the previous state
          const selectedMarketTab = state[racemarket.urn]?.selectedMarketTab;

          return {
            ...acc,
            [racemarket.urn]: {
              ...state[racemarket.urn],
              ...racemarket,
              selectedMarketTab,
            },
          };
        },
        { ...state },
      );
    }
    case FETCH_RUNNERS_ORDER_UPDATES_SUCCESS: {
      const cards = action.payload.data.RaceMarketCard || [];

      return cards.reduce<RaceMarketCards>(
        (acc, entry) => {
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
    case DELETE_LAYOUT:
      return {};
    default:
      return state;
  }
};
