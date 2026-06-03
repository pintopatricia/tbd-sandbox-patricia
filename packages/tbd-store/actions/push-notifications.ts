import {
  LiveActivityEvent,
  RegisterOptions,
  SubscribeLiveActivity,
  Topic,
  UnsubscribeLiveActivity,
} from "../state/entities/notifications/Notifications";

export const PN_EVENT_PAGE_NOTIFICATIONS_TOGGLE = "PN_EVENT_PAGE_NOTIFICATIONS_TOGGLE";
export const PN_INTERACTION_EVENT = "PN_INTERACTION_EVENT";
export const PN_MYBETS_MULTIPLES_BELL_CLICK = "PN_MYBETS_MULTIPLES_BELL_CLICK";
export const PN_MYBETS_NOTIFICATIONS_CLOSE = "PN_MYBETS_NOTIFICATIONS_CLOSE";
export const PN_MYBETS_SAVE_CLICK = "PN_MYBETS_SAVE_CLICK";
export const PN_MYBETS_SINGLES_BELL_CLICK = "PN_MYBETS_SINGLES_BELL_CLICK";
export const PN_NATIVE_PROMPT_SHOWN_EVENT = "PN_NATIVE_PROMPT_SHOWN_EVENT";
export const PN_PARTIAL_SUBSCRIBE_EVENTS_SUCCESS = "PN_PARTIAL_SUBSCRIBE_EVENTS_SUCCESS";
export const PN_REGISTER_DEVICE = "PN_REGISTER_DEVICE";
export const PN_SUBSCRIBE_EVENTS = "PN_SUBSCRIBE_EVENTS";
export const PN_SUBSCRIBE_EVENTS_SUCCESS = "PN_SUBSCRIBE_EVENTS_SUCCESS";
export const PN_UNSUBSCRIBE_EVENTS = "PN_UNSUBSCRIBE_EVENTS";
export const PN_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS = "PN_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS";

export const LA_SUBSCRIBE_EVENTS = "LA_SUBSCRIBE_EVENTS";
export const LA_SUBSCRIBE_EVENTS_ERROR = "LA_SUBSCRIBE_EVENTS_ERROR";
export const LA_SUBSCRIBE_EVENTS_SUCCESS = "LA_SUBSCRIBE_EVENTS_SUCCESS";
export const LA_UNSUBSCRIBE_EVENTS = "LA_UNSUBSCRIBE_EVENTS";
export const LA_UNSUBSCRIBE_EVENTS_SUCCESS = "LA_UNSUBSCRIBE_EVENTS_SUCCESS";
export const LA_UNSUBSCRIBE_FINISHED_EVENTS = "LA_UNSUBSCRIBE_FINISHED_EVENTS";
export const LA_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS = "LA_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS";

type NotificationsSubscriptionRaceInteractionPayload = {
  raceUrn: string;
};

type LiveActivitiesSubscriptionFailedPayload = {
  eventId: string;
};

export type NotificationsSubscriptionEvents = {
  "@@UI/PN_INTERACTION_RACE": NotificationsSubscriptionRaceInteractionPayload;
  "@@UI/NSS_SUBSCRIPTION_FAILED": LiveActivitiesSubscriptionFailedPayload;
};

export type PNRegisterDeviceAction = {
  type: typeof PN_REGISTER_DEVICE;
  payload: {
    applicationTypeId: string;
    deviceId: string;
    deviceOptions: RegisterOptions;
  };
};

export type PNSubscribeEventsAction = {
  type: typeof PN_SUBSCRIBE_EVENTS;
  payload: {
    applicationTypeId: string;
    deviceId: string;
    locale: string;
    topics: Topic[];
    unsupportedTopics: string[];
    isSelected: boolean;
  };
};

export type LASubscribeEventsAction = {
  type: typeof LA_SUBSCRIBE_EVENTS;
  payload: {
    subscribeLiveActivity: SubscribeLiveActivity;
  };
};

export type PNSubscribeEventsSuccessAction = {
  type: typeof PN_SUBSCRIBE_EVENTS_SUCCESS;
  payload: {
    supportedEventIds: string[];
    label: string;
  };
};

export type LASubscribeEventsSuccessAction = {
  type: typeof LA_SUBSCRIBE_EVENTS_SUCCESS;
  payload: {
    liveActivityEvents: LiveActivityEvent[];
    label: string;
  };
};

export type LAUnsubscribeEventsSuccessAction = {
  type: typeof LA_UNSUBSCRIBE_EVENTS_SUCCESS;
  payload: {
    unsubscribeLiveActivity: UnsubscribeLiveActivity;
    label: string;
  };
};

export type LASubscribeEventsErrorAction = {
  type: typeof LA_SUBSCRIBE_EVENTS_ERROR;
  payload: {
    errorCode?: string;
    errorMessage?: string;
    label: string;
  };
};

export type PNPartialSubscribeEventsSuccessAction = {
  type: typeof PN_PARTIAL_SUBSCRIBE_EVENTS_SUCCESS;
  payload: {
    supportedEventIds: string[];
    unsupportedEventIds: string[];
    label: string;
  };
};

export type PNUnsupportedSubscribeEventsSuccessAction = {
  type: typeof PN_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS;
  payload: {
    unsupportedEventIds: string[];
    label: string;
  };
};

export type PNUnsubscribeEventsAction = {
  type: typeof PN_UNSUBSCRIBE_EVENTS;
  payload: {
    applicationTypeId: string;
    deviceId: string;
    topics: Topic[];
    unsupportedTopics: string[];
    isSelected: boolean;
    showToastMessage?: boolean;
  };
};

export type LAUnsubscribeEventsAction = {
  type: typeof LA_UNSUBSCRIBE_EVENTS;
  payload: {
    unsubscribeLiveActivity: UnsubscribeLiveActivity;
  };
};

export type LAUnsubscribeFinishedEventsAction = {
  type: typeof LA_UNSUBSCRIBE_FINISHED_EVENTS;
  payload: {
    liveActivityEvents: LiveActivityEvent[];
  };
};

export type PNNativePromptShownAction = {
  type: typeof PN_NATIVE_PROMPT_SHOWN_EVENT;
};

export type PNInteraction = {
  type: typeof PN_INTERACTION_EVENT;
  payload: {
    label: string;
    module: string;
  };
};

export type PNMyBetsSinglesBellClickAction = {
  type: typeof PN_MYBETS_SINGLES_BELL_CLICK;
  payload: {
    toggleOn: boolean;
    betType: string;
    sportId: string;
  };
};

export type PNMyBetsMultiplesBellClickAction = {
  type: typeof PN_MYBETS_MULTIPLES_BELL_CLICK;
  payload: {
    subscribedCount: number;
    numberOfEvents: number;
    betType: string;
  };
};

export type PNMyBetsNotificationsCloseAction = {
  type: typeof PN_MYBETS_NOTIFICATIONS_CLOSE;
  payload: {
    betType: string;
  };
};

export type PNMyBetsSaveClickAction = {
  type: typeof PN_MYBETS_SAVE_CLICK;
  payload: {
    subscribedCount: number;
    numberOfEvents: number;
    betType: string;
    sportsIds: string;
  };
};

export type PNEventPageNotificationsToggleAction = {
  type: typeof PN_EVENT_PAGE_NOTIFICATIONS_TOGGLE;
  payload: {
    isSelected: boolean;
    moduleName: string;
  };
};
