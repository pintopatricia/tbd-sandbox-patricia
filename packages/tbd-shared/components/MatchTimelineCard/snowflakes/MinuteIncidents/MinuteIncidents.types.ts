import { CardNotificationProps } from "./snowflakes/CardNotification/CardNotification.types";
import { GoalNotificationProps } from "./snowflakes/GoalNotification/GoalNotification.types";
import { MatchTimelineNotificationProps } from "./snowflakes/TimelineNotification/Notification.types";
import { SubstitutionNotificationProps } from "./snowflakes/SubstitutionNotification/SubstitutionNotification.types";
import { TeamNotificationProps } from "./snowflakes/TeamNotification/TeamNotification.types";

export enum MinuteIncidentsEventType {
  CARD = "CARD",
  GOAL = "GOAL",
  SUBSTITUTION = "SUBSTITUTION",
  TEAM = "TEAM",
  NOTIFICATION = "NOTIFICATION",
}

export type MinuteIncidentsEventProps =
  | CardNotificationProps
  | GoalNotificationProps
  | SubstitutionNotificationProps
  | TeamNotificationProps
  | MatchTimelineNotificationProps;

export type MinuteIncidentsType = {
  notificationEventType: MinuteIncidentsEventType;
  notificationEventProps: MinuteIncidentsEventProps;
};

export type MinuteIncidentsProps = {
  minute: number;
  extraTimeMinute?: number;
  events: MinuteIncidentsType[];
};
