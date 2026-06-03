import { HorsePerformance, RaceRunners } from "../index";
import {
  FETCH_CATALOGUE_SUCCESS,
  FetchCatalogueSuccessAction,
  NETWORK__SBK_MARKETS_SUCCESS,
  SportsbookMarketsSuccessAction,
} from "../../../actions/catalogue";
import {
  FetchRaceRunnerPastPerformancesSuccessAction,
  NETWORK__FETCH_RACE_RUNNER_PAST_PERFORMANCES_SUCCESS,
} from "../../../actions/racerunner";
import URN from "../../layout/URN";

type ActionTypes =
  | SportsbookMarketsSuccessAction
  | FetchCatalogueSuccessAction
  | FetchRaceRunnerPastPerformancesSuccessAction;

/** **********************
 *  RaceRunners reducer  *
 *********************** */
export default (currentState: undefined | RaceRunners, action: ActionTypes): RaceRunners => {
  const state = currentState || {};

  switch (action.type) {
    case NETWORK__SBK_MARKETS_SUCCESS:
    case FETCH_CATALOGUE_SUCCESS: {
      const racerunners = action.payload.data.RaceRunner || [];

      return racerunners.reduce(
        (acc, racerunner) => ({
          ...acc,
          [racerunner.urn]: {
            ...state[racerunner.urn],
            ...racerunner,
            horse: {
              ...state[racerunner.urn]?.horse,
              ...racerunner.horse,
            },
          },
        }),
        state,
      );
    }
    case NETWORK__FETCH_RACE_RUNNER_PAST_PERFORMANCES_SUCCESS: {
      if (!action.payload) return state;

      return Object.entries(action.payload).reduce(
        (acc, entry) => {
          const [urn, pastPerformances]: [URN, HorsePerformance[]] = entry;

          return {
            ...acc,
            [urn]: {
              ...state[urn],
              horse: {
                ...state[urn].horse,
                pastPerformances,
              },
            },
          };
        },
        { ...state },
      );
    }

    default:
      return state;
  }
};
