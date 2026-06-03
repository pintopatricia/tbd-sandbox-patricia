import type { JSX } from "react";
import { FunctionComponent } from "react";
import { View } from "react-native";

import { FixtureTeamSide } from "@ppb/the-wall-common/types";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import { Text } from "@ppb/the-wall-native";
import { CardNotificationProps } from "./snowflakes/CardNotification/CardNotification.types";
import { CardNotification } from "./snowflakes/CardNotification/CardNotification.native";
import { GoalNotificationProps } from "./snowflakes/GoalNotification/GoalNotification.types";
import { GoalNotification } from "./snowflakes/GoalNotification/GoalNotification.native";
import { MatchTimelineNotificationProps } from "./snowflakes/TimelineNotification/Notification.types";
import { Notification } from "./snowflakes/TimelineNotification/Notification.native";
import { SubstitutionNotificationProps } from "./snowflakes/SubstitutionNotification/SubstitutionNotification.types";
import { SubstitutionNotification } from "./snowflakes/SubstitutionNotification/SubstitutionNotification.native";
import { TeamNotificationProps } from "./snowflakes/TeamNotification/TeamNotification.types";
import { TeamNotification } from "./snowflakes/TeamNotification/TeamNotification.native";
import { MinuteIncidentsEventType, MinuteIncidentsProps, MinuteIncidentsType } from "./MinuteIncidents.types";
import styles from "./MinuteIncidents.native.styles";
import { MINUTE_INCIDENTS_CONTAINER, TIME_LABEL, EXTRA_TIME_LABEL } from "./MinuteIncidents.native.selectors";

function isMinuteValid(minute: MinuteIncidentsProps["minute"] | MinuteIncidentsProps["extraTimeMinute"]): boolean {
  return typeof minute === "number" && minute >= 0;
}

function switchNotificationCardType(incident: MinuteIncidentsType): JSX.Element | null {
  let UIComponent;
  switch (incident.notificationEventType) {
    case MinuteIncidentsEventType.CARD:
      UIComponent = <CardNotification {...(incident.notificationEventProps as CardNotificationProps)} />;
      break;
    case MinuteIncidentsEventType.GOAL:
      UIComponent = <GoalNotification {...(incident.notificationEventProps as GoalNotificationProps)} />;
      break;
    case MinuteIncidentsEventType.SUBSTITUTION:
      UIComponent = (
        <SubstitutionNotification {...(incident.notificationEventProps as SubstitutionNotificationProps)} />
      );
      break;
    case MinuteIncidentsEventType.TEAM:
      UIComponent = <TeamNotification {...(incident.notificationEventProps as TeamNotificationProps)} />;
      break;
    default:
      return null;
  }
  return UIComponent;
}

function createMinuteContainer(
  minute?: MinuteIncidentsProps["minute"],
  extraTimeMinute?: MinuteIncidentsProps["extraTimeMinute"],
): JSX.Element {
  return (
    <View style={styles.minuteContainer}>
      {isMinuteValid(minute) && <Text style={styles.timeLabel} {...getTestProps(TIME_LABEL)}>{`${minute}'`}</Text>}
      {isMinuteValid(extraTimeMinute) && (
        <Text style={styles.extraTimeLabel} {...getTestProps(EXTRA_TIME_LABEL)}>{`+${extraTimeMinute}'`}</Text>
      )}
      {isMinuteValid(minute) && <View style={styles.minuteContainerSeparator} />}
    </View>
  );
}

function createSideNotificationRow(
  incident: MinuteIncidentsType,
  isFirstRow: boolean,
  index: number,
  minute?: MinuteIncidentsProps["minute"],
  extraTimeMinute?: MinuteIncidentsProps["extraTimeMinute"],
): JSX.Element {
  const notificationCard = switchNotificationCardType(incident);

  const { side } = incident.notificationEventProps as CardNotificationProps;

  const sideNotificationStyle = side === FixtureTeamSide.AWAY ? styles.awayIncident : styles.homeIncident;

  return (
    <View
      style={[sideNotificationStyle, isFirstRow && styles.firstRowNotification]}
      key={`${index}-${incident.notificationEventType}`}
    >
      <View style={styles.sideNotification}>{notificationCard}</View>
      {createMinuteContainer(minute, extraTimeMinute)}
      <View style={styles.symmetricClone}>{notificationCard}</View>
    </View>
  );
}

function createMiddleNotificationRow(incident: MinuteIncidentsType, isFirstRow: boolean, index: number): JSX.Element {
  return (
    <View
      style={[styles.notificationIncident, isFirstRow && styles.firstRowNotification]}
      key={`${index}-${incident.notificationEventType}`}
    >
      <View style={styles.symmetricClone}>
        <Notification title={""} description={""} />
      </View>
      <View style={styles.middleNotification}>
        <Notification {...(incident.notificationEventProps as MatchTimelineNotificationProps)} />
      </View>
      <View style={styles.symmetricClone}>
        <Notification title={""} description={""} />
      </View>
    </View>
  );
}

function isIncidentMiddleNotification(incident: MinuteIncidentsType): boolean {
  return incident.notificationEventType === MinuteIncidentsEventType.NOTIFICATION;
}

export const MinuteIncidents: FunctionComponent<MinuteIncidentsProps> = ({ minute, extraTimeMinute, events }) => (
  <View style={styles.incidentsTimeline} {...getTestProps(MINUTE_INCIDENTS_CONTAINER, false)}>
    {events.map((incident, i) => {
      const isFirstRow = i === 0;
      if (isIncidentMiddleNotification(incident)) {
        return createMiddleNotificationRow(incident, isFirstRow, i);
      }
      if (isFirstRow) {
        return createSideNotificationRow(incident, isFirstRow, i, minute, extraTimeMinute);
      }
      return createSideNotificationRow(incident, isFirstRow, i);
    })}
  </View>
);
