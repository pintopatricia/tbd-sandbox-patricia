import { SagaIterator } from "redux-saga";
import { call, put, takeLatest, select } from "redux-saga/effects";

import { buildGetCombinationsPayload } from "@ppb/betslip-core";
import { CombinationResult } from "@flutter-global/uki-channels-http-clients/src/clients/BetCombinationEngineService/BetCombinationEngineService";
import { ApplicationState } from "../state/ApplicationState.types";

import { getSportsbookBettingState } from "../state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { getCombinationsList } from "../services/bet-combination-engine-service";
import {
  OpenCombinationsListAction,
  FetchCombinationsListInProgressAction,
  FetchCombinationsListSuccessAction,
  FetchCombinationsListFailureAction,
  UI__OPEN_COMBINATIONS_LIST,
  NETWORK__FETCH_COMBINATIONS_LIST_IN_PROGRESS,
  NETWORK__FETCH_COMBINATIONS_LIST_SUCCESS,
  NETWORK__FETCH_COMBINATIONS_LIST_FAILURE,
} from "../actions/betslip";
import { SportsbookBettingState } from "../state/betting/sportsbook-betting/SportsbookBetting.types";

function* fetchCombinationsList({
  payload: { combinationId, maxCombinations },
}: OpenCombinationsListAction): SagaIterator {
  yield put<FetchCombinationsListInProgressAction>({
    type: NETWORK__FETCH_COMBINATIONS_LIST_IN_PROGRESS,
  });

  const group: SportsbookBettingState = yield select((state: ApplicationState) => getSportsbookBettingState(state));

  const payload = buildGetCombinationsPayload(group, combinationId, { maxCombinations });
  if (!payload) {
    return yield put<FetchCombinationsListFailureAction>({
      type: NETWORK__FETCH_COMBINATIONS_LIST_FAILURE,
      payload: { error: "Failed to build getCombinations payload" },
    });
  }

  let response: CombinationResult;
  try {
    response = yield call(getCombinationsList, payload);
  } catch (error) {
    return yield put<FetchCombinationsListFailureAction>({
      type: NETWORK__FETCH_COMBINATIONS_LIST_FAILURE,
      payload: {
        error: error instanceof Error ? error.message : "unexpected error when fetching combinations list",
      },
    });
  }

  return yield put<FetchCombinationsListSuccessAction>({
    type: NETWORK__FETCH_COMBINATIONS_LIST_SUCCESS,
    payload: { combinationId, response },
  });
}

export function* combinationsListSaga(): SagaIterator {
  yield takeLatest(UI__OPEN_COMBINATIONS_LIST, fetchCombinationsList);
}
