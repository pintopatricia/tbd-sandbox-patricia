import { FunctionComponent } from "react";
import classnames from "classnames";
import { FixtureTeamSide, IncidentIconType } from "@ppb/the-wall-common/types";
import { IncidentIcon } from "@ppb/the-wall-web/components/bricks/IncidentIcon/IncidentIcon";
import { SubstitutionNotificationProps } from "./SubstitutionNotification.types";
import styles from "./SubstitutionNotification.web.css";

export const SubstitutionNotification: FunctionComponent<SubstitutionNotificationProps> = ({
  title,
  playerIn,
  playerOut,
  side,
}) => {
  const classNameCard = classnames(`typography-h120`, styles.card, {
    [styles.home]: side === FixtureTeamSide.HOME,
    [styles.away]: side === FixtureTeamSide.AWAY,
  });

  const classNameTitle = classnames(`typography-h180`, styles.sideTitle);

  const classNameDescription = classnames("typography-h120", styles.sideDescription, {
    [styles.substitution]: side === FixtureTeamSide.HOME,
  });

  return (
    <div className={classNameCard}>
      <span className={classNameTitle}>{title}</span>
      {playerIn && (
        <span className={classNameDescription}>
          <IncidentIcon type={IncidentIconType.SUBSTITUTION_IN}></IncidentIcon>
          <span className={styles.playerName}>{playerIn}</span>
        </span>
      )}
      {playerOut && (
        <span className={classNameDescription}>
          <IncidentIcon type={IncidentIconType.SUBSTITUTION_OUT}></IncidentIcon>
          <span className={styles.playerName}>{playerOut}</span>
        </span>
      )}
    </div>
  );
};
