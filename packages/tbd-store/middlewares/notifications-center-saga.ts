import { call, debounce, put, select, take, takeLatest } from "redux-saga/effects";
import { EventChannel, eventChannel, SagaIterator } from "redux-saga";
import notificationCenterService from "../services/notification-center-service";
import { PAGE_LOAD_SUCCESS } from "../actions/catalogue";
import {
  FetchUnreadNotificationsAction,
  NETWORK__UNREAD_NOTIFICATIONS_FAILURE,
  UnreadNotificationsFailureAction,
  UnreadNotificationsSuccessAction,
  NETWORK__FETCH_UNREAD_NOTIFICATIONS,
  NETWORK__UNREAD_NOTIFICATIONS_SUCCESS,
} from "../actions/notifications-center";
import { APP_VISIBILITY_CHANGE, AppVisibilityChangeAction } from "../actions/interface";
import {
  appVisibilityChangeCallback,
  ensureConnection,
  getConnection,
  subscribeToTopic,
  unsubscribeFromTopic,
} from "./onsite-gateway-connection";
import {
  OSG__SUBSCRIPTION_FAILED,
  OSG__SUBSCRIPTION_SUCCEEDED,
  OSG__CONNECTION_FAILED,
  OSGConnectionFailedAction,
  OSGSubscriptionFailedAction,
  OSGSubscriptionSucceededAction,
} from "../actions/onsite-gateway";
import { getUserDetails } from "../state/entities/user-details/user-details-selectors";
import { getThrottles } from "../state";

export const OSG_NOTIFICATION_MESSAGING = "notificationMessaging";

function* isNotificationCenterEnabled(): SagaIterator {
  const isEnabled: boolean = (yield select(getThrottles))?.["ENABLE_NOTIFICATION_CENTER"]?.isActive;
  const { loggedIn } = yield select(getUserDetails);

  return isEnabled && loggedIn;
}

export function createNotificationCenterChannel(): EventChannel<
  FetchUnreadNotificationsAction | OSGSubscriptionSucceededAction | OSGSubscriptionFailedAction
> {
  return eventChannel((emitter) => {
    const onMessage = (): void =>
      emitter({
        type: NETWORK__FETCH_UNREAD_NOTIFICATIONS,
      });

    subscribeToTopic(OSG_NOTIFICATION_MESSAGING, onMessage)
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
      unsubscribeFromTopic(OSG_NOTIFICATION_MESSAGING, onMessage).catch((error) => {
        console.error("Failed to unsubscribe from OSG topic", error);
      });
    };
  });
}

export function* connectToNotificationService(): SagaIterator {
  if (!(yield call(isNotificationCenterEnabled))) return;

  try {
    yield call(ensureConnection);
    const channel = yield call(createNotificationCenterChannel);

    while (getConnection()) {
      const socketAction = yield take(channel);

      yield put(socketAction);
    }
  } catch (error) {
    console.error("OSG connection error", error);

    yield put<OSGConnectionFailedAction>({ type: OSG__CONNECTION_FAILED });
  }
}

function* fetchUnreadNotifications(): SagaIterator {
  if (!(yield call(isNotificationCenterEnabled))) return;

  try {
    const { unreadCount } = yield call(notificationCenterService.retrieveCount);

    yield put<UnreadNotificationsSuccessAction>({
      type: NETWORK__UNREAD_NOTIFICATIONS_SUCCESS,
      payload: { unreadNotificationsCount: unreadCount },
    });
  } catch (error) {
    console.error("Error fetching notifications", error);

    yield put<UnreadNotificationsFailureAction>({
      type: NETWORK__UNREAD_NOTIFICATIONS_FAILURE,
    });
  }
}

export function* appVisibilityChange(action: AppVisibilityChangeAction): SagaIterator {
  if (!(yield call(isNotificationCenterEnabled))) return;

  const visible = action.payload.visible;

  yield call(appVisibilityChangeCallback, visible);

  if (visible) {
    yield put({ type: NETWORK__FETCH_UNREAD_NOTIFICATIONS });
  }
}

export function* notificationCenterSaga(): SagaIterator {
  yield takeLatest(PAGE_LOAD_SUCCESS, connectToNotificationService);
  yield takeLatest(PAGE_LOAD_SUCCESS, fetchUnreadNotifications);
  yield takeLatest(APP_VISIBILITY_CHANGE, appVisibilityChange);
  yield debounce(500, NETWORK__FETCH_UNREAD_NOTIFICATIONS, fetchUnreadNotifications);
}
