import { NotificationsState } from "./Notifications";

import {
  PNNativePromptShownAction,
  PNPartialSubscribeEventsSuccessAction,
  PNRegisterDeviceAction,
  PNSubscribeEventsAction,
  PNSubscribeEventsSuccessAction,
  PNUnsubscribeEventsAction,
  PNUnsupportedSubscribeEventsSuccessAction,
  PN_NATIVE_PROMPT_SHOWN_EVENT,
  PN_PARTIAL_SUBSCRIBE_EVENTS_SUCCESS,
  PN_REGISTER_DEVICE,
  PN_SUBSCRIBE_EVENTS_SUCCESS,
  PN_UNSUBSCRIBE_EVENTS,
  PN_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS,
} from "../../../actions/push-notifications";

import { NavigateToEventViewFirstTime, UI__NAVIGATE_TO_EVENT_FIRST_TIME } from "../../../actions/navigation";

type ActionTypes =
  | PNRegisterDeviceAction
  | PNSubscribeEventsAction
  | PNSubscribeEventsSuccessAction
  | PNPartialSubscribeEventsSuccessAction
  | PNUnsupportedSubscribeEventsSuccessAction
  | PNUnsubscribeEventsAction
  | PNNativePromptShownAction
  | NavigateToEventViewFirstTime;

const INITIAL_STATE = {
  subscribedEventIds: [],
  unsupportedEventIds: [],
  wasNotificationNativePromptShown: false,
  wasNotificationHowToSubscribeEventsShown: false,
};

/** **********************
 *  Notifications reducer  *
 *********************** */
export default (currentState: undefined | NotificationsState, action: ActionTypes): NotificationsState => {
  const state: NotificationsState = currentState || INITIAL_STATE;

  switch (action.type) {
    case PN_REGISTER_DEVICE: {
      return {
        ...state,
        deviceInfo: {
          registerOptions: action.payload.deviceOptions,
          applicationTypeId: action.payload.applicationTypeId,
          deviceId: action.payload.deviceId,
        },
      };
    }

    case PN_SUBSCRIBE_EVENTS_SUCCESS: {
      const { supportedEventIds } = action.payload;
      const newEventIds: string[] = supportedEventIds.filter(
        (supportedEventId) => !state.subscribedEventIds.includes(supportedEventId),
      );

      return {
        ...state,
        subscribedEventIds: [...state.subscribedEventIds, ...newEventIds],
      };
    }

    case PN_PARTIAL_SUBSCRIBE_EVENTS_SUCCESS: {
      const { supportedEventIds, unsupportedEventIds } = action.payload;
      const newEventIds: string[] = supportedEventIds.filter(
        (supportedEventId) => !state.subscribedEventIds.includes(supportedEventId),
      );
      const newUnsupportedEventIds: string[] = unsupportedEventIds.filter(
        (unsupportedEventId) =>
          !state.subscribedEventIds.includes(unsupportedEventId) &&
          !state.unsupportedEventIds.includes(unsupportedEventId),
      );

      return {
        ...state,
        subscribedEventIds: [...state.subscribedEventIds, ...newEventIds],
        unsupportedEventIds: [...state.unsupportedEventIds, ...newUnsupportedEventIds],
      };
    }

    case PN_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS: {
      const { unsupportedEventIds } = action.payload;
      const newUnsupportedEventIds: string[] = unsupportedEventIds.filter(
        (unsupportedEventId) =>
          !state.subscribedEventIds.includes(unsupportedEventId) &&
          !state.unsupportedEventIds.includes(unsupportedEventId),
      );

      return {
        ...state,
        unsupportedEventIds: [...state.unsupportedEventIds, ...newUnsupportedEventIds],
      };
    }

    case PN_UNSUBSCRIBE_EVENTS: {
      const { subscribedEventIds, unsupportedEventIds } = state;
      const { topics, unsupportedTopics } = action.payload;

      topics.forEach((topic) => {
        // subscribed events
        let eventIdIndex = subscribedEventIds.indexOf(topic.topicId);
        if (eventIdIndex !== -1) subscribedEventIds.splice(eventIdIndex, 1);

        // unsupported events (the user can unsubscribe unsupported event ids from multiples betslip receipt)
        eventIdIndex = unsupportedEventIds.indexOf(topic.topicId);
        if (eventIdIndex !== -1) unsupportedEventIds.splice(eventIdIndex, 1);
      });

      unsupportedTopics.forEach((topic) => {
        // subscribed events
        let eventIdIndex = subscribedEventIds.indexOf(topic);
        if (eventIdIndex !== -1) subscribedEventIds.splice(eventIdIndex, 1);

        // unsupported events (the user can unsubscribe unsupported event ids from multiples betslip receipt)
        eventIdIndex = unsupportedEventIds.indexOf(topic);
        if (eventIdIndex !== -1) unsupportedEventIds.splice(eventIdIndex, 1);
      });

      return {
        ...state,
        subscribedEventIds: [...subscribedEventIds],
        unsupportedEventIds: [...unsupportedEventIds],
      };
    }

    case PN_NATIVE_PROMPT_SHOWN_EVENT:
      return { ...state, wasNotificationNativePromptShown: true };

    case UI__NAVIGATE_TO_EVENT_FIRST_TIME:
      return { ...state, wasNotificationHowToSubscribeEventsShown: true };

    default:
      return state;
  }
};
