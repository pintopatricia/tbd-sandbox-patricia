import { FETCH_CATALOGUE_SUCCESS, FetchCatalogueSuccessAction } from "../../../actions/catalogue";
import {
  FetchBetsMutationEligibilitySuccessAction,
  FetchBetsResultSuccessAction,
  NETWORK__FETCH_BETS_MUTATION_ELIGIBILITY_SUCCESS,
  NETWORK__FETCH_BETS_RESULT_SUCCESS,
} from "../../../actions/my-bets";
import { ResultType } from "../../../clients/blh/bet-live-hypotheticals-response-types";
import { getResultFromResultType } from "../../../helpers/sportsbook-betting";
import { BetLegs } from "../../betting/sportsbook-bets/SportsbookBet.types";
import {
  FreezeLegFailureAction,
  FreezeLegSuccessAction,
  NETWORK__FREEZE_BET_FAILURE,
  NETWORK__FREEZE_BET_SUCCESS,
} from "../../../actions/bet-mutation";
import { getLegUrnForBMELeg } from "../../../helpers/mutations";

type ActionTypes =
  | FetchCatalogueSuccessAction
  | FetchBetsResultSuccessAction
  | FetchBetsMutationEligibilitySuccessAction
  | FreezeLegSuccessAction
  | FreezeLegFailureAction;

/** *******************************
 *  Sportsbook Bet Legs reducer   *
 ******************************** */

export default (currentState: undefined | BetLegs, action: ActionTypes): BetLegs => {
  const state = currentState || {};

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const legs = action.payload.data.BetLeg || [];

      return legs.reduce(
        (acc, leg) => ({
          ...acc,
          [leg.urn]: leg,
        }),
        state,
      );
    }
    case NETWORK__FETCH_BETS_RESULT_SUCCESS: {
      const { bets, legsMapper } = action.payload;

      const legs = bets.reduce(
        (acc, bet) => ({
          ...acc,
          ...bet.legs.reduce((legsAcc, { legNumber, runners }) => {
            const legsMap = legsMapper.get(bet.urn);
            const legUrn = legsMap?.[Number(legNumber)];

            if (!legNumber || !legUrn) return legsAcc;

            const { result, resultType } = runners[0];

            if (legsAcc[legUrn]?.resultType === ResultType.CONFIRMED) return legsAcc;

            return {
              ...legsAcc,
              [legUrn]: {
                ...state[legUrn],
                result: getResultFromResultType(result, resultType),
                resultType,
              },
            };
          }, acc),
        }),
        state,
      );
      return legs;
    }
    case NETWORK__FETCH_BETS_MUTATION_ELIGIBILITY_SUCCESS: {
      const betEligibilities = action.payload.betEligibilities || [];

      return betEligibilities.reduce((acc, { betId, legs }) => {
        if (!betId || !legs?.length) return acc;
        return {
          ...acc,
          ...legs.reduce((legsAcc, { legRef, legMutationEligibility, legMutationDetails }) => {
            if (!legRef) return legsAcc;
            const legUrn = getLegUrnForBMELeg(state, betId, Number(legRef));
            if (!legUrn) return legsAcc;

            return {
              ...legsAcc,
              [legUrn]: {
                ...state[legUrn],
                mutations: {
                  eligibility: legMutationEligibility,
                  details: legMutationDetails,
                  failure: state[legUrn].mutations?.failure,
                },
              },
            } as BetLegs;
          }, acc),
        };
      }, state);
    }
    case NETWORK__FREEZE_BET_SUCCESS: {
      const { freezeLiveDataDetails, legRef, betId } = action.payload;
      const legUrn = getLegUrnForBMELeg(state, betId, legRef);
      if (!legUrn) return state;

      const { mutations } = state[legUrn];
      if (mutations === null) {
        return state;
      }

      return {
        ...state,
        [legUrn]: {
          ...state[legUrn],
          ...{
            mutations: {
              ...mutations,
              details: [{ freezeDetails: freezeLiveDataDetails }],
              failure: undefined,
            },
          },
        },
      };
    }
    case NETWORK__FREEZE_BET_FAILURE: {
      const { legRef, betId } = action.payload;
      const legUrn = getLegUrnForBMELeg(state, betId, legRef);
      if (!legUrn) return state;

      const { mutations } = state[legUrn];
      if (mutations === null) {
        return state;
      }

      return {
        ...state,
        [legUrn]: {
          ...state[legUrn],
          ...{
            mutations: {
              ...mutations,
              failure: true,
            },
          },
        },
      };
    }
    default:
      return state;
  }
};
