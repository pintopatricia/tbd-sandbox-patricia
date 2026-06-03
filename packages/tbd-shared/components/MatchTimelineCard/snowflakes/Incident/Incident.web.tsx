import { FunctionComponent } from "react";
import classNames from "classnames";
import { IncidentIcon } from "@ppb/the-wall-web/components/bricks/IncidentIcon/IncidentIcon";
import { IncidentDisplayOrder, IncidentProps } from "./Incident.types";
import styles from "./Incident.web.css";

export const Incident: FunctionComponent<IncidentProps> = ({ icon, minute, minutes, player, displayOrder }) => {
  if (!minutes?.length && minute === undefined) {
    return null;
  }

  const minutesArray = minutes ?? [`${minute}`];
  const minutesString = minutesArray.reduce((acc, min, index) => {
    if (index !== 0) {
      return `${acc}, ${min}'`;
    }

    return `${min}'`;
  }, "");

  const isReversed = [IncidentDisplayOrder.REVERSED, IncidentDisplayOrder.REVERSED_LINES].includes(displayOrder);
  const hasLines = [IncidentDisplayOrder.NORMAL_LINES, IncidentDisplayOrder.REVERSED_LINES].includes(displayOrder);

  const containerClass = classNames(styles.container, {
    [styles.reverse]: isReversed,
  });

  const wrapContainerClass = classNames(styles.wrapContainer, {
    [styles.reverse]: isReversed,
    [styles.lines]: hasLines,
  });

  const playerClass = classNames(styles.player, {
    [styles.lines]: hasLines,
  });

  return (
    <div className={containerClass}>
      {icon && (
        <div className={styles.iconWrapper}>
          <IncidentIcon isHighlighted type={icon} />
        </div>
      )}

      <div className={wrapContainerClass}>
        <span className={styles.minute}>{minutesString}</span>

        {player && <span className={playerClass}>{player}</span>}
      </div>
    </div>
  );
};
