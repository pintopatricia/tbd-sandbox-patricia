/* eslint-disable no-param-reassign */
import produce from "immer";
import { SportsbookMarket, SportsbookMarkets } from "./SportsbookMarket.types";
import {
  FETCH_CATALOGUE_SUCCESS,
  FETCH_MAIN_MARKETS_UPDATES_SUCCESS,
  FetchCatalogueSuccessAction,
  FetchMainMarketsUpdatesSuccessAction,
  NETWORK__SBK_MARKETS_SUCCESS,
  SportsbookMarketsSuccessAction,
} from "../../../actions/catalogue";
import {
  FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS,
  FetchSportsbookMarketUpdatesSuccessAction,
} from "../../../actions/sportsbook-markets";

/**
 * Action types
 */
type ActionTypes =
  | SportsbookMarketsSuccessAction
  | FetchCatalogueSuccessAction
  | FetchSportsbookMarketUpdatesSuccessAction
  | FetchMainMarketsUpdatesSuccessAction;

/** *****************************
 *  Sportsbook markets reducer  *
 ****************************** */
export default (currentState: undefined | SportsbookMarkets, action: ActionTypes): SportsbookMarkets => {
  const state = currentState || {};

  switch (action.type) {
    case NETWORK__SBK_MARKETS_SUCCESS:
    case FETCH_CATALOGUE_SUCCESS:
    case FETCH_MAIN_MARKETS_UPDATES_SUCCESS: {
      const markets = action.payload.data.SportsbookMarket || [];

      return markets.reduce<SportsbookMarkets>(
        (acc, market) => {
          const prev = state[market.urn] || {};
          const { status } = market;

          return {
            ...acc,
            [market.urn]: {
              ...prev,
              ...market,
              status: status || prev.status,
            },
          };
        },
        { ...state },
      );
    }
    case FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS: {
      return produce(state, (draft) => {
        action.payload.markets.forEach((market) => {
          if (market.urn === undefined) {
            throw new Error("Market URN is required");
          }

          if (!draft[market.urn]) {
            draft[market.urn] = {} as SportsbookMarket;
          }

          if (market.status) {
            draft[market.urn].status = market.status;
          }

          if ("marketId" in market) {
            draft[market.urn].urn = market.urn;
            draft[market.urn].marketId = market.marketId;
            draft[market.urn].eachWayAvailable = market.eachWayAvailable;
            draft[market.urn].guaranteedPriceAvailable = market.guaranteedPriceAvailable;
            draft[market.urn].inplay = market.inplay;
            draft[market.urn].eachWayPlaces = market.eachWayPlaces;
            draft[market.urn].eachWayPlaceFraction = market.eachWayPlaceFraction;
          }

          if (!draft[market.urn].runners) {
            draft[market.urn].runners = [];
          }

          const runnerDetails = action.payload.runnerDetails?.[market.urn];

          if (runnerDetails) {
            draft[market.urn].runners.forEach((runner) => {
              const liveRunner = runnerDetails.find(({ selectionId }) => selectionId === runner.selectionId);

              if (liveRunner?.handicap) {
                runner.handicap = liveRunner?.handicap;
              }
            });
          }
        });
      });
    }

    default:
      return state;
  }
};
