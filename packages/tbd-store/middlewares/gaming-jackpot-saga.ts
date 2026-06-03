import { call, takeLatest, delay, put, ForkEffect, select } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import URN from "../state/layout/URN";
import { ApplicationState } from "../state/ApplicationState.types";
import catalogueService, { CatalogueServiceLayout } from "../services/catalogue/catalogue-service";
import { getInterval } from "../config";
import {
  SUBSCRIBE_JACKPOT,
  SubscribeJackpotAction,
  UNSUBSCRIBE_JACKPOT,
  UnsubscribeJackpotAction,
  FETCH_CATALOGUE_SUCCESS,
  FetchCatalogueSuccessAction,
} from "../actions/catalogue";
import { getOverridenThrottles } from "../state/entities/throttles/throttles-selectors";

const JACKPOT_SUBSCRIPTIONS = new Set<URN>();

export function unsubscribeJackpot(action: UnsubscribeJackpotAction): void {
  JACKPOT_SUBSCRIPTIONS.delete(action.payload.urn);
}

function* updateJackpotsData(): SagaIterator {
  yield delay(0);

  while (JACKPOT_SUBSCRIPTIONS.size) {
    yield delay(getInterval("JACKPOT_ZONE"));

    if (JACKPOT_SUBSCRIPTIONS.size) {
      const throttleOverrides = yield select((state: ApplicationState) => getOverridenThrottles(state.entities));
      const router = yield select((state: ApplicationState) => state.router);

      const payload: CatalogueServiceLayout = yield call(
        catalogueService.getCards,
        Array.from(JACKPOT_SUBSCRIPTIONS),
        undefined,
        undefined,
        undefined,
        undefined,
        throttleOverrides,
        router,
        undefined,
        undefined,
      );

      yield put<FetchCatalogueSuccessAction>({
        type: FETCH_CATALOGUE_SUCCESS,
        payload,
      });
    }
  }
}

export function* subscribeJackpot(action: SubscribeJackpotAction): SagaIterator {
  JACKPOT_SUBSCRIPTIONS.add(action.payload.urn);

  yield call(updateJackpotsData);
}

export function* gamingJackpotSaga(): IterableIterator<ForkEffect> {
  yield takeLatest(SUBSCRIBE_JACKPOT, subscribeJackpot);
  yield takeLatest(UNSUBSCRIBE_JACKPOT, unsubscribeJackpot);
}
