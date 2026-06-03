import { PopularBettingOpportunities } from "./PopularBettingOpportunity.types";
import {
  FetchCatalogueSuccessAction,
  FETCH_CATALOGUE_SUCCESS,
  SportsbookMarketsSuccessAction,
  NETWORK__SBK_MARKETS_SUCCESS,
} from "../../../actions/catalogue";
import {
  FetchBettingOpportunityPriceUpdatesSuccessAction,
  FETCH_BETTING_OPPORTUNITY_PRICE_UPDATES_SUCCESS,
} from "../../../actions/sportsbook-markets";
import { reduceEntities } from "../create-entity-reducer";

type ActionTypes =
  | FetchBettingOpportunityPriceUpdatesSuccessAction
  | SportsbookMarketsSuccessAction
  | FetchCatalogueSuccessAction;

export default (
  currentState: undefined | PopularBettingOpportunities,
  action: ActionTypes,
): PopularBettingOpportunities => {
  const state = currentState || {};

  switch (action.type) {
    case NETWORK__SBK_MARKETS_SUCCESS:
    case FETCH_CATALOGUE_SUCCESS: {
      return reduceEntities(state, action.payload, "PopularBettingOpportunity");
    }
    case FETCH_BETTING_OPPORTUNITY_PRICE_UPDATES_SUCCESS: {
      const { result, combinationGroups } = action.payload;

      return result.betCombinations.reduce<PopularBettingOpportunities>((acc, combination) => {
        const index = combination.combinationGroupId ?? combination.combinationGroup;
        const decimalOdds =
          combination.winAvgOdds?.prettyDisplayOdds?.decimalOdds?.decimalOdds ||
          combination.winAvgOdds?.decimalDisplayOdds?.decimalOdds ||
          0;
        const fractionalOdds =
          combination.winAvgOdds?.prettyDisplayOdds?.fractionalOdds || combination.winAvgOdds?.fractionalDisplayOdds;
        const americanOdds = combination.winAvgOdds?.americanDisplayOdds?.americanOddsInt;
        const originalDecimalOdds = combination.originalWinAvgOdds?.decimalDisplayOdds?.decimalOdds || 0;
        const originalFractionalOdds = combination.originalWinAvgOdds?.fractionalDisplayOdds;
        const originalAmericanOdds = combination.originalWinAvgOdds?.americanDisplayOdds?.americanOddsInt;

        const urn = index !== undefined ? combinationGroups[index] : undefined;

        // Ignore this update if we don't have stored data
        if (!urn || !decimalOdds || !state[urn]) {
          return state;
        }

        return {
          ...acc,
          [urn]: {
            ...state[urn],
            odds: {
              decimal: decimalOdds,
              fractional: fractionalOdds,
              american: americanOdds,
            },
            originalOdds: {
              decimal: originalDecimalOdds,
              fractional: originalFractionalOdds,
              american: originalAmericanOdds,
            },
          },
        };
      }, state);
    }
    default:
      return state;
  }
};
