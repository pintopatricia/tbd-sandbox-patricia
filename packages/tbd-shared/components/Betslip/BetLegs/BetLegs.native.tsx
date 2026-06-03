import { FunctionComponent, useMemo } from "react";
import { View } from "react-native";

import { SelectionsBoard, Text } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { SelectionsBoardTheme } from "@ppb/the-wall-common/types";
import { SystemIconName } from "@ppb/the-wall-icons";

import styles from "./BetLegs.native.styles";
import { BET_LEGS, SELECTION, DESCRIPTION, BET_LEGS_CONTENT } from "./BetLegs.native.selectors";
import { ComponentProps } from "./props";

export const BetLegs: FunctionComponent<ComponentProps> = ({
  legIds,
  title,
  description,
  isWarning,
  onRemove,
  renderLeg,
  hasIcon,
}) => {
  const legIdsLength = legIds.length - 1;

  const icon = useMemo(
    () => (isWarning && hasIcon ? SystemIconName.NOTIFICATION_WARNING : undefined),
    [isWarning, hasIcon],
  );

  if (legIdsLength < 0) {
    return null;
  }

  let theme = SelectionsBoardTheme.Blue;
  let descriptionStyles = styles.description;
  const contentStyle = [styles.betLegsContent, isWarning && styles.betLegsContentWithoutBackground];

  if (isWarning) {
    theme = SelectionsBoardTheme.Yellow;
    descriptionStyles = styles.descriptionWarning;
  }

  return (
    <View {...getTestProps(BET_LEGS, false)}>
      <SelectionsBoard title={title} theme={theme} icon={icon} onRemoveSelection={onRemove}>
        {description && (
          <Text {...getTestProps(DESCRIPTION, true)} style={descriptionStyles}>
            {description}
          </Text>
        )}
        <View style={contentStyle} {...getTestProps(BET_LEGS_CONTENT, false)}>
          {legIds.map((id, index) => (
            <View style={index !== legIdsLength && styles.legContainer} {...getTestProps(SELECTION, false)} key={id}>
              {renderLeg(id)}
            </View>
          ))}
        </View>
      </SelectionsBoard>
    </View>
  );
};
