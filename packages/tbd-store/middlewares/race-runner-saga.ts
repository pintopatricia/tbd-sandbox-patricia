import { SagaIterator } from "redux-saga";
import { call, ForkEffect, put, select, takeLatest } from "redux-saga/effects";
import { ApplicationState } from "../state/ApplicationState.types";
import catalogueService from "../services/catalogue/catalogue-service";
import { createRaceRunnerByURNSelector } from "../state/entities/race-runners/race-runners-selectors";
import {
  EXPAND_RACE_RUNNER,
  ExpandRaceRunnerAction,
  FetchRaceRunnerPastPerformancesFailureAction,
  FetchRaceRunnerPastPerformancesSuccessAction,
  NETWORK__FETCH_RACE_RUNNER_PAST_PERFORMANCES_FAILURE,
  NETWORK__FETCH_RACE_RUNNER_PAST_PERFORMANCES_SUCCESS,
} from "../actions/racerunner";
import { getOverridenThrottles } from "../state/entities/throttles/throttles-selectors";

const getRaceRunnerByURN = createRaceRunnerByURNSelector();

export function* fetchRaceRunner(action: ExpandRaceRunnerAction): SagaIterator {
  const urns = action.payload;
  const urnsToRequest: string[] = [];

  for (let i = 0, { length } = urns; i < length; i += 1) {
    const raceRunner = yield select((state: ApplicationState) =>
      getRaceRunnerByURN(state.entities.racerunners, urns[i]),
    );
    if (!raceRunner.horse.pastPerformances) {
      urnsToRequest.push(urns[i]);
    }
  }

  if (urnsToRequest.length) {
    try {
      const throttleOverrides = yield select((state: ApplicationState) => getOverridenThrottles(state.entities));
      const payload = yield call(catalogueService.getRaceRunnersPastPerformances, urnsToRequest, throttleOverrides);

      yield put<FetchRaceRunnerPastPerformancesSuccessAction>({
        type: NETWORK__FETCH_RACE_RUNNER_PAST_PERFORMANCES_SUCCESS,
        payload,
      });
    } catch (e) {
      if (e instanceof Error) {
        yield put<FetchRaceRunnerPastPerformancesFailureAction>({
          type: NETWORK__FETCH_RACE_RUNNER_PAST_PERFORMANCES_FAILURE,
          error: e.message,
        });
      } else {
        yield put<FetchRaceRunnerPastPerformancesFailureAction>({
          type: NETWORK__FETCH_RACE_RUNNER_PAST_PERFORMANCES_FAILURE,
          error: `Unknown error ${e}`,
        });
      }
    }
  }
}

/**
 * Saga to apply effects related to the racerunner entity
 * Currently takes every `EXPAND_RACE_RUNNER` action and triggers a Catalogue request PastPerformances slice
 */
export function* raceRunnerSaga(): IterableIterator<ForkEffect> {
  yield takeLatest(EXPAND_RACE_RUNNER, fetchRaceRunner);
}
