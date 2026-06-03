import type { JSX } from "react";
import { FunctionComponent } from "react";
import classnames from "classnames";
import { FixtureTeamSide } from "@ppb/the-wall-common/types";

import { CardNotificationProps } from "./snowflakes/CardNotification/CardNotification.types";
import { CardNotification } from "./snowflakes/CardNotification/CardNotification.web";
import { GoalNotificationProps } from "./snowflakes/GoalNotification/GoalNotification.types";
import { GoalNotification } from "./snowflakes/GoalNotification/GoalNotification.web";
import { MatchTimelineNotificationProps } from "./snowflakes/TimelineNotification/Notification.types";
import { Notification } from "./snowflakes/TimelineNotification/Notification.web";
import { SubstitutionNotificationProps } from "./snowflakes/SubstitutionNotification/SubstitutionNotification.types";
import { SubstitutionNotification } from "./snowflakes/SubstitutionNotification/SubstitutionNotification.web";
import { TeamNotificationProps } from "./snowflakes/TeamNotification/TeamNotification.types";
import { TeamNotification } from "./snowflakes/TeamNotification/TeamNotification.web";
import { MinuteIncidentsEventType, MinuteIncidentsProps, MinuteIncidentsType } from "./MinuteIncidents.types";
import styles from "./MinuteIncidents.web.css";

function switchNotificationCardType(incident: MinuteIncidentsType): JSX.Element {
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
      return <></>;
  }
  return UIComponent;
}

function getMiddleNotification(incident: MinuteIncidentsType): JSX.Element {
  return (
    <div className={styles.middleNotification}>
      <Notification {...(incident.notificationEventProps as MatchTimelineNotificationProps)} />
    </div>
  );
}

function getSideBySideIncidents(
  incident: MinuteIncidentsType,
  middleClassnames: string,
  minute: number,
  extraTimeClass: string,
  extraTimeMinute?: number,
) {
  const cardProps = incident.notificationEventProps as CardNotificationProps;
  let side = FixtureTeamSide.HOME;
  if (cardProps && cardProps.side) {
    ({ side } = cardProps);
  }
  const renderedNotificationCard = switchNotificationCardType(incident);
  let renderNotificationForHome = renderedNotificationCard;
  let renderNotificationForAway = <></>;

  if (side === FixtureTeamSide.AWAY) {
    renderNotificationForHome = <></>;
    renderNotificationForAway = renderedNotificationCard;
  }
  return (
    <>
      <div className={styles.sides}>{renderNotificationForHome}</div>
      <div className={middleClassnames}>
        <span className={classnames(`typography-h158`, styles.minute)}>{`${minute}'`}</span>
        {extraTimeMinute && <span className={extraTimeClass}>{`+${extraTimeMinute}'`}</span>}
      </div>
      <div className={styles.sides}>{renderNotificationForAway}</div>
    </>
  );
}

export const MinuteIncidents: FunctionComponent<MinuteIncidentsProps> = ({ minute, extraTimeMinute, events }) => (
  <div className={styles.footballTimelineMinute}>
    {events.map((incident, index) => {
      const middleClassnames = classnames(styles.middle, {
        [styles.hiddenMiddle]: index !== 0,
      });
      const extraTimeClass = classnames(`typography-h120`, styles.minute, styles.extraTime);
      return (
        <div key={index} className={styles.minuteLine}>
          {incident.notificationEventType === MinuteIncidentsEventType.NOTIFICATION
            ? getMiddleNotification(incident)
            : getSideBySideIncidents(incident, middleClassnames, minute, extraTimeClass, extraTimeMinute)}
        </div>
      );
    })}
  </div>
);
