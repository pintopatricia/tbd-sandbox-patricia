import { call, put, takeEvery } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";

import betMutationsService from "../services/bet-mutations-service";
import {
  FreezeLegAction,
  FreezeLegFailureAction,
  FreezeLegSuccessAction,
  NETWORK__FREEZE_BET,
  NETWORK__FREEZE_BET_FAILURE,
  NETWORK__FREEZE_BET_SUCCESS,
} from "../actions/bet-mutation";

function* freezeBet(action: FreezeLegAction): SagaIterator {
  const { betId, legRef } = action.payload;

  try {
    const { respStatus, freezeLiveDataDetails } = yield call(betMutationsService.freezeBet, betId, [`${legRef}`]);

    if (respStatus === "SUCCESS") {
      yield put<FreezeLegSuccessAction>({
        type: NETWORK__FREEZE_BET_SUCCESS,
        payload: {
          betId,
          legRef,
          respStatus,
          freezeLiveDataDetails,
        },
      });
    } else {
      yield put<FreezeLegFailureAction>({
        type: NETWORK__FREEZE_BET_FAILURE,
        payload: {
          betId,
          legRef,
        },
      });
    }
  } catch {
    yield put<FreezeLegFailureAction>({
      type: NETWORK__FREEZE_BET_FAILURE,
      payload: {
        betId,
        legRef,
      },
    });
  }
}

export function* betMutationsSaga(): SagaIterator {
  yield takeEvery(NETWORK__FREEZE_BET, freezeBet);
}
