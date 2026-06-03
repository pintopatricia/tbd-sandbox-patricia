import { MarketExtendedCards } from "../Card.types";
import {
  FETCH_CATALOGUE_SUCCESS,
  FETCH_RUNNERS_ORDER_UPDATES_SUCCESS,
  FetchCatalogueSuccessAction,
  FetchRunnersOrderUpdatesSuccessAction,
  DELETE_LAYOUT,
  DeleteLayoutAction,
} from "../../../../actions/catalogue";

const INITIAL_STATE: MarketExtendedCards = {};

type ActionTypes = FetchCatalogueSuccessAction | FetchRunnersOrderUpdatesSuccessAction | DeleteLayoutAction;

export default (currentState: undefined | MarketExtendedCards, action: ActionTypes): MarketExtendedCards => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const cards = action.payload.data.MarketExtendedCard || [];

      return cards.reduce<MarketExtendedCards>(
        (acc, marketExtended) => {
          // Keeping from the previous state
          const selectedMarketTab = state[marketExtended.urn]?.selectedMarketTab;

          return {
            ...acc,
            [marketExtended.urn]: {
              ...state[marketExtended.urn],
              ...marketExtended,
              selectedMarketTab,
            },
          };
        },
        { ...state },
      );
    }
    case FETCH_RUNNERS_ORDER_UPDATES_SUCCESS: {
      const cards = action.payload.data.MarketExtendedCard || [];

      return cards.reduce<MarketExtendedCards>(
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
