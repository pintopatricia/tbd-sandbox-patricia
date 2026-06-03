import {
  FETCH_CATALOGUE_SUCCESS,
  FetchCatalogueSuccessAction,
  NETWORK__SBK_MARKETS_SUCCESS,
  SportsbookMarketsSuccessAction,
} from "../../../actions/catalogue";
import { FetchRaceRunnerPastPerformancesSuccessAction } from "../../../actions/racerunner";
import { GreyhoundRaceRunners } from "../index";

type ActionTypes =
  | SportsbookMarketsSuccessAction
  | FetchCatalogueSuccessAction
  | FetchRaceRunnerPastPerformancesSuccessAction;

/** **********************
 *  GreyhoundRaceRunners reducer  *
 *********************** */
export default (currentState: undefined | GreyhoundRaceRunners, action: ActionTypes): GreyhoundRaceRunners => {
  const state = currentState || {};

  switch (action.type) {
    case NETWORK__SBK_MARKETS_SUCCESS:
    case FETCH_CATALOGUE_SUCCESS: {
      const greyhoundRaceRunners = action.payload.data.GreyhoundRaceRunner || [];

      return greyhoundRaceRunners.reduce(
        (acc, runner) => ({
          ...acc,
          [runner.urn]: {
            ...state[runner.urn],
            ...runner,
          },
        }),
        state,
      );
    }

    default:
      return state;
  }
};
