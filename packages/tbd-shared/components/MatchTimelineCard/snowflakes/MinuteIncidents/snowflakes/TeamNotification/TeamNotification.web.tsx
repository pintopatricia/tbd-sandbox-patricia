import { FunctionComponent } from "react";
import classnames from "classnames";
import { FixtureTeamSide } from "@ppb/the-wall-common/types";
import { TeamNotificationProps } from "./TeamNotification.types";
import styles from "./TeamNotification.web.css";

export const TeamNotification: FunctionComponent<TeamNotificationProps> = ({ title, description, side }) => {
  const classNameCard = classnames(`typography-h120`, styles.card, {
    [styles.home]: side === FixtureTeamSide.HOME,
    [styles.away]: side === FixtureTeamSide.AWAY,
  });

  return (
    <div className={classNameCard}>
      <span className={classnames(`typography-h180`, styles.sideTitle)}>{title}</span>
      {description && <span className={classnames("typography-h120", styles.sideDescription)}>{description}</span>}
    </div>
  );
};
