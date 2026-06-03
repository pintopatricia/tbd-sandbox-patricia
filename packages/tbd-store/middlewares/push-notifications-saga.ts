import { ForkEffect, call, put, debounce, takeLeading, select } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import { ApplicationState } from "../state/ApplicationState.types";
import {
  PN_REGISTER_DEVICE,
  PN_SUBSCRIBE_EVENTS,
  PN_UNSUBSCRIBE_EVENTS,
  PNRegisterDeviceAction,
  PNSubscribeEventsAction,
  PNUnsubscribeEventsAction,
  PNSubscribeEventsSuccessAction,
  PN_SUBSCRIBE_EVENTS_SUCCESS,
  PN_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS,
  PNUnsupportedSubscribeEventsSuccessAction,
  PNPartialSubscribeEventsSuccessAction,
  PN_PARTIAL_SUBSCRIBE_EVENTS_SUCCESS,
} from "../actions/push-notifications";
import notificationSubscriptionService from "../services/notification-subscription-service";
import { createIsEventSubscribedByEventIdSelector } from "../state/entities/notifications/notifications-selectors";

const isEventSubscribedByEventId = createIsEventSubscribedByEventIdSelector();

export function* handleRegisterDevice(action: PNRegisterDeviceAction): SagaIterator {
  try {
    yield call(
      notificationSubscriptionService.register,
      action.payload.applicationTypeId,
      action.payload.deviceId,
      action.payload.deviceOptions,
    );
  } catch (e) {
    console.error(e);
  }
}

export function* handleSubscribeEvents(action: PNSubscribeEventsAction): SagaIterator {
  try {
    const subscriptions = yield call(
      notificationSubscriptionService.subscribeToEvents,
      action.payload.applicationTypeId,
      action.payload.deviceId,
      action.payload.locale,
      action.payload.topics,
    );

    // the event ids the user subscribed
    const subscribedEventIds: string[] = [...new Set<string>(action.payload.topics.map((topic) => topic.topicId))];

    // the event ids supported by NSS (returned from response)
    let supportedEventIds: string[] = [
      ...new Set<string>(subscriptions.map((subscription: { topicId: string }) => subscription.topicId)),
    ];

    // adds event ids already subscribed (since already subscribed events are not returned from response)
    const previouslySubscribedEventIds = yield select((state: ApplicationState) =>
      subscribedEventIds.filter((subscribedEventId) =>
        isEventSubscribedByEventId(state.entities.notifications, subscribedEventId),
      ),
    );
    supportedEventIds = [...new Set<string>(supportedEventIds.concat(previouslySubscribedEventIds))];

    // the event ids not supported by NSS (not returned from response)
    const unsupportedEventIdsFromNss: string[] = subscribedEventIds.filter(
      (subscribedEventId) => !supportedEventIds.includes(subscribedEventId),
    );

    const unsupportedEventIds = [...unsupportedEventIdsFromNss, ...action.payload.unsupportedTopics];

    if (supportedEventIds.length && !unsupportedEventIds.length) {
      yield put<PNSubscribeEventsSuccessAction>({
        type: PN_SUBSCRIBE_EVENTS_SUCCESS,
        payload: {
          supportedEventIds,
          label: "enabled live alerts",
        },
      });
    } else if (supportedEventIds.length && unsupportedEventIds.length) {
      yield put<PNPartialSubscribeEventsSuccessAction>({
        type: PN_PARTIAL_SUBSCRIBE_EVENTS_SUCCESS,
        payload: {
          supportedEventIds,
          unsupportedEventIds,
          label: "partial live alerts",
        },
      });
    } else if (!supportedEventIds.length && unsupportedEventIds.length) {
      yield put<PNUnsupportedSubscribeEventsSuccessAction>({
        type: PN_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS,
        payload: {
          unsupportedEventIds,
          label: "there are no notifications available",
        },
      });
    }
  } catch (e) {
    console.error(e);  
  }
}

export function* handleUnsubscribeEvents(action: PNUnsubscribeEventsAction): SagaIterator {
  try {
    yield call(
      notificationSubscriptionService.unsubscribeFromEvents,
      action.payload.applicationTypeId,
      action.payload.deviceId,
      action.payload.topics,
    );
  } catch (e) {
    console.error(e);
  }
}

export function* pushNotificationsSaga(): IterableIterator<ForkEffect> {
  yield debounce(250, PN_REGISTER_DEVICE, handleRegisterDevice);
  yield takeLeading(PN_SUBSCRIBE_EVENTS, handleSubscribeEvents);
  yield takeLeading(PN_UNSUBSCRIBE_EVENTS, handleUnsubscribeEvents);
}
