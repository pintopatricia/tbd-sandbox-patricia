import { call, put, select, take, takeLatest } from "redux-saga/effects";
import { EventChannel, eventChannel, SagaIterator } from "redux-saga";
import { TopicMessage } from "@ppb/onsite-gateway-client";
import {
  ReceiveLoyaltyMessageAction,
  LOYALTY__RECEIVE_MESSAGE,
  AcknowledgeLoyaltyMessageAction,
  LOYALTY__ACKNOWLEDGE_MESSAGE,
} from "../actions/loyalty-messaging";
import { getUserDetails } from "../state/entities/user-details/user-details-selectors";
import { PAGE_LOAD_SUCCESS } from "../actions/catalogue";
import { APP_VISIBILITY_CHANGE, AppVisibilityChangeAction } from "../actions/interface";
import {
  OSG__CONNECTION_FAILED,
  OSG__SUBSCRIPTION_FAILED,
  OSG__SUBSCRIPTION_SUCCEEDED,
  OSGConnectionFailedAction,
  OSGSubscriptionFailedAction,
  OSGSubscriptionSucceededAction,
} from "../actions/onsite-gateway";
import {
  acknowledgeMessageCallback,
  appVisibilityChangeCallback,
  ensureConnection,
  getConnection,
  subscribeToTopic,
  unsubscribeFromTopic,
} from "./onsite-gateway-connection";

export const OSG_RELEVANT_MESSAGING = "relevantMessaging";

export function createLoyaltyMessagingChannel(): EventChannel<
  ReceiveLoyaltyMessageAction | OSGSubscriptionSucceededAction | OSGSubscriptionFailedAction
> | null {
  return eventChannel((emitter) => {
    const onMessage = (receivedMessage: TopicMessage): void =>
      emitter({
        type: LOYALTY__RECEIVE_MESSAGE,
        payload: {
          content: receivedMessage,
          acknowledged: false,
          isDisplayed: true,
        },
      });

    subscribeToTopic(OSG_RELEVANT_MESSAGING, onMessage)
      .then(() =>
        emitter({
          type: OSG__SUBSCRIPTION_SUCCEEDED,
        }),
      )
      .catch(() =>
        emitter({
          type: OSG__SUBSCRIPTION_FAILED,
        }),
      );

    return () => {
      unsubscribeFromTopic(OSG_RELEVANT_MESSAGING, onMessage).catch((error) => {
        console.error("Failed to unsubscribe from OSG topic", error);
      });
    };
  });
}

export function* connectToLoyaltyService(): SagaIterator {
  try {
    const { loggedIn } = yield select(getUserDetails);

    if (loggedIn) {
      yield call(ensureConnection);
      const channel = yield call(createLoyaltyMessagingChannel);

      while (getConnection()) {
        const socketAction = yield take(channel);

        yield put(socketAction);
      }
    }
  } catch (error) {
    console.error("OSG connection error", error);

    yield put<OSGConnectionFailedAction>({ type: OSG__CONNECTION_FAILED });
  }
}

export function* acknowledgeMessage(action: AcknowledgeLoyaltyMessageAction): SagaIterator {
  yield call(acknowledgeMessageCallback, action.payload);
}

export function* appVisibilityChange(action: AppVisibilityChangeAction): SagaIterator {
  yield call(appVisibilityChangeCallback, action.payload.visible);
}

export function* loyaltyMessagingSaga(): SagaIterator {
  yield takeLatest(PAGE_LOAD_SUCCESS, connectToLoyaltyService);
  yield takeLatest(LOYALTY__ACKNOWLEDGE_MESSAGE, acknowledgeMessage);
  yield takeLatest(APP_VISIBILITY_CHANGE, appVisibilityChange);
}
