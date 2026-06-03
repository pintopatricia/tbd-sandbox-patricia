import { codecs } from "@ppb/tbd-urn-codecs";
import { FETCH_CATALOGUE_SUCCESS, FetchCatalogueSuccessAction } from "../../../actions/catalogue";
import {
  FetchBetsMutationEligibilitySuccessAction,
  FetchBetsResultSuccessAction,
  NETWORK__FETCH_BETS_MUTATION_ELIGIBILITY_SUCCESS,
  NETWORK__FETCH_BETS_RESULT_SUCCESS,
} from "../../../actions/my-bets";
import { ResultType } from "../../../clients/blh/bet-live-hypotheticals-response-types";
import { getResultFromResultType } from "../../../helpers/sportsbook-betting";
import { SportsbookBets } from "./SportsbookBet.types";

type ActionTypes =
  | FetchCatalogueSuccessAction
  | FetchBetsResultSuccessAction
  | FetchBetsMutationEligibilitySuccessAction;

/** **************************
 *  Sportsbook Bets reducer  *
 *************************** */

export default (currentState: undefined | SportsbookBets, action: ActionTypes): SportsbookBets => {
  const state = currentState || {};

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const bets = action.payload.data.SportsbookBet || [];

      return bets.reduce(
        (acc, bet) => ({
          ...acc,
          [bet.urn]: bet,
        }),
        { ...state },
      );
    }
    case NETWORK__FETCH_BETS_RESULT_SUCCESS: {
      const { bets } = action.payload;

      return bets.reduce(
        (acc, { urn, result, resultType }) => {
          if (acc[urn]?.resultType === ResultType.CONFIRMED) return acc;

          return {
            ...acc,
            [urn]: {
              ...state[urn],
              resultType,
              result: getResultFromResultType(result, resultType),
            },
          };
        },
        { ...state },
      );
    }
    case NETWORK__FETCH_BETS_MUTATION_ELIGIBILITY_SUCCESS: {
      const betEligibilities = action.payload.betEligibilities || [];

      return betEligibilities.reduce(
        (acc: SportsbookBets, { betId, betMutationEligibility }) => {
          if (!betId || !betMutationEligibility?.length) return acc;

          const betUrn = codecs.sportsbookBet.encode(betId).uid;

          return {
            ...acc,
            [betUrn]: {
              ...state[betUrn],
              mutations: {
                eligibility: betMutationEligibility,
              },
            },
          } as SportsbookBets;
        },
        { ...state },
      );
    }
    default:
      return state;
  }
};
