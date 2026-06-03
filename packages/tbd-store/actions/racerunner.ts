import { HorsePerformance } from "../state/entities";
import URN from "../state/layout/URN";

export const EXPAND_RACE_RUNNER = "EXPAND_RACE_RUNNER";
export const NETWORK__FETCH_RACE_RUNNER_PAST_PERFORMANCES_SUCCESS =
  "NETWORK/FETCH_RACE_RUNNER_PAST_PERFORMANCES_SUCCESS";
export const NETWORK__FETCH_RACE_RUNNER_PAST_PERFORMANCES_FAILURE =
  "NETWORK/FETCH_RACE_RUNNER_PAST_PERFORMANCES_FAILURE";

export type ExpandRaceRunnerAction = {
  type: typeof EXPAND_RACE_RUNNER;
  payload: URN[];
};

export type FetchRaceRunnerPastPerformancesSuccessAction = {
  type: typeof NETWORK__FETCH_RACE_RUNNER_PAST_PERFORMANCES_SUCCESS;
  payload: { [urn: string]: HorsePerformance[] };
};

export type FetchRaceRunnerPastPerformancesFailureAction = {
  type: typeof NETWORK__FETCH_RACE_RUNNER_PAST_PERFORMANCES_FAILURE;
  error: string;
};
