import { call, cancel, takeEvery, debounce, select, spawn, take, delay } from "redux-saga/effects";
import { SagaIterator, Task } from "redux-saga";
import { getInterval } from "../config";
import { NetworkStatusUpdateAction, NETWORK_STATUS__UPDATE } from "../actions/network-status";
import { getNetworkStatus } from "../state/network-status/network-status-selectors";
import { NetworkStatus } from "../state/network-status";

type SupervisorSagaItem = { [id: string]: Task };
type SupervisorSagas = SupervisorSagaItem;

const SAGAS: SupervisorSagas = {};

function* cancelSaga(id: string): SagaIterator {
  const targetSaga = SAGAS[id];

  if (targetSaga) {
    yield cancel(targetSaga);
    delete SAGAS[id]; // eslint-disable-line @typescript-eslint/no-dynamic-delete
  }
}

function* launchSaga(sagaFn: () => Iterator<any>, id: string): SagaIterator {
  const networkStatus: NetworkStatus = yield select(getNetworkStatus);

  // if we are offline there's no need to spawn the polling saga function
  if (networkStatus === "OFFLINE") {
    return;
  }

  const targetSaga = SAGAS[id];

  // if we have the polling saga already running we should first cancel it before spawning a new one
  if (targetSaga?.isRunning()) {
    yield call(cancelSaga, id);
  }

  SAGAS[id] = yield spawn(sagaFn);
}

function* updateSagaStatus(sagaFn: () => Iterator<any>, id: string, action: NetworkStatusUpdateAction): SagaIterator {
  const { networkStatus } = action.payload;

  switch (networkStatus) {
    case "OFFLINE":
      yield call(cancelSaga, id);
      break;
    case "ONLINE":
      yield call(launchSaga, sagaFn, id);
      break;
    default:
      break;
  }
}

/**
 * Creates the supervisor saga
 *
 * @param sagaFn Saga function to be canceled or executed
 * @param id Saga function id
 * @param optionalAction Optional intercepted action that will trigger a sagaFn execution
 */
export function createSupervisor(sagaFn: () => Iterator<any>, id: string, optionalActions: string[]) {
  return function* supervisorSaga(): SagaIterator {
    yield takeEvery(NETWORK_STATUS__UPDATE, updateSagaStatus, sagaFn, id);

    if (optionalActions) {
      // immediately call the saga on the first `optionalAction` without debounce
      yield take(optionalActions);
      yield call(launchSaga, sagaFn, id);
      // delay to avoid the debounce below to trigger with the same market/action the above take already did
      yield delay(0);

      yield debounce(getInterval("POLLING_DEBOUNCE"), optionalActions, launchSaga, sagaFn, id);
    }
  };
}
