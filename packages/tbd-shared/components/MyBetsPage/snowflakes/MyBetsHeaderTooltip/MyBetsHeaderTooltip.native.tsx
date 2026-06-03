import { useCallback, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { VerticalPosition } from "@ppb/the-wall-common/types/Tooltip/Tooltip.types";
import { Tooltip } from "@ppb/the-wall-native";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { MyBetsHeaderTooltipProps } from "../../types";
import { INFO_BUTTON } from "./MyBetsHeaderTooltip.native.selectors";
import styles from "./MyBetsHeaderTooltip.native.styles";

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
      <TouchableOpacity {...getTestProps(INFO_BUTTON, false)} style={styles.iconButton} onPress={handleTooltip}>
        <GenericIcon name={SystemIconName.NOTIFICATION_INFO} color={tokens.MyBetsHeaderIconRightColour} />
      </TouchableOpacity>
      {isTooltipOpen && (
        <View style={styles.tooltipContainer}>
          <Tooltip
            title={title}
            description={description}
            coachMark={{
              verticalPosition: VerticalPosition.Top,
              horizontalPosition: "90%",
            }}
            onClosePress={handleTooltip}
          />
        </View>
      )}
    </>
  );
};

export default MyBetsHeaderTooltip;
