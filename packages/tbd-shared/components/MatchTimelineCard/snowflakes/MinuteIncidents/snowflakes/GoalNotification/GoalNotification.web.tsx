import { FunctionComponent } from "react";
import classnames from "classnames";
import { FixtureTeamSide } from "@ppb/the-wall-common/types";
import { SportsIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { GoalNotificationProps } from "./GoalNotification.types";
import styles from "./GoalNotification.web.css";

export const GoalNotification: FunctionComponent<GoalNotificationProps> = ({
  title,
  description,
  secondDescription,
  side,
  isOwnGoal,
}) => {
  const classNameCard = classnames(`typography-h120`, styles.card, styles.goal, {
    [styles.home]: side === FixtureTeamSide.HOME,
    [styles.away]: side === FixtureTeamSide.AWAY,
    [styles.ownGoal]: isOwnGoal,
  });
  const classNameGoal = classnames(styles.goalImage, {
    [styles.goalImageAway]: side === FixtureTeamSide.AWAY,
    [styles.goalImageHome]: side === FixtureTeamSide.HOME,
  });
  const iconColor = isOwnGoal
    ? "var(--signposting-indicators-rich-content-icon-negative2)"
    : "var(--signposting-indicators-rich-content-icon-warning2)";

  return (
    <div className={classNameCard}>
      <span className={classNameGoal}>
        <GenericIcon color={iconColor} name={SportsIconName.FOOTBALL} />
      </span>
      <span className={`${styles.text} typography-h180`}>{title}</span>
      {description && <span className={`${styles.text} typography-h120`}>{description}</span>}
      {secondDescription && <span className={`${styles.text} typography-h120`}>{secondDescription}</span>}
    </div>
  );
};
