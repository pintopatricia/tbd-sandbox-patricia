import { call, put, select, takeLatest } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import { codecs } from "@ppb/tbd-urn-codecs";
import { ApplicationState } from "../state/ApplicationState.types";
import {
  FetchWebMessagesAction,
  FetchWebMessagesSuccessAction,
  FETCH_WEB_MESSAGES_SUCCESS,
  ReadWebMessageAction,
  ReadWebMessageSuccessAction,
  READ_WEB_MESSAGE_SUCCESS,
  ReadWebMessageFailureAction,
  READ_WEB_MESSAGE_FAILURE,
  FETCH_WEB_MESSAGES,
  READ_WEB_MESSAGE,
  WebMessagesModuleLoadedAction,
  WEB_MESSAGES_MODULE_LOADED,
} from "../actions/catalogue";
import { getUserDetails } from "../state/entities/user-details/user-details-selectors";
import catalogueService from "../services/catalogue/catalogue-service";
import { getOverridenThrottles } from "../state/entities/throttles/throttles-selectors";

function* fetchWebMessagesRequest(action: FetchWebMessagesAction): SagaIterator {
  const { loggedIn } = yield select((state: ApplicationState) => getUserDetails(state));

  if (action.payload.postLoginSession && loggedIn) {
    const throttleOverrides = yield select((state: ApplicationState) => getOverridenThrottles(state.entities));
    const payload = yield call(catalogueService.getWebMessages, throttleOverrides);
    if (payload !== null) {
      yield put<FetchWebMessagesSuccessAction>({
        type: FETCH_WEB_MESSAGES_SUCCESS,
        payload,
      });
    }
  }
}

function* readWebMessageRequest(action: ReadWebMessageAction): SagaIterator {
  try {
    const customerMessageId = codecs.webMessage.decode(action.payload.customerMessageId);
    if (customerMessageId) {
      const throttleOverrides = yield select((state: ApplicationState) => getOverridenThrottles(state.entities));
      yield call(catalogueService.readWebMessage, parseInt(customerMessageId, 10), throttleOverrides);
    }
    yield put<ReadWebMessageSuccessAction>({
      type: READ_WEB_MESSAGE_SUCCESS,
    });
  } catch {
    yield put<ReadWebMessageFailureAction>({
      type: READ_WEB_MESSAGE_FAILURE,
    });
  }
}

export function* webMessagesRequestSaga(): SagaIterator {
  yield put<WebMessagesModuleLoadedAction>({
    type: WEB_MESSAGES_MODULE_LOADED,
  });
  yield takeLatest(FETCH_WEB_MESSAGES, fetchWebMessagesRequest);
  yield takeLatest(READ_WEB_MESSAGE, readWebMessageRequest);
}
