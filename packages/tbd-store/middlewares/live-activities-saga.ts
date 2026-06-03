import { ForkEffect, call, put, select, takeEvery } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import { getEventRegistry } from "eventemitter3-singleton";
import {
  LA_SUBSCRIBE_EVENTS,
  LASubscribeEventsAction,
  LA_UNSUBSCRIBE_EVENTS,
  LAUnsubscribeEventsAction,
  LA_SUBSCRIBE_EVENTS_SUCCESS,
  LASubscribeEventsSuccessAction,
  LA_SUBSCRIBE_EVENTS_ERROR,
  LASubscribeEventsErrorAction,
  LA_UNSUBSCRIBE_FINISHED_EVENTS,
  LAUnsubscribeFinishedEventsAction,
  LA_UNSUBSCRIBE_EVENTS_SUCCESS,
  LAUnsubscribeEventsSuccessAction,
  NotificationsSubscriptionEvents,
} from "../actions/push-notifications";
import notificationSubscriptionService from "../services/notification-subscription-service";
import { LiveActivityResponse } from "../state/entities/notifications/Notifications";
import { ApplicationState } from "../state";
import { getUserDetails } from "../state/entities/user-details/user-details-selectors";

const { emit } = getEventRegistry<NotificationsSubscriptionEvents>();

export function* handleSubscribeLiveActivity(action: LASubscribeEventsAction): SagaIterator {
  try {
    const liveActivityResponse: LiveActivityResponse = yield call(
      notificationSubscriptionService.subscribeLiveActivity,
      action.payload.subscribeLiveActivity,
    );

    const { success, liveActivityEvents, errorCode, errorMessage } = liveActivityResponse;

    if (success && liveActivityEvents.length) {
      yield put<LASubscribeEventsSuccessAction>({
        type: LA_SUBSCRIBE_EVENTS_SUCCESS,
        payload: {
          liveActivityEvents,
          label: "Live Alerts Enabled",
        },
      });
    } else {
      emit("@@UI/NSS_SUBSCRIPTION_FAILED", {
        eventId: action.payload.subscribeLiveActivity.liveActivityEvents[0]?.eventId,
      });
      yield put<LASubscribeEventsErrorAction>({
        type: LA_SUBSCRIBE_EVENTS_ERROR,
        payload: {
          errorCode,
          errorMessage,
          label: "Live Alerts Error",
        },
      });
    }
  } catch (e) {
    console.error(e);
    emit("@@UI/NSS_SUBSCRIPTION_FAILED", {
      eventId: action.payload.subscribeLiveActivity.liveActivityEvents[0]?.eventId,
    });
  }
}

export function* handleUnsubscribeLiveActivity(action: LAUnsubscribeEventsAction): SagaIterator {
  const { unsubscribeLiveActivity } = action.payload;

  try {
    yield call(notificationSubscriptionService.unsubscribeLiveActivity, unsubscribeLiveActivity);
  } catch (e) {
    console.error(e);
  }

  // Event if NSS fails, it won't be on Native Module anymore
  yield put<LAUnsubscribeEventsSuccessAction>({
    type: LA_UNSUBSCRIBE_EVENTS_SUCCESS,
    payload: {
      unsubscribeLiveActivity,
      label: "Live Alerts Disabled",
    },
  });
}

export function* handleUnsubscribeFinishedLiveActivities(action: LAUnsubscribeFinishedEventsAction): SagaIterator {
  const { applicationTypeId, deviceId } = yield select((state: ApplicationState) => getUserDetails(state)) ?? {};

  if (applicationTypeId && deviceId) {
    const unsubscribeLiveActivity = {
      liveActivityEvents: action.payload.liveActivityEvents,
      applicationTypeId,
      deviceId,
    };

    try {
      yield call(notificationSubscriptionService.unsubscribeLiveActivity, unsubscribeLiveActivity);
    } catch (e) {
      console.error(e);
    }
  }
}

export function* liveActivitiesSaga(): IterableIterator<ForkEffect> {
  yield takeEvery(LA_SUBSCRIBE_EVENTS, handleSubscribeLiveActivity);
  yield takeEvery(LA_UNSUBSCRIBE_EVENTS, handleUnsubscribeLiveActivity);
  yield takeEvery(LA_UNSUBSCRIBE_FINISHED_EVENTS, handleUnsubscribeFinishedLiveActivities);
}
