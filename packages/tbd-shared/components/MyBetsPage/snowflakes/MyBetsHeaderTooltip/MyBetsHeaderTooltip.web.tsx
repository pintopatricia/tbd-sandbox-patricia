import { useCallback, useState } from "react";
import { VerticalPosition } from "@ppb/the-wall-common/types/Tooltip/Tooltip.types";
import { Tooltip } from "@ppb/the-wall-web";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import styles from "./MyBetsHeaderTooltip.web.css";
import { MyBetsHeaderTooltipProps } from "../../types";

type ToolTipProps = MyBetsHeaderTooltipProps & {
  handleTooltipToggle: (isToggleOpen: boolean) => void;
};

const MyBetsHeaderTooltip = ({ title, description, handleTooltipToggle }: ToolTipProps) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const handleTooltip = useCallback(() => {
    const newState = !isTooltipOpen;
    setIsTooltipOpen(newState);
    handleTooltipToggle(newState);
  }, [isTooltipOpen, handleTooltipToggle]);

  return (
    <>
      <button className={styles.iconButton} onClick={handleTooltip}>
        <GenericIcon name={SystemIconName.NOTIFICATION_INFO} color="var(--my-bets-header-icon-right-colour)" />
      </button>
      {isTooltipOpen && (
        <div className={styles.toolTip} data-testid="tooltip">
          <Tooltip
            title={title}
            description={description}
            coachMark={{
              verticalPosition: VerticalPosition.Top,
              horizontalPosition: "calc(100% - 60px)",
            }}
            onCloseClick={handleTooltip}
          />
        </div>
      )}
    </>
  );
};

export default MyBetsHeaderTooltip;
