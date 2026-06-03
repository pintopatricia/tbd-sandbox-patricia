import { MarketCards } from "../Card.types";
import {
  FETCH_CATALOGUE_SUCCESS,
  FETCH_RUNNERS_ORDER_UPDATES_SUCCESS,
  FetchCatalogueSuccessAction,
  FetchRunnersOrderUpdatesSuccessAction,
  DeleteLayoutAction,
  DELETE_LAYOUT,
} from "../../../../actions/catalogue";

const INITIAL_STATE: MarketCards = {};

type ActionTypes = FetchCatalogueSuccessAction | FetchRunnersOrderUpdatesSuccessAction | DeleteLayoutAction;

export default (currentState: undefined | MarketCards, action: ActionTypes): MarketCards => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const cards = action.payload.data.MarketCard || [];

      return cards.reduce<MarketCards>(
        (acc, market) => {
          // Keeping from the previous state
          const selectedMarketTab = state[market.urn]?.selectedMarketTab;

          return {
            ...acc,
            [market.urn]: {
              ...state[market.urn],
              ...market,
              selectedMarketTab,
            },
          };
        },
        { ...state },
      );
    }
    case FETCH_RUNNERS_ORDER_UPDATES_SUCCESS: {
      const cards = action.payload.data.MarketCard || [];

      return cards.reduce<MarketCards>(
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
