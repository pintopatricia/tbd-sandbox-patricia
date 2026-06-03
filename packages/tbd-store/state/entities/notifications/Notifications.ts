export enum Platform {
  android = "ANDROID",
  ios = "IOS",
}

export enum EventType {
  FOOTBALL = "FOOTBALL",
  TENNIS = "TENNIS",
  HORSE_RACE = "HORSE_RACE",
}

type SportIdEventTypeMapperType = (isHRThrottleActive: boolean) => {
  [sportId: number]: EventType | undefined;
};

export const createSportIdEventTypeMapper: SportIdEventTypeMapperType = (isHRThrottleActive: boolean) => ({
  1: EventType.FOOTBALL,
  ...(isHRThrottleActive ? undefined : { 7: EventType.HORSE_RACE }),
});

export enum IncidentType {
  FootballScoreChange = "FOOTBALL_SCORE_CHANGE",
  FootballFinalScore = "FOOTBALL_FINAL_SCORE",
  FootballRedCard = "FOOTBALL_RED_CARD",
  FootballKickOff = "FOOTBALL_KICK_OFF",
  FootballHalfTime = "FOOTBALL_HALF_TIME",
  FootballPenaltyShootout = "FOOTBALL_PENALTY_SHOOTOUT",
  TennisKickOff = "TENNIS_KICK_OFF",
  TennisEndOfSet = "TENNIS_END_OF_SET",
  TennisFinalResult = "TENNIS_FINAL_RESULT",
  HorseRaceKickOff = "HORSE_RACE_KICK_OFF",
  HorseRaceFinalResult = "HORSE_RACE_FINAL_RESULT",
  HorseRaceNonRunner = "HORSE_RACE_NON_RUNNER",
}

export type Topic = {
  topicId: string;
  eventType: EventType;
  incidentTypes: IncidentType[];
};

export type ApplicationDetails = {
  version: string;
  registrationCountryCode?: string;
};

export type DeviceDetails = {
  platform: Platform;
  uaChannelId: string;
  deviceToken: string;
  platformVersion?: string;
};

export type PushSubscription = {
  topic: Topic;
  applicationTypeId: string;
  deviceId: string;
  uaChannelId: string;
};

export type NotificationPreferences = {
  globalNotifications: boolean;
};

export type RegisterOptions = {
  applicationDetails?: ApplicationDetails;
  deviceDetails?: DeviceDetails;
  notificationPreferences?: NotificationPreferences;
};

export type DeviceInfo = {
  registerOptions: RegisterOptions;
  applicationTypeId: string;
  deviceId: string;
};

export type NotificationsState = {
  deviceInfo?: DeviceInfo;
  subscribedEventIds: string[];
  unsupportedEventIds: string[];
  wasNotificationNativePromptShown: boolean;
  wasNotificationHowToSubscribeEventsShown: boolean;
};

// Live Activities types
export type LiveActivityEvent = {
  pushToken: string;
  eventId: string;
};

export type SubscribeLiveActivity = {
  liveActivityEvents: LiveActivityEvent[];
  applicationTypeId: string;
  deviceId?: string;
  locale: string;
};

export type UnsubscribeLiveActivity = {
  liveActivityEvents: LiveActivityEvent[];
  applicationTypeId: string;
  deviceId?: string;
};

export type LiveActivityResponse = {
  success: boolean;
  liveActivityEvents: LiveActivityEvent[];
  errorCode?: string;
  errorMessage?: string;
};
