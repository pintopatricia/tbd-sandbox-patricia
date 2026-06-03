import { FunctionComponent, useMemo } from "react";
import classnames from "classnames";
import { SelectionsBoardTheme } from "@ppb/the-wall-common/types/Betslip/SelectionsBoard.types";
import { SelectionsBoard } from "@ppb/the-wall-web";
import { SystemIconName } from "@ppb/the-wall-icons";

import styles from "./BetLegs.web.css";
import { ComponentProps } from "./props";

export const BetLegs: FunctionComponent<ComponentProps> = ({
  legIds,
  title,
  description,
  renderLeg,
  isWarning,
  hasIcon,
  onRemove,
}) => {
  const icon = useMemo(
    () => (isWarning && hasIcon ? SystemIconName.NOTIFICATION_WARNING : undefined),
    [isWarning, hasIcon],
  );

  if (!legIds.length) {
    return null;
  }

  const theme = isWarning ? SelectionsBoardTheme.Yellow : SelectionsBoardTheme.Blue;

  const contentStyle = classnames(styles.selections, isWarning && styles.selectionsWithoutBackground);

  return (
    <div className={styles.betLegs}>
      <SelectionsBoard title={title} theme={theme} icon={icon} onRemoveSelection={onRemove}>
        {description && <section className={`${styles.description} typography-h120`}>{description}</section>}
        <div className={contentStyle}>
          {legIds.map((legId) => (
            <div key={legId}>{renderLeg(legId)}</div>
          ))}
        </div>
      </SelectionsBoard>
    </div>
  );
};
